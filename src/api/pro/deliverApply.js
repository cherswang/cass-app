import request from '@/utils/request'

// 查询发货申请主列表
export function listDeliverApply(query) {
	return request({
		url: '/pro/deliverApply/list',
		method: 'get',
		params: query
	})
}

// 查询发货申请主详细
export function getDeliverApply(deliverId) {
	return request({
		url: `/pro/deliverApply/${deliverId}`,
		method: 'get'
	})
}

// 新增发货申请主
export function addDeliverApply(data) {
	return request({
		url: '/pro/deliverApply',
		method: 'post',
		data: data
	})
}

// 修改发货申请主
export function updateDeliverApply(data) {
	return request({
		url: '/pro/deliverApply',
		method: 'put',
		data: data
	})
}

// 修改发货申请状态
export function updateByBoStatus(data) {
	return request({
		url: '/pro/deliverApply/updateByBoStatus',
		method: 'post',
		data: data
	})
}

// 删除发货申请主
export function delDeliverApply(deliverId) {
	return request({
		url: `/pro/deliverApply/${deliverId}`,
		method: 'delete'
	})
}

// 批量确认发货申请
export function confirmDeliverApply(data) {
	return request({
		url: '/pro/deliverApply/confirm',
		method: 'put',
		data: data
	})
}