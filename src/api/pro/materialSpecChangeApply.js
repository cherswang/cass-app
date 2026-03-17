import request from '@/utils/request'

// 查询领料规格变更申请列表
export function listMaterialSpecChangeApply(query) {
	return request({
		url: `/pro/materialSpecChangeApply/list`,
		method: 'get',
		params: query
	})
}

// 查询领料规格变更申请详细
export function getMaterialSpecChangeApply(id) {
	return request({
		url: `/pro/materialSpecChangeApply/${id}`,
		method: 'get'
	})
}

// 新增领料规格变更申请
export function addMaterialSpecChangeApply(data) {
	return request({
		url: `/pro/materialSpecChangeApply`,
		method: 'post',
		data: data
	})
}

// 修改领料规格变更申请
export function updateMaterialSpecChangeApply(data) {
	return request({
		url: `/pro/materialSpecChangeApply`,
		method: 'put',
		data: data
	})
}

// 删除领料规格变更申请
export function delMaterialSpecChangeApply(id) {
	return request({
		url: `/pro/materialSpecChangeApply/${id}`,
		method: 'delete'
	})
}