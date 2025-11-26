using FalconPay.FraudShield.Application.Interfaces;
using FalconPay.FraudShield.Domain.Entities;
using FalconPay.FraudShield.Infrastructure.Data;
using FalconPay.FraudShield.Shared.DTOs.Payments;
using FalconPay.FraudShield.Shared.DTOs.Wallet;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FalconPay.FraudShield.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;
    private readonly IFraudService _fraudService;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(
        ApplicationDbContext context,
        IFraudService fraudService,
        ILogger<PaymentService> logger)
    {
        _context = context;
        _fraudService = fraudService;
        _logger = logger;
    }

    public async Task<CheckoutResponse> CheckoutAsync(Guid userId, CheckoutRequest request, string? ipAddress)
    {
        var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null)
        {
            return new CheckoutResponse { Success = false, Message = "Wallet not found" };
        }

        if (wallet.Balance < request.Amount)
        {
            return new CheckoutResponse { Success = false, Message = "Insufficient balance" };
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return new CheckoutResponse { Success = false, Message = "User not found" };
        }

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WalletId = wallet.Id,
            Amount = request.Amount,
            Type = "debit",
            Status = "pending",
            IpAddress = ipAddress,
            DeviceId = user.DeviceFingerprint,
            Metadata = new Dictionary<string, object>
            {
                { "recipient", request.Recipient },
                { "recipientName", request.RecipientName ?? request.Recipient },
                { "description", request.Description ?? "Payment" },
                { "paymentMethod", request.PaymentMethod },
                { "paymentType", "checkout" }
            },
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Calculate risk score
        transaction.RiskScore = await _fraudService.CalculateRiskScoreAsync(transaction, user);

        if (transaction.RiskScore >= 70)
        {
            transaction.Status = "flagged";
        }
        else
        {
            wallet.Balance -= request.Amount;
            wallet.UpdatedAt = DateTime.UtcNow;
            transaction.Status = "success";
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return new CheckoutResponse
        {
            Success = transaction.Status == "success",
            TransactionId = transaction.Id.ToString(),
            Message = transaction.Status == "flagged" ? "Payment flagged for review" : "Payment successful"
        };
    }

    public async Task<List<TransactionDto>> GetPaymentHistoryAsync(Guid userId, int limit = 50)
    {
        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId && t.Type == "debit")
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .ToListAsync();

        return transactions.Select(t => new TransactionDto
        {
            Id = t.Id.ToString(),
            Amount = -t.Amount, // Negative for payments
            Recipient = t.Metadata?.GetValueOrDefault("recipient")?.ToString() ?? "Unknown",
            RecipientName = t.Metadata?.GetValueOrDefault("recipientName")?.ToString() ?? "Unknown",
            Date = t.CreatedAt.ToString("o"),
            Type = "payment",
            Status = t.Status == "success" ? "completed" : t.Status
        }).ToList();
    }

    public async Task<MobileMoneyResponse> MobileMoneyPaymentAsync(Guid userId, MobileMoneyRequest request, string? ipAddress)
    {
        var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null)
        {
            return new MobileMoneyResponse { Success = false, Message = "Wallet not found" };
        }

        if (wallet.Balance < request.Amount)
        {
            return new MobileMoneyResponse { Success = false, Message = "Insufficient balance" };
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return new MobileMoneyResponse { Success = false, Message = "User not found" };
        }

        // Simulate M-Pesa/Mobile Money checkout request ID
        var checkoutRequestId = $"ws_{Guid.NewGuid():N}".Substring(0, 20);

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WalletId = wallet.Id,
            Amount = request.Amount,
            Type = "debit",
            Status = "pending",
            IpAddress = ipAddress,
            DeviceId = user.DeviceFingerprint,
            Metadata = new Dictionary<string, object>
            {
                { "recipient", request.PhoneNumber },
                { "recipientName", $"{request.Provider.ToUpper()} - {request.PhoneNumber}" },
                { "description", request.Description ?? "Mobile Money Payment" },
                { "paymentMethod", "mobile-money" },
                { "provider", request.Provider },
                { "checkoutRequestId", checkoutRequestId }
            },
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Calculate risk score
        transaction.RiskScore = await _fraudService.CalculateRiskScoreAsync(transaction, user);

        if (transaction.RiskScore >= 70)
        {
            transaction.Status = "flagged";
        }
        else
        {
            wallet.Balance -= request.Amount;
            wallet.UpdatedAt = DateTime.UtcNow;
            transaction.Status = "success";
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return new MobileMoneyResponse
        {
            Success = transaction.Status == "success",
            TransactionId = transaction.Id.ToString(),
            CheckoutRequestId = checkoutRequestId,
            Message = transaction.Status == "flagged" ? "Payment flagged for review" : "Mobile money payment successful"
        };
    }

    public async Task<CardChargeResponse> CardChargeAsync(Guid userId, CardChargeRequest request, string? ipAddress)
    {
        var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null)
        {
            return new CardChargeResponse { Success = false, Message = "Wallet not found" };
        }

        if (wallet.Balance < request.Amount)
        {
            return new CardChargeResponse { Success = false, Message = "Insufficient balance" };
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return new CardChargeResponse { Success = false, Message = "User not found" };
        }

        // Simulate card authorization
        var authorizationCode = $"AUTH_{Guid.NewGuid():N}".Substring(0, 12).ToUpper();

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WalletId = wallet.Id,
            Amount = request.Amount,
            Type = "debit",
            Status = "pending",
            IpAddress = ipAddress,
            DeviceId = user.DeviceFingerprint,
            Metadata = new Dictionary<string, object>
            {
                { "recipient", "card_merchant" },
                { "recipientName", "Card Payment" },
                { "description", request.Description ?? "Card Charge" },
                { "paymentMethod", "card" },
                { "cardToken", request.CardToken.Substring(0, Math.Min(8, request.CardToken.Length)) + "****" },
                { "authorizationCode", authorizationCode }
            },
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Calculate risk score
        transaction.RiskScore = await _fraudService.CalculateRiskScoreAsync(transaction, user);

        if (transaction.RiskScore >= 70)
        {
            transaction.Status = "flagged";
        }
        else
        {
            wallet.Balance -= request.Amount;
            wallet.UpdatedAt = DateTime.UtcNow;
            transaction.Status = "success";
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return new CardChargeResponse
        {
            Success = transaction.Status == "success",
            TransactionId = transaction.Id.ToString(),
            AuthorizationCode = authorizationCode,
            Message = transaction.Status == "flagged" ? "Card charge flagged for review" : "Card charge successful"
        };
    }
}

