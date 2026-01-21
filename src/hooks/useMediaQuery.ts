import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for responsive design - matches CSS media queries in JavaScript
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
    const getMatches = useCallback((query: string): boolean => {
        // SSR support
        if (typeof window === 'undefined') {
            return false;
        }
        return window.matchMedia(query).matches;
    }, []);

    const [matches, setMatches] = useState<boolean>(getMatches(query));

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        // Update state when query changes
        setMatches(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Modern browsers
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
}

/**
 * Breakpoint presets for common responsive design patterns
 * Matches Tailwind CSS default breakpoints
 */
export const breakpoints = {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
} as const;

type Breakpoint = keyof typeof breakpoints;

/**
 * Convenient hook for common breakpoint checks
 * 
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoint();
 */
export function useBreakpoint(): {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isLargeDesktop: boolean;
    currentBreakpoint: Breakpoint | 'xs';
} {
    const sm = useMediaQuery(breakpoints.sm);
    const md = useMediaQuery(breakpoints.md);
    const lg = useMediaQuery(breakpoints.lg);
    const xl = useMediaQuery(breakpoints.xl);
    const xxl = useMediaQuery(breakpoints['2xl']);

    const getCurrentBreakpoint = (): Breakpoint | 'xs' => {
        if (xxl) return '2xl';
        if (xl) return 'xl';
        if (lg) return 'lg';
        if (md) return 'md';
        if (sm) return 'sm';
        return 'xs';
    };

    return {
        isMobile: !md,
        isTablet: md && !lg,
        isDesktop: lg,
        isLargeDesktop: xl,
        currentBreakpoint: getCurrentBreakpoint(),
    };
}

export default useMediaQuery;
