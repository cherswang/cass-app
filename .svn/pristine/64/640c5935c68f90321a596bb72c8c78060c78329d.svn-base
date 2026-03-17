<template>
  <view class="repair-list-container">
    <!-- 筛选栏 -->
    <view class="filter-container">
      <!-- 顶部快速筛选 -->
      <view class="quick-filter">
        <view class="filter-item" @click="showSourceFilter = true">
          <text class="filter-label">报修来源：</text>
          <text class="filter-value">{{ getDictLabel('mes_report_repair_source', search.reportRepairSource) || '全部' }}</text>
          <u-icon name="arrow-down" size="16" color="#666"></u-icon>
        </view>

        <view class="filter-item" @click="showResultFilter = true">
          <text class="filter-label">维修结果：</text>
          <text class="filter-value">{{ getDictLabel('mes_repair_result', search.repairResult) || '全部' }}</text>
          <u-icon name="arrow-down" size="16" color="#666"></u-icon>
        </view>
      </view>

      <!-- 搜索栏 -->
      <view class="search-bar">
        <u-search
            v-model="search.searchValue"
            placeholder="报修单编号/报修单名称"
            @search="upSearch"
            @clear="handleSearchClear"
            bg-color="#f5f5f5"
            shape="round"
            :show-action="false"
        ></u-search>

        <u-icon
            name="filter"
            size="24"
            color="#666"
            @click="showAdvancedFilter = true"
            class="filter-icon"
        >
          <u-badge
              :count="filterBadgeCount"
              type="danger"
              size="mini"
              :hidden="filterBadgeCount <= 0"
              slot="badge"
          ></u-badge>
        </u-icon>
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
        <u-empty mode="list" text="暂无设备维修单记录"></u-empty>
      </view>

      <!-- 列表项 -->
      <view v-else class="list-content">
        <view
            class="list-item"
            v-for="(item, index) in listData"
            :key="item.repairId + index"
            @click="handleItemClick(item)"
        >
          <!-- 列表项头部 -->
          <view class="item-header">
            <view class="left-info">
              <text class="repair-code">{{ item.repairCode || '-' }}</text>
              <text class="repair-name">{{ item.repairName || '-' }}</text>
            </view>
            <u-tag
                :text="getDictLabel('mes_report_repair_state', item.status)"
                :type="getStatusTagType(item.status)"
                size="mini"
                class="status-tag"
            ></u-tag>
          </view>

          <!-- 列表项详情 -->
          <view class="item-details">
            <view class="detail-row">
              <text class="label">设备信息：</text>
              <text class="value">{{ item.machineryCode || '-' }} / {{ item.machineryName || '-' }}</text>
            </view>

            <view class="detail-row">
              <text class="label">报修来源：</text>
              <u-tag
                  :text="getDictLabel('mes_report_repair_source', item.reportRepairSource)"
                  type="primary"
                  size="mini"
              ></u-tag>
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
              <u-tag
                  :text="getDictLabel('mes_repair_result', item.repairResult)"
                  :type="getResultTagType(item.repairResult)"
                  size="mini"
              ></u-tag>
            </view>

            <view class="detail-row">
              <text class="label">维修人员：</text>
              <text class="value">{{ item.acceptName || '-' }}</text>
            </view>

            <view class="detail-row" v-if="item.confirmBy">
              <text class="label">验收人员：</text>
              <text class="value">{{ item.confirmBy || '-' }}</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="item-action">
            <u-button
                type="primary"
                size="mini"
                @click.stop="handleUpdate(item)"
            >维修</u-button>
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

    <!-- 报修来源筛选弹窗 -->
    <u-picker
        v-model="showSourceFilter"
        :list="reportRepairSourceList"
        title="选择报修来源"
        @confirm="onSourceFilterConfirm"
        @cancel="showSourceFilter = false"
    ></u-picker>

    <!-- 维修结果筛选弹窗 -->
    <u-picker
        v-model="showResultFilter"
        :list="repairResultList"
        title="选择维修结果"
        @confirm="onResultFilterConfirm"
        @cancel="showResultFilter = false"
    ></u-picker>

    <!-- 高级筛选弹窗 -->
    <up-popup
        v-model="showAdvancedFilter"
        mode="bottom"
        :round="16"
        :safe-area-inset-bottom="true"
    >
      <view class="advanced-filter-container">
        <view class="filter-header">
          <text class="filter-title">高级筛选</text>
          <u-button
              type="text"
              @click="resetAdvancedFilter"
          >重置</u-button>
        </view>

        <view class="filter-form">
          <u-form
              ref="advancedForm"
              :model="advancedFilterForm"
              label-width="100rpx"
          >
            <u-form-item label="设备编码">
              <u-input
                  v-model="advancedFilterForm.machineryCode"
                  placeholder="请输入设备编码"
                  clearable
              ></u-input>
            </u-form-item>

            <u-form-item label="设备名称">
              <u-input
                  v-model="advancedFilterForm.machineryName"
                  placeholder="请输入设备名称"
                  clearable
              ></u-input>
            </u-form-item>

            <u-form-item label="维修人员">
              <u-input
                  v-model="advancedFilterForm.acceptName"
                  placeholder="请输入维修人员"
                  clearable
              ></u-input>
            </u-form-item>

            <u-form-item label="验收人员">
              <u-input
                  v-model="advancedFilterForm.confirmBy"
                  placeholder="请输入验收人员"
                  clearable
              ></u-input>
            </u-form-item>
          </u-form>
        </view>

        <view class="filter-footer">
          <u-button
              type="default"
              @click="showAdvancedFilter = false"
              class="cancel-btn"
          >取消</u-button>
          <u-button
              type="primary"
              @click="confirmAdvancedFilter"
              class="confirm-btn"
          >确定</u-button>
        </view>
      </view>
    </up-popup>

    <!-- 维修单编辑弹窗 -->
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
      // API对象
      apiObj: repairAPI.listRepair,
      // 弹窗控制
      dialog: {
        save: false
      },
      // 搜索参数
      search: {
        searchValue: null,
        status: '80',
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
      // 筛选器显示控制
      showSourceFilter: false,
      showResultFilter: false,
      showAdvancedFilter: false,
      // 字典数据
      dictData: {
        mes_repair_result: [],
        mes_report_repair_source: [],
        mes_report_repair_state: []
      },
      // 筛选列表
      reportRepairSourceList: [],
      repairResultList: [],
      // 列表数据
      listData: [],
      // 加载状态
      loading: false,
      loadingMore: false,
      refresherTriggered: false,
      // 分页控制
      total: 0
    };
  },

  computed: {
    // 筛选徽章数量
    filterBadgeCount() {
      let count = 0;
      Object.keys(this.advancedFilterForm).forEach(key => {
        if (this.advancedFilterForm[key]) {
          count++;
        }
      });
      return count;
    },
    // 是否还有更多数据
    hasMore() {
      return this.listData.length < this.total;
    }
  },

  onLoad() {
    // 初始化字典数据
    this.loadDictData();
    // 设置默认查询参数
    this.search.queryParams.acceptedBy = this.$stores?.user?.userInfo?.userName || '';
    // 加载列表数据
    this.fetchListData();
  },

  methods: {
    // 加载字典数据
    loadDictData() {
      // 模拟加载字典数据（实际项目中请替换为真实的字典接口）
      this.dictData = {
        mes_repair_result: [
          { label: '修复成功', value: 'SUCCESS' },
          { label: '报废', value: 'FAILURE' },
          { label: '待维修', value: 'PENDING' }
        ],
        mes_report_repair_source: [
          { label: '生产维修', value: '01' },
          { label: '点检维修', value: '02' },
          { label: '保养维修', value: '03' }
        ],
        mes_report_repair_state: [
          { label: '待维修', value: '10' },
          { label: '维修中', value: '20' },
          { label: '已完成', value: '80' },
          { label: '已验收', value: '90' }
        ]
      };

      // 转换为选择器格式
      this.reportRepairSourceList = this.dictData.mes_report_repair_source.map(item => ({
        label: item.label,
        value: item.value
      }));

      this.repairResultList = this.dictData.mes_repair_result.map(item => ({
        label: item.label,
        value: item.value
      }));
    },

    // 根据字典类型和值获取标签文本
    getDictLabel(dictType, value) {
      if (!value || !this.dictData[dictType]) return '';
      const dictItem = this.dictData[dictType].find(item => item.value === value);
      return dictItem ? dictItem.label : '';
    },

    // 根据状态获取标签类型
    getStatusTagType(status) {
      switch (status) {
        case '10': return 'warning'; // 待维修
        case '20': return 'primary'; // 维修中
        case '80': return 'success'; // 已完成
        case '90': return 'info';    // 已验收
        default: return 'default';
      }
    },

    // 根据结果获取标签类型
    getResultTagType(result) {
      switch (result) {
        case 'SUCCESS': return 'success'; // 修复成功
        case 'FAILURE': return 'danger';  // 报废
        case 'PENDING': return 'warning'; // 待维修
        default: return 'primary';
      }
    },

    // 获取列表数据
    async fetchListData() {
      // 首次加载或下拉刷新显示加载状态
      if (this.search.pageNum === 1) {
        this.loading = true;
      } else {
        this.loadingMore = true;
      }

      try {
        // 构建查询参数
        const params = {
          ...this.search,
          ...this.search.queryParams
        };

        // 调用API获取数据
        const res = await this.apiObj(params);

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
        console.error('获取设备维修单列表失败:', error);
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

    // 快速筛选变化
    filterChange() {
      this.search.pageNum = 1;
      this.fetchListData();
    },

    // 搜索
    upSearch() {
      this.search.pageNum = 1;
      this.fetchListData();
    },

    // 清空搜索
    handleSearchClear() {
      this.search.searchValue = '';
      this.upSearch();
    },

    // 报修来源筛选确认
    onSourceFilterConfirm(e) {
      this.search.reportRepairSource = e.value[0];
      this.showSourceFilter = false;
      this.filterChange();
    },

    // 维修结果筛选确认
    onResultFilterConfirm(e) {
      this.search.repairResult = e.value[0];
      this.showResultFilter = false;
      this.filterChange();
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
      this.search.queryParams = {
        ...this.search.queryParams,
        ...this.advancedFilterForm
      };
      this.showAdvancedFilter = false;
      this.search.pageNum = 1;
      this.fetchListData();
    },

    // 处理列表项点击
    handleItemClick(item) {
      // 可添加查看详情逻辑
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      const repairId = row.repairId;
      this.loading = true;

      repairAPI.getRepair.get(repairId).then(response => {
        this.loading = false;
        this.dialog.save = true;

        this.$nextTick(() => {
          if (this.$refs.saveDialog) {
            this.$refs.saveDialog.open("修改设备维修单").setData(response.data);
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
.repair-list-container {
  height: 100%;
  background-color: #f5f5f5;
}

// 筛选容器样式
.filter-container {
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

// 快速筛选样式
.quick-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 20rpx;

  .filter-item {
    display: flex;
    align-items: center;
    padding: 10rpx 15rpx;
    background-color: #f8f8f8;
    border-radius: 8rpx;

    .filter-label {
      font-size: 14px;
      color: #666;
      margin-right: 10rpx;
    }

    .filter-value {
      font-size: 14px;
      color: #333;
      flex: 1;
    }
  }
}

// 搜索栏样式
.search-bar {
  display: flex;
  align-items: center;

  :deep(.u-search) {
    flex: 1;
  }

  .filter-icon {
    margin-left: 20rpx;
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
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

// 列表项头部
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .left-info {
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
    margin-left: 10rpx;
  }
}

// 列表项详情
.item-details {
  margin-bottom: 20rpx;

  .detail-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16rpx;

    .label {
      font-size: 12px;
      color: #999;
      min-width: 80rpx;
      margin-top: 2rpx;
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
.item-action {
  display: flex;
  justify-content: flex-end;
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
  padding: 30rpx;
  max-height: 80vh;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;

  .filter-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.filter-form {
  margin-bottom: 40rpx;
  max-height: 50vh;
  overflow-y: auto;
}

.filter-footer {
  display: flex;
  gap: 20rpx;

  .cancel-btn, .confirm-btn {
    flex: 1;
  }
}

// 适配不同设备
@media (max-width: 375px) {
  .list-content {
    padding: 15rpx 20rpx;
  }

  .list-item {
    padding: 20rpx;
  }
}
</style>