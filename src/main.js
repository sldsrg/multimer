import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import routes from './routes'
import store from './store'

Vue.config.productionTip = false
Vue.use(Router)

const router = new Router({ routes })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Subscribe to store updates
store.subscribe((mutation, state) => {
  // Store the state object as a JSON string
  localStorage.setItem('store', JSON.stringify(state))
})
