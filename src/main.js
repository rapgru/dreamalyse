import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import { remote } from 'electron';

const myLogger = remote.getGlobal('sharedObject').mainLogger.child({ thread: 'renderer-1' });

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');

myLogger.info('created vue instance');
