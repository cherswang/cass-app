// @/api/equip/checksubject.js
import request from '@/utils/request'

// 查询点检项目列表
export function listChecksubject(query) {
	return request({
		url: '/equip/checkSubject/list',
		method: 'get',
		params: query
	})
}

// 查询点检项目详细
export function getChecksubject(recordId) {
	return request({
		url: `/equip/checkSubject/${recordId}`,
		method: 'get'
	})
}

// 新增点检项目
export function addChecksubject(data) {
	return request({
		url: '/equip/checkSubject',
		method: 'post',
		data: data
	})
}

// 修改点检项目
export function updateChecksubject(data) {
	return request({
		url: '/equip/checkSubject',
		method: 'put',
		data: data
	})
}

// 删除点检项目
export function delChecksubject(recordId) {
	return request({
		url: `/equip/checkSubject/${recordId}`,
		method: 'delete'
	})
}