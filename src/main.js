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

  // 添加考勤规则配置
  uni.$appConfig = {
    checkinRules: [
      '上班时间：09:00-17:00',
      '迟到3分钟以内视为迟到，超过3分钟视为缺勤',
      '早退视为缺勤',
      '每月允许3次迟到，超过次数将影响考勤评分',
      '打卡范围：公司半径500米内'
    ]
  }

  return {
    app
  }
}