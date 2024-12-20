import { TIERS } from '../constants/mlmConstants';

export const validateNetworkRequirements = (user) => {
  if (!user) return false;

  const tierRequirements = TIERS[`T${user.currentTier}`].requirements;
  
  return user.directReferrals >= tierRequirements.directReferrals && 
         user.teamSize >= tierRequirements.teamSize;
};

export const validateCommissionLimits = (commission) => {
  if (typeof commission !== 'number' || commission < 0) return false;
  return commission <= MAX_COMMISSION;
};

export const validateUserData = (user) => {
  const requiredFields = ['userId', 'currentTier', 'directReferrals', 'teamSize', 'isActive'];
  return requiredFields.every(field => user.hasOwnProperty(field));
};