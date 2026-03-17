import request from '@/utils/request'

// 新增生产任务投料
export function submitMaterialIssue(data) {
  return request({
    url: `/pro/taskIssue`,
    method: 'post',
    data: data
  })
}

// 根据库存ID新增生产任务投料
export function submitMaterialIssueByStockId(data) {
  return request({
    url: `/pro/taskIssue/byStockId`,
    method: 'post',
    params: data
  })
}

// 根据任务ID查询生产任务投料记录
export function getTaskIssueByTaskId(data) {
  return request({
    url: `/pro/taskIssue/appList`,
    method: 'get',
    params: data
  })
}

// 更新剩余数量并标记为已完成
export function updateRemainingQuantity(data) {
  return request({
    url: `/pro/taskIssue/updateRemainingQuantity`,
    method: 'put',
    data: data
  })
}

// 删除生产任务投料
export function deleteTaskIssue(recordId) {
  return request({
    url: `/pro/taskIssue/${recordId}`,
    method: 'delete'
  })
}
export function printLabel(data) {
  return request({
    url: `/pro/taskIssue/batchPrint`,
    method: 'post',
    data: data
  })
}
// 根据任务ID+处理人查询设备编码  pro_task_assign
export function getTaskAssignByTaskIdAndUserId(data) {
  return request({
    url: `/pro/taskIssue/getTaskAssignByTaskIdAndUserId`,
    method: 'get',
    params: data
  })
}
//扫码下机接口
export function submitMaterialDowmMachine(data) {
  return request({
    url: `/pro/taskIssue/submitMaterialDowmMachine`,
    method: 'post',
    data: data
  })
}