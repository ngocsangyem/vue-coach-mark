<template>
  <div class="example-app">
    <header class="header">
      <h1 id="app-title">MintCoachMark Demo</h1>
      <nav class="nav">
        <button id="nav-home" class="nav-btn">Home</button>
        <button id="nav-about" class="nav-btn">About</button>
        <button id="nav-contact" class="nav-btn">Contact</button>
      </nav>
    </header>

    <main class="main">
      <section class="hero">
        <h2 id="hero-title">Welcome to Our App</h2>
        <p id="hero-description">
          This is a demonstration of the MintCoachMark component library.
          Click the button below to start the guided tour.
        </p>
        <button id="start-tour-btn" @click="startTour" class="cta-button">
          Start Tour
        </button>
      </section>

      <section class="features">
        <div id="feature-1" class="feature-card">
          <h3>Feature One</h3>
          <p>This is the first amazing feature of our application.</p>
        </div>
        <div id="feature-2" class="feature-card">
          <h3>Feature Two</h3>
          <p>This is the second incredible feature you'll love.</p>
        </div>
        <div id="feature-3" class="feature-card">
          <h3>Feature Three</h3>
          <p>This is the third outstanding feature that completes the set.</p>
        </div>
      </section>

      <section class="actions">
        <button id="action-save" class="action-btn">Save</button>
        <button id="action-share" class="action-btn">Share</button>
        <button id="action-export" class="action-btn">Export</button>
      </section>
    </main>

    <!-- MintCoachMark Component -->
    <MintCoachMark
      v-model="showTour"
      :steps="tourSteps"
      :config="tourConfig"
      @tour-start="onTourStart"
      @tour-complete="onTourComplete"
      @step-change="onStepChange"
    >
      <!-- Custom title slot with icons -->
      <template #title="{ step, index }">
        <div class="custom-title">
          <span class="step-icon">{{ step.icon }}</span>
          {{ step.popover.title }}
        </div>
      </template>

      <!-- Custom progress slot -->
      <template #progress="{ step, index, total }">
        <div class="custom-progress">
          <div class="progress-dots">
            <span
              v-for="i in total"
              :key="i"
              class="progress-dot"
              :class="{ active: i <= index + 1 }"
            />
          </div>
          <span class="progress-text">{{ index + 1 }} of {{ total }}</span>
        </div>
      </template>
    </MintCoachMark>

    <!-- Tour controls -->
    <div class="tour-controls">
      <button @click="startTour" :disabled="showTour">Start Tour</button>
      <button @click="stopTour" :disabled="!showTour">Stop Tour</button>
      <button @click="restartTour" :disabled="!showTour">Restart</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MintCoachMark } from 'mint-coach-mark'
import type { CoachMarkStep, CoachMarkConfig } from 'mint-coach-mark'
import 'mint-coach-mark/dist/style.css'

const showTour = ref(false)

// Define tour steps with custom properties
const tourSteps: (CoachMarkStep & { icon: string })[] = [
  {
    element: '#app-title',
    icon: '👋',
    popover: {
      title: 'Welcome!',
      description: 'Welcome to our application! This tour will guide you through the main features.',
      side: 'bottom',
      showButtons: ['next', 'close']
    }
  },
  {
    element: '#nav-home',
    icon: '🧭',
    popover: {
      title: 'Navigation',
      description: 'Use these navigation buttons to move between different sections of the app.',
      side: 'bottom'
    }
  },
  {
    element: '#hero-description',
    icon: '📖',
    popover: {
      title: 'Main Content',
      description: 'This area contains the main content and information about our application.',
      side: 'top'
    }
  },
  {
    element: '#feature-1',
    icon: '⭐',
    popover: {
      title: 'Features Section',
      description: 'Here you can explore the different features we offer. Each card represents a unique capability.',
      side: 'right'
    }
  },
  {
    element: '#action-save',
    icon: '💾',
    popover: {
      title: 'Action Buttons',
      description: 'These buttons allow you to perform various actions like saving, sharing, and exporting your work.',
      side: 'top'
    }
  },
  {
    element: '#start-tour-btn',
    icon: '🎯',
    popover: {
      title: 'Tour Complete!',
      description: 'You can restart the tour anytime by clicking this button. Thanks for taking the tour!',
      side: 'top',
      doneBtnText: 'Finish Tour'
    }
  }
]

// Tour configuration
const tourConfig: CoachMarkConfig = {
  animate: true,
  allowClose: true,
  showProgress: true,
  stagePadding: 8,
  stageRadius: 8,
  overlayOpacity: 0.75,
  smoothScroll: true,
  progressText: 'Step {{current}} of {{total}}',
  
  // Global hooks
  onHighlightStarted: (element, step, { config, state, driver }) => {
    console.log('🎯 Highlighting started:', step)
  },
  
  onHighlighted: (element, step, { config, state, driver }) => {
    console.log('✨ Element highlighted:', element)
  },
  
  onDeselected: (element, step, { config, state, driver }) => {
    console.log('👋 Element deselected:', element)
  }
}

// Event handlers
function startTour() {
  showTour.value = true
}

function stopTour() {
  showTour.value = false
}

function restartTour() {
  showTour.value = false
  setTimeout(() => {
    showTour.value = true
  }, 100)
}

function onTourStart() {
  console.log('🚀 Tour started!')
}

function onTourComplete() {
  console.log('🎉 Tour completed!')
}

function onStepChange(step: CoachMarkStep, index: number) {
  console.log(`📍 Step ${index + 1}:`, step)
}
</script>

<style scoped>
.example-app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 40px;
}

.header h1 {
  margin: 0;
  color: #333;
}

.nav {
  display: flex;
  gap: 10px;
}

.nav-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #f5f5f5;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.hero {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.hero h2 {
  margin: 0 0 16px 0;
  font-size: 2.5rem;
}

.hero p {
  font-size: 1.2rem;
  margin: 0 0 24px 0;
  opacity: 0.9;
}

.cta-button {
  padding: 12px 24px;
  font-size: 1.1rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.feature-card h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.action-btn {
  padding: 10px 20px;
  border: 2px solid #667eea;
  background: transparent;
  color: #667eea;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #667eea;
  color: white;
}

.tour-controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.tour-controls button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.tour-controls button:hover:not(:disabled) {
  background: #f5f5f5;
}

.tour-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Custom tour styling */
.custom-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-icon {
  font-size: 1.2em;
}

.custom-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-dots {
  display: flex;
  gap: 4px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  transition: background 0.2s;
}

.progress-dot.active {
  background: #667eea;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

/* Responsive design */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
  }

  .nav {
    justify-content: center;
  }

  .hero h2 {
    font-size: 2rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
    align-items: center;
  }

  .tour-controls {
    position: static;
    margin-top: 40px;
  }
}
</style>
