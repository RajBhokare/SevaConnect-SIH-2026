import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Safely extracts/normalizes an array from various API response shapes
 * (plain array, { data: [] }, { services: [] }, { workers: [] }, etc.)
 */
export function ensureArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'object') {
    if (Array.isArray(val.data)) return val.data;
    if (Array.isArray(val.services)) return val.services;
    if (Array.isArray(val.workers)) return val.workers;
    if (Array.isArray(val.bookings)) return val.bookings;
    if (Array.isArray(val.reviews)) return val.reviews;
    if (Array.isArray(val.benefits)) return val.benefits;
    if (Array.isArray(val.leaderboard)) return val.leaderboard;
    if (Array.isArray(val.rankedWorkers)) return val.rankedWorkers;
    if (Array.isArray(val.items)) return val.items;
  }
  return [];
}

