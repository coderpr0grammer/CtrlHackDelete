import { useState, useEffect } from 'react';

// Type guard to check if the value is a plain object
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

// Custom hook for using localStorage in functional components
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }


      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

// The following functions are for use outside of React components or for more direct control

// Set an item in localStorage
export const setItem = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return;
  try {
    const serializedValue = isPlainObject(value) || Array.isArray(value)
      ? JSON.stringify(value)
      : String(value);
    window.localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error setting localStorage item:', error);
  }
};

// Get an item from localStorage
export const getItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;
    try {
      return JSON.parse(item);
    } catch {
      return item as unknown as T;
    }
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return defaultValue;
  }
};

// Remove an item from localStorage
export const removeItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage item:', error);
  }
};

// Clear all items from localStorage
export const clear = (): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};