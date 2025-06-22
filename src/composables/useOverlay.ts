/**
 * Overlay management composable for MintCoachMark
 * Handles SVG overlay creation, positioning, and animations
 */

import { ref, computed } from 'vue'
import { easeInOutQuad, lerpRect } from '../utils'
import { useCoachMarkState } from './useCoachMarkState'
import { useCoachMarkConfig } from './useCoachMarkConfig'
import { useCoachMarkEvents } from './useCoachMarkEvents'
import type { StageDefinition } from '../types'

export function useOverlay() {
  const { getState, setState } = useCoachMarkState()
  const { getConfig } = useCoachMarkConfig()
  const { emit } = useCoachMarkEvents()

  // Overlay SVG element reference
  const overlaySvg = ref<SVGSVGElement | null>(null)

  /**
   * Create and mount the overlay SVG
   */
  function createOverlay(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.id = 'mint-coach-mark-overlay'
    svg.style.position = 'fixed'
    svg.style.top = '0'
    svg.style.left = '0'
    svg.style.width = '100%'
    svg.style.height = '100%'

    // Get z-index from CSS custom property or use default
    const computedStyle = getComputedStyle(document.documentElement)
    const overlayZIndex = computedStyle.getPropertyValue('--mint-coach-mark-overlay-z-index').trim() || '10000'
    svg.style.zIndex = overlayZIndex

    svg.style.pointerEvents = 'auto'
    svg.style.cursor = 'auto'

    // Create the overlay path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.id = 'mint-coach-mark-overlay-path'
    path.style.pointerEvents = 'auto'
    path.style.cursor = 'auto'

    svg.appendChild(path)
    document.body.appendChild(svg)

    // Add click handler for overlay
    svg.addEventListener('click', (e) => {
      const target = e.target as Element
      if (target === svg || target === path) {
        emit('overlayClick')
      }
    })

    overlaySvg.value = svg
    setState('internalOverlaySvg', svg)
    
    return svg
  }

  /**
   * Update overlay colors and opacity
   */
  function updateOverlayStyle(): void {
    const svg = getState('internalOverlaySvg')
    if (!svg) return

    const path = svg.querySelector('#mint-coach-mark-overlay-path') as SVGPathElement
    if (!path) return

    const overlayColor = getConfig('overlayColor') || '#000'
    const overlayOpacity = getConfig('overlayOpacity') || 0.7

    path.setAttribute('fill', overlayColor)
    path.setAttribute('fill-opacity', overlayOpacity.toString())
  }

  /**
   * Generate SVG path for overlay with cutout
   */
  function generateOverlayPath(stage: StageDefinition): string {
    const { x, y, width, height } = stage
    const radius = getConfig('stageRadius') || 5
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Create path that covers entire screen with a rounded rectangle cutout
    const outerPath = `M0,0 L${windowWidth},0 L${windowWidth},${windowHeight} L0,${windowHeight} Z`
    
    // Inner cutout path (rounded rectangle)
    const innerPath = `M${x + radius},${y} ` +
      `L${x + width - radius},${y} ` +
      `Q${x + width},${y} ${x + width},${y + radius} ` +
      `L${x + width},${y + height - radius} ` +
      `Q${x + width},${y + height} ${x + width - radius},${y + height} ` +
      `L${x + radius},${y + height} ` +
      `Q${x},${y + height} ${x},${y + height - radius} ` +
      `L${x},${y + radius} ` +
      `Q${x},${y} ${x + radius},${y} Z`

    return `${outerPath} ${innerPath}`
  }

  /**
   * Update overlay with new stage position
   */
  function updateOverlay(stage: StageDefinition): void {
    let svg = getState('internalOverlaySvg')

    if (!svg) {
      svg = createOverlay()
    }

    const path = svg.querySelector('#mint-coach-mark-overlay-path') as SVGPathElement
    if (!path) return

    const pathData = generateOverlayPath(stage)
    path.setAttribute('d', pathData)
    path.setAttribute('fill-rule', 'evenodd')

    updateOverlayStyle()
    setState('currentActiveStagePosition', stage)
  }

  /**
   * Track active element and update overlay
   */
  function trackActiveElement(element: Element): void {
    const stagePadding = getConfig('stagePadding') || 10
    const rect = element.getBoundingClientRect()
    
    const stage: StageDefinition = {
      x: rect.x - stagePadding,
      y: rect.y - stagePadding,
      width: rect.width + stagePadding * 2,
      height: rect.height + stagePadding * 2
    }

    updateOverlay(stage)
  }

  /**
   * Animate stage transition between elements
   */
  function transitionStage(
    elapsed: number,
    duration: number,
    fromElement: Element,
    toElement: Element
  ): void {
    const activeStagePosition = getState('currentActiveStagePosition')
    const stagePadding = getConfig('stagePadding') || 10

    const fromRect = activeStagePosition 
      ? new DOMRect(activeStagePosition.x, activeStagePosition.y, activeStagePosition.width, activeStagePosition.height)
      : fromElement.getBoundingClientRect()
    const toRect = toElement.getBoundingClientRect()

    // Calculate stage definitions
    const fromStage: StageDefinition = {
      x: fromRect.x - stagePadding,
      y: fromRect.y - stagePadding,
      width: fromRect.width + stagePadding * 2,
      height: fromRect.height + stagePadding * 2
    }

    const toStage: StageDefinition = {
      x: toRect.x - stagePadding,
      y: toRect.y - stagePadding,
      width: toRect.width + stagePadding * 2,
      height: toRect.height + stagePadding * 2
    }

    // Interpolate between stages
    const progress = Math.min(elapsed / duration, 1)
    const currentStage: StageDefinition = {
      x: easeInOutQuad(elapsed, fromStage.x, toStage.x - fromStage.x, duration),
      y: easeInOutQuad(elapsed, fromStage.y, toStage.y - fromStage.y, duration),
      width: easeInOutQuad(elapsed, fromStage.width, toStage.width - fromStage.width, duration),
      height: easeInOutQuad(elapsed, fromStage.height, toStage.height - fromStage.height, duration)
    }

    updateOverlay(currentStage)
  }

  /**
   * Refresh overlay (useful for window resize)
   */
  function refreshOverlay(): void {
    const activeElement = getState('currentActiveElement')
    if (activeElement) {
      trackActiveElement(activeElement)
    }
  }

  /**
   * Destroy overlay
   */
  function destroyOverlay(): void {
    const svg = getState('internalOverlaySvg')
    if (svg) {
      svg.remove()
      setState('internalOverlaySvg', undefined)
      setState('currentActiveStagePosition', undefined)
    }
    overlaySvg.value = null
  }

  // Computed properties
  const isOverlayVisible = computed(() => !!getState('internalOverlaySvg'))
  const activeStagePosition = computed(() => getState('currentActiveStagePosition'))

  return {
    // Overlay management
    createOverlay,
    updateOverlay,
    trackActiveElement,
    transitionStage,
    refreshOverlay,
    destroyOverlay,
    
    // Computed properties
    isOverlayVisible,
    activeStagePosition,
    
    // Refs
    overlaySvg
  }
}
