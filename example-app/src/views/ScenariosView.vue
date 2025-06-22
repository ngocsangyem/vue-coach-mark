<template>
  <div class="scenarios">
    <!-- Header -->
    <div class="page-header">
      <h1>🌟 Real-world Scenarios</h1>
      <p>
        Explore practical applications of MintCoachMark in real-world scenarios including
        user onboarding, feature announcements, help systems, and interactive tutorials.
      </p>
    </div>

    <!-- Scenario Selector -->
    <div class="scenario-selector">
      <h3>📋 Choose a Scenario:</h3>
      <div class="scenario-grid">
        <div 
          v-for="scenario in scenarios" 
          :key="scenario.id"
          @click="selectScenario(scenario)"
          class="scenario-card"
          :class="{ active: currentScenario?.id === scenario.id }"
        >
          <div class="scenario-icon">{{ scenario.icon }}</div>
          <h4>{{ scenario.name }}</h4>
          <p>{{ scenario.description }}</p>
          <div class="scenario-meta">
            <span class="step-count">{{ scenario.steps.length }} steps</span>
            <span class="duration">~{{ scenario.estimatedDuration }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Scenario Info -->
    <div v-if="currentScenario" class="scenario-info">
      <div class="scenario-header">
        <h3>{{ currentScenario.icon }} {{ currentScenario.name }}</h3>
        <div class="scenario-controls">
          <button @click="startScenario" :disabled="showTour" class="control-btn primary">
            ▶️ Start {{ currentScenario.name }}
          </button>
          <button @click="stopTour" :disabled="!showTour" class="control-btn">
            ⏹️ Stop
          </button>
        </div>
      </div>
      <p>{{ currentScenario.fullDescription }}</p>
      
      <div class="scenario-features">
        <h4>🎯 What you'll learn:</h4>
        <ul>
          <li v-for="feature in currentScenario.features" :key="feature">{{ feature }}</li>
        </ul>
      </div>
    </div>

    <!-- Demo Application -->
    <div class="demo-app">
      <!-- App Header -->
      <header id="app-header" class="app-header">
        <div class="header-content">
          <div class="logo">
            <span id="app-logo">🚀 ProductApp</span>
          </div>
          <nav class="main-nav">
            <a href="#" id="nav-dashboard" class="nav-item active">Dashboard</a>
            <a href="#" id="nav-projects" class="nav-item">Projects</a>
            <a href="#" id="nav-team" class="nav-item">Team</a>
            <a href="#" id="nav-reports" class="nav-item">Reports</a>
          </nav>
          <div class="header-actions">
            <button id="notifications-btn" class="header-btn">
              🔔 <span class="badge">3</span>
            </button>
            <button id="help-btn" class="header-btn">❓</button>
            <div id="user-menu" class="user-menu">
              <img src="https://via.placeholder.com/32" alt="User" class="user-avatar" />
              <span>John Doe</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="app-main">
        <!-- Sidebar -->
        <aside id="app-sidebar" class="app-sidebar">
          <div class="sidebar-section">
            <h4>Quick Actions</h4>
            <button id="create-project-btn" class="sidebar-btn">
              ➕ New Project
            </button>
            <button id="invite-team-btn" class="sidebar-btn">
              👥 Invite Team
            </button>
            <button id="upload-file-btn" class="sidebar-btn">
              📁 Upload File
            </button>
          </div>
          
          <div class="sidebar-section">
            <h4>Recent</h4>
            <div id="recent-items" class="recent-list">
              <div class="recent-item">📄 Project Alpha</div>
              <div class="recent-item">📊 Q4 Report</div>
              <div class="recent-item">👥 Team Meeting</div>
            </div>
          </div>
        </aside>

        <!-- Content Area -->
        <section class="content-area">
          <div id="welcome-banner" class="welcome-banner">
            <h2>Welcome to ProductApp! 👋</h2>
            <p>Get started by exploring the features below.</p>
          </div>

          <div class="dashboard-grid">
            <div id="stats-widget" class="widget stats-widget">
              <h3>📊 Statistics</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-value">24</span>
                  <span class="stat-label">Projects</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">156</span>
                  <span class="stat-label">Tasks</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">8</span>
                  <span class="stat-label">Team Members</span>
                </div>
              </div>
            </div>

            <div id="activity-widget" class="widget activity-widget">
              <h3>📈 Recent Activity</h3>
              <div class="activity-list">
                <div class="activity-item">
                  <span class="activity-icon">✅</span>
                  <span>Task completed: Design Review</span>
                </div>
                <div class="activity-item">
                  <span class="activity-icon">👥</span>
                  <span>New team member joined</span>
                </div>
                <div class="activity-item">
                  <span class="activity-icon">📁</span>
                  <span>File uploaded: mockups.zip</span>
                </div>
              </div>
            </div>

            <div id="tasks-widget" class="widget tasks-widget">
              <h3>✅ Your Tasks</h3>
              <div class="task-list">
                <div class="task-item">
                  <input type="checkbox" />
                  <span>Review project proposal</span>
                </div>
                <div class="task-item">
                  <input type="checkbox" />
                  <span>Update team documentation</span>
                </div>
                <div class="task-item">
                  <input type="checkbox" checked />
                  <span>Prepare presentation slides</span>
                </div>
              </div>
            </div>

            <div id="quick-actions-widget" class="widget quick-actions-widget">
              <h3>⚡ Quick Actions</h3>
              <div class="action-buttons">
                <button class="action-btn">📝 Create Task</button>
                <button class="action-btn">📅 Schedule Meeting</button>
                <button class="action-btn">📤 Send Report</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- MintCoachMark Component -->
    <MintCoachMark
      v-model="showTour"
      :steps="currentSteps"
      :config="currentConfig"
      @tour-complete="onTourComplete"
      @step-change="onStepChange"
    >
      <!-- Custom content for different scenarios -->
      <template #content="{ step, index }">
        <div v-if="step.customContent" class="custom-scenario-content">
          <p>{{ step.popover?.description }}</p>
          
          <!-- Onboarding specific content -->
          <div v-if="currentScenario?.id === 'onboarding' && step.customContent === 'welcome'">
            <div class="welcome-checklist">
              <h4>✅ Getting Started Checklist:</h4>
              <ul>
                <li>✅ Account created</li>
                <li>⏳ Complete profile setup</li>
                <li>⏳ Invite team members</li>
                <li>⏳ Create first project</li>
              </ul>
            </div>
          </div>

          <!-- Feature announcement content -->
          <div v-if="currentScenario?.id === 'feature-announcement' && step.customContent === 'new-feature'">
            <div class="feature-highlight">
              <div class="feature-badge">🆕 NEW</div>
              <h4>Enhanced Analytics Dashboard</h4>
              <ul>
                <li>📊 Real-time data visualization</li>
                <li>📈 Advanced filtering options</li>
                <li>📤 Export capabilities</li>
              </ul>
            </div>
          </div>

          <!-- Help system content -->
          <div v-if="currentScenario?.id === 'help-system' && step.customContent === 'help'">
            <div class="help-content">
              <h4>💡 Pro Tip:</h4>
              <p>Use keyboard shortcuts to navigate faster:</p>
              <div class="keyboard-shortcuts">
                <kbd>Ctrl</kbd> + <kbd>N</kbd> - New Project<br>
                <kbd>Ctrl</kbd> + <kbd>K</kbd> - Quick Search<br>
                <kbd>?</kbd> - Show all shortcuts
              </div>
            </div>
          </div>
        </div>
        
        <div v-else>
          <p>{{ step.popover?.description }}</p>
        </div>
      </template>
    </MintCoachMark>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MintCoachMark } from 'mint-coach-mark'
import type { CoachMarkStep, CoachMarkConfig } from 'mint-coach-mark'
import 'mint-coach-mark/dist/style.css'

// Extended step interface for scenarios
interface ScenarioStep extends CoachMarkStep {
  customContent?: string
}

// Scenario interface
interface Scenario {
  id: string
  name: string
  icon: string
  description: string
  fullDescription: string
  features: string[]
  estimatedDuration: string
  steps: ScenarioStep[]
  config: Partial<CoachMarkConfig>
}

// Reactive state
const showTour = ref(false)
const currentScenario = ref<Scenario | null>(null)

// Available scenarios
const scenarios: Scenario[] = [
  {
    id: 'onboarding',
    name: 'User Onboarding',
    icon: '🎯',
    description: 'Guide new users through their first experience',
    fullDescription: 'A comprehensive onboarding flow that introduces new users to key features and helps them get started quickly.',
    features: [
      'Welcome message with progress tracking',
      'Step-by-step feature introduction',
      'Interactive elements and calls-to-action',
      'Completion celebration and next steps'
    ],
    estimatedDuration: '3-4 min',
    steps: [
      {
        element: '#welcome-banner',
        customContent: 'welcome',
        popover: {
          title: '🎉 Welcome to ProductApp!',
          description: 'Welcome! Let\'s take a quick tour to get you started with ProductApp.',
          side: 'bottom',
          showButtons: ['next', 'close']
        }
      },
      {
        element: '#app-sidebar',
        popover: {
          title: '🚀 Quick Actions Sidebar',
          description: 'This sidebar contains quick actions for common tasks like creating projects and inviting team members.',
          side: 'right'
        }
      },
      {
        element: '#create-project-btn',
        popover: {
          title: '➕ Create Your First Project',
          description: 'Start by creating your first project. This will be your workspace for organizing tasks and collaborating with your team.',
          side: 'right'
        }
      },
      {
        element: '#stats-widget',
        popover: {
          title: '📊 Dashboard Overview',
          description: 'Your dashboard shows key statistics and metrics. As you use the app, you\'ll see your progress here.',
          side: 'top'
        }
      },
      {
        element: '#user-menu',
        popover: {
          title: '👤 Your Profile',
          description: 'Access your profile settings, preferences, and account information from here.',
          side: 'bottom',
          doneBtnText: 'Get Started!'
        }
      }
    ],
    config: {
      showProgress: true,
      progressText: 'Welcome Step {{current}} of {{total}}',
      overlayOpacity: 0.8
    }
  },
  {
    id: 'feature-announcement',
    name: 'Feature Announcement',
    icon: '🆕',
    description: 'Announce new features to existing users',
    fullDescription: 'Highlight new features and improvements to keep users engaged and informed about product updates.',
    features: [
      'Eye-catching new feature badges',
      'Clear benefit explanations',
      'Interactive demonstrations',
      'Encouragement to try new features'
    ],
    estimatedDuration: '2-3 min',
    steps: [
      {
        element: '#stats-widget',
        customContent: 'new-feature',
        popover: {
          title: '🆕 Enhanced Analytics!',
          description: 'We\'ve completely redesigned the analytics dashboard with powerful new features.',
          side: 'top'
        }
      },
      {
        element: '#activity-widget',
        popover: {
          title: '📈 Real-time Updates',
          description: 'Activity feeds now update in real-time, so you never miss important team updates.',
          side: 'top'
        }
      },
      {
        element: '#notifications-btn',
        popover: {
          title: '🔔 Smart Notifications',
          description: 'Our new notification system is smarter and less intrusive, showing only what matters to you.',
          side: 'bottom'
        }
      }
    ],
    config: {
      showProgress: false,
      overlayOpacity: 0.6,
      stageRadius: 12
    }
  },
  {
    id: 'help-system',
    name: 'Contextual Help',
    icon: '❓',
    description: 'Provide contextual help and tips',
    fullDescription: 'Offer contextual help and pro tips to help users discover advanced features and work more efficiently.',
    features: [
      'Context-aware help content',
      'Keyboard shortcuts and tips',
      'Best practices and recommendations',
      'Progressive disclosure of advanced features'
    ],
    estimatedDuration: '2 min',
    steps: [
      {
        element: '#help-btn',
        popover: {
          title: '❓ Need Help?',
          description: 'Click here anytime to access help documentation, tutorials, and support.',
          side: 'bottom'
        }
      },
      {
        element: '#quick-actions-widget',
        customContent: 'help',
        popover: {
          title: '⚡ Quick Actions Pro Tips',
          description: 'These quick actions can save you time on common tasks.',
          side: 'top'
        }
      },
      {
        element: '#nav-dashboard',
        popover: {
          title: '🧭 Navigation Tips',
          description: 'Use the main navigation to switch between different sections. Each section has its own set of tools and features.',
          side: 'bottom'
        }
      }
    ],
    config: {
      showProgress: false,
      allowClose: true,
      overlayOpacity: 0.5
    }
  },
  {
    id: 'interactive-tutorial',
    name: 'Interactive Tutorial',
    icon: '🎓',
    description: 'Hands-on learning with interactive elements',
    fullDescription: 'An interactive tutorial that guides users through actual tasks and workflows with hands-on practice.',
    features: [
      'Step-by-step task completion',
      'Interactive form filling',
      'Real workflow simulation',
      'Achievement tracking and rewards'
    ],
    estimatedDuration: '5-7 min',
    steps: [
      {
        element: '#create-project-btn',
        popover: {
          title: '🎓 Tutorial: Create a Project',
          description: 'Let\'s create your first project together. Click this button to start.',
          side: 'right',
          showButtons: ['next']
        }
      },
      {
        element: '#invite-team-btn',
        popover: {
          title: '👥 Tutorial: Invite Team Members',
          description: 'Now let\'s invite some team members to collaborate on your project.',
          side: 'right'
        }
      },
      {
        element: '#tasks-widget',
        popover: {
          title: '✅ Tutorial: Manage Tasks',
          description: 'This is where you\'ll manage your tasks. Try checking off a completed task.',
          side: 'top'
        }
      },
      {
        element: '#activity-widget',
        popover: {
          title: '📈 Tutorial: Track Progress',
          description: 'Monitor your team\'s activity and progress in this widget.',
          side: 'top'
        }
      },
      {
        element: '#app-header',
        popover: {
          title: '🎉 Tutorial Complete!',
          description: 'Congratulations! You\'ve completed the interactive tutorial. You\'re ready to start using ProductApp effectively.',
          side: 'bottom',
          doneBtnText: 'Start Working!'
        }
      }
    ],
    config: {
      showProgress: true,
      progressText: 'Tutorial {{current}}/{{total}}',
      allowClose: false,
      overlayOpacity: 0.75
    }
  }
]

// Computed properties
const currentSteps = computed(() => currentScenario.value?.steps || [])
const currentConfig = computed<CoachMarkConfig>(() => ({
  animate: true,
  allowClose: true,
  showProgress: true,
  stagePadding: 10,
  stageRadius: 8,
  overlayOpacity: 0.7,
  smoothScroll: true,
  ...currentScenario.value?.config
}))

// Event handlers
function selectScenario(scenario: Scenario) {
  currentScenario.value = scenario
}

function startScenario() {
  if (!currentScenario.value) return
  showTour.value = true
}

function stopTour() {
  showTour.value = false
}

function onTourComplete() {
  console.log(`🎉 ${currentScenario.value?.name} scenario completed!`)
}

function onStepChange(step: CoachMarkStep, index: number) {
  console.log(`📍 ${currentScenario.value?.name} - Step ${index + 1}: ${step.popover?.title}`)
}
</script>

<style scoped>
.scenarios {
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

/* Scenario Selector */
.scenario-selector {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.scenario-selector h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #333;
  text-align: center;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.scenario-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  text-align: center;
}

.scenario-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.scenario-card.active {
  background: #667eea;
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.scenario-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.scenario-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.scenario-card p {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.8;
}

.scenario-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 500;
}

/* Scenario Info */
.scenario-info {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.scenario-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.scenario-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
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

.scenario-info p {
  margin: 0 0 1.5rem 0;
  color: #666;
  line-height: 1.6;
}

.scenario-features h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #333;
}

.scenario-features ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
}

.scenario-features li {
  margin-bottom: 0.25rem;
}

/* Demo App */
.demo-app {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

/* App Header */
.app-header {
  background: #667eea;
  color: white;
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
}

.main-nav {
  display: flex;
  gap: 1rem;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(255, 255, 255, 0.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
  position: relative;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.user-menu:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

/* App Main */
.app-main {
  display: flex;
  min-height: 600px;
}

/* App Sidebar */
.app-sidebar {
  width: 250px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  padding: 1.5rem;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section h4 {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-btn {
  width: 100%;
  padding: 0.75rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  text-align: left;
  transition: all 0.2s;
}

.sidebar-btn:hover {
  background: #f8f9fa;
  border-color: #ccc;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-item {
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #666;
  cursor: pointer;
  transition: background 0.2s;
}

.recent-item:hover {
  background: #f8f9fa;
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 1.5rem;
}

.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-banner h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.welcome-banner p {
  margin: 0;
  opacity: 0.9;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.widget {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.widget h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activity-list,
.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item,
.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  font-size: 0.875rem;
}

.activity-icon {
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #5a67d8;
}

/* Custom Scenario Content */
.custom-scenario-content {
  margin-top: 1rem;
}

.welcome-checklist h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #333;
}

.welcome-checklist ul {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.875rem;
}

.feature-highlight {
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.feature-badge {
  background: #4caf50;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.feature-highlight h4 {
  margin: 0 0 0.5rem 0;
  color: #1565c0;
}

.feature-highlight ul {
  margin: 0;
  padding-left: 1rem;
  color: #1976d2;
}

.help-content h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.keyboard-shortcuts {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.keyboard-shortcuts kbd {
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.75rem;
  border: 1px solid #ced4da;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .app-main {
    flex-direction: column;
  }

  .app-sidebar {
    width: 100%;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .main-nav {
    order: 3;
  }
}

@media (max-width: 768px) {
  .scenario-grid {
    grid-template-columns: 1fr;
  }

  .scenario-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-wrap: wrap;
  }

  .main-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
