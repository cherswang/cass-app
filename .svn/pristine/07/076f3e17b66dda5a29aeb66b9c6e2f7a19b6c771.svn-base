// @/api/md/vendor.js
import request from '@/utils/request'

// 查询供应商列表
export function listVendor(query) {
	return request({
		url: '/basic/vendor/list',
		method: 'get',
		params: query
	})
}

// 查询供应商详细
export function getVendor(id) {
	return request({
		url: `/basic/vendor/${id}`,
		method: 'get'
	})
}

// 新增供应商
export function addVendor(data) {
	return request({
		url: '/basic/vendor',
		method: 'post',
		data: data
	})
}

// 修改供应商
export function updateVendor(data) {
	return request({
		url: '/basic/vendor',
		method: 'put',
		data: data
	})
}

// 删除供应商
export function delVendor(clientId) {
	return request({
		url: `/basic/vendor/${clientId}`,
		method: 'delete'
	})
}

// 从ERP同步供应商
export function syncMdVendorErp(query) {
	return request({
		url: '/basic/vendor/syncMdVendorErp',
		method: 'post',
		params: query
	})
}