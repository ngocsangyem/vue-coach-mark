<template>
  <div class="home">
    <!-- Skip Tour Feature Demo -->
    <MintCoachMark
      v-model="showTour"
      :steps="tourSteps"
      :config="tourConfig"
      @tour-start="handleTourStart"
      @tour-complete="handleTourComplete"
      @tour-skipped="handleTourSkipped"
      @step-change="handleStepChange"
    />

    <!-- Hero Section -->
    <section id="hero-section" class="hero">
      <div class="hero-content">
        <h1 class="hero-title">🌿 MintCoachMark</h1>
        <p class="hero-subtitle">
          Skip Tour Feature Demo
        </p>
        <p class="hero-description">
          Experience the new Skip Tour functionality! The skip button appears only on the first step,
          allowing users to quickly exit the tour if they prefer to explore on their own.
        </p>

        <div class="hero-actions">
          <button
            id="start-tour-btn"
            @click="startTourWithSkip"
            class="btn btn-primary"
            :disabled="showTour"
          >
            🎯 Start Tour (With Skip)
          </button>
          <button
            @click="startTourWithoutSkip"
            class="btn btn-secondary"
            :disabled="showTour"
          >
            🚫 Start Tour (No Skip)
          </button>
        </div>
      </div>
    </section>

    <!-- Tour Controls & Event Log -->
    <section id="controls-section" class="controls-section">
      <h2 class="section-title">🎮 Tour Controls & Event Log</h2>

      <div class="controls-grid">
        <div class="control-panel">
          <h3>Tour Controls</h3>
          <div class="control-buttons">
            <button
              @click="startTourWithSkip"
              class="control-btn primary"
              :disabled="showTour"
            >
              ▶️ Start Tour (Skip Enabled)
            </button>
            <button
              @click="startTourWithoutSkip"
              class="control-btn secondary"
              :disabled="showTour"
            >
              ▶️ Start Tour (Skip Disabled)
            </button>
            <button
              @click="stopTour"
              class="control-btn danger"
              :disabled="!showTour"
            >
              ⏹️ Stop Tour
            </button>
            <button
              @click="clearEventLog"
              class="control-btn neutral"
            >
              🗑️ Clear Log
            </button>
          </div>

          <div class="tour-status">
            <div class="status-item">
              <span class="status-label">Tour Active:</span>
              <span class="status-value" :class="{ active: showTour }">
                {{ showTour ? 'Yes' : 'No' }}
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">Current Step:</span>
              <span class="status-value">{{ currentStepInfo }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">Skip Enabled:</span>
              <span class="status-value" :class="{ active: tourConfig.allowSkip }">
                {{ tourConfig.allowSkip ? 'Yes' : 'No' }}
              </span>
            </div>
          </div>
        </div>

        <div class="event-log-panel">
          <h3>Event Log</h3>
          <div class="event-log" ref="eventLogRef">
            <div
              v-for="(event, index) in eventLog"
              :key="index"
              class="event-item"
              :class="event.type"
            >
              <span class="event-time">{{ event.timestamp }}</span>
              <span class="event-type">{{ event.type }}</span>
              <span class="event-message">{{ event.message }}</span>
            </div>
            <div v-if="eventLog.length === 0" class="no-events">
              No events yet. Start a tour to see events here.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Content Areas -->
    <section id="features-section" class="features">
      <h2 class="section-title">✨ Skip Tour Feature Highlights</h2>

      <div class="features-grid">
        <div id="feature-1" class="feature-card">
          <div class="feature-icon">🚪</div>
          <h3>Smart Skip Button</h3>
          <p>The skip button only appears on the first step, giving users an immediate exit option without cluttering subsequent steps.</p>
        </div>

        <div id="feature-2" class="feature-card">
          <div class="feature-icon">⚙️</div>
          <h3>Configurable</h3>
          <p>Enable/disable skip functionality globally or customize the skip button text to match your application's tone.</p>
        </div>

        <div id="feature-3" class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Event Tracking</h3>
          <p>Track when users skip tours with the tour-skipped event for analytics and user experience insights.</p>
        </div>

        <div id="feature-4" class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Customizable Styling</h3>
          <p>Style the skip button to match your design system using CSS classes and custom slots.</p>
        </div>
      </div>
    </section>

    <!-- Code Examples -->
    <section id="code-section" class="code-examples">
      <h2 class="section-title">💻 Skip Tour Implementation</h2>

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
        <div v-if="activeCodeTab === 'basic'" class="code-example">
          <h3>Basic Skip Tour Configuration</h3>
          <pre><code>&lt;template&gt;
  &lt;MintCoachMark
    v-model="showTour"
    :steps="steps"
    :config="config"
    @tour-skipped="handleTourSkipped"
    @tour-complete="handleTourComplete"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { MintCoachMark, type CoachMarkStep, type CoachMarkConfig } from 'mint-coach-mark'

const showTour = ref(false)

const config: CoachMarkConfig = {
  allowSkip: true,                    // Enable skip functionality
  skipBtnText: 'Skip Tour',          // Customize skip button text
  animate: true,
  onSkipClick: (element, step, context) => {
    console.log('Tour skipped from:', step.popover?.title)
  }
}

const steps: CoachMarkStep[] = [
  {
    element: '#welcome-section',
    popover: {
      title: 'Welcome!',
      description: 'Notice the Skip Tour button - it only appears on this first step.',
      showButtons: ['skip', 'next', 'close'],  // Include 'skip' in buttons
      showProgress: true
    }
  },
  // ... more steps without skip button
]

function handleTourSkipped(step: CoachMarkStep, index: number) {
  console.log(`User skipped tour at step ${index}:`, step.popover?.title)
  // Track analytics, show feedback, etc.
}
&lt;/script&gt;</code></pre>
        </div>

        <div v-if="activeCodeTab === 'events'" class="code-example">
          <h3>Event Handling & Analytics</h3>
          <pre><code>// Event handlers for comprehensive tour tracking
function handleTourStart() {
  analytics.track('tour_started', {
    tour_type: 'onboarding',
    skip_enabled: config.allowSkip
  })
}

function handleTourSkipped(step: CoachMarkStep, index: number) {
  analytics.track('tour_skipped', {
    step_index: index,
    step_title: step.popover?.title,
    skip_reason: 'user_choice'
  })

  // Show optional feedback
  showNotification('Tour skipped. You can restart it anytime from the help menu.')
}

function handleTourComplete() {
  analytics.track('tour_completed', {
    completion_rate: 100,
    total_steps: steps.length
  })
}

function handleStepChange(step: CoachMarkStep, index: number) {
  analytics.track('tour_step_viewed', {
    step_index: index,
    step_title: step.popover?.title
  })
}</code></pre>
        </div>

        <div v-if="activeCodeTab === 'custom'" class="code-example">
          <h3>Custom Skip Button Styling</h3>
          <pre><code>&lt;template&gt;
  &lt;MintCoachMark
    v-model="showTour"
    :steps="steps"
    :config="config"
  &gt;
    &lt;!-- Custom skip button slot --&gt;
    &lt;template #skip-button="{ step, index }"&gt;
      &lt;button class="custom-skip-btn" @click="handleCustomSkip"&gt;
        &lt;Icon name="exit" /&gt;
        Not Now
      &lt;/button&gt;
    &lt;/template&gt;
  &lt;/MintCoachMark&gt;
&lt;/template&gt;

&lt;style&gt;
/* Custom skip button styling */
.custom-skip-btn {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.custom-skip-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

/* Default skip button styling */
.mint-coach-mark-popover__btn--skip {
  background-color: #6c757d;
  color: white;
  border: 1px solid #6c757d;
}

.mint-coach-mark-popover__btn--skip:hover {
  background-color: #5a6268;
  border-color: #545b62;
}
&lt;/style&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- Additional Demo Navigation -->
    <section class="demo-nav">
      <h2 class="section-title">🎪 Explore More Demos</h2>

      <div class="demo-grid">
        <router-link to="/basic-tour" class="demo-card">
          <div class="demo-icon">🎯</div>
          <h3>Basic Tour</h3>
          <p>Simple step-by-step tour with default styling and behavior.</p>
        </router-link>

        <router-link to="/custom-content" class="demo-card">
          <div class="demo-icon">🎨</div>
          <h3>Custom Content</h3>
          <p>Custom popover content using Vue slots and rich HTML.</p>
        </router-link>

        <router-link to="/positioning" class="demo-card">
          <div class="demo-icon">📍</div>
          <h3>Positioning</h3>
          <p>Different positioning options and automatic collision detection.</p>
        </router-link>

        <router-link to="/padding-radius" class="demo-card">
          <div class="demo-icon">🎨</div>
          <h3>Padding & Radius</h3>
          <p>Interactive demo of padding and radius options for element highlighting.</p>
        </router-link>

        <router-link to="/programmatic" class="demo-card">
          <div class="demo-icon">⚙️</div>
          <h3>Programmatic</h3>
          <p>Full programmatic control using composables and reactive state.</p>
        </router-link>

        <router-link to="/theming" class="demo-card">
          <div class="demo-icon">🎭</div>
          <h3>Theming</h3>
          <p>Custom themes, CSS variables, and brand integration examples.</p>
        </router-link>

        <router-link to="/scenarios" class="demo-card">
          <div class="demo-icon">🌟</div>
          <h3>Real Scenarios</h3>
          <p>Onboarding flows, feature highlights, and help system examples.</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, type Ref } from 'vue'
import { MintCoachMark } from 'mint-coach-mark'
import type { CoachMarkStep, CoachMarkConfig } from 'mint-coach-mark'

// Reactive state
const showTour: Ref<boolean> = ref(false)
const activeCodeTab: Ref<string> = ref('basic')
const eventLog: Ref<EventLogEntry[]> = ref([])
const eventLogRef: Ref<HTMLElement | undefined> = ref()
const currentStep: Ref<number> = ref(0)

// Types
interface EventLogEntry {
  timestamp: string
  type: 'tour-start' | 'tour-complete' | 'tour-skipped' | 'step-change' | 'info' | 'error'
  message: string
}

// Code tabs configuration
const codeTabs = [
  { id: 'basic', label: 'Basic Setup' },
  { id: 'events', label: 'Event Handling' },
  { id: 'custom', label: 'Custom Styling' }
]

// Tour configuration with skip enabled
const tourConfig: CoachMarkConfig = {
  allowSkip: true,
  skipBtnText: 'Skip Tour',
  animate: true,
  overlayColor: '#000',
  overlayOpacity: 0.7,
  progressText: '{{current}} of {{total}}',
  onSkipClick: (element, step, context) => {
    logEvent('info', `Skip hook called for step: ${step.popover?.title}`)
  }
}

// Tour steps demonstrating skip functionality
const tourSteps: CoachMarkStep[] = [
  {
    element: '#hero-section',
    popover: {
      title: '🎉 Welcome to Skip Tour Demo!',
      description: `
        <p>This is the <strong>first step</strong> of our tour. Notice the <strong>"Skip Tour"</strong> button below!</p>
        <p>The skip button only appears on this first step, giving users an immediate exit option.</p>
        <ul>
          <li>✅ Skip button is visible here</li>
          <li>🎯 Allows quick tour exit</li>
          <li>📊 Emits tracking events</li>
        </ul>
      `,
      side: 'bottom',
      showButtons: ['skip', 'next', 'close'],
      showProgress: true,
      skipBtnText: 'Skip This Tour',
      popoverClass: 'demo-popover-large'
    }
  },
  {
    element: '#controls-section',
    popover: {
      title: '🎮 Tour Controls',
      description: `
        <p>This is the <strong>second step</strong>. Notice that the skip button is no longer visible.</p>
        <p>Here you can see the tour controls and event log that track all tour interactions.</p>
        <p><em>Skip functionality is only available on the first step!</em></p>
      `,
      side: 'top',
      showButtons: ['previous', 'next', 'close'],
      showProgress: true,
      popoverClass: 'demo-popover-medium'
    }
  },
  {
    element: '#features-section',
    popover: {
      title: '✨ Skip Feature Highlights',
      description: `
        <p>The <strong>third step</strong> showcases the key benefits of the skip tour feature:</p>
        <ul>
          <li>🚪 <strong>Smart Visibility:</strong> Only shows on first step</li>
          <li>⚙️ <strong>Configurable:</strong> Customize text and behavior</li>
          <li>📊 <strong>Event Tracking:</strong> Monitor skip rates</li>
          <li>🎨 <strong>Customizable:</strong> Style to match your design</li>
        </ul>
      `,
      side: 'bottom',
      showButtons: ['previous', 'next', 'close'],
      showProgress: true
    }
  },
  {
    element: '#code-section',
    popover: {
      title: '💻 Implementation Examples',
      description: `
        <p>The <strong>final step</strong> shows code examples for implementing the skip tour feature.</p>
        <p>Click through the tabs to see different implementation approaches:</p>
        <ul>
          <li>📝 Basic configuration</li>
          <li>📊 Event handling & analytics</li>
          <li>🎨 Custom styling options</li>
        </ul>
        <p><strong>Ready to implement skip tours in your app?</strong></p>
      `,
      side: 'top',
      showButtons: ['previous', 'close'],
      showProgress: true,
      nextBtnText: 'Finish Demo'
    }
  }
]

// Computed properties
const currentStepInfo = computed(() => {
  if (!showTour.value) return 'None'
  return `${currentStep.value + 1} of ${tourSteps.length}`
})

// Event logging utility
function logEvent(type: EventLogEntry['type'], message: string): void {
  const timestamp = new Date().toLocaleTimeString()
  eventLog.value.push({ timestamp, type, message })

  // Auto-scroll to bottom
  nextTick(() => {
    if (eventLogRef.value) {
      eventLogRef.value.scrollTop = eventLogRef.value.scrollHeight
    }
  })

  // Also log to console for debugging
  console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`)
}

// Tour control functions
function startTourWithSkip(): void {
  tourConfig.allowSkip = true
  tourConfig.skipBtnText = 'Skip Tour'

  // Update first step to include skip button
  if (tourSteps[0]?.popover) {
    tourSteps[0].popover.showButtons = ['skip', 'next', 'close']
  }

  showTour.value = true
  logEvent('info', 'Started tour with skip functionality enabled')
}

function startTourWithoutSkip(): void {
  tourConfig.allowSkip = false

  // Update first step to exclude skip button
  if (tourSteps[0]?.popover) {
    tourSteps[0].popover.showButtons = ['next', 'close']
  }

  showTour.value = true
  logEvent('info', 'Started tour with skip functionality disabled')
}

function stopTour(): void {
  showTour.value = false
  currentStep.value = 0
  logEvent('info', 'Tour stopped manually')
}

function clearEventLog(): void {
  eventLog.value = []
  logEvent('info', 'Event log cleared')
}

// Event handlers for tour events
function handleTourStart(): void {
  currentStep.value = 0
  logEvent('tour-start', `Tour started with ${tourSteps.length} steps (Skip: ${tourConfig.allowSkip ? 'enabled' : 'disabled'})`)
}

function handleTourComplete(): void {
  currentStep.value = 0
  logEvent('tour-complete', `Tour completed successfully! User went through all ${tourSteps.length} steps.`)

  // Show completion feedback
  setTimeout(() => {
    logEvent('info', '🎉 Great job completing the tour! You can restart it anytime.')
  }, 500)
}

function handleTourSkipped(step: CoachMarkStep, index: number): void {
  currentStep.value = 0
  const stepTitle = step.popover?.title || 'Unknown Step'
  logEvent('tour-skipped', `Tour skipped from step ${index + 1}: "${stepTitle}"`)

  // Simulate analytics tracking
  setTimeout(() => {
    logEvent('info', '📊 Analytics: tour_skipped event sent to tracking service')
  }, 200)

  // Show skip feedback
  setTimeout(() => {
    logEvent('info', '💡 Tour skipped! You can restart it anytime from the controls above.')
  }, 500)
}

function handleStepChange(step: CoachMarkStep, index: number): void {
  currentStep.value = index
  const stepTitle = step.popover?.title || 'Unknown Step'
  logEvent('step-change', `Moved to step ${index + 1}: "${stepTitle}"`)

  // Simulate step-specific analytics
  setTimeout(() => {
    logEvent('info', `📊 Analytics: step_viewed event for step ${index + 1}`)
  }, 100)
}

// Initialize demo
onMounted(() => {
  logEvent('info', 'Skip Tour Demo initialized. Click "Start Tour" to begin!')

  // Add some helpful tips
  setTimeout(() => {
    logEvent('info', '💡 Tip: Try both tour modes to see the difference in skip button behavior')
  }, 2000)
})
</script>

<style scoped>
.home {
  max-width: 100%;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  margin: -2rem -2rem 3rem -2rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  opacity: 0.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Section Styles */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 2rem 0;
  color: #333;
}

/* Controls Section */
.controls-section {
  margin: 3rem 0;
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.control-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.control-panel h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.control-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.control-btn.primary {
  background: #28a745;
  color: white;
}

.control-btn.primary:hover:not(:disabled) {
  background: #218838;
}

.control-btn.secondary {
  background: #6c757d;
  color: white;
}

.control-btn.secondary:hover:not(:disabled) {
  background: #5a6268;
}

.control-btn.danger {
  background: #dc3545;
  color: white;
}

.control-btn.danger:hover:not(:disabled) {
  background: #c82333;
}

.control-btn.neutral {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.control-btn.neutral:hover:not(:disabled) {
  background: #e9ecef;
}

.tour-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.status-label {
  font-weight: 500;
  color: #495057;
}

.status-value {
  font-weight: 600;
  color: #6c757d;
}

.status-value.active {
  color: #28a745;
}

.event-log-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-log-panel h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
}

.event-log {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 6px;
  height: 300px;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.4;
}

.event-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  padding: 0.25rem;
  border-radius: 3px;
}

.event-item.tour-start {
  background: rgba(72, 187, 120, 0.2);
}

.event-item.tour-complete {
  background: rgba(56, 178, 172, 0.2);
}

.event-item.tour-skipped {
  background: rgba(237, 137, 54, 0.2);
}

.event-item.step-change {
  background: rgba(66, 153, 225, 0.2);
}

.event-item.info {
  background: rgba(160, 174, 192, 0.2);
}

.event-item.error {
  background: rgba(245, 101, 101, 0.2);
}

.event-time {
  color: #a0aec0;
  min-width: 70px;
}

.event-type {
  color: #81e6d9;
  min-width: 100px;
  font-weight: 600;
}

.event-message {
  color: #e2e8f0;
}

.no-events {
  color: #a0aec0;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

/* Features Grid */
.features {
  margin: 3rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.5;
  margin: 0;
  font-size: 0.9rem;
}

/* Code Examples */
.code-examples {
  margin: 3rem 0;
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
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

/* Custom Popover Styles */
:global(.demo-popover-large) {
  max-width: 400px;
}

:global(.demo-popover-medium) {
  max-width: 350px;
}

:global(.mint-coach-mark-popover__btn--skip) {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

:global(.mint-coach-mark-popover__btn--skip:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

/* Demo Navigation */
.demo-nav {
  margin: 3rem 0;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.demo-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  text-align: center;
}

.demo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.demo-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.demo-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.demo-card p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    padding: 2rem 1rem;
    margin: -1rem -1rem 2rem -1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .controls-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }

  .code-tabs {
    flex-wrap: wrap;
  }

  .code-tab {
    flex: 1;
    min-width: 120px;
  }

  .controls-section,
  .code-examples {
    padding: 1rem;
  }

  .event-log {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    gap: 0.5rem;
  }

  .btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .control-buttons {
    gap: 0.5rem;
  }

  .control-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>
