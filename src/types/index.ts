export type Category =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Health'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO string
  createdAt: string;
}

export type ExpenseFilter = {
  category?: Category | 'All';
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
};
export type InflowType =
  | 'Payroll'
  | 'Interest'
  | 'Food Coupons'
  | 'Other';

export interface Inflow {
  id: string;
  amount: number;
  type: InflowType;
  description: string;
  date: string; // ISO string
  createdAt: string;
}

export type InflowFilter = {
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
};
