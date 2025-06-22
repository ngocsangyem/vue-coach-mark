<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Sidebar state
const sidebarOpen = ref(true)
const isMobile = ref(false)

// Navigation item type
interface NavigationItem {
  name: string
  path: string
  icon: string
  component?: string
  description?: string
}

interface NavigationCategory {
  title: string
  items: NavigationItem[]
}

// Navigation categories with organized demo pages
const navigationCategories: NavigationCategory[] = [
  {
    title: 'Getting Started',
    items: [
      { 
        name: 'Home', 
        path: '/', 
        icon: '🏠',
        description: 'Welcome and overview'
      }
    ]
  },
  {
    title: 'Basic Features',
    items: [
      { 
        name: 'Basic Tour', 
        path: '/basic-tour', 
        icon: '🎯', 
        component: 'MintPopover',
        description: 'Simple step-by-step tour'
      },
      { 
        name: 'Custom Content', 
        path: '/custom-content', 
        icon: '🎨', 
        component: 'MintPopover',
        description: 'Rich HTML content in popovers'
      },
      { 
        name: 'Positioning', 
        path: '/positioning', 
        icon: '📍', 
        component: 'MintPopover',
        description: 'Popover placement options'
      }
    ]
  },
  {
    title: 'Advanced Features',
    items: [
      {
        name: 'Padding & Radius',
        path: '/padding-radius',
        icon: '📐',
        component: 'MintPopover',
        description: 'Element highlighting customization'
      },
      { 
        name: 'Programmatic', 
        path: '/programmatic', 
        icon: '⚙️', 
        component: 'MintPopover',
        description: 'API-driven tour control'
      },
      { 
        name: 'Theming', 
        path: '/theming', 
        icon: '🎭', 
        component: 'MintPopover',
        description: 'Custom styling and themes'
      }
    ]
  },
  {
    title: 'Testing & Scenarios',
    items: [
      { 
        name: 'Scenarios', 
        path: '/scenarios', 
        icon: '🌟', 
        component: 'MintPopover',
        description: 'Real-world use cases'
      },
      { 
        name: 'Popover Test', 
        path: '/popover-test', 
        icon: '🔧', 
        component: 'MintPopover',
        description: 'Persistence and behavior testing'
      }
    ]
  }
]

// Sidebar functions
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

function onNavLinkClick() {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

// Responsive handling
function checkMobile() {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    sidebarOpen.value = false
  } else {
    sidebarOpen.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="app-layout">
    <!-- Mobile Header -->
    <header class="mobile-header" v-if="isMobile">
      <button @click="toggleSidebar" class="hamburger-btn" aria-label="Toggle navigation">
        <span class="hamburger-line" :class="{ 'hamburger-line--active': sidebarOpen }"></span>
        <span class="hamburger-line" :class="{ 'hamburger-line--active': sidebarOpen }"></span>
        <span class="hamburger-line" :class="{ 'hamburger-line--active': sidebarOpen }"></span>
      </button>
      <div class="mobile-brand">
        <h1>🎯 Mint Coach Mark</h1>
        <span class="mobile-tagline">Demo Gallery</span>
      </div>
    </header>

    <!-- Sidebar Overlay (Mobile) -->
    <div 
      v-if="isMobile && sidebarOpen" 
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar Navigation -->
    <nav 
      class="sidebar"
      :class="{ 
        'sidebar--open': sidebarOpen,
        'sidebar--mobile': isMobile 
      }"
    >
      <!-- Desktop Brand -->
      <div class="sidebar-brand" v-if="!isMobile">
        <router-link to="/" class="brand-link">
          <h1>🎯 Mint Coach Mark</h1>
          <p>Interactive Demo Gallery</p>
        </router-link>
      </div>

      <!-- Navigation Categories -->
      <div class="sidebar-content">
        <div 
          v-for="category in navigationCategories" 
          :key="category.title"
          class="nav-category"
        >
          <h3 class="category-title">{{ category.title }}</h3>
          <div class="category-links">
            <router-link
              v-for="item in category.items"
              :key="item.path"
              :to="item.path"
              class="nav-link"
              :class="{ active: route.path === item.path }"
              @click="onNavLinkClick"
              :title="item.description"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <div class="nav-content">
                <span class="nav-text">{{ item.name }}</span>
                <span v-if="item.description" class="nav-description">{{ item.description }}</span>
              </div>
              <span v-if="item.component" class="component-badge" :class="`component-badge--${item.component.toLowerCase()}`">
                {{ item.component }}
              </span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="footer-links">
          <a href="https://github.com/your-username/mint-coach-mark" target="_blank" rel="noopener" class="footer-link">
            <span class="footer-icon">📚</span>
            <span>Documentation</span>
          </a>
          <a href="https://github.com/your-username/mint-coach-mark" target="_blank" rel="noopener" class="footer-link">
            <span class="footer-icon">⭐</span>
            <span>GitHub</span>
          </a>
        </div>
        <p class="version-info">v1.0.0 • Built with Vue 3</p>
      </div>
    </nav>

    <!-- Main Content -->
    <main 
      class="main-content"
      :class="{ 'main-content--sidebar-open': !isMobile && sidebarOpen }"
    >
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/*
 * Optimized Sidebar Navigation Layout
 * Professional, responsive design with smooth animations
 */

/* Global Layout */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Mobile Header */
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hamburger-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
}

.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger-line {
  display: block;
  width: 18px;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
  border-radius: 1px;
}

.hamburger-line--active:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-line--active:nth-child(2) {
  opacity: 0;
}

.hamburger-line--active:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-brand {
  flex: 1;
  text-align: center;
}

.mobile-brand h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
}

.mobile-tagline {
  font-size: 0.75rem;
  opacity: 0.9;
  display: block;
  margin-top: 2px;
}

/* Sidebar Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  backdrop-filter: blur(2px);
}

/* Sidebar */
.sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e9ecef;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar--open {
  transform: translateX(0);
}

.sidebar--mobile {
  z-index: 1060;
  width: 100%;
  max-width: 360px;
}

/* Sidebar Brand */
.sidebar-brand {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.brand-link {
  color: inherit;
  text-decoration: none;
  display: block;
  transition: opacity 0.2s;
}

.brand-link:hover {
  opacity: 0.9;
}

.sidebar-brand h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.sidebar-brand p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
  line-height: 1.3;
}

/* Sidebar Content */
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 0;
}

.nav-category {
  margin-bottom: 2rem;
}

.nav-category:last-child {
  margin-bottom: 1rem;
}

.category-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6c757d;
  margin: 0 0 1rem 0;
  padding: 0 1.5rem;
  line-height: 1.2;
}

.category-links {
  display: flex;
  flex-direction: column;
}

/* Navigation Links */
.nav-link {
  display: flex;
  align-items: flex-start;
  padding: 1rem 1.5rem;
  color: #495057;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
  gap: 1rem;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #667eea;
  border-left-color: rgba(102, 126, 234, 0.2);
}

.nav-link.active {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 100%);
  color: #667eea;
  border-left-color: #667eea;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.25rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.nav-content {
  flex: 1;
  min-width: 0;
}

.nav-text {
  display: block;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.nav-description {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
  line-height: 1.3;
  opacity: 0.8;
}

.nav-link.active .nav-description {
  color: #5a67d8;
  opacity: 0.9;
}

/* Component Badges */
.component-badge {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  margin-top: 0.125rem;
  flex-shrink: 0;
  text-align: center;
  min-width: 80px;
  line-height: 1.2;
}

.component-badge--mintpopover {
  background: #e3f2fd;
  color: #1976d2;
}

.component-badge--quasarcoachmark {
  background: #f3e5f5;
  color: #7b1fa2;
}

.nav-link.active .component-badge--mintpopover {
  background: #667eea;
  color: white;
}

.nav-link.active .component-badge--quasarcoachmark {
  background: #764ba2;
  color: white;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.footer-links {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
}

.footer-link:hover {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.footer-icon {
  font-size: 1rem;
}

.version-info {
  margin: 0;
  font-size: 0.7rem;
  color: #6c757d;
  text-align: center;
  opacity: 0.8;
  line-height: 1.3;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  margin-left: 0;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  overflow-x: auto;
}

/* Responsive Design */
@media (max-width: 767px) {
  .main-content {
    padding: 1rem;
    padding-top: 5rem; /* Account for mobile header */
  }

  .main-content--sidebar-open {
    margin-left: 0;
  }

  .sidebar {
    width: 100%;
    max-width: 360px;
  }

  .nav-link {
    padding: 0.875rem 1.5rem;
  }

  .nav-text {
    font-size: 0.875rem;
  }

  .nav-description {
    font-size: 0.7rem;
  }

  .component-badge {
    font-size: 0.6rem;
    padding: 0.2rem 0.4rem;
    min-width: 70px;
  }
}

@media (min-width: 768px) {
  .mobile-header {
    display: none;
  }
}

/* Smooth scrolling for sidebar content */
.sidebar-content {
  scroll-behavior: smooth;
}

/* Focus styles for accessibility */
.nav-link:focus,
.footer-link:focus,
.hamburger-btn:focus,
.brand-link:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .sidebar {
    border-right-width: 2px;
  }

  .nav-link.active {
    border-left-width: 4px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .nav-link,
  .hamburger-line,
  .main-content {
    transition: none;
  }
}
</style>
