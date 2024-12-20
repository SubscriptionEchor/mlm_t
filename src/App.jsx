import React from 'react';
import { useMLM } from './hooks/useMLM';
import { useTransactions } from './hooks/useTransactions';
import { MetricsCard } from './components/MetricsCard';
import { NetworkControls } from './components/NetworkControls';
import { NetworkView } from './components/NetworkView';
import { TransactionModal } from './components/TransactionModal';
import { TransactionsTable } from './components/TransactionsTable';
import { TierDistributionChart } from './components/charts/TierDistributionChart';
import { CommissionDistributionChart } from './components/charts/CommissionDistributionChart';
import { LoadingOverlay } from './components/LoadingOverlay';

export default function App() {
  const { 
    isLoading: networkLoading, 
    error: networkError, 
    networkData, 
    metrics, 
    generateNetwork, 
    validateNetwork 
  } = useMLM();

  const {
    transactions,
    selectedTransaction,
    isLoading: transactionsLoading,
    error: transactionsError,
    loadTransactions,
    getTransactionDetails,
    setSelectedTransaction
  } = useTransactions();

  const [activeTab, setActiveTab] = React.useState('network');

  React.useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const isLoading = networkLoading || transactionsLoading;
  const error = networkError || transactionsError;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">MLM Commission System</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {isLoading && <LoadingOverlay />}
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <NetworkControls
            onGenerate={generateNetwork}
            onValidate={validateNetwork}
          />

          {/* Metrics Cards */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <MetricsCard
              title="Total Revenue"
              value={metrics.totalRevenue}
              subtitle="Subscription: $130"
            />
            <MetricsCard
              title="Total Commissions"
              value={metrics.totalCommissions}
              subtitle="Max/Tx: $82"
            />
            <MetricsCard
              title="Network Size"
              value={metrics.networkSize}
              subtitle="Active Members"
            />
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <TierDistributionChart data={metrics.tierDistribution} />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <CommissionDistributionChart data={transactions} />
            </div>
          </div>

          {/* Network/Transactions Tabs */}
          <div className="mt-8 bg-white rounded-xl shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('network')}
                  className={`px-6 py-3 border-b-2 text-sm font-medium ${
                    activeTab === 'network'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Network Structure
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`ml-8 px-6 py-3 border-b-2 text-sm font-medium ${
                    activeTab === 'transactions'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Commission History
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'network' ? (
                <NetworkView networkData={networkData} />
              ) : (
                <TransactionsTable
                  transactions={transactions}
                  onViewDetails={getTransactionDetails}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}