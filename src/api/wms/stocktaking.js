import request from '@/utils/request'

// 查询库存盘点列表
export function listStocktaking(query) {
    return request({
        url: '/wms/stockTaking/list',
        method: 'get',
        params: query
    })
}

// 查询库存盘点详情
export function getStocktaking(takingId) {
    return request({
        url: '/wms/stockTaking/' + takingId,
        method: 'get'
    })
}

export function getInfoByBatchCode(query) {
    return request({
        url: '/wms/stockTakingLine/getInfoByBatchCode',
        method: 'get',
        params: query
    })
}
//
export function updateStocktakingline(data) {
    return request({
        url: '/wms/stockTakingLine',
        method: 'put',
        data: data
    })
}
// 批量打印
export function batchPrint(data) {
    return request({
        url: '/wms/stockTakingLine/batchPrint',
        method: 'post',
        data: data
    })
}