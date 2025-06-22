/**
 * Styling utility functions for padding and radius parsing
 */

/**
 * Parse padding value to numeric pixels
 * Supports both number and string values (e.g., "10px", "1rem", "5")
 */
export function parsePadding(value: number | string | undefined, defaultValue: number = 10): number {
  if (value === undefined || value === null) {
    return defaultValue
  }
  
  if (typeof value === 'number') {
    return value
  }
  
  if (typeof value === 'string') {
    // Remove whitespace
    const trimmed = value.trim()
    
    // Handle empty string
    if (!trimmed) {
      return defaultValue
    }
    
    // Parse numeric value from string (handles "10px", "1rem", etc.)
    const numericValue = parseFloat(trimmed)
    
    if (isNaN(numericValue)) {
      console.warn(`Invalid padding value: "${value}". Using default: ${defaultValue}`)
      return defaultValue
    }
    
    // Convert rem to pixels (assuming 16px = 1rem)
    if (trimmed.includes('rem')) {
      return numericValue * 16
    }
    
    // Convert em to pixels (assuming 16px = 1em)
    if (trimmed.includes('em')) {
      return numericValue * 16
    }
    
    // For px, %, or unitless values, return the numeric part
    return numericValue
  }
  
  return defaultValue
}

/**
 * Parse radius value to numeric pixels
 * Supports both number and string values (e.g., "8px", "50%", "1rem")
 */
export function parseRadius(value: number | string | undefined, defaultValue: number = 5): number {
  if (value === undefined || value === null) {
    return defaultValue
  }
  
  if (typeof value === 'number') {
    return value
  }
  
  if (typeof value === 'string') {
    // Remove whitespace
    const trimmed = value.trim()
    
    // Handle empty string
    if (!trimmed) {
      return defaultValue
    }
    
    // Handle percentage values (convert to reasonable pixel values)
    if (trimmed.includes('%')) {
      const numericValue = parseFloat(trimmed)
      if (isNaN(numericValue)) {
        console.warn(`Invalid radius percentage: "${value}". Using default: ${defaultValue}`)
        return defaultValue
      }
      
      // For percentage radius, we'll use a reasonable conversion
      // 50% = 25px (for typical button-sized elements)
      // 100% = 50px (for very rounded elements)
      return Math.min(numericValue * 0.5, 50)
    }
    
    // Parse numeric value from string
    const numericValue = parseFloat(trimmed)
    
    if (isNaN(numericValue)) {
      console.warn(`Invalid radius value: "${value}". Using default: ${defaultValue}`)
      return defaultValue
    }
    
    // Convert rem to pixels (assuming 16px = 1rem)
    if (trimmed.includes('rem')) {
      return numericValue * 16
    }
    
    // Convert em to pixels (assuming 16px = 1em)
    if (trimmed.includes('em')) {
      return numericValue * 16
    }
    
    // For px or unitless values, return the numeric part
    return numericValue
  }
  
  return defaultValue
}

/**
 * Get effective padding value with step-level override support
 */
export function getEffectivePadding(
  stepPadding: number | string | undefined,
  globalPadding: number | string | undefined,
  defaultValue: number = 10
): number {
  // Step-level padding takes precedence
  if (stepPadding !== undefined) {
    return parsePadding(stepPadding, defaultValue)
  }
  
  // Fall back to global padding
  return parsePadding(globalPadding, defaultValue)
}

/**
 * Get effective radius value with step-level override support
 */
export function getEffectiveRadius(
  stepRadius: number | string | undefined,
  globalRadius: number | string | undefined,
  defaultValue: number = 5
): number {
  // Step-level radius takes precedence
  if (stepRadius !== undefined) {
    return parseRadius(stepRadius, defaultValue)
  }
  
  // Fall back to global radius
  return parseRadius(globalRadius, defaultValue)
}

/**
 * Validate and normalize CSS length values
 */
export function normalizeCSSLength(value: number | string | undefined, defaultValue: number): string {
  const numericValue = typeof value === 'number' ? value : parsePadding(value, defaultValue)
  return `${numericValue}px`
}
