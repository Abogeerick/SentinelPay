# ADR 003: Fraud Detection Rules Engine

## Status
✅ Accepted

## Date
2024-01-20

## Context

SentinelPay needs a robust fraud detection system that can:
- Analyze transactions in real-time
- Apply multiple fraud detection rules
- Calculate risk scores (0-100)
- Flag suspicious transactions for review
- Be extensible for future rules
- Provide explainable results

## Decision

We will implement a **Rule-Based Fraud Detection Engine** with the following architecture:

### Risk Scoring System

Each rule contributes points to a cumulative risk score (0-100):

| Rule | Points | Trigger Condition |
|------|--------|-------------------|
| High Amount Spike | +25 | Transaction ≥ $50,000 |
| Rapid Transactions | +20 | 5+ transactions in 10 minutes |
| IP Location Change | +15 | Different IP from last login |
| Device Mismatch | +20 | Different device fingerprint |
| Suspicious Hours | +10 | Transactions between 1-4 AM |
| New Account + Large Tx | +25 | Account < 7 days + Tx ≥ $10,000 |
| First-time Large Transfer | +10 | First transfer > $5,000 |

### Risk Level Classification

| Score Range | Level | Action |
|-------------|-------|--------|
| 0-30 | 🟢 Safe | Transaction approved |
| 31-50 | 🟡 Caution | Approved with monitoring |
| 51-70 | 🟠 Flag for Review | Manual review required |
| 71-100 | 🔴 Block | Transaction blocked |

### Implementation Pattern

```csharp
public interface IFraudRule
{
    string RuleName { get; }
    int RiskPoints { get; }
    Task<bool> IsTriggeredAsync(Transaction tx, User user);
}

public class FraudRulesEngine
{
    private readonly IEnumerable<IFraudRule> _rules;
    
    public async Task<FraudResult> EvaluateAsync(Transaction tx, User user)
    {
        var triggeredRules = new List<string>();
        var totalScore = 0;
        
        foreach (var rule in _rules)
        {
            if (await rule.IsTriggeredAsync(tx, user))
            {
                triggeredRules.Add(rule.RuleName);
                totalScore += rule.RiskPoints;
            }
        }
        
        return new FraudResult
        {
            Score = Math.Min(100, totalScore),
            TriggeredRules = triggeredRules,
            Recommendation = GetRecommendation(totalScore)
        };
    }
}
```

### Why Not Machine Learning?

We considered ML-based fraud detection but chose rules for this phase because:

1. **Explainability**: Rules provide clear reasons for decisions (important for compliance)
2. **No Training Data**: New platform lacks historical fraud data
3. **Predictable Behavior**: Easier to test and validate
4. **Interview Demonstration**: Shows understanding of business logic design
5. **Future Ready**: Can add ML layer on top of rules later

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Transaction Request                       │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Fraud Detection Service                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 Rules Engine                         │    │
│  │  ├── HighAmountRule                                 │    │
│  │  ├── VelocityRule                                   │    │
│  │  ├── IPChangeRule                                   │    │
│  │  ├── DeviceMismatchRule                             │    │
│  │  ├── SuspiciousHoursRule                            │    │
│  │  ├── NewAccountRule                                 │    │
│  │  └── FirstTimeTransferRule                          │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│           Risk Score + Triggered Rules                       │
│                                                              │
│  Score: 45/100                                              │
│  Level: Caution                                             │
│  Rules: ["high_amount_spike", "ip_change"]                  │
│  Action: Monitor transaction                                 │
└─────────────────────────────────────────────────────────────┘
```

## Consequences

### Positive
- **Transparency**: Every decision can be explained
- **Configurable**: Thresholds can be adjusted without code changes
- **Testable**: Each rule can be unit tested independently
- **Performant**: Rules execute in milliseconds
- **Auditable**: All triggered rules are logged

### Negative
- **Manual Tuning**: Thresholds need manual adjustment based on data
- **Limited Pattern Recognition**: Won't catch novel fraud patterns
- **False Positives**: May flag legitimate unusual behavior

### Future Enhancements
1. Add ML anomaly detection layer
2. Implement user behavior profiling
3. Add geographic velocity checks
4. Integrate external fraud databases
5. Add real-time learning from feedback

## Testing Strategy

```typescript
describe('FraudDetection', () => {
  it('should flag high amount transactions', async () => {
    const result = await evaluateTransaction({
      amount: 50000,
      userId: 'user-123'
    });
    expect(result.triggeredRules).toContain('high_amount_spike');
    expect(result.score).toBeGreaterThanOrEqual(25);
  });

  it('should flag rapid successive transactions', async () => {
    // Create 5 transactions in 10 minutes
    const result = await evaluateTransaction({ ... });
    expect(result.triggeredRules).toContain('rapid_transactions');
  });
});
```

## References
- [Stripe Radar](https://stripe.com/radar) - Industry fraud detection system
- [PayPal Fraud Protection](https://www.paypal.com/us/webapps/mpp/security/fraud-protection)
