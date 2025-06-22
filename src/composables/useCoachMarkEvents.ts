/**
 * Event handling composable for MintCoachMark
 * Leverages Vue.js built-in features for reactive event management
 */

import {
  ref,
  computed,
  watch,
  onUnmounted,
  type Ref,
  type ComputedRef
} from 'vue'
import { getFocusableElements } from '../utils'
import { useCoachMarkState } from './useCoachMarkState'
import { useCoachMarkConfig } from './useCoachMarkConfig'

// Event types with strict typing
type AllowedEvents =
  | 'overlayClick'
  | 'escapePress'
  | 'nextClick'
  | 'prevClick'
  | 'closeClick'
  | 'arrowRightPress'
  | 'arrowLeftPress'
  | 'refreshRequired'

type EventCallback = () => void

type EventListenerMap = Record<AllowedEvents, EventCallback | undefined>

type KeyboardEventHandler = (event: KeyboardEvent) => void
type GenericEventHandler = (event: Event) => void
type PointerEventHandler = (event: MouseEvent | PointerEvent) => void

// Type guards for DOM elements and events
type ElementTypeGuard<T extends Element> = (element: unknown) => element is T
type EventTypeGuard<T extends Event> = (event: Event) => event is T

interface UseCoachMarkEventsReturn {
  readonly listen: (event: AllowedEvents, callback: EventCallback) => void
  readonly emit: (event: AllowedEvents) => void
  readonly initEvents: () => void
  readonly destroyEvents: () => void
  readonly destroyEmitter: () => void
  readonly onDriverClick: (
    element: Element,
    listener: PointerEventHandler,
    shouldPreventDefault?: (target: HTMLElement) => boolean
  ) => () => void
  readonly eventsInitialized: ComputedRef<boolean>
}

export const useCoachMarkEvents = (): UseCoachMarkEventsReturn => {
  const { getState, setState } = useCoachMarkState()
  const { getConfig } = useCoachMarkConfig()

  // Event listeners registry using Vue's reactive system
  const registeredListeners: Ref<Partial<EventListenerMap>> = ref({})

  // Track if events are initialized using Vue's reactive system
  const eventsInitialized: Ref<boolean> = ref(false)

  // Computed property for events initialization status
  const isEventsInitialized: ComputedRef<boolean> = computed(() => eventsInitialized.value)

  // Type guards for DOM elements
  const isElement: ElementTypeGuard<Element> = (element: unknown): element is Element => {
    return element instanceof Element
  }

  const isHTMLElement: ElementTypeGuard<HTMLElement> = (element: unknown): element is HTMLElement => {
    return element instanceof HTMLElement
  }

  // Type guards for events
  const isMouseEvent: EventTypeGuard<MouseEvent> = (event: Event): event is MouseEvent => {
    return event instanceof MouseEvent
  }

  const isPointerEvent: EventTypeGuard<PointerEvent> = (event: Event): event is PointerEvent => {
    return event instanceof PointerEvent
  }



  /**
   * Register an event listener using Vue's reactive system
   */
  const listen = (event: AllowedEvents, callback: EventCallback): void => {
    registeredListeners.value[event] = callback
  }

  /**
   * Emit an event using Vue's reactive system
   */
  const emit = (event: AllowedEvents): void => {
    const callback = registeredListeners.value[event]
    if (callback) {
      callback()
    }
  }

  /**
   * Handle keyboard events using Vue's reactive system
   */
  const handleKeyup: KeyboardEventHandler = (e: KeyboardEvent): void => {
    const allowKeyboardControl = getConfig('allowKeyboardControl') ?? true

    if (!allowKeyboardControl) {
      return
    }

    if (e.key === 'Escape') {
      emit('escapePress')
    } else if (e.key === 'ArrowRight') {
      emit('arrowRightPress')
    } else if (e.key === 'ArrowLeft') {
      emit('arrowLeftPress')
    }
  }

  /**
   * Handle focus trapping for accessibility using Vue's reactive system
   */
  const handleFocusTrapping: KeyboardEventHandler = (e: KeyboardEvent): void => {
    const isActivated = getState('isInitialized')
    if (!isActivated) {
      return
    }

    const isTabKey = e.key === 'Tab'
    if (!isTabKey) {
      return
    }

    const activeElement = getState('currentActiveElement')
    const popoverEl = getState('popover')?.wrapper

    const elementsToSearch: Element[] = [
      ...(popoverEl ? [popoverEl] : []),
      ...(activeElement ? [activeElement] : [])
    ]

    const focusableEls: HTMLElement[] = getFocusableElements(elementsToSearch)

    const firstFocusableEl: HTMLElement | undefined = focusableEls[0]
    const lastFocusableEl: HTMLElement | undefined = focusableEls[focusableEls.length - 1]

    if (!firstFocusableEl || !lastFocusableEl) {
      return
    }

    e.preventDefault()

    const currentActiveElement = document.activeElement
    if (!isHTMLElement(currentActiveElement)) {
      firstFocusableEl.focus()
      return
    }

    if (e.shiftKey) {
      const currentIndex: number = focusableEls.indexOf(currentActiveElement)
      const previousFocusableEl: HTMLElement = currentIndex > 0 ? focusableEls[currentIndex - 1] : lastFocusableEl
      previousFocusableEl.focus()
    } else {
      const currentIndex: number = focusableEls.indexOf(currentActiveElement)
      const nextFocusableEl: HTMLElement = currentIndex < focusableEls.length - 1 ? focusableEls[currentIndex + 1] : firstFocusableEl
      nextFocusableEl.focus()
    }
  }

  /**
   * Handle window resize and scroll events using Vue's reactive system
   */
  const handleRefreshRequired = (): void => {
    const resizeTimeout = getState('internalResizeTimeout')
    if (typeof resizeTimeout === 'number') {
      window.cancelAnimationFrame(resizeTimeout)
    }

    // Use Vue's reactive system for timeout management
    const timeoutId: number = window.requestAnimationFrame(() => {
      emit('refreshRequired')
    })
    setState('internalResizeTimeout', timeoutId)
  }

  /**
   * Handle clicks on driver elements with proper event handling using Vue patterns
   */
  const onDriverClick = (
    element: Element,
    listener: PointerEventHandler,
    shouldPreventDefault?: (target: HTMLElement) => boolean
  ): (() => void) => {
    const listenerWrapper = (e: MouseEvent | PointerEvent, actualListener?: PointerEventHandler): void => {
      const target = e.target
      if (!target || !isElement(target)) {
        return
      }

      if (!element.contains(target)) {
        return
      }

      if (!isHTMLElement(target)) {
        return
      }

      if (!shouldPreventDefault || shouldPreventDefault(target)) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
      }

      if (actualListener) {
        actualListener(e)
      }
    }

    // We want to be the absolute first one to hear about the event
    const useCapture = true

    // Event handlers with proper type guards using Vue patterns
    const pointerDownHandler: GenericEventHandler = (e: Event): void => {
      if (isPointerEvent(e)) {
        listenerWrapper(e)
      }
    }

    const mouseDownHandler: GenericEventHandler = (e: Event): void => {
      if (isMouseEvent(e)) {
        listenerWrapper(e)
      }
    }

    const pointerUpHandler: GenericEventHandler = (e: Event): void => {
      if (isPointerEvent(e)) {
        listenerWrapper(e)
      }
    }

    const mouseUpHandler: GenericEventHandler = (e: Event): void => {
      if (isMouseEvent(e)) {
        listenerWrapper(e)
      }
    }

    const clickHandler: GenericEventHandler = (e: Event): void => {
      if (isMouseEvent(e)) {
        listenerWrapper(e, listener)
      }
    }

    // Add event listeners using Vue patterns
    element.addEventListener('pointerdown', pointerDownHandler, useCapture)
    element.addEventListener('mousedown', mouseDownHandler, useCapture)
    element.addEventListener('pointerup', pointerUpHandler, useCapture)
    element.addEventListener('mouseup', mouseUpHandler, useCapture)
    element.addEventListener('click', clickHandler, useCapture)

    // Return cleanup function following Vue patterns
    return (): void => {
      element.removeEventListener('pointerdown', pointerDownHandler, useCapture)
      element.removeEventListener('mousedown', mouseDownHandler, useCapture)
      element.removeEventListener('pointerup', pointerUpHandler, useCapture)
      element.removeEventListener('mouseup', mouseUpHandler, useCapture)
      element.removeEventListener('click', clickHandler, useCapture)
    }
  }

  /**
   * Initialize global event listeners using Vue's lifecycle patterns
   */
  const initEvents = (): void => {
    if (eventsInitialized.value) {
      return
    }

    window.addEventListener('keyup', handleKeyup, false)
    window.addEventListener('keydown', handleFocusTrapping, false)
    window.addEventListener('resize', handleRefreshRequired)
    window.addEventListener('scroll', handleRefreshRequired)

    eventsInitialized.value = true
  }

  /**
   * Destroy global event listeners using Vue's cleanup patterns
   */
  const destroyEvents = (): void => {
    if (!eventsInitialized.value) {
      return
    }

    window.removeEventListener('keyup', handleKeyup)
    window.removeEventListener('keydown', handleFocusTrapping)
    window.removeEventListener('resize', handleRefreshRequired)
    window.removeEventListener('scroll', handleRefreshRequired)

    eventsInitialized.value = false
  }

  /**
   * Clear all event listeners and reset state using Vue's reactive system
   */
  const destroyEmitter = (): void => {
    destroyEvents()
    registeredListeners.value = {}
  }

  // Use Vue's lifecycle hooks for proper cleanup
  onUnmounted(() => {
    destroyEvents()
    destroyEmitter()
  })

  // Watch for state changes using Vue's reactive system
  watch(eventsInitialized, (newValue: boolean) => {
    if (newValue) {
      console.log('Events initialized')
    } else {
      console.log('Events destroyed')
    }
  })

  return {
    // Event management
    listen,
    emit,
    initEvents,
    destroyEvents,
    destroyEmitter,
    onDriverClick,

    // State using Vue's computed property
    eventsInitialized: isEventsInitialized
  } as const
}
