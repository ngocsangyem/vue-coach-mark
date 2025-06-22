/**
 * Pure utility functions for geometric calculations
 */

import type { StageDefinition } from '../types'

/**
 * Calculate stage definition from element with padding
 * @param element - Target element
 * @param padding - Padding around element
 * @returns Stage definition with position and dimensions
 */
export function calculateStageDefinition(element: Element, padding = 10): StageDefinition {
  const rect = element.getBoundingClientRect()
  
  return {
    x: rect.x - padding,
    y: rect.y - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2
  }
}

/**
 * Calculate the center point of a rectangle
 * @param rect - Rectangle to find center of
 * @returns Center point coordinates
 */
export function getRectCenter(rect: DOMRect | StageDefinition): { x: number; y: number } {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2
  }
}

/**
 * Calculate distance between two points
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Distance between points
 */
export function getDistance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Check if a point is inside a rectangle
 * @param point - Point to check
 * @param rect - Rectangle to check against
 * @returns True if point is inside rectangle
 */
export function isPointInRect(
  point: { x: number; y: number },
  rect: DOMRect | StageDefinition
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  )
}

/**
 * Calculate the best position for a popover relative to a target element
 * @param targetRect - Target element rectangle
 * @param popoverSize - Popover dimensions
 * @param preferredSide - Preferred side to position popover
 * @param offset - Offset from target element
 * @returns Best position and side for popover
 */
export function calculatePopoverPosition(
  targetRect: DOMRect,
  popoverSize: { width: number; height: number },
  preferredSide: 'top' | 'right' | 'bottom' | 'left' | 'over' = 'bottom',
  offset = 10
): { x: number; y: number; side: 'top' | 'right' | 'bottom' | 'left' | 'over' } {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const positions = {
    top: {
      x: targetRect.x + targetRect.width / 2 - popoverSize.width / 2,
      y: targetRect.y - popoverSize.height - offset,
      side: 'top' as const
    },
    bottom: {
      x: targetRect.x + targetRect.width / 2 - popoverSize.width / 2,
      y: targetRect.y + targetRect.height + offset,
      side: 'bottom' as const
    },
    left: {
      x: targetRect.x - popoverSize.width - offset,
      y: targetRect.y + targetRect.height / 2 - popoverSize.height / 2,
      side: 'left' as const
    },
    right: {
      x: targetRect.x + targetRect.width + offset,
      y: targetRect.y + targetRect.height / 2 - popoverSize.height / 2,
      side: 'right' as const
    },
    over: {
      x: targetRect.x + targetRect.width / 2 - popoverSize.width / 2,
      y: targetRect.y + targetRect.height / 2 - popoverSize.height / 2,
      side: 'over' as const
    }
  }

  // Handle 'over' positioning (modal-like, centered on element)
  if (preferredSide === 'over') {
    return positions.over
  }

  // Check if preferred position fits in viewport
  const preferred = positions[preferredSide as keyof typeof positions]
  if (
    preferred &&
    preferred.x >= 0 &&
    preferred.y >= 0 &&
    preferred.x + popoverSize.width <= viewport.width &&
    preferred.y + popoverSize.height <= viewport.height
  ) {
    return preferred
  }

  // Try other positions
  const sides: Array<'top' | 'right' | 'bottom' | 'left'> = ['bottom', 'top', 'right', 'left']
  for (const side of sides) {
    const position = positions[side]
    if (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x + popoverSize.width <= viewport.width &&
      position.y + popoverSize.height <= viewport.height
    ) {
      return position
    }
  }

  // Fallback to preferred position with adjustments, or bottom if preferred is invalid
  const fallback = { ...(preferred || positions.bottom) }
  
  // Adjust horizontal position
  if (fallback.x < 0) {
    fallback.x = 10
  } else if (fallback.x + popoverSize.width > viewport.width) {
    fallback.x = viewport.width - popoverSize.width - 10
  }
  
  // Adjust vertical position
  if (fallback.y < 0) {
    fallback.y = 10
  } else if (fallback.y + popoverSize.height > viewport.height) {
    fallback.y = viewport.height - popoverSize.height - 10
  }

  return fallback
}
