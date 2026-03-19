import store from '@/store'
import config from '@/config'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { toast, showConfirm, tansParams } from '@/utils/common'
import { RequestConfig, ResponseData } from '@/types/request'

let timeout = 10000
const baseUrl = config.baseUrl
const clientId = config.clientID;

const request = <T>(config:RequestConfig):Promise<ResponseData<T>> => {
  // 处理API路径，移除/capi前缀
  let apiUrl = config.url;
  if (apiUrl.startsWith('/capi')) {
    apiUrl = apiUrl.replace('/capi', '');
  }
  
  // get请求映射params参数
  let finalUrl = apiUrl;
  if (config.params) {
    const paramsStr = tansParams(config.params);
    if (paramsStr) {
      finalUrl = apiUrl + '?' + paramsStr.slice(0, -1);
    }
  }
  
  const requestUrl = config.baseUrl || baseUrl + finalUrl;
  
  // 是否需要设置 token
  const isToken = (config.header || {}).isToken === false
  config.header = config.header || {}
  if (getToken() && !isToken) {
    config.header['Authorization'] = 'Bearer ' + getToken(),
	config.header['clientid'] = clientId
  }
  
  console.log('🚀 ====== 请求开始 ======');
  console.log('📌 请求地址:', requestUrl);
  console.log('📌 请求方法:', config.method || 'GET');
  console.log('📌 请求参数(data):', config.data);
  console.log('📌 请求参数(params):', config.params);
  console.log('📌 请求头:', config.header);
  console.log('🚀 ====== 请求结束 ======');
  return new Promise((resolve, reject) => {
    // 处理POST请求的数据格式
    let requestData = config.data;
    const contentType = config.header['Content-Type'] || config.header['content-type'];
    if (config.method === 'POST' && contentType === 'application/x-www-form-urlencoded' && requestData && typeof requestData === 'object') {
      // 将对象转换为表单字符串，与Vue后台保持一致，不对值进行encodeURIComponent处理
      const paramsArray = [];
      for (const key in requestData) {
        if (requestData.hasOwnProperty(key)) {
          const value = requestData[key];
          if (value !== null && value !== undefined) {
            paramsArray.push(`${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`);
          }
        }
      }
      requestData = paramsArray.join('&');
    }
    
    uni.request({
      method: config.method || 'GET',
      timeout: config.timeout || timeout,
      url: requestUrl,
      data: requestData,
      header: config.header,
      dataType: 'json'
    }).then(response => {
      // 检查response是否是数组
      let error, res;
      if (Array.isArray(response)) {
        [error, res] = response;
      } else {
        // 如果不是数组，直接使用response作为res，error为null
        error = null;
        res = response;
      }
      if (error) {
        toast('后端接口连接异常')
        reject('后端接口连接异常')
        return
      }
      const data:ResponseData<T> = res.data as ResponseData<T>
      
      console.log('📥 ====== 响应开始 ======');
      console.log('📥 请求地址:', requestUrl);
      console.log('📥 响应状态码:', res.statusCode);
      console.log('📥 响应数据:', data);
      console.log('📥 ====== 响应结束 ======');
      
      const code = data.code || 200
      // @ts-ignore
      const msg:string = errorCode[code] || data.msg || errorCode['default']
      if (code === 401) {
        showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(res => {
          if (res.confirm) {
            store.dispatch('LogOut').then(res => {
              uni.reLaunch({ url: '/pages/login' })
            })
          }
        })
        reject('无效的会话，或者会话已过期，请重新登录。')
      } else if (code === 500) {
        // toast(msg)
        reject({ code, msg })
      } else if (code !== 200 && code !== 100) {
        toast(msg)
        reject({ code, msg })
      }
      resolve(data)
    })
      .catch(error => {
        console.log('❌ ====== 请求错误 ======');
        console.log('❌ 请求地址:', requestUrl);
        console.log('❌ 错误信息:', error);
        console.log('❌ ====== 请求错误结束 ======');
        
        let { message } = error
        if (message === 'Network Error') {
          message = '后端接口连接异常'
        } else if (message.includes('timeout')) {
          message = '系统接口请求超时'
        } else if (message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常'
        }
        toast(message)
        reject(error)
      })
  })
}

export default request
