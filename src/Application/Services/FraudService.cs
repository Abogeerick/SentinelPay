using FalconPay.FraudShield.Application.Interfaces;
using FalconPay.FraudShield.Domain.Entities;
using FalconPay.FraudShield.Infrastructure.Data;
using FalconPay.FraudShield.Infrastructure.Services;
using FalconPay.FraudShield.Shared.DTOs.Fraud;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FalconPay.FraudShield.Application.Services;

public class FraudService : IFraudService
{
    private readonly ApplicationDbContext _context;
    private readonly IRedisService _redisService;
    private readonly ILogger<FraudService> _logger;

    // Fraud rule thresholds
    private const decimal HIGH_AMOUNT_THRESHOLD = 50000m; // High amount spike
    private const int RAPID_TRANSACTION_COUNT = 5; // Max transactions in time window
    private const int RAPID_TRANSACTION_MINUTES = 10; // Time window for rapid transactions
    private const int SUSPICIOUS_HOUR_START = 1; // 1 AM
    private const int SUSPICIOUS_HOUR_END = 4; // 4 AM
    private const int NEW_ACCOUNT_DAYS = 7; // Account age threshold
    private const decimal NEW_ACCOUNT_AMOUNT_THRESHOLD = 10000m; // Threshold for new accounts

    public FraudService(
        ApplicationDbContext context,
        IRedisService redisService,
        ILogger<FraudService> logger)
    {
        _context = context;
        _redisService = redisService;
        _logger = logger;
    }

    public async Task<int> CalculateRiskScoreAsync(Transaction transaction, User user)
    {
        var riskScore = 0;
        var triggeredRules = new List<string>();

        // Rule 1: High Amount Spike
        if (transaction.Amount >= HIGH_AMOUNT_THRESHOLD)
        {
            riskScore += 25;
            triggeredRules.Add("high_amount_spike");
        }

        // Rule 2: Rapid Multiple Transactions (Velocity Check)
        var recentTransactions = await _context.Transactions
            .Where(t => t.UserId == user.Id && 
                       t.CreatedAt >= DateTime.UtcNow.AddMinutes(-RAPID_TRANSACTION_MINUTES))
            .CountAsync();

        if (recentTransactions >= RAPID_TRANSACTION_COUNT)
        {
            riskScore += 20;
            triggeredRules.Add("rapid_transactions");
        }

        // Rule 3: IP Location Change (if last login IP is different)
        if (!string.IsNullOrEmpty(transaction.IpAddress) && 
            !string.IsNullOrEmpty(user.LastLoginIp) &&
            transaction.IpAddress != user.LastLoginIp)
        {
            riskScore += 15;
            triggeredRules.Add("ip_change");
        }

        // Rule 4: Device ID Mismatch
        if (!string.IsNullOrEmpty(transaction.DeviceId) && 
            !string.IsNullOrEmpty(user.DeviceFingerprint) &&
            transaction.DeviceId != user.DeviceFingerprint)
        {
            riskScore += 20;
            triggeredRules.Add("device_mismatch");
        }

        // Rule 5: Suspicious Hours (1am - 4am)
        var currentHour = DateTime.UtcNow.Hour;
        if (currentHour >= SUSPICIOUS_HOUR_START && currentHour <= SUSPICIOUS_HOUR_END)
        {
            riskScore += 10;
            triggeredRules.Add("suspicious_hours");
        }

        // Rule 6: New Account + Large Transaction
        var accountAge = (DateTime.UtcNow - user.CreatedAt).TotalDays;
        if (accountAge <= NEW_ACCOUNT_DAYS && transaction.Amount >= NEW_ACCOUNT_AMOUNT_THRESHOLD)
        {
            riskScore += 25;
            triggeredRules.Add("new_account_large_transaction");
        }

        // Rule 7: First-time recipient (for transfers)
        if (transaction.Metadata?.ContainsKey("recipient") == true)
        {
            var recipient = transaction.Metadata["recipient"]?.ToString();
            var hasTransferredBefore = await _context.Transactions
                .AnyAsync(t => t.UserId == user.Id && 
                              t.Metadata != null);
            
            // Simplified check - in production, would check recipient history
            if (!hasTransferredBefore && transaction.Amount > 5000)
            {
                riskScore += 10;
                triggeredRules.Add("first_time_large_transfer");
            }
        }

        // Store triggered rules in transaction metadata
        if (transaction.Metadata == null)
        {
            transaction.Metadata = new Dictionary<string, object>();
        }
        transaction.Metadata["triggeredRules"] = triggeredRules;

        // Create fraud events for high-risk transactions
        if (riskScore >= 50)
        {
            foreach (var rule in triggeredRules)
            {
                var fraudEvent = new FraudEvent
                {
                    Id = Guid.NewGuid(),
                    TransactionId = transaction.Id,
                    RuleTriggered = rule,
                    Severity = riskScore >= 70 ? "high" : riskScore >= 50 ? "medium" : "low",
                    Notes = $"Risk score: {riskScore}. Rule triggered: {rule}",
                    CreatedAt = DateTime.UtcNow
                };
                _context.FraudEvents.Add(fraudEvent);
            }
        }

        // Clamp risk score to 0-100
        return Math.Min(100, Math.Max(0, riskScore));
    }

    public async Task<FraudEvaluationResponse> EvaluateTransactionAsync(Guid transactionId)
    {
        var transaction = await _context.Transactions
            .Include(t => t.User)
            .Include(t => t.FraudEvents)
            .FirstOrDefaultAsync(t => t.Id == transactionId);

        if (transaction == null)
        {
            return new FraudEvaluationResponse
            {
                RiskScore = 0,
                IsFlagged = false,
                TriggeredRules = new List<string>(),
                Recommendation = "Transaction not found"
            };
        }

        var triggeredRules = transaction.FraudEvents
            .Select(fe => fe.RuleTriggered)
            .Distinct()
            .ToList();

        return new FraudEvaluationResponse
        {
            RiskScore = transaction.RiskScore,
            IsFlagged = transaction.Status == "flagged",
            TriggeredRules = triggeredRules,
            Recommendation = GetRecommendation(transaction.RiskScore)
        };
    }

    public async Task<List<FraudAlertDto>> GetAlertsAsync(Guid userId)
    {
        var alerts = await _context.FraudEvents
            .Include(fe => fe.Transaction)
            .Where(fe => fe.Transaction.UserId == userId)
            .OrderByDescending(fe => fe.CreatedAt)
            .Take(20)
            .ToListAsync();

        return alerts.Select(a => new FraudAlertDto
        {
            Id = a.Id.ToString(),
            Severity = a.Severity,
            Message = GetAlertMessage(a.RuleTriggered, a.Transaction),
            Timestamp = a.CreatedAt.ToString("o"),
            Resolved = a.Transaction.Status != "flagged"
        }).ToList();
    }

    public async Task<RiskScoreDto> GetRiskScoreAsync(Guid userId)
    {
        var recentTransactions = await _context.Transactions
            .Where(t => t.UserId == userId && t.CreatedAt >= DateTime.UtcNow.AddDays(-30))
            .ToListAsync();

        if (!recentTransactions.Any())
        {
            return new RiskScoreDto
            {
                Score = 0,
                Level = "safe",
                Trend = "stable"
            };
        }

        var avgRiskScore = (int)recentTransactions.Average(t => t.RiskScore);
        
        // Calculate trend
        var olderTransactions = recentTransactions.Where(t => t.CreatedAt < DateTime.UtcNow.AddDays(-15)).ToList();
        var newerTransactions = recentTransactions.Where(t => t.CreatedAt >= DateTime.UtcNow.AddDays(-15)).ToList();

        var trend = "stable";
        if (olderTransactions.Any() && newerTransactions.Any())
        {
            var oldAvg = olderTransactions.Average(t => t.RiskScore);
            var newAvg = newerTransactions.Average(t => t.RiskScore);
            trend = newAvg > oldAvg + 5 ? "up" : newAvg < oldAvg - 5 ? "down" : "stable";
        }

        return new RiskScoreDto
        {
            Score = avgRiskScore,
            Level = avgRiskScore >= 70 ? "critical" : avgRiskScore >= 40 ? "caution" : "safe",
            Trend = trend
        };
    }

    public async Task<DeviceFingerprintDto> GetDeviceInfoAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return new DeviceFingerprintDto
            {
                DeviceId = "unknown",
                Model = "Unknown Device",
                Ip = "0.0.0.0",
                Risk = "low"
            };
        }

        // Calculate device risk based on recent activity
        var recentFlaggedCount = await _context.Transactions
            .CountAsync(t => t.UserId == userId && 
                           t.Status == "flagged" && 
                           t.CreatedAt >= DateTime.UtcNow.AddDays(-30));

        var deviceRisk = recentFlaggedCount >= 3 ? "high" : recentFlaggedCount >= 1 ? "medium" : "low";

        return new DeviceFingerprintDto
        {
            DeviceId = user.DeviceFingerprint ?? "unknown",
            Model = "Windows / Chrome", // Would be parsed from user agent in production
            Ip = user.LastLoginIp ?? "0.0.0.0",
            Risk = deviceRisk
        };
    }

    public async Task<AIExplanationDto> ExplainRiskAsync(Guid userId)
    {
        var riskScore = await GetRiskScoreAsync(userId);
        var alerts = await GetAlertsAsync(userId);
        var unresolvedAlerts = alerts.Where(a => !a.Resolved).ToList();

        var explanation = GenerateAIExplanation(riskScore, unresolvedAlerts);

        return new AIExplanationDto { Explanation = explanation };
    }

    public async Task<FraudStatsDto> GetFraudStatsAsync()
    {
        var totalAlerts = await _context.FraudEvents.CountAsync();
        var highSeverity = await _context.FraudEvents.CountAsync(fe => fe.Severity == "high");
        var mediumSeverity = await _context.FraudEvents.CountAsync(fe => fe.Severity == "medium");
        var lowSeverity = await _context.FraudEvents.CountAsync(fe => fe.Severity == "low");

        var flaggedTransactions = await _context.Transactions.CountAsync(t => t.Status == "flagged");
        var resolvedCount = await _context.FraudEvents
            .Include(fe => fe.Transaction)
            .CountAsync(fe => fe.Transaction.Status != "flagged");

        var avgRiskScore = await _context.Transactions
            .Where(t => t.CreatedAt >= DateTime.UtcNow.AddDays(-30))
            .AverageAsync(t => (decimal?)t.RiskScore) ?? 0;

        return new FraudStatsDto
        {
            TotalAlerts = totalAlerts,
            HighSeverityAlerts = highSeverity,
            MediumSeverityAlerts = mediumSeverity,
            LowSeverityAlerts = lowSeverity,
            ResolvedAlerts = resolvedCount,
            UnresolvedAlerts = totalAlerts - resolvedCount,
            FlaggedTransactions = flaggedTransactions,
            AverageRiskScore = avgRiskScore
        };
    }

    public async Task<List<FraudAlertDto>> GetAllAlertsAsync(int limit = 100)
    {
        var alerts = await _context.FraudEvents
            .Include(fe => fe.Transaction)
            .OrderByDescending(fe => fe.CreatedAt)
            .Take(limit)
            .ToListAsync();

        return alerts.Select(a => new FraudAlertDto
        {
            Id = a.Id.ToString(),
            Severity = a.Severity,
            Message = GetAlertMessage(a.RuleTriggered, a.Transaction),
            Timestamp = a.CreatedAt.ToString("o"),
            Resolved = a.Transaction.Status != "flagged"
        }).ToList();
    }

    private string GetRecommendation(int riskScore)
    {
        return riskScore switch
        {
            >= 70 => "Block transaction and require additional verification",
            >= 50 => "Flag for manual review before processing",
            >= 30 => "Process with enhanced monitoring",
            _ => "Process normally"
        };
    }

    private string GetAlertMessage(string rule, Transaction transaction)
    {
        return rule switch
        {
            "high_amount_spike" => $"Large transaction detected: {transaction.Amount:C}",
            "rapid_transactions" => "Multiple transactions in rapid succession detected",
            "ip_change" => $"Transaction from new IP address: {transaction.IpAddress}",
            "device_mismatch" => "Transaction from unrecognized device",
            "suspicious_hours" => "Transaction during suspicious hours (1am-4am)",
            "new_account_large_transaction" => "New account attempting large transaction",
            "first_time_large_transfer" => "First-time large transfer to new recipient",
            _ => $"Fraud rule triggered: {rule}"
        };
    }

    private string GenerateAIExplanation(RiskScoreDto riskScore, List<FraudAlertDto> unresolvedAlerts)
    {
        if (riskScore.Score < 30 && !unresolvedAlerts.Any())
        {
            return "Your account shows normal activity patterns. No suspicious behavior has been detected in recent transactions. Continue to monitor your account regularly.";
        }

        var explanation = $"Your current risk score is {riskScore.Score}/100 ({riskScore.Level}). ";

        if (riskScore.Trend == "up")
        {
            explanation += "Your risk score has been trending upward recently. ";
        }
        else if (riskScore.Trend == "down")
        {
            explanation += "Your risk score has been improving recently. ";
        }

        if (unresolvedAlerts.Any())
        {
            explanation += $"There are {unresolvedAlerts.Count} unresolved alerts. ";
            
            var highAlerts = unresolvedAlerts.Where(a => a.Severity == "high").ToList();
            if (highAlerts.Any())
            {
                explanation += $"High-priority issues: {string.Join(", ", highAlerts.Select(a => a.Message))}. ";
            }
        }

        explanation += "Please review your recent activity and verify any unfamiliar transactions.";

        return explanation;
    }
}

