import App from './App.vue'
import plugins from './plugins'
import uviewPlus from 'uview-plus'
import UniDictTag from '@/components/UniDictTag/UniDictTag.vue'
import encryptor from '@/utils/encryption'

import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus)
  app.use(plugins)

  // 注册全局组件
  app.component('UniDictTag', UniDictTag)

  // 挂载到app全局属性，组件内可通过 this.$encrypt 调用
  app.config.globalProperties.$encrypt = encryptor

  return {
    app
  }
}