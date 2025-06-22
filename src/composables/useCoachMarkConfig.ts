/**
 * Configuration management composable for MintCoachMark
 * Manages reactive configuration with defaults
 */

import { reactive, computed, type ComputedRef } from 'vue'
import type { CoachMarkConfig, CoachMarkDriver } from '../types'

// Default configuration
const defaultConfig: Required<Omit<CoachMarkConfig, 'steps' | 'onHighlightStarted' | 'onHighlighted' | 'onDeselected' | 'onDestroyStarted' | 'onDestroyed' | 'onNextClick' | 'onPrevClick' | 'onCloseClick' | 'onSkipClick' | 'onPopoverRender'>> = {
  animate: true,
  overlayColor: '#000',
  overlayOpacity: 0.7,
  smoothScroll: false,
  allowClose: true,
  overlayClickBehavior: 'close',
  stagePadding: 10,
  stageRadius: 5,
  disableActiveInteraction: false,
  allowKeyboardControl: true,
  popoverClass: '',
  popoverOffset: 10,
  showButtons: ['next', 'previous', 'close'],
  disableButtons: [],
  showProgress: false,
  progressText: '{{current}} of {{total}}',
  nextBtnText: 'Next',
  prevBtnText: 'Previous',
  doneBtnText: 'Done',
  skipBtnText: 'Skip Tour',
  allowSkip: true
}

// Global configuration instance
const globalConfig = reactive<CoachMarkConfig>({ ...defaultConfig })

// Current driver instance
let currentDriver: CoachMarkDriver | null = null

export function useCoachMarkConfig() {
  /**
   * Configure the coach mark with new options
   */
  function configure(config: CoachMarkConfig = {}): void {
    // Merge with defaults and existing config
    Object.assign(globalConfig, defaultConfig, config)
  }

  /**
   * Get configuration value(s)
   */
  function getConfig(): CoachMarkConfig
  function getConfig<K extends keyof CoachMarkConfig>(key: K): CoachMarkConfig[K]
  function getConfig<K extends keyof CoachMarkConfig>(key?: K) {
    return key ? globalConfig[key] : globalConfig
  }

  /**
   * Set current driver instance
   */
  function setCurrentDriver(driver: CoachMarkDriver): void {
    currentDriver = driver
  }

  /**
   * Get current driver instance
   */
  function getCurrentDriver(): CoachMarkDriver | null {
    return currentDriver
  }

  // Computed properties for commonly used config values
  const animate: ComputedRef<boolean> = computed(() => globalConfig.animate ?? true)
  
  const allowClose: ComputedRef<boolean> = computed(() => globalConfig.allowClose ?? true)
  
  const overlayClickBehavior: ComputedRef<'close' | 'nextStep'> = computed(
    () => globalConfig.overlayClickBehavior ?? 'close'
  )
  
  const stagePadding: ComputedRef<number> = computed(() => globalConfig.stagePadding ?? 10)
  
  const stageRadius: ComputedRef<number> = computed(() => globalConfig.stageRadius ?? 5)
  
  const overlayColor: ComputedRef<string> = computed(() => globalConfig.overlayColor ?? '#000')
  
  const overlayOpacity: ComputedRef<number> = computed(() => globalConfig.overlayOpacity ?? 0.7)
  
  const smoothScroll: ComputedRef<boolean> = computed(() => globalConfig.smoothScroll ?? false)
  
  const allowKeyboardControl: ComputedRef<boolean> = computed(
    () => globalConfig.allowKeyboardControl ?? true
  )
  
  const showProgress: ComputedRef<boolean> = computed(() => globalConfig.showProgress ?? false)
  
  const progressText: ComputedRef<string> = computed(
    () => globalConfig.progressText ?? '{{current}} of {{total}}'
  )
  
  const steps: ComputedRef<CoachMarkConfig['steps']> = computed(() => globalConfig.steps)

  return {
    // Configuration management
    configure,
    getConfig,
    setCurrentDriver,
    getCurrentDriver,
    
    // Reactive config
    config: globalConfig,
    
    // Computed properties
    animate,
    allowClose,
    overlayClickBehavior,
    stagePadding,
    stageRadius,
    overlayColor,
    overlayOpacity,
    smoothScroll,
    allowKeyboardControl,
    showProgress,
    progressText,
    steps
  }
}
