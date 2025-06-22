/**
 * Pure utility functions for DOM manipulation and queries
 */
/**
 * Get all focusable elements within parent elements
 * @param parentEls - Array of parent elements to search within
 * @returns Array of focusable HTML elements
 */
export declare function getFocusableElements(parentEls: Element[] | HTMLElement[]): HTMLElement[];
/**
 * Check if an element is visible
 * @param el - HTML element to check
 * @returns True if element is visible
 */
export declare function isElementVisible(el: HTMLElement): boolean;
/**
 * Check if an element is in the viewport
 * @param element - Element to check
 * @returns True if element is in viewport
 */
export declare function isElementInView(element: Element): boolean;
/**
 * Check if an element has a scrollable parent
 * @param element - Element to check
 * @returns True if element has scrollable parent
 */
export declare function hasScrollableParent(element: Element): boolean;
/**
 * Scroll element into view with options
 * @param element - Element to scroll into view
 * @param shouldSmoothScroll - Whether to use smooth scrolling
 */
export declare function bringInView(element: Element, shouldSmoothScroll?: boolean): void;
/**
 * Get element from selector, function, or element
 * @param elementRef - Element reference (string selector, function, or element)
 * @returns Element or null
 */
export declare function getElement(elementRef?: string | Element | (() => Element)): Element | null;
/**
 * Create a dummy element for modal-like highlights
 * @returns Created dummy element
 */
export declare function createDummyElement(): HTMLElement;
/**
 * Remove dummy element from DOM
 */
export declare function removeDummyElement(): void;
//# sourceMappingURL=dom.d.ts.map