<template>
  <div class="mint-coach-mark">
    <!-- Slot-based popover implementation -->
    <slot
      :visible="popoverState.visible"
      :target-element="popoverState.targetElement"
      :current-step="currentStep"
      :current-step-index="currentStepIndex"
      :total-steps="totalSteps"
      :on-next="handleNext"
      :on-previous="handlePrevious"
      :on-close="handleClose"
      :on-skip="handleSkip"
      :config="mergedConfig"
      :positioning-key="positioningKey"
      :position="popoverState.position"
      :is-positioning="popoverState.isPositioning"
    >
      <!-- Default MintPopover when no custom popover is provided -->
      <MintPopover
        :visible="popoverState.visible"
        :target-element="popoverState.targetElement"
        :step="popoverState.step"
        :title="popoverState.step?.popover?.title"
        :description="popoverState.step?.popover?.description"
        :side="popoverState.step?.popover?.side || 'bottom'"
        :show-buttons="popoverState.step?.popover?.showButtons || ['next', 'previous', 'close', 'skip']"
        :disable-buttons="popoverState.step?.popover?.disableButtons || []"
        :show-progress="popoverState.step?.popover?.showProgress || false"
        :progress-text="popoverState.step?.popover?.progressText || ''"
        :next-btn-text="popoverState.step?.popover?.nextBtnText || 'Next'"
        :prev-btn-text="popoverState.step?.popover?.prevBtnText || 'Previous'"
        :skip-btn-text="popoverState.step?.popover?.skipBtnText || mergedConfig?.skipBtnText || 'Skip Tour'"
        :popover-class="popoverState.step?.popover?.popoverClass || ''"
        :offset="mergedConfig?.popoverOffset || 10"
        @next="handleNext"
        @previous="handlePrevious"
        @close="handleClose"
        @skip="handleSkip"
        @rendered="handlePopoverRendered"
        @destroyed="handlePopoverDestroyed"
      >
        <!-- Forward nested slots for MintPopover customization -->
        <template v-if="$slots.title" #title>
          <slot name="title" :step="currentStep" :index="currentStepIndex" />
        </template>

        <template v-if="$slots.content" #content>
          <slot name="content" :step="currentStep" :index="currentStepIndex" />
        </template>

        <template v-if="$slots.progress" #progress>
          <slot name="progress" :step="currentStep" :index="currentStepIndex" :total="totalSteps" />
        </template>

        <template v-if="$slots['next-button']" #next-button>
          <slot name="next-button" :step="currentStep" :index="currentStepIndex" />
        </template>

        <template v-if="$slots['prev-button']" #prev-button>
          <slot name="prev-button" :step="currentStep" :index="currentStepIndex" />
        </template>

        <template v-if="$slots['close-icon']" #close-icon>
          <slot name="close-icon" />
        </template>

        <template v-if="$slots['skip-button']" #skip-button>
          <slot name="skip-button" :step="currentStep" :index="currentStepIndex" />
        </template>
      </MintPopover>
    </slot>
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
import MintPopover from './MintPopover.vue'
import { useCoachMark } from '../composables/useCoachMark'
import { useCoachMarkState } from '../composables/useCoachMarkState'
import { usePopoverCommunication } from '../composables/usePopoverCommunication'
import { getElement } from '../utils'
import type {
  CoachMarkConfig,
  CoachMarkStep,
  MintCoachMarkProps,
  MintCoachMarkEmits,
  PopoverDOM,
  CoachMarkDriver
} from '../types'

const props = withDefaults(defineProps<MintCoachMarkProps>(), {
  modelValue: false,
  autoStart: false,
  steps: () => [],
  config: () => ({})
})

const emit = defineEmits<MintCoachMarkEmits>()

// Initialize coach mark with merged config
const mergedConfig: ComputedRef<CoachMarkConfig> = computed<CoachMarkConfig>(() => ({
  steps: props.steps,
  ...props.config
}))

const {
  isActive,
  currentStepIndex: activeStepIndex,
  drive,
  destroy,
  moveNext,
  movePrevious,
  setConfig,
  getActiveStep,
  getActiveElement,
  getConfig,
  skipTour
} = useCoachMark(mergedConfig.value)

const { getState, setState } = useCoachMarkState()

// Initialize popover communication
const {
  popoverState,
  showPopover: showPopoverCommunication,
  hidePopover: hidePopoverCommunication,
  forceRepositioning,
  completePositioning
} = usePopoverCommunication(`coach-mark-${Date.now()}`)

// Computed properties
const currentStep: ComputedRef<CoachMarkStep | undefined> = computed(() => getActiveStep())
const totalSteps: ComputedRef<number> = computed(() => props.steps?.length || 0)
const currentStepIndex: ComputedRef<number | undefined> = computed(() => activeStepIndex.value)

// Positioning key for forcing custom popover repositioning
const positioningKey: ComputedRef<string> = computed(() => {
  const step = currentStepIndex.value
  const element = popoverState.value.targetElement
  const elementId = element?.id || element?.className || element?.tagName || 'unknown'
  return `${step}-${elementId}-${Date.now()}`
})

// Watch for state changes that should trigger popover rendering
watch(() => getState('shouldRenderPopover'), (renderData) => {
  if (renderData && renderData.element && renderData.step) {
    // Start with positioning state to prevent visual flash
    showPopoverCommunication(renderData.element, renderData.step, true)
    setState('shouldRenderPopover', undefined)

    // Complete positioning after a short delay to ensure smooth rendering
    nextTick(() => {
      setTimeout(() => {
        forceRepositioning()
        // Mark positioning as complete
        setTimeout(() => {
          completePositioning()
        }, 50)
      }, 100)
    })
  }
})

// Watch for popover repositioning
watch(() => getState('shouldRepositionPopover'), (repositionData) => {
  if (repositionData && repositionData.element && repositionData.step) {
    // Hide and show popover to force repositioning
    hidePopoverCommunication()
    nextTick(() => {
      showPopoverCommunication(repositionData.element, repositionData.step)
    })
    setState('shouldRepositionPopover', undefined)
  }
})

// Watch for model value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && !isActive.value) {
    startTour()
  } else if (!newValue && isActive.value) {
    stopTour()
  }
})

/**
 * Create a driver interface for hook callbacks
 */
const createDriverInterface = (): CoachMarkDriver => {
  return {
    isActive: (): boolean => isActive.value,
    refresh: (): void => {}, // Will be implemented by highlight composable
    drive,
    setConfig,
    setSteps: (steps: CoachMarkStep[]): void => {
      setConfig({ ...getConfig(), steps })
    },
    getConfig,
    getState,
    getActiveIndex: (): number | undefined => currentStepIndex.value,
    isFirstStep: (): boolean => currentStepIndex.value === 0,
    isLastStep: (): boolean => {
      const steps = props.steps || []
      return currentStepIndex.value !== undefined && currentStepIndex.value === steps.length - 1
    },
    getActiveStep,
    getActiveElement,
    getPreviousElement: () => getState('previousElement'),
    getPreviousStep: () => getState('previousStep'),
    moveNext,
    movePrevious,
    moveTo: (index: number): void => drive(index),
    skipTour,
    hasNextStep: (): boolean => {
      const steps = props.steps || []
      return currentStepIndex.value !== undefined && !!steps[currentStepIndex.value + 1]
    },
    hasPreviousStep: (): boolean => {
      const steps = props.steps || []
      return currentStepIndex.value !== undefined && !!steps[currentStepIndex.value - 1]
    },
    highlight: (step: CoachMarkStep): void => {
      // This would be implemented by the highlight composable
      console.warn('highlight method not implemented in component context')
    },
    destroy
  }
}

// Watch for config changes
watch(() => mergedConfig.value, (newConfig: CoachMarkConfig) => {
  setConfig(newConfig)
}, { deep: true })

// Event handlers using arrow functions with explicit return types
const handleNext = (): void => {
  const activeStep = getActiveStep()
  const activeElement = getActiveElement()

  if (activeStep?.popover?.onNextClick) {
    const driver = createDriverInterface()

    activeStep.popover.onNextClick(activeElement, activeStep, {
      config: getConfig(),
      state: getState(),
      driver
    })
  } else {
    moveNext()
  }
}

const handlePrevious = (): void => {
  const activeStep = getActiveStep()
  const activeElement = getActiveElement()

  if (activeStep?.popover?.onPrevClick) {
    const driver = createDriverInterface()

    activeStep.popover.onPrevClick(activeElement, activeStep, {
      config: getConfig(),
      state: getState(),
      driver
    })
  } else {
    movePrevious()
  }
}

const handleClose = (): void => {
  const activeStep = getActiveStep()
  const activeElement = getActiveElement()

  if (activeStep?.popover?.onCloseClick) {
    const driver = createDriverInterface()

    activeStep.popover.onCloseClick(activeElement, activeStep, {
      config: getConfig(),
      state: getState(),
      driver
    })
  } else {
    stopTour()
  }
}

const handleSkip = (): void => {
  const activeStep = getActiveStep()
  const activeElement = getActiveElement()
  const currentIndex = currentStepIndex.value || 0

  // Emit skip event
  if (activeStep) {
    emit('tour-skipped', activeStep, currentIndex)
  }

  if (activeStep?.popover?.onSkipClick) {
    const driver = createDriverInterface()

    activeStep.popover.onSkipClick(activeElement, activeStep, {
      config: getConfig(),
      state: getState(),
      driver
    })
  } else {
    skipTour()
    stopTour()
  }
}

/**
 * Type guard to check if element is HTMLElement
 */
const isHTMLElement = (element: Element | null): element is HTMLElement => {
  return element !== null && element instanceof HTMLElement
}

/**
 * Safely query for HTMLElement with type checking
 */
const safeQuerySelector = (parent: HTMLElement, selector: string): HTMLElement => {
  const element = parent.querySelector(selector)
  if (!isHTMLElement(element)) {
    // Create a placeholder element if not found
    const placeholder = document.createElement('div')
    placeholder.style.display = 'none'
    return placeholder
  }
  return element
}

const handlePopoverRendered = (popover: HTMLElement): void => {
  // Store popover DOM reference with safe type checking
  const popoverDOM: PopoverDOM = {
    wrapper: popover,
    arrow: safeQuerySelector(popover, '.mint-coach-mark-popover__arrow'),
    title: safeQuerySelector(popover, '.mint-coach-mark-popover__title'),
    description: safeQuerySelector(popover, '.mint-coach-mark-popover__description'),
    footer: safeQuerySelector(popover, '.mint-coach-mark-popover__footer'),
    progress: safeQuerySelector(popover, '.mint-coach-mark-popover__progress'),
    nextBtn: safeQuerySelector(popover, '.mint-coach-mark-popover__btn--next'),
    prevBtn: safeQuerySelector(popover, '.mint-coach-mark-popover__btn--prev'),
    closeBtn: safeQuerySelector(popover, '.mint-coach-mark-popover__close')
  }

  setState('popover', popoverDOM)

  // Call onPopoverRender hook if provided
  const config = getConfig()
  const onPopoverRender = config.onPopoverRender
  if (onPopoverRender) {
    const driver = createDriverInterface()

    onPopoverRender(popoverDOM, {
      config,
      state: getState(),
      driver
    })
  }
}

const handlePopoverDestroyed = (): void => {
  // Clean up popover DOM reference
  setState('popover', undefined)
}

// Public methods using arrow functions with explicit return types
const startTour = (stepIndex: number = 0): void => {
  if (!props.steps?.length) {
    console.warn('MintCoachMark: No steps provided')
    return
  }

  emit('tour-start')
  emit('update:modelValue', true)
  drive(stepIndex)
}

const stopTour = (): void => {
  // Hide popover using communication system to fix persistence issue
  hidePopoverCommunication()

  // Destroy the tour
  destroy()

  // Emit completion events
  emit('tour-complete')
  emit('update:modelValue', false)
}



// Watch for step changes to emit events
watch(() => currentStepIndex.value, (newIndex: number | undefined, oldIndex: number | undefined) => {
  if (typeof newIndex === 'number' && newIndex !== oldIndex) {
    const step = props.steps?.[newIndex]
    if (step) {
      emit('step-change', step, newIndex)
    }
  }
})

// Watch for tour completion to ensure popover is hidden
watch(() => isActive.value, (active: boolean) => {
  if (!active) {
    // Ensure popover is hidden when tour becomes inactive
    hidePopoverCommunication()
  }
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
    // Ensure popover is hidden before destroying
    hidePopoverCommunication()
    destroy()
  }
})

// Define the exposed API interface
interface MintCoachMarkExposed {
  startTour: (stepIndex?: number) => void
  stopTour: () => void
  moveNext: () => void
  movePrevious: () => void
  skipTour: () => void
  isActive: () => boolean
  getCurrentStep: () => CoachMarkStep | undefined
  getCurrentStepIndex: () => number | undefined
}

// Expose public API
defineExpose<MintCoachMarkExposed>({
  startTour,
  stopTour,
  moveNext,
  movePrevious,
  skipTour: handleSkip,
  isActive: (): boolean => isActive.value,
  getCurrentStep: (): CoachMarkStep | undefined => currentStep.value,
  getCurrentStepIndex: (): number | undefined => currentStepIndex.value
})
</script>
