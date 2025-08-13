import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import secureLocalStorage from 'react-secure-storage';
import type { LoginResponse } from "@/services/auth/auth.type";

export const SESSION_KEY = 'SESSION_KEY';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getSession() {
  const session = secureLocalStorage.getItem(SESSION_KEY) as LoginResponse;

  if (!session) {
    return null;
  }
  console.log(session)

  return session;
}