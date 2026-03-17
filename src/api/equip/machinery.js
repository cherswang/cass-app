// @/api/equip/machinery.js
import request from '@/utils/request'

// 查询设备列表
export function listMachinery(query) {
	return request({
		url: '/equip/machinery/list',
		method: 'get',
		params: query
	})
}

// 删除设备类型
export function removeMachineryType(machineryTypeId) {
	return request({
		url: '/equip/machinery/removeType',
		method: 'get',
		params: {
			machineryTypeIds: [machineryTypeId]  // 将id包装在一个数组中
		}
	})
}

// 查询设备详细
export function getMachinery(machineryId) {
	return request({
		url: `/equip/machinery/${machineryId}`,
		method: 'get'
	})
}

// 新增设备
export function addMachinery(data) {
	return request({
		url: '/equip/machinery',
		method: 'post',
		data: data
	})
}

// 修改设备
export function updateMachinery(data) {
	return request({
		url: '/equip/machinery',
		method: 'put',
		data: data
	})
}

// 删除设备
export function delMachinery(machineryId) {
	return request({
		url: `/equip/machinery/${machineryId}`,
		method: 'delete'
	})
}

// 生成编码
export function genMachineryCode(ruleCode) {
	return request({
		url: `/system/autocode/get/${ruleCode}`,
		method: 'get'
	})
}

// 查询车间列表
export function listWorkshop(query) {
	return request({
		url: '/basic/workshop/listAll',
		method: 'get',
		params: query
	})
}

// 查询设备类型列表
export function listMachineryType(query) {
	return request({
		url: '/equip/machinery/getTypeList',
		method: 'get',
		params: query
	})
}

// 新增设备类型
export function addMachineryType(data) {
	return request({
		url: '/equip/machinery/add',
		method: 'post',
		data: data
	})
}

// 修改设备类型
export function updateMachineryType(data) {
	return request({
		url: '/equip/machinery/edit',
		method: 'post',
		data: data
	})
}

// 查询设备类型详细
export function getMachineryTypeInfo(machineryTypeId) {
	return request({
		url: `/equip/machinery/getTypeInfo/${machineryTypeId}`,
		method: 'get'
	})
}