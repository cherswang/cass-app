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

    <!-- 分类筛选弹窗触发按钮 -->
    <view class="category-filter-btn" @click="showCategoryPopup = true">
      <u-icon name="menu" color="#666" size="16"></u-icon>
      <up-text text="设备分类筛选"></up-text>
      <u-tag
          :text="currentCategoryName || '全部'"
          size="mini"
          type="primary"
          v-if="currentCategoryName"
      ></u-tag>
    </view>

    <!-- 吸顶搜索栏 -->
    <up-sticky :offset-top="80" bg-color="#FFFFFF">
      <view class="search-section">
        <view class="search-container">
          <u-search
              v-model="search.searchValue"
              placeholder="设备编码/设备名称/品牌"
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
            :class="{ selected: selectedMachineryId === item.machineryId }"
            @click="selectItem(item)"
        >
          <!-- 选中标识 -->
          <view class="selection-indicator" v-if="selectedMachineryId === item.machineryId">
            <u-icon
                name="checkmark-circle-fill"
                color="#2979FF"
                size="20"
            ></u-icon>
          </view>

          <view class="record-content">
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
            <view class="info-row">
              <text class="info-label">设备状态：</text>
              <u-tag
                  :text="getStatusText(item.status)"
                  :type="getStatusType(item.status)"
                  size="mini"
                  class="status-tag"
              />
            </view>
            <view class="info-row">
              <text class="info-label">创建时间：</text>
              <text class="info-value">{{ formatTime(item.createTime) }}</text>
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
      <view class="confirm-btn" @click="confirmSelect" :class="{ disabled: !selectedMachineryId }">
        确 定
      </view>
    </view>

    <!-- 设备分类筛选弹窗 -->
    <up-popup
        :show="showCategoryPopup"
        mode="left"
        :width="70%"
        :closeable="true"
        @close="showCategoryPopup = false"
    >
      <view class="category-popup-container">
        <view class="category-header">
          <text class="category-title">设备分类</text>
          <u-input
              placeholder="输入关键字过滤"
              v-model="machineryTypeName"
              clearable
              size="small"
              class="category-search"
          ></u-input>
        </view>

        <!-- 分类树 -->
        <scroll-view class="category-tree-container" scroll-y>
          <u-tree
              ref="tree"
              :data="machineryTypeOptions"
              :props="treeProps"
              :filter-text="machineryTypeName"
              :highlight-current="true"
              :expand-on-click-node="false"
              @node-click="handleTreeNodeClick"
              class="category-tree"
          >
            <template #default="{ node, data }">
              <view class="tree-node">
                <text class="node-label">{{ node.label }}</text>
              </view>
            </template>
          </u-tree>
        </scroll-view>

        <!-- 分类筛选操作 -->
        <view class="category-actions">
          <u-button
              type="default"
              @click="resetCategoryFilter"
              class="reset-btn"
          >重置筛选</u-button>
          <u-button
              type="primary"
              @click="confirmCategoryFilter"
              class="confirm-btn"
          >确认筛选</u-button>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script>
import {listMachinery,listWorkshop,listMachineryType} from "@/api/equip/machinery";

export default {
  name: "MachinerySelectSingle",
  emits: ['onSelected', 'closed'],
  data() {
    return {
      // 弹窗控制
      visible: false,
      showCategoryPopup: false,

      // 搜索相关
      search: {
        searchValue: '',
        params: {},
        queryParams: {}
      },

      // 分类筛选相关
      machineryTypeName: '',
      machineryTypeOptions: [],
      currentCategoryId: '',
      currentCategoryName: '',
      treeProps: {
        children: 'children',
        label: 'label'
      },

      // 分页相关
      page: 1,
      pageSize: 10,
      total: 0,

      // 数据相关
      tableData: [],
      selectedMachineryId: undefined, // 单选的设备ID
      selectedRows: [], // 选中的行数据

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

      // 车间选项
      workshopOptions: [],

      // 查询参数（兼容原有逻辑）
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        machineryCode: null,
        machineryName: null,
        machineryBrand: null,
        machinerySpec: null,
        machineryTypeId: null,
        machineryTypeCode: null,
        machineryTypeName: null,
        workshopId: null,
        workshopCode: null,
        workshopName: null,
        status: null
      }
    };
  },

  computed: {
    hasMore() {
      return this.tableData.length < this.total;
    },

    // 当前选中的设备数据
    selectedItem() {
      return this.tableData.find(item => item.machineryId === this.selectedMachineryId) || {};
    }
  },

  onLoad() {
    this.getTreeselect(); // 加载设备分类树
    this.getWorkshops(); // 加载车间选项
    this.fetchTableData(); // 加载设备列表
  },

  watch: {
    // 监听分类名称过滤
    machineryTypeName(val) {
      if (this.$refs.tree) {
        this.$refs.tree.filter(val);
      }
    }
  },

  methods: {
    // 打开选择弹窗
    open() {
      this.visible = true;
      this.page = 1;
      this.selectedMachineryId = undefined; // 清空选中状态
      this.currentCategoryId = '';
      this.currentCategoryName = '';
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

      // 分类筛选
      if (this.currentCategoryId) {
        params.machineryTypeId = this.currentCategoryId;
      }

      // 合并原有查询参数
      Object.keys(this.queryParams).forEach(key => {
        if (this.queryParams[key] !== null && this.queryParams[key] !== undefined) {
          params[key] = this.queryParams[key];
        }
      });

      return params;
    },

    // 获取设备列表数据
    async fetchTableData() {
      this.loading = true;
      try {
        const params = this.buildQueryParams();
        const res = await listMachinery(params);

        if (res && res.rows) {
          const newData = Array.isArray(res.rows) ? res.rows : [];

          if (this.page === 1) {
            this.tableData = newData;
          } else {
            this.tableData = [...this.tableData, ...newData];
          }

          this.total = Number(res.total) || 0;
        } else {
          uni.showToast({ title: '获取设备数据失败', icon: 'none' });
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

    // 获取车间列表
    async getWorkshops() {
      try {
        const res = await listWorkshop();
        this.workshopOptions = res.data || [];
      } catch (error) {
        console.error('加载车间列表失败:', error);
      }
    },

    // 获取设备分类树
    async getTreeselect() {
      try {
        const res = await listMachineryType();
        // 转换数据结构适配移动端树组件
        this.machineryTypeOptions = this.normalizerTreeData(res.data || []);
      } catch (error) {
        uni.showToast({ title: '加载设备分类失败', icon: 'none' });
      }
    },

    // 标准化树数据结构
    normalizerTreeData(nodes) {
      return nodes.map(node => {
        const normalizedNode = {
          machineryTypeId: node.machineryTypeId,
          label: node.machineryTypeName || node.label,
          children: node.children ? this.normalizerTreeData(node.children) : []
        };

        // 移除空的children
        if (normalizedNode.children && normalizedNode.children.length === 0) {
          delete normalizedNode.children;
        }

        return normalizedNode;
      });
    },

    // 树形节点点击事件
    handleTreeNodeClick(data) {
      this.currentCategoryId = data.machineryTypeId;
      this.currentCategoryName = data.label;
    },

    // 重置分类筛选
    resetCategoryFilter() {
      this.currentCategoryId = '';
      this.currentCategoryName = '';
      this.machineryTypeName = '';
      // 清空树选中状态
      if (this.$refs.tree) {
        this.$refs.tree.setCurrentKey('');
      }
    },

    // 确认分类筛选
    confirmCategoryFilter() {
      this.showCategoryPopup = false;
      this.page = 1;
      this.fetchTableData();
    },

    // 选择单个设备
    selectItem(item) {
      this.selectedMachineryId = item.machineryId;
      this.selectedRows = [item]; // 兼容原有逻辑

      // 双击直接确认选择（保留原有双击逻辑）
      if (this.clickTimer) {
        clearTimeout(this.clickTimer);
        this.confirmSelect();
        return;
      }

      this.clickTimer = setTimeout(() => {
        this.clickTimer = null;
      }, 300);
    },

    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '-';
      const date = new Date(timeStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },

    // 获取状态文本
    getStatusText(status) {
      // 实际项目中从字典获取
      const statusMap = {
        'NORMAL': '正常',
        'FAULT': '故障',
        'MAINTENANCE': '维修中',
        'DISABLED': '已停用'
      };
      return statusMap[status] || status || '未知';
    },

    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        'NORMAL': 'success',
        'FAULT': 'danger',
        'MAINTENANCE': 'warning',
        'DISABLED': 'info'
      };
      return typeMap[status] || 'info';
    },

    // 确定选择
    confirmSelect() {
      if (!this.selectedMachineryId) {
        uni.showToast({ title: '请选择一台设备', icon: 'none' });
        return;
      }

      this.$emit('onSelected', this.selectedRows);
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

    // 处理过滤条变化（兼容原有逻辑）
    handleFilterChange(filters) {
      this.search.queryParams = filters;
      this.page = 1;
      this.fetchTableData();
    },

    // 兼容原有查询方法
    handleQuery() {
      this.page = 1;
      this.fetchTableData();
    },

    // 兼容原有重置方法
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        machineryCode: null,
        machineryName: null,
        machineryBrand: null,
        machinerySpec: null,
        machineryTypeId: null,
        machineryTypeCode: null,
        machineryTypeName: null,
        workshopId: null,
        workshopCode: null,
        workshopName: null,
        status: null
      };
      this.handleQuery();
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

// 分类筛选按钮
.category-filter-btn {
  padding: 10rpx 30rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  .u-tag {
    margin-left: auto;
  }
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
  transition: all 0.2s ease;

  &.selected {
    border: 2rpx solid #2979FF;
    box-shadow: 0 4rpx 16rpx rgba(41, 121, 255, 0.2);
  }
}

.selection-indicator {
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

// 分类筛选弹窗样式
.category-popup-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.category-header {
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .category-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10rpx;
    display: block;
  }

  .category-search {
    width: 100%;
  }
}

.category-tree-container {
  flex: 1;
  padding: 10rpx;
}

.category-tree {
  --u-tree-node-indent: 20rpx;
  --u-tree-node-indent-unit: 20rpx;
}

.tree-node {
  padding: 10rpx 0;

  .node-label {
    font-size: 14px;
    color: #333;
  }
}

.category-actions {
  padding: 20rpx;
  display: flex;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;

  .reset-btn, .confirm-btn {
    flex: 1;
  }
}
</style>