// @/api/equip/checkplan.js
import request from '@/utils/request'

// 查询设备点检计划头列表
export function listCheckPlan(query) {
	return request({
		url: '/equip/checkPlan/list',
		method: 'get',
		params: query
	})
}

// 查询设备点检计划头详细
export function getCheckPlan(planId) {
	return request({
		url: `/equip/checkPlan/${planId}`,
		method: 'get'
	})
}

// 新增设备点检计划头
export function addCheckPlan(data) {
	return request({
		url: '/equip/checkPlan',
		method: 'post',
		data: data
	})
}

// 修改设备点检计划头
export function updateCheckPlan(data) {
	return request({
		url: '/equip/checkPlan',
		method: 'put',
		data: data
	})
}

// 删除设备点检计划头
export function delCheckPlan(planId) {
	return request({
		url: `/equip/checkPlan/${planId}`,
		method: 'delete'
	})
}

// 设备点检生成任务
export function updateCheckPlanStart(data) {
	return request({
		url: '/equip/checkPlan/start',
		method: 'put',
		data: data
	})
}