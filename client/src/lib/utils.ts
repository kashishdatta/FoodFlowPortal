import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) return 100;
  return Number(((current - previous) / previous * 100).toFixed(1));
}

export const roleThemes = {
  supplier: {
    primary: 'bg-[#0094D6] hover:bg-[#0080B8] text-white',
    secondary: 'bg-blue-100 text-blue-800',
    accent: 'bg-blue-50 border border-blue-100',
    sidebar: 'bg-[#0094D6] text-white',
    highlight: 'bg-[#0080B8] bg-opacity-30',
    button: 'bg-[#0094D6] hover:bg-[#0080B8] text-white',
    border: 'border-[#0094D6]',
    bgHover: 'hover:bg-[#0080B8] hover:bg-opacity-30',
  },
  storeManager: {
    primary: 'bg-[#4C2C92] hover:bg-[#3A2171] text-white',
    secondary: 'bg-purple-100 text-purple-800',
    accent: 'bg-purple-50 border border-purple-100',
    sidebar: 'bg-[#4C2C92] text-white',
    highlight: 'bg-[#3A2171] bg-opacity-30',
    button: 'bg-[#4C2C92] hover:bg-[#3A2171] text-white',
    border: 'border-[#4C2C92]',
    bgHover: 'hover:bg-[#3A2171] hover:bg-opacity-30',
  }
};

export const productStatusColors = {
  requested: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    highlight: 'bg-blue-100 text-blue-800',
  },
  in_transit: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-100',
    highlight: 'bg-green-100 text-green-800',
  },
  delayed: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-100',
    highlight: 'bg-orange-100 text-orange-800',
  }
};

export function formatStatusLabel(status: string) {
  switch (status) {
    case 'in_transit':
      return 'In Transit';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDateShort(date: Date) {
  const d = new Date(date);
  return `${monthNames[d.getMonth()]} ${d.getDate()}`;
}

export function formatTime(date: Date) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
