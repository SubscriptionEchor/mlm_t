import { TIERS } from '../constants/mlmConstants';

// Helper functions for generating realistic data
const getTierByDistribution = () => {
  const rand = Math.random();
  if (rand < 0.4) return 1;
  if (rand < 0.7) return 2;
  if (rand < 0.85) return 3;
  if (rand < 0.93) return 4;
  if (rand < 0.97) return 5;
  if (rand < 0.99) return 6;
  return 7;
};

const getDirectReferrals = (tier) => {
  const minReferrals = TIERS[`T${tier}`].requirements.directReferrals;
  return minReferrals + Math.floor(Math.random() * 5);
};

const getTeamSize = (tier) => {
  const minTeamSize = TIERS[`T${tier}`].requirements.teamSize;
  return minTeamSize + Math.floor(Math.random() * minTeamSize * 0.5);
};

// Generate mock users
export const mockUsers = (() => {
  const users = [];
  const size = 100;
  
  // Create root user (always Tier 7)
  users.push({
    userId: "USER_1",
    uplineId: null,
    currentTier: 7,
    directReferrals: 25,
    teamSize: size - 1,
    isActive: true,
    networkPath: ["USER_1"]
  });

  // Generate remaining users
  for (let i = 2; i <= size; i++) {
    const uplineId = `USER_${Math.floor(Math.random() * (i - 1)) + 1}`;
    const tier = getTierByDistribution();
    
    users.push({
      userId: `USER_${i}`,
      uplineId,
      currentTier: tier,
      directReferrals: getDirectReferrals(tier),
      teamSize: getTeamSize(tier),
      isActive: Math.random() > 0.1,
      networkPath: [...users.find(u => u.userId === uplineId).networkPath, `USER_${i}`]
    });
  }

  return users;
})();

// Generate mock transactions
export const mockTransactions = (() => {
  const transactions = [];
  const numTransactions = 20;

  for (let i = 0; i < numTransactions; i++) {
    const sponsorId = mockUsers[Math.floor(Math.random() * mockUsers.length)].userId;
    const sponsor = mockUsers.find(u => u.userId === sponsorId);
    
    const transaction = {
      id: `TX_${Date.now()}_${i}`,
      sponsorId,
      directCommission: TIERS[`T${sponsor.currentTier}`].commission,
      differenceIncome: Math.floor(Math.random() * 20),
      levelIncentives: Math.floor(Math.random() * 15),
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      commissionsBreakdown: []
    };

    transaction.totalCommission = 
      transaction.directCommission + 
      transaction.differenceIncome + 
      transaction.levelIncentives;

    transactions.push(transaction);
  }

  return transactions.sort((a, b) => b.timestamp - a.timestamp);
})();