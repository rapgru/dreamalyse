import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import child from './logging/childlogger';

const myLogger = child('renderer-1');

Vue.config.productionTip = false;

myLogger.info('created vue instance');

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
