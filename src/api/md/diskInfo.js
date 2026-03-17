import request from '@/utils/request'

export function getDiskInfoListAll(params) {
    return request({
        url: '/md/diskInfo/listAll',
        method: 'get',
        params: params
    })
}