import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Import the actual store
import { useAuthStore } from '../../stores/authStore';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the API module
vi.mock('../../services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('AuthStore', () => {
    beforeEach(() => {
        // Reset the store before each test
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Reset store state after each test
        const { result } = renderHook(() => useAuthStore());
        act(() => {
            result.current.logout();
        });
    });

    describe('Initial State', () => {
        it('should have correct initial state', () => {
            const { result } = renderHook(() => useAuthStore());

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('Logout', () => {
        it('should clear all auth state on logout', () => {
            const { result } = renderHook(() => useAuthStore());

            // Logout should set user to null and isAuthenticated to false
            act(() => {
                result.current.logout();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });

        it('should remove token from localStorage on logout', () => {
            // Set a token first
            localStorageMock.setItem('sentinel_token', 'test-token');

            const { result } = renderHook(() => useAuthStore());

            act(() => {
                result.current.logout();
            });

            expect(localStorageMock.removeItem).toHaveBeenCalledWith('sentinel_token');
        });
    });

    describe('checkAuth', () => {
        it('should set isAuthenticated to false when no token exists', async () => {
            localStorageMock.getItem.mockReturnValue(null);

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.checkAuth();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe('Auth Actions', () => {
        it('should have login, logout, and checkAuth functions', () => {
            const { result } = renderHook(() => useAuthStore());

            expect(typeof result.current.login).toBe('function');
            expect(typeof result.current.logout).toBe('function');
            expect(typeof result.current.checkAuth).toBe('function');
            expect(typeof result.current.loginWithCredentials).toBe('function');
            expect(typeof result.current.register).toBe('function');
        });
    });
});
