/**
 * TypeScript type definitions for MintCoachMark
 */
export type Side = 'top' | 'right' | 'bottom' | 'left' | 'over';
export type Alignment = 'start' | 'center' | 'end';
export type AllowedButtons = 'next' | 'previous' | 'close';
export interface StageDefinition {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface PopoverConfig {
    title?: string;
    description?: string;
    side?: Side;
    alignment?: Alignment;
    showButtons?: AllowedButtons[];
    disableButtons?: AllowedButtons[];
    showProgress?: boolean;
    progressText?: string;
    nextBtnText?: string;
    prevBtnText?: string;
    doneBtnText?: string;
    popoverClass?: string;
    onNextClick?: CoachMarkHook;
    onPrevClick?: CoachMarkHook;
    onCloseClick?: CoachMarkHook;
}
export interface CoachMarkStep {
    element?: string | Element | (() => Element);
    popover?: PopoverConfig;
    disableActiveInteraction?: boolean;
    onHighlightStarted?: CoachMarkHook;
    onHighlighted?: CoachMarkHook;
    onDeselected?: CoachMarkHook;
}
export type CoachMarkHook = (element: Element | undefined, step: CoachMarkStep, context: {
    config: CoachMarkConfig;
    state: CoachMarkState;
    driver: CoachMarkDriver;
}) => void;
export interface CoachMarkConfig {
    steps?: CoachMarkStep[];
    animate?: boolean;
    overlayColor?: string;
    overlayOpacity?: number;
    smoothScroll?: boolean;
    allowClose?: boolean;
    overlayClickBehavior?: 'close' | 'nextStep';
    stagePadding?: number;
    stageRadius?: number;
    disableActiveInteraction?: boolean;
    allowKeyboardControl?: boolean;
    popoverClass?: string;
    popoverOffset?: number;
    showButtons?: AllowedButtons[];
    disableButtons?: AllowedButtons[];
    showProgress?: boolean;
    progressText?: string;
    nextBtnText?: string;
    prevBtnText?: string;
    doneBtnText?: string;
    onHighlightStarted?: CoachMarkHook;
    onHighlighted?: CoachMarkHook;
    onDeselected?: CoachMarkHook;
    onDestroyStarted?: CoachMarkHook;
    onDestroyed?: CoachMarkHook;
    onNextClick?: CoachMarkHook;
    onPrevClick?: CoachMarkHook;
    onCloseClick?: CoachMarkHook;
    onPopoverRender?: (popover: PopoverDOM, context: {
        config: CoachMarkConfig;
        state: CoachMarkState;
        driver: CoachMarkDriver;
    }) => void;
}
export interface CoachMarkState {
    isInitialized?: boolean;
    activeIndex?: number;
    activeElement?: Element;
    activeStep?: CoachMarkStep;
    previousElement?: Element;
    previousStep?: CoachMarkStep;
    popover?: PopoverDOM;
    __previousElement?: Element;
    __activeElement?: Element;
    __previousStep?: CoachMarkStep;
    __activeStep?: CoachMarkStep;
    __activeOnDestroyed?: Element;
    __resizeTimeout?: number;
    __transitionCallback?: () => void;
    __activeStagePosition?: StageDefinition;
    __overlaySvg?: SVGSVGElement;
    __shouldRenderPopover?: {
        element: Element;
        step: CoachMarkStep;
    };
    __shouldRepositionPopover?: {
        element: Element;
        step: CoachMarkStep;
    };
}
export interface PopoverDOM {
    wrapper: HTMLElement;
    arrow: HTMLElement;
    title: HTMLElement;
    description: HTMLElement;
    footer: HTMLElement;
    progress: HTMLElement;
    nextBtn: HTMLElement;
    prevBtn: HTMLElement;
    closeBtn: HTMLElement;
}
export interface CoachMarkDriver {
    isActive: () => boolean;
    refresh: () => void;
    drive: (stepIndex?: number) => void;
    setConfig: (config: CoachMarkConfig) => void;
    setSteps: (steps: CoachMarkStep[]) => void;
    getConfig: () => CoachMarkConfig;
    getState: (key?: string) => any;
    getActiveIndex: () => number | undefined;
    isFirstStep: () => boolean;
    isLastStep: () => boolean;
    getActiveStep: () => CoachMarkStep | undefined;
    getActiveElement: () => Element | undefined;
    getPreviousElement: () => Element | undefined;
    getPreviousStep: () => CoachMarkStep | undefined;
    moveNext: () => void;
    movePrevious: () => void;
    moveTo: (index: number) => void;
    hasNextStep: () => boolean;
    hasPreviousStep: () => boolean;
    highlight: (step: CoachMarkStep) => void;
    destroy: () => void;
}
export interface MintCoachMarkProps {
    steps?: CoachMarkStep[];
    config?: CoachMarkConfig;
    modelValue?: boolean;
    autoStart?: boolean;
}
export interface MintCoachMarkEmits {
    'update:modelValue': [value: boolean];
    'tour-start': [];
    'tour-complete': [];
    'step-change': [step: CoachMarkStep, index: number];
    'highlight-started': [element: Element | undefined, step: CoachMarkStep];
    'highlighted': [element: Element | undefined, step: CoachMarkStep];
    'deselected': [element: Element | undefined, step: CoachMarkStep];
}
//# sourceMappingURL=index.d.ts.map