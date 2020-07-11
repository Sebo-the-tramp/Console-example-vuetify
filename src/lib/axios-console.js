import axios from 'axios'

//import {uuid} from 'vue-uuid';

var url = require('./url')


const instance = axios.create({
  baseURL: url.url + "/api/",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
})


export default instance