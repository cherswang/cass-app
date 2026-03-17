import http from '@/utils/request';
import config from '@/config';

export default {
  getAllAttendConfigList: {
    url: `/get/system/getAllAttendConfigList`,
    name: "获取系统考勤规则",
    get: async function (params) {
      return await http({
        url: this.url,
        method: 'GET',
        params: params
      });
    }
  },
  getAttendConfigById: {
    url: `/get/system/getAttendConfigById`,
    name: "获取考勤配置详情",
    get: async function (params) {
      return await http({
        url: this.url,
        method: 'GET',
        params: params
      });
    }
  },
  getAttendConfigList: {
    url: `/get/system/getAttendConfigList`,
    name: "获取考勤规则列表",
    get: async function (params) {
      return await http({
        url: this.url,
        method: 'GET',
        params: params
      });
    }
  },
  insertAttendConfig: {
    url: `/set/system/insertAttendConfig`,
    name: "创建考勤规则",
    post: async function (data, config = {}) {
      return await http({
        url: this.url,
        method: 'POST',
        data: data,
        header: {
          'content-type': 'application/json'
        }
      });
    }
  },
  deleteAttendConfig: {
    url: `/set/system/deleteAttendConfig`,
    name: "删除考勤规则",
    post: async function (data, config = {}) {
      return await http({
        url: this.url,
        method: 'POST',
        data: data,
        header: {
          'content-type': 'application/json'
        }
      });
    }
  },
  updateAttendConfig: {
    url: `/set/system/updateAttendConfig`,
    name: "更新考勤规则",
    post: async function (data, config = {}) {
      return await http({
        url: this.url,
        method: 'POST',
        data: data,
        header: {
          'content-type': 'application/json'
        }
      });
    }
  }
};