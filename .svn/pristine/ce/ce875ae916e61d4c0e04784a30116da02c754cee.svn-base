import request from '@/utils/request'

// 查询生产退料单头列表
export function listRtissue(query) {
    return request({
        url: '/wms/rtIssue/list',
        method: 'get',
        params: query
    })
}

// 查询生产退料单行列表
export function listRtissueLine(query) {
    return request({
        url: '/wms/rtIssueLine/list',
        method: 'get',
        params: query
    })
}


//执行退料
export function execute(rtId) {
    return request({
        url: '/wms/rtIssue/' + rtId,
        method: 'put'
    })
}