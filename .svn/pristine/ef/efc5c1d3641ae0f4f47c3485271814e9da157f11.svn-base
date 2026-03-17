import request from '@/utils/request'
import config from "@/config"

// 查询委外检验单列表
export function listOpqc(params) {
	return request({
		url: '/quality/qcOpqc/list',
		method: 'get',
		params: params
	})
}

// 查询委外检验单详细
export function getOpqc(opqcId) {
	return request({
		url: `/quality/qcOpqc/${opqcId}`,
		method: 'get'
	})
}

// 新增委外检验单
export function addOpqc(data) {
	return request({
		url: '/quality/qcOpqc',
		method: 'post',
		data: data
	})
}

// 修改委外检验单
export function updateOpqc(data) {
	return request({
		url: '/quality/qcOpqc',
		method: 'put',
		data: data
	})
}

// 删除委外检验单
export function delOpqc(opqcId) {
	// 处理数组类型ID，转为逗号分隔字符串
	const ids = Array.isArray(opqcId) ? opqcId.join(',') : opqcId;
	return request({
		url: `/quality/qcOpqc/${ids}`,
		method: 'delete'
	})
}

// 更新添加检验方案
export function updateTemplate(params) {
	return request({
		url: '/quality/qcOpqc/updateTemplate',
		method: 'post',
		data: params
	})
}