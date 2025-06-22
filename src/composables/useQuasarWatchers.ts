/**
 * Watcher management composable for QuasarCoachMark component
 * 
 * Manages the state watchers for popover rendering and repositioning
 * with proper separation of concerns and race condition prevention.
 */

import { watch, nextTick } from 'vue'
import type { CoachMarkStep } from '../types'
import type { UseTooltipManagementReturn } from './useTooltipManagement'
import type { UseScrollBlockingReturn } from './useScrollBlocking'

/**
 * Popover state interface
 */
interface PopoverState {
  visible: boolean
  targetElement: Element | null
  step: CoachMarkStep | null
}

/**
 * Watcher management options
 */
interface WatcherOptions {
  getState: (key: string) => any
  setState: (key: string, value: any) => void
  showPopoverCommunication: (element: Element, step: CoachMarkStep) => void
  ensureTooltipHidden: () => Promise<void>
  ensureStepProcessingComplete: () => Promise<void>
  popoverState: { value: PopoverState }
  isTransitioning: { value: boolean }
  tooltipManagement: UseTooltipManagementReturn
  scrollBlocking: UseScrollBlockingReturn
}

/**
 * Watcher management composable return type
 */
export interface UseQuasarWatchersReturn {
  /**
   * Initialize all watchers
   */
  initWatchers: () => void
  
  /**
   * Check if watchers are processing
   */
  isProcessing: () => boolean
}

/**
 * Watcher management composable
 * 
 * Provides centralized management of state watchers with:
 * - Proper separation between render and reposition operations
 * - Race condition prevention
 * - Cross-watcher coordination
 * - Optimized performance
 * 
 * @param options - Configuration options
 * @returns Watcher management API
 */
export function useQuasarWatchers(options: WatcherOptions): UseQuasarWatchersReturn {
  const {
    getState,
    setState,
    showPopoverCommunication,
    ensureTooltipHidden,
    ensureStepProcessingComplete,
    popoverState,
    isTransitioning,
    tooltipManagement,
    scrollBlocking
  } = options
  
  // Processing state management
  let isProcessingRenderRequest = false
  let isProcessingRepositionRequest = false
  let renderRequestId = 0
  
  /**
   * Initialize render watcher
   */
  const initRenderWatcher = (): void => {
    watch(() => getState('shouldRenderPopover'), async (renderData) => {
      // Prevent double-triggering when we clear the state or during repositioning
      if (!renderData || isProcessingRenderRequest || isProcessingRepositionRequest) {
        return
      }
      
      // Validate that we have proper data
      if (!renderData.element || !renderData.step) {
        console.warn('Invalid render data received:', renderData)
        return
      }

      console.log('📍 Render popover requested for step:', renderData.step?.popover?.title)

      // Check if we're already showing the same step
      const currentPopoverStep = popoverState.value.step
      if (tooltipManagement.tooltipVisible.value && currentPopoverStep &&
          currentPopoverStep.element === renderData.step.element &&
          currentPopoverStep.popover?.title === renderData.step.popover?.title) {
        console.log('📍 Same step already visible, skipping render')
        setState('shouldRenderPopover', undefined)
        return
      }

      // Immediately clear any existing popover state to prevent content flashing
      if (currentPopoverStep && currentPopoverStep !== renderData.step) {
        console.log('🧹 Clearing previous popover state to prevent content flash')
        showPopoverCommunication(renderData.element, renderData.step)
      }

      try {
        // Mark as processing to prevent race conditions
        isProcessingRenderRequest = true
        const currentRequestId = ++renderRequestId
        
        // Clear the state immediately to prevent re-triggering
        setState('shouldRenderPopover', undefined)
        
        // Check if this request is still the latest
        if (currentRequestId !== renderRequestId) {
          console.log('🚫 Render request superseded:', currentRequestId)
          return
        }

        // 1. Ensure tooltip is completely hidden first
        await ensureTooltipHidden()
        
        // Check if this request is still the latest after async operation
        if (currentRequestId !== renderRequestId) {
          console.log('🚫 Render request superseded after tooltip hide:', currentRequestId)
          return
        }

        // 2. Update popover communication state
        showPopoverCommunication(renderData.element, renderData.step)

        // 3. Wait for positioning calculations to complete
        await ensureStepProcessingComplete()
        
        // Check if this request is still the latest after processing
        if (currentRequestId !== renderRequestId) {
          console.log('🚫 Render request superseded after processing:', currentRequestId)
          return
        }

        // 4. Show tooltip if conditions are met
        await tooltipManagement.showTooltipIfReady('render-watcher')

        // 5. Unblock scrolling after initial step is positioned (for tour start)
        if (scrollBlocking.isBlocked.value && !isTransitioning.value) {
          scrollBlocking.unblockScrolling()
        }

      } catch (error) {
        console.error('Error during popover rendering:', error)
        // Ensure scrolling is unblocked on error
        if (scrollBlocking.isBlocked.value && !isTransitioning.value) {
          scrollBlocking.unblockScrolling()
        }
      } finally {
        // Always clear the processing flag
        isProcessingRenderRequest = false
      }
    })
  }
  
  /**
   * Initialize reposition watcher
   */
  const initRepositionWatcher = (): void => {
    watch(() => getState('shouldRepositionPopover'), async (repositionData) => {
      // Prevent double-triggering when we clear the state
      if (!repositionData || isProcessingRepositionRequest) {
        return
      }
      
      // Validate that we have proper data
      if (!repositionData.element || !repositionData.step) {
        console.warn('Invalid reposition data received:', repositionData)
        return
      }

      console.log('🔄 Reposition popover requested for step:', repositionData.step?.popover?.title)

      try {
        // Mark as processing to prevent race conditions
        isProcessingRepositionRequest = true
        
        // Clear the state immediately to prevent re-triggering
        setState('shouldRepositionPopover', undefined)

        // Only handle repositioning if tooltip is already visible
        if (tooltipManagement.tooltipVisible.value) {
          console.log('🔄 Repositioning existing tooltip')
          
          // Use QTooltip's built-in repositioning by briefly toggling visibility
          tooltipManagement.hideTooltip()
          await nextTick()
          tooltipManagement.tooltipVisible.value = true
        } else {
          console.log('🔄 Tooltip not visible, skipping reposition')
        }

      } catch (error) {
        console.error('Error during popover repositioning:', error)
      } finally {
        // Always clear the processing flag
        isProcessingRepositionRequest = false
      }
    })
  }
  
  /**
   * Initialize all watchers
   */
  const initWatchers = (): void => {
    initRenderWatcher()
    initRepositionWatcher()
  }
  
  /**
   * Check if watchers are processing
   */
  const isProcessing = (): boolean => {
    return isProcessingRenderRequest || isProcessingRepositionRequest
  }
  
  return {
    initWatchers,
    isProcessing
  }
}
