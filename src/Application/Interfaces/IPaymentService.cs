using FalconPay.FraudShield.Shared.DTOs.Payments;
using FalconPay.FraudShield.Shared.DTOs.Wallet;

namespace FalconPay.FraudShield.Application.Interfaces;

public interface IPaymentService
{
    Task<CheckoutResponse> CheckoutAsync(Guid userId, CheckoutRequest request, string? ipAddress);
    Task<List<TransactionDto>> GetPaymentHistoryAsync(Guid userId, int limit = 50);
    Task<MobileMoneyResponse> MobileMoneyPaymentAsync(Guid userId, MobileMoneyRequest request, string? ipAddress);
    Task<CardChargeResponse> CardChargeAsync(Guid userId, CardChargeRequest request, string? ipAddress);
}

