<template>
  <view class="processing-container">
    <!-- 筛选栏 -->
    <view class="filter-section">
      <view class="filter-row">
        <view class="filter-item">
          <text class="filter-label">日期范围：</text>
          <picker mode="date" :value="filter.date" @change="handleDateChange">
            <view class="filter-picker">
              <text>{{ filter.date || '全部' }}</text>
            </view>
          </picker>
        </view>
        <view class="filter-item">
          <text class="filter-label">流程分类：</text>
          <picker :range="flowOptions" :value="filter.flowIndex" @change="handleFlowChange">
            <view class="filter-picker">
              <text>{{ flowOptions[filter.flowIndex] || '全部' }}</text>
            </view>
          </picker>
        </view>
      </view>
      <view class="search-row">
        <view class="search-item">
          <text class="filter-label">流水号：</text>
          <u-input v-model="search.bpmRunNo" placeholder="请输入流水号" class="search-input" />
        </view>
        <view class="search-item">
          <text class="filter-label">关键词：</text>
          <u-input v-model="search.keyword" placeholder="请输入流程标题" class="search-input" />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </view>
      </view>
    </view>
    
    <!-- 批量操作栏 -->
    <view class="batch-section">
      <view class="batch-info">已选择 {{ selectedItems.length }} 项</view>
      <view class="batch-buttons">
        <button class="batch-btn" :class="{ 'batch-btn-disabled': selectedItems.length === 0 }" :disabled="selectedItems.length === 0" @click="handleBatchRemind">批量催办</button>
      </view>
    </view>
    
    <!-- 列表内容 -->
    <view class="list-section">
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
          <u-checkbox-group>
            <view class="approval-item" v-for="item in approvals" :key="item.runId">
              <view class="item-header">
                <view class="item-select">
                  <u-checkbox :checked="selectedItems.includes(item.runId)" @change="(e) => handleItemSelect(e, item.runId)" />
                </view>
              <text class="item-title">{{ item.flowTitle || item.title }}</text>
              <text class="item-status status-processing">处理中</text>
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
                  <button class="view-btn" @click.stop="navigateToDetail(item)">查看</button>
                  <button class="remind-btn" @click.stop="handleRemind(item)">催办</button>
                </view>
              </view>
            </view>
          </view>
          </u-checkbox-group>
        </view>
        <!-- 空状态 -->
        <view v-else-if="!loading && !refreshing" class="empty-state">
          <text class="empty-text">暂无处理中数据</text>
        </view>
        <!-- 加载中状态 -->
        <view v-else-if="loading && !refreshing" class="loading-state">
          <text class="loading-text">加载中...</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import API from '@/api'
export default {
  props: {
    selectedStatus: {
      type: String,
      default: 'processing'
    }
  },
  data() {
    return {
      // 列表数据
      approvals: [],
      loading: false,
      refreshing: false,
      page: 1,
      pageSize: 10,
      hasMore: true,
      
      // 筛选数据
      filter: {
        date: '',
        flowIndex: 0
      },
      flowOptions: ['全部'],
      flowValues: [''],
      
      // 搜索数据
      search: {
        keyword: '',
        bpmRunNo: '',
        flowId: ''
      },
      
      // 选中项
      selectedItems: []
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化数据
    async initData() {
      await this.getFlowOptions()
      this.onRefresh()
    },
    
    // 获取流程分类选项
    async getFlowOptions() {
      try {
        const res = await API.bpm.bpmFlow.getPendingBpmFlowList.get({ model: '0' })
        if (res.code === 200 && res.data) {
          if (Array.isArray(res.data)) {
            const flowList = res.data
            if (flowList.length > 0) {
              const options = flowList.map(item => item.label || item.flowName)
              const values = flowList.map(item => item.value || item.flowId)
              this.flowOptions = ['全部', ...options]
              this.flowValues = ['', ...values]
            }
          } else {
            const responseData = res.data || {}
            const flowList = responseData.list || responseData.data || []
            if (flowList.length > 0) {
              const options = flowList.map(item => item.label || item.flowName)
              const values = flowList.map(item => item.value || item.flowId)
              this.flowOptions = ['全部', ...options]
              this.flowValues = ['', ...values]
            }
          }
        }
      } catch (error) {
        console.error('获取流程分类失败:', error)
      }
    },
    
    // 处理日期选择
    handleDateChange(event) {
      this.filter.date = event.detail.value
      this.onRefresh()
    },
    
    // 处理流程分类选择
    handleFlowChange(event) {
      this.filter.flowIndex = event.detail.value
      this.search.flowId = this.filter.flowIndex > 0 && this.flowValues && this.flowValues.length > this.filter.flowIndex ? this.flowValues[this.filter.flowIndex] : ''
      this.onRefresh()
    },
    
    // 处理搜索
    handleSearch() {
      this.onRefresh()
    },
    
    // 处理项选择
    handleItemSelect(e, id) {
      // 在u-checkbox中，@change事件会传递事件对象作为参数
      // 我们直接使用传递的id作为流程的runId
      const runId = id
      const index = this.selectedItems.indexOf(runId)
      if (index > -1) {
        this.selectedItems.splice(index, 1)
      } else {
        this.selectedItems.push(runId)
      }
    },
    
    // 处理批量催办
    async handleBatchRemind() {
      if (this.selectedItems.length === 0) {
        uni.showToast({ title: '请选择要催办的项目', icon: 'none' })
        return
      }
      
      uni.showModal({
        title: '确认批量催办',
        content: `确定要催办选中的${this.selectedItems.length}个流程吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              // 构建符合Vue后台要求的form-data格式参数
              let formData = ''
              this.selectedItems.forEach((runId, index) => {
                if (index > 0) formData += '&'
                formData += `runIds[]=${encodeURIComponent(runId)}`
              })
              
              // 导入config获取baseURL
              import('@/config').then(configModule => {
                const config = configModule.default
                // 使用uni.request直接发送请求，确保参数格式正确
                uni.request({
                  url: config.baseUrl + '/set/bpm/doBpmUrge',
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': uni.getStorageSync('token'),
                    'clientid': config.clientID
                  },
                  data: formData,
                  success: (res) => {
                    console.log('批量催办响应:', res)
                    if (res.data && res.data.code === 200) {
                      uni.showToast({ title: '批量催办成功', icon: 'success' })
                      // 清空选中项
                      this.selectedItems = []
                    } else {
                      uni.showToast({ title: res.data?.message || '批量催办失败', icon: 'none' })
                    }
                  },
                  fail: (error) => {
                    console.error('批量催办失败:', error)
                    uni.showToast({ title: '批量催办失败', icon: 'none' })
                  }
                })
              })
            } catch (error) {
              console.error('批量催办失败:', error)
              uni.showToast({ title: '批量催办失败', icon: 'none' })
            }
          }
        }
      })
    },
    
    // 下拉刷新
    onRefresh() {
      this.page = 1
      this.hasMore = true
      this.selectedItems = []
      this.refreshing = true
      this.loadData()
    },
    
    // 上拉加载更多
    onReachBottom() {
      if (this.hasMore && !this.loading) {
        this.page++
        this.loadData()
      }
    },
    
    // 加载数据
    async loadData() {
      if (this.loading) return
      
      this.loading = true
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          ...this.search
        }
        
        const res = await API.bpm.bpmList.getBpmFlowProcessList.get({ ...params, model: '0' })
        if (res.code === 200) {
          const responseData = res.data || {}
          const data = responseData.list || responseData.data || []
          if (this.page === 1) {
            this.approvals = data
          } else {
            this.approvals = [...this.approvals, ...data]
          }
          this.hasMore = data.length === this.pageSize
        } else {
          uni.showToast({ title: res.message || '获取数据失败', icon: 'none' })
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
        this.refreshing = false
      }
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
    
    // 跳转到详情页
    navigateToDetail(item) {
      console.log('查看详情:', item)
      console.log('runId:', item.runId)
      
      if (!item.runId) {
        console.error('缺少必要的参数:', item)
        uni.showToast({ title: '缺少必要的参数', icon: 'none' })
        return
      }
      
      const url = `/pages_approval/pages/detail/index?runId=${item.runId}`
      console.log('跳转URL:', url)
      
      uni.navigateTo({
        url: url,
        success: function(res) {
          console.log('跳转成功:', res)
        },
        fail: function(err) {
          console.error('跳转失败:', err)
          uni.showToast({ title: '跳转失败', icon: 'none' })
        }
      })
    },
    
    // 处理催办
    async handleRemind(item) {
      uni.showModal({
        title: '确认催办',
        content: '确定要催办这个流程吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              // 构建符合Vue后台要求的form-data格式参数
              let formData = `runIds[]=${encodeURIComponent(item.runId)}`
              
              // 导入config获取baseURL
              import('@/config').then(configModule => {
                const config = configModule.default
                // 使用uni.request直接发送请求，确保参数格式正确
                uni.request({
                  url: config.baseUrl + '/set/bpm/doBpmUrge',
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': uni.getStorageSync('token'),
                    'clientid': config.clientID
                  },
                  data: formData,
                  success: (res) => {
                    console.log('催办响应:', res)
                    if (res.data && res.data.code === 200) {
                      uni.showToast({ title: '催办成功', icon: 'success' })
                    } else {
                      uni.showToast({ title: res.data?.message || '催办失败', icon: 'none' })
                    }
                  },
                  fail: (error) => {
                    console.error('催办失败:', error)
                    uni.showToast({ title: '催办失败', icon: 'none' })
                  }
                })
              })
            } catch (error) {
              console.error('催办失败:', error)
              uni.showToast({ title: '催办失败', icon: 'none' })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.processing-container {
  padding: 15px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 筛选栏 */
.filter-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  margin-bottom: 10px;
}

.filter-item {
  flex: 1;
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.filter-item:last-child {
  margin-right: 0;
}

.filter-label {
  font-size: 12px;
  color: #999;
  margin-right: 5px;
  white-space: nowrap;
}

.filter-picker {
  flex: 1;
  padding: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

/* 搜索栏 */
.search-row {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.search-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-item:last-child {
  margin-bottom: 0;
}

.search-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 10px;
}

.search-btn {
  padding: 0 15px;
  height: 32px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
}

/* 列表区域 */
.list-section {
  background-color: #f5f5f5;
}

.list-scroll {
  height: calc(100vh - 200px);
}

.list-content {
  padding-bottom: 20px;
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

.approval-item:active {
  background: #f5f5f5;
}

/* 项头部 */
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

.status-processing {
  background: #e6f7ff;
  color: #1890ff;
}

/* 项内容 */
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

/* 查看按钮 */
.view-btn {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  vertical-align: middle;
  background-color: #1890ff;
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

.view-btn:active {
  background-color: #40a9ff;
}

/* 催办按钮 */
.remind-btn {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  vertical-align: middle;
  background-color: #52c41a;
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

.remind-btn:active {
  background-color: #73d13d;
}

/* 空状态 */
.empty-state {
  padding: 50px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 加载中状态 */
.loading-state {
  padding: 20px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 批量操作栏 */
.batch-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.batch-info {
  font-size: 12px;
  color: #666;
}

.batch-buttons {
  display: flex;
}

.batch-btn {
  padding: 0 15px;
  height: 28px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 10px;
}

.batch-btn-disabled {
  background-color: #d9d9d9;
  color: #999;
  cursor: not-allowed;
}
</style>