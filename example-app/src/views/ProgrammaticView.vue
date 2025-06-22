<template>
  <div class="programmatic">
    <!-- Header -->
    <div class="page-header">
      <h1>⚙️ Programmatic Control Demo</h1>
      <p>
        This demo shows how to use the useCoachMark composable for full programmatic control
        over tours, including custom navigation, conditional logic, and reactive state management.
      </p>
    </div>

    <!-- Control Panel -->
    <div class="control-panel">
      <h3>🎮 Tour Control Panel</h3>
      
      <div class="control-grid">
        <!-- Basic Controls -->
        <div class="control-section">
          <h4>Basic Controls</h4>
          <div class="button-group">
            <button @click="startTour" :disabled="isActive" class="control-btn primary">
              ▶️ Start Tour
            </button>
            <button @click="stopTour" :disabled="!isActive" class="control-btn">
              ⏹️ Stop Tour
            </button>
            <button @click="refreshTour" :disabled="!isActive" class="control-btn">
              🔄 Refresh
            </button>
          </div>
        </div>

        <!-- Navigation Controls -->
        <div class="control-section">
          <h4>Navigation</h4>
          <div class="button-group">
            <button @click="movePrevious" :disabled="!hasPreviousStep" class="control-btn">
              ⬅️ Previous
            </button>
            <button @click="moveNext" :disabled="!hasNextStep" class="control-btn">
              ➡️ Next
            </button>
            <button @click="goToStep(0)" :disabled="!isActive" class="control-btn">
              🏠 First
            </button>
            <button @click="goToStep(steps.length - 1)" :disabled="!isActive" class="control-btn">
              🏁 Last
            </button>
          </div>
        </div>

        <!-- Step Selection -->
        <div class="control-section">
          <h4>Jump to Step</h4>
          <div class="step-buttons">
            <button 
              v-for="(step, index) in steps" 
              :key="index"
              @click="goToStep(index)"
              :disabled="!isActive"
              class="step-btn"
              :class="{ active: currentStepIndex === index }"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>

        <!-- Single Element Highlight -->
        <div class="control-section">
          <h4>Single Highlights</h4>
          <div class="button-group">
            <button @click="highlightElement('#demo-card-1')" class="control-btn highlight">
              🎯 Highlight Card 1
            </button>
            <button @click="highlightElement('#demo-card-2')" class="control-btn highlight">
              🎯 Highlight Card 2
            </button>
            <button @click="highlightElement('#demo-card-3')" class="control-btn highlight">
              🎯 Highlight Card 3
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tour Status -->
    <div class="tour-status">
      <h3>📊 Tour Status</h3>
      <div class="status-grid">
        <div class="status-item">
          <span class="status-label">Active:</span>
          <span class="status-value" :class="{ active: isActive }">
            {{ isActive ? '✅ Yes' : '❌ No' }}
          </span>
        </div>
        <div class="status-item">
          <span class="status-label">Current Step:</span>
          <span class="status-value">{{ currentStepIndex !== undefined ? currentStepIndex + 1 : 'None' }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Total Steps:</span>
          <span class="status-value">{{ steps.length }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Is First:</span>
          <span class="status-value">{{ isFirstStep ? '✅' : '❌' }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Is Last:</span>
          <span class="status-value">{{ isLastStep ? '✅' : '❌' }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Has Next:</span>
          <span class="status-value">{{ hasNextStep ? '✅' : '❌' }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Has Previous:</span>
          <span class="status-value">{{ hasPreviousStep ? '✅' : '❌' }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Active Element:</span>
          <span class="status-value">{{ activeElementId || 'None' }}</span>
        </div>
      </div>
    </div>

    <!-- Demo Content -->
    <div class="demo-content">
      <h3>🎪 Demo Application</h3>
      
      <div class="demo-cards">
        <div id="demo-card-1" class="demo-card">
          <div class="card-icon">📊</div>
          <h4>Analytics Dashboard</h4>
          <p>View comprehensive analytics and insights about your data.</p>
          <button class="card-action">View Dashboard</button>
        </div>

        <div id="demo-card-2" class="demo-card">
          <div class="card-icon">👥</div>
          <h4>Team Management</h4>
          <p>Manage your team members, roles, and permissions.</p>
          <button class="card-action">Manage Team</button>
        </div>

        <div id="demo-card-3" class="demo-card">
          <div class="card-icon">⚙️</div>
          <h4>Settings Panel</h4>
          <p>Configure application settings and preferences.</p>
          <button class="card-action">Open Settings</button>
        </div>

        <div id="demo-card-4" class="demo-card">
          <div class="card-icon">📈</div>
          <h4>Reports Center</h4>
          <p>Generate and download detailed reports.</p>
          <button class="card-action">View Reports</button>
        </div>

        <div id="demo-card-5" class="demo-card">
          <div class="card-icon">🔔</div>
          <h4>Notifications</h4>
          <p>Manage your notification preferences and history.</p>
          <button class="card-action">View Notifications</button>
        </div>

        <div id="demo-card-6" class="demo-card">
          <div class="card-icon">🎯</div>
          <h4>Goals Tracking</h4>
          <p>Set and track your progress towards goals.</p>
          <button class="card-action">Track Goals</button>
        </div>
      </div>
    </div>

    <!-- Event Log -->
    <div class="event-log">
      <h3>📝 Event Log</h3>
      <div class="log-container">
        <div 
          v-for="(event, index) in eventLog" 
          :key="index"
          class="log-entry"
          :class="event.type"
        >
          <span class="log-time">{{ event.time }}</span>
          <span class="log-message">{{ event.message }}</span>
        </div>
      </div>
      <button @click="clearLog" class="clear-log-btn">🗑️ Clear Log</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCoachMark } from 'mint-coach-mark'
import type { CoachMarkStep, CoachMarkConfig } from 'mint-coach-mark'
import 'mint-coach-mark/dist/style.css'

// Event log interface
interface LogEvent {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

// Reactive state
const eventLog = ref<LogEvent[]>([])

// Tour steps
const steps: CoachMarkStep[] = [
  {
    element: '#demo-card-1',
    popover: {
      title: '📊 Analytics Dashboard',
      description: 'Start by exploring your analytics dashboard to understand your data.',
      side: 'top'
    }
  },
  {
    element: '#demo-card-2',
    popover: {
      title: '👥 Team Management',
      description: 'Manage your team members and their roles effectively.',
      side: 'top'
    }
  },
  {
    element: '#demo-card-3',
    popover: {
      title: '⚙️ Settings Panel',
      description: 'Configure your application settings to match your preferences.',
      side: 'bottom'
    }
  },
  {
    element: '#demo-card-4',
    popover: {
      title: '📈 Reports Center',
      description: 'Generate detailed reports for better insights.',
      side: 'bottom'
    }
  },
  {
    element: '#demo-card-5',
    popover: {
      title: '🔔 Notifications',
      description: 'Stay updated with important notifications.',
      side: 'bottom'
    }
  },
  {
    element: '#demo-card-6',
    popover: {
      title: '🎯 Goals Tracking',
      description: 'Track your progress and achieve your goals.',
      side: 'bottom'
    }
  }
]

// Tour configuration with hooks
const config: CoachMarkConfig = {
  animate: true,
  allowClose: true,
  showProgress: true,
  stagePadding: 10,
  stageRadius: 8,
  overlayOpacity: 0.75,
  
  // Global hooks for logging
  onHighlightStarted: (element, step, context) => {
    addLogEvent('info', `🎯 Highlighting started: ${step.popover?.title}`)
  },
  
  onHighlighted: (element, step, context) => {
    addLogEvent('success', `✨ Element highlighted: ${element?.id || 'unknown'}`)
  },
  
  onDeselected: (element, step, context) => {
    addLogEvent('info', `👋 Element deselected: ${element?.id || 'unknown'}`)
  }
}

// Initialize the composable
const {
  isActive,
  currentStepIndex,
  drive,
  destroy,
  moveNext,
  movePrevious,
  moveTo,
  hasNextStep,
  hasPreviousStep,
  isFirstStep,
  isLastStep,
  getActiveElement,
  highlight,
  refresh
} = useCoachMark({ steps, ...config })

// Computed properties
const activeElementId = computed(() => {
  const element = getActiveElement()
  return element?.id || null
})

// Watch for step changes
watch(currentStepIndex, (newIndex, oldIndex) => {
  if (newIndex !== undefined && newIndex !== oldIndex) {
    addLogEvent('info', `📍 Step changed: ${oldIndex ?? 'none'} → ${newIndex + 1}`)
  }
})

// Event handlers
function startTour() {
  addLogEvent('success', '🚀 Tour started')
  drive(0)
}

function stopTour() {
  addLogEvent('warning', '⏹️ Tour stopped')
  destroy()
}

function refreshTour() {
  addLogEvent('info', '🔄 Tour refreshed')
  refresh()
}

function goToStep(index: number) {
  addLogEvent('info', `🎯 Jumping to step ${index + 1}`)
  moveTo(index)
}

function highlightElement(selector: string) {
  addLogEvent('info', `🎯 Highlighting single element: ${selector}`)
  highlight({
    element: selector,
    popover: {
      title: '🎯 Single Highlight',
      description: `This is a single element highlight for ${selector}`,
      showButtons: ['close'],
      side: 'top'
    }
  })
}

function addLogEvent(type: LogEvent['type'], message: string) {
  const now = new Date()
  const time = now.toLocaleTimeString()
  
  eventLog.value.unshift({
    time,
    message,
    type
  })
  
  // Keep only last 50 events
  if (eventLog.value.length > 50) {
    eventLog.value = eventLog.value.slice(0, 50)
  }
}

function clearLog() {
  eventLog.value = []
  addLogEvent('info', '🗑️ Event log cleared')
}

// Initialize with welcome message
addLogEvent('info', '👋 Programmatic control demo initialized')
</script>

<style scoped>
.programmatic {
  max-width: 100%;
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
  max-width: 700px;
  margin: 0 auto;
}

/* Control Panel */
.control-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.control-panel h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #333;
  text-align: center;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.control-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.control-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #333;
  text-align: center;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  text-align: center;
}

.control-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #ccc;
}

.control-btn.primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.control-btn.primary:hover:not(:disabled) {
  background: #5a67d8;
  border-color: #5a67d8;
}

.control-btn.highlight {
  background: #38d9a9;
  color: white;
  border-color: #38d9a9;
}

.control-btn.highlight:hover:not(:disabled) {
  background: #20c997;
  border-color: #20c997;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Step Buttons */
.step-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 0.5rem;
}

.step-btn {
  padding: 0.75rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
  text-align: center;
}

.step-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #ccc;
}

.step-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.step-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Tour Status */
.tour-status {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.tour-status h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #333;
  text-align: center;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.status-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-weight: 500;
  color: #666;
}

.status-value {
  font-weight: 600;
  color: #333;
}

.status-value.active {
  color: #28a745;
}

/* Demo Content */
.demo-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.demo-content h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #333;
  text-align: center;
}

.demo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.demo-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
}

.demo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.demo-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.demo-card p {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.card-action {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;
}

.card-action:hover {
  background: #5a67d8;
}

/* Event Log */
.event-log {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.event-log h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #333;
  text-align: center;
}

.log-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.log-entry {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.log-entry.info {
  background: #e3f2fd;
  color: #1565c0;
}

.log-entry.success {
  background: #e8f5e8;
  color: #2e7d32;
}

.log-entry.warning {
  background: #fff3e0;
  color: #ef6c00;
}

.log-entry.error {
  background: #ffebee;
  color: #c62828;
}

.log-time {
  font-weight: 600;
  min-width: 80px;
  opacity: 0.8;
}

.log-message {
  flex: 1;
}

.clear-log-btn {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;
  display: block;
  margin: 0 auto;
}

.clear-log-btn:hover {
  background: #c82333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .control-grid {
    grid-template-columns: 1fr;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .demo-cards {
    grid-template-columns: 1fr;
  }

  .step-buttons {
    grid-template-columns: repeat(3, 1fr);
  }

  .status-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
