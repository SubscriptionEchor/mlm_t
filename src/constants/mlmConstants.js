export const TIERS = {
  T1: { commission: 30, requirements: { directReferrals: 0, teamSize: 0 } },
  T2: { commission: 40, requirements: { directReferrals: 3, teamSize: 0 } },
  T3: { commission: 50, requirements: { directReferrals: 5, teamSize: 20 } },
  T4: { commission: 55, requirements: { directReferrals: 8, teamSize: 75 } },
  T5: { commission: 60, requirements: { directReferrals: 12, teamSize: 225 } },
  T6: { commission: 65, requirements: { directReferrals: 16, teamSize: 700 } },
  T7: { commission: 70, requirements: { directReferrals: 20, teamSize: 1500 } }
};

export const LEVEL_INCENTIVES = {
  L2: { amount: 3, requiredReferrals: 2 },
  L3: { amount: 3, requiredReferrals: 3 },
  L4: { amount: 2, requiredReferrals: 4 },
  L5: { amount: 2, requiredReferrals: 5 },
  L6: { amount: 1, requiredReferrals: 6 },
  L7: { amount: 1, requiredReferrals: 7 }
};

export const MAX_COMMISSION = 82;
export const SUBSCRIPTION_PRICE = 130;