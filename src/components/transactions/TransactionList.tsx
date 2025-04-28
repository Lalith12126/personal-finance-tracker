import React, { useState, useMemo } from 'react';
import { Transaction, FilterType } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/colorUtils';
import { Edit, Trash2, Search, Filter } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  categories: string[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onFilterChange: (filter: FilterType) => void;
  currentFilter: FilterType;
}

export default function TransactionList({
  transactions,
  categories,
  onEdit,
  onDelete,
  onFilterChange,
  currentFilter,
}: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        // Apply search query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            transaction.description.toLowerCase().includes(query) ||
            transaction.category.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortField === 'date') {
          return sortDirection === 'asc'
            ? a.date.localeCompare(b.date)
            : b.date.localeCompare(a.date);
        } else {
          return sortDirection === 'asc'
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
      });
  }, [transactions, searchQuery, sortField, sortDirection]);

  const handleSort = (field: 'date' | 'amount') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...currentFilter,
      [name]: value === '' ? null : value,
    });
  };

  const resetFilters = () => {
    onFilterChange({
      startDate: null,
      endDate: null,
      category: null,
    });
    setSearchQuery('');
  };

  const getSortIndicator = (field: 'date' | 'amount') => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-neutral-800">Recent Transactions</h2>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="pl-9 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={currentFilter.startDate || ''}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={currentFilter.endDate || ''}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={currentFilter.category || ''}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-primary-600 hover:text-primary-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-neutral-500">No transactions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 hover:text-neutral-800"
                  >
                    Date {getSortIndicator('date')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center gap-1 hover:text-neutral-800"
                  >
                    Amount {getSortIndicator('amount')}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-900">
                    {transaction.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded-md">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="text-secondary-600 hover:text-secondary-800 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this transaction?')) {
                            onDelete(transaction.id);
                          }
                        }}
                        className="text-error-600 hover:text-error-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}