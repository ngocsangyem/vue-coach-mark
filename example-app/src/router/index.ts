import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: 'MintCoachMark Demo - Home'
    }
  },
  {
    path: '/basic-tour',
    name: 'BasicTour',
    component: () => import('../views/BasicTourView.vue'),
    meta: {
      title: 'Basic Tour Demo'
    }
  },
  {
    path: '/custom-content',
    name: 'CustomContent',
    component: () => import('../views/CustomContentView.vue'),
    meta: {
      title: 'Custom Content Demo'
    }
  },
  {
    path: '/positioning',
    name: 'Positioning',
    component: () => import('../views/PositioningView.vue'),
    meta: {
      title: 'Positioning Demo'
    }
  },
  {
    path: '/programmatic',
    name: 'Programmatic',
    component: () => import('../views/ProgrammaticView.vue'),
    meta: {
      title: 'Programmatic Control Demo'
    }
  },
  {
    path: '/theming',
    name: 'Theming',
    component: () => import('../views/ThemingView.vue'),
    meta: {
      title: 'Custom Theming Demo'
    }
  },
  {
    path: '/scenarios',
    name: 'Scenarios',
    component: () => import('../views/ScenariosView.vue'),
    meta: {
      title: 'Real-world Scenarios'
    }
  },
  {
    path: '/popover-test',
    name: 'PopoverTest',
    component: () => import('../views/PopoverPersistenceTest.vue'),
    meta: {
      title: 'Popover Persistence Test'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update document title based on route meta
router.beforeEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
})

export default router
