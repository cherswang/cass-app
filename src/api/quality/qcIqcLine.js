import request from '@/utils/request'
import config from "@/config"

// 查询来料检验单行列表
export function listIqcLine(params) {
	return request({
		url: '/quality/iqcLine/list',
		method: 'get',
		params: params
	})
}

// 查询来料检验单行详细
export function getIqcLine(lineId) {
	return request({
		url: `/quality/iqcLine/${lineId}`,
		method: 'get'
	})
}

// 新增来料检验单行
export function addIqcLine(data) {
	return request({
		url: '/quality/iqcLine',
		method: 'post',
		data: data
	})
}

// 修改来料检验单行
export function updateIqcLine(data) {
	return request({
		url: '/quality/iqcLine',
		method: 'put',
		data: data
	})
}

// 删除来料检验单行
export function delIqcLine(lineId) {
	// 处理数组类型ID，转为逗号分隔字符串（兼容批量删除）
	const ids = Array.isArray(lineId) ? lineId.join(',') : lineId;
	return request({
		url: `/quality/iqcLine/${ids}`,
		method: 'delete'
	})
}

// 批量新增来料检验单行
export function batchAddIqcLine(data) {
	return request({
		url: '/quality/iqcLine/batchAdd',
		method: 'post',
		data: data
	})
}

// 批量修改来料检验单行
export function batchUpdateIqcLine(data) {
	return request({
		url: '/quality/iqcLine/batchUpdate',
		method: 'put',
		data: data
	})
}

// 根据来料检验单ID查询行列表
export function getIqcLineByIqcId(iqcId) {
	return request({
		url: `/quality/iqcLine/getByIqcId/${iqcId}`,
		method: 'get'
	})
}