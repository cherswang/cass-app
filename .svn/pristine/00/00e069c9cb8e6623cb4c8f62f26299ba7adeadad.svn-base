import request from '@/utils/request'

// 查询生产任务单列表
export function listWorkOrderTask(params) {
  return request({
    url: '/pro/workTask/list',
    method: 'get',
    params: params
  })
}

// 查询我的任务列表
export function getMyTasks(params) {
  return request({
    url: '/pro/workTask/myTasks',
    method: 'get',
    params: params
  })
}
/**
 * 查询待分配任务
 */
export function getLeaderTasks(params) {
  return request({
    url: '/pro/workTask/getLeaderTasks',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 查询已分配任务
 */
// export function getAssignedTasks(params) {
//   return request({
//     url: '/pro/workTask/getLeaderTasks',
//     method: 'get',
//     params: {
//       ...params,
//       isOperator: 1
//     }
//   })
// }

// 获取生产任务单详细信息
export function getWorkOrderTaskInfo(id) {
  return request({
    url: `/pro/workTask/${id}`,
    method: 'get'
  })
}

// 更新任务操作工ID
export function updateOperator(data) {
  return request({
    url: '/pro/workTask/updateOperator',
    method: 'put',
    data: data
  })
}

// 合并生产任务单
export function mergeWorkOrderTask(data) {
  return request({
    url: '/pro/workTask/merge',
    method: 'post',
    data: data
  })
}

// 开始任务
export function startWorkTask(id, equipmentCode,teamCode) {
  return request({
    url: '/pro/workTask/startWork/' + id,
    method: 'put',
    params: {
      equipmentCode: equipmentCode,
      teamCode:teamCode
    }
  })
}

// 暂停任务
export function pauseWorkTask(id) {
  return request({
    url: '/pro/workTask/pauseWork/' + id,
    method: 'put'
  })
}

// 完成任务
export function completeWorkTask(id) {
  return request({
    url: '/pro/workTask/completeWork/' + id,
    method: 'put'
  })
}

// 移交任务
export function transferWorkTask(id, targetUserId) {
  return request({
    url: '/pro/workTask/transferWork/' + id + '/' + targetUserId,
    method: 'put'
  })
}

// 打印标签
export function printLabel(id, data) {
  return request({
    url: `/pro/workTask/printLabel/${id}`,
    method: 'put',
    params: data
  })
}

// 报检并报工
export function submitWeightInspection(id, data) {
  return request({
    url: `/pro/workTask/submitWeightInspection/${id}`,
    method: 'post',
    params: data
  })
}
export function getWorkTaskStatus(id) {
  return request({
    url: '/pro/workTask/getWorkTaskStatus/' + id,
    method: 'get'
  })
}

export function getEquipmentListAll(id) {
  return request({
    url: `/pro/workTask/getEquipmentListAll/${id}`,
    method: 'get'
  })
}
// 批量打印库存记录
export function batchPrint(data) {
  return request({
    url: `/wms/wmstock/batchPrint`,
    method: 'post',
    data: data
  })
}
