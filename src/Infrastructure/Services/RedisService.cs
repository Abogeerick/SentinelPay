using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace FalconPay.FraudShield.Infrastructure.Services;

public interface IRedisService
{
    Task<string?> GetAsync(string key);
    Task SetAsync(string key, string value, TimeSpan? expiry = null);
    Task<bool> DeleteAsync(string key);
    Task<bool> ExistsAsync(string key);
    Task<long> IncrementAsync(string key, TimeSpan? expiry = null);
    IDatabase GetDatabase();
}

public class RedisService : IRedisService, IDisposable
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<RedisService> _logger;

    public RedisService(IConnectionMultiplexer redis, ILogger<RedisService> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    public IDatabase GetDatabase()
    {
        return _redis.GetDatabase();
    }

    public async Task<string?> GetAsync(string key)
    {
        try
        {
            var db = GetDatabase();
            return await db.StringGetAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting key {Key} from Redis", key);
            return null;
        }
    }

    public async Task SetAsync(string key, string value, TimeSpan? expiry = null)
    {
        try
        {
            var db = GetDatabase();
            await db.StringSetAsync(key, value, expiry);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting key {Key} in Redis", key);
        }
    }

    public async Task<bool> DeleteAsync(string key)
    {
        try
        {
            var db = GetDatabase();
            return await db.KeyDeleteAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting key {Key} from Redis", key);
            return false;
        }
    }

    public async Task<bool> ExistsAsync(string key)
    {
        try
        {
            var db = GetDatabase();
            return await db.KeyExistsAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking existence of key {Key} in Redis", key);
            return false;
        }
    }

    public async Task<long> IncrementAsync(string key, TimeSpan? expiry = null)
    {
        try
        {
            var db = GetDatabase();
            var value = await db.StringIncrementAsync(key);
            if (expiry.HasValue)
            {
                await db.KeyExpireAsync(key, expiry);
            }
            return value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error incrementing key {Key} in Redis", key);
            return 0;
        }
    }

    public void Dispose()
    {
        _redis?.Dispose();
    }
}

