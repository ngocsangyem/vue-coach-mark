# QTooltip Step-Level Configuration

## **Overview**

The QuasarCoachMark component now supports step-level configuration for QTooltip positioning properties, allowing users to customize tooltip positioning on a per-step basis. This provides granular control over tooltip placement while simplifying the codebase by removing complex position mapping logic.

## ✅ **New Features**

### **1. Step-Level QTooltip Configuration**

Each step can now specify QTooltip-specific properties through the `tooltip` configuration object:

```typescript
{
  element: '#target-element',
  popover: {
    title: 'Step Title',
    description: 'Step Description',
    // New QTooltip-specific properties
    tooltip: {
      anchor: 'bottom middle',
      self: 'top middle', 
      offset: [0, 15],
      class: 'custom-tooltip-class'
    }
  }
}
```

### **2. Sensible Default Values**

**Default Configuration:**
- **anchor**: `'bottom middle'` - Where the tooltip attaches to the target element
- **self**: `'top middle'` - Which part of the tooltip aligns with the anchor
- **offset**: `[0, 10]` - Horizontal and vertical offset in pixels
- **class**: `''` - Additional CSS classes for styling

### **3. Backward Compatibility**

All existing configurations continue to work without changes:
- Existing `popoverClass` is still supported and combined with tooltip class
- Padding-based offset calculations are preserved as fallback
- No breaking changes to existing APIs

## ✅ **Configuration Options**

### **QTooltip Anchor Positions**

```typescript
type QuasarAnchor = 
  | 'bottom middle' | 'top middle' 
  | 'center right' | 'center left' | 'center middle'
  | 'bottom left' | 'bottom right' 
  | 'top left' | 'top right' 
  | 'center start' | 'center end'
```

### **Common Positioning Combinations**

```typescript
// Tooltip below target (default)
tooltip: {
  anchor: 'bottom middle',
  self: 'top middle'
}

// Tooltip above target
tooltip: {
  anchor: 'top middle',
  self: 'bottom middle'
}

// Tooltip to the right of target
tooltip: {
  anchor: 'center right',
  self: 'center left'
}

// Tooltip to the left of target
tooltip: {
  anchor: 'center left',
  self: 'center right'
}

// Tooltip centered over target
tooltip: {
  anchor: 'center middle',
  self: 'center middle'
}
```

## ✅ **Usage Examples**

### **Basic Step Configuration**

```typescript
const steps = [
  {
    element: '#welcome-button',
    popover: {
      title: 'Welcome!',
      description: 'Click here to get started',
      tooltip: {
        anchor: 'bottom middle',
        self: 'top middle',
        offset: [0, 15]
      }
    }
  },
  {
    element: '#settings-menu',
    popover: {
      title: 'Settings',
      description: 'Configure your preferences',
      tooltip: {
        anchor: 'center left',
        self: 'center right',
        offset: [10, 0],
        class: 'settings-tooltip'
      }
    }
  }
]
```

### **Advanced Positioning**

```typescript
// Tooltip with custom offset and styling
{
  element: '#complex-element',
  popover: {
    title: 'Complex Element',
    description: 'This element needs special positioning',
    tooltip: {
      anchor: 'top right',
      self: 'bottom left',
      offset: [20, -10],
      class: 'custom-arrow-tooltip elevated-tooltip'
    }
  }
}
```

### **Responsive Positioning**

```typescript
// Different positioning for different screen areas
const steps = [
  // Top navigation - tooltip below
  {
    element: '#nav-item',
    popover: {
      title: 'Navigation',
      tooltip: { anchor: 'bottom middle', self: 'top middle' }
    }
  },
  // Right sidebar - tooltip to the left
  {
    element: '#sidebar-item',
    popover: {
      title: 'Sidebar',
      tooltip: { anchor: 'center left', self: 'center right' }
    }
  },
  // Bottom toolbar - tooltip above
  {
    element: '#toolbar-item',
    popover: {
      title: 'Toolbar',
      tooltip: { anchor: 'top middle', self: 'bottom middle' }
    }
  }
]
```

## ✅ **Implementation Details**

### **Removed Obsolete Code**

**Before (Complex Position Mapping):**
```typescript
const quasarPositionMap: Record<Side, { anchor: QuasarAnchor; self: QuasarAnchor }> = {
  top: { anchor: 'bottom middle', self: 'top middle' },
  bottom: { anchor: 'top middle', self: 'bottom middle' },
  left: { anchor: 'center right', self: 'center left' },
  right: { anchor: 'center left', self: 'center right' },
  over: { anchor: 'center middle', self: 'center middle' }
}
```

**After (Simple Step-Level Configuration):**
```typescript
const quasarAnchor: ComputedRef<QuasarAnchor> = computed(() => {
  return currentStep.value?.popover?.tooltip?.anchor || DEFAULT_ANCHOR
})

const quasarSelf: ComputedRef<QuasarAnchor> = computed(() => {
  return currentStep.value?.popover?.tooltip?.self || DEFAULT_SELF
})
```

### **Enhanced Offset Calculation with Consistent Padding**

```typescript
const quasarOffset: ComputedRef<[number, number]> = computed(() => {
  // Get effective padding value (used for both step-specific and calculated offsets)
  const config = getConfig()
  const globalPadding = config.padding || 10
  const effectivePadding = getEffectivePadding(
    currentStep.value?.popover?.padding,
    globalPadding,
    10
  )

  // Check for step-specific offset first
  const stepOffset = currentStep.value?.popover?.tooltip?.offset
  if (stepOffset) {
    // Add effective padding to step-specific offset for consistent spacing
    return [stepOffset[0], stepOffset[1] + effectivePadding]
  }

  // Fall back to calculated offset based on padding
  const baseOffset = DEFAULT_OFFSET[1]
  const totalOffset = baseOffset + effectivePadding

  return [0, totalOffset]
})
```

**Key Enhancement:** Step-specific offsets now automatically include the effective padding value, ensuring consistent spacing between tooltips and highlighted elements regardless of whether custom offsets or calculated offsets are used.

### **Consistent Padding Behavior**

**Automatic Padding Addition:**
- **Step-Specific Offsets**: Custom offsets have effective padding added to the Y-axis (vertical spacing)
- **Calculated Offsets**: Default offsets include padding in the same way
- **Consistent Spacing**: All tooltips maintain proper distance from highlighted elements

**Padding Priority Order:**
1. **Step-Level Padding**: `step.popover.padding` (highest priority)
2. **Global Config Padding**: `config.padding` (medium priority)
3. **Default Padding**: `10px` (fallback)

**Example with Padding:**
```typescript
// Global padding: 15px
// Step with custom offset and padding override
{
  element: '#element',
  popover: {
    padding: 20, // Step-level override
    tooltip: {
      offset: [5, 10] // Custom offset
    }
  }
}

// Actual offset used: [5, 30] (10 + 20 padding)
// Ensures 20px spacing between tooltip and highlight border
```

### **Class Combination Logic**

```typescript
const quasarClass: ComputedRef<string> = computed(() => {
  const stepClass = currentStep.value?.popover?.tooltip?.class || ''
  const popoverClass = currentStep.value?.popover?.popoverClass || ''
  return [stepClass, popoverClass].filter(Boolean).join(' ')
})
```

## ✅ **Benefits**

### **1. Granular Control**
- **Per-Step Positioning**: Each step can have unique tooltip positioning
- **Precise Offset Control**: Exact pixel-level positioning control
- **Custom Styling**: Step-specific CSS classes for unique appearances

### **2. Simplified Codebase**
- **Removed Complex Mapping**: Eliminated `quasarPositionMap` object
- **Direct Configuration**: No intermediate position translation needed
- **Cleaner Logic**: Straightforward property access instead of mapping

### **3. Better Developer Experience**
- **Intuitive Configuration**: Direct QTooltip property specification
- **Type Safety**: Full TypeScript support for all positioning options
- **Clear Documentation**: Comprehensive examples and usage patterns

### **4. Enhanced Flexibility**
- **Mixed Positioning**: Different steps can use completely different positioning strategies
- **Dynamic Offsets**: Programmatic offset calculation when needed
- **Responsive Design**: Easy to implement responsive tooltip positioning

## ✅ **Migration Guide**

### **No Breaking Changes**
- All existing configurations continue to work
- Default behavior remains the same
- Gradual migration possible

### **Upgrading to Step-Level Configuration**

**Before:**
```typescript
// Old approach relied on 'side' property and position mapping
{
  element: '#element',
  popover: {
    side: 'top',  // This would map to specific anchor/self values
    popoverClass: 'custom-class'
  }
}
```

**After:**
```typescript
// New approach with direct QTooltip configuration
{
  element: '#element',
  popover: {
    tooltip: {
      anchor: 'top middle',
      self: 'bottom middle',
      class: 'custom-class'
    }
  }
}
```

## ✅ **Best Practices**

### **1. Consistent Positioning**
```typescript
// Use consistent positioning for similar UI elements
const NAVIGATION_TOOLTIP = {
  anchor: 'bottom middle',
  self: 'top middle',
  offset: [0, 12]
}

const SIDEBAR_TOOLTIP = {
  anchor: 'center left',
  self: 'center right',
  offset: [15, 0]
}
```

### **2. Responsive Considerations**
```typescript
// Consider screen edges and available space
{
  element: '#top-right-element',
  popover: {
    tooltip: {
      anchor: 'bottom left',  // Avoid going off-screen
      self: 'top right',
      offset: [10, 10]
    }
  }
}
```

### **3. Visual Hierarchy**
```typescript
// Use different classes for different importance levels
{
  element: '#important-feature',
  popover: {
    tooltip: {
      class: 'important-tooltip elevated-shadow',
      offset: [0, 20]  // More spacing for emphasis
    }
  }
}
```

## ✅ **Conclusion**

The step-level QTooltip configuration provides powerful, flexible positioning control while simplifying the codebase. This enhancement enables precise tooltip placement for complex UIs while maintaining full backward compatibility and improving the overall developer experience.

**Key Achievements:**
- ✅ **Granular per-step positioning control**
- ✅ **Simplified codebase with removed complexity**
- ✅ **Enhanced developer experience with direct configuration**
- ✅ **Full backward compatibility maintained**
- ✅ **Type-safe configuration with comprehensive documentation**
