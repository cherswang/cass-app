import request from '@/utils/request'

export function listIssueHeader(query) {
    return request({
        url: '/wms/issueHeader/list',
        method: 'get',
        params: query
    })
}

// 查询生产领料单行列表
export function listIssueLine(query) {
    return request({
        url: '/wms/issueLine/list',
        method: 'get',
        params: query
    })
}

//执行出库
export function execute(issueId) {
    return request({
        url: '/wms/issueHeader/' + issueId,
        method: 'put'
    })
}

// 新增生产领料单头
export function addIssueheader(data) {
    return request({
        url: '/wms/issueHeader',
        method: 'post',
        data:data
    })
}

// 修改生产领料单头
export function updateIssueheader(data) {
    return request({
        url: '/wms/issueHeader',
        method: 'put',
        data:data
    })
}
