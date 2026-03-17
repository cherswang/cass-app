<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="我的任务"
        :safeAreaInsetTop="true"
        :placeholder="true"
        bg-color="#FFFFFF"
        title-color="#333333"
        :border="false"
        :auto-back="true"
    />

    <!-- 吸顶容器 -->
    <view class="sticky-container">
      <!-- 搜索栏 -->
      <up-sticky :offset-top="0" bg-color="#FFFFFF">
        <view class="search-section">
          <view class="search-container">
            <u-search
                v-model="searchQuery"
                placeholder="搜索单号/编码/名称/规格"
                :show-action="false"
                bg-color="#F8F8F8"
                border-color="#F8F8F8"
                placeholder-color="#C8C9CC"
                shape="square"
                @search="handleSearch"
                class="search-input"
            />
            <view class="scan-icon" @click="handleSearch">
              <up-text text="搜索"></up-text>
            </view>
          </view>
        </view>
      </up-sticky>

      <!-- 筛选栏 -->
      <up-sticky :offset-top="80" bg-color="#FFFFFF">
        <view class="filter-section">
          <view class="filter-row">
            <view class="dropdown-wrapper">
              <up-dropdown ref="statusDropdown">
                <up-dropdown-item
                    :title="processDropdown.label"
                    :value="processDropdown.value"
                >
                  <view class="dropdown-custom-content">
                    <view
                        v-for="option in processOptions"
                        :key="option.value"
                        class="dropdown-custom-option"
                        :class="{ active: processDropdown.value.includes(option.value) }"
                        @click="toggleProcessOption(option)"
                    >
                      <text class="option-label">{{ option.label }}</text>
                      <up-icon
                          v-if="processDropdown.value.includes(option.value)"
                          name="checkmark"
                          size="20"
                          color="#2979FF"
                      ></up-icon>
                    </view>
                    <view class="dropdown-custom-footer">
                      <up-button text="重置" size="small" @click="cancelProcessSelection"></up-button>
                      <up-button type="primary" text="确定" size="small" @click="confirmProcessSelection"></up-button>
                    </view>
                  </view>
                </up-dropdown-item>
              </up-dropdown>
            </view>

            <!-- 状态标签 -->
            <view class="status-tabs-container">
                <view
                    v-for="(status, index) in statusTabs"
                    :key="index"
                    class="status-tab"
                    :class="{ active: currentStatusIndex === index }"
                    @click="handleStatusTabChange(index)"
                >
                    {{ status.label }}
                </view>
            </view>
          </view>
        </view>
      </up-sticky>
    </view>

    <!-- 滚动列表容器 -->
    <scroll-view
        class="scroll-container"
        scroll-y
        refresher-enabled
        :refresher-triggered="refresherTriggered"
        :refresher-background="'#f1f2f7'"
        @refresherrefresh="handleRefresh"
        @scrolltolower="handleScrollToLower"
        @scroll="handleScroll"
        :scroll-top="scrollTop"
    >
      <!-- 加载状态 -->
      <view v-if="loading && taskLists.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <!-- 空数据状态 -->
      <view v-else-if="taskLists.length === 0" class="empty-container">
        <u-empty
            mode="data"
            text="暂无工单任务数据"
        >
        </u-empty>
      </view>

      <!-- 数据列表 -->
      <view v-else class="record-list">
        <view
            class="record-item"
            v-for="(task, index) in taskLists"
            :key="task.id"
        >
          <view class="record-header">
            <text class="order-number">{{ task.processName || '-' }}  &nbsp;{{ task.productSpec || '-' }}</text>
            <UniDictTag :options="dicts" :value="task.operatorTaskStatus"/>
          </view>

          <view class="record-content" @click="viewDetail(task)">
            <view class="info-row">
              <text class="info-label">任务编号：</text>
              <text class="info-value">{{ task.taskNo || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品名称：</text>
              <text class="info-value">{{ task.productName || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品编码：</text>
              <text class="info-value">{{ task.productCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品规格：</text>
              <text class="info-value">{{ task.productSpec || '-' }}</text>
              <text class="info-label">计划数量：</text>
              <text class="info-value">{{ task.plannedQuantity || 0 }} {{ task.unit || '' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">已完成：</text>
              <text class="info-value completed">{{ task.completedQuantity || 0 }} {{ task.unit || '' }}</text>
              <text class="info-label">操作工：</text>
              <text class="info-value operator-name">{{ task.operatorNames || task.operatorName || '未指定' }}</text>
            </view>
          </view>

          <view class="record-actions">
            <view class="action-divider"></view>
            <view class="action-content">
              <text class="action-time">{{ task.createTime || '-' }}</text>
              <up-button
                  v-if="task.operatorTaskStatus == 1"
                  class="print-btn"
                  type="primary"
                  text="开始生产"
                  size="small"
                  @click="handleStartProduction(task)"
              ></up-button>
              <up-button
                  v-else-if="task.operatorTaskStatus == 2 || task.operatorTaskStatus == 3"
                  class="print-btn"
                  type="warning"
                  text="继续生产"
                  size="small"
                  @click="handleContinueProduction(task)"
              ></up-button>
              <up-button
                  v-else-if="task.operatorTaskStatus == 4"
                  class="print-btn"
                  type="primary"
                  text="查看任务"
                  size="small"
                  @click="handleViewTask(task)"
              ></up-button>
            </view>
          </view>
        </view>

        <!-- 加载更多状态 -->
        <view v-if="loadingMore" class="load-more-container">
          <u-loading-icon size="24" text="正在加载更多数据..."></u-loading-icon>
        </view>

        <!-- 没有更多数据提示 -->
        <view v-else-if="!hasMore && taskLists.length > 0" class="no-more-container">
          <text class="no-more-text">已经到底了，没有更多数据了</text>
        </view>

        <!-- 还有更多数据提示 -->
        <view v-else-if="hasMore && taskLists.length > 0" class="more-tips">
          <text class="more-text">继续上拉加载更多数据...</text>
        </view>
      </view>
    </scroll-view>

    <!-- 回到顶部按钮 -->
    <view v-if="showBackTop" class="back-top" @click="scrollToTop">
      <u-icon name="arrow-upward" color="#fff" size="20"></u-icon>
    </view>

    <!-- 详情弹出层 -->
    <up-popup
        :show="showDetailPopup"
        mode="bottom"
        :round="16"
        :closeable="true"
        :safe-area-inset-bottom="true"
        @close="closeDetail"
    >
      <view class="detail-container">
        <!-- 标题 -->
        <view class="detail-header">
          <text class="detail-title">工单详情</text>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="detail-content" scroll-y>
          <!-- 基本信息 -->
          <view class="detail-section">
            <view class="section-title">基本信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">工单编号</text>
                <text class="detail-value">{{ currentDetail.workOrderNo || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">任务编号</text>
                <text class="detail-value">{{ currentDetail.taskNo || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">产品名称</text>
                <text class="detail-value">{{ currentDetail.productName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">产品编码</text>
                <text class="detail-value">{{ currentDetail.productCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">产品规格</text>
                <text class="detail-value">{{ currentDetail.productSpec || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">计划数量</text>
                <text class="detail-value">{{ currentDetail.plannedQuantity || 0 }} {{ currentDetail.unit || '' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">已完成数量</text>
                <text class="detail-value">{{ currentDetail.completedQuantity || 0 }} {{ currentDetail.unit || '' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">工序</text>
                <text class="detail-value">{{ currentDetail.processName || '-' }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">操作工</text>
                <text class="detail-value">{{ currentDetail.operatorNames || currentDetail.operatorName || '未指定' }}</text>
              </view>
            </view>
          </view>

          <!-- 操作信息 -->
          <view class="detail-section">
            <view class="section-title">操作信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">创建时间</text>
                <text class="detail-value">{{ currentDetail.createTime || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">状态</text>
                <u-tag
                    :text="currentDetail.isOperator === '0' ? '未分配' : '已分配'"
                    :type="currentDetail.isOperator === '0' ? 'warning' : 'success'"
                    size="mini"
                    class="status-tag-detail"
                />
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </up-popup>

    <!-- 全局加载提示 -->
    <up-toast ref="uToast"></up-toast>
  </view>
</template>

<script>
import {getMyTasks} from '@/api/pro/workTask'
import {getDicts} from '@/api/system/dict'
import {listAllProcess} from '@/api/production/process'

export default {
  name: 'WorkOrderTaskList',
  data() {
    return {
      // 筛选相关配置
      selectedStatus: {
        label: '状态',
        value: [1]
      },
      statusOptions: [
        {label: '全部', value: 'all'},
        {label: '待生产', value: [1]},
        {label: '生产中', value: [2, 3]},
        {label: '已完成', value: [4]}
      ],
      // 导航栏状态标签
      statusTabs: [
        {label: '待生产', value: [1]},
        {label: '生产中', value: [2, 3]},
        {label: '已完成', value: [4]}
      ],
      // 工序选择配置
      processOptions: [], // 工序选项列表
      processDropdown: {
        label: '工序',
        value: []
      },
      
      // 数据相关
      taskLists: [], // 任务列表数据
      searchQuery: '',
      page: 1, // 当前页码
      pageSize: 10,
      total: 0, // 总数据量
      
      // 详情弹出层相关
      showDetailPopup: false,
      currentDetail: {}, // 当前显示的详情数据
      
      // 下拉刷新状态
      refresherTriggered: false,
      loading: false, // 初始加载状态
      loadingMore: false, // 加载更多状态
      
      // 滚动相关
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,
      
      // 原始标签页相关配置（保留用于状态管理）
      originalList: [
        {name: '待生产', status: [1]},
        {name: '生产中', status: [2, 3]},
        {name: '已完成', status: [4]}
      ],
      currentStatusIndex: 0,
      dicts: {}
    }
  },
  computed: {
    hasMore() {
      return this.taskLists.length < this.total
    }
  },

  onLoad() {
    this.loadProcessList() // 加载工序列表
    this.loadDicts() // 加载字典数据
    this.fetchTableData()
  },
  methods: {
    // 加载字典数据
    async loadDicts() {
      try {
        const response = await getDicts("worktask_status")
        this.dicts = response.data
      } catch (error) {
        this.dicts = {} // 确保即使失败也有默认值
      }
    },
    
    // 构建查询参数
    buildQueryParams() {
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize
      }

      if (this.searchQuery) {
        params.searchValue = this.searchQuery
      }

      // 处理状态筛选
      if (this.selectedStatus.value !== 'all') {
        if (!params.params) {
          params.params = {}
        }
        params.params.statusList = Array.isArray(this.selectedStatus.value) ? this.selectedStatus.value.join(',') : this.selectedStatus.value
      }

      // 添加工序筛选条件
      if (Array.isArray(this.processDropdown.value) && this.processDropdown.value.length > 0) {
        params.processCode = this.processDropdown.value.join(',')
      }

      return params
    },

    // 加载任务列表
    async fetchTableData() {
      this.loading = true

      try {
        const params = this.buildQueryParams()
        // 使用getMyTasks API获取任务数据
        const res = await getMyTasks(params)

        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : []

          if (this.page === 1) {
            this.taskLists = newData
          } else {
            this.taskLists = [...this.taskLists, ...newData]
          }

          this.total = Number(res.total) || 0
        } else {
          this.$refs.uToast.show({
            type: 'error',
            message: res.msg || '获取数据失败'
          })
        }
      } catch (error) {
        this.$refs.uToast.show({
          type: 'error',
          message: '网络错误，请重试'
        })
      } finally {
        this.loading = false
        this.refresherTriggered = false
      }
    },

    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true
      this.page = 1
      this.fetchTableData()
    },

    // 滚动到底部加载更多
    handleScrollToLower() {
      if (this.loadingMore) {
        return
      }

      if (!this.hasMore) {
        return
      }

      this.page += 1
      this.loadingMore = true

      this.fetchTableData().finally(() => {
        this.loadingMore = false
      })
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.fetchTableData()
    },
    
    // 状态筛选变化
    handleStatusChange(value) {
      const selectedOption = this.statusOptions.find(option => option.value === value)
      this.selectedStatus.label = selectedOption.label;
      this.selectedStatus.value = value;
      this.page = 1
      this.fetchTableData()
    },

    // 导航栏状态标签切换
    handleStatusTabChange(index) {
      this.currentStatusIndex = index;
      const selectedTab = this.statusTabs[index];
      this.selectedStatus.label = selectedTab.label;
      this.selectedStatus.value = selectedTab.value;
      this.page = 1;
      this.fetchTableData();
    },

    // 加载工序列表
    async loadProcessList() {
      try {
        const res = await listAllProcess()
        if (res.code === 200 && Array.isArray(res.data)) {
          // 转换为下拉菜单需要的格式
          this.processOptions = res.data.map(process => ({
            label: process.processName,
            value: process.processCode
          }))
          this.processDropdown.label = '工序'
        }
      } catch (error) {
        this.$refs.uToast.show({
          type: 'error',
          message: '加载工序列表失败'
        })
      }
    },

    // 切换工序选项
    toggleProcessOption(option) {
      const value = option.value
      const index = this.processDropdown.value.indexOf(value)
      if (index > -1) {
        // 移除选中项
        this.processDropdown.value.splice(index, 1)
      } else {
        // 添加选中项，无数量限制
        this.processDropdown.value.push(value)
      }
    },

    // 确认工序选择
    confirmProcessSelection() {
      // 更新工序标签文本
      if (this.processDropdown.value.length === 0) {
        this.processDropdown.label = '工序'
      } else if (this.processDropdown.value.length === 1) {
        const selectedProcess = this.processOptions.find(option => option.value === this.processDropdown.value[0])
        this.processDropdown.label = selectedProcess ? selectedProcess.label : '工序'
      } else {
        this.processDropdown.label = `${this.processDropdown.value.length}个工序`
      }

      if (this.$refs.statusDropdown) {
        this.$refs.statusDropdown.close()
      }

      this.page = 1
      this.fetchTableData()
    },

    // 重置工序选择
    cancelProcessSelection() {
      // 清空已选工序
      this.processDropdown.value = []
      // 重置标签显示
      this.processDropdown.label = '工序'
      // 关闭下拉菜单
      if (this.$refs.statusDropdown) {
        this.$refs.statusDropdown.close()
      }
      // 刷新数据，显示所有工序的任务
      this.page = 1
      this.fetchTableData()
    },

    // 滚动处理
    handleScroll(e) {
      const scrollTop = e.detail.scrollTop
      this.showBackTop = scrollTop > this.scrollThreshold
    },

    // 回到顶部
    scrollToTop() {
      this.scrollTop = this.scrollTop + 1
      this.showBackTop = false
    },

    // 显示详情弹出层
    viewDetail(item) {
      this.currentDetail = {...item}
      this.showDetailPopup = true
    },

    // 关闭详情弹出层
    closeDetail() {
      this.showDetailPopup = false
      this.currentDetail = {}
    },

    // 开始生产
    handleStartProduction(task) {
      uni.navigateTo({
        url: `/pages/pro/workTask/myTaskWork?id=${task.id}`
      })
    },

    // 继续生产
    handleContinueProduction(task) {
      uni.navigateTo({
        url: `/pages/pro/workTask/myTaskWork?id=${task.id}`
      })
    },

    // 查看任务
    handleViewTask(task) {
      uni.navigateTo({
        url: `/pages/pro/workTask/myTaskWork?id=${task.id}`
      })
    },
    

  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.sticky-container {
  flex-shrink: 0;
  background: #fff;
}

.search-section {
  padding: 10rpx 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.search-input {
  flex: 1;
}

.scan-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  cursor: pointer;
}

.filter-section {
  padding: 5rpx 0rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  width: 100%;
}

.dropdown-wrapper {
  min-width: 280rpx;
  margin-right: 20rpx;

  &:last-child {
    margin-right: 0;
  }
}

:deep(.u-dropdown__content) {
  width: 100vw !important;
  left: 0 !important;
}

:deep(.u-dropdown__content__popup) {
  width: 100% !important;
}

:deep(.u-dropdown__content__popup-wrapper) {
  width: 100% !important;
}

:deep(.u-dropdown-item__options) {
  width: 100% !important;
}

:deep(.u-dropdown-item__option) {
  width: 100% !important;
  justify-content: center;
}

.date-range {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 200rpx;
  padding: 8rpx 16rpx;
  margin-right: 30rpx;
  background-color: #F8F8F8;
  border-radius: 6rpx;

  .date-text {
    font-size: 14px;
    color: #333333;
  }
}

.filter-label {
  font-size: 14px;
  color: #333333;
  white-space: nowrap;
  min-width: 80rpx;
}

.scroll-container {
  overflow: hidden;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-container {
  padding: 100rpx 30rpx;
}

.record-list {
  padding: 20rpx 30rpx;
}

.record-item {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-number {
  font-size: 18px;
  color: #333333;
  font-weight: 500;
}

.record-content {
  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
  }

  .info-label {
    width: 150rpx;
    font-size: 14px;
    color: #666666;
    flex-shrink: 0;
  }

  .info-value {
    flex: 1;
    font-size: 14px;
    color: #333333;

    &.completed {
      color: #07c160;
      font-weight: 500;
    }

    &.operator-name {
      color: #2979FF;
      font-weight: 500;
    }
  }
}

.record-actions {
  position: relative;
  margin-top: 20rpx;
}

.action-divider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1rpx;
  background-color: #F0F0F0;
}

.action-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
}

.action-time {
  color: #5a5a5a;
  flex: 1;
}

.print-btn {
  width: 120rpx;
  margin-left: auto;
}

.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
}

.no-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
}

.no-more-text {
  color: #999;
  font-size: 14px;
}

.more-tips {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
}

.more-text {
  color: #2979FF;
  font-size: 12px;
}

.back-top {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: #2979FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.3);
  z-index: 999;
}

/* 指派操作工模态框样式 */
.assign-modal {
  width: 100%;
  background-color: #fff;
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* 详情弹出层样式 */
.detail-container {
  background: #fff;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.detail-header {
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.detail-content {
  flex: 1;
  padding: 0 30rpx;
  max-height: 60vh;
}

.detail-section {
  margin: 30rpx 0;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20rpx;
  position: relative;
  padding-left: 20rpx;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4rpx;
    height: 16rpx;
    background: #2979FF;
    border-radius: 2rpx;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;

  &.full-width {
    grid-column: 1 / -1;
  }
}

.detail-label {
  font-size: 12px;
  color: #999;
}

.detail-value {
  font-size: 14px;
  color: #333;
  word-break: break-all;
}

:deep(.status-tag-detail) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
}

/* 自定义下拉内容样式 */
.dropdown-custom-content {
  padding: 10rpx 0;
  background-color: #fff;
}

.dropdown-custom-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  cursor: pointer;
  transition: background-color 0.2s;
  border-top: 1rpx solid #f0f0f0;

  &:active {
    background-color: #f0f0f0;
  }

  &.active {
    background-color: #f0f8ff;
  }
}

.option-label {
  font-size: 14px;
  color: #333;
}

.dropdown-custom-footer {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  padding: 10rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

:deep(.u-button--mini) {
  min-width: 120rpx;
}

/* 自定义导航栏样式 */
.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-text {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

/* 状态标签样式 - 放在筛选栏 */
.status-tabs-container {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-right: 20rpx;
}

.status-tab {
  padding: 8rpx 20rpx;
  margin-left: 16rpx;
  font-size: 14px;
  color: #666666;
  border-radius: 20rpx;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.status-tab.active {
  color: #2979FF;
  background-color: #e6f0ff;
  font-weight: 500;
}
</style>