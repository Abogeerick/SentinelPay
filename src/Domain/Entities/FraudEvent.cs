namespace FalconPay.FraudShield.Domain.Entities;

public class FraudEvent
{
    public Guid Id { get; set; }
    public Guid TransactionId { get; set; }
    public string RuleTriggered { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty; // low, medium, high, critical
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Transaction Transaction { get; set; } = null!;
}

