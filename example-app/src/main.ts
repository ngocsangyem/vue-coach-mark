import './assets/main.css'

import { createApp } from 'vue'
import { Quasar, QTooltip } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Import MintCoachMark styles
import 'mint-coach-mark/dist/style.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  components: {
    QTooltip
  }
})

app.mount('#app')
