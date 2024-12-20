export const calculateCommissionRates = {
  direct: (tier) => {
    const rates = {
      1: 30,
      2: 40,
      3: 50,
      4: 55,
      5: 60,
      6: 65,
      7: 70
    };
    return rates[tier] || rates[1];
  },

  difference: (fromTier, toTier) => {
    const fromRate = calculateCommissionRates.direct(fromTier);
    const toRate = calculateCommissionRates.direct(toTier);
    return Math.max(0, toRate - fromRate);
  },

  level: (level, directReferrals) => {
    const incentives = {
      2: { amount: 3, required: 2 },
      3: { amount: 3, required: 3 },
      4: { amount: 2, required: 4 },
      5: { amount: 2, required: 5 },
      6: { amount: 1, required: 6 },
      7: { amount: 1, required: 7 }
    };
    
    const levelIncentive = incentives[level];
    if (!levelIncentive) return 0;
    
    return directReferrals >= levelIncentive.required ? levelIncentive.amount : 0;
  }
};

export const calculateMetrics = (networkData, transactions) => {
  const totalUsers = networkData.length;
  const activeUsers = networkData.filter(user => user.isActive).length;
  const totalCommissions = transactions.reduce((sum, tx) => sum + tx.totalCommission, 0);
  
  return {
    networkSize: totalUsers,
    activeRate: (activeUsers / totalUsers) * 100,
    avgCommission: totalCommissions / transactions.length,
    retentionRate: 95.6, // Mock value - would need real historical data
    conversionRate: 24.57 // Mock value - would need real sales data
  };
};