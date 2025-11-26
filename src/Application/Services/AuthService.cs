using FalconPay.FraudShield.Application.Interfaces;
using FalconPay.FraudShield.Domain.Entities;
using FalconPay.FraudShield.Infrastructure.Data;
using FalconPay.FraudShield.Infrastructure.Services;
using FalconPay.FraudShield.Shared.DTOs.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FalconPay.FraudShield.Application.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IRedisService _redisService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        ApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService,
        IRedisService redisService,
        ILogger<AuthService> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _redisService = redisService;
        _logger = logger;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, string? ipAddress, string? deviceFingerprint)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Create user with name derived from email if not provided
        var name = request.Name ?? request.Email.Split('@')[0];
        
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Name = name,
            Phone = request.Phone,
            Avatar = $"https://api.dicebear.com/7.x/avataaars/svg?seed={request.Email}",
            LastLoginIp = ipAddress,
            DeviceFingerprint = deviceFingerprint,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        // Create default wallet with initial balance for testing
        var wallet = new Wallet
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Balance = 10000m, // Starting balance for testing
            Currency = "KES",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Wallets.Add(wallet);

        await _context.SaveChangesAsync();

        // Generate tokens
        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Email, deviceFingerprint, new[] { "User" });
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        // Store refresh token in Redis
        await _redisService.SetAsync($"refresh_token:{refreshToken}", user.Id.ToString(), TimeSpan.FromDays(7));

        return new AuthResponse
        {
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = MapToUserDto(user)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, string? ipAddress, string? deviceFingerprint)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

        // Update last login info
        user.LastLoginIp = ipAddress;
        user.DeviceFingerprint = deviceFingerprint ?? request.DeviceId;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Generate tokens
        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Email, deviceFingerprint ?? request.DeviceId, new[] { "User" });
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        // Store refresh token in Redis
        await _redisService.SetAsync($"refresh_token:{refreshToken}", user.Id.ToString(), TimeSpan.FromDays(7));

        return new AuthResponse
        {
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = MapToUserDto(user)
        };
        }
        catch (Npgsql.PostgresException ex)
        {
            _logger.LogError(ex, "Database error during login: {Message}", ex.Message);
            throw new InvalidOperationException($"Database connection error: {ex.Message}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during login: {Message}", ex.Message);
            throw;
        }
    }

    public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var userIdString = await _redisService.GetAsync($"refresh_token:{request.RefreshToken}");
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        // Generate new tokens
        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Email, user.DeviceFingerprint, new[] { "User" });
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        // Delete old refresh token and store new one
        await _redisService.DeleteAsync($"refresh_token:{request.RefreshToken}");
        await _redisService.SetAsync($"refresh_token:{refreshToken}", user.Id.ToString(), TimeSpan.FromDays(7));

        return new AuthResponse
        {
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = MapToUserDto(user)
        };
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id.ToString(),
            Name = user.Name ?? user.Email.Split('@')[0],
            Email = user.Email,
            Avatar = user.Avatar ?? $"https://api.dicebear.com/7.x/avataaars/svg?seed={user.Email}",
            Phone = user.Phone
        };
    }
}
