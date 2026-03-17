// @/api/md/mdItem.js
import request from '@/utils/request'

// 查询物料列表
export function listMdItem(query) {
	return request({
		url: '/basic/mditem/list',
		method: 'get',
		params: query
	})
}

// 查询物料详细
export function getMdItem(itemId) {
	return request({
		url: `/basic/mditem/${itemId}`,
		method: 'get'
	})
}

// 新增物料
export function addMdItem(data) {
	return request({
		url: '/basic/mditem',
		method: 'post',
		data: data
	})
}

// 修改物料
export function updateMdItem(data) {
	return request({
		url: '/basic/mditem',
		method: 'put',
		data: data
	})
}

// 删除物料
export function delMdItem(itemId) {
	return request({
		url: `/basic/mditem/${itemId}`,
		method: 'delete'
	})
}

// 添加产品分类
export function insertMdItemType(data) {
	return request({
		url: '/basic/mditemType',
		method: 'post',
		data: data,
		headers: {}
	})
}

// 删除产品分类
export function delMdItemType(id) {
	return request({
		url: `/basic/mditemType/${id}`,
		method: 'delete'
	})
}

// 更新产品分类
export function updateMdItemType(data) {
	return request({
		url: '/basic/mditemType/updateMdItemType',
		method: 'post',
		data: data
	})
}

// 获取物料分类树
export function getMdItemTypeTree(query) {
	return request({
		url: '/basic/mditem/getMdItemTypeTree',
		method: 'get',
		params: query
	})
}

// 添加销售产品
export function insertMdItem(data) {
	return request({
		url: '/basic/mditem',
		method: 'post',
		data: data,
		headers: {}
	})
}

// 删除销售产品
export function deleteMdItem(id) {
	return request({
		url: `/basic/mditem/${id}`,
		method: 'delete'
	})
}

// 更新销售产品
export function updateCrmProduct(data) {
	return request({
		url: '/basic/mditem',
		method: 'put',
		data: data,
		headers: {}
	})
}

// 批量导入产品
export function importMdItem(params) {
	return request({
		url: '/basic/mditem/export',
		method: 'post',
		data: params
	})
}

// 从ERP同步物料信息
export function syncMdProductErp(query) {
	return request({
		url: '/basic/mditem/syncMdProductErp',
		method: 'post',
		params: query
	})
}