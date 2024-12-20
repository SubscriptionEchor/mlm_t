import React from 'react';

export function TransactionModal({ transaction, onClose }) {
  if (!transaction) return null;

  const getCommissionTypeDescription = (comm) => {
    switch (comm.type) {
      case 'direct':
        return `Direct Commission (Tier ${comm.tier})`;
      case 'difference':
        return `Difference Income (T${comm.fromTier} → T${comm.toTier})`;
      case 'level':
        return `Level ${comm.level} Incentive`;
      default:
        return comm.type;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Transaction Details: {transaction.id}
          </h3>
        </div>
        
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Sponsor</p>
              <p className="font-medium">{transaction.sponsorId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Commission</p>
              <p className="font-medium text-green-600">
                ${transaction.totalCommission.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">Commission Breakdown</h4>
            <div className="space-y-3">
              {transaction.commissionsBreakdown?.map((comm, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">
                    {getCommissionTypeDescription(comm)}
                  </span>
                  <span className="font-medium">${comm.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}