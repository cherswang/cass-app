<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="设备选择"
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
                v-model="search.searchValue"
                placeholder="设备编码/设备名称"
                :show-action="false"
                bg-color="#F8F8F8"
                border-color="#F8F8F8"
                placeholder-color="#C8C9CC"
                shape="square"
                @search="upsearch"
                class="search-input"
            />
            <view class="scan-icon" @click="upsearch">
              <up-text text="搜索"></up-text>
            </view>
          </view>
        </view>
      </up-sticky>

      <!-- 设备类型筛选栏 -->
      <up-sticky :offset-top="80" bg-color="#FFFFFF">
        <view class="filter-section">
          <view class="filter-row">
            <view class="dropdown-wrapper">
              <up-dropdown ref="typeDropdown">
                <up-dropdown-item
                    :title="selectedType.label || '设备类型'"
                    :options="typeDropdownOptions"
                    @change="handleTypeChange"
                    :value="selectedType.value || 'all'"
                />
              </up-dropdown>
            </view>

            <!-- 高级筛选按钮 -->
            <view class="filter-btn-wrapper" @click="openAdvancedFilter">
              <el-badge :value="filterLength" type="danger" :hidden="filterLength<=0">
                <u-icon name="filter" color="#666" size="16"></u-icon>
                <up-text text="筛选" class="filter-text"></up-text>
              </el-badge>
            </view>
          </view>
        </view>
      </up-sticky>
    </view>

    <!-- 调试信息 -->
    <view class="debug-info" v-if="showDebug">
      <text>页码: {{ page }} | 数据: {{ tableData.length }}/{{ total }} | 加载中: {{ loadingMore }}</text>
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
      <view v-if="loading && tableData.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <!-- 空数据状态 -->
      <view v-else-if="tableData.length === 0" class="empty-container">
        <u-empty
            mode="data"
            text="暂无设备记录"
        ></u-empty>
      </view>

      <!-- 数据列表 -->
      <view v-else class="record-list">
        <view
            class="record-item"
            v-for="(item, index) in tableData"
            :key="item.machineryId + index"
        >
          <!-- 选择框 -->
          <view class="selection-box" @click.stop="toggleSelection(item)">
            <u-icon
                name="checkmark-circle-fill"
                color="#2979FF"
                size="20"
                v-if="selectedIds.includes(item.machineryId)"
            ></u-icon>
            <u-icon
                name="circle"
                color="#ccc"
                size="20"
                v-else
            ></u-icon>
          </view>

          <view class="record-content" @click="showDetail(item)">
            <view class="info-row">
              <text class="info-label">设备编码：</text>
              <text class="info-value">{{ item.machineryCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">设备名称：</text>
              <text class="info-value">{{ item.machineryName || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">品牌：</text>
              <text class="info-value">{{ item.machineryBrand || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">规格型号：</text>
              <text class="info-value">{{ item.machinerySpec || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">所属车间：</text>
              <text class="info-value">{{ item.workshopName || '-' }}</text>
            </view>
          </view>
        </view>

        <!-- 加载更多状态 -->
        <view v-if="loadingMore" class="load-more-container">
          <u-loading-icon size="24" text="正在加载更多数据..."></u-loading-icon>
        </view>

        <!-- 没有更多数据提示 -->
        <view v-else-if="!hasMore && tableData.length > 0" class="no-more-container">
          <text class="no-more-text">已经到底了，没有更多数据了</text>
        </view>

        <!-- 还有更多数据提示 -->
        <view v-else-if="hasMore && tableData.length > 0" class="more-tips">
          <text class="more-text">继续上拉加载更多数据...</text>
        </view>
      </view>
    </scroll-view>

    <!-- 回到顶部按钮 -->
    <view v-if="showBackTop" class="back-top" @click="scrollToTop">
      <u-icon name="arrow-upward" color="#fff" size="20"></u-icon>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="cancel-btn" @click="uni.navigateBack()">取 消</view>
      <view class="confirm-btn" @click="confirmSelect" :class="{ disabled: selectedIds.length === 0 }">
        确 定 ({{ selectedIds.length }})
      </view>
    </view>

    <!-- 高级筛选弹窗 -->
    <up-popup
        :show="showFilterPopup"
        mode="bottom"
        :round="16"
        :closeable="true"
        :safe-area-inset-bottom="true"
        @close="showFilterPopup = false"
    >
      <view class="filter-popup-container">
        <view class="filter-popup-header">
          <text class="filter-popup-title">高级筛选</text>
        </view>
        <view class="filter-popup-content">
          <u-form :model="advancedFilter" label-position="left" label-width="120rpx">
            <u-form-item label="设备编码">
              <u-input
                  v-model="advancedFilter.machineryCode"
                  placeholder="请输入设备编码"
                  clearable
              ></u-input>
            </u-form-item>
            <u-form-item label="设备名称">
              <u-input
                  v-model="advancedFilter.machineryName"
                  placeholder="请输入设备名称"
                  clearable
              ></u-input>
            </u-form-item>
            <u-form-item label="品牌">
              <u-input
                  v-model="advancedFilter.machineryBrand"
                  placeholder="请输入品牌"
                  clearable
              ></u-input>
            </u-form-item>
            <u-form-item label="规格型号">
              <u-input
                  v-model="advancedFilter.machinerySpec"
                  placeholder="请输入规格型号"
                  clearable
              ></u-input>
            </u-form-item>
            <u-form-item label="所属车间">
              <u-input
                  v-model="advancedFilter.workshopName"
                  placeholder="请输入所属车间"
                  clearable
              ></u-input>
            </u-form-item>
          </u-form>
        </view>
        <view class="filter-popup-actions">
          <u-button
              type="default"
              @click="resetAdvancedFilter"
              class="filter-reset-btn"
          >重置</u-button>
          <u-button
              type="primary"
              @click="confirmAdvancedFilter"
              class="filter-confirm-btn"
          >确认</u-button>
        </view>
      </view>
    </up-popup>

    <!-- 设备详情弹窗 -->
    <up-popup
        :show="showDetailPopup"
        mode="bottom"
        :round="16"
        :closeable="true"
        :safe-area-inset-bottom="true"
        @close="closeDetail"
    >
      <view class="detail-container">
        <view class="detail-header">
          <text class="detail-title">设备详情</text>
        </view>

        <scroll-view class="detail-content" scroll-y>
          <view class="detail-section">
            <view class="section-title">基本信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">设备编码</text>
                <text class="detail-value">{{ currentDetail.machineryCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">设备名称</text>
                <text class="detail-value">{{ currentDetail.machineryName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">品牌</text>
                <text class="detail-value">{{ currentDetail.machineryBrand || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">规格型号</text>
                <text class="detail-value">{{ currentDetail.machinerySpec || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">所属车间</text>
                <text class="detail-value">{{ currentDetail.workshopName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">设备类型</text>
                <text class="detail-value">{{ currentDetail.machineryTypeName || '-' }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">备注</text>
                <text class="detail-value">{{ currentDetail.remark || '无' }}</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="detail-actions">
          <u-button
              type="primary"
              @click="selectCurrentDetail"
              class="detail-print-btn"
          >选择该设备</u-button>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script>
import {listMachinery,listMachineryType} from "@/api/equip/machinery";

export default {
  name: "MachinerySelect",
  emits: ['onSelected', 'closed'],
  data() {
    return {
      // 弹窗控制
      visible: false,
      showFilterPopup: false,
      showDetailPopup: false,

      // 搜索相关
      search: {
        searchValue: '',
        params: {},
        queryParams: {}
      },

      // 筛选相关
      selectedType: { label: '全部', value: 'all' },
      typeDropdownOptions: [
        { label: '全部', value: 'all' }
      ],
      advancedFilter: {
        machineryCode: '',
        machineryName: '',
        machineryBrand: '',
        machinerySpec: '',
        workshopName: ''
      },
      filterLength: 0,

      // 分页相关
      page: 1,
      pageSize: 10,
      total: 0,

      // 数据相关
      tableData: [],
      machineryTypeOptions: [],
      currentDetail: {},
      selectedIds: [], // 选中的设备ID数组

      // 加载状态
      loading: false,
      loadingMore: false,
      refresherTriggered: false,

      // 滚动相关
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,

      // 调试模式
      showDebug: false,

      // 设备类型名称过滤
      typeName: ''
    };
  },

  computed: {
    hasMore() {
      return this.tableData.length < this.total;
    },

    // 选中的设备列表
    selectedItems() {
      return this.tableData.filter(item => this.selectedIds.includes(item.machineryId));
    }
  },

  onLoad() {
    this.fetchTypeList(); // 加载设备类型列表
    this.fetchTableData(); // 加载设备列表
  },

  methods: {
    // 打开选择弹窗
    open() {
      this.visible = true;
      this.page = 1;
      this.selectedIds = []; // 清空选中状态
      this.fetchTableData();
      return this;
    },

    // 构建查询参数
    buildQueryParams() {
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        searchValue: this.search.searchValue.trim()
      };

      // 设备类型筛选
      if (this.selectedType.value !== 'all') {
        params.machineryTypeId = this.selectedType.value;
      }

      // 高级筛选条件
      Object.keys(this.advancedFilter).forEach(key => {
        if (this.advancedFilter[key]) {
          params[key] = this.advancedFilter[key].trim();
        }
      });

      return params;
    },

    // 获取设备类型列表
    async fetchTypeList() {
      try {
        const res = await listMachineryType();
        if (res.code === 200) {
          this.machineryTypeOptions = res.data || [];
          // 构建设备类型下拉选项
          this.typeDropdownOptions = [
            { label: '全部', value: 'all' },
            ...this.machineryTypeOptions.map(item => ({
              label: item.label,
              value: item.machineryTypeId
            }))
          ];
        }
      } catch (error) {
        uni.showToast({ title: '加载设备类型失败', icon: 'none' });
      }
    },

    // 获取设备列表数据
    async fetchTableData() {
      this.loading = true;
      try {
        const params = this.buildQueryParams();
        const res = await listMachinery(params);

        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : [];

          if (this.page === 1) {
            this.tableData = newData;
          } else {
            this.tableData = [...this.tableData, ...newData];
          }

          this.total = Number(res.total) || 0;
        } else {
          uni.showToast({ title: res.msg || '获取设备数据失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '网络错误，请重试', icon: 'none' });
      } finally {
        this.loading = false;
        this.refresherTriggered = false;
        this.loadingMore = false;
      }
    },

    // 搜索
    upsearch() {
      this.page = 1;
      this.fetchTableData();
    },

    // 设备类型筛选变化
    handleTypeChange(value) {
      const selectedOption = this.typeDropdownOptions.find(option => option.value === value);
      if (selectedOption) {
        this.selectedType = selectedOption;
      }

      if (this.$refs.typeDropdown) {
        this.$refs.typeDropdown.close();
      }

      this.page = 1;
      this.fetchTableData();
    },

    // 切换选中状态
    toggleSelection(item) {
      const index = this.selectedIds.indexOf(item.machineryId);
      if (index > -1) {
        this.selectedIds.splice(index, 1);
      } else {
        this.selectedIds.push(item.machineryId);
      }
    },

    // 查看设备详情
    showDetail(item) {
      this.currentDetail = item;
      this.showDetailPopup = true;
    },

    // 关闭详情弹窗
    closeDetail() {
      this.showDetailPopup = false;
      this.currentDetail = {};
    },

    // 选择当前详情设备
    selectCurrentDetail() {
      this.toggleSelection(this.currentDetail);
      this.closeDetail();
      uni.showToast({ title: '已选择该设备', icon: 'success' });
    },

    // 打开高级筛选
    openAdvancedFilter() {
      this.showFilterPopup = true;
    },

    // 重置高级筛选
    resetAdvancedFilter() {
      this.advancedFilter = {
        machineryCode: '',
        machineryName: '',
        machineryBrand: '',
        machinerySpec: '',
        workshopName: ''
      };
      this.filterLength = 0;
    },

    // 确认高级筛选
    confirmAdvancedFilter() {
      this.showFilterPopup = false;
      // 计算筛选条件数量
      this.filterLength = Object.values(this.advancedFilter).filter(v => v).length;
      this.page = 1;
      this.fetchTableData();
    },

    // 确定选择
    confirmSelect() {
      if (this.selectedIds.length === 0) {
        uni.showToast({ title: '请至少选择一台设备', icon: 'none' });
        return;
      }

      // 获取当前页面栈
      const pages = getCurrentPages();
      // 获取上一页（计划编辑页）实例
      const prevPage = pages[pages.length - 2];

      // 调用上一页的方法，批量添加选中的设备
      if (prevPage && prevPage.addMachineryItems) {
        prevPage.addMachineryItems(this.selectedItems);
      }

      // 关闭当前页面，返回上一页
      uni.navigateBack({
        delta: 1,
        success: () => {
          uni.showToast({ title: `已选择${this.selectedIds.length}台设备`, icon: 'success' });
        }
      });
    },

    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true;
      this.page = 1;
      this.fetchTableData();
    },

    // 上拉加载更多
    handleScrollToLower() {
      if (this.loadingMore || !this.hasMore) return;

      this.page += 1;
      this.loadingMore = true;
      this.fetchTableData();
    },

    // 滚动事件
    handleScroll(e) {
      this.showBackTop = e.detail.scrollTop > this.scrollThreshold;
    },

    // 回到顶部
    scrollToTop() {
      this.scrollTop = this.scrollTop + 1;
      this.showBackTop = false;
    },

    // 筛选节点（保留原方法兼容）
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 节点点击（保留原方法兼容）
    handleNodeClick(data) {
      this.selectedType = {
        label: data.label,
        value: data.machineryTypeId
      };
      this.page = 1;
      this.fetchTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
// 复用基础样式体系
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
}

.debug-info {
  position: fixed;
  top: 200rpx;
  left: 0;
  right: 0;
  background: #ffeb3b;
  color: #333;
  padding: 10rpx 20rpx;
  font-size: 12px;
  z-index: 999;
  border-bottom: 1px solid #ccc;
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
  padding: 5rpx 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.dropdown-wrapper {
  min-width: 140rpx;
}

.filter-btn-wrapper {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  background-color: #F8F8F8;
}

.filter-text {
  font-size: 12px;
  color: #666;
}

:deep(.u-dropdown__content) {
  width: 100vw !important;
  left: 0 !important;
}

:deep(.u-dropdown__content__popup) {
  width: 100% !important;
}

.scroll-container {
  flex: 1;
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
  position: relative;
}

.selection-box {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  z-index: 10;
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

// 底部操作栏
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #f0f0f0;
  z-index: 99;

  .cancel-btn {
    width: 48%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background-color: #F5F5F5;
    color: #666;
    border-radius: 44rpx;
    font-size: 28rpx;
  }

  .confirm-btn {
    width: 48%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background-color: #2979FF;
    color: #ffffff;
    border-radius: 44rpx;
    font-size: 28rpx;

    &.disabled {
      background-color: #ccc;
      color: #fff;
      pointer-events: none;
    }
  }
}

// 筛选弹窗样式
.filter-popup-container {
  background: #fff;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
}

.filter-popup-header {
  padding: 10rpx 0 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
}

.filter-popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.filter-popup-content {
  flex: 1;
  padding: 20rpx 0;
}

.filter-popup-actions {
  display: flex;
  gap: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.filter-reset-btn, .filter-confirm-btn {
  flex: 1;
}

// 详情弹窗样式
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
  align-items: flex-start;

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

.detail-actions {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  background: #fff;
}

.detail-print-btn {
  width: 100%;
}
</style>