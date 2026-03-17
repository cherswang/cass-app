// @/api/equip/repairLine.js
import request from '@/utils/request'

// 查询设备维修单行列表
export function listRepairline(query) {
	return request({
		url: '/equip/repairLine/list',
		method: 'get',
		params: query
	})
}

// 查询设备维修单行详细
export function getRepairline(lineId) {
	return request({
		url: `/equip/repairLine/${lineId}`,
		method: 'get'
	})
}

// 新增设备维修单行
export function addRepairline(data) {
	return request({
		url: '/equip/repairLine',
		method: 'post',
		data: data
	})
}

// 修改设备维修单行
export function updateRepairline(data) {
	return request({
		url: '/equip/repairLine',
		method: 'put',
		data: data
	})
}

// 删除设备维修单行
export function delRepairline(lineId) {
	return request({
		url: `/equip/repairLine/${lineId}`,
		method: 'delete'
	})
}