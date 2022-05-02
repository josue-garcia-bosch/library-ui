import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { FontAwesomeIcon } from './plugins/font-awesome'

createApp(App).use(router).use(store)
.component("font-awesome-icon", FontAwesomeIcon).mount('#app')
