<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const mobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Basic Tour', path: '/basic-tour', icon: '🎯' },
  { name: 'Custom Content', path: '/custom-content', icon: '🎨' },
  { name: 'Positioning', path: '/positioning', icon: '📍' },
  { name: 'Padding & Radius', path: '/padding-radius', icon: '🎨' },
  { name: 'Programmatic', path: '/programmatic', icon: '⚙️' },
  { name: 'Theming', path: '/theming', icon: '🎭' },
  { name: 'Scenarios', path: '/scenarios', icon: '🌟' },
  { name: 'Popover Test', path: '/popover-test', icon: '🔧' }
]

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

onMounted(() => {
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('.mobile-nav')
    const button = document.querySelector('.mobile-menu-button')
    if (nav && button && !nav.contains(e.target as Node) && !button.contains(e.target as Node)) {
      mobileMenuOpen.value = false
    }
  })
})
</script>

<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="logo">
            <router-link to="/" class="logo-link">
              🌿 MintCoachMark
            </router-link>
          </h1>
          <p class="tagline">Vue.js Component Library Demo</p>
        </div>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: route.path === item.path }"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-button" @click="toggleMobileMenu">
          <span class="hamburger" :class="{ open: mobileMenuOpen }"></span>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <nav class="mobile-nav" :class="{ open: mobileMenuOpen }">
        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="mobile-nav-link"
          :class="{ active: route.path === item.path }"
          @click="closeMobileMenu"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 MintCoachMark Demo. Built with Vue 3 + TypeScript.</p>
        <p>
          <a href="https://github.com/your-username/mint-coach-mark" target="_blank" rel="noopener">
            View on GitHub
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.logo {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.2s;
}

.logo-link:hover {
  opacity: 0.8;
}

.tagline {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.nav-icon {
  font-size: 1rem;
}

/* Mobile Menu */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.mobile-menu-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger {
  display: block;
  width: 20px;
  height: 2px;
  background: white;
  position: relative;
  transition: all 0.3s;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: white;
  transition: all 0.3s;
}

.hamburger::before {
  top: -6px;
}

.hamburger::after {
  top: 6px;
}

.hamburger.open {
  background: transparent;
}

.hamburger.open::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.open::after {
  transform: rotate(-45deg);
  top: 0;
}

.mobile-nav {
  display: none;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav.open {
  display: flex;
}

.mobile-nav-link {
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.mobile-nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

/* Main Content */
.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}

/* Footer */
.footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}

.footer-content p {
  margin: 0.5rem 0;
}

.footer-content a {
  color: #667eea;
  text-decoration: none;
}

.footer-content a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .main {
    padding: 1rem;
  }

  .footer-content {
    padding: 1rem;
  }

  .logo {
    font-size: 1.25rem;
  }

  .tagline {
    font-size: 0.75rem;
  }
}
</style>
