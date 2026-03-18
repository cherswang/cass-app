// 应用全局配置
// const defaultBaseUrl = 'http://192.168.0.120:82';
const defaultBaseUrl = 'http://192.168.41.101:82';

const config = {
   // baseUrl: 'https://vue.ruoyi.vip/prod-api',
   //cloud后台网关地址
   baseUrl: defaultBaseUrl,//'http://localhost:81',
   clientID: '428a8310cd442757ae699df5d894f051',
   // 应用信息
   appInfo: {
     // 应用名称
     name: "三晖电气办公管理系统",
     // 应用版本
     version: "1.0.0",
     // 应用logo
     logo: "/static/logo.png",
     // 官方网站
     site_url: "http://ruoyi.vip",
     // 政策协议
     agreements: [{
         title: "隐私政策",
         url: "https://ruoyi.vip/protocol.html"
       },
       {
         title: "用户服务协议",
         url: "https://ruoyi.vip/protocol.html"
       }
     ]
   },
    LS_ENCRYPTION: '',
    //localStorageAES加密秘钥，位数建议填写8的倍数
    LS_ENCRYPTION_key: '2XNN4K8LC0ELVWN4',
    ENCRYPTION_TYPE: '1',
    PUBLIC_KEY: '04576e6160202941c5bc971728d41fa8daeca6e761fa05ab457bb528df6f0f0c44d0a0beb7a4bf5528ac541aa759906dace75a77e96a762d4a20207ee382571c7a',
    SYSTEM_GREY: {
        greyStatus: '',
        greyEndTime: ''
    }
 }

// 尝试从localStorage读取自定义的baseUrl
try {
  const customBaseUrl = uni.getStorageSync('customBaseUrl');
  if (customBaseUrl && customBaseUrl.trim()) {
    config.baseUrl = customBaseUrl.trim();
  }
} catch (e) {
  console.log('读取自定义baseUrl失败:', e);
}

 export default config