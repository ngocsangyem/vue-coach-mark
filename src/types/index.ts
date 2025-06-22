/**
 * TypeScript type definitions for MintCoachMark
 */

import type { Ref, MaybeRef, ComponentPublicInstance } from 'vue'

// Basic types
export type Side = 'top' | 'right' | 'bottom' | 'left' | 'over'
export type Alignment = 'start' | 'center' | 'end'
export type AllowedButtons = 'next' | 'previous' | 'close' | 'skip'

// Stage definition for overlay positioning
export interface StageDefinition {
  x: number
  y: number
  width: number
  height: number
}

// Popover configuration
export interface PopoverConfig {
  title?: string
  description?: string
  side?: Side
  alignment?: Alignment
  showButtons?: AllowedButtons[]
  disableButtons?: AllowedButtons[]
  showProgress?: boolean
  progressText?: string
  nextBtnText?: string
  prevBtnText?: string
  doneBtnText?: string
  skipBtnText?: string
  popoverClass?: string

  // Highlight appearance (step-level overrides)
  padding?: number | string
  radius?: number | string

  // Original navigation callbacks (maintain backward compatibility)
  onNextClick?: CoachMarkHook
  onPrevClick?: CoachMarkHook
  onCloseClick?: CoachMarkHook
  onSkipClick?: CoachMarkHook

  // New async navigation callbacks (separate from original ones)
  onAsyncNextClick?: AsyncTourHook
  onAsyncPreviousClick?: AsyncTourHook
  onAsyncCloseClick?: AsyncTourHook
}

// Coach mark step definition
export interface CoachMarkStep {
  element?: string | Element | (() => Element)
  popover?: PopoverConfig
  disableActiveInteraction?: boolean

  // Step lifecycle hooks
  onHighlightStarted?: CoachMarkHook
  onHighlighted?: CoachMarkHook
  onDeselected?: CoachMarkHook  // Keep original signature for backward compatibility

  // Async lifecycle hooks (new)
  onAsyncDeselected?: AsyncTourHook  // New async version
}

// Hook function type - supports both sync and async operations
export type CoachMarkHook = (
  element: Element | undefined,
  step: CoachMarkStep,
  context: {
    config: CoachMarkConfig
    state: CoachMarkState
    driver: CoachMarkDriver
  }
) => void | Promise<void>

// Async tour hook type for step-level callbacks
export type AsyncTourHook = (
  element: Element | undefined,
  step: CoachMarkStep,
  driver: CoachMarkDriver
) => void | Promise<void>

// Main configuration interface
export interface CoachMarkConfig {
  steps?: CoachMarkStep[]
  animate?: boolean
  overlayColor?: string
  overlayOpacity?: number
  smoothScroll?: boolean
  allowClose?: boolean
  overlayClickBehavior?: 'close' | 'nextStep'

  // Highlight appearance
  padding?: number | string
  radius?: number | string

  disableActiveInteraction?: boolean
  allowKeyboardControl?: boolean
  
  // Popover defaults
  popoverClass?: string
  popoverOffset?: number
  showButtons?: AllowedButtons[]
  disableButtons?: AllowedButtons[]
  showProgress?: boolean
  
  // Button text defaults
  progressText?: string
  nextBtnText?: string
  prevBtnText?: string
  doneBtnText?: string
  skipBtnText?: string

  // Skip tour configuration
  allowSkip?: boolean
  
  // Global hooks
  onHighlightStarted?: CoachMarkHook
  onHighlighted?: CoachMarkHook
  onDeselected?: CoachMarkHook
  onDestroyStarted?: CoachMarkHook
  onDestroyed?: CoachMarkHook
  onNextClick?: CoachMarkHook
  onPrevClick?: CoachMarkHook
  onCloseClick?: CoachMarkHook
  onSkipClick?: CoachMarkHook
  onPopoverRender?: (
    popover: PopoverDOM,
    context: {
      config: CoachMarkConfig
      state: CoachMarkState
      driver: CoachMarkDriver
    }
  ) => void
}

// State interface
export interface CoachMarkState {
  isInitialized?: boolean
  activeIndex?: number
  activeElement?: Element
  activeStep?: CoachMarkStep
  previousElement?: Element
  previousStep?: CoachMarkStep
  popover?: PopoverDOM

  // Internal state (using descriptive naming conventions)
  internalPreviousElement?: Element
  currentActiveElement?: Element
  internalPreviousStep?: CoachMarkStep
  currentActiveStep?: CoachMarkStep
  internalActiveOnDestroyed?: Element
  internalResizeTimeout?: number
  internalTransitionCallback?: () => void
  currentActiveStagePosition?: StageDefinition
  internalOverlaySvg?: SVGSVGElement
  shouldRenderPopover?: { element: Element; step: CoachMarkStep }
  shouldRepositionPopover?: { element: Element; step: CoachMarkStep }
}

// Popover DOM elements
export interface PopoverDOM {
  wrapper: HTMLElement
  arrow: HTMLElement
  title: HTMLElement
  description: HTMLElement
  footer: HTMLElement
  progress: HTMLElement
  nextBtn: HTMLElement
  prevBtn: HTMLElement
  closeBtn: HTMLElement
}

// Driver interface (similar to original driver.js API)
export interface CoachMarkDriver {
  isActive: () => boolean
  refresh: () => void
  drive: (stepIndex?: number) => void
  setConfig: (config: CoachMarkConfig) => void
  setSteps: (steps: CoachMarkStep[]) => void
  getConfig: () => CoachMarkConfig
  getState: (key?: string) => any
  getActiveIndex: () => number | undefined
  isFirstStep: () => boolean
  isLastStep: () => boolean
  getActiveStep: () => CoachMarkStep | undefined
  getActiveElement: () => Element | undefined
  getPreviousElement: () => Element | undefined
  getPreviousStep: () => CoachMarkStep | undefined
  moveNext: () => void
  movePrevious: () => void
  moveTo: (index: number) => void
  skipTour: () => void
  hasNextStep: () => boolean
  hasPreviousStep: () => boolean
  highlight: (step: CoachMarkStep) => void
  destroy: () => void
}

type ReferenceElement = Element;

type MaybeElement<T> = T | ComponentPublicInstance | null | undefined;

// Vue component props
export interface MintCoachMarkProps {
  steps?: CoachMarkStep[]
  config?: CoachMarkConfig
  modelValue?: boolean
  autoStart?: boolean
}

// Vue component emits
export interface MintCoachMarkEmits {
  'update:modelValue': [value: boolean]
  'tour-start': []
  'tour-complete': []
  'tour-skipped': [step: CoachMarkStep, index: number]
  'step-change': [step: CoachMarkStep, index: number]
  'highlight-started': [element: Element | undefined, step: CoachMarkStep]
  'highlighted': [element: Element | undefined, step: CoachMarkStep]
  'deselected': [element: Element | undefined, step: CoachMarkStep]
}

// Popover component types
export type PopoverProvider = 'mint' | 'quasar'

export interface PopoverProviderConfig {
  provider: PopoverProvider
  quasarOptions?: Record<string, unknown>
}

// Enhanced popover communication interface
export interface PopoverCommunication {
  visible: boolean
  targetElement: Element | null
  step: CoachMarkStep | null
  position: {
    x: number
    y: number
  } | null
  provider: PopoverProvider
  isPositioning: boolean
}

// Popover component props for decoupled architecture
export interface MintPopoverProps {
  visible?: boolean
  targetElement?: Element | null
  step?: CoachMarkStep | null
  title?: string
  description?: string
  side?: Side
  showButtons?: AllowedButtons[]
  disableButtons?: AllowedButtons[]
  showProgress?: boolean
  progressText?: string
  nextBtnText?: string
  prevBtnText?: string
  skipBtnText?: string
  popoverClass?: string
  offset?: number
}

// Popover component emits
export interface MintPopoverEmits {
  (e: 'next'): void
  (e: 'previous'): void
  (e: 'close'): void
  (e: 'skip'): void
  (e: 'rendered', popover: HTMLElement): void
  (e: 'destroyed'): void
}



// Communication composable return type
export interface UsePopoverCommunicationReturn {
  readonly popoverState: import('vue').ComputedRef<PopoverCommunication>
  readonly updatePopoverState: (updates: Partial<PopoverCommunication>) => void
  readonly showPopover: (element: Element, step: CoachMarkStep, isPositioning?: boolean) => void
  readonly hidePopover: () => void
  readonly repositionPopover: () => void
  readonly forceRepositioning: () => void
  readonly completePositioning: () => void
  readonly setProvider: (provider: PopoverProvider) => void
}
