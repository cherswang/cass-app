import request from '@/utils/request'

// 查询物料入库单行列表
export function listItemRecptLine(query) {
	return request({
		url: '/wms/itemRecptLine/list',
		method: 'get',
		params: query
	})
}

// 查询物料入库单行详细
export function getItemRecptLine(lineId) {
	return request({
		url: `/wms/itemRecptLine/${lineId}`,
		method: 'get'
	})
}

// 新增物料入库单行
export function addItemRecptLine(data) {
	return request({
		url: '/wms/itemRecptLine',
		method: 'post',
		data: data
	})
}

// 修改物料入库单行
export function updateItemRecptLine(data) {
	return request({
		url: '/wms/itemRecptLine',
		method: 'put',
		data: data
	})
}

// 删除物料入库单行
export function delItemRecptLine(lineId) {
	return request({
		url: `/wms/itemRecptLine/${lineId}`,
		method: 'delete'
	})
}