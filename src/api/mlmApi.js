import { mockUsers, mockTransactions } from './mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mlmApi = {
  async generateNetwork(size = 100) {
    await delay(800);
    return {
      users: mockUsers,
      metrics: {
        networkSize: mockUsers.length,
        totalRevenue: mockUsers.length * 130,
        totalCommissions: mockTransactions.reduce((sum, tx) => sum + tx.totalCommission, 0),
        tierDistribution: mockUsers.reduce((dist, user) => {
          dist[`T${user.currentTier}`] = (dist[`T${user.currentTier}`] || 0) + 1;
          return dist;
        }, {})
      }
    };
  },

  async getTransactions() {
    await delay(500);
    return mockTransactions;
  },

  async getTransactionDetails(id) {
    await delay(300);
    return mockTransactions.find(tx => tx.id === id);
  },

  async validateNetwork() {
    await delay(600);
    return mockUsers.map(user => ({
      userId: user.userId,
      oldTier: user.currentTier,
      newTier: user.currentTier,
      directReferrals: user.directReferrals,
      teamSize: user.teamSize
    }));
  }
};