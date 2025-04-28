// Generate a consistent color for a category
export function generateCategoryColor(category: string): string {
  const colors = [
    '#00d7d2', // primary-500
    '#9333ea', // secondary-500
    '#f97316', // orange
    '#10b981', // success
    '#f59e0b', // warning
    '#3b82f6', // blue
    '#ec4899', // pink
    '#8b5cf6', // violet
    '#14b8a6', // teal
    '#ef4444', // error
  ];
  
  // Hash the category string to get a consistent index
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}