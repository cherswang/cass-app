import request from '@/utils/request'

// 查询产品销售退货单列表
export function listRtSalse(query) {
	return request({
		url: '/wms/rtSalse/list',
		method: 'get',
		params: query
	})
}

// 查询产品销售退货单详细
export function getRtSalse(rtId) {
	return request({
		url: `/wms/rtSalse/${rtId}`,
		method: 'get'
	})
}

// 新增产品销售退货单
export function addRtSalse(data) {
	return request({
		url: '/wms/rtSalse',
		method: 'post',
		data: data
	})
}

// 修改产品销售退货单
export function updateRtSalse(data) {
	return request({
		url: '/wms/rtSalse',
		method: 'put',
		data: data
	})
}

// 删除产品销售退货单
export function delRtSalse(rtId) {
	return request({
		url: `/wms/rtSalse/${rtId}`,
		method: 'delete'
	})
}

// 退货信息报检
export function confirmRtsalse(data) {
	return request({
		url: '/wms/rtSalse/confirm',
		method: 'put',
		data: data
	})
}

// 执行退料入库
export function executeItemrecpt(rtId) {
	return request({
		url: `/wms/rtSalse/${rtId}`,
		method: 'put'
	})
}