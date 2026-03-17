import request from '@/utils/request'

// 查询销售出库单列表
export function listProductsalse(query) {
	return request({
		url: '/wms/productSalse/list',
		method: 'get',
		params: query
	})
}

// 查询销售出库单详细
export function getProductsalse(salseId) {
	return request({
		url: `/wms/productSalse/${salseId}`,
		method: 'get'
	})
}

// 新增销售出库单
export function addProductsalse(data) {
	return request({
		url: '/wms/productSalse',
		method: 'post',
		data: data
	})
}

// 修改销售出库单
export function updateProductsalse(data) {
	return request({
		url: '/wms/productSalse',
		method: 'put',
		data: data
	})
}

// 删除销售出库单
export function delProductsalse(salseId) {
	return request({
		url: `/wms/productSalse/${salseId}`,
		method: 'delete'
	})
}

// 执行出库
export function execute(salseId) {
	return request({
		url: `/wms/productSalse/${salseId}`,
		method: 'put'
	})
}