<template>
  <view class="repair-container">
    <!-- 顶部筛选区域 -->
    <view class="filter-header">
      <!-- 快速筛选栏 -->
      <view class="quick-filter">
        <view class="filter-item">
          <text class="filter-label">报修来源：</text>
          <u-select
              v-model="search.reportRepairSource"
              :list="reportRepairSourceList"
              placeholder="全部"
              @confirm="handleQuickFilter"
              confirm-color="#2979FF"
              class="filter-select"
          ></u-select>
        </view>

        <view class="filter-item">
          <text class="filter-label">维修结果：</text>
          <u-select
              v-model="search.repairResult"
              :list="repairResultList"
              placeholder="全部"
              @confirm="handleQuickFilter"
              confirm-color="#2979FF"
              class="filter-select"
          ></u-select>
        </view>
      </view>

      <!-- 搜索栏 -->
      <view class="search-bar">
        <u-search
            v-model="search.searchValue"
            placeholder="报修单编号/报修单名称"
            @search="upSearch"
            :show-action="true"
            action-text="搜索"
        ></u-search>

        <!-- 高级筛选按钮 -->
        <u-button
            type="primary"
            size="mini"
            icon="filter"
            @click="openAdvancedFilter"
            class="filter-btn"
        >
          <u-badge
              :count="filterLength"
              type="danger"
              :dot="filterLength > 0"
              class="filter-badge"
          ></u-badge>
        </u-button>
      </view>
    </view>

    <!-- 列表内容 -->
    <scroll-view
        class="list-scroll-container"
        scroll-y
        refresher-enabled
        :refresher-triggered="refresherTriggered"
        @refresherrefresh="handleRefresh"
        @scrolltolower="handleLoadMore"
    >
      <!-- 加载中 -->
      <view v-if="loading && listData.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <!-- 空数据 -->
      <view v-else-if="listData.length === 0" class="empty-container">
        <u-empty mode="list" text="暂无维修单记录"></u-empty>
      </view>

      <!-- 列表项 -->
      <view v-else class="list-content">
        <view
            class="list-item"
            v-for="(item, index) in listData"
            :key="item.repairId + index"
        >
          <!-- 列表项头部（基础信息） -->
          <view class="item-header">
            <view class="basic-info">
              <text class="repair-code">{{ item.repairCode || '-' }}</text>
              <text class="repair-name">{{ item.repairName || '-' }}</text>
            </view>

            <view class="status-tag">
              <u-tag
                  :text="getStatusText(item.status)"
                  :type="getStatusType(item.status)"
                  size="mini"
              ></u-tag>
            </view>
          </view>

          <!-- 列表项详情 -->
          <view class="item-details">
            <view class="detail-row">
              <text class="label">设备信息：</text>
              <text class="value">{{ item.machineryCode || '-' }} / {{ item.machineryName || '-' }}</text>
            </view>

            <view class="detail-row">
              <text class="label">报修来源：</text>
              <text class="value">{{ getDictText(reportRepairSourceList, item.reportRepairSource) || '-' }}</text>
            </view>

            <view class="detail-row">
              <text class="label">报修日期：</text>
              <text class="value">{{ item.requireDate || '-' }}</text>
            </view>

            <view class="detail-row" v-if="item.finishDate">
              <text class="label">完成日期：</text>
              <text class="value">{{ item.finishDate || '-' }}</text>
            </view>

            <view class="detail-row" v-if="item.confirmDate">
              <text class="label">验收日期：</text>
              <text class="value">{{ item.confirmDate || '-' }}</text>
            </view>

            <view class="detail-row">
              <text class="label">维修结果：</text>
              <text class="value">{{ getDictText(repairResultList, item.repairResult) || '-' }}</text>
            </view>

            <view class="detail-row" v-if="item.acceptName">
              <text class="label">维修人员：</text>
              <text class="value">{{ item.acceptName || '-' }}</text>
            </view>

            <view class="detail-row" v-if="item.confirmBy">
              <text class="label">验收人员：</text>
              <text class="value">{{ item.confirmBy || '-' }}</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="item-actions">
            <u-button
                v-if="'40' == item.status && !item.confirmBy"
                type="primary"
                size="mini"
                @click="handleAccept(item)"
                class="action-btn accept-btn"
            >验收</u-button>

            <u-button
                v-if="'40' == item.status && item.confirmBy"
                type="default"
                size="mini"
                @click="handleDetail(item)"
                class="action-btn detail-btn"
            >详情</u-button>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="loadingMore" class="load-more-container">
          <u-loading-icon size="24" text="加载更多..."></u-loading-icon>
        </view>

        <!-- 没有更多 -->
        <view v-else-if="!hasMore && listData.length > 0" class="no-more-container">
          <text class="no-more-text">已经到底了，没有更多数据了</text>
        </view>
      </view>
    </scroll-view>

    <!-- 高级筛选弹窗 -->
    <u-popup
        v-model="advancedFilterVisible"
        mode="bottom"
        :round="16"
        :safe-area-inset-bottom="true"
    >
      <view class="advanced-filter-container">
        <view class="filter-header-title">
          <text class="title-text">高级筛选</text>
          <u-icon
              name="close"
              size="24"
              color="#666"
              @click="advancedFilterVisible = false"
              class="close-icon"
          ></u-icon>
        </view>

        <scroll-view class="filter-form-container" scroll-y>
          <u-form
              ref="filterForm"
              :model="advancedFilterForm"
              label-width="100rpx"
              label-position="left"
          >
            <u-form-item label="设备编码" borderBottom>
              <u-input
                  v-model="advancedFilterForm.machineryCode"
                  placeholder="请输入设备编码"
              ></u-input>
            </u-form-item>

            <u-form-item label="设备名称" borderBottom>
              <u-input
                  v-model="advancedFilterForm.machineryName"
                  placeholder="请输入设备名称"
              ></u-input>
            </u-form-item>

            <u-form-item label="维修人员" borderBottom>
              <u-input
                  v-model="advancedFilterForm.acceptName"
                  placeholder="请输入维修人员"
              ></u-input>
            </u-form-item>

            <u-form-item label="验收人员" borderBottom>
              <u-input
                  v-model="advancedFilterForm.confirmBy"
                  placeholder="请输入验收人员"
              ></u-input>
            </u-form-item>
          </u-form>
        </scroll-view>

        <view class="filter-actions">
          <u-button
              type="default"
              @click="resetAdvancedFilter"
              class="filter-btn reset-btn"
          >重置</u-button>

          <u-button
              type="primary"
              @click="confirmAdvancedFilter"
              class="filter-btn confirm-btn"
          >确认筛选</u-button>
        </view>
      </view>
    </u-popup>

    <!-- 详情/验收弹窗 -->
    <save-dialog
        v-if="dialog.save"
        ref="saveDialog"
        @success="upSearch"
        @closed="dialog.save = false"
    ></save-dialog>
  </view>
</template>

<script>
import repairAPI from "@/api/equip/repair";
import saveDialog from "./save.vue";

export default {
  name: "Repair",
  components: {
    saveDialog
  },
  data() {
    return {
      // 弹窗控制
      dialog: {
        save: false
      },
      // API对象
      apiObj: repairAPI.listRepair,
      // 操作ID
      operationIds: null,
      // 表单数据
      form: {},
      // 搜索参数
      search: {
        status: '40',
        searchValue: null,
        reportRepairSource: '',
        repairResult: '',
        queryParams: {},
        pageNum: 1,
        pageSize: 10
      },
      // 高级筛选表单
      advancedFilterForm: {
        machineryCode: '',
        machineryName: '',
        acceptName: '',
        confirmBy: ''
      },
      // 高级筛选弹窗显示状态
      advancedFilterVisible: false,
      // 列表数据
      listData: [],
      // 加载状态
      loading: true,
      // 加载更多状态
      loadingMore: false,
      // 下拉刷新状态
      refresherTriggered: false,
      // 总条数
      total: 0,
      // 字典列表
      reportRepairSourceList: [
        { label: '生产维修', value: '01' },
        { label: '点检维修', value: '02' },
        { label: '保养维修', value: '03' }
      ],
      repairResultList: [
        { label: '修复成功', value: 'SUCCESS' },
        { label: '报废', value: 'FAILURE' },
        { label: '待维修', value: 'PENDING' }
      ],
      // 单据状态映射
      statusMap: {
        '20': { text: '待审批', type: 'warning' },
        '30': { text: '维修中', type: 'primary' },
        '40': { text: '待验收', type: 'info' },
        '50': { text: '已完成', type: 'success' }
      }
    };
  },

  computed: {
    // 是否还有更多数据
    hasMore() {
      return this.listData.length < this.total;
    },
    // 筛选条件数量
    filterLength() {
      let count = 0;
      Object.keys(this.advancedFilterForm).forEach(key => {
        if (this.advancedFilterForm[key]) {
          count++;
        }
      });
      return count;
    }
  },

  onLoad() {
    // 初始化加载数据
    this.fetchListData();
  },

  methods: {
    // 获取列表数据
    async fetchListData() {
      // 首次加载显示加载状态
      if (this.search.pageNum === 1) {
        this.loading = true;
      } else {
        this.loadingMore = true;
      }

      try {
        // 构建请求参数
        const requestParams = {
          ...this.search,
          ...this.advancedFilterForm
        };

        // 调用API获取数据
        const res = await this.apiObj(requestParams);

        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : [];
          this.total = Number(res.total) || 0;

          // 分页处理
          if (this.search.pageNum === 1) {
            this.listData = newData;
          } else {
            this.listData = [...this.listData, ...newData];
          }
        } else {
          uni.showToast({
            title: res.msg || '获取数据失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取维修单列表失败:', error);
        uni.showToast({
          title: '获取数据失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        this.loadingMore = false;
        this.refresherTriggered = false;
      }
    },

    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true;
      this.search.pageNum = 1;
      this.fetchListData();
    },

    // 上拉加载更多
    handleLoadMore() {
      if (this.loadingMore || !this.hasMore) return;

      this.search.pageNum += 1;
      this.fetchListData();
    },

    // 快速筛选
    handleQuickFilter() {
      this.search.pageNum = 1;
      this.fetchListData();
    },

    // 搜索
    upSearch() {
      this.search.pageNum = 1;
      this.fetchListData();
    },

    // 打开高级筛选
    openAdvancedFilter() {
      this.advancedFilterVisible = true;
    },

    // 重置高级筛选
    resetAdvancedFilter() {
      this.advancedFilterForm = {
        machineryCode: '',
        machineryName: '',
        acceptName: '',
        confirmBy: ''
      };
    },

    // 确认高级筛选
    confirmAdvancedFilter() {
      this.advancedFilterVisible = false;
      this.search.pageNum = 1;
      this.fetchListData();
    },

    // 获取字典文本
    getDictText(list, value) {
      const item = list.find(item => item.value === value);
      return item ? item.label : '';
    },

    // 获取状态文本
    getStatusText(status) {
      return this.statusMap[status]?.text || '未知状态';
    },

    // 获取状态类型
    getStatusType(status) {
      return this.statusMap[status]?.type || 'default';
    },

    /** 详情按钮操作 */
    handleDetail(row) {
      const repairId = row.repairId;
      this.loading = true;

      repairAPI.getRepair.get(repairId).then(response => {
        this.loading = false;
        this.dialog.save = true;

        this.$nextTick(() => {
          if (this.$refs.saveDialog) {
            this.$refs.saveDialog.open("设备维修详情").setData(response.data);
          }
        });
      }).catch(error => {
        this.loading = false;
        console.error('获取维修单详情失败:', error);
        uni.showToast({
          title: '获取详情失败，请重试',
          icon: 'none'
        });
      });
    },

    /** 验收按钮操作 */
    handleAccept(row) {
      const repairId = row.repairId;
      this.loading = true;

      repairAPI.getRepair.get(repairId).then(response => {
        this.loading = false;
        this.dialog.save = true;

        this.$nextTick(() => {
          if (this.$refs.saveDialog) {
            this.$refs.saveDialog.open("验收设备维修单").setData(response.data);
          }
        });
      }).catch(error => {
        this.loading = false;
        console.error('获取维修单详情失败:', error);
        uni.showToast({
          title: '获取详情失败，请重试',
          icon: 'none'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.repair-container {
  height: 100%;
  background-color: #f5f5f5;
}

// 顶部筛选区域
.filter-header {
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .quick-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 20rpx;

    .filter-item {
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 200rpx;

      .filter-label {
        font-size: 14px;
        color: #666;
        margin-right: 10rpx;
        white-space: nowrap;
      }

      .filter-select {
        flex: 1;
      }
    }
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 15rpx;

    :deep(.u-search) {
      flex: 1;
    }

    .filter-btn {
      position: relative;

      .filter-badge {
        position: absolute;
        top: -5rpx;
        right: -5rpx;
      }
    }
  }
}

// 列表滚动容器
.list-scroll-container {
  height: calc(100% - 200rpx);
}

// 加载中样式
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

// 空数据样式
.empty-container {
  padding: 100rpx 30rpx;
}

// 列表内容样式
.list-content {
  padding: 20rpx 30rpx;
}

// 列表项样式
.list-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

// 列表项头部
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .basic-info {
    flex: 1;

    .repair-code {
      font-size: 16px;
      color: #333;
      font-weight: 600;
      display: block;
      margin-bottom: 5rpx;
    }

    .repair-name {
      font-size: 14px;
      color: #666;
    }
  }

  .status-tag {
    margin-left: 20rpx;
  }
}

// 列表项详情
.item-details {
  margin-bottom: 20rpx;

  .detail-row {
    display: flex;
    margin-bottom: 12rpx;

    .label {
      font-size: 12px;
      color: #999;
      min-width: 80rpx;
    }

    .value {
      font-size: 14px;
      color: #666;
      flex: 1;
      line-height: 1.5;
    }
  }
}

// 操作按钮
.item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15rpx;
  padding-top: 10rpx;
  border-top: 1rpx solid #f8f8f8;

  .action-btn {
    min-width: 120rpx;
  }
}

// 加载更多样式
.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
}

// 没有更多数据样式
.no-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;

  .no-more-text {
    font-size: 14px;
    color: #999;
  }
}

// 高级筛选弹窗样式
.advanced-filter-container {
  background-color: #fff;
  border-radius: 16rpx 16rpx 0 0;
  padding: 20rpx 30rpx;
  max-height: 80vh;

  .filter-header-title {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 10rpx 0 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    margin-bottom: 20rpx;

    .title-text {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .close-icon {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .filter-form-container {
    height: 400rpx;
    margin-bottom: 30rpx;

    :deep(.u-form-item) {
      margin-bottom: 20rpx;
    }
  }

  .filter-actions {
    display: flex;
    gap: 20rpx;

    .filter-btn {
      flex: 1;
    }
  }
}

// 适配不同设备
@media (max-width: 375px) {
  .list-content {
    padding: 15rpx 20rpx;
  }

  .list-item {
    padding: 15rpx;
  }
}
</style>