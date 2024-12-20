export interface User {
  userId: string;
  uplineId: string | null;
  currentTier: number;
  directReferrals: number;
  teamSize: number;
  isActive: boolean;
  networkPath: string[];
}

export interface Transaction {
  id: string;
  sponsorId: string;
  directCommission: number;
  differenceIncome: number;
  levelIncentives: number;
  totalCommission: number;
  timestamp: Date;
  commissionsBreakdown?: CommissionBreakdown[];
}

export interface CommissionBreakdown {
  userId: string;
  type: 'direct' | 'difference' | 'level';
  amount: number;
  tier?: number;
  fromTier?: number;
  toTier?: number;
  level?: number;
}

export interface NetworkMetrics {
  networkSize: number;
  totalRevenue: number;
  totalCommissions: number;
  tierDistribution: {
    T1: number;
    T2: number;
    T3: number;
    T4: number;
    T5: number;
    T6: number;
    T7: number;
  };
}