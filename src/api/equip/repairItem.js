// @/api/equip/repairItem.js
import request from '@/utils/request'

// 查询设备维修备料列表
export function listRepairItem(query) {
	return request({
		url: '/equip/repairItem/list',
		method: 'get',
		params: query
	})
}

// 查询设备维修备料详细
export function getRepairItem(repairItemId) {
	return request({
		url: `/equip/repairItem/${repairItemId}`,
		method: 'get'
	})
}

// 新增设备维修备料
export function addRepairItem(data) {
	return request({
		url: '/equip/repairItem',
		method: 'post',
		data: data
	})
}

// 修改设备维修备料
export function updateRepairItem(data) {
	return request({
		url: '/equip/repairItem',
		method: 'put',
		data: data
	})
}

// 设备维修备料入库
export function updateRepairItemIn(data) {
	return request({
		url: '/equip/repairItem/in',
		method: 'put',
		data: data
	})
}

// 设备维修备料出库
export function updateRepairItemOut(data) {
	return request({
		url: '/equip/repairItem/out',
		method: 'put',
		data: data
	})
}

// 删除设备维修备料
export function delRepairItem(repairItemId) {
	return request({
		url: `/equip/repairItem/${repairItemId}`,
		method: 'delete'
	})
}