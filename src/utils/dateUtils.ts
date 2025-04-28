import { format, parseISO } from 'date-fns';

// Format date for display
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy');
}

// Format date for month display
export function formatMonth(dateString: string): string {
  const [year, month] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return format(date, 'MMM yyyy');
}

// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}