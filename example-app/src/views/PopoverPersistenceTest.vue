<template>
  <div class="popover-persistence-test">
    <!-- Header -->
    <div class="page-header">
      <h1>🔧 Multi-Implementation Coach Mark Demo</h1>
      <p>
        This demo showcases three different approaches to implementing coach marks:
        Default MintPopover, QuasarCoachMark (built-in QTooltip), and custom slot-based QTooltip implementations.
      </p>
    </div>

    <!-- Demo Controls -->
    <div class="demo-controls">
      <h3>Demo Controls</h3>
      <div class="control-buttons">
        <button @click="startQuickTour" :disabled="showTour" class="demo-btn primary">
          🚀 Start Demo Tour (2 steps)
        </button>
        <button @click="stopTour" :disabled="!showTour" class="demo-btn">
          ⏹️ Stop Tour
        </button>
        <button @click="toggleImplementation" class="demo-btn secondary">
          🔄 Switch Implementation
        </button>

        <button @click="startAsyncTour" :disabled="showTour" class="demo-btn async">
          ⚡ Start Async Tour
        </button>
      </div>

      <div class="demo-status">
        <p><strong>Tour Active:</strong> {{ showTour ? '✅ Yes' : '❌ No' }}</p>
        <p><strong>Implementation:</strong> {{ getImplementationName() }}</p>
        <p><strong>Global Popover State:</strong> {{ globalPopoverState.visible ? '👁️ Visible' : '🙈 Hidden' }}</p>
      </div>
    </div>

    <!-- Test Elements -->
    <div class="test-elements">
      <div id="test-element-1" class="test-element">
        <h3>🎯 Test Element 1</h3>
        <p>This is the first element in the tour. The popover should appear here.</p>
      </div>

      <div id="test-element-2" class="test-element">
        <h3>🎪 Test Element 2</h3>
        <p>This is the second element. After this step, the tour should end and popover should disappear.</p>
      </div>

      <div id="test-element-3" class="test-element">
        <h3>🎭 Test Element 3</h3>
        <p>This element is not part of the tour. No popover should appear here.</p>
      </div>

      <div v-if="dynamicElementVisible" id="dynamic-element" class="test-element dynamic">
        <h3>🚀 Dynamic Element</h3>
        <p>This element was loaded asynchronously! It appears after clicking "Load Dynamic Content" in the async tour.</p>
      </div>
    </div>

    <!-- Demo Instructions -->
    <div class="demo-instructions">
      <h3>📋 Demo Instructions</h3>
      <ol>
        <li><strong>Start the tour</strong> by clicking "Start Demo Tour"</li>
        <li><strong>Navigate through</strong> the 2 steps using Next/Previous buttons</li>
        <li><strong>Complete the tour</strong> by clicking "Next" on the final step</li>
        <li><strong>Switch implementations</strong> to see the difference between all three approaches</li>
        <li><strong>Notice</strong> how all implementations provide identical functionality with different internal architectures</li>
        <li><strong>Verify</strong> that the popover disappears completely after tour completion</li>
      </ol>

      <div class="slot-benefits">
        <h4>✅ Implementation Approaches:</h4>
        <ul>
          <li><strong>Default MintPopover:</strong> Custom-built popover with full control and styling</li>
          <li><strong>QuasarCoachMark:</strong> Built-in QTooltip integration with simplified architecture</li>
          <li><strong>Custom Slot:</strong> Slot-based approach for maximum flexibility with any library</li>
          <li>All approaches maintain identical tour functionality and API</li>
          <li>Choose based on your project's needs and existing dependencies</li>
        </ul>
      </div>

      <div class="implementation-notes">
        <h4>🔧 Custom Popover Implementation Notes:</h4>
        <ul>
          <li><strong>Z-Index:</strong> Add <code>mint-coach-mark-custom-popover</code> class for proper layering</li>
          <li><strong>Pointer Events:</strong> Custom popovers automatically receive pointer events</li>
          <li><strong>Event Handling:</strong> Use slot props (<code>onNext</code>, <code>onPrevious</code>, <code>onClose</code>) for tour navigation</li>
          <li><strong>Positioning:</strong> Map MintCoachMark sides to your library's positioning system</li>
          <li><strong>Smooth Rendering:</strong> Use <code>v-if="visible && targetElement && !isPositioning"</code> for flash-free positioning</li>
          <li><strong>Repositioning:</strong> Use <code>positioningKey</code> as Vue key for automatic repositioning</li>
          <li><strong>Hidden During Positioning:</strong> Popover remains hidden until positioning calculations complete</li>
          <li><strong>Universal Pattern:</strong> Works with any custom popover library (QTooltip, Tippy.js, Floating UI, etc.)</li>
        </ul>
      </div>

      <div class="universal-examples">
        <h4>📚 Universal Implementation Examples:</h4>
        <div class="code-examples">
          <div class="code-example">
            <h5>Quasar QTooltip:</h5>
            <code>&lt;QTooltip v-if="visible && targetElement && !isPositioning" :key="positioningKey" /&gt;</code>
          </div>
          <div class="code-example">
            <h5>Tippy.js:</h5>
            <code>&lt;Tippy v-if="visible && targetElement && !isPositioning" :key="positioningKey" /&gt;</code>
          </div>
          <div class="code-example">
            <h5>Floating UI:</h5>
            <code>&lt;FloatingTooltip v-if="visible && targetElement && !isPositioning" :key="positioningKey" /&gt;</code>
          </div>
          <div class="code-example">
            <h5>Any Custom Library:</h5>
            <code>&lt;YourTooltip v-if="visible && targetElement && !isPositioning" :key="positioningKey" /&gt;</code>
          </div>
        </div>
      </div>
    </div>

    <!-- Default MintCoachMark Implementation -->
    <MintCoachMark
      v-if="implementationType === 'default'"
      ref="coachMarkRef"
      v-model="showTour"
      :steps="currentSteps"
      :config="testConfig"
      @tour-start="onTourStart"
      @tour-complete="onTourComplete"
      @step-change="onStepChange"
    />

    <!-- QuasarCoachMark Implementation -->
    <QuasarCoachMark
      v-else-if="implementationType === 'quasar'"
      ref="coachMarkRef"
      v-model="showTour"
      :steps="currentSteps"
      :config="testConfig"
      @tour-start="onTourStart"
      @tour-complete="onTourComplete"
      @step-change="onStepChange"
    />

    <!-- MintCoachMark with Custom QTooltip Slot Implementation -->
    <MintCoachMark
      v-else-if="implementationType === 'custom'"
      ref="coachMarkRef"
      v-model="showTour"
      :steps="currentSteps"
      :config="testConfig"
      @tour-start="onTourStart"
      @tour-complete="onTourComplete"
      @step-change="onStepChange"
    >
      <template #default="{ visible, targetElement, currentStep, currentStepIndex, totalSteps, onNext, onPrevious, onClose, positioningKey, isPositioning }">
        <!--
          Universal Pattern for Smooth Custom Popovers:
          v-if="visible && targetElement && !isPositioning"

          This pattern works with any popover library:
          - QTooltip (Quasar)
          - Tippy.js
          - Floating UI
          - Ant Design Tooltip
          - Element Plus Tooltip
          - Custom implementations
        -->
        <QTooltip
          v-if="visible && targetElement && !isPositioning"
          :key="positioningKey || `tooltip-${currentStepIndex}-${targetElement?.tagName}-${targetElement?.id || targetElement?.className}`"
          v-model="tooltipVisible"
          :target="targetElement"
          :anchor="getQuasarAnchor(currentStep?.popover?.side || 'bottom')"
          :self="getQuasarSelf(currentStep?.popover?.side || 'bottom')"
          class="mint-coach-mark-custom-popover mint-coach-mark-custom-tooltip"
          @show="tooltipVisible = true"
          @hide="tooltipVisible = false"
        >
          <div class="custom-popover-content">
            <!-- Title -->
            <div v-if="currentStep?.popover?.title" class="custom-popover-title">
              {{ currentStep.popover.title }}
            </div>

            <!-- Description -->
            <div v-if="currentStep?.popover?.description" class="custom-popover-description">
              {{ currentStep.popover.description }}
            </div>

            <!-- Progress -->
            <div v-if="currentStep?.popover?.showProgress" class="custom-popover-progress">
              <div class="progress-text">Step {{ (currentStepIndex || 0) + 1 }} of {{ totalSteps }}</div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${(((currentStepIndex || 0) + 1) / totalSteps) * 100}%` }"
                ></div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="custom-popover-buttons">
              <button
                v-if="(currentStep?.popover?.showButtons || ['previous']).includes('previous')"
                @click="onPrevious"
                class="custom-btn custom-btn--secondary"
                :disabled="currentStepIndex === 0"
              >
                {{ currentStep?.popover?.prevBtnText || 'Previous' }}
              </button>

              <button
                v-if="(currentStep?.popover?.showButtons || ['next']).includes('next')"
                @click="onNext"
                class="custom-btn custom-btn--primary"
              >
                {{ currentStep?.popover?.nextBtnText || 'Next' }}
              </button>

              <button
                v-if="(currentStep?.popover?.showButtons || ['close']).includes('close')"
                @click="onClose"
                class="custom-btn custom-btn--close"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        </QTooltip>
      </template>
    </MintCoachMark>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, type Ref, type ComputedRef } from 'vue'
import { MintCoachMark, QuasarCoachMark, getGlobalPopoverState, type CoachMarkStep, type CoachMarkConfig, type Side } from 'mint-coach-mark'
import { QTooltip } from 'quasar'
import 'mint-coach-mark/dist/style.css'

// Reactive state
const showTour: Ref<boolean> = ref(false)
const implementationType: Ref<'default' | 'custom' | 'quasar'> = ref('default')
const tooltipVisible: Ref<boolean> = ref(false)
const coachMarkRef: Ref<InstanceType<typeof MintCoachMark> | InstanceType<typeof QuasarCoachMark> | undefined> = ref()
const dynamicElementVisible: Ref<boolean> = ref(false)
const isAsyncTour: Ref<boolean> = ref(false)

// Global popover state for testing
const globalPopoverState: ComputedRef<any> = getGlobalPopoverState()

// Quasar positioning helpers
const getQuasarAnchor = (side: Side): string => {
  const map = {
    top: 'bottom middle',
    bottom: 'top middle',
    left: 'center right',
    right: 'center left',
    over: 'center middle'
  }
  return map[side] || map.bottom
}

const getQuasarSelf = (side: Side): string => {
  const map = {
    top: 'top middle',
    bottom: 'bottom middle',
    left: 'center left',
    right: 'center right',
    over: 'center middle'
  }
  return map[side] || map.bottom
}

// Demo steps
const testSteps: CoachMarkStep[] = [
  {
    element: '#test-element-1',
    popover: {
      title: '🎯 First Demo Step',
      description: 'This is the first step of our slot-based demo. Notice how the popover implementation can be completely customized.',
      side: 'bottom',
      showButtons: ['next', 'close'],
      showProgress: true
    }
  },
  {
    element: '#test-element-2',
    popover: {
      title: '🎪 Final Demo Step',
      description: 'This is the final step. Both default and custom implementations provide identical functionality with different styling.',
      side: 'top',
      nextBtnText: 'Complete Demo',
      showProgress: true
    }
  }
]

// Async tour steps with dynamic content loading
const asyncTourSteps: CoachMarkStep[] = [
  {
    element: '#test-element-1',
    popover: {
      title: '⚡ Async Tour - Step 1',
      description: 'This is an async tour demo. Click "Load Dynamic Content" to load the next element asynchronously.',
      side: 'bottom',
      showButtons: ['next', 'close'],
      showProgress: true,
      nextBtnText: 'Load Dynamic Content',
      // Async callback that loads dynamic content
      onAsyncNextClick: async (element, step, driver) => {
        console.log('🔄 Loading dynamic content...')

        // Simulate async operation (e.g., API call)
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Show the dynamic element
        dynamicElementVisible.value = true

        // Wait for DOM update
        await nextTick()

        console.log('✅ Dynamic content loaded, proceeding to next step')

        // Manually proceed to next step
        driver.moveNext()
      },
      // Async close callback for testing
      onAsyncCloseClick: async (element, step, driver) => {
        console.log('🔄 Async close operation...')

        // Simulate cleanup before closing
        await new Promise(resolve => setTimeout(resolve, 800))

        console.log('✅ Async close complete, destroying tour')

        // Manually close the tour
        driver.destroy()
      }
    }
  },
  {
    element: '#dynamic-element',
    popover: {
      title: '🚀 Dynamic Content Loaded!',
      description: 'This element was loaded asynchronously! Test the async previous button to go back with custom logic.',
      side: 'top',
      showButtons: ['previous', 'next', 'close'],
      showProgress: true,
      prevBtnText: 'Async Previous',
      // Async previous callback for testing
      onAsyncPreviousClick: async (element, step, driver) => {
        console.log('🔄 Async previous operation...')

        // Simulate some async operation before going back
        await new Promise(resolve => setTimeout(resolve, 1000))

        console.log('✅ Async previous complete, going to previous step')

        // Manually go to previous step
        driver.movePrevious()
      }
    },
    // Cleanup when leaving this step
    onAsyncDeselected: async (element, step, driver) => {
      console.log('🧹 Cleaning up dynamic element...')

      // Simulate cleanup operation
      await new Promise(resolve => setTimeout(resolve, 500))

      // Hide the dynamic element
      dynamicElementVisible.value = false

      console.log('✅ Cleanup complete')
    },
    onNextClick: (element, step, driver) => {
      console.log('❌ Blocking default next behavior for testing purposes')

      dynamicElementVisible.value = false;

      console.log('✅ Next step triggered manually')

      // Manually proceed to next step
      driver.moveNext()
    }
  },
  {
    element: '#test-element-3',
    popover: {
      title: '🎭 Async Tour Complete',
      description: 'The async tour is complete! Notice how the dynamic element was cleaned up when leaving the previous step.',
      side: 'bottom',
      nextBtnText: 'Finish Async Tour',
      showProgress: true
    }
  },
]

// Demo configuration
const testConfig: CoachMarkConfig = {
  animate: true,
  allowClose: true,
  showProgress: true,
  stagePadding: 10,
  stageRadius: 8,
  overlayOpacity: 0.7,
  smoothScroll: true
}

// Computed property for current steps
const currentSteps: ComputedRef<CoachMarkStep[]> = computed(() => {
  return isAsyncTour.value ? asyncTourSteps : testSteps
})

// Event handlers
const startQuickTour = (): void => {
  console.log('🚀 Starting slot-based demo tour')

  // First stop any existing tour
  showTour.value = false

  // Wait for the tour to stop, then start regular tour
  nextTick(() => {
    isAsyncTour.value = false
    dynamicElementVisible.value = false

    // Start the tour with regular steps
    nextTick(() => {
      showTour.value = true
    })
  })
}

const startAsyncTour = (): void => {
  console.log('⚡ Starting async tour demo')

  // First stop any existing tour
  showTour.value = false

  // Wait for the tour to stop, then start async tour
  nextTick(() => {
    isAsyncTour.value = true
    dynamicElementVisible.value = false

    // Start the tour with async steps
    nextTick(() => {
      showTour.value = true
    })
  })
}

const stopTour = (): void => {
  console.log('⏹️ Stopping tour')
  showTour.value = false
  tooltipVisible.value = false
  dynamicElementVisible.value = false
  isAsyncTour.value = false
}

const toggleImplementation = (): void => {
  const implementations: Array<'default' | 'custom' | 'quasar'> = ['default', 'quasar', 'custom']
  const currentIndex = implementations.indexOf(implementationType.value)
  const nextIndex = (currentIndex + 1) % implementations.length
  implementationType.value = implementations[nextIndex]
  console.log(`🔄 Switched to ${getImplementationName()} implementation`)
}

const getImplementationName = (): string => {
  switch (implementationType.value) {
    case 'default': return 'Default MintPopover'
    case 'quasar': return 'QuasarCoachMark (Built-in QTooltip)'
    case 'custom': return 'Custom QTooltip Slot'
    default: return 'Unknown'
  }
}

const onTourStart = (): void => {
  console.log(`✅ Tour started with ${getImplementationName()}`)
}

const onTourComplete = (): void => {
  console.log('🎉 Tour completed - popover should be hidden')
  tooltipVisible.value = false

  // Verify popover is hidden after a short delay
  setTimeout(() => {
    const isHidden = !globalPopoverState.value.visible
    console.log(`🔍 Popover hidden after completion: ${isHidden ? '✅ PASS' : '❌ FAIL'}`)

    if (!isHidden) {
      console.error('❌ BUG: Popover is still visible after tour completion!')
    }
  }, 100)
}

const onStepChange = (step: CoachMarkStep, index: number): void => {
  console.log(`📍 Step ${index + 1}: ${step.popover?.title}`)
}

// Watch for tour visibility changes to sync tooltip
watch(showTour, (visible: boolean) => {
  if (!visible) {
    tooltipVisible.value = false
  }
})

// Watch for global popover state changes to sync tooltip
watch(() => globalPopoverState.value.visible, (visible: boolean) => {
  if (implementationType.value === 'custom' && !globalPopoverState.value.isPositioning) {
    tooltipVisible.value = visible
  }
})

// Watch for positioning completion to show tooltip
watch(() => globalPopoverState.value.isPositioning, (isPositioning: boolean) => {
  if (implementationType.value === 'custom' && !isPositioning && globalPopoverState.value.visible) {
    // Show tooltip after positioning is complete
    nextTick(() => {
      tooltipVisible.value = true
    })
  }
})

// Watch for target element changes to force QTooltip repositioning
watch(() => globalPopoverState.value.targetElement, (newTarget: Element | null, oldTarget: Element | null) => {
  if (implementationType.value === 'custom' && newTarget && newTarget !== oldTarget) {
    // Force QTooltip to reposition by toggling visibility
    tooltipVisible.value = false
    nextTick(() => {
      tooltipVisible.value = true
    })
  }
})

// Watch for step changes to ensure QTooltip repositions correctly
watch(() => globalPopoverState.value.step, (newStep, oldStep) => {
  if (implementationType.value === 'custom' && newStep && newStep !== oldStep && tooltipVisible.value) {
    // Force QTooltip repositioning on step change
    nextTick(() => {
      // Trigger a small delay to ensure DOM updates are complete
      setTimeout(() => {
        tooltipVisible.value = false
        nextTick(() => {
          tooltipVisible.value = true
        })
      }, 50)
    })
  }
})

// Listen for custom repositioning events
const handleRepositioning = (event: CustomEvent) => {
  if (implementationType.value === 'custom') {
    console.log('🎯 Repositioning QTooltip for new target:', event.detail.targetElement)
    // The positioning state management will handle the smooth transition
    // No need for manual visibility toggling here
  }
}

onMounted(() => {
  window.addEventListener('mint-coach-mark-reposition', handleRepositioning as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('mint-coach-mark-reposition', handleRepositioning as EventListener)
})
</script>

<style scoped>
.popover-persistence-test {
  max-width: 100%;
  padding: 2rem;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #333;
}

.page-header p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Demo Controls */
.demo-controls {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.demo-controls h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #333;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.demo-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.demo-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #ccc;
}

.demo-btn.primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.demo-btn.primary:hover:not(:disabled) {
  background: #5a67d8;
  border-color: #5a67d8;
}

.demo-btn.secondary {
  background: #38d9a9;
  color: white;
  border-color: #38d9a9;
}

.demo-btn.secondary:hover:not(:disabled) {
  background: #20c997;
  border-color: #20c997;
}

.demo-btn.async {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

.demo-btn.async:hover:not(:disabled) {
  background: #ff5252;
  border-color: #ff5252;
}

.demo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.demo-status {
  background: #34495e;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.demo-status p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #fff;
}

/* Test Elements */
.test-elements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.test-element {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  transition: all 0.2s;
}

.test-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.test-element.dynamic {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid #667eea;
  animation: slideInUp 0.5s ease-out;
}

.test-element.dynamic p,
.test-element.dynamic h3 {
  color: #fff;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.test-element h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #333;
}

.test-element p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

/* Demo Instructions */
.demo-instructions {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.demo-instructions h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #333;
}

.demo-instructions ol {
  margin: 0 0 1.5rem 0;
  padding-left: 1.5rem;
  color: #666;
}

.demo-instructions li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.slot-benefits {
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.slot-benefits h4 {
  margin: 0 0 0.5rem 0;
  color: #1565c0;
}

.slot-benefits ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #1976d2;
}

.slot-benefits li {
  margin-bottom: 0.25rem;
}

.implementation-notes {
  background: #fff3cd;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
  margin-top: 1rem;
}

.implementation-notes h4 {
  margin: 0 0 0.5rem 0;
  color: #856404;
}

.implementation-notes ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #856404;
}

.implementation-notes li {
  margin-bottom: 0.25rem;
}

.implementation-notes code {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.universal-examples {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #6c757d;
  margin-top: 1rem;
}

.universal-examples h4 {
  margin: 0 0 0.75rem 0;
  color: #495057;
}

.code-examples {
  display: grid;
  gap: 0.75rem;
}

.code-example {
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.code-example h5 {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 0.875rem;
  font-weight: 600;
}

.code-example code {
  display: block;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #495057;
  word-break: break-all;
  white-space: pre-wrap;
}

/* Custom Popover Styling */
.mint-coach-mark-custom-tooltip {
  background: #1976d2;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
  max-width: 400px;
  min-width: 250px;
  z-index: var(--mint-coach-mark-custom-popover-z-index, 10002) !important;
}

.custom-popover-content {
  padding: 1rem;
}

.custom-popover-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: white;
}

.custom-popover-description {
  margin: 0 0 1rem 0;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
}

.custom-popover-progress {
  margin: 0 0 1rem 0;
  padding: 0 0 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-text {
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.8);
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4fc3f7;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.custom-popover-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.custom-btn {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.custom-btn--primary {
  background: #4fc3f7;
  color: #1976d2;
}

.custom-btn--primary:hover {
  background: #29b6f6;
}

.custom-btn--secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.custom-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.custom-btn--secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-btn--close {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 32px;
  padding: 0.5rem;
  font-size: 1rem;
  line-height: 1;
}

.custom-btn--close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .popover-persistence-test {
    padding: 1rem;
  }

  .control-buttons {
    flex-direction: column;
  }

  .test-elements {
    grid-template-columns: 1fr;
  }
}
</style>
