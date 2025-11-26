using FalconPay.FraudShield.Application.Interfaces;
using FalconPay.FraudShield.Domain.Entities;
using FalconPay.FraudShield.Infrastructure.Data;
using FalconPay.FraudShield.Shared.DTOs.Wallet;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FalconPay.FraudShield.Application.Services;

public class WalletService : IWalletService
{
    private readonly ApplicationDbContext _context;
    private readonly IFraudService _fraudService;
    private readonly ILogger<WalletService> _logger;

    public WalletService(
        ApplicationDbContext context,
        IFraudService fraudService,
        ILogger<WalletService> logger)
    {
        _context = context;
        _fraudService = fraudService;
        _logger = logger;
    }

    public async Task<WalletDto?> GetWalletAsync(Guid userId, string currency = "KES")
    {
        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Currency == currency);

        if (wallet == null) return null;

        return new WalletDto
        {
            Id = wallet.Id,
            Balance = wallet.Balance,
            Currency = wallet.Currency
        };
    }

    public async Task<BalanceResponse> GetBalanceAsync(Guid userId)
    {
        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId);

        return new BalanceResponse
        {
            Balance = wallet?.Balance ?? 0,
            Currency = wallet?.Currency ?? "KES"
        };
    }

    public async Task<List<TransactionDto>> GetTransactionsAsync(Guid userId, int limit = 50)
    {
        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .ToListAsync();

        return transactions.Select(t => new TransactionDto
        {
            Id = t.Id.ToString(),
            Amount = t.Type == "debit" ? -t.Amount : t.Amount,
            Recipient = t.Metadata?.GetValueOrDefault("recipient")?.ToString() ?? "Unknown",
            RecipientName = t.Metadata?.GetValueOrDefault("recipientName")?.ToString() ?? "Unknown",
            Date = t.CreatedAt.ToString("o"),
            Type = MapTransactionType(t.Type, t.Metadata),
            Status = t.Status
        }).ToList();
    }

    public async Task<TransferResponse> DepositAsync(Guid userId, DepositRequest request, string? ipAddress)
    {
        var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null)
        {
            return new TransferResponse { Success = false, Message = "Wallet not found" };
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return new TransferResponse { Success = false, Message = "User not found" };
        }

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WalletId = wallet.Id,
            Amount = request.Amount,
            Type = "credit",
            Status = "pending",
            IpAddress = ipAddress,
            DeviceId = user.DeviceFingerprint,
            Metadata = new Dictionary<string, object>
            {
                { "recipient", "self" },
                { "recipientName", "Deposit" },
                { "description", request.Description ?? "Wallet Deposit" }
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
            wallet.Balance += request.Amount;
            wallet.UpdatedAt = DateTime.UtcNow;
            transaction.Status = "success";
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return new TransferResponse
        {
            Success = transaction.Status == "success",
            Message = transaction.Status == "flagged" ? "Transaction flagged for review" : "Deposit successful",
            TransactionId = transaction.Id.ToString()
        };
    }

    public async Task<TransferResponse> WithdrawAsync(Guid userId, WithdrawRequest request, string? ipAddress)
    {
        var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null)
        {
            return new TransferResponse { Success = false, Message = "Wallet not found" };
        }

        if (wallet.Balance < request.Amount)
        {
            return new TransferResponse { Success = false, Message = "Insufficient balance" };
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return new TransferResponse { Success = false, Message = "User not found" };
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
                { "recipient", "external" },
                { "recipientName", "Withdrawal" },
                { "description", request.Description ?? "Wallet Withdrawal" }
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

        return new TransferResponse
        {
            Success = transaction.Status == "success",
            Message = transaction.Status == "flagged" ? "Transaction flagged for review" : "Withdrawal successful",
            TransactionId = transaction.Id.ToString()
        };
    }

    public async Task<TransferResponse> TransferAsync(Guid userId, TransferRequest request, string? ipAddress)
    {
        var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null)
        {
            return new TransferResponse { Success = false, Message = "Wallet not found" };
        }

        if (wallet.Balance < request.Amount)
        {
            return new TransferResponse { Success = false, Message = "Insufficient balance" };
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return new TransferResponse { Success = false, Message = "User not found" };
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
                { "description", request.Description ?? "Transfer" },
                { "transferType", "transfer" }
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

        return new TransferResponse
        {
            Success = transaction.Status == "success",
            Message = transaction.Status == "flagged" ? "Transaction flagged for review" : "Transfer successful",
            TransactionId = transaction.Id.ToString()
        };
    }

    private string MapTransactionType(string type, Dictionary<string, object>? metadata)
    {
        if (type == "credit") return "income";
        
        var transferType = metadata?.GetValueOrDefault("transferType")?.ToString();
        return transferType == "transfer" ? "transfer" : "payment";
    }
}

