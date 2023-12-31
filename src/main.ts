import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/scss/all.scss'

console.log(import.meta.hot)

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')

