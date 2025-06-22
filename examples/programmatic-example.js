/**
 * Programmatic usage example for MintCoachMark
 * This example shows how to use the library without Vue components
 */

import { useCoachMark } from 'mint-coach-mark'
import 'mint-coach-mark/dist/style.css'

// Define tour steps
const steps = [
  {
    element: '#welcome-section',
    popover: {
      title: 'Welcome!',
      description: 'Welcome to our application. Let\'s take a quick tour of the main features.',
      side: 'bottom',
      showButtons: ['next', 'close']
    },
    onHighlighted: (element, step, context) => {
      console.log('Welcome step highlighted')
      // Add custom animation or tracking
      element?.classList.add('pulse-animation')
    },
    onDeselected: (element, step, context) => {
      element?.classList.remove('pulse-animation')
    }
  },
  {
    element: '#navigation-menu',
    popover: {
      title: 'Navigation Menu',
      description: 'Use this menu to navigate between different sections of the application.',
      side: 'right'
    }
  },
  {
    element: '#search-bar',
    popover: {
      title: 'Search Functionality',
      description: 'You can search for content using this search bar. Try typing something!',
      side: 'bottom'
    }
  },
  {
    element: '#user-profile',
    popover: {
      title: 'User Profile',
      description: 'Access your profile settings and preferences from here.',
      side: 'left'
    }
  },
  {
    element: '#main-content',
    popover: {
      title: 'Main Content Area',
      description: 'This is where the main content of the application is displayed.',
      side: 'top'
    }
  }
]

// Configuration options
const config = {
  animate: true,
  allowClose: true,
  showProgress: true,
  stagePadding: 12,
  stageRadius: 8,
  overlayOpacity: 0.8,
  smoothScroll: true,
  overlayClickBehavior: 'nextStep',
  
  // Custom button text
  nextBtnText: 'Continue',
  prevBtnText: 'Back',
  doneBtnText: 'Got it!',
  progressText: 'Step {{current}} of {{total}}',
  
  // Global event handlers
  onHighlightStarted: (element, step, context) => {
    console.log('Highlighting started for:', element)
    
    // Add custom analytics tracking
    if (window.gtag) {
      window.gtag('event', 'tour_step_started', {
        step_name: step.popover?.title,
        step_index: context.state.activeIndex
      })
    }
  },
  
  onHighlighted: (element, step, context) => {
    console.log('Element highlighted:', element)
    
    // Custom behavior for specific steps
    if (element?.id === 'search-bar') {
      // Focus the search input when highlighted
      const input = element.querySelector('input')
      if (input) {
        setTimeout(() => input.focus(), 500)
      }
    }
  },
  
  onDeselected: (element, step, context) => {
    console.log('Element deselected:', element)
    
    // Clean up any custom styling
    element?.classList.remove('pulse-animation', 'highlight-border')
  },
  
  onDestroyed: (element, step, context) => {
    console.log('Tour completed or destroyed')
    
    // Track tour completion
    if (window.gtag) {
      window.gtag('event', 'tour_completed', {
        completed_steps: context.state.activeIndex + 1,
        total_steps: steps.length
      })
    }
    
    // Show completion message
    showTourCompletionMessage()
  }
}

// Initialize the coach mark
const coachMark = useCoachMark({ steps, ...config })

// Export functions for global use
window.tourFunctions = {
  // Start the tour
  startTour: (stepIndex = 0) => {
    console.log('Starting tour at step:', stepIndex)
    coachMark.drive(stepIndex)
  },
  
  // Stop the tour
  stopTour: () => {
    console.log('Stopping tour')
    coachMark.destroy()
  },
  
  // Navigate to specific step
  goToStep: (stepIndex) => {
    if (coachMark.isActive()) {
      coachMark.moveTo(stepIndex)
    } else {
      coachMark.drive(stepIndex)
    }
  },
  
  // Navigate to next step
  nextStep: () => {
    if (coachMark.hasNextStep()) {
      coachMark.moveNext()
    } else {
      console.log('Already at last step')
    }
  },
  
  // Navigate to previous step
  previousStep: () => {
    if (coachMark.hasPreviousStep()) {
      coachMark.movePrevious()
    } else {
      console.log('Already at first step')
    }
  },
  
  // Get tour status
  getTourStatus: () => {
    return {
      isActive: coachMark.isActive(),
      currentStep: coachMark.getActiveIndex(),
      totalSteps: steps.length,
      hasNext: coachMark.hasNextStep(),
      hasPrevious: coachMark.hasPreviousStep(),
      isFirstStep: coachMark.isFirstStep(),
      isLastStep: coachMark.isLastStep()
    }
  },
  
  // Highlight a single element (not part of tour)
  highlightElement: (selector, options = {}) => {
    const defaultOptions = {
      title: 'Important',
      description: 'This element is highlighted for your attention.',
      side: 'bottom'
    }
    
    coachMark.highlight({
      element: selector,
      popover: { ...defaultOptions, ...options }
    })
  },
  
  // Update tour configuration
  updateConfig: (newConfig) => {
    coachMark.setConfig({ ...config, ...newConfig })
  },
  
  // Update tour steps
  updateSteps: (newSteps) => {
    coachMark.setSteps(newSteps)
  }
}

// Utility functions
function showTourCompletionMessage() {
  // Create a simple completion modal
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10002;
    text-align: center;
    max-width: 400px;
  `
  
  modal.innerHTML = `
    <h3 style="margin: 0 0 16px 0; color: #333;">🎉 Tour Complete!</h3>
    <p style="margin: 0 0 20px 0; color: #666;">
      Thanks for taking the tour! You're now ready to explore the application.
    </p>
    <button onclick="this.parentElement.remove()" style="
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    ">Close</button>
  `
  
  document.body.appendChild(modal)
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (modal.parentElement) {
      modal.remove()
    }
  }, 5000)
}

// Auto-start tour when page loads (optional)
document.addEventListener('DOMContentLoaded', () => {
  // Check if user has seen the tour before
  const hasSeenTour = localStorage.getItem('hasSeenTour')
  
  if (!hasSeenTour) {
    // Wait a bit for page to settle, then start tour
    setTimeout(() => {
      console.log('Auto-starting tour for new user')
      window.tourFunctions.startTour()
      localStorage.setItem('hasSeenTour', 'true')
    }, 1000)
  }
})

// Keyboard shortcuts for tour control
document.addEventListener('keydown', (e) => {
  // Only handle shortcuts when tour is active
  if (!coachMark.isActive()) return
  
  switch (e.key) {
    case 'ArrowRight':
    case ' ': // Spacebar
      e.preventDefault()
      window.tourFunctions.nextStep()
      break
    case 'ArrowLeft':
      e.preventDefault()
      window.tourFunctions.previousStep()
      break
    case 'Escape':
      e.preventDefault()
      window.tourFunctions.stopTour()
      break
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
      e.preventDefault()
      const stepIndex = parseInt(e.key) - 1
      if (stepIndex < steps.length) {
        window.tourFunctions.goToStep(stepIndex)
      }
      break
  }
})

// Console helpers for development
console.log('MintCoachMark tour functions available:')
console.log('- window.tourFunctions.startTour()')
console.log('- window.tourFunctions.stopTour()')
console.log('- window.tourFunctions.nextStep()')
console.log('- window.tourFunctions.previousStep()')
console.log('- window.tourFunctions.goToStep(index)')
console.log('- window.tourFunctions.getTourStatus()')
console.log('- window.tourFunctions.highlightElement(selector, options)')

export { coachMark, steps, config }
