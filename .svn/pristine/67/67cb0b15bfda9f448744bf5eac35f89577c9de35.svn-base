import request from '@/utils/request'

// 查询转移单列表
export function listTransfer(query) {
	return request({
		url: '/wms/transfer/list',
		method: 'get',
		params: query
	})
}

// 查询转移单详细
export function getTransfer(transferId) {
	return request({
		url: `/wms/transfer/${transferId}`,
		method: 'get'
	})
}

// 新增转移单
export function addTransfer(data) {
	return request({
		url: '/wms/transfer',
		method: 'post',
		data: data
	})
}

// 修改转移单
export function updateTransfer(data) {
	return request({
		url: '/wms/transfer',
		method: 'put',
		data: data
	})
}

// 删除转移单
export function delTransfer(transferId) {
	return request({
		url: `/wms/transfer/${transferId}`,
		method: 'delete'
	})
}

// 执行转移
export function executeTransfer(transferId) {
	return request({
		url: `/wms/transfer/${transferId}`,
		method: 'put'
	})
}