import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persisting state to localStorage with type safety
 * 
 * Features:
 * - Automatic JSON serialization/deserialization
 * - SSR-safe (handles window undefined)
 * - Syncs across browser tabs
 * - Type-safe with generics
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'dark');
 * 
 * @example
 * const [user, setUser] = useLocalStorage<User | null>('user', null);
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // Get from localStorage on mount
    const readValue = useCallback((): T => {
        // SSR support
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Return a wrapped version of useState's setter function that persists to localStorage
    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                // Allow value to be a function for useState-like API
                const valueToStore = value instanceof Function ? value(storedValue) : value;

                // Save state
                setStoredValue(valueToStore);

                // Save to localStorage
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));

                    // Dispatch a custom event so other useLocalStorage hooks are notified
                    window.dispatchEvent(new StorageEvent('storage', {
                        key,
                        newValue: JSON.stringify(valueToStore),
                    }));
                }
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    // Remove value from localStorage
    const removeValue = useCallback(() => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
                setStoredValue(initialValue);
            }
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [initialValue, key]);

    // Listen for changes from other tabs/windows
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(event.newValue) as T);
                } catch (error) {
                    console.warn(`Error parsing localStorage change for "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
