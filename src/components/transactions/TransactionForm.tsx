import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Transaction } from '../../types';
import { getCurrentDate } from '../../utils/dateUtils';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  existingCategories: string[];
  onCancel?: () => void;
  initialData?: Transaction;
  isEditing?: boolean;
}

export default function TransactionForm({
  onSubmit,
  existingCategories,
  onCancel,
  initialData,
  isEditing = false,
}: TransactionFormProps) {
  const [transaction, setTransaction] = useState<Omit<Transaction, 'id'>>({
    amount: initialData?.amount || 0,
    category: initialData?.category || '',
    description: initialData?.description || '',
    date: initialData?.date || getCurrentDate(),
  });

  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (transaction.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }
    
    if (!transaction.category) {
      alert('Please select or enter a category');
      return;
    }
    
    onSubmit(transaction);
    
    // Reset form if not editing
    if (!isEditing) {
      setTransaction({
        amount: 0,
        category: '',
        description: '',
        date: getCurrentDate(),
      });
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      setTransaction(prev => ({
        ...prev,
        category: newCategory.trim(),
      }));
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-neutral-800">
          {isEditing ? 'Edit Transaction' : 'New Transaction'}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            required
            value={transaction.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
            Category
          </label>
          {showCategoryInput ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="New category name"
              />
              <button
                type="button"
                onClick={handleAddNewCategory}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowCategoryInput(false)}
                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <select
                id="category"
                name="category"
                required
                value={transaction.category}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              >
                <option value="">Select category</option>
                {existingCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCategoryInput(true)}
                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
              >
                New
              </button>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={transaction.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            placeholder="What was this expense for?"
          ></textarea>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={transaction.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </form>
  );
}