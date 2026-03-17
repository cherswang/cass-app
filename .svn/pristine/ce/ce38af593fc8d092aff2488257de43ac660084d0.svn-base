import request from '@/utils/request'

// 查询转移单行列表
export function listTransferline(query) {
	return request({
		url: '/wms/transferLine/list',
		method: 'get',
		params: query
	})
}

// 查询转移单行详细
export function getTransferline(lineId) {
	return request({
		url: `/wms/transferLine/${lineId}`,
		method: 'get'
	})
}

// 新增转移单行
export function addTransferline(data) {
	return request({
		url: '/wms/transferLine',
		method: 'post',
		data: data
	})
}

// 修改转移单行
export function updateTransferline(data) {
	return request({
		url: '/wms/transferLine',
		method: 'put',
		data: data
	})
}

// 删除转移单行
export function delTransferline(lineId) {
	return request({
		url: `/wms/transferLine/${lineId}`,
		method: 'delete'
	})
}