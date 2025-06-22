# Skip Tour Feature

The Skip Tour feature allows users to skip the entire tour from the first step, providing a quick exit option for users who don't want to go through the complete tour experience.

## Overview

The skip functionality is integrated into the shared composable architecture to ensure consistency between MintCoachMark and QuasarCoachMark components. The skip button only appears on the first step (step index 0) and allows users to immediately end the tour without proceeding through remaining steps.

## Configuration

### Global Configuration

You can configure the skip feature globally through the coach mark configuration:

```typescript
const config: CoachMarkConfig = {
  allowSkip: true,              // Enable/disable skip feature (default: true)
  skipBtnText: 'Skip Tour',     // Customize skip button text (default: 'Skip Tour')
  onSkipClick: (element, step, context) => {
    // Global skip handler
    console.log('Tour skipped from step:', step.popover?.title);
  }
}
```

### Step-Level Configuration

You can also configure skip behavior at the step level:

```typescript
const steps: CoachMarkStep[] = [
  {
    element: '#first-element',
    popover: {
      title: 'Welcome!',
      description: 'This is the first step with skip option.',
      showButtons: ['skip', 'next', 'close'],  // Include 'skip' in buttons
      skipBtnText: 'Skip This Tour',            // Override global skip text
      onSkipClick: (element, step, context) => {
        // Step-specific skip handler
        console.log('Skipped from welcome step');
      }
    }
  },
  // ... other steps
]
```

## Button Visibility Logic

The skip button follows these visibility rules:

1. **Only on First Step**: The skip button only appears when `currentStepIndex === 0`
2. **Configuration Enabled**: `allowSkip` must be `true` (default)
3. **Button Included**: `'skip'` must be included in the `showButtons` array
4. **Not Disabled**: `'skip'` must not be in the `disableButtons` array

```typescript
// Skip button will be visible
const shouldShowSkip = 
  allowSkip && 
  currentStepIndex === 0 && 
  showButtons.includes('skip') && 
  !disableButtons.includes('skip')
```

## Events

### tour-skipped Event

When the skip button is clicked, a `tour-skipped` event is emitted:

```typescript
// Event payload
interface TourSkippedEvent {
  step: CoachMarkStep;    // The step from which tour was skipped
  index: number;          // The step index (always 0 for skip)
}

// Usage in Vue component
<MintCoachMark 
  @tour-skipped="handleTourSkipped"
  :steps="steps"
  :config="config"
/>

// Handler
function handleTourSkipped(step: CoachMarkStep, index: number) {
  console.log(`Tour skipped from step ${index}:`, step.popover?.title);
  // Track analytics, show feedback, etc.
}
```

## Implementation Examples

### Basic Usage with MintCoachMark

```vue
<template>
  <MintCoachMark
    v-model="showTour"
    :steps="tourSteps"
    :config="tourConfig"
    @tour-skipped="onTourSkipped"
    @tour-complete="onTourComplete"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MintCoachMark } from 'mint-coach-mark'

const showTour = ref(false)

const tourSteps = [
  {
    element: '#welcome',
    popover: {
      title: 'Welcome to Our App!',
      description: 'Take a quick tour or skip if you prefer to explore on your own.',
      showButtons: ['skip', 'next', 'close'],
      showProgress: true
    }
  },
  // ... more steps
]

const tourConfig = {
  allowSkip: true,
  skipBtnText: 'Skip Tour',
  animate: true
}

function onTourSkipped(step, index) {
  console.log('User skipped the tour')
  // Analytics tracking
  analytics.track('tour_skipped', {
    step_title: step.popover?.title,
    step_index: index
  })
}

function onTourComplete() {
  console.log('User completed the tour')
}
</script>
```

### Usage with QuasarCoachMark

```vue
<template>
  <QuasarCoachMark
    v-model="showTour"
    :steps="tourSteps"
    :config="tourConfig"
    @tour-skipped="onTourSkipped"
  >
    <!-- Custom skip button slot -->
    <template #skip-button="{ step, index }">
      <q-btn 
        flat 
        color="grey" 
        label="Not Now" 
        @click="handleCustomSkip"
      />
    </template>
  </QuasarCoachMark>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QuasarCoachMark } from 'mint-coach-mark'

const showTour = ref(false)

// ... same configuration as above

function handleCustomSkip() {
  // Custom skip logic
  showTour.value = false
}
</script>
```

### Programmatic Skip

You can also skip the tour programmatically:

```typescript
// Get component reference
const coachMarkRef = ref()

// Skip the tour programmatically
function skipTourProgrammatically() {
  coachMarkRef.value?.skipTour()
}
```

## Customization

### Custom Skip Button Styling

```css
/* Style the skip button */
.mint-coach-mark-popover__btn--skip {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
}

.mint-coach-mark-popover__btn--skip:hover {
  background-color: #5a6268;
}

/* Quasar component styling */
.mint-coach-mark-quasar-btn--skip {
  background-color: #6c757d;
  color: white;
}
```

### Custom Skip Button Content

```vue
<template>
  <MintCoachMark :steps="steps" :config="config">
    <template #skip-button="{ step, index }">
      <button class="custom-skip-btn" @click="handleSkip">
        <Icon name="close" />
        Skip Tutorial
      </button>
    </template>
  </MintCoachMark>
</template>
```

## Best Practices

1. **Always Include Skip Option**: Provide users with an easy way to exit the tour
2. **Clear Skip Button Text**: Use descriptive text like "Skip Tour" or "Skip Tutorial"
3. **Track Skip Events**: Monitor skip rates to improve tour content
4. **Respect User Choice**: Don't show the tour again immediately after skipping
5. **Provide Alternative Help**: Offer other ways to access help after skipping

## Accessibility

The skip button includes proper accessibility attributes:

- `aria-label` for screen readers
- Keyboard navigation support
- Focus management
- High contrast support

## Browser Support

The skip feature works in all modern browsers that support the base mint-coach-mark library:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Migration Guide

If you're upgrading from a version without skip functionality:

1. **No Breaking Changes**: The skip feature is opt-in and doesn't affect existing tours
2. **Update Button Arrays**: Add `'skip'` to `showButtons` arrays where desired
3. **Add Event Handlers**: Implement `@tour-skipped` event handlers for analytics
4. **Test Thoroughly**: Verify skip behavior works as expected in your application

## Troubleshooting

### Skip Button Not Showing

1. Check that `allowSkip` is `true` in configuration
2. Verify `'skip'` is included in `showButtons` array
3. Ensure you're on the first step (index 0)
4. Check that `'skip'` is not in `disableButtons` array

### Skip Event Not Firing

1. Verify `@tour-skipped` event handler is properly bound
2. Check browser console for JavaScript errors
3. Ensure the skip button is actually being clicked (not disabled)

### Styling Issues

1. Check CSS specificity for custom skip button styles
2. Verify proper class names are being used
3. Test in different browsers for consistency
