<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="设备报修单管理"
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
                placeholder="报修单编号/报修单名称"
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
              <up-dropdown ref="sourceDropdown">
                <up-dropdown-item
                    :title="selectedSource.label"
                    :options="sourceOptions"
                    @change="handleSourceChange"
                    :value="selectedSource.value"
                />
              </up-dropdown>
            </view>
            <view class="dropdown-wrapper">
              <up-dropdown ref="resultDropdown">
                <up-dropdown-item
                    :title="selectedResult.label"
                    :options="resultOptions"
                    @change="handleResultChange"
                    :value="selectedResult.value"
                />
              </up-dropdown>
            </view>
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

    <!-- 滚动容器外层包裹（核心修复） -->
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
              text="暂无设备报修单记录"
          >

          </u-empty>
        </view>

        <view v-else class="record-list">
          <view
              class="record-item"
              v-for="(item, index) in tableData"
              :key="item.repairId + index"
          >
            <view class="record-header">
              <text class="order-number">报修单编号：{{ item.repairCode || '-' }}</text>
              <u-tag
                  :text="getStatusText(item.status)"
                  :type="getStatusType(item.status)"
                  size="mini"
                  class="status-tag"
              />
            </view>

            <view class="record-content" @click="showDetail(item)">
              <view class="info-row">
                <text class="info-label">报修单名称：</text>
                <text class="info-value">{{ item.repairName || '-' }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">设备编码：</text>
                <text class="info-value">{{ item.machineryCode || '-' }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">设备名称：</text>
                <text class="info-value">{{ item.machineryName || '-' }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">报修来源：</text>
                <text class="info-value">{{ getSourceText(item.reportRepairSource) }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">报修日期：</text>
                <text class="info-value">{{ formatDate(item.requireDate) }}</text>
              </view>
            </view>

            <view class="record-actions">
              <view class="action-divider"></view>
              <view class="action-content">
                <text class="action-time">{{ formatTime(item.createTime) }}</text>
                <view class="action-buttons">
                  <!-- 删除按钮 -->
                  <u-button
                      type="danger"
                      size="small"
                      v-if="item.status === '10'"
                      @click.stop="handleDeleteConfirm(item)"
                      class="operate-btn"
                  >删除</u-button>
                  <!-- 派工按钮 -->
                  <u-button
                      type="success"
                      size="small"
                      v-if="item.status === '10' && item.isConfirm === '1'"
                      @click.stop="handleRepair(item)"
                      class="operate-btn"
                  >派工</u-button>
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
          <text class="detail-title">设备报修单详情</text>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="detail-content" scroll-y>
          <!-- 基本信息 -->
          <view class="detail-section">
            <view class="section-title">基本信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">报修单编号</text>
                <text class="detail-value">{{ currentDetail.repairCode || '-' }}</text>
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
                <text class="detail-label">报修单名称</text>
                <text class="detail-value">{{ currentDetail.repairName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">报修来源</text>
                <text class="detail-value">{{ getSourceText(currentDetail.reportRepairSource) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">设备编码</text>
                <text class="detail-value">{{ currentDetail.machineryCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">设备名称</text>
                <text class="detail-value">{{ currentDetail.machineryName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">报修日期</text>
                <text class="detail-value">{{ formatDate(currentDetail.requireDate) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">维修结果</text>
                <text class="detail-value">{{ getResultText(currentDetail.repairResult) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">维修人员</text>
                <text class="detail-value">{{ currentDetail.acceptName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">验收人员</text>
                <text class="detail-value">{{ currentDetail.confirmBy || '-' }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">维修完成日期</text>
                <text class="detail-value">{{ formatDate(currentDetail.finishDate) || '-' }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">验收日期</text>
                <text class="detail-value">{{ formatDate(currentDetail.confirmDate) || '-' }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">备注</text>
                <text class="detail-value">{{ currentDetail.remark || '无' }}</text>
              </view>
            </view>
          </view>

          <!-- 设备信息 -->
          <view class="detail-section" v-if="currentDetail.machineryId">
            <view class="section-title">设备信息</view>
            <view class="machinery-cards">
              <view class="machinery-card">
                <view class="card-header">
                  <text class="card-title">{{ currentDetail.machineryName || '-' }}</text>
                  <text class="card-subtitle">{{ currentDetail.machineryCode || '-' }}</text>
                </view>
                <view class="card-content">
                  <view class="card-row">
                    <text class="card-label">品牌：</text>
                    <text class="card-value">{{ currentDetail.machineryBrand || '-' }}</text>
                  </view>
                  <view class="card-row">
                    <text class="card-label">规格型号：</text>
                    <text class="card-value">{{ currentDetail.machinerySpec || '-' }}</text>
                  </view>
                </view>
              </view>
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
              class="detail-edit-btn"
              v-if="currentDetail.status === '10'"
          >编辑报修单
          </u-button>
          <u-button
              type="success"
              v-if="currentDetail.status === '10' && currentDetail.isConfirm === '1'"
              @click="handleDetailRepair(currentDetail)"
              class="detail-assign-btn"
          >派工
          </u-button>
        </view>
      </view>
    </up-popup>

    <!-- 删除确认弹窗 -->
    <u-modal
        v-model="showDeleteModal"
        title="删除确认"
        content="确定删除该报修单吗？"
        :show-cancel-button="true"
        @confirm="handleDelete"
        @cancel="showDeleteModal = false"
    ></u-modal>

    <!-- 派工选择用户弹窗（替换后的完整功能） -->
    <up-popup
        ref="assignUserPopup"
        :show="dialog.assignUser"
        mode="top"
        :round="16"
        :closeable="true"
        @close="closeAssignUserModal"
    >
      <view class="assign-modal">
        <view class="modal-header">
          <text class="modal-title">选择维修人员</text>
        </view>

        <view class="assign-modal-content">
          <view class="selected-info" v-if="selectedUserIds.length > 0">
            <text class="selected-title">已选择：</text>
            <view class="selected-tags">
              <view
                  v-for="user in selectedUsers"
                  :key="user.userId"
                  class="selected-tag"
              >
                <text class="tag-text">{{ user.nickName }}</text>
                <u-icon
                    name="close-circle"
                    size="14"
                    color="#999"
                    class="tag-delete"
                    @click="removeSelectedUser(user.userId)"
                ></u-icon>
              </view>
            </view>
          </view>

          <view class="user-search-bar">
            <view class="user-search-input-wrapper">
              <u-icon name="search" size="14" color="#999" class="user-search-icon"></u-icon>
              <input
                  type="text"
                  v-model="userSearchQuery"
                  placeholder="搜索维修人员姓名"
                  class="user-search-input"
                  @input="handleUserSearch"
              />
              <u-icon
                  v-if="userSearchQuery"
                  name="close-circle"
                  size="14"
                  color="#999"
                  class="clear-search-icon"
                  @click="clearUserSearch"
              ></u-icon>
            </view>
          </view>

          <scroll-view
              class="user-list"
              scroll-y
              :scroll-with-animation="true"
          >
            <view v-if="userLoading" class="loading-container">
              <u-loading-icon size="20" text="加载中..."></u-loading-icon>
            </view>
            <view v-else-if="filteredUserList.length === 0" class="empty-users">
              <text class="empty-text">{{ userSearchQuery ? '未找到匹配的维修人员' : '暂无可用用户' }}</text>
            </view>
            <view v-else>
              <view
                  v-for="user in filteredUserList"
                  :key="user.userId"
                  class="user-item"
                  :class="{ active: selectedUserIds.includes(user.userId) }"
                  @click="toggleSelectUser(user.userId)"
              >
                <text class="user-name">{{ user.nickName }}</text>
                <u-icon
                    v-if="selectedUserIds.includes(user.userId)"
                    name="checkmark"
                    size="20"
                    color="#2979FF"
                ></u-icon>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="modal-footer">
          <up-button text="取消" size="small" @click="closeAssignUserModal"></up-button>
          <up-button type="primary" text="确定" size="small" @click="confirmAssignUser"
                     :disabled="selectedUserIds.length === 0"></up-button>
        </view>
      </view>
    </up-popup>

    <!-- 移除弹窗形式的 saveDialog 组件引用 -->
  </view>
</template>

<script>
import {listRepair, getRepair, delRepair, updateConfirm, updateRepair} from "@/api/equip/repair";
import {getUserList} from '@/api/system/user' // 引入用户列表接口

export default {
  name: "Repair",
  components: {
    // 移除 saveDialog 组件注册
  },
  data() {
    return {
      // 搜索关键词
      searchKeyword: '',

      // 下拉筛选选中值
      selectedSource: { label: '报修来源', value: 'all' },
      selectedResult: { label: '维修结果', value: 'all' },
      selectedStatus: { label: '单据状态', value: 'all' },

      // 筛选选项
      sourceOptions: [
        { label: '报修来源', value: 'all' },
        { label: '点检', value: '02' },
        { label: '保养', value: '03' }
      ],
      resultOptions: [
        { label: '维修结果', value: 'all' },
        { label: '已完成', value: 'FINISHED' },
        { label: '未完成', value: 'UNFINISHED' }
      ],
      statusOptions: [
        { label: '单据状态', value: 'all' },
        { label: '待处理', value: '10' },
        { label: '处理中', value: '20' },
        { label: '已完成', value: '30' },
        { label: '已关闭', value: '40' }
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
      showDetailPopup: false, // 详情弹窗
      currentRow: null,
      currentDetail: {}, // 当前详情数据
      operationIds: null, // 操作ID

      // 对话框控制
      dialog: {
        save: false,
        detail: false,
        assignUser: false // 派工弹窗控制
      },

      // 表单参数
      form: {},

      // 派工用户选择相关（完整移植参考页面的功能）
      userList: [],
      filteredUserList: [],
      userLoading: false,
      selectedUserIds: [],
      userSearchQuery: ''
    };
  },

  computed: {
    hasMore() {
      return this.tableData.length < this.total;
    },
    // 计算已选用户
    selectedUsers() {
      return this.userList.filter(user => this.selectedUserIds.includes(user.userId))
    }
  },

  onLoad() {
    this.fetchTableData();
    // 注册刷新监听
    this.registerRefreshListener();
  },

  onShow() {
    // 页面显示时刷新数据（从编辑页面返回后）
    if (this.tableData.length > 0) {
      this.page = 1;
      this.fetchTableData();
    }
  },

  onUnload() {
    uni.$off('refreshRepairList');
  },

  methods: {
    // 注册刷新监听
    registerRefreshListener() {
      uni.$on('refreshRepairList', (needRefresh) => {
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

    // 获取报修来源文本
    getSourceText(value) {
      if (!value) return '-';
      const sourceMap = {
        '02': '点检',
        '03': '保养'
      };
      return sourceMap[value] || value;
    },

    // 获取维修结果文本
    getResultText(value) {
      if (!value) return '-';
      const resultMap = {
        'FINISHED': '已完成',
        'UNFINISHED': '未完成'
      };
      return resultMap[value] || value;
    },

    // 获取状态文本
    getStatusText(status) {
      if (!status) return '-';
      const statusMap = {
        '10': '待处理',
        '20': '处理中',
        '30': '已完成',
        '40': '已关闭'
      };
      return statusMap[status] || '未知状态';
    },

    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        '10': 'warning',
        '20': 'primary',
        '30': 'success',
        '40': 'info'
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

      // 报修来源筛选
      if (this.selectedSource.value !== 'all') {
        params.reportRepairSource = this.selectedSource.value;
      }

      // 维修结果筛选
      if (this.selectedResult.value !== 'all') {
        params.repairResult = this.selectedResult.value;
      }

      // 单据状态筛选
      if (this.selectedStatus.value !== 'all') {
        params.status = this.selectedStatus.value;
      }

      return params;
    },

    // 获取列表数据
    async fetchTableData() {
      this.loading = true;
      try {
        const params = this.buildQueryParams();
        const res = await listRepair(params);

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
      this.scrollTop = 0;
      this.showBackTop = false;
    },

    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true;
      this.page = 1;
      this.fetchTableData();
    },

    // 搜索
    upSearch() {
      this.page = 1;
      this.fetchTableData();
    },

    // 报修来源筛选变化
    handleSourceChange(value) {
      const selectedOption = this.sourceOptions.find(option => option.value === value);
      if (selectedOption) {
        this.selectedSource = selectedOption;
      }

      if (this.$refs.sourceDropdown) {
        this.$refs.sourceDropdown.close();
      }

      this.page = 1;
      this.fetchTableData();
    },

    // 维修结果筛选变化
    handleResultChange(value) {
      const selectedOption = this.resultOptions.find(option => option.value === value);
      if (selectedOption) {
        this.selectedResult = selectedOption;
      }

      if (this.$refs.resultDropdown) {
        this.$refs.resultDropdown.close();
      }

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

    // 新增按钮操作 - 改为跳转到新页面
    handleAdd() {
      uni.navigateTo({
        url: '/pages/equip/repair/RepairFormPage?mode=add'
      });
    },

    // 修改按钮操作 - 改为跳转到新页面
    handleUpdate(row) {
      const repairId = row.repairId;
      getRepair(repairId).then(response => {
        const formData = response.data;
        // 跳转到编辑页面
        uni.navigateTo({
          url: `/pages/equip/repair/report/save?mode=edit&data=${encodeURIComponent(JSON.stringify(formData))}`
        });
      });
    },

    // 从详情页编辑 - 改为跳转到新页面
    handleDetailEdit(item) {
      this.closeDetail();
      setTimeout(() => {
        // 直接跳转，不需要先获取详情
        uni.navigateTo({
          url: `/pages/equip/repair/report/save?mode=edit&data=${encodeURIComponent(JSON.stringify(item))}`
        });
      }, 300);
    },

    // 显示删除确认弹窗
    handleDeleteConfirm(row) {
      this.currentRow = row;
      this.showDeleteModal = true;
    },

    // 删除按钮操作
    async handleDelete() {
      this.showDeleteModal = false;
      uni.showLoading({ title: '删除中...', mask: true });

      try {
        const repairIds = this.currentRow?.repairId || [];
        const res = await delRepair(repairIds);

        if (res.code === 200) {
          uni.showToast({ title: '删除成功', icon: 'success' });
          this.page = 1;
          this.fetchTableData();
        } else {
          uni.showToast({ title: res.msg || '删除失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '删除失败', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },

    // 派工按钮操作
    handleRepair(row) {
      this.operationIds = row.repairId;
      this.dialog.assignUser = true;
      // 打开弹窗时加载用户列表
      this.loadUsers().then(() => {
        // 如果有已选用户，回显选中状态
        if (row.acceptedBy) {
          const arr = row.acceptedBy.split(',').map(i => i.trim()).filter(Boolean)
          this.selectedUserIds = arr;
        } else {
          this.selectedUserIds = [];
        }
      });
    },

    // 从详情页派工
    handleDetailRepair(item) {
      this.closeDetail();
      setTimeout(() => {
        this.handleRepair(item);
      }, 300);
    },

    // 确认按钮操作,领导确认后才可以派工
    handleConfirm(row) {
      this.form = {};
      const repairId = row.repairId;
      getRepair(repairId).then(response => {
        this.form = response.data;
        this.form.isConfirm = '1';
        updateConfirm(this.form).then(response => {
          uni.showToast({ title: "确认成功", icon: 'success' });
          this.page = 1;
          this.fetchTableData();
        });
      });
    },

    // 查看详情
    async showDetail(item) {
      try {
        // 查询报修单详情
        const res = await getRepair(item.repairId);
        this.currentDetail = res.data || {};
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
      this.detailLoading = false;
    },

    // 移除保存成功回调（改为页面跳转后不再需要）
    handleSaveSuccess() {
      // 空实现，保留方法避免报错
    },

    // 移除弹窗关闭回调
    handleDialogClosed() {
      // 空实现，保留方法避免报错
    },

    // 根治布局塌陷
    forceRepaintScroll() {
      setTimeout(() => {
        this.scrollTop = this.scrollTop + 1;
      }, 100);
    },

    // ========== 派工用户选择相关方法 ==========
    // 加载用户列表
    loadUsers() {
      this.userLoading = true;
      return new Promise((resolve, reject) => {
        getUserList().then(res => {
          if (res.code === 200) {
            this.userList = res.rows || [];
            this.filteredUserList = [...this.userList];
          } else {
            uni.showToast({ title: res.msg || '加载用户列表失败', icon: 'none' });
          }
          resolve();
        }).catch(err => {
          uni.showToast({ title: '加载用户失败', icon: 'none' });
          reject(err);
        }).finally(() => {
          this.userLoading = false;
        });
      });
    },

    // 搜索用户
    handleUserSearch() {
      const q = this.userSearchQuery.trim().toLowerCase();
      if (!q) {
        this.filteredUserList = [...this.userList];
        return;
      }
      this.filteredUserList = this.userList.filter(u =>
          u.nickName?.toLowerCase().includes(q)
      );
    },

    // 清空搜索
    clearUserSearch() {
      this.userSearchQuery = '';
      this.filteredUserList = [...this.userList];
    },

    // 切换用户选中状态
    toggleSelectUser(userId) {
      if (this.selectedUserIds.includes(userId)) {
        this.selectedUserIds = this.selectedUserIds.filter(i => i !== userId);
      } else {
        this.selectedUserIds.push(userId);
      }
    },

    // 移除已选用户
    removeSelectedUser(userId) {
      this.selectedUserIds = this.selectedUserIds.filter(i => i !== userId);
    },

    // 确认选择用户（派工）
    confirmAssignUser() {
      if (!this.selectedUserIds.length) {
        uni.showToast({ title: '请选择维修人员', icon: 'none' });
        return;
      }

      // 获取选中的用户信息
      const users = this.userList.filter(u => this.selectedUserIds.includes(u.userId));

      // 构建派工参数
      this.form.repairId = this.operationIds;
      this.form.status = '20';
      this.form.acceptedBy = users.map(u => u.userId).join(','); // 用户ID，多个用逗号分隔
      this.form.acceptName = users.map(u => u.nickName).join('、'); // 用户名，多个用顿号分隔

      // 调用派工接口
      updateRepair(this.form).then(response => {
        uni.showToast({ title: "派工成功", icon: 'success' });
        this.closeAssignUserModal();
        this.page = 1;
        this.fetchTableData();
      }).catch(error => {
        uni.showToast({ title: "派工失败", icon: 'none' });
        console.error('派工失败:', error);
      });
    },

    // 关闭派工弹窗
    closeAssignUserModal() {
      this.dialog.assignUser = false;
      this.selectedUserIds = [];
      this.userList = [];
      this.filteredUserList = [];
      this.userSearchQuery = '';
    }
  }
};
</script>

<style lang="scss" scoped>
// 核心布局修复 - 统一盒模型
.container {
  height: 100vh;
  box-sizing: border-box;
}

.sticky-container {
  flex-shrink: 0;
  background: #fff;
}

// 核心：滚动容器外层固定高度
.scroll-wrapper {
  height: calc(100vh - 180rpx);
  box-sizing: border-box;
}

// 滚动容器铺满外层
.scroll-container {
  height: 100%;
  box-sizing: border-box;
}

// 搜索栏样式
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

// 筛选栏样式
.filter-section {
  padding: 5rpx 0rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  width: 100%;
  padding: 0 20rpx;
}

.dropdown-wrapper {
  min-width: 140rpx;
  flex: 1;
}

// 下拉筛选样式统一
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

// 加载中样式
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

// 空数据样式
.empty-container {
  padding: 100rpx 30rpx;
}

// 列表样式
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

// 列表内容样式
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

// 操作栏样式
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

.action-buttons {
  display: flex;
  gap: 10rpx;
}

// 操作按钮统一样式
.operate-btn {
  width: 120rpx;
  margin-left: auto;
}

// 加载更多样式
.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
}

// 没有更多样式
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

// 加载提示样式
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

// 回到顶部按钮
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

// 详情弹窗样式（保留原有）
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

// 设备卡片样式
.machinery-cards {
  margin-top: 10rpx;
}

.machinery-card {
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

// 底部操作按钮
.detail-actions {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  background: #fff;
  display: flex;
  gap: 20rpx;
}

.detail-edit-btn, .detail-assign-btn {
  flex: 1;
}

.status-tag {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

// ========== 派工用户选择弹窗样式 ==========
.assign-modal {
  background: #fff;
  border-radius: 16rpx 16rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
  .modal-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }
}

.assign-modal-content {
  flex: 1;
  padding: 20rpx 30rpx;
  max-height: 60vh;
  overflow: hidden;
}

.selected-info {
  margin-bottom: 20rpx;
  .selected-title {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 10rpx;
    display: block;
  }
  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
  }
  .selected-tag {
    background: #F5F7FA;
    border-radius: 20rpx;
    padding: 8rpx 16rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    .tag-text {
      font-size: 24rpx;
      color: #333;
    }
    .tag-delete {
      margin-left: 8rpx;
    }
  }
}

.user-search-bar {
  margin-bottom: 20rpx;
  .user-search-input-wrapper {
    display: flex;
    align-items: center;
    background: #F5F7FA;
    border-radius: 8rpx;
    padding: 0 20rpx;
    height: 72rpx;
  }
  .user-search-icon {
    margin-right: 10rpx;
  }
  .user-search-input {
    flex: 1;
    height: 100%;
    font-size: 26rpx;
    color: #333;
    background: transparent;
    border: none;
    outline: none;
  }
  .clear-search-icon {
    margin-left: 10rpx;
  }
}

.user-list {
  height: 400rpx;
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20rpx 0;
  }
  .empty-users {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40rpx 0;
    .empty-text {
      font-size: 26rpx;
      color: #999;
    }
  }
  .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    &.active {
      .user-name {
        color: #2979FF;
        font-weight: 500;
      }
    }
    .user-name {
      font-size: 28rpx;
      color: #333;
    }
  }
}

.modal-footer {
  padding: 20rpx 30rpx;
  display: flex;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  button {
    flex: 1;
    height: 72rpx;
    border-radius: 8rpx;
  }
}
</style>