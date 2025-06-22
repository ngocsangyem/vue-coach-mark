<template>
  <div class="async-api-demo">
    <!-- QuasarCoachMark Component -->
    <QuasarCoachMark
      v-model="showTour"
      :steps="tourSteps"
      :config="tourConfig"
      @tour-start="handleTourStart"
      @tour-complete="handleTourComplete"
      @step-change="handleStepChange"
    />

    <!-- Header -->
    <section class="demo-header">
      <h1>🚀 Async API Integration Demo</h1>
      <p class="demo-description">
        Experience real-world API integration with QuasarCoachMark's async functionality. 
        This demo fetches data from JSONPlaceholder API and demonstrates how to handle 
        asynchronous operations during tour navigation.
      </p>
    </section>

    <!-- Controls -->
    <section class="controls-section">
      <h2>🎮 Demo Controls</h2>
      <div class="control-buttons">
        <button 
          @click="startAsyncTour" 
          :disabled="showTour"
          class="control-btn primary"
        >
          🎯 Start Async Tour
        </button>
        <button 
          @click="resetDemo" 
          :disabled="showTour"
          class="control-btn secondary"
        >
          🔄 Reset Demo
        </button>
        <button 
          @click="fetchTodosManually" 
          :disabled="isLoading"
          class="control-btn tertiary"
        >
          📡 Manual API Call
        </button>
      </div>
    </section>

    <!-- API Status -->
    <section class="api-status-section">
      <h2>📊 API Status</h2>
      <div class="status-card" id="api-status">
        <div class="status-item">
          <span class="status-label">Endpoint:</span>
          <span class="status-value">{{ apiEndpoint }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Status:</span>
          <span class="status-value" :class="statusClass">{{ apiStatus }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Last Request:</span>
          <span class="status-value">{{ lastRequestTime || 'None' }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Total Requests:</span>
          <span class="status-value">{{ requestCount }}</span>
        </div>
      </div>
    </section>

    <!-- Loading Indicator -->
    <section v-if="isLoading" class="loading-section" id="loading-indicator">
      <div class="loading-card">
        <div class="loading-spinner"></div>
        <h3>🔄 Fetching Data...</h3>
        <p>{{ loadingMessage }}</p>
        <div class="loading-progress">
          <div class="progress-bar" :style="{ width: `${loadingProgress}%` }"></div>
        </div>
      </div>
    </section>

    <!-- Error Display -->
    <section v-if="error" class="error-section" id="error-display">
      <div class="error-card">
        <h3>❌ API Error</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="clearError" class="error-btn">Clear Error</button>
      </div>
    </section>

    <!-- Data Display -->
    <section class="data-section">
      <h2>📋 Todo Data</h2>
      <div class="data-controls" id="data-controls">
        <div class="data-stats">
          <span class="stat-item">
            <strong>Total:</strong> {{ todos.length }}
          </span>
          <span class="stat-item">
            <strong>Completed:</strong> {{ completedCount }}
          </span>
          <span class="stat-item">
            <strong>Pending:</strong> {{ pendingCount }}
          </span>
        </div>
        <div class="filter-controls">
          <select v-model="filterStatus" @change="applyFilter">
            <option value="all">All Todos</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <!-- Todo List -->
      <div class="todo-list" id="todo-list">
        <div 
          v-for="todo in filteredTodos" 
          :key="todo.id"
          class="todo-item"
          :class="{ completed: todo.completed }"
          :id="`todo-${todo.id}`"
        >
          <div class="todo-content">
            <span class="todo-id">#{{ todo.id }}</span>
            <span class="todo-title">{{ todo.title }}</span>
            <span class="todo-status" :class="todo.completed ? 'completed' : 'pending'">
              {{ todo.completed ? '✅ Completed' : '⏳ Pending' }}
            </span>
          </div>
        </div>
        
        <div v-if="filteredTodos.length === 0 && !isLoading" class="empty-state">
          <p>No todos to display. Start the tour to fetch data!</p>
        </div>
      </div>
    </section>

    <!-- Tour Progress -->
    <section v-if="showTour" class="tour-progress-section" id="tour-progress">
      <div class="progress-card">
        <h3>🎯 Tour Progress</h3>
        <div class="progress-info">
          <span>Step {{ currentStepIndex + 1 }} of {{ tourSteps.length }}</span>
          <span>{{ currentStepTitle }}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: `${tourProgress}%` }"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'
import QuasarCoachMark from '../../../src/components/QuasarCoachMark.vue'
import type { CoachMarkStep, CoachMarkConfig } from '../../../src/types'

// Types
interface Todo {
  id: number
  userId: number
  title: string
  completed: boolean
}

// Reactive state
const showTour = ref(false)
const currentStepIndex = ref(0)
const todos = ref<Todo[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const filterStatus = ref<'all' | 'completed' | 'pending'>('all')
const requestCount = ref(0)
const lastRequestTime = ref<string | null>(null)
const loadingProgress = ref(0)
const loadingMessage = ref('')

// API configuration
const apiEndpoint = 'https://jsonplaceholder.typicode.com/todos'

// Computed properties
const filteredTodos = computed(() => {
  if (filterStatus.value === 'all') return todos.value
  if (filterStatus.value === 'completed') return todos.value.filter(todo => todo.completed)
  return todos.value.filter(todo => !todo.completed)
})

const completedCount = computed(() => todos.value.filter(todo => todo.completed).length)
const pendingCount = computed(() => todos.value.filter(todo => !todo.completed).length)

const apiStatus = computed(() => {
  if (isLoading.value) return 'Loading...'
  if (error.value) return 'Error'
  if (todos.value.length > 0) return 'Success'
  return 'Ready'
})

const statusClass = computed(() => {
  if (isLoading.value) return 'loading'
  if (error.value) return 'error'
  if (todos.value.length > 0) return 'success'
  return 'ready'
})

const currentStepTitle = computed(() => {
  const step = tourSteps[currentStepIndex.value]
  return step?.popover?.title || 'Unknown Step'
})

const tourProgress = computed(() => {
  return ((currentStepIndex.value + 1) / tourSteps.length) * 100
})

// API functions
const fetchTodos = async (limit?: number): Promise<Todo[]> => {
  try {
    isLoading.value = true
    error.value = null
    requestCount.value++
    lastRequestTime.value = new Date().toLocaleTimeString()

    // Simulate loading progress
    loadingMessage.value = 'Connecting to JSONPlaceholder API...'
    loadingProgress.value = 20

    await new Promise(resolve => setTimeout(resolve, 500))

    loadingMessage.value = 'Fetching todo data...'
    loadingProgress.value = 60

    const url = limit ? `${apiEndpoint}?_limit=${limit}` : apiEndpoint
    const response = await axios.get<Todo[]>(url)

    loadingMessage.value = 'Processing data...'
    loadingProgress.value = 90

    await new Promise(resolve => setTimeout(resolve, 300))

    loadingProgress.value = 100
    return response.data
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to fetch todos: ${errorMessage}`
    throw err
  } finally {
    isLoading.value = false
    loadingProgress.value = 0
    loadingMessage.value = ''
  }
}

const fetchTodosManually = async () => {
  try {
    const data = await fetchTodos(10)
    todos.value = data
  } catch (err) {
    console.error('Manual fetch failed:', err)
  }
}

// Async tour step handlers
const handleInitialDataFetch = async (element, step, driver): Promise<void> => {
  console.log('🚀 Step 1: Fetching initial todo data...')
  try {
    const data = await fetchTodos(5)
    todos.value = data
    console.log(`✅ Fetched ${data.length} todos successfully`)

    await nextTick()

    driver.moveNext()
  } catch (err) {
    console.error('❌ Failed to fetch initial data:', err)
  }
}

const handleFilteredDataFetch = async (): Promise<void> => {
  console.log('🔍 Step 2: Fetching filtered data...')
  try {
    const data = await fetchTodos(15)
    todos.value = data

    // Auto-apply completed filter for demo
    await nextTick()
    filterStatus.value = 'completed'
    console.log(`✅ Fetched ${data.length} todos and applied completed filter`)
  } catch (err) {
    console.error('❌ Failed to fetch filtered data:', err)
  }
}

const handleFullDataFetch = async (): Promise<void> => {
  console.log('📊 Step 3: Fetching complete dataset...')
  try {
    const data = await fetchTodos() // Fetch all todos
    todos.value = data

    // Reset filter to show all data
    await nextTick()
    filterStatus.value = 'all'
    console.log(`✅ Fetched complete dataset: ${data.length} todos`)
  } catch (err) {
    console.error('❌ Failed to fetch complete data:', err)
  }
}

// Tour configuration
const tourSteps: CoachMarkStep[] = [
  {
    element: '#api-status',
    popover: {
      title: '🚀 Welcome to Async API Demo',
      description: `
        <p>This demo showcases <strong>real API integration</strong> with QuasarCoachMark's async functionality.</p>
        <p>We'll fetch data from the JSONPlaceholder API and demonstrate how to handle asynchronous operations during tour navigation.</p>
        <p><strong>Next:</strong> We'll fetch initial todo data from the API.</p>
      `,
      showProgress: true,
      showButtons: ['next', 'close'],
      onAsyncNextClick: handleInitialDataFetch,
      tooltip: {
        anchor: 'bottom middle',
        self: 'top middle',
        offset: [0, 15]
      },
    },
  },
  {
    element: '#todo-1',
    popover: {
      title: '⏳ Loading States',
      description: `
        <p>Notice the <strong>loading indicator</strong> that appeared during the API call.</p>
        <p>The tour automatically waits for async operations to complete before proceeding.</p>
        <p><strong>Data fetched:</strong> ${() => todos.value.length} todos</p>
        <p><strong>Next:</strong> We'll fetch more data and apply filters.</p>
      `,
      showProgress: true,
      showButtons: ['previous', 'next', 'close'],
      onAsyncNextClick: handleFilteredDataFetch,
      tooltip: {
        anchor: 'center middle',
        self: 'center middle',
        offset: [0, 0]
      }
    }
  },
  {
    element: '#data-controls',
    popover: {
      title: '🔍 Data Filtering',
      description: `
        <p>We've fetched more data and automatically applied the <strong>completed filter</strong>.</p>
        <p>This demonstrates how async operations can trigger UI updates during the tour.</p>
        <p><strong>Current filter:</strong> Showing completed todos only</p>
        <p><strong>Next:</strong> We'll fetch the complete dataset.</p>
      `,
      showProgress: true,
      showButtons: ['previous', 'next', 'close'],
      onAsyncNextClick: handleFullDataFetch,
      tooltip: {
        anchor: 'bottom middle',
        self: 'top middle',
        offset: [0, 12]
      }
    }
  },
  {
    element: '#todo-list',
    popover: {
      title: '📋 Complete Dataset',
      description: `
        <p><strong>Success!</strong> We've fetched the complete dataset from the API.</p>
        <p>This demonstrates how QuasarCoachMark handles multiple async operations seamlessly.</p>
        <p><strong>Total todos:</strong> ${() => todos.value.length}</p>
        <p><strong>API requests made:</strong> ${() => requestCount.value}</p>
      `,
      showProgress: true,
      showButtons: ['previous', 'next', 'close'],
      tooltip: {
        anchor: 'top middle',
        self: 'bottom middle',
        offset: [0, 15]
      }
    }
  },
  {
    element: '#tour-progress',
    popover: {
      title: '🎯 Tour Complete!',
      description: `
        <p><strong>Congratulations!</strong> You've experienced async API integration with QuasarCoachMark.</p>
        <p><strong>Key features demonstrated:</strong></p>
        <ul>
          <li>Real API calls with axios</li>
          <li>Async step transitions</li>
          <li>Loading states and error handling</li>
          <li>Dynamic content updates</li>
        </ul>
        <p>Try the manual API call button to experiment further!</p>
      `,
      showProgress: true,
      showButtons: ['previous', 'close'],
      nextBtnText: 'Finish Demo',
      tooltip: {
        anchor: 'top middle',
        self: 'bottom middle',
        offset: [0, 20]
      }
    }
  }
]

const tourConfig: CoachMarkConfig = {
  animate: true,
  allowClose: true,
  showProgress: true,
  padding: 15,
  radius: 8,
  overlayOpacity: 0.75,
  smoothScroll: true,
  popoverOffset: 20
}

// Event handlers
const handleTourStart = (): void => {
  console.log('🎯 Async API Demo tour started')
  currentStepIndex.value = 0
}

const handleTourComplete = (): void => {
  console.log('✅ Async API Demo tour completed')
  currentStepIndex.value = 0
}

const handleStepChange = (step: CoachMarkStep, index: number): void => {
  currentStepIndex.value = index
  console.log(`📍 Step ${index + 1}: ${step.popover?.title}`)
}

const startAsyncTour = (): void => {
  console.log('🚀 Starting async API integration tour')
  resetDemo()
  showTour.value = true
}

const resetDemo = (): void => {
  console.log('🔄 Resetting demo state')
  showTour.value = false
  todos.value = []
  error.value = null
  filterStatus.value = 'all'
  currentStepIndex.value = 0
  requestCount.value = 0
  lastRequestTime.value = null
}

const clearError = (): void => {
  error.value = null
}

const applyFilter = (): void => {
  console.log(`🔍 Applied filter: ${filterStatus.value}`)
}

// Lifecycle
onMounted(() => {
  console.log('🎬 AsyncApiDemo component mounted')
})
</script>

<style scoped>
.async-api-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.demo-header {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.demo-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Controls */
.controls-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.controls-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 150px;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.control-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.control-btn.secondary {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
}

.control-btn.secondary:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #dee2e6;
}

.control-btn.tertiary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.control-btn.tertiary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

/* Status Section */
.api-status-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.api-status-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.status-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #ecf0f1;
  border-radius: 8px;
  border-left: 4px solid #e9ecef;
}

.status-label {
  font-weight: 600;
  color: #495057;
}

.status-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #95a5a6;
}

.status-value.ready {
  color: #6c757d;
  border-left-color: #6c757d;
}

.status-value.loading {
  color: #007bff;
  border-left-color: #007bff;
  animation: pulse 1.5s infinite;
}

.status-value.success {
  color: #28a745;
  border-left-color: #28a745;
}

.status-value.error {
  color: #dc3545;
  border-left-color: #dc3545;
}

/* Loading Section */
.loading-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.loading-card h3 {
  margin: 1rem 0 0.5rem 0;
  color: #007bff;
}

.loading-card p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-progress {
  width: 100%;
  height: 8px;
  background: #f3f3f3;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #00d4ff);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Error Section */
.error-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  border-left: 4px solid #dc3545;
}

.error-card h3 {
  margin: 0 0 1rem 0;
  color: #dc3545;
}

.error-message {
  color: #721c24;
  background: #f8d7da;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
}

.error-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.error-btn:hover {
  background: #c82333;
}

/* Data Section */
.data-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.data-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.data-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.data-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  font-size: 0.875rem;
  color: #495057;
}

.filter-controls select {
  padding: 0.5rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
}

.filter-controls select:focus {
  outline: none;
  border-color: #667eea;
}

.todo-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.todo-item {
  padding: 1rem;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s;
}

.todo-item:hover {
  background: #f8f9fa;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item.completed {
  opacity: 0.7;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.todo-id {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.875rem;
  min-width: 40px;
}

.todo-title {
  flex: 1;
  color: #333;
  line-height: 1.4;
}

.todo-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.todo-status.completed {
  background: #d4edda;
  color: #155724;
}

.todo-status.pending {
  background: #fff3cd;
  color: #856404;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

/* Tour Progress */
.tour-progress-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  border-left: 4px solid #667eea;
}

.progress-card h3 {
  margin: 0 0 1rem 0;
  color: #667eea;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #495057;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: #f3f3f3;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-container .progress-bar {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .async-api-demo {
    padding: 1rem;
  }

  .demo-header h1 {
    font-size: 2rem;
  }

  .control-buttons {
    flex-direction: column;
    align-items: center;
  }

  .control-btn {
    width: 100%;
    max-width: 300px;
  }

  .status-card {
    grid-template-columns: 1fr;
  }

  .data-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .data-stats {
    justify-content: space-around;
  }

  .todo-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .progress-info {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>
