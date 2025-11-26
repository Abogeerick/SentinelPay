using System.Security.Claims;
using FalconPay.FraudShield.Application.Interfaces;
using FalconPay.FraudShield.Shared.DTOs.Wallet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FalconPay.FraudShield.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WalletController : ControllerBase
{
    private readonly IWalletService _walletService;
    private readonly ILogger<WalletController> _logger;

    public WalletController(IWalletService walletService, ILogger<WalletController> logger)
    {
        _walletService = walletService;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet]
    public async Task<ActionResult<WalletDto>> GetWallet()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var wallet = await _walletService.GetWalletAsync(userId);
        if (wallet == null) return NotFound(new { message = "Wallet not found" });

        return Ok(wallet);
    }

    [HttpGet("balance")]
    public async Task<ActionResult<BalanceResponse>> GetBalance()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var balance = await _walletService.GetBalanceAsync(userId);
        return Ok(balance);
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<List<TransactionDto>>> GetTransactions([FromQuery] int limit = 50)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var transactions = await _walletService.GetTransactionsAsync(userId, limit);
        return Ok(transactions);
    }

    [HttpPost("deposit")]
    public async Task<ActionResult<TransferResponse>> Deposit([FromBody] DepositRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        if (request.Amount <= 0)
            return BadRequest(new { message = "Amount must be greater than 0" });

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var result = await _walletService.DepositAsync(userId, request, ipAddress);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("withdraw")]
    public async Task<ActionResult<TransferResponse>> Withdraw([FromBody] WithdrawRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        if (request.Amount <= 0)
            return BadRequest(new { message = "Amount must be greater than 0" });

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var result = await _walletService.WithdrawAsync(userId, request, ipAddress);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("transfer")]
    public async Task<ActionResult<TransferResponse>> Transfer([FromBody] TransferRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        if (request.Amount <= 0)
            return BadRequest(new { message = "Amount must be greater than 0" });

        if (string.IsNullOrEmpty(request.Recipient))
            return BadRequest(new { message = "Recipient is required" });

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var result = await _walletService.TransferAsync(userId, request, ipAddress);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }
}

