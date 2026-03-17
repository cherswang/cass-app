import http from '@/utils/request';
import config from '@/config';
import { tansParams } from '@/utils/common';

export default {
  bpmList: {
    getMyBpmListTotal: {
      url: `/get/bpm/getMyBpmListTotal`,
      name: "获取个人流程总数",
      get: async function () {
        return await http({
          url: this.url,
          method: 'GET'
        });
      }
    },
    getDraftsBpmFlowList: {
      url: `/get/bpm/getDraftsBpmFlowList`,
      name: "获取流程草稿记录列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    getMyCreateBpmList: {
      url: `/get/bpm/getMyCreateBpmList`,
      name: "获取我发起的流程列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    getBpmFlowProcessList: {
      url: `/get/bpm/getBpmFlowProcessList`,
      name: "获取过程中流程列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    getMyFollowBpmFlowList: {
      url: `/get/bpm/getMyFollowBpmFlowList`,
      name: "获取我关注的流程列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    searchBpmList: {
      url: `/get/bpm/searchBpmList`,
      name: "获取流程查询列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    searchBpmListForMobile: {
      url: `/get/bpm/searchBpmListForMobile`,
      name: "移动端流程查询",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    }
  },
  bpmFlow: {
    getEndBpmFlowList: {
      url: `/get/bpm/getEndBpmFlowList`,
      name: "获取当用户参与的流程列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    getSendToBpmFlowList: {
      url: `/get/bpm/getSendToBpmFlowList`,
      name: "获取当前用户抄送流程流程列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    getDoingBpmFlowList: {
      url: `/get/bpm/getDoingBpmFlowList`,
      name: "获取当用户办理中的流程列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    }
  },
  bpmStepRun: {
    getBpmFlowApprovalList: {
      url: `/get/bpm/getBpmFlowApprovalList`,
      name: "获取个人流程待办列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    getBpmFlowApprovalListForApp: {
      url: `/get/bpm/getBpmFlowApprovalListForApp`,
      name: "获取App端待办列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    getBpmFlowDetail: {
      url: `/get/bpm/getBpmFlowDetail`,
      name: "获取流程详情",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    goNextStep: {
      url: `/set/bpm/goNextStep`,
      name: "流程转交下一步",
      post: async function (data) {
        return await http({
          url: this.url,
          method: 'POST',
          data: data
        });
      }
    },
    setIdeaText: {
      url: `/set/bpm/setIdeaText`,
      name: "审阅处理",
      post: async function (data) {
        return await http({
          url: this.url,
          method: 'POST',
          data: data
        });
      }
    }
  },
  bpmCollect: {
    getBpmCollectList: {
      url: `/get/bpm/getBpmCollectList`,
      name: "获取收藏流程列表",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    getBpmCollectBoxForTree: {
      url: `/get/bpm/getBpmCollectBoxForTree`,
      name: "获取收藏分类树",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    }
  },
  bpmForm: {
    getHandleBpmFormDataBean: {
      url: `/get/bpm/getHandleBpmFormDataBean`,
      name: "获取工作流表单-办理",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    },
    getCreateBpmFormDataBean: {
      url: `/get/bpm/getCreateBpmFormDataBean`,
      name: "获取工作流表单-发起",
      get: async function (params) {
        return await http({
          url: this.url,
          method: 'GET',
          params: params
        });
      }
    }
  },
  bpmCommIdea: {
    getBpmCommIdeaList: {
      url: `/get/bpm/getBpmCommIdeaList`,
      name: "获取个人常用审批意见列表",
      get: async function () {
        return await http({
          url: this.url,
          method: 'GET'
        });
      }
    }
  }
};