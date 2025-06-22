/**
 * Pure utility functions for animations and easing
 */

/**
 * Easing function for smooth animations
 * @param elapsed - Time elapsed since animation start
 * @param initialValue - Starting value
 * @param amountOfChange - Total change in value
 * @param duration - Total animation duration
 * @returns Current animation value
 */
export function easeInOutQuad(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number
): number {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed + initialValue
  }
  return (-amountOfChange / 2) * (--elapsed * (elapsed - 2) - 1) + initialValue
}

/**
 * Calculate animation progress as a percentage
 * @param elapsed - Time elapsed
 * @param duration - Total duration
 * @returns Progress percentage (0-1)
 */
export function getAnimationProgress(elapsed: number, duration: number): number {
  return Math.min(elapsed / duration, 1)
}

/**
 * Linear interpolation between two values
 * @param start - Starting value
 * @param end - Ending value
 * @param progress - Progress (0-1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress
}

/**
 * Interpolate between two rectangles
 * @param from - Starting rectangle
 * @param to - Ending rectangle
 * @param progress - Progress (0-1)
 * @returns Interpolated rectangle
 */
export function lerpRect(
  from: DOMRect,
  to: DOMRect,
  progress: number
): DOMRect {
  return new DOMRect(
    lerp(from.x, to.x, progress),
    lerp(from.y, to.y, progress),
    lerp(from.width, to.width, progress),
    lerp(from.height, to.height, progress)
  )
}
