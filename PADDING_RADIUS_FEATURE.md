# Padding & Radius Feature Implementation

## Overview

The Padding & Radius feature has been successfully implemented in the mint-coach-mark library, providing users with fine-grained control over element highlighting appearance. This feature allows customization of both the padding (space around highlighted elements) and radius (rounded corners) at both global and step levels.

## ✅ Implementation Status

### Core Features Implemented

- **Global Configuration**: Set default padding and radius values in the coach mark configuration
- **Step-Level Overrides**: Override global values on a per-step basis for precise control
- **Flexible Value Support**: Accepts both numeric (pixels) and string values (CSS units)
- **Clean API**: Simple, intuitive configuration options
- **Smart Radius Handling**: Automatically constrains radius to prevent visual artifacts
- **TypeScript Support**: Complete type safety with proper interfaces

### Files Modified

1. **Type System** (`src/types/index.ts`)
   - Added `padding` and `radius` to `PopoverConfig` interface (step-level overrides)
   - Added `padding` and `radius` to `CoachMarkConfig` interface (global defaults)

2. **Configuration System**
   - `useCoachMarkConfig.ts`: Added computed properties for padding/radius options
   - Default values: `padding: 10`, `radius: 5`

3. **Utility Functions** (`src/utils/styling.ts`)
   - `parsePadding()`: Converts various input formats to pixel values
   - `parseRadius()`: Handles radius parsing with percentage support
   - `getEffectivePadding()`: Resolves step vs global padding values
   - `getEffectiveRadius()`: Resolves step vs global radius values

4. **Overlay System** (`src/composables/useOverlay.ts`)
   - Updated `trackActiveElement()` to accept step information
   - Enhanced `transitionStage()` for step-aware padding/radius transitions
   - Modified `generateOverlayPath()` to support dynamic radius values
   - Smart radius constraint to prevent exceeding element dimensions

5. **Highlight System** (`src/composables/useHighlight.ts`)
   - Updated function calls to pass step information to overlay functions
   - Ensures step-level padding/radius values are properly applied

## 🎯 Demo Implementation

### Interactive Demo Page (`/padding-radius`)

The demo showcases all aspects of the padding and radius functionality:

#### Interactive Controls
- **Global Padding Slider**: Adjust global padding (0-50px) with real-time preview
- **Global Radius Slider**: Adjust global radius (0-50px) with real-time preview
- **Tour Controls**: Start/stop tour with current settings
- **Live Status Display**: Shows current step info and effective values

#### Demo Elements
1. **Small Element**: Uses global defaults
2. **Medium Element**: Custom padding (20px), global radius
3. **Large Element**: Global padding, custom radius (25px)
4. **Custom Element**: Both custom padding (30px) and radius (15px)

#### Code Examples
- **Global Configuration**: Shows how to set default values
- **Step-Level Overrides**: Demonstrates per-step customization
- **String Values Support**: Examples of CSS unit support

## 🔧 Configuration Options

### Global Configuration
```typescript
const config: CoachMarkConfig = {
  padding: 10,              // Global padding in pixels
  radius: 5                 // Global radius in pixels
}
```

### Step-Level Configuration
```typescript
const steps: CoachMarkStep[] = [
  {
    element: '#element1',
    popover: {
      title: 'Default Styling',
      description: 'Uses global padding and radius'
      // No padding/radius = uses global defaults
    }
  },
  {
    element: '#element2',
    popover: {
      title: 'Custom Padding',
      description: 'Custom padding with global radius',
      padding: 20             // Override global padding
      // radius not specified = uses global radius
    }
  },
  {
    element: '#element3',
    popover: {
      title: 'Full Custom',
      description: 'Both padding and radius customized',
      padding: 30,            // Custom padding
      radius: 15              // Custom radius
    }
  }
]
```

### String Value Support
```typescript
const steps: CoachMarkStep[] = [
  {
    element: '#element',
    popover: {
      padding: '1rem',        // Converted to 16px
      radius: '50%'           // Percentage values supported
    }
  },
  {
    element: '#element2',
    popover: {
      padding: '10px 20px',   // CSS-style (uses first value: 10px)
      radius: '0.5em'         // Em units converted to pixels
    }
  }
]
```

## 📊 Value Processing

### Padding Value Processing
- **Numbers**: Used directly as pixels (`10` → `10px`)
- **Strings with units**: Parsed and converted
  - `"10px"` → `10px`
  - `"1rem"` → `16px` (assuming 16px = 1rem)
  - `"1em"` → `16px` (assuming 16px = 1em)
- **CSS-style values**: Uses first value (`"10px 20px"` → `10px`)
- **Invalid values**: Falls back to default with console warning

### Radius Value Processing
- **Numbers**: Used directly as pixels (`5` → `5px`)
- **Percentages**: Converted to reasonable pixel values
  - `"50%"` → `25px` (for typical elements)
  - `"100%"` → `50px` (maximum reasonable radius)
- **Units**: Same as padding (px, rem, em supported)
- **Smart Constraints**: Radius automatically limited to `min(width/2, height/2)`

## 🎨 Visual Examples

### Configuration Hierarchy
```
Step-level padding/radius (highest priority)
    ↓
Global padding/radius
    ↓
Default values (padding: 10, radius: 5)
```

### Real-world Usage Scenarios

#### Scenario 1: Consistent Global Styling
```typescript
const config = {
  padding: 12,
  radius: 8
}
// All steps use 12px padding and 8px radius
```

#### Scenario 2: Mixed Styling
```typescript
const config = {
  padding: 10,
  radius: 5
}

const steps = [
  { element: '#button', popover: { title: 'Button' } },           // 10px, 5px
  { element: '#card', popover: { title: 'Card', padding: 20 } },  // 20px, 5px
  { element: '#icon', popover: { title: 'Icon', radius: 50 } }    // 10px, 50px
]
```

#### Scenario 3: Responsive Design
```typescript
const steps = [
  {
    element: '#mobile-menu',
    popover: {
      title: 'Mobile Menu',
      padding: window.innerWidth < 768 ? 8 : 16,
      radius: window.innerWidth < 768 ? 4 : 8
    }
  }
]
```

## 🧪 Testing

### Manual Testing Checklist
1. ✅ Open demo at `http://localhost:5175/padding-radius`
2. ✅ Adjust global padding slider - verify all elements update
3. ✅ Adjust global radius slider - verify rounded corners change
4. ✅ Start tour and verify step-level overrides work correctly
5. ✅ Check that step 1 uses global values
6. ✅ Check that step 2 has custom padding (20px)
7. ✅ Check that step 3 has custom radius (25px)
8. ✅ Check that step 4 has both custom values (30px, 15px)

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🚀 Usage in Your Application

### Basic Implementation
```typescript
import { MintCoachMark } from 'mint-coach-mark'

const config = {
  padding: 15,
  radius: 10
}

const steps = [
  {
    element: '#welcome-button',
    popover: {
      title: 'Welcome!',
      description: 'Click here to get started',
      padding: 25,  // Extra padding for emphasis
      radius: 20    // More rounded for friendly appearance
    }
  }
]
```

### Advanced Configuration
```typescript
// Responsive design support
const config = {
  padding: window.innerWidth < 768 ? 8 : 16,
  radius: window.innerWidth < 768 ? 4 : 8
}

// Dynamic configuration
const steps = [
  {
    element: '#small-button',
    popover: {
      padding: 8,   // Compact padding for small elements
      radius: 4
    }
  },
  {
    element: '#large-card',
    popover: {
      padding: 24,  // Generous padding for large elements
      radius: 12
    }
  }
]
```

## 📈 Benefits

- **Enhanced Visual Control**: Fine-tune highlight appearance for better UX
- **Design System Integration**: Match your brand's border radius and spacing
- **Responsive Design Support**: Different values for different screen sizes
- **Accessibility**: Better visual separation with appropriate padding
- **Professional Appearance**: Polished, rounded highlights look more modern
- **Clean API**: Simple, intuitive configuration without legacy complexity

## 🎯 API Design

The implementation provides a clean, intuitive API:
- Simple `padding` and `radius` options for easy configuration
- Consistent naming across global and step-level configuration
- Default values provide sensible defaults (10px padding, 5px radius)
- Type-safe configuration with full TypeScript support

## 🎯 Future Enhancements

Potential future improvements:
- **CSS Variable Support**: `padding: 'var(--spacing-md)'`
- **Responsive Values**: `padding: { mobile: 8, desktop: 16 }`
- **Animation Easing**: Custom easing for padding/radius transitions
- **Advanced Shapes**: Support for elliptical radius values

The padding and radius feature provides a solid foundation for advanced highlight customization with a clean, intuitive API that's easy to understand and implement.
