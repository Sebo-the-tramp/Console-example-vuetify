import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import VueRouter from 'vue-router'
import { routes } from './routes';
import VueMqtt from 'vue-mqtt';

Vue.use(VueMqtt, 'ws://test.mosquitto.org:8081', {hostname:"test.mosquitto.org", defaultProtocol:"mqtt"});

var url = require('./lib/url')

Vue.use(VueRouter)


const router = new VueRouter({
  routes,
})

axios.defaults.baseURL = url.url;


/*

router.beforeEach((to, from, next) => {

  var now = new Date().getTime();
  var expiration = new Date(localStorage.getItem("expiration"))


  //HEREEEE
  if (['resetPassword', 'sendResetMail'].indexOf(to.name) >= 0){
    console.log("ciao")
    next()
  }
  else if (to.name !== 'login' && localStorage.getItem("token") == "undefined") {
    localStorage.removeItem("human_id");
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    next({ name: 'login' })
  }
  else if (to.name !== 'login' && !localStorage.getItem("token")) next({ name: 'login' })
  else if (to.name !== 'login' && now > expiration) next({ name: "login" })
  else next()
  
})

*/

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')