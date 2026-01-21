import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Async operation status enum for type-safe status checks
 */
export enum AsyncStatus {
    Idle = 'idle',
    Pending = 'pending',
    Success = 'success',
    Error = 'error',
}

interface AsyncState<T> {
    status: AsyncStatus;
    data: T | null;
    error: Error | null;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
    execute: (...args: unknown[]) => Promise<T | null>;
    reset: () => void;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
}

/**
 * Advanced async hook with comprehensive state management
 * 
 * Features:
 * - Status enum for explicit state checks
 * - Request cancellation on unmount
 * - Automatic error handling
 * - Optional immediate execution
 * 
 * @example
 * const {
 *   execute,
 *   data,
 *   error,
 *   isPending,
 *   isSuccess,
 * } = useAsync(fetchUser, { immediate: true });
 * 
 * // Manual execution
 * const handleClick = () => execute(userId);
 */
export function useAsync<T>(
    asyncFunction: (...args: unknown[]) => Promise<T>,
    options: {
        immediate?: boolean;
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
    } = {}
): UseAsyncReturn<T> {
    const { immediate = false, onSuccess, onError } = options;

    const [state, setState] = useState<AsyncState<T>>({
        status: AsyncStatus.Idle,
        data: null,
        error: null,
    });

    // Track mounted state for cleanup
    const mountedRef = useRef(true);

    // Execute the async function
    const execute = useCallback(
        async (...args: unknown[]): Promise<T | null> => {
            setState({
                status: AsyncStatus.Pending,
                data: null,
                error: null,
            });

            try {
                const result = await asyncFunction(...args);

                if (mountedRef.current) {
                    setState({
                        status: AsyncStatus.Success,
                        data: result,
                        error: null,
                    });
                    onSuccess?.(result);
                }

                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));

                if (mountedRef.current) {
                    setState({
                        status: AsyncStatus.Error,
                        data: null,
                        error,
                    });
                    onError?.(error);
                }

                return null;
            }
        },
        [asyncFunction, onSuccess, onError]
    );

    // Reset to initial state
    const reset = useCallback(() => {
        setState({
            status: AsyncStatus.Idle,
            data: null,
            error: null,
        });
    }, []);

    // Execute immediately if requested
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return {
        ...state,
        execute,
        reset,
        isIdle: state.status === AsyncStatus.Idle,
        isPending: state.status === AsyncStatus.Pending,
        isSuccess: state.status === AsyncStatus.Success,
        isError: state.status === AsyncStatus.Error,
    };
}

export default useAsync;
