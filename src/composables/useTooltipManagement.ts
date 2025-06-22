/**
 * Tooltip management composable for QuasarCoachMark component
 * 
 * Provides centralized tooltip display management with debouncing,
 * context awareness, and performance optimizations.
 */

import { ref, type Ref } from 'vue'

/**
 * Tooltip display state interface
 */
interface TooltipDisplayState {
  isDisplaying: boolean
  pendingDisplayId: number
  lastDisplayTime: number
  debounceDelay: number
  totalCalls: number
  debouncedCalls: number
  executedCalls: number
  lastExecutionContext: string
  isStepTransitioning: boolean
}

/**
 * Tooltip management composable return type
 */
export interface UseTooltipManagementReturn {
  /**
   * Reactive tooltip visibility state
   */
  tooltipVisible: Ref<boolean>
  
  /**
   * Tooltip refresh key for forcing re-renders
   */
  tooltipRefreshKey: Ref<number>
  
  /**
   * Show tooltip with context awareness and debouncing
   */
  showTooltipIfReady: (context?: string) => Promise<void>
  
  /**
   * Hide tooltip immediately
   */
  hideTooltip: () => void
  
  /**
   * Force tooltip refresh (minimal usage)
   */
  forceTooltipRefresh: () => void
  
  /**
   * Set step transition state
   */
  setStepTransitioning: (transitioning: boolean) => void
  
  /**
   * Get display statistics for debugging
   */
  getDisplayStats: () => TooltipDisplayState
}

/**
 * Tooltip management composable
 * 
 * Provides centralized tooltip display management with:
 * - Context-aware execution control
 * - Debouncing to prevent visual flashing
 * - Step transition state management
 * - Performance monitoring
 * 
 * @param showTooltipInternal - Internal function to actually show the tooltip
 * @returns Tooltip management API
 */
export function useTooltipManagement(
  showTooltipInternal: () => Promise<void>
): UseTooltipManagementReturn {
  
  // Reactive state
  const tooltipVisible: Ref<boolean> = ref(false)
  const tooltipRefreshKey: Ref<number> = ref(0)
  
  // Internal state management
  const displayState: TooltipDisplayState = {
    isDisplaying: false,
    pendingDisplayId: 0,
    lastDisplayTime: 0,
    debounceDelay: 100,
    totalCalls: 0,
    debouncedCalls: 0,
    executedCalls: 0,
    lastExecutionContext: '',
    isStepTransitioning: false
  }
  
  // Throttling for refresh operations
  let lastRefreshTime = 0
  
  /**
   * Promise-based delay utility
   */
  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  /**
   * Force tooltip refresh with throttling
   */
  const forceTooltipRefresh = (): void => {
    const now = Date.now()
    const timeSinceLastRefresh = now - lastRefreshTime
    
    // Throttle refresh to prevent excessive updates
    if (timeSinceLastRefresh < 50) {
      return
    }
    
    // tooltipRefreshKey.value += 1
    lastRefreshTime = now
  }
  
  /**
   * Debounced tooltip display with context awareness
   */
  const debouncedShowTooltip = async (context: string = 'unknown'): Promise<void> => {
    displayState.totalCalls++
    const displayId = ++displayState.pendingDisplayId
    const now = Date.now()
    
    // During step transitions, only allow calls from step transition functions
    if (displayState.isStepTransitioning) {
      const isStepTransitionContext = context.includes('step-transition')
      if (!isStepTransitionContext) {
        displayState.debouncedCalls++
        console.log(`🚫 Tooltip display blocked during step transition from: ${context}`)
        return
      }
    }
    
    // If another display operation is in progress, wait for it to complete
    if (displayState.isDisplaying) {
      console.log('🔄 Tooltip display already in progress, queuing request:', displayId, 'from:', context)
      
      // Wait for current operation to complete
      while (displayState.isDisplaying) {
        await delay(25)
      }
      
      // Check if this request is still the latest
      if (displayId !== displayState.pendingDisplayId) {
        displayState.debouncedCalls++
        console.log('🚫 Tooltip display request superseded:', displayId, 'from:', context)
        return
      }
    }
    
    // Debounce rapid successive calls
    const timeSinceLastDisplay = now - displayState.lastDisplayTime
    if (timeSinceLastDisplay < displayState.debounceDelay) {
      const remainingDelay = displayState.debounceDelay - timeSinceLastDisplay
      console.log(`⏳ Debouncing tooltip display for ${remainingDelay}ms from: ${context}`)
      await delay(remainingDelay)
      
      // Check if this request is still the latest after debounce
      if (displayId !== displayState.pendingDisplayId) {
        displayState.debouncedCalls++
        console.log('🚫 Tooltip display request superseded after debounce:', displayId, 'from:', context)
        return
      }
    }
    
    // Mark as displaying and execute
    displayState.isDisplaying = true
    displayState.lastDisplayTime = Date.now()
    displayState.executedCalls++
    displayState.lastExecutionContext = context
    
    try {
      console.log('🎯 Executing debounced tooltip display:', displayId, 'from:', context,
                 `(${displayState.executedCalls}/${displayState.totalCalls} executed)`)
      await showTooltipInternal()
    } finally {
      displayState.isDisplaying = false
    }
  }
  
  /**
   * Public interface for showing tooltip
   */
  const showTooltipIfReady = async (context: string = 'unknown'): Promise<void> => {
    await debouncedShowTooltip(context)
  }
  
  /**
   * Hide tooltip immediately
   */
  const hideTooltip = (): void => {
    tooltipVisible.value = false
  }
  
  /**
   * Set step transition state
   */
  const setStepTransitioning = (transitioning: boolean): void => {
    displayState.isStepTransitioning = transitioning
  }
  
  /**
   * Get display statistics for debugging
   */
  const getDisplayStats = (): TooltipDisplayState => {
    return { ...displayState }
  }
  
  return {
    tooltipVisible,
    tooltipRefreshKey,
    showTooltipIfReady,
    hideTooltip,
    forceTooltipRefresh,
    setStepTransitioning,
    getDisplayStats
  }
}
