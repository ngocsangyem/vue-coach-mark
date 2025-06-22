/**
 * Element highlighting composable for MintCoachMark
 * Manages element highlighting, transitions, and animations
 */

import { ref, nextTick } from 'vue'
import { getElement, createDummyElement, removeDummyElement, bringInView } from '../utils'
import { useCoachMarkState } from './useCoachMarkState'
import { useCoachMarkConfig } from './useCoachMarkConfig'
import { useOverlay } from './useOverlay'
import type { CoachMarkStep } from '../types'

export function useHighlight() {
  const { getState, setState } = useCoachMarkState()
  const { getConfig, getCurrentDriver } = useCoachMarkConfig()
  const { trackActiveElement, transitionStage, refreshOverlay } = useOverlay()

  // Animation state
  const isAnimating = ref(false)

  /**
   * Highlight a step element
   */
  async function highlight(step: CoachMarkStep): Promise<void> {
    const { element } = step
    let elemObj = getElement(element)

    // If the element is not found, we mount a 1px div
    // at the center of the screen to highlight and show
    // the popover on top of that. This is to show a
    // modal-like highlight.
    if (!elemObj) {
      elemObj = createDummyElement()
    }

    await transferHighlight(elemObj, step)
  }

  /**
   * Transfer highlight from current element to new element
   */
  async function transferHighlight(toElement: Element, toStep: CoachMarkStep): Promise<void> {
    const duration = 400
    const start = Date.now()

    const fromStep = getState('currentActiveStep')
    const fromElement = getState('currentActiveElement') || toElement

    // If it's the first time we're highlighting an element, we show
    // the popover immediately. Otherwise, we wait for the animation
    // to finish before showing the popover.
    const isFirstHighlight = !fromElement || fromElement === toElement
    const isToDummyElement = toElement.id === 'mint-coach-mark-dummy-element'
    const isFromDummyElement = fromElement.id === 'mint-coach-mark-dummy-element'

    const isAnimatedTour = getConfig('animate')
    const highlightStartedHook = toStep.onHighlightStarted || getConfig('onHighlightStarted')
    const highlightedHook = toStep?.onHighlighted || getConfig('onHighlighted')
    const deselectedHook = fromStep?.onDeselected || getConfig('onDeselected')

    const config = getConfig()
    const state = getState()
    const driver = getCurrentDriver()

    // Call deselected hook for previous element
    if (!isFirstHighlight && deselectedHook && driver) {
      deselectedHook(isFromDummyElement ? undefined : fromElement, fromStep!, {
        config,
        state,
        driver
      })
    }

    // Call highlight started hook
    if (highlightStartedHook && driver) {
      highlightStartedHook(isToDummyElement ? undefined : toElement, toStep, {
        config,
        state,
        driver
      })
    }

    // Set up animation state
    isAnimating.value = true
    let isPopoverRendered = false
    const hasDelayedPopover = isAnimatedTour && !isFirstHighlight && toStep.popover

    const animate = () => {
      const transitionCallback = getState('internalTransitionCallback')

      // This makes sure that the repeated calls to transferHighlight
      // don't interfere with each other. Only the last call will be
      // executed.
      if (transitionCallback !== animate) {
        return
      }

      const elapsed = Date.now() - start
      const timeRemaining = duration - elapsed
      const isHalfwayThrough = timeRemaining <= duration / 2

      // Render popover halfway through animation if delayed
      if (toStep.popover && isHalfwayThrough && !isPopoverRendered && hasDelayedPopover) {
        // We'll emit an event for the popover component to handle
        setState('shouldRenderPopover', { element: toElement, step: toStep })
        isPopoverRendered = true
      }

      if (getConfig('animate') && elapsed < duration) {
        transitionStage(elapsed, duration, fromElement, toElement, fromStep, toStep)
      } else {
        // Animation complete
        trackActiveElement(toElement, toStep)

        if (highlightedHook && driver) {
          highlightedHook(isToDummyElement ? undefined : toElement, toStep, {
            config: getConfig(),
            state: getState(),
            driver
          })
        }

        setState('internalTransitionCallback', undefined)
        setState('internalPreviousStep', fromStep)
        setState('internalPreviousElement', fromElement)
        setState('currentActiveStep', toStep)
        setState('currentActiveElement', toElement)
        
        isAnimating.value = false
        return
      }

      window.requestAnimationFrame(animate)
    }

    setState('internalTransitionCallback', animate)
    window.requestAnimationFrame(animate)

    // Scroll element into view
    const smoothScroll = getConfig('smoothScroll')
    bringInView(toElement, smoothScroll)

    // Render popover immediately if not delayed
    if (!hasDelayedPopover && toStep.popover) {
      await nextTick()
      setState('shouldRenderPopover', { element: toElement, step: toStep })
    }

    // Update element classes and attributes
    updateElementHighlight(fromElement, toElement, toStep)
  }

  /**
   * Update element classes and ARIA attributes
   */
  function updateElementHighlight(fromElement: Element, toElement: Element, toStep: CoachMarkStep): void {
    // Remove classes from previous element
    fromElement.classList.remove('mint-coach-mark-active-element', 'mint-coach-mark-no-interaction')
    fromElement.removeAttribute('aria-haspopup')
    fromElement.removeAttribute('aria-expanded')
    fromElement.removeAttribute('aria-controls')

    // Add classes to new element
    const disableActiveInteraction = toStep.disableActiveInteraction ?? getConfig('disableActiveInteraction')
    if (disableActiveInteraction) {
      toElement.classList.add('mint-coach-mark-no-interaction')
    }

    toElement.classList.add('mint-coach-mark-active-element')
    toElement.setAttribute('aria-haspopup', 'dialog')
    toElement.setAttribute('aria-expanded', 'true')
    toElement.setAttribute('aria-controls', 'mint-coach-mark-popover-content')
  }

  /**
   * Refresh active highlight (useful for window resize)
   */
  function refreshActiveHighlight(): void {
    const activeHighlight = getState('currentActiveElement')
    const activeStep = getState('currentActiveStep')

    if (!activeHighlight || !activeStep) {
      return
    }

    trackActiveElement(activeHighlight, activeStep)
    refreshOverlay()

    // Emit event for popover repositioning
    setState('shouldRepositionPopover', { element: activeHighlight, step: activeStep })
  }

  /**
   * Destroy highlighting
   */
  function destroyHighlight(): void {
    removeDummyElement()
    
    document.querySelectorAll('.mint-coach-mark-active-element').forEach(element => {
      element.classList.remove('mint-coach-mark-active-element', 'mint-coach-mark-no-interaction')
      element.removeAttribute('aria-haspopup')
      element.removeAttribute('aria-expanded')
      element.removeAttribute('aria-controls')
    })

    isAnimating.value = false
    setState('internalTransitionCallback', undefined)
  }

  return {
    // Highlighting methods
    highlight,
    transferHighlight,
    refreshActiveHighlight,
    destroyHighlight,
    
    // State
    isAnimating
  }
}
