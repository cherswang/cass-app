// @/api/equip/checkmachinery.js
import request from '@/utils/request'

// 查询点检设备列表
export function listCheckMachinery(query) {
	return request({
		url: '/equip/checkMachinery/list',
		method: 'get',
		params: query
	})
}

// 查询点检设备详细
export function getCheckMachinery(recordId) {
	return request({
		url: `/equip/checkMachinery/${recordId}`,
		method: 'get'
	})
}

// 新增点检设备
export function addCheckMachinery(data) {
	return request({
		url: '/equip/checkMachinery',
		method: 'post',
		data: data
	})
}

// 修改点检设备
export function updateCheckMachinery(data) {
	return request({
		url: '/equip/checkMachinery',
		method: 'put',
		data: data
	})
}

// 删除点检设备
export function delCheckMachinery(recordId) {
	return request({
		url: `/equip/checkMachinery/${recordId}`,
		method: 'delete'
	})
}