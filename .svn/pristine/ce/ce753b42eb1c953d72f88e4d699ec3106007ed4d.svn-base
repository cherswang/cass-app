import request from '@/utils/request'

/**
 * 检查版本更新
 * @param {string} currentVersion - 当前版本号
 * @returns {Promise} - 返回版本更新信息
 */
export function checkUpdate(currentVersion) {
  return request({
    url: `/system/appVersion/checkUpdate/${currentVersion}`,
    method: 'get'
  })
}

/**
 * 获取最新版本
 * @returns {Promise} - 返回最新版本信息
 */
export function getLatestVersion() {
  return request({
    url: `/system/appVersion/latest`,
    method: 'get'
  })
}