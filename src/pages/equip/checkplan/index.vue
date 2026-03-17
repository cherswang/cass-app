<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="设备点检计划"
        :safeAreaInsetTop="true"
        :placeholder="true"
        bg-color="#FFFFFF"
        title-color="#333333"
        :border="false"
        :auto-back="true"
        rightText="新增"
        @rightClick="handleAdd"
    />

    <!-- 吸顶容器 -->
    <view class="sticky-container">
      <!-- 搜索栏 -->
      <up-sticky :offset-top="0" bg-color="#FFFFFF">
        <view class="search-section">
          <view class="search-container">
            <u-search
                v-model="searchKeyword"
                placeholder="计划编码/计划名称"
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
              <up-dropdown ref="statusDropdown">
                <up-dropdown-item
                    :title="selectedStatus.label"
                    :options="statusOptions"
                    @change="handleStatusChange"
                    :value="selectedStatus.value"
                />
              </up-dropdown>
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
      <view v-if="loading && tableData.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <view v-else-if="tableData.length === 0" class="empty-container">
        <u-empty
            mode="data"
            text="暂无设备点检计划记录"
        >
          <template #bottom>
            <u-button
                type="primary"
                size="small"
                @click="handleAdd"
                text="新增计划"
            ></u-button>
          </template>
        </u-empty>
      </view>

      <view v-else class="record-list">
        <view
            class="record-item"
            v-for="(item, index) in tableData"
            :key="item.planId + index"
        >
          <view class="record-header">
            <text class="order-number">计划编码：{{ item.planCode || '-' }}</text>
            <u-tag
                :text="getStatusText(item.status)"
                :type="getStatusType(item.status)"
                size="mini"
                class="status-tag"
            />
          </view>

          <view class="record-content" @click="showDetail(item)">
            <view class="info-row">
              <text class="info-label">计划名称：</text>
              <text class="info-value">{{ item.planName || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">计划类型：</text>
              <text class="info-value">{{ getDictText('dv_plan_type', item.planType) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">执行类型：</text>
              <text class="info-value">{{ getDictText('dv_execute_type', item.executeType) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">频率：</text>
              <text class="info-value">{{ getDictText('mes_cycle_type', item.cycleType) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">执行人：</text>
              <text class="info-value">{{ item.executeUsername || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">时间范围：</text>
              <text class="info-value">{{ formatDate(item.startDate) }} 至 {{ formatDate(item.endDate) }}</text>
            </view>
          </view>

          <view class="record-actions">
            <view class="action-divider"></view>
            <view class="action-content">
              <text class="action-time">{{ formatTime(item.createTime) }}</text>
              <view class="action-buttons">
                <u-button
                    type="success"
                    size="small"
                    v-if="item.status === 'PREPARE'"
                    @click.stop="handleStart(item)"
                    class="print-btn"
                >生成任务</u-button>
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

    <!-- 回到顶部按钮 -->
    <view v-if="showBackTop" class="back-top" @click="scrollToTop">
      <u-icon name="arrow-upward" color="#fff" size="20"></u-icon>
    </view>

    <!-- 详情弹窗 -->
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
          <text class="detail-title">点检计划详情</text>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="detail-content" scroll-y>
          <!-- 基本信息 -->
          <view class="detail-section">
            <view class="section-title">基本信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">计划编码</text>
                <text class="detail-value">{{ currentDetail.planCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">状态</text>
                <u-tag
                    :text="getStatusText(currentDetail.status)"
                    :type="getStatusType(currentDetail.status)"
                    size="mini"
                    class="status-tag"
                />
              </view>
              <view class="detail-item">
                <text class="detail-label">计划名称</text>
                <text class="detail-value">{{ currentDetail.planName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">计划类型</text>
                <text class="detail-value">{{ getDictText('dv_plan_type', currentDetail.planType) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">执行类型</text>
                <text class="detail-value">{{ getDictText('dv_execute_type', currentDetail.executeType) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">频率</text>
                <text class="detail-value">{{ getDictText('mes_cycle_type', currentDetail.cycleType) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">执行人</text>
                <text class="detail-value">{{ currentDetail.executeUsername || '-' }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">时间范围</text>
                <text class="detail-value">{{ formatDate(currentDetail.startDate) }} 至 {{ formatDate(currentDetail.endDate) }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">备注</text>
                <text class="detail-value">{{ currentDetail.remark || '无' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">创建人</text>
                <text class="detail-value">{{ currentDetail.createByName || '-' }}</text>
              </view>
            </view>
          </view>
          <!-- 设备清单 -->
          <view class="detail-section" v-if="machineryList.length > 0">
            <view class="section-title">设备清单</view>
            <view class="machinery-cards">
              <view
                  class="machinery-card"
                  v-for="(item, idx) in machineryList"
                  :key="item.machineryId || 'mach_' + idx"
              >
                <view class="card-header">
                  <text class="card-title">{{ item.machineryName || '-' }}</text>
                  <text class="card-subtitle">{{ item.machineryCode || '-' }}</text>
                </view>
                <view class="card-content">
                  <view class="card-row">
                    <text class="card-label">品牌：</text>
                    <text class="card-value">{{ item.machineryBrand || '-' }}</text>
                  </view>
                  <view class="card-row">
                    <text class="card-label">规格型号：</text>
                    <text class="card-value">{{ item.machinerySpec || '-' }}</text>
                  </view>
                  <view class="card-row" v-if="item.location">
                    <text class="card-label">设备位置：</text>
                    <text class="card-value">{{ item.location || '-' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="detail-section" v-else-if="showDetailPopup && !detailLoading">
            <view class="section-title">设备清单</view>
            <view class="empty-state">
              <text class="empty-text">暂无关联设备</text>
            </view>
          </view>

          <!-- 点检/保养项目 -->
          <view class="detail-section" v-if="subjectList.length > 0">
            <view class="section-title">{{ currentDetail.planType === 'CHECK' ? '点检项目' : '保养项目' }}</view>
            <view class="subject-cards">
              <view
                  class="subject-card"
                  v-for="(item, idx) in subjectList"
                  :key="item.subjectId || 'sub_' + idx"
              >
                <view class="card-header">
                  <text class="card-title">{{ item.subjectName || '-' }}</text>
                  <text class="card-subtitle">{{ item.subjectCode || '-' }}</text>
                </view>
                <view class="card-content">
                  <view class="card-row">
                    <text class="card-label">项目类型：</text>
                    <text class="card-value">{{ getSubjectTypeText(item.subjectType) }}</text>
                  </view>
                  <view class="card-row">
                    <text class="card-label">项目内容：</text>
                    <text class="card-value">{{ item.subjectContent || '-' }}</text>
                  </view>
                  <view class="card-row">
                    <text class="card-label">执行标准：</text>
                    <text class="card-value">{{ item.subjectStandard || '-' }}</text>
                  </view>
                  <view class="card-row" v-if="item.referenceValue">
                    <text class="card-label">参考值：</text>
                    <text class="card-value">{{ item.referenceValue || '-' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="detail-section" v-else-if="showDetailPopup && !detailLoading">
            <view class="section-title">{{ currentDetail.planType === 'CHECK' ? '点检项目' : '保养项目' }}</view>
            <view class="empty-state">
              <text class="empty-text">暂无关联{{ currentDetail.planType === 'CHECK' ? '点检' : '保养' }}项目</text>
            </view>
          </view>
          <!-- 加载状态 -->
          <view v-if="detailLoading" class="loading-container">
            <u-loading-icon size="20" text="加载中..."></u-loading-icon>
          </view>
        </scroll-view>

        <!-- 底部操作按钮 -->
        <view class="detail-actions">
          <u-button
              type="primary"
              @click="handleDetailEdit(currentDetail)"
              class="detail-print-btn"
              v-if="currentDetail.status === 'PREPARE'"
          >编辑计划
          </u-button>
          <u-button
              type="success"
              v-if="currentDetail.status === 'PREPARE'"
              @click="handleDetailStart(currentDetail)"
              class="detail-print-btn"
          >生成任务
          </u-button>
        </view>
      </view>
    </up-popup>

    <u-modal
        v-if="showSaveModal"
        :show="false"
        :mask-close-able="false"
        :close-on-click-modal="false"
        @close="showSaveModal = false"
    ></u-modal>
  </view>
</template>

<script>
import {listCheckPlan, delCheckPlan, updateCheckPlanStart, getCheckPlan} from "@/api/equip/checkplan";
import {listCheckMachinery} from "@/api/equip/checkmachinery";
import {listChecksubject} from "@/api/equip/checksubject";

export default {
  name: "Checkplan",
  data() {
    return {
      searchKeyword: '',
      showDatePicker: false,

      // 下拉筛选选中值
      selectedStatus: { label: '全部', value: 'all' },
      selectedPlanType: { label: '计划类型', value: 'all' },
      selectedExecuteType: { label: '执行类型', value: 'all' },
      selectedCycleType: { label: '频率', value: 'all' },

      statusOptions: [
        { label: '全部', value: 'all' },
        { label: '待执行', value: 'PREPARE' },
        { label: '已完成', value: 'FINISHED' }
      ],
      // 分页相关
      page: 1,
      pageSize: 10,
      total: 0,

      // 数据相关
      tableData: [],

      // 加载状态
      loading: false,
      loadingMore: false,
      refresherTriggered: false,
      detailLoading: false, // 详情数据加载状态

      // 滚动相关
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,


      // 弹窗相关
      showDeleteModal: false,
      showFilterPopup: false,
      showSaveModal: false,
      showDetailPopup: false, // 详情弹窗
      currentRow: null,
      currentDetail: {}, // 当前详情数据
      machineryList: [], // 设备清单数据
      subjectList: [], // 点检/保养项目数据
      filterLength: 0,
      advancedFilter: {
        executeUsername: ''
      }
    };
  },

  computed: {
    hasMore() {
      return this.tableData.length < this.total;
    }
  },

  onLoad() {
    this.fetchTableData();
    this.loadDictOptions(); // 加载字典选项
    // 监听刷新事件
    this.registerRefreshListener();
  },

  onUnload() {
    uni.$off('refreshCheckplanList');
  },

  methods: {
    // 注册刷新监听
    registerRefreshListener() {
      uni.$on('refreshCheckplanList', (needRefresh) => {
        if (needRefresh) {
          this.page = 1;
          this.fetchTableData();
        }
      });
    },
    // 滚动事件处理
    handleScroll(e) {
      const scrollTop = e.detail.scrollTop;
      this.showBackTop = scrollTop > this.scrollThreshold;
    },

    // 格式化日期
    formatDate(value) {
      if (!value) return '-';
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '-';
      return timeStr.replace(' ', ' ').substring(0, 16);
    },

    // 获取字典文本
    getDictText(dictType, value) {
      if (!value) return '-';
      if (dictType === 'dv_plan_type'){
        if (value === 'CHECK'){
          return '设备点检计划';
        }
        if (value === 'MAINTEN'){
          return '定修保养计划';
        }
      }
      if (dictType === 'dv_execute_type'){
        if (value === '10'){
          return '周期执行';
        }
        if (value === '20'){
          return '指定日期';
        }
      }
      if (dictType === 'mes_cycle_type'){
        if (value === 'HOUR'){
          return '小时';
        }
        if (value === 'DAY'){
          return '天';
        }
        if (value === 'WEEK'){
          return '周';
        }
        if (value === 'MONTH'){
          return '月';
        }
        if (value === 'YEAR'){
          return '年';
        }
        if (value === 'QUARTER'){
          return '季度';
        }
      }
      return value;
    },

    // 新增：获取项目类型文本
    getSubjectTypeText(type) {
      const typeMap = {
        'CHECK': '点检项目',
        'MAINTEN': '保养项目'
      };
      return typeMap[type] || type || '-';
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'PREPARE': '待执行',
        'FINISHED': '已完成',
      };
      return statusMap[status] || '未知状态';
    },

    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        'PREPARE': 'warning',
        'FINISHED': 'success',
      };
      return typeMap[status] || 'info';
    },

    // 构建查询参数
    buildQueryParams() {
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize
      };

      if (this.searchKeyword) {
        params.searchValue = this.searchKeyword.trim();
      }

      if (this.selectedStatus.value !== 'all') {
        params.status = this.selectedStatus.value;
      }

      // 基础筛选条件
      if (this.selectedPlanType.value !== 'all') {
        params.planType = this.selectedPlanType.value;
      }
      if (this.selectedExecuteType.value !== 'all') {
        params.executeType = this.selectedExecuteType.value;
      }
      if (this.selectedCycleType.value !== 'all') {
        params.cycleType = this.selectedCycleType.value;
      }

      // 高级筛选条件
      if (this.advancedFilter.executeUsername) {
        params.executeUsername = this.advancedFilter.executeUsername.trim();
        this.filterLength += 1;
      }

      return params;
    },

    // 获取列表数据
    async fetchTableData() {
      this.loading = true;
      try {
        const params = this.buildQueryParams();
        const res = await listCheckPlan(params);

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

    // 加载详情页的设备和项目数据
    async loadDetailRelatedData(planId) {
      this.detailLoading = true;
      try {
        // 加载设备清单
        const machineryRes = await listCheckMachinery({ planId });
        this.machineryList = machineryRes.code === 200 ? (machineryRes.rows || []) : [];

        // 加载点检/保养项目
        const subjectRes = await listChecksubject({
          planId,
          subjectType: this.currentDetail.planType
        });
        this.subjectList = subjectRes.code === 200 ? (subjectRes.rows || []) : [];
      } catch (error) {
        console.error('加载详情关联数据失败:', error);
        this.machineryList = [];
        this.subjectList = [];
      } finally {
        this.detailLoading = false;
      }
    },

    // 下拉加载更多
    handleScrollToLower() {
      if (this.loadingMore) {
        return;
      }

      if (!this.hasMore) {
        return;
      }

      this.page += 1;
      this.loadingMore = true;
      this.fetchTableData().finally(() => {
        this.loadingMore = false;
      });
    },

    // 回到顶部
    scrollToTop() {
      this.scrollTop = this.scrollTop + 1;
      this.showBackTop = false;
    },

    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true;
      this.page = 1;
      this.fetchTableData();
    },

    upSearch() {
      this.page = 1;
      this.fetchTableData();
    },

    // 状态筛选变化
    handleStatusChange(value) {
      const selectedOption = this.statusOptions.find(option => option.value === value);
      if (selectedOption) {
        this.selectedStatus = selectedOption;
      }

      if (this.$refs.statusDropdown) {
        this.$refs.statusDropdown.close();
      }

      this.page = 1;
      this.fetchTableData();
    },


    handleAdd() {
      uni.navigateTo({
        url: '/pages/equip/checkplan/save'
      });
    },

    handleUpdate(row) {
      uni.navigateTo({
        url: `/pages/equip/checkplan/save?planId=${row.planId}&type=edit`
      });
    },

    // 查看详情
    async showDetail(item) {
      try {
        // 查询计划详情
        const res = await getCheckPlan(item.planId);
        this.currentDetail = res.data || {};
        await this.loadDetailRelatedData(item.planId);

        this.showDetailPopup = true;
      } catch (error) {
        console.error('获取详情失败:', error);
        uni.showToast({ title: '获取详情失败', icon: 'none' });
      }
    },

    // 关闭详情弹出层
    closeDetail() {
      this.showDetailPopup = false;
      this.currentDetail = {};
      this.machineryList = [];
      this.subjectList = [];
      this.detailLoading = false;
    },

    // 从详情页编辑
    handleDetailEdit(item) {
      this.closeDetail();
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/equip/checkplan/save?planId=${item.planId}&type=edit`
        });
      }, 300);
    },

    // 从详情页生成任务
    handleDetailStart(item) {
      this.closeDetail();
      setTimeout(() => {
        this.handleStart(item);
      }, 300);
    },

    async handleStart(row) {
      uni.showLoading({ title: '处理中...', mask: true });
      try {
        const res = await updateCheckPlanStart(row);
        if (res.code === 200) {
          uni.showToast({ title: '生成任务成功', icon: 'success' });
          this.page = 1;
          this.fetchTableData();
        } else {
          uni.showToast({ title: res.msg || '生成任务失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '网络错误，请重试', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },

    // 显示删除确认弹窗
    handleDeleteConfirm(row) {
      this.currentRow = row;
      this.showDeleteModal = true;
    },

    async handleDelete() {
      this.showDeleteModal = false;
      uni.showLoading({ title: '删除中...', mask: true });

      try {
        const planIds = this.currentRow?.planId || [];
        const res = await delCheckPlan(planIds);

        if (res.code === 200) {
          uni.showToast({ title: '删除成功', icon: 'success' });
          this.page = 1;
          this.fetchTableData();
        } else {
          uni.showToast({ title: res.message || '删除失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '删除失败', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
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

    &.text-green {
      color: #00b42a;
      font-weight: 600;
    }

    &.text-red {
      color: #ff4d4f;
      font-weight: 600;
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
  gap: 20rpx;
  padding-top: 20rpx;
}

.action-time {
  color: #5a5a5a;
  flex: 1;
}

.action-btn {
  margin-right: 10rpx;
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

.sheet-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
  color: #999;
}

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

/* 设备/项目卡片样式 */
.machinery-cards,
.subject-cards {
  margin-top: 10rpx;
}

.machinery-card,
.subject-card {
  background-color: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.card-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 20rpx;
  padding-bottom: 12rpx;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
}

.card-subtitle {
  font-size: 12px;
  color: #666;
  opacity: 0.8;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.card-row {
  display: flex;
  align-items: flex-start;
}

.card-label {
  width: 140rpx;
  font-size: 12px;
  color: #666;
  flex-shrink: 0;
  line-height: 1.4;
}

.card-value {
  flex: 1;
  font-size: 12px;
  color: #333;
  line-height: 1.4;
  word-break: break-all;
}

/* 空状态 */
.empty-state {
  margin-top: 20rpx;
  text-align: center;
  padding: 30rpx 0;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* 底部操作按钮 */
.detail-actions {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  background: #fff;
  display: flex;
  gap: 20rpx;
}

.detail-print-btn {
  flex: 1;
}

.status-tag {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

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
</style>