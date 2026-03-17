import request from '@/utils/request' // 请确保request工具类路径正确

// 查询生产工序列表
export function listProcess(params) {
	return request({
		url: '/production/process/list',
		method: 'get',
		params: params
	})
}

// 查询所有有效生产工序
export function listAllProcess() {
	return request({
		url: '/production/process/listAll',
		method: 'get'
	})
}

// 查询生产工序详细
export function getProcess(processId) {
	return request({
		url: `/production/process/${processId}`,
		method: 'get'
	})
}

// 新增生产工序
export function addProcess(data) {
	return request({
		url: '/production/process',
		method: 'post',
		data: data
	})
}

// 修改生产工序
export function updateProcess(data) {
	return request({
		url: '/production/process',
		method: 'put',
		data: data
	})
}

// 删除生产工序
export function delProcess(processId) {
	return request({
		url: `/production/process/${processId}`,
		method: 'delete'
	})
}