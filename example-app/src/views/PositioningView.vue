<template>
  <div class="positioning">
    <!-- Header -->
    <div class="page-header">
      <h1>📍 Positioning Demo</h1>
      <p>
        This demo showcases different positioning options for popovers including automatic 
        collision detection and smart positioning adjustments.
      </p>
    </div>

    <!-- Positioning Controls -->
    <div class="positioning-controls">
      <h3>Choose Positioning Mode:</h3>
      <div class="control-buttons">
        <button 
          v-for="mode in positioningModes" 
          :key="mode.id"
          @click="startPositioningDemo(mode)"
          :disabled="showTour"
          class="control-btn"
          :class="{ active: currentMode?.id === mode.id }"
        >
          {{ mode.icon }} {{ mode.name }}
        </button>
      </div>
    </div>

    <!-- Demo Layout -->
    <div class="demo-layout">
      <!-- Top Edge Elements -->
      <div class="edge-section top-edge">
        <div id="top-left" class="position-element corner">
          📍 Top Left
        </div>
        <div id="top-center" class="position-element center">
          📍 Top Center
        </div>
        <div id="top-right" class="position-element corner">
          📍 Top Right
        </div>
      </div>

      <!-- Middle Section -->
      <div class="middle-section">
        <!-- Left Edge -->
        <div class="edge-section left-edge">
          <div id="left-top" class="position-element">
            📍 Left Top
          </div>
          <div id="left-center" class="position-element">
            📍 Left Center
          </div>
          <div id="left-bottom" class="position-element">
            📍 Left Bottom
          </div>
        </div>

        <!-- Center Content -->
        <div class="center-content">
          <div id="center-element" class="position-element large">
            📍 Center Element
            <p>This element is in the center and can demonstrate 'over' positioning</p>
          </div>
          
          <div class="content-grid">
            <div id="grid-1" class="position-element small">📍 Grid 1</div>
            <div id="grid-2" class="position-element small">📍 Grid 2</div>
            <div id="grid-3" class="position-element small">📍 Grid 3</div>
            <div id="grid-4" class="position-element small">📍 Grid 4</div>
          </div>
        </div>

        <!-- Right Edge -->
        <div class="edge-section right-edge">
          <div id="right-top" class="position-element">
            📍 Right Top
          </div>
          <div id="right-center" class="position-element">
            📍 Right Center
          </div>
          <div id="right-bottom" class="position-element">
            📍 Right Bottom
          </div>
        </div>
      </div>

      <!-- Bottom Edge Elements -->
      <div class="edge-section bottom-edge">
        <div id="bottom-left" class="position-element corner">
          📍 Bottom Left
        </div>
        <div id="bottom-center" class="position-element center">
          📍 Bottom Center
        </div>
        <div id="bottom-right" class="position-element corner">
          📍 Bottom Right
        </div>
      </div>
    </div>

    <!-- Current Demo Info -->
    <div v-if="currentMode" class="demo-info">
      <h3>{{ currentMode.icon }} {{ currentMode.name }}</h3>
      <p>{{ currentMode.description }}</p>
      <div class="demo-controls">
        <button @click="stopTour" :disabled="!showTour" class="control-btn">
          ⏹️ Stop Demo
        </button>
      </div>
    </div>

    <!-- MintCoachMark Component -->
    <MintCoachMark
      v-model="showTour"
      :steps="currentSteps"
      :config="config"
      @tour-complete="onTourComplete"
      @step-change="onStepChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MintCoachMark } from 'mint-coach-mark'
import type { CoachMarkStep, CoachMarkConfig } from 'mint-coach-mark'
import 'mint-coach-mark/dist/style.css'

// Reactive state
const showTour = ref(false)
const currentMode = ref<PositioningMode | null>(null)

// Positioning mode interface
interface PositioningMode {
  id: string
  name: string
  icon: string
  description: string
  steps: CoachMarkStep[]
}

// Positioning modes
const positioningModes: PositioningMode[] = [
  {
    id: 'basic-sides',
    name: 'Basic Sides',
    icon: '🧭',
    description: 'Demonstrates basic positioning on all four sides (top, right, bottom, left)',
    steps: [
      {
        element: '#top-center',
        popover: {
          title: 'Top Positioning',
          description: 'This popover is positioned below the element (side: bottom)',
          side: 'bottom'
        }
      },
      {
        element: '#right-center',
        popover: {
          title: 'Right Positioning',
          description: 'This popover is positioned to the left of the element (side: left)',
          side: 'left'
        }
      },
      {
        element: '#bottom-center',
        popover: {
          title: 'Bottom Positioning',
          description: 'This popover is positioned above the element (side: top)',
          side: 'top'
        }
      },
      {
        element: '#left-center',
        popover: {
          title: 'Left Positioning',
          description: 'This popover is positioned to the right of the element (side: right)',
          side: 'right'
        }
      }
    ]
  },
  {
    id: 'collision-detection',
    name: 'Collision Detection',
    icon: '🎯',
    description: 'Shows how popovers automatically adjust when they would go off-screen',
    steps: [
      {
        element: '#top-left',
        popover: {
          title: 'Corner Element',
          description: 'This element is in the top-left corner. The popover automatically adjusts to stay visible.',
          side: 'top' // Will auto-adjust to bottom
        }
      },
      {
        element: '#top-right',
        popover: {
          title: 'Top Right Corner',
          description: 'Another corner element where the popover finds the best position.',
          side: 'right' // Will auto-adjust
        }
      },
      {
        element: '#bottom-left',
        popover: {
          title: 'Bottom Left Corner',
          description: 'The popover intelligently positions itself to remain fully visible.',
          side: 'left' // Will auto-adjust
        }
      },
      {
        element: '#bottom-right',
        popover: {
          title: 'Bottom Right Corner',
          description: 'Even in tight corners, the popover finds the optimal position.',
          side: 'bottom' // Will auto-adjust to top
        }
      }
    ]
  },
  {
    id: 'over-positioning',
    name: 'Over Positioning',
    icon: '🎪',
    description: 'Modal-like positioning that centers the popover over the element',
    steps: [
      {
        element: '#center-element',
        popover: {
          title: 'Over Positioning',
          description: 'This popover is positioned directly over the element, creating a modal-like experience.',
          side: 'over'
        }
      },
      {
        element: '#grid-1',
        popover: {
          title: 'Small Element Over',
          description: 'Over positioning works with elements of any size.',
          side: 'over'
        }
      }
    ]
  },
  {
    id: 'smart-positioning',
    name: 'Smart Positioning',
    icon: '🧠',
    description: 'Demonstrates intelligent positioning that adapts to available space',
    steps: [
      {
        element: '#grid-1',
        popover: {
          title: 'Preferred: Top',
          description: 'This popover prefers top positioning but will adjust if needed.',
          side: 'top'
        }
      },
      {
        element: '#grid-2',
        popover: {
          title: 'Preferred: Right',
          description: 'This popover prefers right positioning with automatic fallback.',
          side: 'right'
        }
      },
      {
        element: '#grid-3',
        popover: {
          title: 'Preferred: Bottom',
          description: 'This popover prefers bottom positioning but adapts as needed.',
          side: 'bottom'
        }
      },
      {
        element: '#grid-4',
        popover: {
          title: 'Preferred: Left',
          description: 'This popover prefers left positioning with smart adjustments.',
          side: 'left'
        }
      }
    ]
  }
]

// Current steps based on selected mode
const currentSteps = computed(() => currentMode.value?.steps || [])

// Tour configuration
const config: CoachMarkConfig = {
  animate: true,
  allowClose: true,
  showProgress: true,
  stagePadding: 10,
  stageRadius: 8,
  overlayOpacity: 0.7,
  smoothScroll: true,
  popoverOffset: 15
}

// Event handlers
function startPositioningDemo(mode: PositioningMode) {
  currentMode.value = mode
  showTour.value = true
}

function stopTour() {
  showTour.value = false
  currentMode.value = null
}

function onTourComplete() {
  console.log('🎉 Positioning demo completed!')
  currentMode.value = null
}

function onStepChange(step: CoachMarkStep, index: number) {
  console.log(`📍 Step ${index + 1}: ${step.popover?.title}`)
}
</script>

<style scoped>
.positioning {
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

/* Positioning Controls */
.positioning-controls {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.positioning-controls h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  color: #333;
}

.control-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.control-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Demo Layout */
.demo-layout {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

/* Edge Sections */
.edge-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.top-edge,
.bottom-edge {
  justify-content: space-around;
}

.left-edge,
.right-edge {
  flex-direction: column;
  justify-content: space-around;
  height: 300px;
}

/* Middle Section */
.middle-section {
  display: flex;
  flex: 1;
  align-items: stretch;
  gap: 2rem;
}

/* Center Content */
.center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 300px;
}

/* Position Elements */
.position-element {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.position-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.position-element.corner {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.position-element.center {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.position-element.large {
  padding: 2rem;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.position-element.large p {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.position-element.small {
  padding: 0.75rem;
  font-size: 0.875rem;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

/* Demo Info */
.demo-info {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.demo-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #1565c0;
}

.demo-info p {
  margin: 0 0 1rem 0;
  color: #1976d2;
  line-height: 1.5;
}

.demo-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .middle-section {
    flex-direction: column;
    gap: 1rem;
  }

  .left-edge,
  .right-edge {
    flex-direction: row;
    height: auto;
    justify-content: space-around;
  }

  .content-grid {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .control-buttons {
    flex-direction: column;
    align-items: center;
  }

  .control-btn {
    width: 100%;
    max-width: 300px;
  }

  .demo-layout {
    padding: 1rem;
    min-height: 400px;
  }

  .edge-section {
    flex-direction: column;
    gap: 1rem;
  }

  .position-element {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .position-element.large {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .demo-layout {
    padding: 0.5rem;
  }

  .position-element {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .position-element.large {
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>
