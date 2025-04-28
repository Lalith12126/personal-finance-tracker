import { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, FilterType, CategoryTotal, MonthlyTotal } from '../types';
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';
import { generateCategoryColor } from '../utils/colorUtils';

const STORAGE_KEY = 'finance-tracker-transactions';

export default function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>({
    startDate: null,
    endDate: null,
    category: null,
  });

  // Load transactions from localStorage
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          setTransactions(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error loading transactions from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    transactions.forEach(transaction => {
      uniqueCategories.add(transaction.category);
    });
    return Array.from(uniqueCategories).sort();
  }, [transactions]);

  // Add transaction
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  // Update transaction
  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
  }, []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (!filter.startDate && !filter.endDate && !filter.category) {
      return transactions;
    }

    return transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      
      // Filter by date range
      if (filter.startDate && filter.endDate) {
        const start = parseISO(filter.startDate);
        const end = parseISO(filter.endDate);
        
        if (!isWithinInterval(transactionDate, { start, end })) {
          return false;
        }
      }

      // Filter by category
      if (filter.category && transaction.category !== filter.category) {
        return false;
      }

      return true;
    });
  }, [transactions, filter]);

  // Calculate category totals for pie chart
  const categoryTotals = useMemo((): CategoryTotal[] => {
    const totals: Record<string, number> = {};
    
    filteredTransactions.forEach(transaction => {
      const { category, amount } = transaction;
      totals[category] = (totals[category] || 0) + amount;
    });

    return Object.entries(totals)
      .map(([name, value]) => ({
        name,
        value,
        color: generateCategoryColor(name),
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Calculate monthly totals for line chart
  const monthlyTotals = useMemo((): MonthlyTotal[] => {
    const totals: Record<string, number> = {};
    
    filteredTransactions.forEach(transaction => {
      const date = parseISO(transaction.date);
      const monthKey = format(date, 'yyyy-MM');
      totals[monthKey] = (totals[monthKey] || 0) + transaction.amount;
    });

    return Object.entries(totals)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactions]);

  // Calculate total amount for the current month
  const currentMonthTotal = useMemo(() => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    
    return filteredTransactions
      .filter(transaction => {
        const date = parseISO(transaction.date);
        return isWithinInterval(date, { start, end });
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [filteredTransactions]);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [filteredTransactions]);

  return {
    transactions: filteredTransactions,
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
    isLoading,
  };
}