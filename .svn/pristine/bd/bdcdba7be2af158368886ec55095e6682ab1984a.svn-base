<template>
  <view class="task-report-container">
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
      <view v-if="taskReportLoading && taskReportList.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <!-- 空数据状态 -->
      <view v-else-if="taskReportList.length === 0" class="empty-container">
        <u-empty
            mode="data"
            text="暂无报工记录"
        >
        </u-empty>
      </view>

      <!-- 报工记录列表 -->
      <view v-else class="record-list">
        <view
            class="record-item"
            v-for="(item, index) in taskReportList"
            :key="item.id"
        >
          <view class="record-header">
            <!-- 序号 -->
            <view class="task-index">{{ (pageNum - 1) * pageSize + index + 1 }}</view>
            <view class="task-report-batch-info">
              <text class="batch-code">{{ item.batchNo || '' }}</text>
            </view>
            <text class="task-report-time">{{ item.reportTime }}</text>
          </view>

          <view class="record-content">
            <view class="info-row">
              <text class="info-label">工单号：</text>
              <text class="info-value">{{ item.workOrderNo || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">任务单号：</text>
              <text class="info-value">{{ item.taskNo || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品编码：</text>
              <text class="info-value">{{ item.productCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品名称：</text>
              <text class="info-value">{{ item.productName || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品规格：</text>
              <text class="info-value">{{ item.productSpec || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">报工净重：</text>
              <text class="info-value">{{ item.reportQty || 0 }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">合格数量：</text>
              <text class="info-value">{{ item.qualifiedQty || 0 }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">不良品数：</text>
              <text class="info-value">{{ item.defectiveQty || 0 }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">报工人：</text>
              <text class="info-value">{{ item.reportOperName || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">执行班次：</text>
              <text class="info-value">{{ item.execShift || '-' }}</text>
            </view>
          </view>

          <view class="record-actions">
            <view class="action-divider"></view>
            <view class="action-content">
              <text class="action-time">{{ item.reportTime }}</text>
            </view>
          </view>
        </view>

        <!-- 加载更多状态 -->
        <view v-if="taskReportLoading && taskReportList.length > 0" class="load-more-container">
          <u-loading-icon size="24" text="正在加载更多数据..."></u-loading-icon>
        </view>

        <!-- 没有更多数据提示 -->
        <view v-else-if="!hasMore && taskReportList.length > 0" class="no-more-container">
          <text class="no-more-text">已经到底了，没有更多数据了</text>
        </view>

        <!-- 还有更多数据提示 -->
        <view v-else-if="hasMore && taskReportList.length > 0" class="more-tips">
          <text class="more-text">继续上拉加载更多数据...</text>
        </view>
      </view>
    </scroll-view>

    <!-- 回到顶部按钮 -->
    <view v-if="showBackTop" class="back-top" @click="scrollToTop">
      <u-icon name="arrow-upward" color="#fff" size="20"></u-icon>
    </view>

    <!-- 全局加载提示 -->
    <up-toast ref="uToast"></up-toast>
  </view>
</template>

<script>
import { getTaskReportByTaskId } from '@/api/pro/taskReport'
import {getUserProfile} from "@/api/system/user";

export default {
  name: 'TaskReportList',
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: {},
      // 报工记录相关
      taskReportList: [], // 报工记录列表
      taskReportLoading: false, // 报工记录加载状态
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页大小
      hasMore: true, // 是否有更多数据
      total: 0, // 总数据量
      refresherTriggered: false, // 下拉刷新状态
      // 滚动相关
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,
    }
  },
  computed: {
    hasMoreData() {
      // 当没有数据时，不需要加载更多
      if (this.total === 0) return false
      // 当当前列表长度小于总数时，还有更多数据
      return this.taskReportList.length < this.total
    },
  },
  methods: {
    async getUser() {
      await getUserProfile().then(response => {
        const data = response.data;
        this.user = data.user
        this.roleGroup = data.roleGroup
        this.postGroup = data.postGroup
      }).catch(error => {
        console.error('获取用户信息失败:', error)
        this.$refs.uToast.show({
          type: 'error',
          message: '获取用户信息失败'
        })
      })
    },
    // 加载报工记录
    async loadTaskReportList() {
      await this.getUser();
      // 计算总页数，确保页码不会溢出
      const totalPages = Math.ceil(this.total / this.pageSize) || 1
      const currentPage = this.pageNum
      
      // 如果已经是最后一页，直接标记为没有更多数据，不执行加载
      if (currentPage > totalPages && this.total > 0) {
        this.taskReportLoading = false
        this.hasMore = false
        return Promise.resolve()
      }

      this.taskReportLoading = true
      try {
        const params = {
          taskId: this.taskId,
          reportOperId : this.user.userId,
          pageNum: currentPage,
          pageSize: this.pageSize
        }
        const res = await getTaskReportByTaskId(params)
        if (res.code === 200) {
          const newRows = Array.isArray(res.rows) ? res.rows : []
          const total = Number(res.total) || 0
          const totalPages = Math.ceil(total / this.pageSize) || 1
          
          this.total = total
          
          // 检查API返回的页码是否与请求的页码一致
          const apiPage = Number(res.page) || 1
          
          if (apiPage !== currentPage && currentPage > 1) {
            console.warn('API returned wrong page:', { requestedPage: currentPage, returnedPage: apiPage })
            this.hasMore = false
            return
          }
          
          if (currentPage <= totalPages) {
            if (currentPage === 1) {
              // 只有在页码为1时，才重置列表数据
              this.taskReportList = newRows
            } else {
              // 其他情况下，只追加新数据
              const existingIds = new Set(this.taskReportList.map(item => item.id))
              const uniqueNewRows = newRows.filter(item => !existingIds.has(item.id))
              this.taskReportList = [...this.taskReportList, ...uniqueNewRows]
            }
            
            // 精确计算hasMore状态
            this.hasMore = newRows.length > 0 && currentPage < totalPages && this.taskReportList.length < total
          } else {
            this.hasMore = false
          }
          
          // 特别处理：如果当前页码已经是总页数，直接标记为没有更多数据
          if (currentPage >= totalPages) {
            this.hasMore = false
          }
        } else {
          this.$refs.uToast.show({
            type: 'error',
            message: res.msg || '加载报工记录失败'
          })
          if (this.pageNum === 1) {
            this.taskReportList = []
          }
        }
      } catch (error) {
        console.error('加载报工记录失败:', error)
        this.$refs.uToast.show({
          type: 'error',
          message: '网络错误，请重试'
        })
        if (this.pageNum === 1) {
          this.taskReportList = []
        }
      } finally {
        this.taskReportLoading = false
        this.refresherTriggered = false
      }
    },
    // 刷新数据
    refresh() {
      this.pageNum = 1
      this.hasMore = true
      this.loadTaskReportList()
    },
    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true
      this.pageNum = 1
      this.hasMore = true
      this.loadTaskReportList()
    },
    // 滚动到底部加载更多
    handleScrollToLower() {
      // 确保没有正在加载，并且还有更多数据
      if (this.taskReportLoading || !this.hasMore) {
        return
      }

      this.pageNum += 1
      this.loadTaskReportList()
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
    }
  },
  // 组件挂载时自动加载数据
  mounted() {
    this.loadTaskReportList()
  }
}
</script>

<style lang="scss" scoped>
.task-report-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #f5f7fa;
}

/* 滚动区域 */
.scroll-container {
  height: calc(100vh - 150rpx);
  overflow: hidden;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

/* 空数据状态 */
.empty-container {
  padding: 100rpx 30rpx;
}

/* 记录列表 */
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
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

/* 序号样式 */
.task-index {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #2979FF;
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.task-report-time {
  font-size: 24rpx;
  color: #666;
}

.batch-code {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-right: 12rpx;
}

.task-report-batch-info {
  flex: 1;
  display: flex;
  align-items: center;
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

/* 加载更多状态 */
.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
}

/* 没有更多数据提示 */
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

/* 还有更多数据提示 */
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

/* 回到顶部按钮 */
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
</style>