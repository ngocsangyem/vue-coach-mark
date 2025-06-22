<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="popoverRef"
      :id="popoverId"
      class="mint-coach-mark-popover"
      :class="[popoverClass, `mint-coach-mark-popover--${side}`]"
      :style="popoverStyle"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="descriptionId"
    >
      <!-- Arrow -->
      <div
        ref="arrowRef"
        class="mint-coach-mark-popover__arrow"
        :class="`mint-coach-mark-popover__arrow--${side}`"
      />

      <!-- Header -->
      <header v-if="title || $slots.title" class="mint-coach-mark-popover__header">
        <h2 :id="titleId" class="mint-coach-mark-popover__title">
          <slot name="title">{{ title }}</slot>
        </h2>
        
        <button
          v-if="showCloseButton"
          type="button"
          class="mint-coach-mark-popover__close"
          :disabled="isCloseDisabled"
          @click="handleClose"
          aria-label="Close"
        >
          <slot name="close-icon">×</slot>
        </button>
      </header>

      <!-- Content -->
      <div :id="descriptionId" class="mint-coach-mark-popover__content">
        <slot name="content">
          <p v-if="description" class="mint-coach-mark-popover__description">
            {{ description }}
          </p>
        </slot>
      </div>

      <!-- Footer -->
      <footer v-if="showFooter" class="mint-coach-mark-popover__footer">
        <!-- Progress -->
        <div v-if="showProgress" class="mint-coach-mark-popover__progress">
          <slot name="progress">{{ progressText }}</slot>
        </div>

        <!-- Buttons -->
        <div class="mint-coach-mark-popover__buttons">
          <button
            v-if="showSkipButton"
            ref="skipBtnRef"
            type="button"
            class="mint-coach-mark-popover__btn mint-coach-mark-popover__btn--skip"
            :disabled="isSkipDisabled"
            @click="handleSkip"
          >
            <slot name="skip-button">{{ skipBtnText }}</slot>
          </button>

          <button
            v-if="showPreviousButton"
            ref="prevBtnRef"
            type="button"
            class="mint-coach-mark-popover__btn mint-coach-mark-popover__btn--prev"
            :disabled="isPrevDisabled"
            @click="handlePrevious"
          >
            <slot name="prev-button">{{ prevBtnText }}</slot>
          </button>

          <button
            v-if="showNextButton"
            ref="nextBtnRef"
            type="button"
            class="mint-coach-mark-popover__btn mint-coach-mark-popover__btn--next"
            :disabled="isNextDisabled"
            @click="handleNext"
          >
            <slot name="next-button">{{ nextBtnText }}</slot>
          </button>
        </div>
      </footer>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  type Ref,
  type ComputedRef
} from 'vue'
import { calculatePopoverPosition, getEffectivePadding } from '../utils'
import { useCoachMarkConfig } from '../composables/useCoachMarkConfig'
import type {
  Side,
  AllowedButtons,
  CoachMarkStep,
  MintPopoverProps,
  MintPopoverEmits
} from '../types'

const props = withDefaults(defineProps<MintPopoverProps>(), {
  visible: false,
  side: 'bottom',
  showButtons: () => ['next', 'previous', 'close', 'skip'],
  disableButtons: () => [],
  showProgress: false,
  progressText: '',
  nextBtnText: 'Next',
  prevBtnText: 'Previous',
  skipBtnText: 'Skip Tour',
  popoverClass: '',
  offset: 10
})

const emit = defineEmits<MintPopoverEmits>()

// Configuration access for padding
const { getConfig } = useCoachMarkConfig()

// Template refs
const popoverRef: Ref<HTMLElement | undefined> = ref<HTMLElement>()
const arrowRef: Ref<HTMLElement | undefined> = ref<HTMLElement>()
const nextBtnRef: Ref<HTMLElement | undefined> = ref<HTMLElement>()
const prevBtnRef: Ref<HTMLElement | undefined> = ref<HTMLElement>()
const skipBtnRef: Ref<HTMLElement | undefined> = ref<HTMLElement>()

// Unique IDs for accessibility
const popoverId: string = 'mint-coach-mark-popover-content'
const titleId: string = 'mint-coach-mark-popover-title'
const descriptionId: string = 'mint-coach-mark-popover-description'

// Computed properties
const showCloseButton: ComputedRef<boolean> = computed(() =>
  props.showButtons.includes('close') && !props.disableButtons.includes('close')
)

const showNextButton: ComputedRef<boolean> = computed(() =>
  props.showButtons.includes('next') && !props.disableButtons.includes('next')
)

const showPreviousButton: ComputedRef<boolean> = computed(() =>
  props.showButtons.includes('previous') && !props.disableButtons.includes('previous')
)

const showSkipButton: ComputedRef<boolean> = computed(() =>
  props.showButtons.includes('skip') && !props.disableButtons.includes('skip')
)

const isNextDisabled: ComputedRef<boolean> = computed(() => props.disableButtons.includes('next'))
const isPrevDisabled: ComputedRef<boolean> = computed(() => props.disableButtons.includes('previous'))
const isCloseDisabled: ComputedRef<boolean> = computed(() => props.disableButtons.includes('close'))
const isSkipDisabled: ComputedRef<boolean> = computed(() => props.disableButtons.includes('skip'))

const showFooter: ComputedRef<boolean> = computed(() =>
  props.showProgress || showNextButton.value || showPreviousButton.value || showSkipButton.value
)

// Popover positioning
const popoverStyle: Ref<Record<string, string>> = ref<Record<string, string>>({})

/**
 * Type guard to check if element is valid
 */
const isValidElement = (element: unknown): element is Element => {
  return element instanceof Element
}

/**
 * Calculate and update popover position
 */
const updatePosition = async (): Promise<void> => {
  if (!props.visible || !props.targetElement || !popoverRef.value) {
    return
  }

  if (!isValidElement(props.targetElement)) {
    console.warn('Invalid target element provided to MintPopover')
    return
  }

  await nextTick()

  const targetRect: DOMRect = props.targetElement.getBoundingClientRect()
  const popoverRect: DOMRect = popoverRef.value.getBoundingClientRect()

  // Calculate effective offset including padding
  const config = getConfig()
  const globalPadding = config.padding || 10
  const effectivePadding = getEffectivePadding(
    props.step?.popover?.padding,
    globalPadding,
    10
  )

  // Add padding to the base offset for proper spacing
  const totalOffset = props.offset + effectivePadding

  const position = calculatePopoverPosition(
    targetRect,
    { width: popoverRect.width, height: popoverRect.height },
    props.side,
    totalOffset
  )

  popoverStyle.value = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: '10001'
  }
}

// Event handlers using arrow functions with explicit return types
const handleNext = (): void => {
  if (!isNextDisabled.value) {
    emit('next')
  }
}

const handlePrevious = (): void => {
  if (!isPrevDisabled.value) {
    emit('previous')
  }
}

const handleClose = (): void => {
  if (!isCloseDisabled.value) {
    emit('close')
  }
}

const handleSkip = (): void => {
  if (!isSkipDisabled.value) {
    emit('skip')
  }
}

// Watch for changes that require repositioning
watch([() => props.visible, () => props.targetElement], updatePosition)

// Focus management
onMounted(() => {
  if (props.visible && popoverRef.value) {
    // Focus the first focusable element
    const firstButton: HTMLElement | undefined = skipBtnRef.value || nextBtnRef.value || prevBtnRef.value
    firstButton?.focus()

    emit('rendered', popoverRef.value)
  }
})

// Handle window resize and scroll events
const handleResize = (): void => {
  updatePosition()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleResize, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleResize, true)

  // Emit destroyed event for cleanup
  emit('destroyed')
})

// Update position when visible changes
watch(() => props.visible, (visible: boolean) => {
  if (visible) {
    nextTick(() => {
      updatePosition()
      if (popoverRef.value) {
        emit('rendered', popoverRef.value)
      }
    })
  }
})
</script>
