<template>
  <div class="custom-content">
    <!-- Header -->
    <div class="page-header">
      <h1>🎨 Custom Content Demo</h1>
      <p>
        This demo showcases how to use custom slots to create rich, interactive popover content
        with images, videos, forms, and custom styling.
      </p>
    </div>

    <!-- Demo Application -->
    <div class="demo-app">
      <!-- Feature Showcase -->
      <div class="features-showcase">
        <div id="video-feature" class="feature-item">
          <div class="feature-icon">🎥</div>
          <h3>Video Tutorials</h3>
          <p>Learn with interactive video content</p>
        </div>

        <div id="form-feature" class="feature-item">
          <div class="feature-icon">📝</div>
          <h3>Interactive Forms</h3>
          <p>Collect user feedback and data</p>
        </div>

        <div id="gallery-feature" class="feature-item">
          <div class="feature-icon">🖼️</div>
          <h3>Image Gallery</h3>
          <p>Showcase visual content beautifully</p>
        </div>

        <div id="chart-feature" class="feature-item">
          <div class="feature-icon">📊</div>
          <h3>Data Visualization</h3>
          <p>Interactive charts and graphs</p>
        </div>

        <div id="social-feature" class="feature-item">
          <div class="feature-icon">🌐</div>
          <h3>Social Integration</h3>
          <p>Connect with social platforms</p>
        </div>

        <div id="ai-feature" class="feature-item">
          <div class="feature-icon">🤖</div>
          <h3>AI Assistant</h3>
          <p>Smart recommendations and help</p>
        </div>
      </div>
    </div>

    <!-- Tour Controls -->
    <div class="tour-controls">
      <button @click="startTour" :disabled="showTour" class="control-btn primary">
        🎨 Start Custom Tour
      </button>
      <button @click="stopTour" :disabled="!showTour" class="control-btn">
        ⏹️ Stop Tour
      </button>
    </div>

    <!-- MintCoachMark Component with Custom Slots -->
    <MintCoachMark
      v-model="showTour"
      :steps="steps"
      :config="config"
      @tour-complete="onTourComplete"
    >
      <!-- Custom Title Slot -->
      <template #title="{ step, index }">
        <div class="custom-title">
          <span class="step-number">{{ index + 1 }}</span>
          <div class="title-content">
            <h3>{{ step.popover?.title }}</h3>
            <div class="title-badge">{{ step.category }}</div>
          </div>
        </div>
      </template>

      <!-- Custom Content Slot -->
      <template #content="{ step, index }">
        <div class="custom-content-body">
          <!-- Video Content -->
          <div v-if="step.contentType === 'video'" class="video-content">
            <div class="video-placeholder">
              <div class="play-button">▶️</div>
              <p>{{ step.popover?.description }}</p>
            </div>
            <div class="video-info">
              <span class="duration">⏱️ 2:30</span>
              <span class="quality">🎬 HD</span>
            </div>
          </div>

          <!-- Form Content -->
          <div v-else-if="step.contentType === 'form'" class="form-content">
            <p>{{ step.popover?.description }}</p>
            <div class="demo-form">
              <input type="text" placeholder="Your name" class="form-input" />
              <input type="email" placeholder="Email address" class="form-input" />
              <textarea placeholder="Your feedback..." class="form-textarea"></textarea>
              <div class="form-actions">
                <button class="form-btn primary">Submit</button>
                <button class="form-btn">Skip</button>
              </div>
            </div>
          </div>

          <!-- Gallery Content -->
          <div v-else-if="step.contentType === 'gallery'" class="gallery-content">
            <p>{{ step.popover?.description }}</p>
            <div class="image-grid">
              <div class="image-item" v-for="i in 4" :key="i">
                <div class="image-placeholder">🖼️</div>
              </div>
            </div>
            <div class="gallery-controls">
              <button class="gallery-btn">← Prev</button>
              <span class="gallery-counter">1 / 4</span>
              <button class="gallery-btn">Next →</button>
            </div>
          </div>

          <!-- Chart Content -->
          <div v-else-if="step.contentType === 'chart'" class="chart-content">
            <p>{{ step.popover?.description }}</p>
            <div class="mini-chart">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
              </div>
              <div class="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
              </div>
            </div>
          </div>

          <!-- Social Content -->
          <div v-else-if="step.contentType === 'social'" class="social-content">
            <p>{{ step.popover?.description }}</p>
            <div class="social-buttons">
              <button class="social-btn facebook">📘 Facebook</button>
              <button class="social-btn twitter">🐦 Twitter</button>
              <button class="social-btn linkedin">💼 LinkedIn</button>
            </div>
            <div class="social-stats">
              <div class="stat">
                <strong>1.2K</strong>
                <span>Followers</span>
              </div>
              <div class="stat">
                <strong>89</strong>
                <span>Posts</span>
              </div>
              <div class="stat">
                <strong>4.5</strong>
                <span>Rating</span>
              </div>
            </div>
          </div>

          <!-- AI Content -->
          <div v-else-if="step.contentType === 'ai'" class="ai-content">
            <p>{{ step.popover?.description }}</p>
            <div class="ai-chat">
              <div class="chat-message ai">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                  Hi! I'm your AI assistant. I can help you with recommendations, 
                  answer questions, and guide you through features.
                </div>
              </div>
              <div class="chat-input">
                <input type="text" placeholder="Ask me anything..." class="chat-field" />
                <button class="chat-send">Send</button>
              </div>
            </div>
          </div>

          <!-- Default Content -->
          <div v-else class="default-content">
            <p>{{ step.popover?.description }}</p>
          </div>
        </div>
      </template>

      <!-- Custom Progress Slot -->
      <template #progress="{ step, index, total }">
        <div class="custom-progress">
          <div class="progress-dots">
            <span
              v-for="i in total"
              :key="i"
              class="progress-dot"
              :class="{ 
                active: i <= index + 1,
                current: i === index + 1
              }"
            />
          </div>
          <span class="progress-text">{{ index + 1 }} of {{ total }}</span>
        </div>
      </template>

      <!-- Custom Next Button -->
      <template #next-button="{ step, index }">
        <button class="custom-btn next">
          {{ index === steps.length - 1 ? '🎉 Finish' : '➡️ Continue' }}
        </button>
      </template>

      <!-- Custom Previous Button -->
      <template #prev-button>
        <button class="custom-btn prev">
          ⬅️ Back
        </button>
      </template>
    </MintCoachMark>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MintCoachMark } from 'mint-coach-mark'
import type { CoachMarkStep, CoachMarkConfig } from 'mint-coach-mark'
import 'mint-coach-mark/dist/style.css'

// Reactive state
const showTour = ref(false)

// Extended step interface for custom content
interface CustomStep extends CoachMarkStep {
  contentType?: string
  category?: string
}

// Tour steps with custom content types
const steps: CustomStep[] = [
  {
    element: '#video-feature',
    contentType: 'video',
    category: 'Media',
    popover: {
      title: '🎥 Interactive Video Content',
      description: 'Watch this tutorial to learn about our video features. You can pause, rewind, and take notes.',
      side: 'right'
    }
  },
  {
    element: '#form-feature',
    contentType: 'form',
    category: 'Input',
    popover: {
      title: '📝 Feedback Form',
      description: 'We value your input! Please share your thoughts about this feature.',
      side: 'top'
    }
  },
  {
    element: '#gallery-feature',
    contentType: 'gallery',
    category: 'Visual',
    popover: {
      title: '🖼️ Image Gallery',
      description: 'Browse through our collection of beautiful images and designs.',
      side: 'top'
    }
  },
  {
    element: '#chart-feature',
    contentType: 'chart',
    category: 'Analytics',
    popover: {
      title: '📊 Data Visualization',
      description: 'View your performance metrics with interactive charts.',
      side: 'left'
    }
  },
  {
    element: '#social-feature',
    contentType: 'social',
    category: 'Social',
    popover: {
      title: '🌐 Social Integration',
      description: 'Connect with your audience across multiple social platforms.',
      side: 'top'
    }
  },
  {
    element: '#ai-feature',
    contentType: 'ai',
    category: 'AI',
    popover: {
      title: '🤖 AI Assistant',
      description: 'Get personalized help and recommendations from our AI.',
      side: 'left'
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
  overlayOpacity: 0.8,
  smoothScroll: true
}

// Event handlers
function startTour() {
  showTour.value = true
}

function stopTour() {
  showTour.value = false
}

function onTourComplete() {
  console.log('🎉 Custom content tour completed!')
}
</script>

<style scoped>
.custom-content {
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

/* Demo Application */
.demo-app {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

/* Features Showcase */
.features-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-item {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.feature-item p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
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

/* Custom Popover Styles */
.custom-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-number {
  background: #667eea;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.title-content {
  flex: 1;
}

.title-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.title-badge {
  background: #e3f2fd;
  color: #1565c0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Custom Content Body */
.custom-content-body {
  margin-top: 1rem;
}

/* Video Content */
.video-content {
  text-align: center;
}

.video-placeholder {
  background: #f0f0f0;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 1rem;
  position: relative;
}

.play-button {
  font-size: 3rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.play-button:hover {
  transform: scale(1.1);
}

.video-info {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
}

/* Form Content */
.demo-form {
  margin-top: 1rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  box-sizing: border-box;
}

.form-textarea {
  height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.form-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.form-btn.primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Gallery Content */
.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;
}

.image-item {
  aspect-ratio: 1;
  background: #f0f0f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.gallery-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.gallery-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.gallery-counter {
  font-size: 0.875rem;
  color: #666;
}

/* Chart Content */
.mini-chart {
  margin-top: 1rem;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 0.5rem;
  height: 100px;
  margin-bottom: 0.5rem;
}

.bar {
  flex: 1;
  background: #667eea;
  border-radius: 2px 2px 0 0;
  min-height: 10px;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #666;
}

/* Social Content */
.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.social-btn {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.social-btn.facebook {
  background: #1877f2;
}

.social-btn.twitter {
  background: #1da1f2;
}

.social-btn.linkedin {
  background: #0077b5;
}

.social-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.stat {
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 1.1rem;
  color: #333;
}

.stat span {
  font-size: 0.75rem;
  color: #666;
}

/* AI Content */
.ai-chat {
  margin-top: 1rem;
}

.chat-message {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.4;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
}

.chat-field {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 0.875rem;
}

.chat-send {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
}

/* Custom Progress */
.custom-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-dots {
  display: flex;
  gap: 0.5rem;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
  transition: all 0.3s;
}

.progress-dot.active {
  background: #667eea;
}

.progress-dot.current {
  background: #667eea;
  transform: scale(1.2);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.progress-text {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

/* Custom Buttons */
.custom-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.custom-btn.next {
  background: #667eea;
  color: white;
}

.custom-btn.next:hover {
  background: #5a67d8;
}

.custom-btn.prev {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.custom-btn.prev:hover {
  background: #e9ecef;
}

/* Responsive Design */
@media (max-width: 768px) {
  .features-showcase {
    grid-template-columns: 1fr;
  }

  .tour-controls {
    flex-direction: column;
    align-items: center;
  }

  .custom-title {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .image-grid {
    grid-template-columns: 1fr;
  }

  .social-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
