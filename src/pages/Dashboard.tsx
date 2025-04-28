import React, { useState, useMemo } from 'react';
import useTransactions from '../hooks/useTransactions';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import ChartContainer from '../components/dashboard/ChartContainer';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import { Transaction } from '../types';
import { Plus, X } from 'lucide-react';

export default function Dashboard() {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    categories,
    filter,
    setFilter,
    categoryTotals,
    monthlyTotals,
    currentMonthTotal,
    totalAmount,
  } = useTransactions();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleSubmit = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    setShowAddForm(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = (transaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction({
        ...transaction,
        id: editingTransaction.id,
      });
      setEditingTransaction(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  // Sample data for demo purposes
  const demoTransactions = useMemo(() => [
    {
      id: '1',
      amount: 120.50,
      category: 'Groceries',
      description: 'Weekly groceries at Trader Joe\'s',
      date: '2025-04-15',
    },
    {
      id: '2',
      amount: 50.00,
      category: 'Transportation',
      description: 'Gas refill',
      date: '2025-04-12',
    },
    {
      id: '3',
      amount: 199.99,
      category: 'Shopping',
      description: 'New shoes',
      date: '2025-04-10',
    },
    {
      id: '4',
      amount: 9.99,
      category: 'Entertainment',
      description: 'Netflix subscription',
      date: '2025-04-05',
    },
    {
      id: '5',
      amount: 45.00,
      category: 'Dining',
      description: 'Dinner with friends',
      date: '2025-04-03',
    },
    {
      id: '6',
      amount: 35.00,
      category: 'Utilities',
      description: 'Water bill',
      date: '2025-03-28',
    },
    {
      id: '7',
      amount: 85.50,
      category: 'Groceries',
      description: 'Costco run',
      date: '2025-03-25',
    },
  ], []);

  // Initialize with demo data if no transactions exist
  const displayTransactions = transactions.length > 0 ? transactions : demoTransactions;
  const uniqueCategories = useMemo(() => {
    const allCategories = new Set<string>();
    displayTransactions.forEach(t => allCategories.add(t.category));
    return Array.from(allCategories).sort();
  }, [displayTransactions]);

  return (
    <div>
      {/* Action button */}
      {!showAddForm && !editingTransaction && (
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 right-6 z-10 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
          aria-label="Add new transaction"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Summary Statistics */}
      <DashboardSummary
        currentMonthTotal={currentMonthTotal}
        totalAmount={totalAmount}
        transactionCount={displayTransactions.length}
        categoryCount={uniqueCategories.length}
      />

      {/* Charts */}
      <ChartContainer
        categoryTotals={categoryTotals.length > 0 ? categoryTotals : [
          { name: 'Groceries', value: 206, color: '#00d7d2' },
          { name: 'Transportation', value: 50, color: '#9333ea' },
          { name: 'Shopping', value: 199.99, color: '#f97316' },
          { name: 'Entertainment', value: 9.99, color: '#10b981' },
          { name: 'Dining', value: 45, color: '#f59e0b' },
          { name: 'Utilities', value: 35, color: '#3b82f6' },
        ]}
        monthlyTotals={monthlyTotals.length > 0 ? monthlyTotals : [
          { date: '2025-02', amount: 350 },
          { date: '2025-03', amount: 420 },
          { date: '2025-04', amount: 425.48 },
        ]}
      />

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction list */}
        <div className={`${showAddForm || editingTransaction ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <TransactionList
            transactions={displayTransactions}
            categories={uniqueCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFilterChange={setFilter}
            currentFilter={filter}
          />
        </div>

        {/* Transaction form */}
        {(showAddForm || editingTransaction) && (
          <div className="lg:col-span-1">
            {showAddForm ? (
              <TransactionForm
                onSubmit={handleSubmit}
                existingCategories={uniqueCategories}
                onCancel={() => setShowAddForm(false)}
              />
            ) : editingTransaction && (
              <TransactionForm
                onSubmit={handleUpdate}
                existingCategories={uniqueCategories}
                onCancel={() => setEditingTransaction(null)}
                initialData={editingTransaction}
                isEditing={true}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}