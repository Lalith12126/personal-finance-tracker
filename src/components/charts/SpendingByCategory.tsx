import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryTotal } from '../../types';
import { formatCurrency } from '../../utils/colorUtils';

interface SpendingByCategoryProps {
  categoryTotals: CategoryTotal[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-neutral-200">
        <p className="font-medium">{data.name}</p>
        <p className="text-primary-600 font-bold">{formatCurrency(data.value)}</p>
      </div>
    );
  }
  return null;
};

export default function SpendingByCategory({ categoryTotals }: SpendingByCategoryProps) {
  if (categoryTotals.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-neutral-500">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={categoryTotals}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="75%"
          paddingAngle={2}
          dataKey="value"
          animationDuration={750}
          animationBegin={0}
        >
          {categoryTotals.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color} 
              stroke={entry.color}
              className="transition-opacity hover:opacity-80"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          layout="vertical" 
          align="right" 
          verticalAlign="middle" 
          formatter={(value) => <span className="text-sm text-neutral-700">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}