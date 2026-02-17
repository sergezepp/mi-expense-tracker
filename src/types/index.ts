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
