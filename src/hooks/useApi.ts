import { useState, useCallback, useEffect } from 'react';


interface UseApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for API calls with loading, error, and data state management
 * Follows React best practices and provides a clean interface for API interactions
 * 
 * @example
 * const { data, isLoading, error, execute } = useApi<UserData>();
 * 
 * // In useEffect or handler
 * await execute(() => api.get('/users/me'));
 */
export function useApi<T = any>(): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
    });
  }, []);

  const execute = useCallback(async (apiCall: () => Promise<{ data: T }>): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiCall();
      setState({
        data: response.data,
        error: null,
        isLoading: false,
      });
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setState({
        data: null,
        error,
        isLoading: false,
      });
      return null;
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for debounced API calls - useful for search inputs
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for handling retry logic on failed API calls
 */
export function useRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): {
  execute: () => Promise<T | null>;
  isRetrying: boolean;
  retryCount: number;
} {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(async (): Promise<T | null> => {
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        setIsRetrying(attempts > 0);
        setRetryCount(attempts);
        const result = await apiCall();
        setIsRetrying(false);
        setRetryCount(0);
        return result;
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) {
          setIsRetrying(false);
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
      }
    }

    return null;
  }, [apiCall, maxRetries, retryDelay]);

  return { execute, isRetrying, retryCount };
}

export default useApi;
