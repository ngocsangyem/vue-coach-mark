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
export declare function easeInOutQuad(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number;
/**
 * Calculate animation progress as a percentage
 * @param elapsed - Time elapsed
 * @param duration - Total duration
 * @returns Progress percentage (0-1)
 */
export declare function getAnimationProgress(elapsed: number, duration: number): number;
/**
 * Linear interpolation between two values
 * @param start - Starting value
 * @param end - Ending value
 * @param progress - Progress (0-1)
 * @returns Interpolated value
 */
export declare function lerp(start: number, end: number, progress: number): number;
/**
 * Interpolate between two rectangles
 * @param from - Starting rectangle
 * @param to - Ending rectangle
 * @param progress - Progress (0-1)
 * @returns Interpolated rectangle
 */
export declare function lerpRect(from: DOMRect, to: DOMRect, progress: number): DOMRect;
//# sourceMappingURL=animation.d.ts.map