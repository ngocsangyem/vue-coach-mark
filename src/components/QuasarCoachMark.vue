<template>
  <div class="quasar-coach-mark">
    <!-- QTooltip-based popover implementation -->
    <QTooltip
      v-if="shouldShowTooltip"
      :key="`tooltip-${tooltipRefreshKey}`"
      v-model="tooltipVisible"
      :target="popoverState.targetElement || undefined"
      :anchor="quasarAnchor"
      :self="quasarSelf"
      :offset="quasarOffset"
      :delay="1000"
      :hide-delay="50"
      no-parent-event
      class="mint-coach-mark-quasar-tooltip"
      :class="currentStep?.popover?.popoverClass"
      @show="handleTooltipShow"
      @hide="handleTooltipHide"
    >
      <div class="mint-coach-mark-quasar-wrapper">
        <!-- Title -->
        <div v-if="currentStep?.popover?.title" class="mint-coach-mark-quasar-title">
          <slot name="title" :step="currentStep" :index="currentStepIndex">
            {{ currentStep.popover.title }}
          </slot>
        </div>
        
        <!-- Description -->
        <div v-if="currentStep?.popover?.description" class="mint-coach-mark-quasar-description">
          <slot name="content" :step="currentStep" :index="currentStepIndex">
            {{ currentStep.popover.description }}
          </slot>
        </div>
        
        <!-- Progress -->
        <div 
          v-if="currentStep?.popover?.showProgress" 
          class="mint-coach-mark-quasar-progress"
        >
          <slot name="progress" :step="currentStep" :index="currentStepIndex" :total="totalSteps">
            <div class="mint-coach-mark-quasar-progress-text">
              {{ progressText }}
            </div>
            <div class="mint-coach-mark-quasar-progress-bar">
              <div 
                class="mint-coach-mark-quasar-progress-fill" 
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
          </slot>
        </div>
        
        <!-- Buttons -->
        <div class="mint-coach-mark-quasar-footer">
          <slot name="skip-button" :step="currentStep" :index="currentStepIndex">
            <button
              v-if="shouldShowSkipButton"
              @click="handleSkip"
              class="mint-coach-mark-quasar-btn mint-coach-mark-quasar-btn--skip"
              :disabled="disableButtons.includes('skip')"
            >
              {{ skipBtnText }}
            </button>
          </slot>

          <slot name="prev-button" :step="currentStep" :index="currentStepIndex">
            <button
              v-if="showButtons.includes('previous')"
              @click="handlePrevious"
              class="mint-coach-mark-quasar-btn mint-coach-mark-quasar-btn--prev"
              :disabled="disableButtons.includes('previous') || (currentStepIndex || 0) === 0"
            >
              {{ currentStep?.popover?.prevBtnText || 'Previous' }}
            </button>
          </slot>

          <slot name="next-button" :step="currentStep" :index="currentStepIndex">
            <button
              v-if="showButtons.includes('next')"
              @click="handleNext"
              class="mint-coach-mark-quasar-btn mint-coach-mark-quasar-btn--next"
              :disabled="disableButtons.includes('next')"
            >
              {{ currentStep?.popover?.nextBtnText || (isLastStep ? 'Done' : 'Next') }}
            </button>
          </slot>

          <slot name="close-icon">
            <button
              v-if="showButtons.includes('close')"
              @click="handleClose"
              class="mint-coach-mark-quasar-btn mint-coach-mark-quasar-btn--close"
              :disabled="disableButtons.includes('close')"
              aria-label="Close"
            >
              ×
            </button>
          </slot>
        </div>
      </div>
    </QTooltip>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  type Ref,
  type ComputedRef
} from 'vue'
import { QTooltip } from 'quasar'
import { useCoachMark } from '../composables/useCoachMark'
import { useCoachMarkState } from '../composables/useCoachMarkState'
import { usePopoverCommunication } from '../composables/usePopoverCommunication'
import { useAsyncTour } from '../composables/useAsyncTour'
import { useScrollBlocking } from '../composables/useScrollBlocking'
import { useTooltipManagement } from '../composables/useTooltipManagement'
import { useQuasarWatchers } from '../composables/useQuasarWatchers'
import { getElement, getEffectivePadding } from '../utils'
import type {
  CoachMarkConfig,
  CoachMarkStep,
  MintCoachMarkProps,
  MintCoachMarkEmits,
  CoachMarkDriver,
  Side
} from '../types'

// Define props with same interface as MintCoachMark
const props = withDefaults(defineProps<MintCoachMarkProps>(), {
  modelValue: false,
  steps: () => [],
  config: () => ({}),
  autoStart: false
})

// Define emits with same interface as MintCoachMark
const emit = defineEmits<MintCoachMarkEmits>()

// Initialize coach mark state
const {
  setState,
  getState
} = useCoachMarkState();

// Initialize coach mark functionality
const {
  isActive,
  currentStepIndex,
  getActiveStep,
  drive,
  destroy,
  refresh,
  setSteps,
  setConfig,
  getConfig,
  skipTour
} = useCoachMark(props.config);

// Set initial steps
setSteps(props.steps)

// Computed config
const mergedConfig = computed(() => getConfig());

// Initialize popover communication
const {
  popoverState,
  showPopover: showPopoverCommunication,
  hidePopover: hidePopoverCommunication
} = usePopoverCommunication(`quasar-coach-mark-${Date.now()}`);

// Initialize async tour functionality
const {
  isAsyncOperationInProgress,
  handleAsyncNavigation,
  handleStepDeselection
} = useAsyncTour({
  onAsyncOperationStart: () => {
    console.log('🔄 Async operation started')
  },
  onAsyncOperationComplete: () => {
    console.log('✅ Async operation completed')
  },
  onAsyncOperationError: (error: Error) => {
    console.error('❌ Async operation failed:', error)
  }
})

// Initialize scroll blocking functionality
const { blockScrolling, unblockScrolling } = useScrollBlocking();

// Flag to prevent conflicts during step transitions
const isTransitioning: Ref<boolean> = ref(false)

// Computed properties
const currentStep: ComputedRef<CoachMarkStep | undefined> = computed(() => getActiveStep())
const totalSteps: ComputedRef<number> = computed(() => props.steps?.length || 0)
const isLastStep: ComputedRef<boolean> = computed(() =>
  currentStepIndex.value === totalSteps.value - 1
)

// Quasar positioning mapping with proper types
type QuasarAnchor = 'bottom middle' | 'top middle' | 'center right' | 'center left' | 'center middle'

const quasarPositionMap: Record<Side, { anchor: QuasarAnchor; self: QuasarAnchor }> = {
  top: { anchor: 'bottom middle', self: 'top middle' },
  bottom: { anchor: 'top middle', self: 'bottom middle' },
  left: { anchor: 'center right', self: 'center left' },
  right: { anchor: 'center left', self: 'center right' },
  over: { anchor: 'center middle', self: 'center middle' }
}

const quasarAnchor: ComputedRef<QuasarAnchor> = computed(() => {
  const side = currentStep.value?.popover?.side || 'bottom'
  return quasarPositionMap[side]?.anchor || quasarPositionMap.bottom.anchor
})

const quasarSelf: ComputedRef<QuasarAnchor> = computed(() => {
  const side = currentStep.value?.popover?.side || 'bottom'
  return quasarPositionMap[side]?.self || quasarPositionMap.bottom.self
})

// Quasar offset calculation including padding
const quasarOffset: ComputedRef<[number, number]> = computed(() => {
  const baseOffset = 10

  // Get effective padding value
  const config = getConfig()
  const globalPadding = config.padding || 10
  const effectivePadding = getEffectivePadding(
    currentStep.value?.popover?.padding,
    globalPadding,
    10
  )

  // Add padding to the base offset for proper spacing
  const totalOffset = baseOffset + effectivePadding

  return [totalOffset, totalOffset]
})

// Button configuration
const showButtons: ComputedRef<string[]> = computed(() =>
  currentStep.value?.popover?.showButtons || ['next', 'previous', 'close', 'skip']
)

const disableButtons: ComputedRef<string[]> = computed(() =>
  currentStep.value?.popover?.disableButtons || []
)

// Skip button configuration
const shouldShowSkipButton: ComputedRef<boolean> = computed(() => {
  // Only show skip button on first step if enabled
  const allowSkip = mergedConfig.value.allowSkip !== false // Default to true
  const isFirstStep = (currentStepIndex.value || 0) === 0
  const showSkip = showButtons.value.includes('skip')

  return allowSkip && isFirstStep && showSkip
})

const skipBtnText: ComputedRef<string> = computed(() =>
  currentStep.value?.popover?.skipBtnText ||
  mergedConfig.value.skipBtnText ||
  'Skip Tour'
)

// Progress calculation
const progressText: ComputedRef<string> = computed(() => {
  const text = currentStep.value?.popover?.progressText || 'Step {{current}} of {{total}}'
  return text
    .replace('{{current}}', String((currentStepIndex.value || 0) + 1))
    .replace('{{total}}', String(totalSteps.value))
})

const progressPercentage: ComputedRef<number> = computed(() => {
  if (totalSteps.value === 0) return 0
  return ((currentStepIndex.value || 0) + 1) / totalSteps.value * 100
})

// Enhanced visibility logic to prevent content flashing during transitions
const shouldShowTooltip: ComputedRef<boolean> = computed(() => {
  // Don't show tooltip during step transitions to prevent content flashing
  if (isTransitioning.value) {
    return false
  }

  // Basic visibility requirements
  const hasBasicRequirements = popoverState.value.visible &&
                               popoverState.value.targetElement

  if (!hasBasicRequirements) {
    return false
  }

  // Ensure we have valid step data to prevent showing stale content
  const hasValidStepData = popoverState.value.step &&
                          currentStep.value &&
                          popoverState.value.step.element === currentStep.value.element

  return !!hasValidStepData
})

// Initialize tooltip management with internal display function
const tooltipManagement = useTooltipManagement(async () => {
  await showTooltipIfReadyInternal()
})

const {
  tooltipVisible,
  tooltipRefreshKey,
  showTooltipIfReady,
  setStepTransitioning
} = tooltipManagement

/**
 * Ensure QTooltip is completely hidden before proceeding
 */
const ensureTooltipHidden = async (): Promise<void> => {
  if (tooltipVisible.value) {
    console.log('🔒 Hiding tooltip and waiting for animation to complete')
    tooltipVisible.value = false

    // Wait for Vue reactivity to process and QTooltip's hide delay
    await nextTick()

    console.log('✅ Tooltip hide animation complete')
  }
}

/**
 * Ensure all step processing is complete before showing tooltip
 */
const ensureStepProcessingComplete = async (): Promise<void> => {
  console.log('⏳ Waiting for step processing to complete')

  // Wait for Vue reactivity to process the step change
  await nextTick()

  // Extra safety for tour start - wait if currentStep is still not available
  let retryCount = 0
  const maxRetries = 3

  while (retryCount < maxRetries && !currentStep.value && popoverState.value.step) {
    console.log(`🔄 CurrentStep not ready, retry ${retryCount + 1}/${maxRetries}`)
    await nextTick()
    retryCount++
  }

  // Additional wait for async operations
  if (isAsyncOperationInProgress.value) {
    console.log('⏳ Async operation in progress, waiting for stability...')
    await nextTick()
  }

  console.log('✅ Step processing complete', {
    hasCurrentStep: !!currentStep.value,
    hasPopoverStep: !!popoverState.value.step,
    retryCount,
    isAsyncOperation: isAsyncOperationInProgress.value
  })
}

/**
 * Internal implementation - show tooltip only if all conditions are met
 */
const showTooltipIfReadyInternal = async (): Promise<void> => {
  // Verify all conditions are met before showing
  const hasValidStep = !!(popoverState.value.step || currentStep.value)
  const isReady = popoverState.value.visible &&
                  popoverState.value.targetElement &&
                  hasValidStep &&
                  !isTransitioning.value

  if (isReady) {
    const stepTitle = popoverState.value.step?.popover?.title || currentStep.value?.popover?.title || 'Unknown'
    console.log('🎯 All conditions met, showing tooltip for step:', stepTitle)

    // Use QTooltip's native delay handling - just set visibility
    if (!tooltipVisible.value) {
      await nextTick()
      tooltipVisible.value = true
    } else {
      console.log('✅ Tooltip already visible, skipping display logic')
    }
  } else {
    console.log('⚠️ Conditions not met for showing tooltip:', {
      popoverVisible: popoverState.value.visible,
      hasTargetElement: !!popoverState.value.targetElement,
      hasPopoverStep: !!popoverState.value.step,
      hasCurrentStep: !!currentStep.value,
      hasValidStep: hasValidStep,
      isNotTransitioning: !isTransitioning.value
    })

    // Simple retry for missing step data
    if (popoverState.value.visible && popoverState.value.targetElement && !isTransitioning.value && !hasValidStep) {
      console.log('🔄 Step data not ready, waiting...')
      await nextTick()

      const retryHasValidStep = !!(popoverState.value.step || currentStep.value)
      if (retryHasValidStep && !tooltipVisible.value) {
        console.log('✅ Step data now available, showing tooltip')
        tooltipVisible.value = true
      }
    }
  }
}

// Initialize watcher management after function declarations
const watchers = useQuasarWatchers({
  getState,
  setState: setState as (key: string, value: any) => void,
  showPopoverCommunication,
  ensureTooltipHidden,
  ensureStepProcessingComplete,
  popoverState,
  isTransitioning,
  tooltipManagement,
  scrollBlocking: {
    blockScrolling,
    unblockScrolling,
    isBlocked: ref(false),
    getScrollPosition: () => ({ x: 0, y: 0 }),
    forceUnblock: () => unblockScrolling()
  }
})

// Initialize all watchers
watchers.initWatchers()

// Watch for model value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && !isActive.value) {
    startTour()
  } else if (!newValue && isActive.value) {
    stopTour()
  }
})

// Watch for step changes to ensure tooltip synchronization
watch(() => currentStep.value, async (newStep, oldStep) => {
  // Only handle step changes if we're not already transitioning
  if (newStep && oldStep && newStep !== oldStep && tooltipVisible.value && !isTransitioning.value) {
    console.log('🔄 Step change detected, syncing tooltip:', {
      oldStep: oldStep?.popover?.title,
      newStep: newStep?.popover?.title
    })

    try {
      // 1. Immediately hide tooltip to prevent content flashing
      tooltipVisible.value = false

      // 2. Ensure tooltip is completely hidden
      await ensureTooltipHidden()

      // 3. Wait for content to be updated
      await ensureStepProcessingComplete()

      // 4. Show tooltip if conditions are met
      await showTooltipIfReady('step-change-watcher')

    } catch (error) {
      console.error('Error during step change synchronization:', error)
    }
  }
})

/**
 * Create a driver interface for hook callbacks
 */
const createDriverInterface = (): CoachMarkDriver => {
  return {
    isActive: () => isActive.value,
    refresh: () => refresh(),
    drive: (stepIndex?: number) => drive(stepIndex),
    setConfig: (config) => setConfig(config),
    setSteps: (steps) => setSteps(steps),
    getConfig: () => getConfig(),
    getState: (key?: string) => getState(key as any),
    getActiveIndex: () => currentStepIndex.value,
    isFirstStep: () => currentStepIndex.value === 0,
    isLastStep: () => currentStepIndex.value === totalSteps.value - 1,
    getActiveStep: () => getActiveStep(),
    getActiveElement: () => popoverState.value.targetElement || undefined,
    getPreviousElement: () => undefined,
    getPreviousStep: () => undefined,
    moveNext: () => moveNext(),
    movePrevious: () => movePrevious(),
    moveTo: (index: number) => moveTo(index),
    skipTour: () => handleSkip(),
    hasNextStep: () => currentStepIndex.value !== undefined && currentStepIndex.value < totalSteps.value - 1,
    hasPreviousStep: () => currentStepIndex.value !== undefined && currentStepIndex.value > 0,
    highlight: (step) => drive(props.steps.indexOf(step)),
    destroy: () => destroy()
  }
}

/**
 * Start the tour
 */
const startTour = (stepIndex?: number): void => {
  if (props.steps.length === 0) {
    console.warn('No steps provided for the tour')
    return
  }

  // Block scrolling when starting the tour
  blockScrolling()

  drive(stepIndex)
  emit('update:modelValue', true)
  emit('tour-start')

  // Unblock scrolling after initial step is positioned
  // This will be handled by the step processing completion
}

/**
 * Stop the tour
 */
const stopTour = (): void => {
  tooltipVisible.value = false
  hidePopoverCommunication()
  destroy()

  // Unblock scrolling when tour ends
  unblockScrolling()

  emit('update:modelValue', false)
  emit('tour-complete')
}

/**
 * Move to next step
 */
const moveNext = async (): Promise<void> => {
  const currentIndex = currentStepIndex.value
  if (currentIndex !== undefined && currentIndex < totalSteps.value - 1) {
    console.log('🚀 Moving to next step:', currentIndex + 1)

    try {
      // 1. Block scrolling immediately before any transition work
      blockScrolling()

      // 2. Set transitioning flags to prevent conflicts
      isTransitioning.value = true
      setStepTransitioning(true)

      // 3. Immediately hide tooltip and clear popover state to prevent content flashing
      tooltipVisible.value = false
      hidePopoverCommunication()

      // 3. Handle step deselection for current step
      const currentElement = popoverState.value.targetElement
      const currentStepData = currentStep.value
      if (currentElement && currentStepData) {
        await handleStepDeselection(currentElement, currentStepData, createDriverInterface())
      }

      // 4. Ensure QTooltip is completely hidden before step transition
      await ensureTooltipHidden()

      // 5. Perform step change
      const nextIndex = currentIndex + 1
      console.log('🔄 Executing step change to:', nextIndex)
      drive(nextIndex)
      emit('step-change', props.steps[nextIndex], nextIndex)

      // 6. Wait for all step processing to complete
      await ensureStepProcessingComplete()

      // 7. Clear transitioning flags
      isTransitioning.value = false
      setStepTransitioning(false)

      // 8. Show tooltip only if all conditions are met
      await showTooltipIfReady('step-transition-moveNext')

      // 9. Unblock scrolling after everything is complete and positioned
      unblockScrolling()

    } catch (error) {
      console.error('Error during step transition:', error)
      isTransitioning.value = false
      setStepTransitioning(false)
      unblockScrolling() // Ensure scrolling is unblocked on error
    }
  } else {
    // Tour completed
    stopTour()
  }
}

/**
 * Move to previous step
 */
const movePrevious = async (): Promise<void> => {
  const currentIndex = currentStepIndex.value
  if (currentIndex !== undefined && currentIndex > 0) {
    console.log('🔙 Moving to previous step:', currentIndex - 1)

    try {
      // 1. Block scrolling immediately before any transition work
      blockScrolling()

      // 2. Set transitioning flags to prevent conflicts
      isTransitioning.value = true
      setStepTransitioning(true)

      // 3. Immediately hide tooltip and clear popover state to prevent content flashing
      tooltipVisible.value = false
      hidePopoverCommunication()

      // 3. Handle step deselection for current step
      const currentElement = popoverState.value.targetElement
      const currentStepData = currentStep.value
      if (currentElement && currentStepData) {
        await handleStepDeselection(currentElement, currentStepData, createDriverInterface())
      }

      // 4. Ensure QTooltip is completely hidden before step transition
      await ensureTooltipHidden()

      // 5. Perform step change
      const prevIndex = currentIndex - 1
      console.log('🔄 Executing step change to:', prevIndex)
      drive(prevIndex)
      emit('step-change', props.steps[prevIndex], prevIndex)

      // 6. Wait for all step processing to complete
      await ensureStepProcessingComplete()

      // 7. Clear transitioning flags
      isTransitioning.value = false
      setStepTransitioning(false)

      // 8. Show tooltip only if all conditions are met
      await showTooltipIfReady('step-transition-movePrevious')

      // 9. Unblock scrolling after everything is complete and positioned
      unblockScrolling()

    } catch (error) {
      console.error('Error during step transition:', error)
      isTransitioning.value = false
      setStepTransitioning(false)
      unblockScrolling() // Ensure scrolling is unblocked on error
    }
  }
}

/**
 * Move to specific step
 */
const moveTo = async (stepIndex: number): Promise<void> => {
  if (stepIndex >= 0 && stepIndex < totalSteps.value) {
    console.log('🎯 Moving to step:', stepIndex)

    try {
      // 1. Block scrolling immediately before any transition work
      blockScrolling()

      // 2. Set transitioning flags to prevent conflicts
      isTransitioning.value = true
      setStepTransitioning(true)

      // 3. Immediately hide tooltip and clear popover state to prevent content flashing
      tooltipVisible.value = false
      hidePopoverCommunication()

      // 3. Handle step deselection for current step
      const currentElement = popoverState.value.targetElement
      const currentStepData = currentStep.value
      if (currentElement && currentStepData) {
        await handleStepDeselection(currentElement, currentStepData, createDriverInterface())
      }

      // 4. Ensure QTooltip is completely hidden before step transition
      await ensureTooltipHidden()

      // 5. Perform step change
      console.log('🔄 Executing step change to:', stepIndex)
      drive(stepIndex)
      emit('step-change', props.steps[stepIndex], stepIndex)

      // 6. Wait for all step processing to complete
      await ensureStepProcessingComplete()

      // 7. Clear transitioning flags
      isTransitioning.value = false
      setStepTransitioning(false)

      // 8. Show tooltip only if all conditions are met
      await showTooltipIfReady('step-transition-moveTo')

      // 9. Unblock scrolling after everything is complete and positioned
      unblockScrolling()

    } catch (error) {
      console.error('Error during step transition:', error)
      isTransitioning.value = false
      setStepTransitioning(false)
      unblockScrolling() // Ensure scrolling is unblocked on error
    }
  }
}

// Event handlers with async support
const handleNext = async (): Promise<void> => {
  const element = popoverState.value.targetElement
  // Use popoverState.step as primary source since it's more reliable than currentStep computed
  const step = popoverState.value.step || currentStep.value

  if (element && step) {
    await handleAsyncNavigation(
      'next',
      element,
      step,
      createDriverInterface(),
      () => moveNext()
    )
  } else {
    moveNext()
  }
}

const handlePrevious = async (): Promise<void> => {
  const element = popoverState.value.targetElement
  // Use popoverState.step as primary source since it's more reliable than currentStep computed
  const step = popoverState.value.step || currentStep.value

  if (element && step) {
    await handleAsyncNavigation(
      'previous',
      element,
      step,
      createDriverInterface(),
      () => movePrevious()
    )
  } else {
    movePrevious()
  }
}

const handleClose = async (): Promise<void> => {
  const element = popoverState.value.targetElement
  // Use popoverState.step as primary source since it's more reliable than currentStep computed
  const step = popoverState.value.step || currentStep.value

  if (element && step) {
    await handleAsyncNavigation(
      'close',
      element,
      step,
      createDriverInterface(),
      () => stopTour()
    )
  } else {
    stopTour()
  }
}

const handleSkip = async (): Promise<void> => {
  const element = popoverState.value.targetElement
  // Use popoverState.step as primary source since it's more reliable than currentStep computed
  const step = popoverState.value.step || currentStep.value

  if (element && step) {
    // Emit skip event before handling async navigation
    emit('tour-skipped', step, currentStepIndex.value || 0)

    await handleAsyncNavigation(
      'skip',
      element,
      step,
      createDriverInterface(),
      () => {
        skipTour()
        stopTour()
      }
    )
  } else {
    // Emit skip event even if no element/step
    if (step) {
      emit('tour-skipped', step, currentStepIndex.value || 0)
    }
    skipTour()
    stopTour()
  }
}

const handleTooltipShow = (): void => {
  // Tooltip is now visible
}

const handleTooltipHide = (): void => {
  // Tooltip is now hidden
  if (isActive.value) {
    hidePopoverCommunication()
  }
}

// Define the exposed API interface
interface QuasarCoachMarkExposed {
  startTour: (stepIndex?: number) => void
  stopTour: () => void
  moveNext: () => void
  movePrevious: () => void
  moveTo: (stepIndex: number) => void
  skipTour: () => void
  isActive: () => boolean
  getCurrentStep: () => CoachMarkStep | undefined
  getCurrentStepIndex: () => number | undefined
}

// Expose public API
defineExpose<QuasarCoachMarkExposed>({
  startTour,
  stopTour,
  moveNext,
  movePrevious,
  moveTo,
  skipTour: handleSkip,
  isActive: (): boolean => isActive.value,
  getCurrentStep: (): CoachMarkStep | undefined => currentStep.value,
  getCurrentStepIndex: (): number | undefined => currentStepIndex.value
})

// Auto-start functionality
onMounted(() => {
  if (props.autoStart || props.modelValue) {
    nextTick(() => {
      startTour()
    })
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (isActive.value) {
    destroy()
  }

  // Ensure scroll blocking is removed on unmount
  unblockScrolling()
})
</script>
