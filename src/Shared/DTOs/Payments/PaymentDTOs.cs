namespace FalconPay.FraudShield.Shared.DTOs.Payments;

public class CheckoutRequest
{
    public decimal Amount { get; set; }
    public string Recipient { get; set; } = string.Empty;
    public string? RecipientName { get; set; }
    public string? Description { get; set; }
    public string PaymentMethod { get; set; } = "card"; // card, mobile-money, bank
}

public class CheckoutResponse
{
    public bool Success { get; set; }
    public string? TransactionId { get; set; }
    public string? Message { get; set; }
}

public class MobileMoneyRequest
{
    public decimal Amount { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Provider { get; set; } = "mpesa"; // mpesa, airtel, etc.
    public string? Description { get; set; }
}

public class MobileMoneyResponse
{
    public bool Success { get; set; }
    public string? TransactionId { get; set; }
    public string? CheckoutRequestId { get; set; }
    public string? Message { get; set; }
}

public class CardChargeRequest
{
    public decimal Amount { get; set; }
    public string CardToken { get; set; } = string.Empty; // Tokenized card
    public string? Description { get; set; }
}

public class CardChargeResponse
{
    public bool Success { get; set; }
    public string? TransactionId { get; set; }
    public string? AuthorizationCode { get; set; }
    public string? Message { get; set; }
}

