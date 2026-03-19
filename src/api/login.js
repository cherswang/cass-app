import request from '@/utils/request'
import config from '@/config'
import qs from 'qs'  // 如果没安装可以用 URLSearchParams

export function login(data) {
  // 直接传普通对象，让 uni.request 处理
  return request({
    url: '/capi/get/system/login',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      accountId: data.accountId,
      passWord: data.passWord,
      code: data.code || '',
      encyCode: data.encyCode || ''
    }
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/capi/get/system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/auth/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 获取租户列表
export function getTenantList(){
  return request({
    url: '/auth/tenant/list',
    headers: {
      isToken: false
    },
    method: 'get'
  });
}