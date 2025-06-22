/**
 * Pure utility functions for DOM manipulation and queries
 */

/**
 * Get all focusable elements within parent elements
 * @param parentEls - Array of parent elements to search within
 * @returns Array of focusable HTML elements
 */
export function getFocusableElements(parentEls: Element[] | HTMLElement[]): HTMLElement[] {
  const focusableQuery =
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'

  return parentEls
    .flatMap(parentEl => {
      const isParentFocusable = parentEl.matches(focusableQuery)
      const focusableEls: HTMLElement[] = Array.from(parentEl.querySelectorAll(focusableQuery))

      return [...(isParentFocusable ? [parentEl as HTMLElement] : []), ...focusableEls]
    })
    .filter(el => {
      return getComputedStyle(el).pointerEvents !== 'none' && isElementVisible(el)
    })
}

/**
 * Check if an element is visible
 * @param el - HTML element to check
 * @returns True if element is visible
 */
export function isElementVisible(el: HTMLElement): boolean {
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
}

/**
 * Check if an element is in the viewport
 * @param element - Element to check
 * @returns True if element is in viewport
 */
export function isElementInView(element: Element): boolean {
  const rect = element.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Check if an element has a scrollable parent
 * @param element - Element to check
 * @returns True if element has scrollable parent
 */
export function hasScrollableParent(element: Element): boolean {
  if (!element || !element.parentElement) {
    return false
  }

  const parent = element.parentElement as HTMLElement & { scrollTopMax?: number }
  return parent.scrollHeight > parent.clientHeight
}

/**
 * Scroll element into view with options
 * @param element - Element to scroll into view
 * @param shouldSmoothScroll - Whether to use smooth scrolling
 */
export function bringInView(element: Element, shouldSmoothScroll = false): void {
  if (!element || isElementInView(element)) {
    return
  }

  const isTallerThanViewport = (element as HTMLElement).offsetHeight > window.innerHeight

  element.scrollIntoView({
    // Removing the smooth scrolling for elements which exist inside the scrollable parent
    // This was causing the highlight to not properly render
    behavior: !shouldSmoothScroll || hasScrollableParent(element) ? 'auto' : 'smooth',
    inline: 'center',
    block: isTallerThanViewport ? 'start' : 'center'
  })
}

/**
 * Get element from selector, function, or element
 * @param elementRef - Element reference (string selector, function, or element)
 * @returns Element or null
 */
export function getElement(elementRef?: string | Element | (() => Element)): Element | null {
  if (!elementRef) return null
  
  if (typeof elementRef === 'function') {
    return elementRef()
  }
  
  if (typeof elementRef === 'string') {
    return document.querySelector(elementRef)
  }
  
  return elementRef
}

/**
 * Create a dummy element for modal-like highlights
 * @returns Created dummy element
 */
export function createDummyElement(): HTMLElement {
  const dummyElement = document.createElement('div')
  dummyElement.id = 'mint-coach-mark-dummy-element'
  dummyElement.style.width = '1px'
  dummyElement.style.height = '1px'
  dummyElement.style.position = 'fixed'
  dummyElement.style.top = '50%'
  dummyElement.style.left = '50%'
  dummyElement.style.zIndex = '-1'
  dummyElement.style.opacity = '0'
  dummyElement.style.pointerEvents = 'none'
  
  document.body.appendChild(dummyElement)
  return dummyElement
}

/**
 * Remove dummy element from DOM
 */
export function removeDummyElement(): void {
  document.getElementById('mint-coach-mark-dummy-element')?.remove()
}
