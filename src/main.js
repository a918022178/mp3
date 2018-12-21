import Vue from 'vue'
import App from './App.vue'
import router from './router'

import vueAudioRecorder from 'vue-audio-recorder'
Vue.use(vueAudioRecorder)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
