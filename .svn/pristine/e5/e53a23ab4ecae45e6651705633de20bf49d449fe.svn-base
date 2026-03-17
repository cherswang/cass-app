// @/api/equip/checkTaskSubject.js
import request from '@/utils/request'

// 查询点检保养项目任务列表
export function listCheckTaskSubject(query) {
	return request({
		url: '/equip/checkTaskSubject/list',
		method: 'get',
		params: query
	})
}

// 查询点检保养项目任务详细
export function getCheckTaskSubject(taskSubId) {
	return request({
		url: `/equip/checkTaskSubject/${taskSubId}`,
		method: 'get'
	})
}

// 新增点检保养项目任务
export function addCheckTaskSubject(data) {
	return request({
		url: '/equip/checkTaskSubject',
		method: 'post',
		data: data
	})
}

// 修改点检保养项目任务
export function updateCheckTaskSubject(data) {
	return request({
		url: '/equip/checkTaskSubject',
		method: 'put',
		data: data
	})
}