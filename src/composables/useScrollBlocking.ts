/**
 * Scroll blocking composable for preventing user scrolling during step transitions
 * 
 * This composable provides functionality to temporarily block browser scrolling
 * during coach mark step transitions to prevent positioning issues and ensure
 * a smooth user experience.
 * 
 * @example
 * ```typescript
 * import { useScrollBlocking } from './composables/useScrollBlocking'
 * 
 * const { blockScrolling, unblockScrolling, isBlocked } = useScrollBlocking()
 * 
 * // Block scrolling during transition
 * blockScrolling()
 * 
 * // Perform step transition...
 * 
 * // Unblock scrolling when complete
 * unblockScrolling()
 * ```
 */

import { ref, type Ref } from 'vue'

/**
 * Scroll blocking state interface
 */
interface ScrollBlockingState {
  isBlocked: boolean
  originalOverflow: string
  originalPosition: string
  originalTop: string
  originalLeft: string
  scrollPosition: { x: number; y: number }
}

/**
 * Scroll blocking composable return type
 */
export interface UseScrollBlockingReturn {
  /**
   * Block browser scrolling
   */
  blockScrolling: () => void
  
  /**
   * Unblock browser scrolling and restore original position
   */
  unblockScrolling: () => void
  
  /**
   * Check if scrolling is currently blocked
   */
  isBlocked: Ref<boolean>
  
  /**
   * Get current scroll position (useful for debugging)
   */
  getScrollPosition: () => { x: number; y: number }
  
  /**
   * Force unblock scrolling (emergency cleanup)
   */
  forceUnblock: () => void
}

/**
 * Scroll blocking composable
 * 
 * Provides functionality to temporarily block browser scrolling during
 * step transitions to prevent positioning issues with tooltips and popovers.
 * 
 * Features:
 * - Preserves current scroll position
 * - Restores original body styles
 * - Prevents multiple blocking operations
 * - Emergency cleanup functionality
 * - Reactive state tracking
 * 
 * @returns {UseScrollBlockingReturn} Scroll blocking API
 */
export function useScrollBlocking(): UseScrollBlockingReturn {
  // Internal state management
  const scrollBlockingState: ScrollBlockingState = {
    isBlocked: false,
    originalOverflow: '',
    originalPosition: '',
    originalTop: '',
    originalLeft: '',
    scrollPosition: { x: 0, y: 0 }
  }

  // Reactive state for external consumption
  const isBlocked: Ref<boolean> = ref(false)

  /**
   * Block browser scrolling during step transitions
   * 
   * This function:
   * 1. Stores the current scroll position
   * 2. Saves original body styles
   * 3. Applies fixed positioning to prevent scrolling
   * 4. Maintains visual consistency
   */
  const blockScrolling = (): void => {
    console.log('scrollBlockingState', scrollBlockingState)
    if (scrollBlockingState.isBlocked) {
      console.log('🔒 Scroll blocking already active, skipping')
      return // Already blocked
    }

    console.log('🔒 Blocking browser scrolling for step transition')
    
    // Store current scroll position
    scrollBlockingState.scrollPosition = {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    }

    // Store original body styles
    const body = document.body
    scrollBlockingState.originalOverflow = body.style.overflow
    scrollBlockingState.originalPosition = body.style.position
    scrollBlockingState.originalTop = body.style.top
    scrollBlockingState.originalLeft = body.style.left

    // Apply scroll blocking styles
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollBlockingState.scrollPosition.y}px`
    body.style.left = `-${scrollBlockingState.scrollPosition.x}px`
    body.style.width = '100%'

    // Update state
    scrollBlockingState.isBlocked = true
    isBlocked.value = true
  }

  /**
   * Unblock browser scrolling after step transitions complete
   * 
   * This function:
   * 1. Restores original body styles
   * 2. Restores the original scroll position
   * 3. Cleans up internal state
   */
  const unblockScrolling = (): void => {
    if (!scrollBlockingState.isBlocked) {
      console.log('🔓 Scroll blocking not active, skipping')
      return // Not blocked
    }

    console.log('🔓 Unblocking browser scrolling after step transition')

    // Restore original body styles
    const body = document.body
    body.style.overflow = scrollBlockingState.originalOverflow
    body.style.position = scrollBlockingState.originalPosition
    body.style.top = scrollBlockingState.originalTop
    body.style.left = scrollBlockingState.originalLeft
    body.style.width = ''

    // Restore scroll position
    window.scrollTo(scrollBlockingState.scrollPosition.x, scrollBlockingState.scrollPosition.y)

    // Update state
    scrollBlockingState.isBlocked = false
    isBlocked.value = false
  }

  /**
   * Get current scroll position
   * 
   * @returns Current scroll position coordinates
   */
  const getScrollPosition = (): { x: number; y: number } => {
    return { ...scrollBlockingState.scrollPosition }
  }

  /**
   * Force unblock scrolling (emergency cleanup)
   * 
   * This function forcefully unblocks scrolling even if the internal
   * state indicates it's not blocked. Useful for error recovery.
   */
  const forceUnblock = (): void => {
    console.log('🚨 Force unblocking browser scrolling (emergency cleanup)')

    // Reset body styles to defaults
    const body = document.body
    body.style.overflow = ''
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.width = ''

    // Reset internal state
    scrollBlockingState.isBlocked = false
    scrollBlockingState.originalOverflow = ''
    scrollBlockingState.originalPosition = ''
    scrollBlockingState.originalTop = ''
    scrollBlockingState.originalLeft = ''
    scrollBlockingState.scrollPosition = { x: 0, y: 0 }

    // Update reactive state
    isBlocked.value = false
  }

  return {
    blockScrolling,
    unblockScrolling,
    isBlocked,
    getScrollPosition,
    forceUnblock
  }
}
