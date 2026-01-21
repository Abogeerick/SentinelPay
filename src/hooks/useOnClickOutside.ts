import { useEffect, RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

/**
 * Custom hook that detects clicks outside of a specified element
 * Useful for modals, dropdowns, and other overlay components
 * 
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * 
 * useOnClickOutside(ref, () => {
 *   setIsOpen(false);
 * });
 * 
 * return <div ref={ref}>Modal Content</div>;
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: Handler,
    mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref?.current;

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return;
            }

            handler(event);
        };

        document.addEventListener(mouseEvent, listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener(mouseEvent, listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler, mouseEvent]);
}

export default useOnClickOutside;
