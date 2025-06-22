/**
 * Async Tour Composable
 * 
 * Provides async tour functionality similar to driver.js, allowing steps to:
 * - Load data asynchronously before proceeding
 * - Override default navigation behavior with custom callbacks
 * - Handle step lifecycle events with async operations
 */

import { ref, type Ref } from 'vue'
import type { 
  CoachMarkStep, 
  CoachMarkDriver, 
  AsyncTourHook 
} from '../types'

export interface UseAsyncTourOptions {
  onAsyncOperationStart?: () => void
  onAsyncOperationComplete?: () => void
  onAsyncOperationError?: (error: Error) => void
}

export interface UseAsyncTourReturn {
  isAsyncOperationInProgress: Ref<boolean>
  executeAsyncCallback: (
    callback: AsyncTourHook,
    element: Element | undefined,
    step: CoachMarkStep,
    driver: CoachMarkDriver
  ) => Promise<boolean>
  handleAsyncNavigation: (
    direction: 'next' | 'previous' | 'close' | 'skip',
    element: Element | undefined,
    step: CoachMarkStep,
    driver: CoachMarkDriver,
    defaultAction: () => void
  ) => Promise<void>
  handleStepDeselection: (
    element: Element | undefined,
    step: CoachMarkStep,
    driver: CoachMarkDriver
  ) => Promise<void>
}

/**
 * Composable for handling async tour operations
 */
export function useAsyncTour(options: UseAsyncTourOptions = {}): UseAsyncTourReturn {
  const {
    onAsyncOperationStart,
    onAsyncOperationComplete,
    onAsyncOperationError
  } = options

  // Track async operation state
  const isAsyncOperationInProgress: Ref<boolean> = ref(false)

  /**
   * Execute an async callback with proper error handling and state management
   */
  const executeAsyncCallback = async (
    callback: AsyncTourHook,
    element: Element | undefined,
    step: CoachMarkStep,
    driver: CoachMarkDriver
  ): Promise<boolean> => {
    try {
      isAsyncOperationInProgress.value = true
      onAsyncOperationStart?.()

      console.log('🔄 Executing async callback for step:', step.popover?.title || 'Unknown')

      // Execute the callback (may be sync or async)
      const result = callback(element, step, driver)

      // If it's a Promise, wait for it to complete
      if (result instanceof Promise) {
        await result
        console.log('✅ Async callback completed successfully')
      } else {
        console.log('✅ Sync callback completed successfully')
      }

      return true

    } catch (error) {
      console.error('❌ Error executing async callback:', error)
      onAsyncOperationError?.(error as Error)
      return false

    } finally {
      isAsyncOperationInProgress.value = false
      onAsyncOperationComplete?.()
    }
  }

  /**
   * Handle async navigation with custom callbacks
   */
  const handleAsyncNavigation = async (
    direction: 'next' | 'previous' | 'close' | 'skip',
    element: Element | undefined,
    step: CoachMarkStep,
    driver: CoachMarkDriver,
    defaultAction: () => void
  ): Promise<void> => {
    // Get the appropriate async callback based on direction
    let callback: AsyncTourHook | undefined

    switch (direction) {
      case 'next':
        callback = step.popover?.onAsyncNextClick
        break
      case 'previous':
        callback = step.popover?.onAsyncPreviousClick
        break
      case 'close':
        callback = step.popover?.onAsyncCloseClick
        break
      case 'skip':
        // For skip, we can use the same callback as close or define a new one
        callback = step.popover?.onAsyncCloseClick
        break
    }

    // If there's a custom callback, execute it instead of default action
    if (callback) {
      console.log(`🎯 Custom ${direction} callback found, executing async operation`)

      const success = await executeAsyncCallback(callback, element, step, driver);

      if (!success) {
        console.warn(`⚠️ Async ${direction} callback failed, falling back to default action`)
        defaultAction()
      }
      // Note: If callback succeeds, it's responsible for calling the appropriate driver method
      // (e.g., driver.moveNext(), driver.movePrevious(), driver.destroy())

    } else {
      // No custom callback, execute default action
      console.log(`➡️ No custom ${direction} callback, executing default action`)
      defaultAction()
    }
  }

  /**
   * Handle step deselection with async cleanup
   */
  const handleStepDeselection = async (
    element: Element | undefined,
    step: CoachMarkStep,
    driver: CoachMarkDriver
  ): Promise<void> => {
    const callback = step.onAsyncDeselected

    if (callback) {
      console.log('🧹 Async step deselection callback found, executing cleanup')

      await executeAsyncCallback(callback, element, step, driver)
    }
  }

  return {
    isAsyncOperationInProgress,
    executeAsyncCallback,
    handleAsyncNavigation,
    handleStepDeselection
  }
}

/**
 * Utility function to check if a step has async navigation callbacks
 */
export function hasAsyncNavigationCallbacks(step: CoachMarkStep): boolean {
  return !!(
    step.popover?.onAsyncNextClick ||
    step.popover?.onAsyncPreviousClick ||
    step.popover?.onAsyncCloseClick
  )
}

/**
 * Utility function to check if a step has async lifecycle callbacks
 */
export function hasAsyncLifecycleCallbacks(step: CoachMarkStep): boolean {
  return !!(step.onAsyncDeselected)
}

/**
 * Utility function to check if a step has any async callbacks
 */
export function hasAsyncCallbacks(step: CoachMarkStep): boolean {
  return hasAsyncNavigationCallbacks(step) || hasAsyncLifecycleCallbacks(step)
}
