using FalconPay.FraudShield.Domain.Entities;
using FalconPay.FraudShield.Shared.DTOs.Fraud;

namespace FalconPay.FraudShield.Application.Interfaces;

public interface IFraudService
{
    Task<FraudEvaluationResponse> EvaluateTransactionAsync(Guid transactionId);
    Task<int> CalculateRiskScoreAsync(Transaction transaction, User user);
    Task<List<FraudAlertDto>> GetAlertsAsync(Guid userId);
    Task<RiskScoreDto> GetRiskScoreAsync(Guid userId);
    Task<DeviceFingerprintDto> GetDeviceInfoAsync(Guid userId);
    Task<AIExplanationDto> ExplainRiskAsync(Guid userId);
    Task<FraudStatsDto> GetFraudStatsAsync();
    Task<List<FraudAlertDto>> GetAllAlertsAsync(int limit = 100);
}

