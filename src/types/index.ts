export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface CategoryTotal {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyTotal {
  date: string;
  amount: number;
}

export type FilterType = {
  startDate: string | null;
  endDate: string | null;
  category: string | null;
};