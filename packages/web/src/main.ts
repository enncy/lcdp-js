import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ArcoDesign from '@arco-design/web-vue'
import ArcoDesignIcon from '@arco-design/web-vue/es/icon'
import 'core-components/es/style.css'
import './assets/style/main.css'
import '@arco-design/web-vue/dist/arco.css'
import { apis } from './apis'
import axios from 'axios'
import { schema_data } from '.'
import { createWebApis } from 'core-components'

// 初始化
;(async () => {
  const request = axios.create({ baseURL: 'http://localhost:3077', withCredentials: true })

  // 初始化 apis
  Object.assign(
    apis,
    createWebApis<any>(schema_data.apis, request, {
      onrequest(config) {},
      onresponse(config, result) {},
      onerror(config, error) {
        if (String(error).includes('Network Error')) {
          console.error('网络错误')
        } else {
          console.error('未知错误：' + String(error))
        }
      }
    })
  )

  createApp(App).use(router).use(ArcoDesign).use(ArcoDesignIcon).mount('#app')
})()
