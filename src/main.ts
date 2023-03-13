import { createApp } from 'vue'
import App from './App.vue'
// store
import store from '@/store/index'
// router
import router from './router'
// css
import '@/assets/styles/index.scss'
// icons
import 'virtual:svg-icons-register'
import elementIcons from '@/components/SvgIcon/svgicon'
// modules
import './permission'
// custom directives

const app = createApp(App)

app.use(router)
app.use(store)
app.use(elementIcons)
app.mount('#app')
