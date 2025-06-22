<template>
  <div class="basic-tour">
    <!-- Header -->
    <div class="page-header">
      <h1>🎯 Basic Tour Demo</h1>
      <p>
        This demo shows the basic functionality of MintCoachMark with a simple step-by-step tour.
        Click "Start Tour" to begin the guided experience.
      </p>
    </div>

    <!-- Demo Application -->
    <div class="demo-app">
      <!-- Toolbar -->
      <div id="toolbar" class="toolbar">
        <div class="toolbar-section">
          <button id="new-btn" class="toolbar-btn primary">
            📄 New
          </button>
          <button id="save-btn" class="toolbar-btn">
            💾 Save
          </button>
          <button id="share-btn" class="toolbar-btn">
            🔗 Share
          </button>
        </div>
        
        <div class="toolbar-section">
          <button id="settings-btn" class="toolbar-btn">
            ⚙️ Settings
          </button>
          <button id="help-btn" class="toolbar-btn">
            ❓ Help
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="content-area">
        <aside id="sidebar" class="sidebar">
          <h3>Navigation</h3>
          <nav class="nav-menu">
            <a href="#" id="dashboard-link" class="nav-link active">
              📊 Dashboard
            </a>
            <a href="#" id="projects-link" class="nav-link">
              📁 Projects
            </a>
            <a href="#" id="team-link" class="nav-link">
              👥 Team
            </a>
            <a href="#" id="analytics-link" class="nav-link">
              📈 Analytics
            </a>
          </nav>
        </aside>

        <main id="main-content" class="main-content">
          <div class="content-header">
            <h2 id="page-title">Dashboard</h2>
            <div class="content-actions">
              <button id="filter-btn" class="action-btn">
                🔍 Filter
              </button>
              <button id="export-btn" class="action-btn">
                📤 Export
              </button>
            </div>
          </div>

          <div class="content-body">
            <div class="stats-grid">
              <div id="stats-card-1" class="stats-card">
                <h4>Total Users</h4>
                <div class="stats-value">1,234</div>
              </div>
              <div id="stats-card-2" class="stats-card">
                <h4>Revenue</h4>
                <div class="stats-value">$12,345</div>
              </div>
              <div id="stats-card-3" class="stats-card">
                <h4>Growth</h4>
                <div class="stats-value">+15%</div>
              </div>
            </div>

            <div id="chart-area" class="chart-area">
              <h3>Performance Chart</h3>
              <div class="chart-placeholder">
                📊 Chart would be displayed here
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Tour Controls -->
    <div class="tour-controls">
      <button @click="startTour" :disabled="showTour" class="control-btn primary">
        🎯 Start Tour
      </button>
      <button @click="stopTour" :disabled="!showTour" class="control-btn">
        ⏹️ Stop Tour
      </button>
      <button @click="restartTour" :disabled="!showTour" class="control-btn">
        🔄 Restart
      </button>
    </div>

    <!-- Tour Status -->
    <div v-if="showTour" class="tour-status">
      <p>
        <strong>Tour Active:</strong> Step {{ currentStepIndex + 1 }} of {{ steps.length }}
      </p>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- MintCoachMark Component -->
    <MintCoachMark
      v-model="showTour"
      :steps="steps"
      :config="config"
      @tour-start="onTourStart"
      @tour-complete="onTourComplete"
      @step-change="onStepChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MintCoachMark } from 'mint-coach-mark'
import type { CoachMarkStep, CoachMarkConfig } from 'mint-coach-mark'
import 'mint-coach-mark/dist/style.css'

// Reactive state
const showTour = ref(false)
const currentStepIndex = ref(0)

// Tour steps configuration
const steps: CoachMarkStep[] = [
  {
    element: '#toolbar',
    popover: {
      title: '🎯 Welcome to the Tour!',
      description: 'This is the main toolbar where you can access primary actions like creating new documents, saving, and sharing.',
      side: 'bottom',
      showButtons: ['next', 'close']
    }
  },
  {
    element: '#new-btn',
    popover: {
      title: '📄 Create New',
      description: 'Click here to create a new document or project. This is usually your starting point for new work.',
      side: 'bottom'
    }
  },
  {
    element: '#sidebar',
    popover: {
      title: '🧭 Navigation Sidebar',
      description: 'Use this sidebar to navigate between different sections of the application. Each section provides different functionality.',
      side: 'right'
    }
  },
  {
    element: '#main-content',
    popover: {
      title: '📋 Main Content Area',
      description: 'This is where the main content is displayed. The content changes based on your navigation selection.',
      side: 'top'
    }
  },
  {
    element: '#stats-card-1',
    popover: {
      title: '📊 Statistics Cards',
      description: 'These cards show key metrics and statistics. They provide a quick overview of important data.',
      side: 'top'
    }
  },
  {
    element: '#chart-area',
    popover: {
      title: '📈 Analytics Chart',
      description: 'This area displays interactive charts and graphs to help you visualize your data trends.',
      side: 'top'
    }
  },
  {
    element: '#settings-btn',
    popover: {
      title: '⚙️ Settings',
      description: 'Access application settings and preferences here. You can customize your experience and configure options.',
      side: 'bottom',
      doneBtnText: 'Finish Tour'
    }
  }
]

// Tour configuration
const config: CoachMarkConfig = {
  animate: true,
  allowClose: true,
  showProgress: true,
  stagePadding: 8,
  stageRadius: 8,
  overlayOpacity: 0.75,
  smoothScroll: true,
  progressText: 'Step {{current}} of {{total}}',
  
  // Global event handlers
  onHighlightStarted: (element, step, context) => {
    console.log('🎯 Highlighting started:', step.popover?.title)
  },
  
  onHighlighted: (element, step, context) => {
    console.log('✨ Element highlighted:', element)
  },
  
  onDeselected: (element, step, context) => {
    console.log('👋 Element deselected:', element)
  }
}

// Event handlers
function startTour() {
  showTour.value = true
  currentStepIndex.value = 0
}

function stopTour() {
  showTour.value = false
}

function restartTour() {
  showTour.value = false
  setTimeout(() => {
    currentStepIndex.value = 0
    showTour.value = true
  }, 100)
}

function onTourStart() {
  console.log('🚀 Tour started!')
}

function onTourComplete() {
  console.log('🎉 Tour completed!')
  currentStepIndex.value = 0
}

function onStepChange(step: CoachMarkStep, index: number) {
  console.log(`📍 Step ${index + 1}:`, step.popover?.title)
  currentStepIndex.value = index
}
</script>

<style scoped>
.basic-tour {
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
  max-width: 600px;
  margin: 0 auto;
}

/* Demo Application Styles */
.demo-app {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

/* Toolbar */
.toolbar {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-section {
  display: flex;
  gap: 0.5rem;
}

.toolbar-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #f8f9fa;
  border-color: #ccc;
}

.toolbar-btn.primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.toolbar-btn.primary:hover {
  background: #5a67d8;
  border-color: #5a67d8;
}

/* Content Area */
.content-area {
  display: flex;
  min-height: 500px;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  padding: 1.5rem;
}

.sidebar h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #666;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #e9ecef;
  color: #333;
}

.nav-link.active {
  background: #667eea;
  color: white;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 1.5rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.content-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.content-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #ccc;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stats-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stats-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stats-value {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

/* Chart Area */
.chart-area {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.chart-area h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px dashed #ddd;
  border-radius: 6px;
  color: #666;
  font-size: 1.1rem;
}

/* Tour Controls */
.tour-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
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

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Tour Status */
.tour-status {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
}

.tour-status p {
  margin: 0 0 0.5rem 0;
  color: #1565c0;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #bbdefb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1976d2;
  transition: width 0.3s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-area {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .toolbar {
    flex-direction: column;
    gap: 1rem;
  }

  .toolbar-section {
    justify-content: center;
  }

  .content-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .tour-controls {
    flex-direction: column;
    align-items: center;
  }
}
</style>
