import React, { useState } from 'react';
import SpendingByCategory from '../charts/SpendingByCategory';
import SpendingTrends from '../charts/SpendingTrends';
import { CategoryTotal, MonthlyTotal } from '../../types';

interface ChartContainerProps {
  categoryTotals: CategoryTotal[];
  monthlyTotals: MonthlyTotal[];
}

export default function ChartContainer({ categoryTotals, monthlyTotals }: ChartContainerProps) {
  const [activeTab, setActiveTab] = useState<'category' | 'trends'>('category');

  return (
    <div className="bg-white p-6 rounded-xl shadow-card mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neutral-800">Spending Analysis</h2>
        <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'category' 
                ? 'bg-white shadow-sm text-primary-700' 
                : 'text-neutral-600 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('category')}
          >
            By Category
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'trends' 
                ? 'bg-white shadow-sm text-primary-700' 
                : 'text-neutral-600 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
        </div>
      </div>

      <div className="h-80">
        {activeTab === 'category' ? (
          <SpendingByCategory categoryTotals={categoryTotals} />
        ) : (
          <SpendingTrends monthlyTotals={monthlyTotals} />
        )}
      </div>
    </div>
  );
}