import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateSKU(productName: string, categoryCode: string) {
  const nameCode = productName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 3)
  
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  
  return `${categoryCode}-${nameCode}-${randomSuffix}`
}

export function calculateStockValue(products: Array<{ price: number; stock: number }>) {
  return products.reduce((total, product) => total + (product.price * product.stock), 0)
}

export function getStockStatus(current: number, minimum: number) {
  if (current === 0) return 'out-of-stock'
  if (current <= minimum) return 'low-stock'
  if (current <= minimum * 2) return 'medium-stock'
  return 'in-stock'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}