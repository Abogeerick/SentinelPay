import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';
import api from '../../services/api';

// Mock the API module
vi.mock('../../services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('AuthStore', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
        // Reset store state
        const { result } = renderHook(() => useAuthStore());
        act(() => {
            result.current.logout();
        });
        // Clear localStorage
        localStorage.clear();
    });

    describe('Initial State', () => {
        it('should have correct initial state', () => {
            const { result } = renderHook(() => useAuthStore());

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('loginWithCredentials', () => {
        it('should set user and isAuthenticated on successful login', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                name: 'Test User',
            };

            const mockResponse = {
                data: {
                    token: 'mock-jwt-token',
                    user: mockUser,
                },
            };

            vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.loginWithCredentials('test@example.com', 'password123');
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.isLoading).toBe(false);
            expect(localStorage.getItem('sentinel_token')).toBe('mock-jwt-token');
        });

        it('should handle login failure', async () => {
            const error = new Error('Invalid credentials');
            vi.mocked(api.post).mockRejectedValueOnce(error);

            const { result } = renderHook(() => useAuthStore());

            await expect(
                act(async () => {
                    await result.current.loginWithCredentials('wrong@example.com', 'wrongpass');
                })
            ).rejects.toThrow('Invalid credentials');

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.isLoading).toBe(false);
        });

        it('should set isLoading during login process', async () => {
            let resolvePromise: (value: unknown) => void;
            const pendingPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });

            vi.mocked(api.post).mockReturnValueOnce(pendingPromise as ReturnType<typeof api.post>);

            const { result } = renderHook(() => useAuthStore());

            // Start login
            act(() => {
                result.current.loginWithCredentials('test@example.com', 'password');
            });

            // Should be loading
            expect(result.current.isLoading).toBe(true);

            // Resolve the promise
            await act(async () => {
                resolvePromise({
                    data: { token: 'token', user: { id: '1', email: 'test@example.com' } },
                });
            });

            // Should no longer be loading
            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('register', () => {
        it('should register user and set authentication', async () => {
            const mockUser = {
                id: 'new-user-123',
                email: 'newuser@example.com',
                name: 'New User',
            };

            vi.mocked(api.post).mockResolvedValueOnce({
                data: {
                    token: 'new-jwt-token',
                    user: mockUser,
                },
            });

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.register('newuser@example.com', 'password123', 'New User');
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
            expect(api.post).toHaveBeenCalledWith('/auth/register', {
                email: 'newuser@example.com',
                password: 'password123',
                name: 'New User',
            });
        });
    });

    describe('logout', () => {
        it('should clear user state and remove token', async () => {
            // First, log in
            vi.mocked(api.post).mockResolvedValueOnce({
                data: {
                    token: 'test-token',
                    user: { id: '1', email: 'test@example.com' },
                },
            });

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.loginWithCredentials('test@example.com', 'password');
            });

            expect(result.current.isAuthenticated).toBe(true);

            // Now logout
            act(() => {
                result.current.logout();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(localStorage.getItem('sentinel_token')).toBeNull();
        });
    });

    describe('checkAuth', () => {
        it('should restore session from valid token', async () => {
            const mockUser = { id: '1', email: 'test@example.com', name: 'Test' };
            localStorage.setItem('sentinel_token', 'valid-token');

            vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser });

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.checkAuth();
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
        });

        it('should clear state when no token exists', async () => {
            localStorage.removeItem('sentinel_token');

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.checkAuth();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });

        it('should clear state on invalid token', async () => {
            localStorage.setItem('sentinel_token', 'invalid-token');
            vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'));

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.checkAuth();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(localStorage.getItem('sentinel_token')).toBeNull();
        });
    });
});
