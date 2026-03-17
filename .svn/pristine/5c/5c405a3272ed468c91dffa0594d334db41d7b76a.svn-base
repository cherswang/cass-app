// @/api/wms/wmstock.js
import request from '@/utils/request'

// 查询库存记录列表
export function listWmstock(query) {
	return request({
		url: '/wms/wmstock/list',
		method: 'get',
		params: query
	})
}

// 查询库存记录详细
export function getWmstock(materialStockId) {
	return request({
		url: `/wms/wmstock/${materialStockId}`,
		method: 'get'
	})
}

// 新增库存记录
export function addWmstock(data) {
	return request({
		url: '/wms/wmstock',
		method: 'post',
		data: data
	})
}

// 修改库存记录
export function updateWmstock(data) {
	return request({
		url: '/wms/wmstock',
		method: 'put',
		data: data
	})
}

// 删除库存记录
export function delWmstock(materialStockId) {
	return request({
		url: `/wms/wmstock/${materialStockId}`,
		method: 'delete'
	})
}