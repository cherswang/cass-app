// @/api/equip/repair.js
import request from '@/utils/request'

// 查询设备维修单列表
export function listRepair(query) {
	return request({
		url: '/equip/repair/list',
		method: 'get',
		params: query
	})
}

// 查询设备维修单详细
export function getRepair(repairId) {
	return request({
		url: `/equip/repair/${repairId}`,
		method: 'get'
	})
}

// 新增设备维修单
export function addRepair(data) {
	return request({
		url: '/equip/repair',
		method: 'post',
		data: data
	})
}

// 修改设备维修单
export function updateRepair(data) {
	return request({
		url: '/equip/repair',
		method: 'put',
		data: data
	})
}

// 确认设备维修单
export function updateConfirm(data) {
	return request({
		url: '/equip/repair/confirm',
		method: 'put',
		data: data
	})
}

// 删除设备维修单
export function delRepair(repairId) {
	return request({
		url: `/equip/repair/${repairId}`,
		method: 'delete'
	})
}