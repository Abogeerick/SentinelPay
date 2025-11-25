using FalconPay.FraudShield.Shared.DTOs.Auth;

namespace FalconPay.FraudShield.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, string? ipAddress, string? deviceFingerprint);
    Task<AuthResponse> LoginAsync(LoginRequest request, string? ipAddress, string? deviceFingerprint);
    Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request);
}

