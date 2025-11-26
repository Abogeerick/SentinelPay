# PowerShell script to quickly test the API
# Run this after starting the API with: dotnet run

Write-Host "🧪 Testing FalconPay FraudShield API" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://localhost:5001"
$email = "test@example.com"
$password = "password123"

# Test 1: Register
Write-Host "1️⃣ Testing Registration..." -ForegroundColor Yellow
$registerBody = @{
    email = $email
    password = $password
    phone = "+254712345678"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method Post `
        -Body $registerBody `
        -ContentType "application/json" `
        -SkipCertificateCheck
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "   User ID: $($registerResponse.user.id)" -ForegroundColor Gray
    Write-Host "   Email: $($registerResponse.user.email)" -ForegroundColor Gray
    $accessToken = $registerResponse.accessToken
    Write-Host ""
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    
    # Try login instead (user might already exist)
    Write-Host "🔄 Trying login instead..." -ForegroundColor Yellow
    $loginBody = @{
        email = $email
        password = $password
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
            -Method Post `
            -Body $loginBody `
            -ContentType "application/json" `
            -SkipCertificateCheck
        
        Write-Host "✅ Login successful!" -ForegroundColor Green
        $accessToken = $loginResponse.accessToken
        Write-Host ""
    } catch {
        Write-Host "❌ Login also failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        exit 1
    }
}

# Test 2: Authenticated Endpoint
Write-Host "2️⃣ Testing Authenticated Endpoint..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $testResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/test" `
        -Method Get `
        -Headers $headers `
        -SkipCertificateCheck
    
    Write-Host "✅ Authentication test successful!" -ForegroundColor Green
    Write-Host "   Response: $($testResponse.message)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Authentication test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "✨ All tests completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: Open $baseUrl in your browser to use Swagger UI" -ForegroundColor Yellow


