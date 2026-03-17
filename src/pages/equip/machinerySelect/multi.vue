<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="点检项目选择"
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
                placeholder="项目编码/项目内容"
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

      <!-- 筛选栏 -->
      <up-sticky :offset-top="80" bg-color="#FFFFFF">
        <view class="filter-section">
          <view class="filter-row">
            <!-- 项目类型筛选 -->
            <view class="dropdown-wrapper">
              <up-dropdown ref="typeDropdown">
                <up-dropdown-item
                    :title="selectedType.label || '项目类型'"
                    :options="typeDropdownOptions"
                    @change="handleTypeChange"
                    :value="selectedType.value || 'all'"
                />
              </up-dropdown>
            </view>

            <!-- 启用状态筛选 -->
            <view class="dropdown-wrapper">
              <up-dropdown ref="statusDropdown">
                <up-dropdown-item
                    :title="selectedStatus.label || '启用状态'"
                    :options="statusDropdownOptions"
                    @change="handleStatusChange"
                    :value="selectedStatus.value || 'all'"
                />
              </up-dropdown>
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
            text="暂无点检项目记录"
        ></u-empty>
      </view>

      <!-- 数据列表 -->
      <view v-else class="record-list">
        <view
            class="record-item"
            v-for="(item, index) in tableData"
            :key="item.subjectId + index"
        >
          <!-- 选择框 -->
          <view class="selection-box" @click.stop="toggleSelection(item)">
            <u-icon
                name="checkmark-circle-fill"
                color="#2979FF"
                size="20"
                v-if="selectedIds.includes(item.subjectId)"
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
              <text class="info-label">项目编码：</text>
              <text class="info-value">{{ item.subjectCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">项目类型：</text>
              <text class="info-value">{{ getDictText('mes_dvsubject_type', item.subjectType) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">项目内容：</text>
              <text class="info-value">{{ item.subjectContent || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">判定标准：</text>
              <text class="info-value">{{ item.subjectStandard || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">是否启用：</text>
              <u-tag
                  :text="getDictText('sys_yes_no', item.enableFlag)"
                  :type="item.enableFlag === 'Y' ? 'success' : 'danger'"
                  size="mini"
                  class="status-tag"
              />
            </view>
            <view class="info-row" v-if="item.remark">
              <text class="info-label">备注：</text>
              <text class="info-value">{{ item.remark }}</text>
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
      <view class="cancel-btn" @click="visible = false">取 消</view>
      <view class="confirm-btn" @click="confirmSelect" :class="{ disabled: selectedIds.length === 0 }">
        确 定 ({{ selectedIds.length }})
      </view>
    </view>

    <!-- 项目详情弹窗 -->
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
          <text class="detail-title">点检项目详情</text>
        </view>

        <scroll-view class="detail-content" scroll-y>
          <view class="detail-section">
            <view class="section-title">基本信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">项目编码</text>
                <text class="detail-value">{{ currentDetail.subjectCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">项目类型</text>
                <text class="detail-value">{{ getDictText('mes_dvsubject_type', currentDetail.subjectType) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">是否启用</text>
                <u-tag
                    :text="getDictText('sys_yes_no', currentDetail.enableFlag)"
                    :type="currentDetail.enableFlag === 'Y' ? 'success' : 'danger'"
                    size="mini"
                />
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">项目内容</text>
                <text class="detail-value">{{ currentDetail.subjectContent || '-' }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">判定标准</text>
                <text class="detail-value">{{ currentDetail.subjectStandard || '-' }}</text>
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
          >选择该项目</u-button>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script>
import {listDvsubject} from "@/api/equip/dvsubject";

export default {
  name: "DvsubjectSelect",
  emits: ['onSelected', 'closed'],
  props: {
    subjectType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 弹窗控制
      visible: false,
      showDetailPopup: false,

      // 搜索相关
      search: {
        searchValue: '',
        subjectType: this.subjectType,
        params: {},
        queryParams: {}
      },

      // 筛选相关
      selectedType: { label: '全部', value: 'all' },
      selectedStatus: { label: '全部', value: 'all' },
      typeDropdownOptions: [
        { label: '全部', value: 'all' }
      ],
      statusDropdownOptions: [
        { label: '全部', value: 'all' },
        { label: '启用', value: 'Y' },
        { label: '禁用', value: 'N' }
      ],

      // 分页相关
      page: 1,
      pageSize: 10,
      total: 0,

      // 数据相关
      apiObj: listDvsubject,
      tableData: [],
      currentDetail: {},
      selectedIds: [], // 选中的项目ID数组
      selection: [], // 兼容原有逻辑

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

      // 字典数据
      dict: {
        type: {
          sys_yes_no: [
            { label: '是', value: 'Y' },
            { label: '否', value: 'N' }
          ],
          mes_dvsubject_type: []
        }
      }
    };
  },

  computed: {
    hasMore() {
      return this.tableData.length < this.total;
    },

    // 选中的项目列表
    selectedItems() {
      return this.tableData.filter(item => this.selectedIds.includes(item.subjectId));
    }
  },

  watch: {
    // 监听父组件传入的subjectType变化
    subjectType(newVal) {
      this.search.subjectType = newVal;
      this.page = 1;
      this.fetchTableData();
    }
  },

  onLoad() {
    this.loadDictData(); // 加载字典数据
    this.fetchTableData(); // 加载项目列表
  },

  methods: {
    // 加载字典数据
    loadDictData() {
      // 实际项目中从字典接口获取
      // 这里模拟字典数据，实际需替换为接口调用
      this.dict.type.mes_dvsubject_type = [
        { label: '点检', value: 'CHECK' },
        { label: '保养', value: 'MAINTEN' },
        { label: '清洁', value: 'CLEAN' },
        { label: '润滑', value: 'LUBRICATE' }
      ];

      // 构建设置类型下拉选项
      this.typeDropdownOptions = [
        { label: '全部', value: 'all' },
        ...this.dict.type.mes_dvsubject_type.map(item => ({
          label: item.label,
          value: item.value
        }))
      ];

      // 如果有默认的项目类型，设置选中状态
      if (this.subjectType) {
        const option = this.typeDropdownOptions.find(item => item.value === this.subjectType);
        if (option) {
          this.selectedType = option;
        }
      }
    },

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
        searchValue: this.search.searchValue.trim(),
        subjectType: this.search.subjectType
      };

      // 项目类型筛选
      if (this.selectedType.value !== 'all') {
        params.subjectType = this.selectedType.value;
      }

      // 启用状态筛选
      if (this.selectedStatus.value !== 'all') {
        params.enableFlag = this.selectedStatus.value;
      }

      return params;
    },

    // 获取项目列表数据
    async fetchTableData() {
      this.loading = true;
      try {
        const params = this.buildQueryParams();
        // 兼容原有apiObj调用方式
        const res = typeof this.apiObj === 'function'
            ? await this.apiObj(params)
            : await this.apiObj.get(params);

        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : [];

          if (this.page === 1) {
            this.tableData = newData;
          } else {
            this.tableData = [...this.tableData, ...newData];
          }

          this.total = Number(res.total) || 0;
        } else {
          uni.showToast({ title: res.msg || '获取点检项目失败', icon: 'none' });
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

    // 项目类型筛选变化
    handleTypeChange(value) {
      const selectedOption = this.typeDropdownOptions.find(option => option.value === value);
      if (selectedOption) {
        this.selectedType = selectedOption;
        this.search.subjectType = value === 'all' ? '' : value;
      }

      if (this.$refs.typeDropdown) {
        this.$refs.typeDropdown.close();
      }

      this.page = 1;
      this.fetchTableData();
    },

    // 启用状态筛选变化
    handleStatusChange(value) {
      const selectedOption = this.statusDropdownOptions.find(option => option.value === value);
      if (selectedOption) {
        this.selectedStatus = selectedOption;
      }

      if (this.$refs.statusDropdown) {
        this.$refs.statusDropdown.close();
      }

      this.page = 1;
      this.fetchTableData();
    },

    // 切换选中状态
    toggleSelection(item) {
      const index = this.selectedIds.indexOf(item.subjectId);
      if (index > -1) {
        this.selectedIds.splice(index, 1);
      } else {
        this.selectedIds.push(item.subjectId);
      }
      // 兼容原有selection逻辑
      this.selection = this.selectedItems;
    },

    // 查看项目详情
    showDetail(item) {
      this.currentDetail = item;
      this.showDetailPopup = true;
    },

    // 关闭详情弹窗
    closeDetail() {
      this.showDetailPopup = false;
      this.currentDetail = {};
    },

    // 选择当前详情项目
    selectCurrentDetail() {
      this.toggleSelection(this.currentDetail);
      this.closeDetail();
      uni.showToast({ title: '已选择该点检项目', icon: 'success' });
    },

    // 确定选择
    confirmSelect() {
      if (this.selectedIds.length === 0) {
        uni.showToast({ title: '请至少选择一个点检项目', icon: 'none' });
        return;
      }

      this.$emit('onSelected', this.selectedItems);
      this.visible = false;
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

    // 获取字典文本
    getDictText(dictType, value) {
      if (!value) return '-';
      const dictList = this.dict.type[dictType] || [];
      const dictItem = dictList.find(item => item.value === value);
      return dictItem ? dictItem.label : value;
    },

    // 兼容原有多选事件
    handleSelectionChange(selection) {
      this.selection = selection;
      this.selectedIds = selection.map(item => item.subjectId);
    }
  }
};
</script>

<style lang="scss" scoped>
// 复用统一的样式体系
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
  gap: 20rpx;
  width: 100%;
}

.dropdown-wrapper {
  min-width: 140rpx;
  flex: 1;
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

  .status-tag {
    margin-left: 10rpx;
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