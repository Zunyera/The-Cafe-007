export function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString('en-PK')}`;
}

export function dateOnly(value) {
  try {
    return new Date(value).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}

export const categories = [
  'Burgers', 'Wraps', 'Snacks', 'Beverages', 'Regular Pizza', 'Pizza Treat',
  'Café Special', 'Pizza Deals', 'Deals', 'New Additions', 'Pasta', 'Extras',
];