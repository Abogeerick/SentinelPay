namespace FalconPay.FraudShield.Shared.DTOs.Fraud;

public class FraudAlertDto
{
    public string Id { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty; // high, medium, low
    public string Message { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    public bool Resolved { get; set; }
}

public class RiskScoreDto
{
    public int Score { get; set; } // 0-100
    public string Level { get; set; } = string.Empty; // safe, caution, critical
    public string Trend { get; set; } = string.Empty; // up, down, stable
}

public class DeviceFingerprintDto
{
    public string DeviceId { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Ip { get; set; } = string.Empty;
    public string Risk { get; set; } = string.Empty; // high, medium, low
}

public class AIExplanationDto
{
    public string Explanation { get; set; } = string.Empty;
}

public class FraudEvaluationRequest
{
    public Guid TransactionId { get; set; }
}

public class FraudEvaluationResponse
{
    public int RiskScore { get; set; }
    public bool IsFlagged { get; set; }
    public List<string> TriggeredRules { get; set; } = new();
    public string Recommendation { get; set; } = string.Empty;
}

public class FraudStatsDto
{
    public int TotalAlerts { get; set; }
    public int HighSeverityAlerts { get; set; }
    public int MediumSeverityAlerts { get; set; }
    public int LowSeverityAlerts { get; set; }
    public int ResolvedAlerts { get; set; }
    public int UnresolvedAlerts { get; set; }
    public int FlaggedTransactions { get; set; }
    public decimal AverageRiskScore { get; set; }
}

