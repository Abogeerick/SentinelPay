using System.Security.Claims;
using FalconPay.FraudShield.Application.Interfaces;
using FalconPay.FraudShield.Shared.DTOs.Fraud;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FalconPay.FraudShield.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FraudController : ControllerBase
{
    private readonly IFraudService _fraudService;
    private readonly ILogger<FraudController> _logger;

    public FraudController(IFraudService fraudService, ILogger<FraudController> logger)
    {
        _fraudService = fraudService;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet("alerts")]
    public async Task<ActionResult<List<FraudAlertDto>>> GetAlerts()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var alerts = await _fraudService.GetAlertsAsync(userId);
        return Ok(alerts);
    }

    [HttpGet("risk-score")]
    public async Task<ActionResult<RiskScoreDto>> GetRiskScore()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var riskScore = await _fraudService.GetRiskScoreAsync(userId);
        return Ok(riskScore);
    }

    [HttpGet("device")]
    public async Task<ActionResult<DeviceFingerprintDto>> GetDevice()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var device = await _fraudService.GetDeviceInfoAsync(userId);
        return Ok(device);
    }

    [HttpPost("explain")]
    public async Task<ActionResult<AIExplanationDto>> ExplainRisk()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var explanation = await _fraudService.ExplainRiskAsync(userId);
        return Ok(explanation);
    }

    [HttpPost("evaluate/{transactionId}")]
    public async Task<ActionResult<FraudEvaluationResponse>> EvaluateTransaction(Guid transactionId)
    {
        var result = await _fraudService.EvaluateTransactionAsync(transactionId);
        return Ok(result);
    }

    [HttpGet("events")]
    public async Task<ActionResult<List<FraudAlertDto>>> GetEvents([FromQuery] int limit = 100)
    {
        var alerts = await _fraudService.GetAllAlertsAsync(limit);
        return Ok(alerts);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<FraudStatsDto>> GetStats()
    {
        var stats = await _fraudService.GetFraudStatsAsync();
        return Ok(stats);
    }
}

