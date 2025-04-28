import React from 'react';
import { ArrowDownRight, ArrowUpRight, DollarSign, Calendar, Tag, List } from 'lucide-react';
import { formatCurrency } from '../../utils/colorUtils';

interface DashboardSummaryProps {
  currentMonthTotal: number;
  totalAmount: number;
  transactionCount: number;
  categoryCount: number;
}

export default function DashboardSummary({ 
  currentMonthTotal, 
  totalAmount, 
  transactionCount, 
  categoryCount 
}: DashboardSummaryProps) {
  // Fake percentage change - in a real app, this would be calculated
  const percentChange = 12.5;
  const isIncrease = percentChange > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Current Month Total */}
      <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">This Month</p>
            <h3 className="text-2xl font-bold text-neutral-800">
              {formatCurrency(currentMonthTotal)}
            </h3>
          </div>
          <div className="p-2 rounded-full bg-primary-50 text-primary-600">
            <Calendar size={20} />
          </div>
        </div>
        <div className={`flex items-center mt-4 text-sm ${isIncrease ? 'text-error-600' : 'text-success-600'}`}>
          {isIncrease ? (
            <>
              <ArrowUpRight size={16} className="mr-1" />
              <span>{percentChange}% from last month</span>
            </>
          ) : (
            <>
              <ArrowDownRight size={16} className="mr-1" />
              <span>{Math.abs(percentChange)}% from last month</span>
            </>
          )}
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">Total Expenses</p>
            <h3 className="text-2xl font-bold text-neutral-800">
              {formatCurrency(totalAmount)}
            </h3>
          </div>
          <div className="p-2 rounded-full bg-secondary-50 text-secondary-600">
            <DollarSign size={20} />
          </div>
        </div>
        <div className="mt-4 text-sm text-neutral-500">
          <span>Lifetime spending</span>
        </div>
      </div>

      {/* Transaction Count */}
      <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">Transactions</p>
            <h3 className="text-2xl font-bold text-neutral-800">
              {transactionCount}
            </h3>
          </div>
          <div className="p-2 rounded-full bg-error-50 text-error-600">
            <List size={20} />
          </div>
        </div>
        <div className="mt-4 text-sm text-neutral-500">
          <span>Total records</span>
        </div>
      </div>

      {/* Category Count */}
      <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">Categories</p>
            <h3 className="text-2xl font-bold text-neutral-800">
              {categoryCount}
            </h3>
          </div>
          <div className="p-2 rounded-full bg-warning-50 text-warning-600">
            <Tag size={20} />
          </div>
        </div>
        <div className="mt-4 text-sm text-neutral-500">
          <span>Spending categories</span>
        </div>
      </div>
    </div>
  );
}