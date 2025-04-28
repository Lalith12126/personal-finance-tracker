import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyTotal } from '../../types';
import { formatMonth } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/colorUtils';

interface SpendingTrendsProps {
  monthlyTotals: MonthlyTotal[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-neutral-200">
        <p className="font-medium">{formatMonth(label)}</p>
        <p className="text-primary-600 font-bold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function SpendingTrends({ monthlyTotals }: SpendingTrendsProps) {
  if (monthlyTotals.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-neutral-500">No data available</p>
      </div>
    );
  }

  // Format data for the chart
  const data = monthlyTotals.map((item) => ({
    date: item.date,
    amount: item.amount,
    formattedDate: formatMonth(item.date),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatMonth} 
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <YAxis 
          tickFormatter={(value) => formatCurrency(value)} 
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#00d7d2"
          strokeWidth={3}
          dot={{ r: 5, fill: "#00d7d2", strokeWidth: 0 }}
          activeDot={{ r: 8, fill: "#00d7d2", strokeWidth: 0 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}