import request from '@/utils/request'
import config from "@/config"

// 查询成品检验单列表
export function listIpqc(params) {
	return request({
		url: '/quality/qcIpqc/list',
		method: 'get',
		params: params
	})
}

// 查询成品检验单详细
export function getIpqc(ipqcId) {
	return request({
		url: `/quality/qcIpqc/${ipqcId}`,
		method: 'get'
	})
}

// 新增成品检验单
export function addIpqc(data) {
	return request({
		url: '/quality/qcIpqc',
		method: 'post',
		data: data
	})
}

// 修改成品检验单
export function updateIpqc(data) {
	return request({
		url: '/quality/qcIpqc',
		method: 'put',
		data: data
	})
}

// 删除成品检验单
export function delIpqc(fqcId) {
	return request({
		url: `/quality/qcIpqc/${fqcId}`,
		method: 'delete'
	})
}

// 导出成品检验单
export function exportIpqc(params) {
	return request({
		url: '/quality/qcIpqc/export',
		method: 'get',
		params: params
	})
}

// 审核成品检验单
export function auditIpqc(params) {
	return request({
		url: '/quality/qcIpqc/audit',
		method: 'post',
		data: params
	})
}

// 批量更新检验单状态
export function batchUpdateStatus(params) {
	return request({
		url: '/quality/qcIpqc/batch/status',
		method: 'put',
		data: params
	})
}
// 更新添加检验方案
export function updateTemplate(params) {
	return request({
		url: '/quality/qcIpqc/updateTemplate',
		method: 'post',
		data: params
	})
}
// 根据任务ID查询报检记录
export function getIpqcByTaskId(params) {
  return request({
    url: `/quality/qcIpqc/appList`,
    method: 'get',
	params: params
  })
}
export function printLabel(params) {
	return request({
		url: '/quality/qcIpqc/printLabel',
		method: 'put',
		data: params
	})
}

