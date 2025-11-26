using FalconPay.FraudShield.Application.Interfaces;
using FalconPay.FraudShield.Infrastructure.Data;
using FalconPay.FraudShield.Shared.DTOs.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FalconPay.FraudShield.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // In production, add [Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IFraudService _fraudService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        ApplicationDbContext context,
        IFraudService fraudService,
        ILogger<AdminController> logger)
    {
        _context = context;
        _fraudService = fraudService;
        _logger = logger;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<AdminUserDto>>> GetUsers([FromQuery] int limit = 50)
    {
        var users = await _context.Users
            .Include(u => u.Wallets)
            .Include(u => u.Transactions)
            .OrderByDescending(u => u.CreatedAt)
            .Take(limit)
            .Select(u => new AdminUserDto
            {
                Id = u.Id,
                Email = u.Email,
                Phone = u.Phone,
                CreatedAt = u.CreatedAt,
                LastLoginIp = u.LastLoginIp,
                TransactionCount = u.Transactions.Count,
                TotalBalance = u.Wallets.Sum(w => w.Balance)
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<List<AdminTransactionDto>>> GetTransactions([FromQuery] int limit = 100)
    {
        var transactions = await _context.Transactions
            .Include(t => t.User)
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .Select(t => new AdminTransactionDto
            {
                Id = t.Id,
                UserId = t.UserId,
                UserEmail = t.User.Email,
                Amount = t.Amount,
                Type = t.Type,
                Status = t.Status,
                RiskScore = t.RiskScore,
                IpAddress = t.IpAddress,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpGet("fraud-summary")]
    public async Task<ActionResult<AdminFraudSummaryDto>> GetFraudSummary()
    {
        var totalTransactions = await _context.Transactions.CountAsync();
        var flaggedTransactions = await _context.Transactions.CountAsync(t => t.Status == "flagged");
        var successfulTransactions = await _context.Transactions.CountAsync(t => t.Status == "success");
        var failedTransactions = await _context.Transactions.CountAsync(t => t.Status == "failed");

        var totalVolume = await _context.Transactions.SumAsync(t => t.Amount);
        var flaggedVolume = await _context.Transactions
            .Where(t => t.Status == "flagged")
            .SumAsync(t => t.Amount);

        var totalUsers = await _context.Users.CountAsync();
        var activeUsersToday = await _context.Transactions
            .Where(t => t.CreatedAt >= DateTime.UtcNow.Date)
            .Select(t => t.UserId)
            .Distinct()
            .CountAsync();

        // Risk distribution
        var riskDistribution = await _context.Transactions
            .Where(t => t.CreatedAt >= DateTime.UtcNow.AddDays(-30))
            .GroupBy(t => t.RiskScore / 20) // Groups: 0-19, 20-39, 40-59, 60-79, 80-100
            .Select(g => new { Range = g.Key, Count = g.Count() })
            .ToListAsync();

        var distribution = new List<RiskDistributionDto>
        {
            new() { Range = "0-20", Count = riskDistribution.FirstOrDefault(r => r.Range == 0)?.Count ?? 0 },
            new() { Range = "21-40", Count = riskDistribution.FirstOrDefault(r => r.Range == 1)?.Count ?? 0 },
            new() { Range = "41-60", Count = riskDistribution.FirstOrDefault(r => r.Range == 2)?.Count ?? 0 },
            new() { Range = "61-80", Count = riskDistribution.FirstOrDefault(r => r.Range == 3)?.Count ?? 0 },
            new() { Range = "81-100", Count = riskDistribution.FirstOrDefault(r => r.Range >= 4)?.Count ?? 0 }
        };

        return Ok(new AdminFraudSummaryDto
        {
            TotalTransactions = totalTransactions,
            FlaggedTransactions = flaggedTransactions,
            SuccessfulTransactions = successfulTransactions,
            FailedTransactions = failedTransactions,
            TotalVolume = totalVolume,
            FlaggedVolume = flaggedVolume,
            TotalUsers = totalUsers,
            ActiveUsersToday = activeUsersToday,
            RiskDistribution = distribution
        });
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        var totalBalance = await _context.Wallets.SumAsync(w => w.Balance);
        var totalTransactions = await _context.Transactions.CountAsync();
        var pendingTransactions = await _context.Transactions.CountAsync(t => t.Status == "pending");
        var flaggedTransactions = await _context.Transactions.CountAsync(t => t.Status == "flagged");
        var activeAlerts = await _context.FraudEvents
            .Include(fe => fe.Transaction)
            .CountAsync(fe => fe.Transaction.Status == "flagged");

        var avgRiskScore = await _context.Transactions
            .Where(t => t.CreatedAt >= DateTime.UtcNow.AddDays(-7))
            .AverageAsync(t => (int?)t.RiskScore) ?? 0;

        return Ok(new DashboardStatsDto
        {
            TotalBalance = totalBalance,
            TotalTransactions = totalTransactions,
            PendingTransactions = pendingTransactions,
            FlaggedTransactions = flaggedTransactions,
            ActiveAlerts = activeAlerts,
            RiskScore = (int)avgRiskScore
        });
    }
}

