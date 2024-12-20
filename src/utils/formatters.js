export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

export const getTierRequirements = (tier) => {
  const requirements = {
    1: { directReferrals: 0, teamSize: 0 },
    2: { directReferrals: 3, teamSize: 0 },
    3: { directReferrals: 5, teamSize: 20 },
    4: { directReferrals: 8, teamSize: 75 },
    5: { directReferrals: 12, teamSize: 225 },
    6: { directReferrals: 16, teamSize: 700 },
    7: { directReferrals: 20, teamSize: 1500 }
  };
  return requirements[tier] || requirements[1];
};