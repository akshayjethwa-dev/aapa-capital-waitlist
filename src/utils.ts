import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COLORS = {
  primary: '#0A192F', // Deep Navy
  secondary: '#112240', // Lighter Navy
  accent: '#00FF94', // Neon Green
  text: '#CCD6F6',
  textMuted: '#8892B0',
  white: '#FFFFFF',
};
