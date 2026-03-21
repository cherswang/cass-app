<template>
  <view class="approval-container">
    <!-- 顶部筛选栏 -->
    <view class="filter-section">
      <up-dropdown ref="statusDropdown" :active-color="'#1890ff'">
        <up-dropdown-item
          :title="getStatusLabel(selectedStatus)"
          :options="statusOptions"
          v-model="selectedStatus"
          @change="handleStatusChange"
        />
      </up-dropdown>
    </view>
    
    <!-- 审批列表 -->
    <view class="approval-list">
      <!-- 下拉刷新和上拉加载 -->
      <scroll-view 
        class="list-scroll" 
        scroll-y 
        @refresherrefresh="onRefresh" 
        @scrolltolower="onReachBottom"
        :refresher-enabled="true"
        :refresher-threshold="100"
        :refresher-default-style="'black'"
        :refresher-background="'#f5f5f5'"
        :refresher-triggered="refreshing"
      >
        <!-- 列表内容 -->
        <view v-if="approvals.length > 0" class="list-content">
          <view class="approval-item" v-for="item in approvals" :key="item.id">
            <view class="item-header">
              <text class="item-title">{{ item.flowTitle || item.title }}</text>
              <text class="item-status" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </text>
            </view>
            <view class="item-content">
              <view class="content-row">
                <text class="content-label">流水号：</text>
                <text class="content-value">{{ item.id }}</text>
              </view>
              <view class="content-row">
                <text class="content-label">流程分类：</text>
                <text class="content-value">{{ item.flowName || '未知流程' }}</text>
              </view>
              <view class="content-row">
                <text class="content-label">步骤名称：</text>
                <text class="content-value">{{ item.stepName || '未知步骤' }}</text>
              </view>
              <view class="content-row">
                <text class="content-label">转交部门：</text>
                <text class="content-value">{{ item.deptName || '无' }}</text>
              </view>
              <view class="content-row">
                <text class="content-label">转交人：</text>
                <text class="content-value">{{ item.createUser || item.submitter || '未知' }}</text>
              </view>
              <view class="content-row">
                <text class="content-label">转交时间：</text>
                <text class="content-value">{{ item.createTime || item.time }}</text>
              </view>
              <view class="content-row">
                <text class="content-label">停留时间：</text>
                <text class="content-value">{{ getTimeDifference(item.createTime || item.time) }}</text>
              </view>
              <view class="content-row">
                <text class="content-label">流程状态：</text>
                <text class="content-value">{{ getFlowStatusText(item) }}</text>
              </view>
              <view class="content-row">
                <text class="content-label">紧急程度：</text>
                <text class="content-value">{{ getUrgencyText(item.urgency) }}</text>
              </view>
              <view class="content-row">
                <text class="content-label">办理时限：</text>
                <text class="content-value">{{ getPassTimeText(item.passTime) }}</text>
              </view>
              <view class="content-row" v-if="item.recTime">
                <text class="content-label">接收时间：</text>
                <text class="content-value">{{ item.recTime }}</text>
              </view>
              <view class="item-footer">
                <view class="btn-container">
                  <button class="handle-btn" @click.stop="navigateToDetail(item)">办理</button>
                  <!-- <button class="handle-btn" @click.stop="navigateToDetail(item)">办理1</button>
                  <button class="handle-btn" @click.stop="navigateToDetail(item)">办理2</button>
                  <button class="handle-btn" @click.stop="navigateToDetail(item)">办理</button>
                  <button class="handle-btn" @click.stop="navigateToDetail(item)">办理1</button>
                  <button class="handle-btn" @click.stop="navigateToDetail(item)">办理2</button>
                  <button class="handle-btn" @click.stop="navigateToDetail(item)">办理</button>
                  <button class="handle-btn" @click.stop="navigateToDetail(item)">办理1</button>
                  <button class="handle-btn" @click.stop="navigateToDetail(item)">办理2</button> -->
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 空状态 -->
        <view v-else-if="!loading && !refreshing" class="empty-state">
          <text class="empty-text">暂无审批数据</text>
        </view>
        <!-- 加载中 -->
        <view v-else-if="loading && !refreshing" class="loading-state">
          <text class="loading-text">加载中...</text>
        </view>
        
        <!-- 上拉加载提示 -->
        <view class="load-more" v-if="approvals.length > 0 && !nomore">
          <text class="load-more-text">{{ loading ? '加载中...' : '上拉加载更多' }}</text>
        </view>
        <view class="load-more" v-else-if="approvals.length > 0">
          <text class="load-more-text">没有更多数据</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import API from '@/api'

export default {
  data() {
    return {
      // 状态选项
      statusOptions: [
        { value: 'bpmWorking', label: '待办' },
        { value: 'processing', label: '处理中' },
        { value: 'end', label: '已结束' },
        { value: 'mycreate', label: '我发起的' },
        { value: 'follow', label: '我关注的' },
        { value: 'drafts', label: '草稿' },
        { value: 'sendtome', label: '抄送我的' },
        { value: 'collection', label: '收藏' }
      ],
      selectedStatus: 'bpmWorking',
      
      // 审批数据
      approvals: [],
      
      // 分页参数
      page: 1,
      pageSize: 15,
      
      // 加载状态
      loading: false,
      refreshing: false,
      nomore: false
    }
  },
  onLoad() {
    this.fetchApprovals()
  },
  methods: {
    // 处理状态切换
    handleStatusChange(value) {
      this.selectedStatus = value
      this.page = 1
      this.approvals = []
      this.nomore = false
      this.fetchApprovals()
    },
    
    // 获取审批数据
    async fetchApprovals() {
      if (this.loading) return
      
      this.loading = true
      try {
        let res
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          model: 0
        }
        
        // 根据不同状态调用不同的API
        switch (this.selectedStatus) {
          case 'bpmWorking':
            // 待办
            res = await API.bpm.bpmStepRun.getBpmFlowApprovalList.get(params)
            break
          case 'processing':
            // 处理中
            res = await API.bpm.bpmList.getBpmFlowProcessList.get(params)
            break
          case 'end':
            // 已结束
            res = await API.bpm.bpmFlow.getEndBpmFlowList.get(params)
            break
          case 'mycreate':
            // 我发起的
            res = await API.bpm.bpmList.getMyCreateBpmList.get(params)
            break
          case 'follow':
            // 我关注的
            res = await API.bpm.bpmList.getMyFollowBpmFlowList.get(params)
            break
          case 'drafts':
            // 草稿
            res = await API.bpm.bpmList.getDraftsBpmFlowList.get(params)
            break
          case 'sendtome':
            // 抄送我的
            res = await API.bpm.bpmFlow.getSendToBpmFlowList.get(params)
            break
          case 'collection':
            // 收藏
            res = await API.bpm.bpmCollect.getBpmCollectList.get(params)
            break
          default:
            // 默认获取待办
            res = await API.bpm.bpmStepRun.getBpmFlowApprovalList.get(params)
        }
        
        if (res.code === 200) {
          const data = res.data || { list: [], total: 0 }
          const list = data.list || []
          
          // 转换数据格式
          const formattedList = list.map(item => ({
            id: item.id || item.runId || item.stepRunId || item.recordId,
            runId: item.runId,
            stepRunId: item.stepRunId,
            flowId: item.flowId,
            flowTitle: item.flowTitle || item.title || '无标题',
            flowName: item.flowName || '未知流程',
            stepName: item.stepName || '未知步骤',
            deptName: item.deptName || '无',
            createUser: item.createUser || item.submitter || '未知',
            createTime: item.createTime || item.submitTime || new Date().toLocaleString('zh-CN'),
            recTime: item.recTime,
            urgency: item.urgency || 0,
            passTime: item.passTime || 0,
            status: this.selectedStatus
          }))
          
          if (this.page === 1) {
            this.approvals = formattedList
          } else {
            this.approvals = [...this.approvals, ...formattedList]
          }
          
          // 判断是否还有更多数据
          this.nomore = this.approvals.length >= (data.total || 0)
        } else {
          uni.showToast({ title: res.message || '获取数据失败', icon: 'none' })
        }
      } catch (error) {
        console.error('获取审批数据失败:', error)
        uni.showToast({ title: '获取数据失败', icon: 'none' })
      } finally {
        this.loading = false
        this.refreshing = false
      }
    },
    
    // 下拉刷新
    onRefresh() {
      this.refreshing = true
      this.page = 1
      this.approvals = []
      this.nomore = false
      this.fetchApprovals()
    },
    
    // 上拉加载
    onReachBottom() {
      if (this.nomore || this.loading) return
      this.page++
      this.fetchApprovals()
    },
    
    // 跳转到审批详情页
    navigateToDetail(item) {
      const { id, runId, stepRunId, flowId, flowTitle, title, urgency } = item
      uni.navigateTo({
        url: `/pages_approval/pages/handle/index?runId=${runId || id}&stepRunId=${stepRunId}&flowId=${flowId}&flowTitle=${encodeURIComponent(flowTitle || title)}&urgency=${urgency}`
      })
    },
    // 计算停留时间
    getTimeDifference(startDate) {
      if (!startDate) return '0天0时0分'
      
      const now = new Date()
      const start = new Date(startDate)
      const duration = now - start
      
      const days = Math.floor(duration / (1000 * 60 * 60 * 24))
      const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
      
      return `${days}天${hours}时${minutes}分`
    },
    // 获取流程状态文本
    getFlowStatusText(item) {
      const { createTime, passTime } = item
      if (passTime != 0) {
        const timestamp1 = new Date(createTime).getTime() + passTime * 60 * 60 * 1000
        const timestamp = new Date().getTime()
        if (timestamp1 > timestamp) {
          return '正常'
        } else {
          return '已超时'
        }
      } else {
        return '正常'
      }
    },
    // 获取紧急程度文本
    getUrgencyText(urgency) {
      const urgencyMap = {
        0: '一般',
        1: '紧急',
        2: '加急'
      }
      return urgencyMap[urgency] || '未知'
    },
    // 获取办理时限文本
    getPassTimeText(passTime) {
      if (passTime == 0) {
        return '无限制'
      } else {
        return `${passTime}小时`
      }
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        bpmWorking: '待办',
        processing: '处理中',
        end: '已结束',
        mycreate: '我发起的',
        follow: '我关注的',
        drafts: '草稿',
        sendtome: '抄送我的',
        collection: '收藏'
      }
      return statusMap[status] || status
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      const classMap = {
        bpmWorking: 'status-pending',
        processing: 'status-processing',
        end: 'status-end',
        mycreate: 'status-mycreate',
        follow: 'status-follow',
        drafts: 'status-drafts',
        sendtome: 'status-sendtome',
        collection: 'status-collection'
      }
      return classMap[status] || ''
    },
    
    // 获取状态标签
    getStatusLabel(status) {
      const labelMap = {
        bpmWorking: '待办',
        processing: '处理中',
        end: '已结束',
        mycreate: '我发起的',
        follow: '我关注的',
        drafts: '草稿',
        sendtome: '抄送我的',
        collection: '收藏'
      }
      return labelMap[status] || status
    }
  }
}
</script>

<style lang="scss">
.approval-container {
  padding: 10px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 筛选栏 */
.filter-section {
  background: white;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 审批列表 */
.approval-list {
  background: white;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

/* 滚动视图 */
.list-scroll {
  width: 100%;
  height: calc(100vh - 200px);
  min-height: 500px;
}

/* 列表内容 */
.list-content {
  padding-bottom: 10px;
}

/* 审批项 */
.approval-item {
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.approval-item:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.approval-item:last-child {
  margin-bottom: 0;
}

.approval-item:active {
  background: #f5f5f5;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  flex: 1;
}

.item-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

/* 状态样式 */
.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-processing {
  background: #e6f7ff;
  color: #1890ff;
}

.status-end {
  background: #f6ffed;
  color: #52c41a;
}

.status-mycreate {
  background: #f9f0ff;
  color: #722ed1;
}

.status-follow {
  background: #fff0f5;
  color: #eb2f96;
}

.status-drafts {
  background: #f0f0f0;
  color: #666;
}

.status-sendtome {
  background: #e6f7ff;
  color: #1890ff;
}

.status-collection {
  background: #fff7e6;
  color: #fa8c16;
}

.item-content {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.content-row {
  display: flex;
  margin-bottom: 6px;
  align-items: flex-start;
}

.content-label {
  font-size: 12px;
  color: #999;
  width: 60px;
  flex-shrink: 0;
}

.content-value {
  font-size: 12px;
  color: #666;
  flex: 1;
  line-height: 1.4;
}

.item-time {
  font-size: 12px;
  color: #999;
}

/* 底部操作栏 */
.item-footer {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

/* 按钮容器 */
.btn-container {
  width: 100%;
  padding-left: 0;
  margin-left: 0;
  font-size: 0; /* 消除inline-block元素间的空格 */
}

/* 办理按钮 */
.handle-btn {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  vertical-align: middle;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 14px;
  font-size: 13px;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  text-align: center;
  box-sizing: border-box;
}

.handle-btn:active {
  background-color: #66b1ff;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.loading-text {
  font-size: 14px;
  color: #999;
}

/* 上拉加载 */
.load-more {
  padding: 20px 0;
  text-align: center;
}

.load-more-text {
  font-size: 12px;
  color: #999;
}
</style>