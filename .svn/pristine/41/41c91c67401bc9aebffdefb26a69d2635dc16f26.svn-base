import request from '@/utils/request'

// 查询委外检验单行列表
export function listOpqcLine(params) {
	return request({
		url: '/quality/qcOpqcLine/list',
		method: 'get',
		params: params
	})
}

// 查询委外检验单行详细
export function getOpqcLine(lineId) {
	return request({
		url: `/quality/qcOpqcLine/${lineId}`,
		method: 'get'
	})
}

// 新增委外检验单行
export function addOpqcLine(data) {
	return request({
		url: '/quality/qcOpqcLine',
		method: 'post',
		data: data
	})
}

// 修改委外检验单行
export function updateOpqcLine(data) {
	return request({
		url: '/quality/qcOpqcLine',
		method: 'put',
		data: data
	})
}

// 删除委外检验单行
export function delOpqcLine(lineId) {
	// 处理数组类型ID，转为逗号分隔字符串
	const ids = Array.isArray(lineId) ? lineId.join(',') : lineId;
	return request({
		url: `/quality/qcOpqcLine/${ids}`,
		method: 'delete'
	})
}