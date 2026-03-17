import request from '@/utils/request'
import config from "@/config"

// 查询来料检验单列表
export function listIqc(params) {
	return request({
		url: '/quality/qcIqc/list',
		method: 'get',
		params: params
	})
}

// 查询来料检验单详细
export function getIqc(iqcId) {
	return request({
		url: `/quality/qcIqc/${iqcId}`,
		method: 'get'
	})
}

// 新增来料检验单
export function addIqc(data) {
	return request({
		url: '/quality/qcIqc',
		method: 'post',
		data: data
	})
}

// 修改来料检验单
export function updateIqc(data) {
	return request({
		url: '/quality/qcIqc',
		method: 'put',
		data: data
	})
}

// 删除来料检验单
export function delIqc(iqcId) {
	// 处理数组类型ID，转为逗号分隔字符串
	const ids = Array.isArray(iqcId) ? iqcId.join(',') : iqcId;
	return request({
		url: `/quality/qcIqc/${ids}`,
		method: 'delete'
	})
}

// 更新添加检验方案
export function updateTemplate(params) {
	return request({
		url: '/quality/qcIqc/updateTemplate',
		method: 'post',
		data: params
	})
}
// 批量打印物料入库单
export function batchPrint(params) {
	return request({
		url: '/wms/itemRecpt/batchPrint',
		method: 'post',
		data: params
	})
}