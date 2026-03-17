// @/api/equip/checkTask.js
import request from '@/utils/request'

// 查询设备点检保养任务头列表
export function listCheckTask(query) {
	return request({
		url: '/equip/checkTask/list',
		method: 'get',
		params: query
	})
}

// 查询设备点检保养任务头详细
export function getCheckTask(taskId) {
	return request({
		url: `/equip/checkTask/${taskId}`,
		method: 'get'
	})
}

// 新增设备点检保养任务头
export function addCheckTask(data) {
	return request({
		url: '/equip/checkTask',
		method: 'post',
		data: data
	})
}

// 修改设备点检保养任务头
export function updateCheckTask(data) {
	return request({
		url: '/equip/checkTask',
		method: 'put',
		data: data
	})
}

// 删除设备点检保养任务头
export function delCheckTask(taskId) {
	return request({
		url: `/equip/checkTask/${taskId}`,
		method: 'delete'
	})
}