<template>
  <view class="page">
    <!-- 安全区域顶部 -->
    <view class="safe-area-top"></view>
    <!-- 固定操作+搜索栏（按目标样式调整布局） -->
    <view class="search-bar fixed">
      <view class="search-input-wrapper">
        <uni-icons name="search" size="16" color="#999" class="search-icon"></uni-icons>
        <input type="text" v-model="searchQuery" placeholder="领料单编号/领料单名称" class="search-input" />
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
          <text class="empty-text">暂无领料记录</text>
        </view>

        <!-- 列表内容 -->
        <view v-else class="task-list">
          <view class="task-item" v-for="(task, index) in tableData" :key="task.issueId">
            <!-- 任务头部 -->
            <view class="task-header">
              <!-- 序号 -->
              <view class="task-index">{{ index + 1 }}</view>
              <!-- 领料单核心信息 -->
              <view class="task-no-wrapper">
                <uni-icons name="list" size="16" color="#007aff" class="task-icon"></uni-icons>
                <text class="task-no">{{ task.issueId || '-' }}</text>
              </view>
              <!-- 单据状态 -->
              <view class="status-info">
                <view class="status-tag" :class="getStatusClass(task.status)">
                  {{ getStatusText(task.status) }}
                </view>
              </view>
            </view>

            <!-- 任务内容（领料明细） -->
            <view class="task-content">
              <view class="content-row">
                <view class="content-item">
                  <text class="label">批次号:</text>
                  <text class="value">{{ task.materialLines[0]?.batchCode || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">产品物料编码:</text>
                  <text class="value">{{ task.materialLines[0]?.itemCode || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">产品物料名称:</text>
                  <text class="value">{{ task.materialLines[0]?.itemName || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">规格型号:</text>
                  <text class="value">{{ task.materialLines[0]?.specification || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">毛重:</text>
                  <text class="value">{{ task.materialLines[0]?.grossWeight || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">净重:</text>
                  <text class="value">{{ task.materialLines[0]?.netWeight || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">盘重:</text>
                  <text class="value">{{ task.materialLines[0]?.tareWeight || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">单位:</text>
                  <text class="value">{{ task.materialLines[0]?.unitOfMeasure || '-' }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">领料日期:</text>
                  <text class="value">{{ formatDate(task.createTime) }}</text>
                </view>
              </view>
              <view class="content-row">
                <view class="content-item">
                  <text class="label">领料人:</text>
                  <text class="value">{{ task.createByName || '-' }}</text>
                </view>
              </view>
            </view>

            <!-- 任务操作（保持目标样式布局结构） -->
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
import {listIssueheader} from "@/api/wms/issueheader";
import {getUserProfile} from "@/api/system/user";
// 引入字典映射（若项目有全局字典，可直接使用）
const mesIssueStatusDict = [
  { label: '待出库', value: 'PREPARE' },
  { label: '已出库', value: 'FINISHED' },
];

export default {
  name: 'Issueheader',
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
      dateFilterIndex: 0,
      statusFilterIndex: 0,
      filterForm: {},
      filterLength: 0,

      // 选中项
      selection: [],
      currentSelectTask: null,
      isEdit: false,

      // 弹窗状态
      popupState: {
        save: false,
        detail: false,
        filter: false
      },
      user: {},
    };
  },
  computed: {
  },
  async onLoad() {
    await this.getUser();
    await this.fetchTableData();
    // 初始化筛选表单长度
    this.calcFilterLength();
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
    // 计算筛选条件长度
    calcFilterLength() {
      this.filterLength = Object.keys(this.filterForm).filter(key => !!this.filterForm[key]).length;
    },


    // 构造查询参数
    buildQueryParams() {
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        searchValue: this.searchQuery || undefined,
        createBy: this.user?.userId || '',
      };

      // 移除空值参数
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '' || params[key] === null) {
          delete params[key];
        }
      });

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
      console.info("入参参数："+JSON.stringify(params))
      return listIssueheader(params)
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
                  const existingIds = new Set(this.tableData.map(item => item.issueId));
                  const uniqueNewRows = newRows.filter(item => !existingIds.has(item.issueId));
                  this.tableData = [...this.tableData, ...uniqueNewRows];
                }

                // 更新加载状态
                const currentLength = this.tableData.length;
                this.hasMore = newRows.length > 0 && currentPage < updatedTotalPages && currentLength < total;
              } else {
                this.hasMore = false;
              }
            } else {
              uni.showToast({ title: res.msg || '加载失败', icon: 'none' });
            }
          })
          .catch((error) => {
            console.error('加载领料记录失败:', error);
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

    // 获取状态文本
    getStatusText(status) {
      const item = mesIssueStatusDict.find(item => item.value === status);
      return item ? item.label : '-';
    },

    // 获取状态样式类
    getStatusClass(status) {
      switch (status) {
        case 'PREPARE':
          return 'status-pending';
        case 'FINISHED':
          return 'status-success';
        default:
          return 'status-default';
      }
    }
  }
};
</script>

<style scoped>
page {
  height: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 安全区域适配（完全复用目标样式） */
.safe-area-top {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #fff;
}

/* 页面主容器（完全复用目标样式） */
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  position: relative; /* 为浮动按钮定位 */
}

/* 搜索栏固定（完全复用目标样式，仅保留筛选按钮布局兼容） */
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

/* H5环境下搜索栏调整（完全复用目标样式） */
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
  margin-right: 10rpx;
}

/* 筛选按钮样式兼容，不破坏目标整体风格 */
.filter-btn {
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
  background-color: #f5f5f5;
  color: #333;
}

/* 滚动区域（完全复用目标样式） */
.scroll-view {
  height: calc(100vh - calc(var(--status-bar-height) + 100rpx));
  margin-top: calc(var(--status-bar-height) + 100rpx);
  background-color: #f5f5f5;
  /* 确保滚动位置稳定，防止内容跳动 */
  overflow-anchor: none;
  /* 优化滚动行为，避免不必要的滚动事件 */
  -webkit-overflow-scrolling: touch;
}

/* H5环境下scroll-view调整（完全复用目标样式） */
/* #ifdef H5 */
.scroll-view {
  height: calc(100vh - calc(var(--status-bar-height) + 100rpx + 40px));
  margin-top: calc(var(--status-bar-height) + 100rpx + 40px);
}
/* #endif */

/* 列表容器（完全复用目标样式） */
.list {
  background-color: #f5f5f5;
  min-height: 100%;
  max-height: 100%;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 加载状态（完全复用目标样式） */
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

/* 空数据状态（完全复用目标样式，仅修改文本内容） */
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

/* 任务列表（完全复用目标样式） */
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

/* 序号样式（完全复用目标样式） */
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

/* 任务头部（完全复用目标样式，保留状态显示） */
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

/* 状态信息容器（兼容目标样式布局，新增状态标签样式） */
.status-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.status-tag {
  padding: 5rpx 10rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.status-pending {
  background-color: #fff7e6;
  color: #ff9900;
}

.status-success {
  background-color: #e6f4ea;
  color: #00cc66;
}

.status-invalid {
  background-color: #fef0f0;
  color: #ff3333;
}

.status-default {
  background-color: #f5f5f5;
  color: #999;
}

/* 任务内容（完全复用目标样式） */
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
  text-align: right; /* 核心保留：值靠右对齐 */
}

/* 操作按钮区域（完全复用目标样式） */
.task-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

/* 加载更多样式（完全复用目标样式） */
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

/* 没有更多数据（完全复用目标样式） */
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