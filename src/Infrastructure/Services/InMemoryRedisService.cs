using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace FalconPay.FraudShield.Infrastructure.Services;

/// <summary>
/// In-memory fallback for Redis when Redis is not available
/// </summary>
public class InMemoryRedisService : IRedisService
{
    private readonly ConcurrentDictionary<string, (string Value, DateTime? Expiry)> _cache = new();
    private readonly ILogger<InMemoryRedisService> _logger;

    public InMemoryRedisService(ILogger<InMemoryRedisService> logger)
    {
        _logger = logger;
        _logger.LogWarning("Using in-memory Redis fallback. Data will not persist across restarts.");
    }

    public IDatabase GetDatabase()
    {
        throw new NotSupportedException("In-memory Redis does not support IDatabase");
    }

    public Task<string?> GetAsync(string key)
    {
        if (_cache.TryGetValue(key, out var entry))
        {
            if (entry.Expiry.HasValue && entry.Expiry.Value < DateTime.UtcNow)
            {
                _cache.TryRemove(key, out _);
                return Task.FromResult<string?>(null);
            }
            return Task.FromResult<string?>(entry.Value);
        }
        return Task.FromResult<string?>(null);
    }

    public Task SetAsync(string key, string value, TimeSpan? expiry = null)
    {
        var expiryTime = expiry.HasValue ? DateTime.UtcNow.Add(expiry.Value) : (DateTime?)null;
        _cache[key] = (value, expiryTime);
        return Task.CompletedTask;
    }

    public Task<bool> DeleteAsync(string key)
    {
        return Task.FromResult(_cache.TryRemove(key, out _));
    }

    public Task<bool> ExistsAsync(string key)
    {
        if (_cache.TryGetValue(key, out var entry))
        {
            if (entry.Expiry.HasValue && entry.Expiry.Value < DateTime.UtcNow)
            {
                _cache.TryRemove(key, out _);
                return Task.FromResult(false);
            }
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public Task<long> IncrementAsync(string key, TimeSpan? expiry = null)
    {
        var expiryTime = expiry.HasValue ? DateTime.UtcNow.Add(expiry.Value) : (DateTime?)null;
        
        _cache.AddOrUpdate(key, 
            _ => ("1", expiryTime),
            (_, existing) =>
            {
                if (long.TryParse(existing.Value, out var current))
                {
                    return ((current + 1).ToString(), expiryTime ?? existing.Expiry);
                }
                return ("1", expiryTime);
            });

        if (_cache.TryGetValue(key, out var entry) && long.TryParse(entry.Value, out var result))
        {
            return Task.FromResult(result);
        }
        return Task.FromResult(1L);
    }
}

