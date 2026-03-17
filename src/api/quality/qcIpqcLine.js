import request from '@/utils/request';
import config from "@/config";

// 查询过程检验单行列表
export function listIpqcLine(params) {
	return request({
		url: '/quality/qcIpqcLine/list',
		method: 'get',
		params: params
	});
}

// 查询过程检验单行详情
export function getIpqcLine(lineId) {
	return request({
		url: `/quality/qcIpqcLine/${lineId}`,
		method: 'get'
	});
}

// 新增过程检验单行
export function addIpqcLine(data) {
	return request({
		url: '/quality/qcIpqcLine',
		method: 'post',
		data: data
	});
}

// 修改过程检验单行
export function updateIpqcLine(data) {
	return request({
		url: '/quality/qcIpqcLine',
		method: 'put',
		data: data
	});
}

// 删除过程检验单行（支持单个ID或ID数组）
export function delIpqcLine(lineId) {
	// 处理数组类型ID，转为逗号分隔字符串
	const ids = Array.isArray(lineId) ? lineId.join(',') : lineId;
	return request({
		url: `/quality/qcIpqcLine/${ids}`,
		method: 'delete'
	});
}