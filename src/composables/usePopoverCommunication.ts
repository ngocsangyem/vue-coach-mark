/**
 * Popover communication composable for decoupled architecture
 * Manages communication between MintCoachMark and popover components
 */

import { 
  ref, 
  computed, 
  watch, 
  nextTick,
  type Ref, 
  type ComputedRef 
} from 'vue'
import type { 
  PopoverCommunication, 
  PopoverProvider, 
  CoachMarkStep, 
  UsePopoverCommunicationReturn 
} from '../types'

// Global popover state for communication between components
const globalPopoverState: Ref<PopoverCommunication> = ref<PopoverCommunication>({
  visible: false,
  targetElement: null,
  step: null,
  position: null,
  provider: 'mint',
  isPositioning: false
})

// Track active popover instances to prevent conflicts
const activeInstances: Set<string> = new Set()

/**
 * Composable for managing popover communication in a decoupled architecture
 */
export const usePopoverCommunication = (instanceId?: string): UsePopoverCommunicationReturn => {
  const currentInstanceId: string = instanceId || `popover-${Date.now()}-${Math.random()}`
  
  // Register this instance
  activeInstances.add(currentInstanceId)

  // Local state for this instance
  const localVisible: Ref<boolean> = ref(false)
  const localTargetElement: Ref<Element | null> = ref(null)
  const localStep: Ref<CoachMarkStep | null> = ref(null)

  // Computed properties for reactive state
  const popoverState: ComputedRef<PopoverCommunication> = computed(() => globalPopoverState.value)

  const isActiveInstance: ComputedRef<boolean> = computed(() => {
    return globalPopoverState.value.visible && 
           globalPopoverState.value.targetElement === localTargetElement.value
  })

  /**
   * Type guard to check if element is valid
   */
  const isValidElement = (element: unknown): element is Element => {
    return element instanceof Element
  }

  /**
   * Type guard to check if step is valid
   */
  const isValidStep = (step: unknown): step is CoachMarkStep => {
    return typeof step === 'object' && step !== null
  }

  /**
   * Update the global popover state
   */
  const updatePopoverState = (updates: Partial<PopoverCommunication>): void => {
    // Allow updates in these cases:
    // 1. From the active instance
    // 2. When setting visibility to false (cleanup)
    // 3. When activating a new popover (visible: true with targetElement)
    const isActivatingNewPopover = updates.visible === true && updates.targetElement &&
                                   updates.targetElement === localTargetElement.value

    if (!isActiveInstance.value && updates.visible !== false && !isActivatingNewPopover) {
      return
    }

    globalPopoverState.value = {
      ...globalPopoverState.value,
      ...updates
    }
  }

  /**
   * Show popover with element and step
   */
  const showPopover = (element: Element, step: CoachMarkStep, isPositioning: boolean = false): void => {
    if (!isValidElement(element) || !isValidStep(step)) {
      console.warn('Invalid element or step provided to showPopover')
      return
    }

    // Update local state
    localVisible.value = true
    localTargetElement.value = element
    localStep.value = step

    // Calculate position
    const rect = element.getBoundingClientRect()
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }

    // Update global state
    updatePopoverState({
      visible: true,
      targetElement: element,
      step,
      position,
      isPositioning
    })
  }

  /**
   * Hide popover
   */
  const hidePopover = (): void => {
    // Update local state
    localVisible.value = false
    localTargetElement.value = null
    localStep.value = null

    // Update global state
    updatePopoverState({
      visible: false,
      targetElement: null,
      step: null,
      position: null,
      isPositioning: false
    })
  }

  /**
   * Complete positioning (mark positioning as finished)
   */
  const completePositioning = (): void => {
    if (globalPopoverState.value.visible) {
      updatePopoverState({
        isPositioning: false
      })
    }
  }

  /**
   * Reposition popover based on current target element
   */
  const repositionPopover = (): void => {
    const currentElement = globalPopoverState.value.targetElement
    if (!currentElement || !isValidElement(currentElement)) {
      return
    }

    nextTick(() => {
      const rect = currentElement.getBoundingClientRect()
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }

      updatePopoverState({
        position
      })
    })
  }

  /**
   * Set the popover provider
   */
  const setProvider = (provider: PopoverProvider): void => {
    updatePopoverState({
      provider
    })
  }

  // Watch for window resize and scroll to reposition popover
  const handleReposition = (): void => {
    if (globalPopoverState.value.visible) {
      repositionPopover()
    }
  }

  // Set up event listeners for repositioning
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)
  }

  // Watch for global state changes to update local state
  watch(
    () => globalPopoverState.value,
    (newState: PopoverCommunication) => {
      // Update local state if this instance is not the active one
      if (newState.targetElement !== localTargetElement.value) {
        localVisible.value = false
        localTargetElement.value = null
        localStep.value = null
      }
    },
    { deep: true }
  )

  // Cleanup function
  const cleanup = (): void => {
    activeInstances.delete(currentInstanceId)
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }

    // Hide popover if this instance was active
    if (isActiveInstance.value) {
      hidePopover()
    }
  }

  // Auto-cleanup when no longer needed
  const cleanupTimer = setTimeout(() => {
    if (!localVisible.value && !isActiveInstance.value) {
      cleanup()
    }
  }, 5000)

  // Clear cleanup timer if instance becomes active
  watch(isActiveInstance, (isActive: boolean) => {
    if (isActive) {
      clearTimeout(cleanupTimer)
    }
  })

  /**
   * Force popover repositioning (useful for custom implementations)
   */
  const forceRepositioning = (): void => {
    if (globalPopoverState.value.visible && globalPopoverState.value.targetElement) {
      // Emit a repositioning event that custom popovers can listen to
      const event = new CustomEvent('mint-coach-mark-reposition', {
        detail: {
          targetElement: globalPopoverState.value.targetElement,
          step: globalPopoverState.value.step,
          position: globalPopoverState.value.position
        }
      })
      window.dispatchEvent(event)

      // Also update the position to trigger reactivity
      repositionPopover()
    }
  }

  return {
    popoverState,
    updatePopoverState,
    showPopover,
    hidePopover,
    repositionPopover,
    forceRepositioning,
    completePositioning,
    setProvider
  } as const
}

/**
 * Get the current global popover state (read-only)
 */
export const getGlobalPopoverState = (): ComputedRef<PopoverCommunication> => {
  return computed(() => globalPopoverState.value)
}

/**
 * Reset global popover state (for testing or cleanup)
 */
export const resetGlobalPopoverState = (): void => {
  globalPopoverState.value = {
    visible: false,
    targetElement: null,
    step: null,
    position: null,
    provider: 'mint',
    isPositioning: false
  }
  activeInstances.clear()
}
