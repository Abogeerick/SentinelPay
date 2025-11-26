namespace FalconPay.FraudShield.Shared.DTOs.Wallet;

public class WalletDto
{
    public Guid Id { get; set; }
    public decimal Balance { get; set; }
    public string Currency { get; set; } = "KES";
}

public class BalanceResponse
{
    public decimal Balance { get; set; }
    public string Currency { get; set; } = "KES";
}

public class TransactionDto
{
    public string Id { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Recipient { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // payment, transfer, income
    public string Status { get; set; } = string.Empty; // completed, pending, failed
}

public class DepositRequest
{
    public decimal Amount { get; set; }
    public string? Description { get; set; }
}

public class WithdrawRequest
{
    public decimal Amount { get; set; }
    public string? Description { get; set; }
}

public class TransferRequest
{
    public decimal Amount { get; set; }
    public string Recipient { get; set; } = string.Empty;
    public string? RecipientName { get; set; }
    public string? Description { get; set; }
}

public class TransferResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
}

