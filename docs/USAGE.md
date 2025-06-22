# MintCoachMark Usage Guide

## Installation

```bash
npm install mint-coach-mark
```

## Basic Usage

### Component-based Approach

```vue
<template>
  <div>
    <!-- Your app content -->
    <button id="step1" class="btn">First Step</button>
    <div id="step2" class="card">Second Step</div>
    <input id="step3" type="text" placeholder="Third Step" />
    
    <!-- Coach Mark Component -->
    <MintCoachMark
      v-model="showTour"
      :steps="tourSteps"
      :config="tourConfig"
      @tour-start="onTourStart"
      @tour-complete="onTourComplete"
      @step-change="onStepChange"
    />
    
    <!-- Start tour button -->
    <button @click="startTour">Start Tour</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MintCoachMark } from 'mint-coach-mark'
import 'mint-coach-mark/dist/style.css'

const showTour = ref(false)

const tourSteps = [
  {
    element: '#step1',
    popover: {
      title: 'Welcome!',
      description: 'This is your first step in the tour.',
      side: 'bottom'
    }
  },
  {
    element: '#step2',
    popover: {
      title: 'Second Step',
      description: 'Here you can see more information.',
      side: 'right'
    }
  },
  {
    element: '#step3',
    popover: {
      title: 'Final Step',
      description: 'This is the last step of our tour.',
      side: 'top'
    }
  }
]

const tourConfig = {
  animate: true,
  allowClose: true,
  showProgress: true,
  stagePadding: 10
}

function startTour() {
  showTour.value = true
}

function onTourStart() {
  console.log('Tour started!')
}

function onTourComplete() {
  console.log('Tour completed!')
  showTour.value = false
}

function onStepChange(step, index) {
  console.log(`Step ${index + 1}:`, step)
}
</script>
```

### Composable-based Approach

```vue
<template>
  <div>
    <!-- Your app content -->
    <button id="step1" @click="startTour">Start Tour</button>
    <div id="step2">Content to highlight</div>
    
    <!-- Manual popover control -->
    <MintPopover
      :visible="showPopover"
      :target-element="currentElement"
      :title="currentStep?.popover?.title"
      :description="currentStep?.popover?.description"
      @next="handleNext"
      @previous="handlePrevious"
      @close="handleClose"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCoachMark, MintPopover } from 'mint-coach-mark'
import 'mint-coach-mark/dist/style.css'

const steps = [
  {
    element: '#step1',
    popover: {
      title: 'Start Here',
      description: 'Click this button to begin.'
    }
  },
  {
    element: '#step2',
    popover: {
      title: 'Important Content',
      description: 'This section contains important information.'
    }
  }
]

const {
  isActive,
  currentStepIndex,
  drive,
  destroy,
  moveNext,
  movePrevious,
  getActiveStep,
  getActiveElement
} = useCoachMark({ steps })

const showPopover = computed(() => isActive.value)
const currentElement = computed(() => getActiveElement())
const currentStep = computed(() => getActiveStep())

function startTour() {
  drive(0)
}

function handleNext() {
  moveNext()
}

function handlePrevious() {
  movePrevious()
}

function handleClose() {
  destroy()
}
</script>
```

## Configuration Options

### Global Configuration

```javascript
const config = {
  // Animation settings
  animate: true,
  smoothScroll: false,
  
  // Overlay settings
  overlayColor: '#000',
  overlayOpacity: 0.7,
  overlayClickBehavior: 'close', // 'close' | 'nextStep'
  
  // Stage settings
  stagePadding: 10,
  stageRadius: 5,
  
  // Interaction settings
  allowClose: true,
  allowKeyboardControl: true,
  disableActiveInteraction: false,
  
  // Popover settings
  popoverOffset: 10,
  showButtons: ['next', 'previous', 'close'],
  disableButtons: [],
  showProgress: false,
  
  // Button text
  nextBtnText: 'Next',
  prevBtnText: 'Previous',
  doneBtnText: 'Done',
  progressText: '{{current}} of {{total}}',
  
  // Hooks
  onHighlightStarted: (element, step, { config, state, driver }) => {
    console.log('Highlight started', element, step)
  },
  onHighlighted: (element, step, { config, state, driver }) => {
    console.log('Element highlighted', element, step)
  },
  onDeselected: (element, step, { config, state, driver }) => {
    console.log('Element deselected', element, step)
  },
  onDestroyed: (element, step, { config, state, driver }) => {
    console.log('Tour destroyed', element, step)
  }
}
```

### Step Configuration

```javascript
const step = {
  // Element selector, element, or function returning element
  element: '#my-element', // or document.getElementById('my-element') or () => document.querySelector('.dynamic')
  
  // Disable interaction with the highlighted element
  disableActiveInteraction: false,
  
  // Step-specific hooks
  onHighlightStarted: (element, step, context) => {},
  onHighlighted: (element, step, context) => {},
  onDeselected: (element, step, context) => {},
  
  // Popover configuration
  popover: {
    title: 'Step Title',
    description: 'Step description text',
    side: 'bottom', // 'top' | 'right' | 'bottom' | 'left' | 'over'
    alignment: 'center', // 'start' | 'center' | 'end'
    
    // Button configuration
    showButtons: ['next', 'previous', 'close'],
    disableButtons: [],
    nextBtnText: 'Continue',
    prevBtnText: 'Back',
    doneBtnText: 'Finish',
    
    // Progress
    showProgress: true,
    progressText: 'Step {{current}} of {{total}}',
    
    // Styling
    popoverClass: 'my-custom-popover',
    
    // Event handlers
    onNextClick: (element, step, context) => {
      // Custom next logic
      context.driver.moveNext()
    },
    onPrevClick: (element, step, context) => {
      // Custom previous logic
      context.driver.movePrevious()
    },
    onCloseClick: (element, step, context) => {
      // Custom close logic
      context.driver.destroy()
    }
  }
}
```

## Advanced Usage

### Custom Slots

```vue
<template>
  <MintCoachMark v-model="showTour" :steps="steps">
    <!-- Custom title slot -->
    <template #title="{ step, index }">
      <div class="custom-title">
        <icon :name="step.icon" />
        {{ step.popover.title }}
      </div>
    </template>
    
    <!-- Custom content slot -->
    <template #content="{ step, index }">
      <div class="custom-content">
        <p>{{ step.popover.description }}</p>
        <img v-if="step.image" :src="step.image" alt="" />
      </div>
    </template>
    
    <!-- Custom progress slot -->
    <template #progress="{ step, index, total }">
      <div class="custom-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${((index + 1) / total) * 100}%` }"
          />
        </div>
        <span>{{ index + 1 }} / {{ total }}</span>
      </div>
    </template>
    
    <!-- Custom button slots -->
    <template #next-button="{ step, index }">
      <button class="custom-btn custom-btn--primary">
        {{ index === steps.length - 1 ? 'Finish' : 'Next' }}
      </button>
    </template>
    
    <template #prev-button>
      <button class="custom-btn custom-btn--secondary">
        Previous
      </button>
    </template>
  </MintCoachMark>
</template>
```

### Programmatic Control

```javascript
import { useCoachMark } from 'mint-coach-mark'

const coach = useCoachMark({
  steps: [/* your steps */]
})

// Start tour
coach.drive(0)

// Navigate
coach.moveNext()
coach.movePrevious()
coach.moveTo(2)

// Check state
console.log(coach.isActive())
console.log(coach.getActiveIndex())
console.log(coach.getActiveStep())
console.log(coach.hasNextStep())
console.log(coach.hasPreviousStep())

// Highlight single element
coach.highlight({
  element: '#special-element',
  popover: {
    title: 'Special Feature',
    description: 'This is a special feature.'
  }
})

// Destroy tour
coach.destroy()
```

## Styling and Theming

### CSS Custom Properties

```css
:root {
  --mint-coach-mark-overlay-color: #000;
  --mint-coach-mark-overlay-opacity: 0.8;
  --mint-coach-mark-popover-bg: #ffffff;
  --mint-coach-mark-popover-color: #333333;
  --mint-coach-mark-popover-border-radius: 8px;
  --mint-coach-mark-popover-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  --mint-coach-mark-button-bg: #007bff;
  --mint-coach-mark-button-color: #ffffff;
  --mint-coach-mark-button-hover-bg: #0056b3;
}
```

### Custom CSS Classes

```css
.my-custom-popover {
  border: 2px solid #007bff;
}

.my-custom-popover .mint-coach-mark-popover__title {
  color: #007bff;
  font-size: 20px;
}

.my-custom-popover .mint-coach-mark-popover__btn--next {
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
}
```

## TypeScript Support

```typescript
import type { 
  CoachMarkConfig, 
  CoachMarkStep, 
  CoachMarkHook 
} from 'mint-coach-mark'

const config: CoachMarkConfig = {
  animate: true,
  showProgress: true
}

const steps: CoachMarkStep[] = [
  {
    element: '#step1',
    popover: {
      title: 'First Step',
      description: 'This is the first step'
    }
  }
]

const onHighlighted: CoachMarkHook = (element, step, context) => {
  console.log('Element highlighted:', element)
}
```
