import { createApp } from 'vue'
import App from './App.vue'

// For development: mount demo app
// In production, custom elements are registered via custom-elements.ts
// and each element is used independently in Home Assistant dashboards.
createApp(App).mount('#app')
