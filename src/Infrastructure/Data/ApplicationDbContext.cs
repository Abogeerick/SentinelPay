using System.Text.Json;
using FalconPay.FraudShield.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FalconPay.FraudShield.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Wallet> Wallets { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<FraudEvent> FraudEvents { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.DeviceFingerprint).HasMaxLength(255);
            entity.Property(e => e.LastLoginIp).HasMaxLength(45);
        });

        // Wallet configuration
        modelBuilder.Entity<Wallet>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                .WithMany(u => u.Wallets)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.Currency }).IsUnique();
            entity.Property(e => e.Balance).HasPrecision(18, 2);
            entity.Property(e => e.Currency).HasMaxLength(3).IsRequired();
        });

        // Transaction configuration
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Wallet)
                .WithMany(w => w.Transactions)
                .HasForeignKey(e => e.WalletId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Type).HasMaxLength(10).IsRequired();
            entity.Property(e => e.Status).HasMaxLength(20).IsRequired();
            entity.Property(e => e.IpAddress).HasMaxLength(45);
            entity.Property(e => e.DeviceId).HasMaxLength(255);
            entity.Property(e => e.RiskScore).HasDefaultValue(0);
            var jsonOptions = new JsonSerializerOptions();
            entity.Property(e => e.Metadata)
                .HasColumnType("jsonb")
                .HasConversion(
                    new ValueConverter<Dictionary<string, object>?, string?>(
                        v => v == null ? null : JsonSerializer.Serialize(v, jsonOptions),
                        v => v == null ? null : JsonSerializer.Deserialize<Dictionary<string, object>>(v!, jsonOptions)));
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.WalletId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.RiskScore);
        });

        // FraudEvent configuration
        modelBuilder.Entity<FraudEvent>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Transaction)
                .WithMany(t => t.FraudEvents)
                .HasForeignKey(e => e.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.RuleTriggered).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Severity).HasMaxLength(20).IsRequired();
            entity.HasIndex(e => e.TransactionId);
            entity.HasIndex(e => e.CreatedAt);
        });
    }
}

