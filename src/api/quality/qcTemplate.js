import request from '@/utils/request'
import config from "@/config"

// 查询检测模板列表
export function listTemplate(params) {
	return request({
		url: '/quality/qcTemplate/list',
		method: 'get',
		params: params
	})
}

// 查询检测模板详细
export function getTemplate(templateId) {
	return request({
		url: `/quality/qcTemplate/${templateId}`,
		method: 'get'
	})
}

// 新增检测模板
export function addTemplate(data) {
	return request({
		url: '/quality/qcTemplate',
		method: 'post',
		data: data
	})
}

// 修改检测模板
export function updateTemplate(data) {
	return request({
		url: '/quality/qcTemplate',
		method: 'put',
		data: data
	})
}

// 删除检测模板（支持单个ID或ID数组）
export function delTemplate(templateId) {
	// 处理数组类型ID，转为逗号分隔字符串
	const ids = Array.isArray(templateId) ? templateId.join(',') : templateId;
	return request({
		url: `/quality/qcTemplate/${ids}`,
		method: 'delete'
	})
}

// 导出检测模板列表
export function exportTemplate(params) {
	return request({
		url: '/quality/qcTemplate/export',
		method: 'get',
		params: params
	})
}

// 复制检测模板
export function copyTemplate(templateId) {
	return request({
		url: '/quality/qcTemplate/copy',
		method: 'post',
		data: { templateId }
	})
}

// 校验模板名称唯一性
export function checkTemplateName(params) {
	return request({
		url: '/quality/qcTemplate/checkName',
		method: 'get',
		params: params
	})
}

export function getTemplateByType(qcTypes,ipqcId) {
	return request({
		url: `/quality/qcTemplate/getTemplateByType/${qcTypes}/${ipqcId}`,
		method: 'get'
	})
}