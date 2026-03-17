import request from '@/utils/request'

// 查询产品入库录列表
export function listProductRecpt(query) {
    return request({
        url: '/wms/productRecpt/list',
        method: 'get',
        params: query
    })
}
// 查询产品入库记录行列表
export function listProductRecptLine(query) {
    return request({
        url: '/wms/productRecptLine/list',
        method: 'get',
        params: query
    })
}

//新增产品入库录
export function addRecptHeader(data) {
    return request({
        url: '/wms/productRecpt',
        method: 'post',
        data: data
    })
}

//执行入库
export function execute(recptId) {
    return request({
        url: '/wms/productRecpt/' + recptId,
        method: 'put'
    })
}
// 批量打印
export function batchPrint(data) {
    return request({
        url: '/wms/productRecpt/batchPrint',
        method: 'post',
        data: data
    })
}