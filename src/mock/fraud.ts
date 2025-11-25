import { DeviceFingerprint, FraudAlert, RiskScore, AIExplanation } from '../types';

export const mockAlerts: FraudAlert[] = [
  {
    id: 'al_1',
    severity: 'high',
    message: 'Large transaction detected in unusual location (Lagos, NG)',
    timestamp: '2023-10-26T10:00:00Z',
    resolved: false,
  },
  {
    id: 'al_2',
    severity: 'medium',
    message: 'Multiple small payments in rapid succession',
    timestamp: '2023-10-25T16:45:00Z',
    resolved: true,
  },
];

export const mockDevice: DeviceFingerprint = {
  deviceId: "abc123xyz",
  model: "Windows / Chrome 120",
  ip: "197.201.12.44",
  risk: "medium"
};

export const mockRiskScore: RiskScore = {
  score: 65,
  level: 'caution',
  trend: 'up',
};

export const mockExplanation: AIExplanation = {
  explanation: "Recent unusual transactions increased your risk score. Specifically, a login from a new IP address followed by a high-value transfer triggered our anomaly detection protocols. Please verify your recent activity."
};