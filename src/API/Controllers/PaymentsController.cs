using System.Security.Claims;
using FalconPay.FraudShield.Application.Interfaces;
using FalconPay.FraudShield.Shared.DTOs.Payments;
using FalconPay.FraudShield.Shared.DTOs.Wallet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FalconPay.FraudShield.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
    {
        _paymentService = paymentService;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    [HttpPost("checkout")]
    public async Task<ActionResult<CheckoutResponse>> Checkout([FromBody] CheckoutRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        if (request.Amount <= 0)
            return BadRequest(new { message = "Amount must be greater than 0" });

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var result = await _paymentService.CheckoutAsync(userId, request, ipAddress);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<ActionResult<List<TransactionDto>>> GetHistory([FromQuery] int limit = 50)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var transactions = await _paymentService.GetPaymentHistoryAsync(userId, limit);
        return Ok(transactions);
    }

    [HttpPost("mobile-money")]
    public async Task<ActionResult<MobileMoneyResponse>> MobileMoneyPayment([FromBody] MobileMoneyRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        if (request.Amount <= 0)
            return BadRequest(new { message = "Amount must be greater than 0" });

        if (string.IsNullOrEmpty(request.PhoneNumber))
            return BadRequest(new { message = "Phone number is required" });

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var result = await _paymentService.MobileMoneyPaymentAsync(userId, request, ipAddress);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("card-charge")]
    public async Task<ActionResult<CardChargeResponse>> CardCharge([FromBody] CardChargeRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        if (request.Amount <= 0)
            return BadRequest(new { message = "Amount must be greater than 0" });

        if (string.IsNullOrEmpty(request.CardToken))
            return BadRequest(new { message = "Card token is required" });

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var result = await _paymentService.CardChargeAsync(userId, request, ipAddress);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }
}

