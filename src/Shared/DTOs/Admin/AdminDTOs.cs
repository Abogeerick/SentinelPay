namespace FalconPay.FraudShield.Shared.DTOs.Admin;

public class AdminUserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? LastLoginIp { get; set; }
    public int TransactionCount { get; set; }
    public decimal TotalBalance { get; set; }
}

public class AdminTransactionDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int RiskScore { get; set; }
    public string? IpAddress { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AdminFraudSummaryDto
{
    public int TotalTransactions { get; set; }
    public int FlaggedTransactions { get; set; }
    public int SuccessfulTransactions { get; set; }
    public int FailedTransactions { get; set; }
    public decimal TotalVolume { get; set; }
    public decimal FlaggedVolume { get; set; }
    public int TotalUsers { get; set; }
    public int ActiveUsersToday { get; set; }
    public List<RiskDistributionDto> RiskDistribution { get; set; } = new();
}

public class RiskDistributionDto
{
    public string Range { get; set; } = string.Empty; // "0-20", "21-40", etc.
    public int Count { get; set; }
}

public class DashboardStatsDto
{
    public decimal TotalBalance { get; set; }
    public int TotalTransactions { get; set; }
    public int PendingTransactions { get; set; }
    public int FlaggedTransactions { get; set; }
    public int ActiveAlerts { get; set; }
    public int RiskScore { get; set; }
}

