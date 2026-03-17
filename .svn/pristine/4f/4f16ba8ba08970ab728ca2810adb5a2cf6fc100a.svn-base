import request from '@/utils/request'
import config from "@/config"

// 查询检测记录数据列表
export function listTestData(params) {
	return request({
		url: '/quality/testData/list',
		method: 'get',
		params: params
	})
}

// 查询检测记录数据详情
export function getTestData(id) {
	return request({
		url: `/quality/testData/${id}`,
		method: 'get'
	})
}

// 新增检测记录数据
export function addTestData(data) {
	return request({
		url: '/quality/testData',
		method: 'post',
		data: data
	})
}

// 修改检测记录数据
export function updateTestData(data) {
	return request({
		url: '/quality/testData',
		method: 'put',
		data: data
	})
}

// 删除检测记录数据（支持单个ID或ID数组）
export function delTestData(id) {
	// 处理数组类型ID，转为逗号分隔字符串
	const ids = Array.isArray(id) ? id.join(',') : id;
	return request({
		url: `/quality/testData/${ids}`,
		method: 'delete'
	})
}