import React from 'react';
import { formatCurrency, formatNumber } from '../utils/formatters';

export function MetricsCard({ title, value, subtitle, trend, type = 'currency' }) {
  const formattedValue = type === 'currency' ? formatCurrency(value) : formatNumber(value);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 font-display tracking-wide">{title}</h3>
        {trend && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
            trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl md:text-3xl font-semibold text-gray-900 font-display tracking-tight">
        {formattedValue}
      </p>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-500 tracking-wide">{subtitle}</p>
      )}
    </div>
  );
}