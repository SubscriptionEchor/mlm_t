import { TIERS, LEVEL_INCENTIVES, MAX_COMMISSION } from '../constants/mlmConstants';

export const calculateTeamSize = (users, userId) => {
  const getDownline = (id) => {
    return users
      .filter(u => u.uplineId === id)
      .reduce((total, user) => total + 1 + getDownline(user.userId), 0);
  };
  
  return getDownline(userId);
};

export const calculateQualifyingTier = (user) => {
  for (let tier = 7; tier >= 1; tier--) {
    const requirements = TIERS[`T${tier}`].requirements;
    if (user.directReferrals >= requirements.directReferrals && 
        user.teamSize >= requirements.teamSize) {
      return tier;
    }
  }
  return 1;
};

export const calculateCommissions = (sponsor, transaction) => {
  let totalCommission = 0;
  const breakdown = [];

  // Direct Commission
  const directCommission = TIERS[`T${sponsor.currentTier}`].commission;
  totalCommission += directCommission;
  breakdown.push({
    type: 'direct',
    amount: directCommission,
    tier: sponsor.currentTier
  });

  // Additional calculations for difference income and level incentives
  // ... (implementation details)

  return {
    totalCommission: Math.min(totalCommission, MAX_COMMISSION),
    breakdown
  };
};