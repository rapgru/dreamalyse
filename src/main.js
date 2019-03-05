import Vue from 'vue';
import App from './App.vue';
import router from './router';
import child from './logging/childlogger';
import VueMDCAdapter from 'vue-mdc-adapter'

Vue.use(VueMDCAdapter)

const myLogger = child('renderer-1');

Vue.config.productionTip = false;

myLogger.info('created vue instance');

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
