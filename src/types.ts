export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Transaction {
  id: string;
  amount: number;
  recipient: string;
  recipientName: string;
  date: string;
  type: 'payment' | 'transfer' | 'income';
  status: 'completed' | 'pending' | 'failed';
}

export interface FraudAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface DeviceFingerprint {
  deviceId: string;
  model: string;
  ip: string;
  risk: 'high' | 'medium' | 'low';
}

export interface RiskScore {
  score: number; // 0-100
  level: 'safe' | 'caution' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export interface AIExplanation {
  explanation: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  loadBalance: () => Promise<void>;
  loadTransactions: () => Promise<void>;
  transfer: (amount: number, recipient: string) => Promise<void>;
}

export interface FraudState {
  alerts: FraudAlert[];
  riskScore: RiskScore | null;
  device: DeviceFingerprint | null;
  explanation: string | null;
  isLoading: boolean;
  loadFraudData: () => Promise<void>;
  explainRisk: () => Promise<void>;
}