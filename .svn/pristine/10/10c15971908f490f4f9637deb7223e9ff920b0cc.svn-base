import request from '@/utils/request'

// 查询物料入库单列表
export function listItemRecpt(query) {
    return request({
        url: '/wms/itemRecpt/list',
        method: 'get',
        params: query
    })
}

// 查询物料入库单行列表
export function getListLine(query) {
    return request({
        url: '/wms/itemRecptLine/list',
        method: 'get',
        params: query
    })
}

//执行入库
export function execute(recptId) {
    return request({
        url: '/wms/itemRecpt/' + recptId,
        method: 'put'
    })
}
