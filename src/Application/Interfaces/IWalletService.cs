using FalconPay.FraudShield.Shared.DTOs.Wallet;

namespace FalconPay.FraudShield.Application.Interfaces;

public interface IWalletService
{
    Task<WalletDto?> GetWalletAsync(Guid userId, string currency = "KES");
    Task<BalanceResponse> GetBalanceAsync(Guid userId);
    Task<List<TransactionDto>> GetTransactionsAsync(Guid userId, int limit = 50);
    Task<TransferResponse> DepositAsync(Guid userId, DepositRequest request, string? ipAddress);
    Task<TransferResponse> WithdrawAsync(Guid userId, WithdrawRequest request, string? ipAddress);
    Task<TransferResponse> TransferAsync(Guid userId, TransferRequest request, string? ipAddress);
}

