import React from 'react';

export function NetworkView({ networkData }) {
  if (!networkData || networkData.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No network data available. Generate a network to see the structure.</p>
      </div>
    );
  }

  const renderNode = (user, level = 0) => {
    const tierRequirements = getTierRequirements(user.currentTier);
    const statusClass = user.isActive ? 'text-gray-900' : 'text-gray-400';
    
    return (
      <div key={user.userId} className={`py-2 ${level > 0 ? 'ml-6 border-l pl-4 border-gray-200' : ''}`}>
        <div className={`flex items-center justify-between ${statusClass}`}>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{user.userId}</span>
            <span className="text-xs text-gray-500">
              (T{user.currentTier}: {user.directReferrals}/{tierRequirements.directReferrals} DR, 
              {user.teamSize}/{tierRequirements.teamSize} TS)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const buildTree = (users, parentId = null, level = 0) => {
    const children = users.filter(u => u.uplineId === parentId);
    return children.map(user => (
      <React.Fragment key={user.userId}>
        {renderNode(user, level)}
        {buildTree(users, user.userId, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <span>T1: No req</span>
          <span>T2: 3DR</span>
          <span>T3: 5DR,20TS</span>
          <span>T4: 8DR,75TS</span>
          <span>T5: 12DR,225TS</span>
          <span>T6: 16DR,700TS</span>
          <span>T7: 20DR,1500TS</span>
        </div>
      </div>
      <div className="p-6 max-h-[600px] overflow-y-auto font-mono text-sm">
        {buildTree(networkData)}
      </div>
    </div>
  );
}

function getTierRequirements(tier) {
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
}