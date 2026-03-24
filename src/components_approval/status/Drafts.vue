<template>
  <view class="drafts-container">
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
          <view class="approval-item" v-for="item in approvals" :key="item.id">
            <view class="item-header">
              <text class="item-title">{{ item.flowTitle || item.title }}</text>
              <text class="item-status status-drafts">草稿</text>
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
                <text class="content-label">创建时间：</text>
                <text class="content-value">{{ item.createTime || item.time }}</text>
              </view>
              <view class="item-footer">
                <view class="btn-container">
                  <button class="edit-btn" @click.stop="navigateToDetail(item)">编辑</button>
                  <button class="delete-btn" @click.stop="handleDeleteDraft(item)">删除</button>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 空状态 -->
        <view v-else-if="!loading && !refreshing" class="empty-state">
          <text class="empty-text">暂无草稿数据</text>
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
      default: 'drafts'
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
      
      // 搜索数据
      search: {
        keyword: '',
        bpmRunNo: '',
        flowId: ''
      }
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
        const res = await API.bpm.bpmList.getDraftsBpmFlowListFilter.get({ model: '0' })
        if (res.code === 200) {
          const responseData = res.data || {}
          const flowList = responseData.list || responseData.data || []
          if (flowList.length > 0) {
            const options = flowList.map(item => item.flowName)
            this.flowOptions = ['全部', ...options]
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
      this.search.flowId = this.filter.flowIndex > 0 ? this.flowOptions[this.filter.flowIndex] : ''
      this.onRefresh()
    },
    
    // 处理搜索
    handleSearch() {
      this.onRefresh()
    },
    
    // 下拉刷新
    onRefresh() {
      this.page = 1
      this.hasMore = true
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
        
        const res = await API.bpm.bpmList.getDraftsBpmFlowList.get({ ...params, model: '0' })
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
    
    // 跳转到详情页
    navigateToDetail(item) {
      uni.navigateTo({
        url: `/pages_approval/pages/detail?runId=${item.runId}&stepRunId=${item.stepRunId}&flowId=${item.flowId}`
      })
    },
    
    // 处理删除草稿
    async handleDeleteDraft(item) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个草稿吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const deleteRes = await API.bpm.bpmList.deleteDraftsBpmFlow.post({
                id: item.id
              })
              
              if (deleteRes.code === 200) {
                uni.showToast({ title: '删除成功', icon: 'success' })
                // 刷新列表
                this.onRefresh()
              } else {
                uni.showToast({ title: deleteRes.message || '删除失败', icon: 'none' })
              }
            } catch (error) {
              console.error('删除草稿失败:', error)
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.drafts-container {
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

.status-drafts {
  background: #f0f0f0;
  color: #666;
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

/* 编辑按钮 */
.edit-btn {
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

.edit-btn:active {
  background-color: #40a9ff;
}

/* 删除按钮 */
.delete-btn {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  vertical-align: middle;
  background-color: #ff4d4f;
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

.delete-btn:active {
  background-color: #ff7875;
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
</style>