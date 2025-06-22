<template>
  <div class="theming">
    <!-- Header -->
    <div class="page-header">
      <h1>🎭 Custom Theming Demo</h1>
      <p>
        This demo showcases different themes and styling options for MintCoachMark.
        Switch between themes to see how CSS custom properties can transform the appearance.
      </p>
    </div>

    <!-- Theme Selector -->
    <div class="theme-selector">
      <h3>🎨 Choose a Theme:</h3>
      <div class="theme-buttons">
        <button 
          v-for="theme in themes" 
          :key="theme.id"
          @click="applyTheme(theme)"
          class="theme-btn"
          :class="{ active: currentTheme?.id === theme.id }"
          :style="{ 
            background: theme.preview.primary,
            color: theme.preview.text 
          }"
        >
          {{ theme.icon }} {{ theme.name }}
        </button>
      </div>
    </div>

    <!-- Current Theme Info -->
    <div v-if="currentTheme" class="theme-info">
      <h3>{{ currentTheme.icon }} {{ currentTheme.name }}</h3>
      <p>{{ currentTheme.description }}</p>
      
      <div class="theme-preview">
        <div class="color-palette">
          <div 
            v-for="(color, name) in currentTheme.preview" 
            :key="name"
            class="color-swatch"
            :style="{ backgroundColor: color }"
            :title="`${name}: ${color}`"
          >
            <span class="color-name">{{ name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Content -->
    <div class="demo-content">
      <div class="content-section">
        <div id="theme-header" class="demo-header">
          <h2>🎪 Themed Application</h2>
          <p>This is a sample application with themed coach marks</p>
        </div>

        <div class="demo-features">
          <div id="theme-feature-1" class="feature-box">
            <div class="feature-icon">🚀</div>
            <h4>Performance</h4>
            <p>Lightning fast performance with optimized rendering</p>
          </div>

          <div id="theme-feature-2" class="feature-box">
            <div class="feature-icon">🔒</div>
            <h4>Security</h4>
            <p>Enterprise-grade security with advanced encryption</p>
          </div>

          <div id="theme-feature-3" class="feature-box">
            <div class="feature-icon">📱</div>
            <h4>Mobile Ready</h4>
            <p>Responsive design that works on all devices</p>
          </div>

          <div id="theme-feature-4" class="feature-box">
            <div class="feature-icon">🎨</div>
            <h4>Customizable</h4>
            <p>Fully customizable themes and styling options</p>
          </div>
        </div>

        <div id="theme-actions" class="demo-actions">
          <button class="action-btn primary">Get Started</button>
          <button class="action-btn secondary">Learn More</button>
          <button class="action-btn outline">Contact Us</button>
        </div>
      </div>
    </div>

    <!-- Tour Controls -->
    <div class="tour-controls">
      <button @click="startThemedTour" :disabled="showTour || !currentTheme" class="control-btn primary">
        🎭 Start Themed Tour
      </button>
      <button @click="stopTour" :disabled="!showTour" class="control-btn">
        ⏹️ Stop Tour
      </button>
    </div>

    <!-- MintCoachMark Component -->
    <MintCoachMark
      v-model="showTour"
      :steps="steps"
      :config="config"
      @tour-complete="onTourComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { MintCoachMark } from 'mint-coach-mark'
import type { CoachMarkStep, CoachMarkConfig } from 'mint-coach-mark'
import 'mint-coach-mark/dist/style.css'

// Theme interface
interface Theme {
  id: string
  name: string
  icon: string
  description: string
  preview: {
    primary: string
    secondary: string
    background: string
    text: string
    accent: string
  }
  cssVariables: Record<string, string>
}

// Reactive state
const showTour = ref(false)
const currentTheme = ref<Theme | null>(null)

// Available themes
const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    icon: '🌟',
    description: 'The default MintCoachMark theme with clean, modern styling.',
    preview: {
      primary: '#667eea',
      secondary: '#764ba2',
      background: '#ffffff',
      text: '#2d2d2d',
      accent: '#f093fb'
    },
    cssVariables: {
      '--mint-coach-mark-overlay-color': '#000',
      '--mint-coach-mark-overlay-opacity': '0.7',
      '--mint-coach-mark-popover-bg': '#ffffff',
      '--mint-coach-mark-popover-color': '#2d2d2d',
      '--mint-coach-mark-button-bg': '#667eea',
      '--mint-coach-mark-button-color': '#ffffff',
      '--mint-coach-mark-button-hover-bg': '#5a67d8'
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    icon: '🌙',
    description: 'A sleek dark theme perfect for modern applications.',
    preview: {
      primary: '#4fd1c7',
      secondary: '#38b2ac',
      background: '#1a202c',
      text: '#e2e8f0',
      accent: '#ed8936'
    },
    cssVariables: {
      '--mint-coach-mark-overlay-color': '#000',
      '--mint-coach-mark-overlay-opacity': '0.8',
      '--mint-coach-mark-popover-bg': '#2d3748',
      '--mint-coach-mark-popover-color': '#e2e8f0',
      '--mint-coach-mark-button-bg': '#4fd1c7',
      '--mint-coach-mark-button-color': '#1a202c',
      '--mint-coach-mark-button-hover-bg': '#38b2ac',
      '--mint-coach-mark-popover-shadow': '0 4px 20px rgba(0, 0, 0, 0.6)'
    }
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌿',
    description: 'Earth-inspired colors with natural, organic feel.',
    preview: {
      primary: '#48bb78',
      secondary: '#38a169',
      background: '#f7fafc',
      text: '#2d3748',
      accent: '#ed8936'
    },
    cssVariables: {
      '--mint-coach-mark-overlay-color': '#2f855a',
      '--mint-coach-mark-overlay-opacity': '0.6',
      '--mint-coach-mark-popover-bg': '#f7fafc',
      '--mint-coach-mark-popover-color': '#2d3748',
      '--mint-coach-mark-button-bg': '#48bb78',
      '--mint-coach-mark-button-color': '#ffffff',
      '--mint-coach-mark-button-hover-bg': '#38a169',
      '--mint-coach-mark-popover-border-radius': '12px'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: '🌅',
    description: 'Warm sunset colors creating a vibrant, energetic feel.',
    preview: {
      primary: '#f093fb',
      secondary: '#f5576c',
      background: '#fffaf0',
      text: '#744210',
      accent: '#ed8936'
    },
    cssVariables: {
      '--mint-coach-mark-overlay-color': '#c53030',
      '--mint-coach-mark-overlay-opacity': '0.5',
      '--mint-coach-mark-popover-bg': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      '--mint-coach-mark-popover-color': '#ffffff',
      '--mint-coach-mark-button-bg': '#ffffff',
      '--mint-coach-mark-button-color': '#f5576c',
      '--mint-coach-mark-button-hover-bg': '#f7fafc',
      '--mint-coach-mark-popover-border-radius': '16px'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    description: 'Cool ocean blues with a calm, professional appearance.',
    preview: {
      primary: '#4299e1',
      secondary: '#3182ce',
      background: '#ebf8ff',
      text: '#2a4365',
      accent: '#00b5d8'
    },
    cssVariables: {
      '--mint-coach-mark-overlay-color': '#2b6cb0',
      '--mint-coach-mark-overlay-opacity': '0.7',
      '--mint-coach-mark-popover-bg': '#ebf8ff',
      '--mint-coach-mark-popover-color': '#2a4365',
      '--mint-coach-mark-button-bg': '#4299e1',
      '--mint-coach-mark-button-color': '#ffffff',
      '--mint-coach-mark-button-hover-bg': '#3182ce',
      '--mint-coach-mark-popover-shadow': '0 8px 30px rgba(66, 153, 225, 0.3)'
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: '⚡',
    description: 'High-contrast neon theme with electric energy.',
    preview: {
      primary: '#00ff88',
      secondary: '#ff0080',
      background: '#0a0a0a',
      text: '#ffffff',
      accent: '#ffff00'
    },
    cssVariables: {
      '--mint-coach-mark-overlay-color': '#000',
      '--mint-coach-mark-overlay-opacity': '0.9',
      '--mint-coach-mark-popover-bg': '#0a0a0a',
      '--mint-coach-mark-popover-color': '#ffffff',
      '--mint-coach-mark-button-bg': '#00ff88',
      '--mint-coach-mark-button-color': '#000000',
      '--mint-coach-mark-button-hover-bg': '#00cc6a',
      '--mint-coach-mark-popover-shadow': '0 0 30px rgba(0, 255, 136, 0.5)',
      '--mint-coach-mark-popover-border-radius': '8px'
    }
  }
]

// Tour steps
const steps: CoachMarkStep[] = [
  {
    element: '#theme-header',
    popover: {
      title: '🎭 Themed Welcome',
      description: 'Welcome to the themed tour! Notice how the popover styling matches the selected theme.',
      side: 'bottom'
    }
  },
  {
    element: '#theme-feature-1',
    popover: {
      title: '🚀 Performance Feature',
      description: 'This feature showcases performance capabilities with themed styling.',
      side: 'top'
    }
  },
  {
    element: '#theme-feature-2',
    popover: {
      title: '🔒 Security Feature',
      description: 'Security is paramount, and the theme reflects trustworthiness.',
      side: 'top'
    }
  },
  {
    element: '#theme-feature-3',
    popover: {
      title: '📱 Mobile Feature',
      description: 'Responsive design that adapts to any screen size.',
      side: 'bottom'
    }
  },
  {
    element: '#theme-feature-4',
    popover: {
      title: '🎨 Customization',
      description: 'Full customization capabilities as demonstrated by this themed tour.',
      side: 'bottom'
    }
  },
  {
    element: '#theme-actions',
    popover: {
      title: '🎯 Call to Action',
      description: 'These action buttons complete the themed experience.',
      side: 'top'
    }
  }
]

// Tour configuration
const config: CoachMarkConfig = {
  animate: true,
  allowClose: true,
  showProgress: true,
  stagePadding: 12,
  stageRadius: 12,
  overlayOpacity: 0.75,
  smoothScroll: true
}

// Event handlers
function applyTheme(theme: Theme) {
  currentTheme.value = theme
  
  // Apply CSS custom properties
  const root = document.documentElement
  Object.entries(theme.cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}

function startThemedTour() {
  if (!currentTheme.value) return
  showTour.value = true
}

function stopTour() {
  showTour.value = false
}

function onTourComplete() {
  console.log(`🎉 Themed tour completed with ${currentTheme.value?.name} theme!`)
}

// Initialize with default theme
onMounted(() => {
  applyTheme(themes[0])
})

// Cleanup on unmount
onUnmounted(() => {
  // Reset to default theme
  const root = document.documentElement
  Object.keys(themes[0].cssVariables).forEach(property => {
    root.style.removeProperty(property)
  })
})
</script>

<style scoped>
.theming {
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

/* Theme Selector */
.theme-selector {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.theme-selector h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.theme-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.theme-btn {
  padding: 1rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.theme-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.theme-btn.active {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.theme-btn.active::after {
  content: '✓';
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Theme Info */
.theme-info {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.theme-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.theme-info p {
  margin: 0 0 1.5rem 0;
  color: #666;
  line-height: 1.5;
}

.theme-preview {
  display: flex;
  justify-content: center;
}

.color-palette {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.color-swatch {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: end;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-name {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px 4px 0 0;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

/* Demo Content */
.demo-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.content-section {
  max-width: 800px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.demo-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: #333;
}

.demo-header p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.demo-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-box {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
}

.feature-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-box h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.feature-box p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.demo-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.action-btn.primary:hover {
  background: #5a67d8;
  border-color: #5a67d8;
}

.action-btn.secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.action-btn.secondary:hover {
  background: #5a6268;
  border-color: #5a6268;
}

.action-btn.outline {
  background: transparent;
  color: #667eea;
  border-color: #667eea;
}

.action-btn.outline:hover {
  background: #667eea;
  color: white;
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

/* Responsive Design */
@media (max-width: 768px) {
  .theme-buttons {
    grid-template-columns: repeat(2, 1fr);
  }

  .color-palette {
    gap: 0.25rem;
  }

  .color-swatch {
    width: 40px;
    height: 40px;
  }

  .color-name {
    font-size: 0.625rem;
    padding: 0.125rem 0.25rem;
  }

  .demo-features {
    grid-template-columns: 1fr;
  }

  .demo-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }

  .tour-controls {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .theme-buttons {
    grid-template-columns: 1fr;
  }

  .theme-btn {
    padding: 0.75rem 1rem;
  }
}
</style>
