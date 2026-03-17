<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="设备点检保养任务"
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
                v-model="searchKeyword"
                placeholder="任务编码/计划编码"
                :show-action="false"
                bg-color="#F8F8F8"
                border-color="#F8F8F8"
                placeholder-color="#C8C9CC"
                shape="square"
                @search="upSearch"
                class="search-input"
            />
            <view class="scan-icon" @click="upSearch">
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
              <up-dropdown ref="planTypeDropdown">
                <up-dropdown-item
                    :title="selectedPlanType.label"
                    :options="planTypeOptions"
                    @change="handlePlanTypeChange"
                    :value="selectedPlanType.value"
                />
              </up-dropdown>
            </view>
          </view>
        </view>
      </up-sticky>
    </view>

    <view class="scroll-wrapper">
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
        <view v-if="loading && tableData.length === 0" class="loading-container">
          <u-loading-icon size="28" text="加载中..."></u-loading-icon>
        </view>

        <view v-else-if="tableData.length === 0" class="empty-container">
          <u-empty
              mode="data"
              text="暂无设备点检保养任务记录"
          ></u-empty>
        </view>

        <view v-else class="record-list">
          <view
              class="record-item"
              v-for="(item, index) in tableData"
              :key="item.taskId + index"
          >
            <view class="record-header">
              <text class="order-number">计划编码：{{ item.planCode || '-' }}</text>
              <u-tag
                  :text="getPlanTypeText(item.planType)"
                  :type="getPlanTypeTagType(item.planType)"
                  size="mini"
                  class="status-tag"
              />
            </view>

            <view class="record-content" @click="handleCheck(item)">
              <view class="info-row">
                <text class="info-label">计划名称：</text>
                <text class="info-value">{{ item.planName || '-' }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">计划类型：</text>
                <text class="info-value">{{ getPlanTypeText(item.planType) }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">设备编码：</text>
                <text class="info-value">{{ item.machineryCode || '-' }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">设备名称：</text>
                <text class="info-value">{{ item.machineryName || '-' }}</text>
              </view>
            </view>

            <view class="record-actions">
              <view class="action-divider"></view>
              <view class="action-content">
                <text class="action-time">{{ formatTime(item.createTime) }}</text>
                <view class="action-buttons">
                  <u-button
                      type="primary"
                      size="small"
                      @click.stop="handleCheck(item)"
                      class="operate-btn"
                  >
                    {{ item.planType === 'CHECK' ? '点检' : '保养' }}
                  </u-button>
                </view>
              </view>
            </view>
          </view>

          <view v-if="loadingMore" class="load-more-container">
            <u-loading-icon size="24" text="正在加载更多数据..."></u-loading-icon>
          </view>

          <view v-else-if="!hasMore && tableData.length > 0" class="no-more-container">
            <text class="no-more-text">已经到底了，没有更多数据了</text>
          </view>

          <view v-else-if="hasMore && tableData.length > 0" class="more-tips">
            <text class="more-text">继续上拉加载更多数据...</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 回到顶部按钮 -->
    <view v-if="showBackTop" class="back-top" @click="scrollToTop">
      <u-icon name="arrow-upward" color="#fff" size="20"></u-icon>
    </view>

    <!-- 点检/保养弹窗 -->
    <save-dialog
        v-if="dialog.save"
        ref="saveDialog"
        @success="handleDialogSuccess"
        @closed="handleDialogClosed"
    ></save-dialog>
  </view>
</template>

<script>
import { listCheckTask, getCheckTask } from "@/api/equip/checkTask";
import saveDialog from "./save.vue";

export default {
  name: "CheckTask",
  components: { saveDialog },
  data() {
    return {
      searchKeyword: '',
      selectedPlanType: { label: '计划类型', value: 'all' },
      planTypeOptions: [
        { label: '全部', value: 'all' },
        { label: '点检计划', value: 'CHECK' },
        { label: '保养计划', value: 'MAINTEN' }
      ],
      page: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loading: false,
      loadingMore: false,
      refresherTriggered: false,
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,
      dialog: {
        save: false
      },
      currentRow: null
    };
  },
  computed: {
    hasMore() {
      return this.tableData.length < this.total;
    }
  },
  onLoad() {
    this.fetchTableData();
    this.registerRefreshListener();
  },
  onUnload() {
    uni.$off('refreshCheckTaskList');
  },
  methods: {
    registerRefreshListener() {
      uni.$on('refreshCheckTaskList', (needRefresh) => {
        if (needRefresh) {
          this.page = 1;
          this.fetchTableData();
        }
      });
    },
    handleScroll(e) {
      const scrollTop = e.detail.scrollTop;
      this.showBackTop = scrollTop > this.scrollThreshold;
    },
    formatTime(timeStr) {
      if (!timeStr) return '-';
      return timeStr.substring(0, 16);
    },
    getPlanTypeText(planType) {
      const typeMap = {
        'CHECK': '点检计划',
        'MAINTEN': '保养计划'
      };
      return typeMap[planType] || '未知类型';
    },
    getPlanTypeTagType(planType) {
      const typeMap = {
        'CHECK': 'primary',
        'MAINTEN': 'success'
      };
      return typeMap[planType] || 'info';
    },
    buildQueryParams() {
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        status: '10'
      };
      if (this.searchKeyword) {
        params.searchValue = this.searchKeyword.trim();
      }
      if (this.selectedPlanType.value !== 'all') {
        params.planType = this.selectedPlanType.value;
      }
      return params;
    },
    async fetchTableData() {
      this.loading = true;
      try {
        const params = this.buildQueryParams();
        const res = await listCheckTask(params);
        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : [];
          if (this.page === 1) {
            this.tableData = newData;
          } else {
            this.tableData = [...this.tableData, ...newData];
          }
          this.total = Number(res.total) || 0;
        } else {
          uni.showToast({ title: res.msg || '获取数据失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '网络错误，请重试', icon: 'none' });
      } finally {
        this.loading = false;
        this.refresherTriggered = false;
      }
    },
    handleScrollToLower() {
      if (this.loadingMore || !this.hasMore) return;
      this.page += 1;
      this.loadingMore = true;
      this.fetchTableData().finally(() => {
        this.loadingMore = false;
      });
    },
    scrollToTop() {
      this.scrollTop = 0;
      this.showBackTop = false;
    },
    handleRefresh() {
      this.refresherTriggered = true;
      this.page = 1;
      this.fetchTableData();
    },
    upSearch() {
      this.page = 1;
      this.fetchTableData();
    },
    handlePlanTypeChange(value) {
      const selectedOption = this.planTypeOptions.find(o => o.value === value);
      if (selectedOption) {
        this.selectedPlanType = selectedOption;
      }
      if (this.$refs.planTypeDropdown) {
        this.$refs.planTypeDropdown.close();
      }
      this.page = 1;
      this.fetchTableData();
    },
    async handleCheck(row) {
      try {
        const res = await getCheckTask(row.taskId);
        this.dialog.save = true;
        this.$nextTick(() => {
          this.$refs.saveDialog.open(row.planType == "CHECK" ? "点检任务" : "保养任务").setData(res.data);
        });
      } catch (error) {
        uni.showToast({ title: '获取任务详情失败', icon: 'none' });
      }
    },

    handleDialogClosed() {
      this.forceRepaintScroll();
    },
    handleDialogSuccess() {
      this.upSearch();
      this.forceRepaintScroll();
    },

    // 根治布局塌陷
    forceRepaintScroll() {
      setTimeout(() => {
        this.scrollTop = this.scrollTop + 1;
      }, 100);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  box-sizing: border-box;
}

.sticky-container {
  flex-shrink: 0;
  background: #fff;
}

.scroll-wrapper {
  height: calc(100vh - 180rpx);
  box-sizing: border-box;
}

.scroll-container {
  height: 100%;
  box-sizing: border-box;
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
  min-width: 140rpx;
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
  font-size: 14px;
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
    width: 170rpx;
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
  gap: 20rpx;
  padding-top: 20rpx;
}
.action-time {
  color: #5a5a5a;
  flex: 1;
}
.operate-btn {
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
.status-tag {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}
</style>