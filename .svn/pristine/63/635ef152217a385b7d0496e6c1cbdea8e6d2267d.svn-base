<template>
  <view class="page">
    <!-- 安全区域顶部 -->
    <view class="safe-area-top"></view>
    <!-- 固定搜索栏 -->
    <view class="search-bar fixed">
      <view class="search-input-wrapper">
        <uni-icons name="search" size="16" color="#999" class="search-icon"></uni-icons>
        <input type="text" v-model="searchQuery" placeholder="任务单编码/产品编码/产品名称" class="search-input"/>
      </view>
      <button class="search-btn" @click="handleSearch">
        <u-icon name="search" size="20" color="#fff"></u-icon>
      </button>
    </view>

    <!-- 列表区域 -->
    <scroll-view
        class="scroll-view"
        scroll-y
        :refresher-enabled="true"
        :refresher-triggered="refresherTriggered"
        @refresherrefresh="onRefresherRefresh"
        @scrolltolower="onScrollToLower"
        ref="scrollView"
        refresher-threshold="45"
        refresher-default-style="black"
    >
      <view class="list" :style="{ paddingTop: '0' }">
        <!-- 加载状态 -->
        <view v-if="loadingStatus && tableData.length === 0" class="loading-container">
          <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 空数据状态 -->
        <view v-else-if="tableData.length === 0" class="empty-container">
          <uni-icons name="none" size="64" color="#ccc"></uni-icons>
          <text class="empty-text">暂无报工数据</text>
        </view>

        <!-- 列表内容 -->
        <view v-else class="task-list">
          <view class="task-item" v-for="(task, index) in tableData" :key="task.id">
            <!-- 任务头部 -->
            <view class="task-header">
              <!-- 序号 -->
              <view class="task-index">{{ index + 1 }}</view>
              <!-- 任务单编码 -->
              <view class="task-no-wrapper">
                <uni-icons name="list" size="16" color="#007aff" class="task-icon"></uni-icons>
                <text class="task-no">{{ task.taskNo || '-' }}</text>
              </view>
              <!-- 空的状态信息容器（保持布局一致） -->
              <view class="status-info"></view>
            </view>

            <!-- 任务内容 -->
            <view class="task-content">
              <view class="content-row">
                <view class="content-item">
                  <text class="label">工序名称:</text>
                  <text class="value">{{ task.processName || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">产品编码:</text>
                  <text class="value">{{ task.productCode || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">产品名称:</text>
                  <text class="value">{{ task.productName || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">产品名称:</text>
                  <text class="value">{{ task.productName || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">报工净重:</text>
                  <text class="value">{{ task.reportQty || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">合格数量:</text>
                  <text class="value">{{ task.qualifiedQty || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">不良品数量:</text>
                  <text class="value">{{ task.defectiveQty || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">报工人:</text>
                  <text class="value">{{ task.reportOperName || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">报工时间:</text>
                  <text class="value">{{ formatDate(task.reportTime) }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">创建时间:</text>
                  <text class="value">{{ formatDate(task.createTime) }}</text>
                </view>
              </view>
              <view class="content-row" v-if="task.remark">
                <view class="content-item">
                  <text class="label">备注:</text>
                  <text class="value">{{ task.remark || '-' }}</text>
                </view>
              </view>
            </view>

            <!-- 任务操作（空容器保持布局一致） -->
            <view class="task-footer"></view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view class="load-more" v-if="hasMore && tableData.length > 0">
          <view class="load-more-content" v-if="loadingStatus">
            <uni-loading type="spinner" color="#007aff" size="20"></uni-loading>
            <text class="load-more-text">加载中...</text>
          </view>
          <button v-else class="load-more-btn" @click="loadMore" :disabled="loadingStatus || !hasMore">
            <uni-icons name="more" size="16" color="#666"></uni-icons>
            加载更多
          </button>
        </view>

        <!-- 没有更多数据 -->
        <view class="no-more" v-if="!hasMore && tableData.length > 0">
          <text class="no-more-text">没有更多数据了</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {listProTaskReport,deleteProTaskReport} from '@/api/pro/taskReport'
import {listAllProcess} from '@/api/production/process'
import {getUserProfile} from "@/api/system/user";

export default {
  name: 'proTaskReport',
  data() {
    return {
      // 搜索相关
      searchQuery: '',
      page: 1,
      pageSize: 10,
      total: 0,
      loadingStatus: false,
      hasMore: true,
      tableData: [],
      refresherTriggered: false,

      // 筛选相关
      dateRangeIndex: 0,
      processIndex: [],
      processOptions: [[{ label: "全部", value: "" }]],
      filterForm: {},
      filterLength: 0,

      // 选择的行数据
      selection: [],
      // 当前删除的行数据
      currentDeleteRow: null,
      // 弹窗状态
      popupState: {
        save: false,
        detail: false
      },
      user: {},
      roleGroup: '',
      postGroup: ''
    }
  },
  async onLoad() {
    // 确保先加载用户信息，再执行后续初始化
    await this.getUser();
    await this.loadProcessList();
    await this.fetchTableData();
  },
  onUnload() {
    // 清理事件监听
  },
  methods: {
    async getUser() {
      try {
        const response = await getUserProfile();
        const data = response.data;
        this.user = data.user;
        this.roleGroup = data.roleGroup;
        this.postGroup = data.postGroup;
      } catch (error) {
        console.error('获取用户信息失败:', error);
        uni.showToast({ title: '获取用户信息失败', icon: 'none' });
      }
    },
    // 加载工序列表
    async loadProcessList() {
      try {
        const response = await listAllProcess();
        const processList = response.data || [];
        const processOptions = processList.map(item => ({
          label: item.processName,
          value: item.processCode
        }));
        this.processOptions = [[
          { label: "全部", value: "" },
          ...processOptions
        ]];
      } catch (error) {
        console.error('加载工序选项失败:', error);
        uni.showToast({ title: '加载工序选项失败', icon: 'none' });
      }
    },
    // 构造查询参数
    buildQueryParams() {
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        reportOperId: this.user?.userId || '', // 增加可选链避免undefined
        searchValue: this.searchQuery || undefined,
        processCode: this.processIndex.length > 0
            ? this.processOptions[0][this.processIndex[0]].value
            : ''
      };

      return params;
    },

    // 获取列表数据
    fetchTableData() {
      if (this.loadingStatus) return Promise.resolve();

      this.loadingStatus = true;

      // 计算总页数
      const totalPages = Math.ceil(this.total / this.pageSize) || 1;
      const currentPage = this.page;

      // 检查是否已到最后一页
      if (currentPage > totalPages && this.total > 0) {
        this.loadingStatus = false;
        this.hasMore = false;
        return Promise.resolve();
      }

      // 构造查询参数
      const params = this.buildQueryParams();
      return listProTaskReport(params)
          .then(res => {
            if (res.code === 200) {
              const newRows = Array.isArray(res.rows) ? res.rows : [];
              const total = Number(res.total) || 0;
              const updatedTotalPages = Math.ceil(total / this.pageSize) || 1;

              this.total = total;

              // 检查页码一致性
              const apiPage = Number(res.page) || 1;
              if (apiPage !== currentPage && currentPage > 1) {
                console.warn('API返回错误页码:', { requestedPage: currentPage, returnedPage: apiPage });
                this.hasMore = false;
                return;
              }

              // 更新数据
              if (currentPage <= updatedTotalPages) {
                if (currentPage === 1) {
                  this.tableData = newRows;
                } else {
                  const existingIds = new Set(this.tableData.map(item => item.id));
                  const uniqueNewRows = newRows.filter(item => !existingIds.has(item.id));
                  this.tableData = [...this.tableData, ...uniqueNewRows];
                }

                // 更新加载状态
                const currentLength = this.tableData.length;
                this.hasMore = newRows.length > 0 && currentPage < updatedTotalPages && currentLength < total;
              } else {
                this.hasMore = false;
              }

              if (currentPage >= updatedTotalPages) {
                this.hasMore = false;
              }
            } else {
              uni.showToast({ title: res.msg || '加载失败', icon: 'none' });
            }
          })
          .catch((error) => {
            console.error('加载报工列表失败:', error);
            uni.showToast({ title: '网络错误', icon: 'none' });
          })
          .finally(() => {
            this.loadingStatus = false;
          });
    },

    // 搜索
    handleSearch() {
      this.refreshAllData();
    },

    // 下拉刷新
    onRefresherRefresh() {
      if (this.refresherTriggered) return;

      this.refresherTriggered = true;
      this.page = 1;
      this.hasMore = true;

      this.fetchTableData().finally(() => {
        this.refresherTriggered = false;
        setTimeout(() => {
          const scrollViewRef = this.$refs.scrollView;
          if (scrollViewRef && typeof scrollViewRef.scrollTo === 'function') {
            scrollViewRef.scrollTo({ scrollTop: 0, duration: 0 });
          }
        }, 100);
      });
    },

    // 滚动到底部加载更多
    onScrollToLower() {
      if (this.hasMore && !this.loadingStatus) {
        this.loadMore();
      }
    },

    // 加载更多
    loadMore() {
      if (!this.hasMore || this.loadingStatus) return;

      if (this.tableData.length >= this.total) {
        this.hasMore = false;
        return;
      }

      const totalPages = Math.ceil(this.total / this.pageSize) || 1;
      const currentPage = this.page;
      const nextPage = currentPage + 1;

      if (currentPage >= totalPages || nextPage > totalPages) {
        this.hasMore = false;
        return;
      }

      this.page = nextPage;
      this.fetchTableData();
    },

    // 刷新所有数据
    refreshAllData() {
      this.page = 1;
      this.hasMore = true;
      this.total = 0;
      this.tableData = [];
      this.fetchTableData();
    },
    // 关闭保存弹窗
    closeSavePopup() {
      this.$refs.savePopup.close();
      this.popupState.save = false;
    },

    // 操作成功回调
    handleSuccess() {
      this.closeSavePopup();
      this.refreshAllData();
      uni.showToast({ title: '操作成功', icon: 'success' });
    },

    // 格式化日期
    formatDate(value) {
      if (!value) return '-';
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },

    // 打开新增页面（空方法保持布局完整性）
    openAddPage() {
      // 可根据实际业务逻辑补充
    }
  }
}
</script>

<style scoped>
page {
  height: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 安全区域适配 */
.safe-area-top {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #fff;
}

/* 页面主容器 */
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  position: relative; /* 为浮动按钮定位 */
}

/* 搜索栏固定 */
.search-bar.fixed {
  position: fixed;
  top: var(--status-bar-height);
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  height: 100rpx;
  box-sizing: border-box;
}

/* H5环境下搜索栏调整 */
/* #ifdef H5 */
.search-bar.fixed {
  top: calc(var(--status-bar-height) + 40px);
}
/* #endif */

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  margin-right: 20rpx;
  height: 72rpx;
}

.search-icon {
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
  color: #333;
  background-color: transparent;
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  width: 72rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007aff;
  color: #fff;
}

/* 滚动区域 */
.scroll-view {
  height: calc(100vh - calc(var(--status-bar-height) + 100rpx));
  margin-top: calc(var(--status-bar-height) + 100rpx);
  background-color: #f5f5f5;
  /* 确保滚动位置稳定，防止内容跳动 */
  overflow-anchor: none;
  /* 优化滚动行为，避免不必要的滚动事件 */
  -webkit-overflow-scrolling: touch;
}

/* H5环境下scroll-view调整 */
/* #ifdef H5 */
.scroll-view {
  height: calc(100vh - calc(var(--status-bar-height) + 100rpx + 40px));
  margin-top: calc(var(--status-bar-height) + 100rpx + 40px);
}
/* #endif */

/* 列表容器 */
.list {
  background-color: #f5f5f5;
  min-height: 100%;
  max-height: 100%;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0 60rpx;
}
.loading-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 空数据状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 0 60rpx;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 任务列表 */
.task-list {
  padding: 0 20rpx 20rpx;
}
.task-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

/* 序号样式 */
.task-index {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #007aff;
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

/* 任务头部 */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.task-no-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
}
.task-icon {
  margin-right: 12rpx;
}
.task-no {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 状态信息容器 */
.status-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

/* 任务内容 */
.task-content {
  margin-bottom: 24rpx;
}
.content-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.content-row:last-child {
  margin-bottom: 0;
}
.content-item {
  flex: 1;
  display: flex;
  align-items: flex-start;
  font-size: 26rpx;
}
.content-item:first-child {
  margin-right: 20rpx;
}
.label {
  color: #666;
  min-width: 120rpx;
  margin-right: 12rpx;
  word-break: keep-all;
  line-height: 1.4;
}
.value {
  color: #333;
  flex: 1;
  word-break: break-all;
  line-height: 1.4;
  text-align: right; /* 核心修改：值靠右对齐 */
}

/* 操作按钮区域 */
.task-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

/* 加载更多样式 */
.load-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
  background-color: #f5f5f5;
}
.load-more-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}
.load-more-text {
  font-size: 26rpx;
  color: #999;
}
.load-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240rpx;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 28rpx;
  background-color: #f8f9fa;
  color: #666;
  border-radius: 36rpx;
  padding: 0;
  border: 1rpx solid #e9ecef;
  gap: 8rpx;
}

/* 没有更多数据 */
.no-more {
  text-align: center;
  padding: 30rpx 0;
  background-color: #f5f5f5;
}
.no-more-text {
  font-size: 26rpx;
  color: #999;
}

</style>