

class MLMNetwork {
    constructor() {
        // Define constants first
        this.TIERS = {
            T1: { commission: 30, requirements: { directReferrals: 0, teamSize: 0 } },
            T2: { commission: 40, requirements: { directReferrals: 3, teamSize: 0 } },
            T3: { commission: 50, requirements: { directReferrals: 5, teamSize: 20 } },
            T4: { commission: 55, requirements: { directReferrals: 8, teamSize: 75 } },
            T5: { commission: 60, requirements: { directReferrals: 12, teamSize: 225 } },
            T6: { commission: 65, requirements: { directReferrals: 16, teamSize: 700 } },
            T7: { commission: 70, requirements: { directReferrals: 20, teamSize: 1500 } }
        };
        
        this.LEVEL_INCENTIVES = {
            L2: { amount: 3, requiredReferrals: 2 },
            L3: { amount: 3, requiredReferrals: 3 },
            L4: { amount: 2, requiredReferrals: 4 },
            L5: { amount: 2, requiredReferrals: 5 },
            L6: { amount: 1, requiredReferrals: 6 },
            L7: { amount: 1, requiredReferrals: 7 }
        };

        this.MAX_COMMISSION = 82;
        this.SUBSCRIPTION_PRICE = 130;
        
        // Initialize network state
        this.users = new Map();
        this.transactions = new Map();
        this.totalCommissions = 0;
        this.transactionCount = 0;
        this.lastUserId = 0; // Ensure this starts at 0
    }

    resetNetwork() {
        this.users = new Map();
        this.transactions = new Map();
        this.totalCommissions = 0;
        this.transactionCount = 0;
    
        if (isNaN(this.lastUserId)) {
            console.error('Invalid lastUserId detected during reset. Resetting to 0.');
            this.lastUserId = 0;
        } else {
            this.lastUserId = 0; // Reset to start fresh
        }
    
        return true;
    }

    validateTierQualification(userId) {
        const user = this.users.get(userId);
        if (!user) return false;

        // Get active direct referrals and team size
        const activeDirectReferrals = Array.from(this.users.values())
            .filter(u => u.uplineId === userId && u.isActive).length;
        
        const activeTeamSize = this.calculateActiveTeamSize(userId);
        
        // Update user metrics
        user.directReferrals = activeDirectReferrals;
        user.teamSize = activeTeamSize;

        // Find highest qualifying tier
        for (let tier = 7; tier >= 1; tier--) {
            const requirements = this.TIERS[`T${tier}`].requirements;
            if (activeDirectReferrals >= requirements.directReferrals && 
                activeTeamSize >= requirements.teamSize) {
                if (user.currentTier !== tier) {
                    user.currentTier = tier;
                    return false; // Indicates tier changed
                }
                return true; // Meets current tier requirements
            }
        }
        
        // If no tier requirements met, downgrade to T1
        if (user.currentTier !== 1) {
            user.currentTier = 1;
            return false;
        }
        return true;
    }

    calculateActiveTeamSize(userId) {
        const calculateDownline = (id) => {
            return Array.from(this.users.values())
                .filter(u => u.uplineId === id && u.isActive)
                .reduce((sum, user) => sum + 1 + calculateDownline(user.userId), 0);
        };
        return calculateDownline(userId);
    }

    qualifiesForLevelIncentive(userId, level) {
        const user = this.users.get(userId);
        if (!user || !this.LEVEL_INCENTIVES[`L${level}`]) return false;
        
        return user.directReferrals >= this.LEVEL_INCENTIVES[`L${level}`].requiredReferrals;
    }

    addUser(uplineId = null) {
        const newUserId = `USER_${this.lastUserId + 1}`;
        
        // Validate new user ID
        if (this.users.has(newUserId)) {
            throw new Error(`Duplicate user detected: ${newUserId}`);
        }
    
        // Create the new user
        const user = {
            userId: newUserId,
            uplineId,
            currentTier: 1,
            directReferrals: 0,
            teamSize: 0,
            isActive: true,
            networkPath: uplineId ? [...this.users.get(uplineId).networkPath, newUserId] : [newUserId],
            commissionHistory: []
        };
    
        // Add to users map and increment lastUserId
        this.users.set(newUserId, user);
        this.lastUserId++;

        // Important: Update upline metrics after adding user
        if (uplineId) {
            this.updateUplineMetrics(uplineId);
        }
    
        return user;
    }

    updateUplineMetrics(userId) {
        let currentUser = this.users.get(userId);
        if (!currentUser) return;
    
        // First update direct referrals for immediate upline
        const directReferralCount = Array.from(this.users.values())
            .filter(u => u.uplineId === userId).length;
        currentUser.directReferrals = directReferralCount;
    
        // Then update the entire upline chain
        while (currentUser) {
            // Update team size
            currentUser.teamSize = this.calculateTeamSize(currentUser.userId);
            
            // Update tier based on new metrics
            this.updateTier(currentUser.userId);
            
            // Move up the chain
            currentUser = currentUser.uplineId ? this.users.get(currentUser.uplineId) : null;
        }
    }


    // Improved team size calculation
    calculateTeamSize(userId) {
        const countDownline = (id) => {
            const downlineUsers = Array.from(this.users.values())
                .filter(u => u.uplineId === id);
            
            return downlineUsers.reduce((total, user) => {
                return total + 1 + countDownline(user.userId);
            }, 0);
        };
        
        return countDownline(userId);
    }

    updateTier(userId) {
        const user = this.users.get(userId);
        if (!user) return;
    
        for (let tier = 7; tier >= 1; tier--) {
            const requirements = this.TIERS[`T${tier}`].requirements;  // Changed from MLM_CONSTANTS to this.TIERS
            if (user.directReferrals >= requirements.directReferrals && 
                user.teamSize >= requirements.teamSize) {
                user.currentTier = tier;
                break;
            }
        }
    }

    calculateCommission(sponsorId, subscriptionId) {
        const sponsor = this.users.get(sponsorId);
        if (!sponsor || !sponsor.isActive) {
            throw new Error('Sponsor not found or inactive');
        }

        // Validate qualification before commission
        this.validateTierQualification(sponsorId);

        let transaction = {
            id: subscriptionId,
            sponsorId,
            directCommission: 0,
            differenceIncome: 0,
            levelIncentives: 0,
            commissionsBreakdown: [],
            totalCommission: 0,
            timestamp: Date.now()
        };

        // 1. Direct Commission
        transaction.directCommission = this.TIERS[`T${sponsor.currentTier}`].commission;
        transaction.totalCommission += transaction.directCommission;
        transaction.commissionsBreakdown.push({
            userId: sponsorId,
            type: 'direct',
            amount: transaction.directCommission,
            tier: sponsor.currentTier
        });

        // 2. Process upline commissions
        let currentUserId = sponsorId;
        let level = 1;
        let lastQualifiedTier = sponsor.currentTier;

        while (level <= 7 && transaction.totalCommission < this.MAX_COMMISSION) {
            const currentUser = this.users.get(currentUserId);
            if (!currentUser?.uplineId) break;

            const upline = this.users.get(currentUser.uplineId);
            if (!upline?.isActive) continue;

            // Validate upline's qualification
            this.validateTierQualification(upline.userId);
            level++;

            // Difference Income
            if (upline.currentTier > lastQualifiedTier) {
                const difference = this.TIERS[`T${upline.currentTier}`].commission - 
                                 this.TIERS[`T${lastQualifiedTier}`].commission;
                
                if (difference > 0 && transaction.totalCommission + difference <= this.MAX_COMMISSION) {
                    transaction.differenceIncome += difference;
                    transaction.totalCommission += difference;
                    transaction.commissionsBreakdown.push({
                        userId: upline.userId,
                        type: 'difference',
                        amount: difference,
                        fromTier: lastQualifiedTier,
                        toTier: upline.currentTier
                    });
                    lastQualifiedTier = upline.currentTier;
                }
            }

            // Level Incentives
            if (this.qualifiesForLevelIncentive(upline.userId, level)) {
                const incentive = this.LEVEL_INCENTIVES[`L${level}`].amount;
                if (transaction.totalCommission + incentive <= this.MAX_COMMISSION) {
                    transaction.levelIncentives += incentive;
                    transaction.totalCommission += incentive;
                    transaction.commissionsBreakdown.push({
                        userId: upline.userId,
                        type: 'level',
                        amount: incentive,
                        level
                    });
                }
            }

            currentUserId = upline.userId;
        }

        // Store transaction
        this.transactions.set(subscriptionId, transaction);
        return transaction;
    }

    validateNetwork() {
        const updates = [];
        for (const [userId, user] of this.users) {
            const currentTier = user.currentTier;
            if (!this.validateTierQualification(userId)) {
                updates.push({
                    userId,
                    oldTier: currentTier,
                    newTier: user.currentTier,
                    directReferrals: user.directReferrals,
                    teamSize: user.teamSize
                });
            }
        }
        return updates;
    }

    generateMetrics() {
        // Add sample transactions if none exist
        if (this.transactions.size === 0) {
            this.generateSampleTransactions(10); // Generate 10 sample transactions
        }

        const metrics = {
            networkSize: this.users.size,
            tierDistribution: {
                T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0, T7: 0
            },
            totalRevenue: this.transactions.size * this.SUBSCRIPTION_PRICE,
            totalCommissions: 0,
            commissionTypes: {
                direct: 0,
                difference: 0,
                level: 0
            }
        };

        // Calculate tier distribution
        for (const user of this.users.values()) {
            metrics.tierDistribution[`T${user.currentTier}`]++;
        }

        // Calculate commission totals
        for (const tx of this.transactions.values()) {
            metrics.totalCommissions += tx.totalCommission;
            metrics.commissionTypes.direct += tx.directCommission;
            metrics.commissionTypes.difference += tx.differenceIncome;
            metrics.commissionTypes.level += tx.levelIncentives;
        }

        return metrics;
    }

    resetNetwork() {
        // Clear all maps and counters
        this.users = new Map();
        this.transactions = new Map();
        this.totalCommissions = 0;
        this.transactionCount = 0;
        
        // Reset any cached calculations
        this._lastCalculatedTeamSizes = new Map();
        
        return true; // Indicate successful reset
    }

    generateSampleTransactions(count) {
        const userIds = Array.from(this.users.keys());
        for (let i = 0; i < count; i++) {
            const sponsorId = userIds[Math.floor(Math.random() * userIds.length)];
            const subscriptionId = `SUB_${Date.now()}_${i}`;
            try {
                this.calculateCommission(sponsorId, subscriptionId);
            } catch (error) {
                console.warn(`Sample transaction failed: ${error.message}`);
            }
        }
    }
}

// Worker setup
let mlmNetwork = null;

function initializeNetwork() {
    mlmNetwork = new MLMNetwork();
}

// Initialize when worker starts
initializeNetwork();

self.addEventListener('message', (event) => {
    const { type, data } = event.data;
    try {
        if (!mlmNetwork) {
            initializeNetwork();
        }
        
        switch (type) {
            case 'generateNetwork':
                generateNetwork(data.size);
                break;
            case 'generateTransactions':
                generateTransactions(data.count);
                break;
            case 'validateNetwork':
                const updates = mlmNetwork.validateNetwork();
                self.postMessage({ type: 'validationUpdates', data: updates });
                break; 
            case 'getTransactionDetails':
                const transaction = mlmNetwork.transactions.get(data.transactionId);
                if (transaction) {
                    self.postMessage({
                        type: 'transactionDetails',
                        data: transaction
                    });
                } else {
                    self.postMessage({
                        type: 'error',
                        data: { message: 'Transaction details not found' }
                    });
                }
                break;     
        }
    } catch (error) {
        self.postMessage({ type: 'error', data: { message: error.message } });
    }
});

function generateNetwork(size) {
    try {
        mlmNetwork.resetNetwork();
        let processed = 0;

        // Create root user
        console.debug('Creating root user...');
        const rootUser = mlmNetwork.addUser(null);
        console.debug('Root user created:', rootUser);
        processed = 1;

        self.postMessage({
            type: 'networkProgress',
            data: { processed, total: size }
        });

        // Generate additional users
        while (processed < size) {
            const existingUserIds = Array.from(mlmNetwork.users.keys());
            const randomUplineId = existingUserIds[Math.floor(Math.random() * existingUserIds.length)];

            if (!randomUplineId) {
                console.error('No valid upline found');
                break;
            }

            try {
                const newUser = mlmNetwork.addUser(randomUplineId);
                console.debug(`Added user: ${newUser.userId} under upline: ${randomUplineId}`);
                processed++;

                if (processed % Math.max(Math.floor(size * 0.1), 100) === 0) {
                    self.postMessage({
                        type: 'networkProgress',
                        data: { processed, total: size }
                    });
                }
            } catch (error) {
                console.error(`Error adding user ${processed + 1}:`, error.message);
                break;
            }
        }

        // Generate initial transactions
        const transactions = [];
        const numTransactions = Math.min(size, 20);
        const userIds = Array.from(mlmNetwork.users.keys());

        for (let i = 0; i < numTransactions; i++) {
            const randomSponsorId = userIds[Math.floor(Math.random() * userIds.length)];
            const subscriptionId = `SUB_${Date.now()}_${i}`;
            
            try {
                const transaction = mlmNetwork.calculateCommission(randomSponsorId, subscriptionId);
                transactions.push(transaction);
            } catch (error) {
                console.warn(`Transaction generation failed: ${error.message}`);
            }
        }

        // Send network completion message
        self.postMessage({
            type: 'networkComplete',
            data: {
                metrics: mlmNetwork.generateMetrics(),
                networkView: Array.from(mlmNetwork.users.values())
            }
        });

        // Send transactions separately
        self.postMessage({
            type: 'transactionComplete',
            data: {
                transactions,
                metrics: mlmNetwork.generateMetrics()
            }
        });

    } catch (error) {
        self.postMessage({
            type: 'error',
            data: { message: `Network generation failed: ${error.message}` }
        });
    }
}

function generateTransactions(count) {
    const transactions = [];
    const userIds = Array.from(mlmNetwork.users.keys());

    for (let i = 0; i < count; i++) {
        const sponsorId = userIds[Math.floor(Math.random() * userIds.length)];
        const subscriptionId = `SUB_${Date.now()}_${i}`;

        try {
            const transaction = mlmNetwork.calculateCommission(sponsorId, subscriptionId);
            transactions.push(transaction);
        } catch (error) {
            console.warn(`Transaction failed: ${error.message}`);
        }
    }

    self.postMessage({
        type: 'transactionComplete',
        data: {
            transactions,
            metrics: mlmNetwork.generateMetrics()
        }
    });
}