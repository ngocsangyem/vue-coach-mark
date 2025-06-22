/**
 * State management composable for MintCoachMark
 * Manages reactive state using Vue's reactivity system
 */

import { reactive, computed, type ComputedRef } from 'vue'
import type { CoachMarkState, CoachMarkStep, StageDefinition, PopoverDOM } from '../types'

// Global state instance
const globalState = reactive<CoachMarkState>({
  isInitialized: false,
  activeIndex: undefined,
  activeElement: undefined,
  activeStep: undefined,
  previousElement: undefined,
  previousStep: undefined,
  popover: undefined,

  // Internal state (using descriptive naming conventions)
  internalPreviousElement: undefined,
  currentActiveElement: undefined,
  internalPreviousStep: undefined,
  currentActiveStep: undefined,
  internalActiveOnDestroyed: undefined,
  internalResizeTimeout: undefined,
  internalTransitionCallback: undefined,
  currentActiveStagePosition: undefined,
  internalOverlaySvg: undefined
})

export function useCoachMarkState() {
  /**
   * Set a state value
   */
  function setState<K extends keyof CoachMarkState>(key: K, value: CoachMarkState[K]): void {
    globalState[key] = value
  }

  /**
   * Get a state value or the entire state
   */
  function getState(): CoachMarkState
  function getState<K extends keyof CoachMarkState>(key: K): CoachMarkState[K]
  function getState<K extends keyof CoachMarkState>(key?: K) {
    return key ? globalState[key] : globalState
  }

  /**
   * Reset all state to initial values
   */
  function resetState(): void {
    Object.keys(globalState).forEach(key => {
      delete globalState[key as keyof CoachMarkState]
    })

    globalState.isInitialized = false
    globalState.activeIndex = undefined
    globalState.activeElement = undefined
    globalState.activeStep = undefined
    globalState.previousElement = undefined
    globalState.previousStep = undefined
    globalState.popover = undefined
    globalState.internalPreviousElement = undefined
    globalState.currentActiveElement = undefined
    globalState.internalPreviousStep = undefined
    globalState.currentActiveStep = undefined
    globalState.internalActiveOnDestroyed = undefined
    globalState.internalResizeTimeout = undefined
    globalState.internalTransitionCallback = undefined
    globalState.currentActiveStagePosition = undefined
    globalState.internalOverlaySvg = undefined
  }

  // Computed properties for common state queries
  const isActive: ComputedRef<boolean> = computed(() => !!globalState.isInitialized)
  
  const activeIndex: ComputedRef<number | undefined> = computed(() => globalState.activeIndex)
  
  const activeElement: ComputedRef<Element | undefined> = computed(() => globalState.activeElement)
  
  const activeStep: ComputedRef<CoachMarkStep | undefined> = computed(() => globalState.activeStep)
  
  const previousElement: ComputedRef<Element | undefined> = computed(() => globalState.previousElement)
  
  const previousStep: ComputedRef<CoachMarkStep | undefined> = computed(() => globalState.previousStep)
  
  const popover: ComputedRef<PopoverDOM | undefined> = computed(() => globalState.popover)
  
  const isTransitioning: ComputedRef<boolean> = computed(() => !!globalState.internalTransitionCallback)

  const activeStagePosition: ComputedRef<StageDefinition | undefined> = computed(
    () => globalState.currentActiveStagePosition
  )

  return {
    // State management
    setState,
    getState,
    resetState,
    
    // Reactive state
    state: globalState,
    
    // Computed properties
    isActive,
    activeIndex,
    activeElement,
    activeStep,
    previousElement,
    previousStep,
    popover,
    isTransitioning,
    activeStagePosition
  }
}
