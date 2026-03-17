import request from '@/utils/request'

// 根据任务ID查询报工记录
export function getTaskReportByTaskId(params) {
  return request({
    url: `/pro/taskReport/appList`,
    method: 'get',
    params: params
  })
}
// 查询生产任务报工记录列表
export function listProTaskReport(params) {
  return request({
    url: '/pro/taskReport/list',
    method: 'get',
    params: params
  })
}

// 导出生产任务报工记录列表
export function exportProTaskReport(params) {
  return request({
    url: '/pro/taskReport/export',
    method: 'post',
    data: params // post请求使用data传递参数
  })
}

// 获取生产任务报工记录详细信息
export function getProTaskReport(id) {
  return request({
    url: `/pro/taskReport/${id}`,
    method: 'get'
  })
}

// 新增生产任务报工记录
export function addProTaskReport(data) {
  return request({
    url: '/pro/taskReport',
    method: 'post',
    data: data
  })
}

// 修改生产任务报工记录
export function updateProTaskReport(data) {
  return request({
    url: '/pro/taskReport',
    method: 'put',
    data: data
  })
}

// 删除生产任务报工记录
export function deleteProTaskReport(ids) {
  return request({
    url: `/pro/taskReport/${ids}`,
    method: 'delete'
  })
}