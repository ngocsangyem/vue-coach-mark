<template>
  <div class="padding-radius-demo">
    <!-- Coach Mark Component -->
    <MintCoachMark
      v-model="showTour"
      :steps="tourSteps"
      :config="tourConfig"
      @tour-start="handleTourStart"
      @tour-complete="handleTourComplete"
      @step-change="handleStepChange"
    />

    <!-- Header -->
    <section class="demo-header">
      <h1>🎨 Padding & Radius Demo</h1>
      <p class="demo-description">
        Explore how padding and radius options affect element highlighting. 
        Configure global defaults and step-level overrides to create the perfect highlight appearance.
      </p>
    </section>

    <!-- Interactive Controls -->
    <section class="controls-section">
      <h2>🎮 Interactive Controls</h2>
      
      <div class="controls-grid">
        <!-- Global Configuration -->
        <div class="control-panel">
          <h3>Global Configuration</h3>
          <div class="control-group">
            <label>Global Padding:</label>
            <input 
              v-model.number="globalPadding" 
              type="range" 
              min="0" 
              max="50" 
              @input="updateGlobalConfig"
            />
            <span class="value-display">{{ globalPadding }}px</span>
          </div>
          
          <div class="control-group">
            <label>Global Radius:</label>
            <input 
              v-model.number="globalRadius" 
              type="range" 
              min="0" 
              max="50" 
              @input="updateGlobalConfig"
            />
            <span class="value-display">{{ globalRadius }}px</span>
          </div>
          
          <div class="control-actions">
            <button @click="startTour" class="btn btn-primary" :disabled="showTour">
              ▶️ Start Tour
            </button>
            <button @click="stopTour" class="btn btn-secondary" :disabled="!showTour">
              ⏹️ Stop Tour
            </button>
          </div>
        </div>

        <!-- Current Step Info -->
        <div class="info-panel">
          <h3>Current Step Info</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Tour Active:</span>
              <span class="info-value" :class="{ active: showTour }">
                {{ showTour ? 'Yes' : 'No' }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Current Step:</span>
              <span class="info-value">{{ currentStepInfo }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Step Padding:</span>
              <span class="info-value">{{ currentStepPadding }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Step Radius:</span>
              <span class="info-value">{{ currentStepRadius }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Elements -->
    <section class="demo-elements">
      <h2>🎯 Demo Elements</h2>
      
      <div class="elements-grid">
        <!-- Small Element -->
        <div class="demo-element-container">
          <h3>Small Element (Default)</h3>
          <button id="small-element" class="demo-element small">
            Small Button
          </button>
          <p class="element-description">
            Uses global padding ({{ globalPadding }}px) and radius ({{ globalRadius }}px)
          </p>
        </div>

        <!-- Medium Element -->
        <div class="demo-element-container">
          <h3>Medium Element (Custom Padding)</h3>
          <div id="medium-element" class="demo-element medium">
            Medium Card
          </div>
          <p class="element-description">
            Custom padding: 20px, Global radius: {{ globalRadius }}px
          </p>
        </div>

        <!-- Large Element -->
        <div class="demo-element-container">
          <h3>Large Element (Custom Radius)</h3>
          <div id="large-element" class="demo-element large">
            Large Panel
          </div>
          <p class="element-description">
            Global padding: {{ globalPadding }}px, Custom radius: 25px
          </p>
        </div>

        <!-- Custom Element -->
        <div class="demo-element-container">
          <h3>Custom Element (Both Custom)</h3>
          <div id="custom-element" class="demo-element custom">
            Custom Element
          </div>
          <p class="element-description">
            Custom padding: 30px, Custom radius: 15px
          </p>
        </div>
      </div>
    </section>

    <!-- Code Examples -->
    <section class="code-examples">
      <h2>💻 Implementation Examples</h2>
      
      <div class="code-tabs">
        <button 
          v-for="tab in codeTabs" 
          :key="tab.id"
          @click="activeCodeTab = tab.id"
          class="code-tab"
          :class="{ active: activeCodeTab === tab.id }"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="code-content">
        <div v-if="activeCodeTab === 'global'" class="code-example">
          <h3>Global Configuration</h3>
          <pre><code>const config: CoachMarkConfig = {
  padding: {{ globalPadding }},    // Global padding in pixels
  radius: {{ globalRadius }},     // Global radius in pixels
  animate: true
}</code></pre>
        </div>

        <div v-if="activeCodeTab === 'step'" class="code-example">
          <h3>Step-Level Overrides</h3>
          <pre><code>const steps: CoachMarkStep[] = [
  {
    element: '#small-element',
    popover: {
      title: 'Default Styling',
      description: 'Uses global padding and radius values'
      // No padding/radius specified = uses global defaults
    }
  },
  {
    element: '#medium-element',
    popover: {
      title: 'Custom Padding',
      description: 'Custom padding with global radius',
      padding: 20,        // Override global padding
      // radius not specified = uses global radius
    }
  },
  {
    element: '#custom-element',
    popover: {
      title: 'Full Custom',
      description: 'Both padding and radius customized',
      padding: 30,        // Custom padding
      radius: 15          // Custom radius
    }
  }
]</code></pre>
        </div>

        <div v-if="activeCodeTab === 'string'" class="code-example">
          <h3>String Values Support</h3>
          <pre><code>// Supports various CSS units
const steps: CoachMarkStep[] = [
  {
    element: '#element1',
    popover: {
      padding: '1rem',      // Converted to pixels (16px)
      radius: '50%'         // Percentage values supported
    }
  },
  {
    element: '#element2',
    popover: {
      padding: '10px 20px', // CSS-style padding (uses first value)
      radius: '0.5em'       // Em units supported
    }
  }
]</code></pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, type Ref, type ComputedRef } from 'vue'
import { MintCoachMark } from 'mint-coach-mark'
import type { CoachMarkStep, CoachMarkConfig } from 'mint-coach-mark'

// Reactive state
const showTour: Ref<boolean> = ref(false)
const activeCodeTab: Ref<string> = ref('global')
const currentStep: Ref<number> = ref(0)
const globalPadding: Ref<number> = ref(10)
const globalRadius: Ref<number> = ref(5)

// Code tabs configuration
const codeTabs = [
  { id: 'global', label: 'Global Config' },
  { id: 'step', label: 'Step Overrides' },
  { id: 'string', label: 'String Values' }
]

// Tour configuration (reactive)
const tourConfig: CoachMarkConfig = reactive({
  padding: globalPadding.value,
  radius: globalRadius.value,
  animate: true,
  overlayColor: '#000',
  overlayOpacity: 0.7
})

// Tour steps demonstrating different padding and radius configurations
const tourSteps: CoachMarkStep[] = [
  {
    element: '#small-element',
    popover: {
      title: '🎯 Default Styling',
      description: `
        <p>This element uses the <strong>global defaults</strong>:</p>
        <ul>
          <li>Padding: ${globalPadding.value}px (global)</li>
          <li>Radius: ${globalRadius.value}px (global)</li>
        </ul>
        <p>Try adjusting the global controls to see the effect!</p>
      `,
      side: 'bottom',
      showProgress: true
      // No padding/radius specified = uses global defaults
    }
  },
  {
    element: '#medium-element',
    popover: {
      title: '📏 Custom Padding',
      description: `
        <p>This element demonstrates <strong>step-level padding override</strong>:</p>
        <ul>
          <li>Padding: 20px (custom override)</li>
          <li>Radius: ${globalRadius.value}px (global default)</li>
        </ul>
        <p>Notice the larger padding around this element!</p>
      `,
      side: 'top',
      showProgress: true,
      padding: 20  // Custom padding override
      // radius not specified = uses global radius
    }
  },
  {
    element: '#large-element',
    popover: {
      title: '🔄 Custom Radius',
      description: `
        <p>This element shows <strong>step-level radius override</strong>:</p>
        <ul>
          <li>Padding: ${globalPadding.value}px (global default)</li>
          <li>Radius: 25px (custom override)</li>
        </ul>
        <p>See the more rounded corners on the highlight!</p>
      `,
      side: 'left',
      showProgress: true,
      radius: 25  // Custom radius override
      // padding not specified = uses global padding
    }
  },
  {
    element: '#custom-element',
    popover: {
      title: '🎨 Full Customization',
      description: `
        <p>This element has <strong>both padding and radius customized</strong>:</p>
        <ul>
          <li>Padding: 30px (custom override)</li>
          <li>Radius: 15px (custom override)</li>
        </ul>
        <p>Complete control over highlight appearance!</p>
      `,
      side: 'right',
      showProgress: true,
      padding: 30,  // Custom padding
      radius: 15    // Custom radius
    }
  }
]

// Computed properties
const currentStepInfo: ComputedRef<string> = computed(() => {
  if (!showTour.value) return 'None'
  return `${currentStep.value + 1} of ${tourSteps.length}`
})

const currentStepPadding: ComputedRef<string> = computed(() => {
  if (!showTour.value || currentStep.value >= tourSteps.length) return 'N/A'
  const step = tourSteps[currentStep.value]
  const stepPadding = step.popover?.padding
  return stepPadding !== undefined ? `${stepPadding}px (custom)` : `${globalPadding.value}px (global)`
})

const currentStepRadius: ComputedRef<string> = computed(() => {
  if (!showTour.value || currentStep.value >= tourSteps.length) return 'N/A'
  const step = tourSteps[currentStep.value]
  const stepRadius = step.popover?.radius
  return stepRadius !== undefined ? `${stepRadius}px (custom)` : `${globalRadius.value}px (global)`
})

// Tour control functions
function startTour(): void {
  showTour.value = true
}

function stopTour(): void {
  showTour.value = false
  currentStep.value = 0
}

function updateGlobalConfig(): void {
  tourConfig.padding = globalPadding.value
  tourConfig.radius = globalRadius.value

  // Update step descriptions to reflect current global values
  tourSteps[0].popover!.description = `
    <p>This element uses the <strong>global defaults</strong>:</p>
    <ul>
      <li>Padding: ${globalPadding.value}px (global)</li>
      <li>Radius: ${globalRadius.value}px (global)</li>
    </ul>
    <p>Try adjusting the global controls to see the effect!</p>
  `

  tourSteps[1].popover!.description = `
    <p>This element demonstrates <strong>step-level padding override</strong>:</p>
    <ul>
      <li>Padding: 20px (custom override)</li>
      <li>Radius: ${globalRadius.value}px (global default)</li>
    </ul>
    <p>Notice the larger padding around this element!</p>
  `

  tourSteps[2].popover!.description = `
    <p>This element shows <strong>step-level radius override</strong>:</p>
    <ul>
      <li>Padding: ${globalPadding.value}px (global default)</li>
      <li>Radius: 25px (custom override)</li>
    </ul>
    <p>See the more rounded corners on the highlight!</p>
  `
}

// Event handlers
function handleTourStart(): void {
  currentStep.value = 0
  console.log('Padding & Radius demo tour started')
}

function handleTourComplete(): void {
  currentStep.value = 0
  console.log('Padding & Radius demo tour completed')
}

function handleStepChange(step: CoachMarkStep, index: number): void {
  currentStep.value = index
  console.log(`Step changed to ${index + 1}:`, step.popover?.title)
}
</script>

<style scoped>
.padding-radius-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.demo-header {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.demo-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Controls Section */
.controls-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.controls-section h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.control-panel,
.info-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.control-panel h3,
.info-panel h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.control-group label {
  min-width: 120px;
  font-weight: 500;
  color: #555;
}

.control-group input[type="range"] {
  flex: 1;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  outline: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.value-display {
  min-width: 60px;
  font-weight: 600;
  color: #667eea;
  text-align: right;
}

.control-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.info-label {
  font-weight: 500;
  color: #495057;
}

.info-value {
  font-weight: 600;
  color: #6c757d;
}

.info-value.active {
  color: #28a745;
}

/* Demo Elements */
.demo-elements {
  margin-bottom: 3rem;
  background-color: #55efc4;
}

.demo-elements h2 {
  margin: 0 0 2rem 0;
  color: #333;
  font-size: 1.5rem;
}

.elements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.demo-element-container {
  text-align: center;
}

.demo-element-container h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
}

.demo-element {
  margin: 0 auto 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid #dee2e6;
  background: white;
}

.demo-element:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.demo-element.small {
  width: 120px;
  height: 40px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.demo-element.medium {
  width: 160px;
  height: 80px;
  border-radius: 8px;
  font-size: 1rem;
}

.demo-element.large {
  width: 200px;
  height: 120px;
  border-radius: 12px;
  font-size: 1.1rem;
}

.demo-element.custom {
  width: 180px;
  height: 100px;
  border-radius: 16px;
  font-size: 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
}

.element-description {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

/* Code Examples */
.code-examples {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
}

.code-examples h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.code-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #dee2e6;
}

.code-tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.2s;
}

.code-tab:hover {
  color: #495057;
  background: rgba(0, 0, 0, 0.05);
}

.code-tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: white;
}

.code-content {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.code-example {
  padding: 1.5rem;
}

.code-example h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #333;
}

.code-example pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

.code-example code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* Responsive Design */
@media (max-width: 768px) {
  .padding-radius-demo {
    padding: 1rem;
  }

  .controls-grid {
    grid-template-columns: 1fr;
  }

  .elements-grid {
    grid-template-columns: 1fr;
  }

  .code-tabs {
    flex-wrap: wrap;
  }

  .code-tab {
    flex: 1;
    min-width: 120px;
  }

  .control-group {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .control-group label {
    min-width: auto;
  }

  .value-display {
    text-align: left;
  }
}
</style>
