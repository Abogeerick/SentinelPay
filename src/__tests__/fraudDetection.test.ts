import { describe, it, expect, beforeEach } from 'vitest';

// Mock fraud detection rules for testing
interface Transaction {
    id: string;
    userId: string;
    amount: number;
    ipAddress?: string;
    deviceId?: string;
    createdAt: Date;
    metadata?: Record<string, any>;
}

interface User {
    id: string;
    email: string;
    createdAt: Date;
    lastLoginIp?: string;
    deviceFingerprint?: string;
}

// Fraud detection thresholds
const HIGH_AMOUNT_THRESHOLD = 50000;
const RAPID_TRANSACTION_COUNT = 5;
const RAPID_TRANSACTION_MINUTES = 10;
const SUSPICIOUS_HOUR_START = 1;
const SUSPICIOUS_HOUR_END = 4;
const NEW_ACCOUNT_DAYS = 7;
const NEW_ACCOUNT_AMOUNT_THRESHOLD = 10000;

// Fraud detection service (frontend simulation for testing)
class FraudDetectionService {
    private recentTransactions: Transaction[] = [];

    setRecentTransactions(transactions: Transaction[]) {
        this.recentTransactions = transactions;
    }

    calculateRiskScore(transaction: Transaction, user: User): {
        score: number;
        triggeredRules: string[];
    } {
        let riskScore = 0;
        const triggeredRules: string[] = [];

        // Rule 1: High Amount Spike
        if (transaction.amount >= HIGH_AMOUNT_THRESHOLD) {
            riskScore += 25;
            triggeredRules.push('high_amount_spike');
        }

        // Rule 2: Rapid Multiple Transactions
        const recentCount = this.recentTransactions.filter(
            (t) =>
                t.userId === user.id &&
                new Date(t.createdAt).getTime() >
                Date.now() - RAPID_TRANSACTION_MINUTES * 60 * 1000
        ).length;

        if (recentCount >= RAPID_TRANSACTION_COUNT) {
            riskScore += 20;
            triggeredRules.push('rapid_transactions');
        }

        // Rule 3: IP Location Change
        if (
            transaction.ipAddress &&
            user.lastLoginIp &&
            transaction.ipAddress !== user.lastLoginIp
        ) {
            riskScore += 15;
            triggeredRules.push('ip_change');
        }

        // Rule 4: Device ID Mismatch
        if (
            transaction.deviceId &&
            user.deviceFingerprint &&
            transaction.deviceId !== user.deviceFingerprint
        ) {
            riskScore += 20;
            triggeredRules.push('device_mismatch');
        }

        // Rule 5: Suspicious Hours (1am - 4am)
        const currentHour = new Date().getHours();
        if (
            currentHour >= SUSPICIOUS_HOUR_START &&
            currentHour <= SUSPICIOUS_HOUR_END
        ) {
            riskScore += 10;
            triggeredRules.push('suspicious_hours');
        }

        // Rule 6: New Account + Large Transaction
        const accountAgeMs = Date.now() - new Date(user.createdAt).getTime();
        const accountAgeDays = accountAgeMs / (1000 * 60 * 60 * 24);
        if (
            accountAgeDays <= NEW_ACCOUNT_DAYS &&
            transaction.amount >= NEW_ACCOUNT_AMOUNT_THRESHOLD
        ) {
            riskScore += 25;
            triggeredRules.push('new_account_large_transaction');
        }

        // Rule 7: First-time large transfer
        if (
            transaction.metadata?.recipient &&
            transaction.amount > 5000 &&
            this.recentTransactions.length === 0
        ) {
            riskScore += 10;
            triggeredRules.push('first_time_large_transfer');
        }

        return {
            score: Math.min(100, Math.max(0, riskScore)),
            triggeredRules,
        };
    }

    getRiskLevel(score: number): 'safe' | 'caution' | 'review' | 'block' {
        if (score >= 71) return 'block';
        if (score >= 51) return 'review';
        if (score >= 31) return 'caution';
        return 'safe';
    }
}

describe('FraudDetectionService', () => {
    let fraudService: FraudDetectionService;
    let baseUser: User;
    let baseTransaction: Transaction;

    beforeEach(() => {
        fraudService = new FraudDetectionService();
        baseUser = {
            id: 'user-123',
            email: 'test@example.com',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            lastLoginIp: '192.168.1.1',
            deviceFingerprint: 'device-abc-123',
        };
        baseTransaction = {
            id: 'tx-456',
            userId: 'user-123',
            amount: 100,
            ipAddress: '192.168.1.1',
            deviceId: 'device-abc-123',
            createdAt: new Date(),
        };
    });

    describe('Risk Score Calculation', () => {
        it('should return 0 score for normal transactions', () => {
            const result = fraudService.calculateRiskScore(baseTransaction, baseUser);

            expect(result.score).toBe(0);
            expect(result.triggeredRules).toHaveLength(0);
        });

        it('should add 25 points for high amount transactions (>= $50,000)', () => {
            const highAmountTx = { ...baseTransaction, amount: 50000 };
            const result = fraudService.calculateRiskScore(highAmountTx, baseUser);

            expect(result.score).toBe(25);
            expect(result.triggeredRules).toContain('high_amount_spike');
        });

        it('should add 20 points for rapid transactions', () => {
            // Simulate 5 recent transactions
            const recentTxs = Array.from({ length: 5 }, (_, i) => ({
                ...baseTransaction,
                id: `tx-${i}`,
                createdAt: new Date(Date.now() - i * 60 * 1000), // Last 5 minutes
            }));
            fraudService.setRecentTransactions(recentTxs);

            const result = fraudService.calculateRiskScore(baseTransaction, baseUser);

            expect(result.score).toBe(20);
            expect(result.triggeredRules).toContain('rapid_transactions');
        });

        it('should add 15 points for IP address change', () => {
            const differentIpTx = { ...baseTransaction, ipAddress: '10.0.0.55' };
            const result = fraudService.calculateRiskScore(differentIpTx, baseUser);

            expect(result.score).toBe(15);
            expect(result.triggeredRules).toContain('ip_change');
        });

        it('should add 20 points for device mismatch', () => {
            const differentDeviceTx = { ...baseTransaction, deviceId: 'unknown-device' };
            const result = fraudService.calculateRiskScore(differentDeviceTx, baseUser);

            expect(result.score).toBe(20);
            expect(result.triggeredRules).toContain('device_mismatch');
        });

        it('should add 25 points for new account with large transaction', () => {
            const newUser = {
                ...baseUser,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            };
            const largeTx = { ...baseTransaction, amount: 15000 };

            const result = fraudService.calculateRiskScore(largeTx, newUser);

            expect(result.score).toBe(25);
            expect(result.triggeredRules).toContain('new_account_large_transaction');
        });

        it('should add 10 points for first-time large transfer', () => {
            fraudService.setRecentTransactions([]);
            const transferTx = {
                ...baseTransaction,
                amount: 6000,
                metadata: { recipient: 'other-user' },
            };

            const result = fraudService.calculateRiskScore(transferTx, baseUser);

            expect(result.score).toBe(10);
            expect(result.triggeredRules).toContain('first_time_large_transfer');
        });

        it('should accumulate multiple rule violations', () => {
            // High amount + IP change + device mismatch
            const suspiciousTx = {
                ...baseTransaction,
                amount: 50000,
                ipAddress: '10.0.0.55',
                deviceId: 'unknown-device',
            };

            const result = fraudService.calculateRiskScore(suspiciousTx, baseUser);

            // 25 + 15 + 20 = 60
            expect(result.score).toBe(60);
            expect(result.triggeredRules).toContain('high_amount_spike');
            expect(result.triggeredRules).toContain('ip_change');
            expect(result.triggeredRules).toContain('device_mismatch');
        });

        it('should cap risk score at 100', () => {
            const newUser = {
                ...baseUser,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            };

            // Trigger multiple rules to exceed 100
            const recentTxs = Array.from({ length: 5 }, (_, i) => ({
                ...baseTransaction,
                id: `tx-${i}`,
                createdAt: new Date(Date.now() - i * 60 * 1000),
            }));
            fraudService.setRecentTransactions(recentTxs);

            const extremeTx = {
                ...baseTransaction,
                amount: 50000,
                ipAddress: '10.0.0.55',
                deviceId: 'unknown-device',
                metadata: { recipient: 'other-user' },
            };

            const result = fraudService.calculateRiskScore(extremeTx, newUser);

            expect(result.score).toBeLessThanOrEqual(100);
        });
    });

    describe('Risk Level Classification', () => {
        it('should classify score 0-30 as safe', () => {
            expect(fraudService.getRiskLevel(0)).toBe('safe');
            expect(fraudService.getRiskLevel(15)).toBe('safe');
            expect(fraudService.getRiskLevel(30)).toBe('safe');
        });

        it('should classify score 31-50 as caution', () => {
            expect(fraudService.getRiskLevel(31)).toBe('caution');
            expect(fraudService.getRiskLevel(40)).toBe('caution');
            expect(fraudService.getRiskLevel(50)).toBe('caution');
        });

        it('should classify score 51-70 as review', () => {
            expect(fraudService.getRiskLevel(51)).toBe('review');
            expect(fraudService.getRiskLevel(60)).toBe('review');
            expect(fraudService.getRiskLevel(70)).toBe('review');
        });

        it('should classify score 71-100 as block', () => {
            expect(fraudService.getRiskLevel(71)).toBe('block');
            expect(fraudService.getRiskLevel(85)).toBe('block');
            expect(fraudService.getRiskLevel(100)).toBe('block');
        });
    });

    describe('Edge Cases', () => {
        it('should handle missing IP address gracefully', () => {
            const noIpTx = { ...baseTransaction, ipAddress: undefined };
            const noIpUser = { ...baseUser, lastLoginIp: undefined };

            const result = fraudService.calculateRiskScore(noIpTx, noIpUser);

            expect(result.triggeredRules).not.toContain('ip_change');
        });

        it('should handle missing device fingerprint gracefully', () => {
            const noDeviceTx = { ...baseTransaction, deviceId: undefined };
            const noDeviceUser = { ...baseUser, deviceFingerprint: undefined };

            const result = fraudService.calculateRiskScore(noDeviceTx, noDeviceUser);

            expect(result.triggeredRules).not.toContain('device_mismatch');
        });

        it('should handle zero amount transactions', () => {
            const zeroTx = { ...baseTransaction, amount: 0 };
            const result = fraudService.calculateRiskScore(zeroTx, baseUser);

            expect(result.score).toBe(0);
        });

        it('should handle negative amounts (should not happen but be safe)', () => {
            const negativeTx = { ...baseTransaction, amount: -100 };
            const result = fraudService.calculateRiskScore(negativeTx, baseUser);

            expect(result.score).toBeGreaterThanOrEqual(0);
        });
    });
});
