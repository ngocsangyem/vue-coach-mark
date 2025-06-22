/**
 * Pure utility functions for geometric calculations
 */
import type { StageDefinition } from '../types';
/**
 * Calculate stage definition from element with padding
 * @param element - Target element
 * @param padding - Padding around element
 * @returns Stage definition with position and dimensions
 */
export declare function calculateStageDefinition(element: Element, padding?: number): StageDefinition;
/**
 * Calculate the center point of a rectangle
 * @param rect - Rectangle to find center of
 * @returns Center point coordinates
 */
export declare function getRectCenter(rect: DOMRect | StageDefinition): {
    x: number;
    y: number;
};
/**
 * Calculate distance between two points
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Distance between points
 */
export declare function getDistance(point1: {
    x: number;
    y: number;
}, point2: {
    x: number;
    y: number;
}): number;
/**
 * Check if a point is inside a rectangle
 * @param point - Point to check
 * @param rect - Rectangle to check against
 * @returns True if point is inside rectangle
 */
export declare function isPointInRect(point: {
    x: number;
    y: number;
}, rect: DOMRect | StageDefinition): boolean;
/**
 * Calculate the best position for a popover relative to a target element
 * @param targetRect - Target element rectangle
 * @param popoverSize - Popover dimensions
 * @param preferredSide - Preferred side to position popover
 * @param offset - Offset from target element
 * @returns Best position and side for popover
 */
export declare function calculatePopoverPosition(targetRect: DOMRect, popoverSize: {
    width: number;
    height: number;
}, preferredSide?: 'top' | 'right' | 'bottom' | 'left' | 'over', offset?: number): {
    x: number;
    y: number;
    side: 'top' | 'right' | 'bottom' | 'left' | 'over';
};
//# sourceMappingURL=geometry.d.ts.map