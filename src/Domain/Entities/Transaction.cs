namespace FalconPay.FraudShield.Domain.Entities;

public class Transaction
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid WalletId { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty; // credit or debit
    public string Status { get; set; } = "pending"; // pending, success, failed, flagged
    public string? IpAddress { get; set; }
    public string? DeviceId { get; set; }
    public int RiskScore { get; set; } = 0; // 0-100
    public Dictionary<string, object>? Metadata { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = null!;
    public Wallet Wallet { get; set; } = null!;
    public ICollection<FraudEvent> FraudEvents { get; set; } = new List<FraudEvent>();
}

