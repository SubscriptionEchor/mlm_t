import React from 'react';

export function NetworkControls({ onGenerate, onValidate }) {
  const [size, setSize] = React.useState(100); // Default to 100 users
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(size);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm transform transition-all duration-300 hover:shadow-md">
      <div className="p-6 md:p-8">
        <div className="flex flex-col space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight">Network Controls</h2>
          <p className="text-sm text-gray-600">Configure and manage your MLM network structure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="networkSize" className="block text-sm font-medium text-gray-700 mb-2">
                Network Size
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  type="number"
                  id="networkSize"
                  value={size}
                  onChange={(e) => setSize(Math.max(1, Math.min(100000, parseInt(e.target.value) || 0)))}
                  className="block w-full rounded-lg border-gray-300 pl-4 pr-16 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter network size"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-gray-500 text-sm">users</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">Recommended: 100 users for optimal performance</p>
            </div>
          </div>

          <div className="flex flex-col justify-end space-y-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`relative w-full flex items-center justify-center px-6 py-3 text-base font-semibold text-white rounded-lg shadow-sm transform transition-all duration-200 ${
                isGenerating
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:scale-95'
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Generating Network...
                </>
              ) : (
                'Generate Network'
              )}
            </button>

            <button
              onClick={onValidate}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transform transition-all duration-200 hover:shadow-md active:scale-95"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Validate Network
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="font-medium">Network Requirements:</span>
          <div className="flex flex-wrap gap-3">
            <span className="whitespace-nowrap">T1: No req</span>
            <span className="whitespace-nowrap">T2: 3 DR</span>
            <span className="whitespace-nowrap">T3: 5 DR, 20 TS</span>
            <span className="whitespace-nowrap">T4: 8 DR, 75 TS</span>
            <span className="whitespace-nowrap">T5: 12 DR, 225 TS</span>
          </div>
        </div>
      </div>
    </div>
  );
}