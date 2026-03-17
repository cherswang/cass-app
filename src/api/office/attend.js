import http from '@/utils/request';
import config from '@/config';
import { tansParams } from '@/utils/common';

export default {
  getAttendStatusDay: {
    url: `/get/office/getAttendStatusDay`,
    name: "获取上班打卡状态",
    get: async function (params) {
      return await http({
        url: this.url,
        method: 'GET',
        params: params
      });
    }
  },
  getOffWorkAttendStatusDay: {
    url: `/get/office/getOffWorkAttendStatusDay`,
    name: "获取下班打卡状态",
    get: async function (params) {
      return await http({
        url: this.url,
        method: 'GET',
        params: params
      });
    }
  },
  insertAttend: {
    url: `/set/office/insertAttend`,
    name: "提交打卡记录",
    post: async function (data, config = {}) {
      // 转换数据为URL编码格式
      let formData = tansParams(data);
      formData = formData.slice(0, -1); // 移除末尾的&符号
      
      return await http({
        url: this.url,
        method: 'POST',
        data: formData,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      });
    }
  }
};