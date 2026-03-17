import request from '@/utils/request'

// 查询仓库设置列表
export function listWarehouse(query) {
	return request({
		url: '/wms/warehouse/list',
		method: 'get',
		params: query
	})
}

// 查询仓库树形列表
export function getTreeList(query) {
	return request({
		url: '/wms/warehouse/getTreeList',
		method: 'get',
		params: query
	})
}

// 查询全量仓库树形列表
export function getTreeListAll(query) {
	return request({
		url: '/wms/warehouse/getTreeListAll',
		method: 'get',
		params: query
	})
}

// 查询仓库设置详细
export function getWarehouse(warehouseId) {
	return request({
		url: `/wms/warehouse/${warehouseId}`,
		method: 'get'
	})
}

// 新增仓库设置
export function addWarehouse(data) {
	return request({
		url: '/wms/warehouse',
		method: 'post',
		data: data
	})
}

// 修改仓库设置
export function updateWarehouse(data) {
	return request({
		url: '/wms/warehouse',
		method: 'put',
		data: data
	})
}

// 删除仓库设置
export function delWarehouse(warehouseId) {
	return request({
		url: `/wms/warehouse/${warehouseId}`,
		method: 'delete'
	})
}