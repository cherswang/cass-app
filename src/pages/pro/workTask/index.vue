<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="工单任务"
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
                v-model="searchQuery"
                placeholder="搜索单号/编码/名称/规格"
                :show-action="false"
                bg-color="#F8F8F8"
                border-color="#F8F8F8"
                placeholder-color="#C8C9CC"
                shape="square"
                @search="handleSearch"
                class="search-input"
            />
            <view class="scan-icon" @click="handleSearch">
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
                    v-model="selectedStatus.value"
                    :title="selectedStatus.label"
                    :options="statusOptions"
                    @change="handleStatusChange"
                />
                <up-dropdown-item
                    :title="processDropdown.label"
                    :value="processDropdown.value"
                >
                  <view class="dropdown-custom-content">
                    <view
                        v-for="option in processOptions"
                        :key="option.value"
                        class="dropdown-custom-option"
                        :class="{ active: processDropdown.value.includes(option.value) }"
                        @click="toggleProcessOption(option)"
                    >
                      <text class="option-label">{{ option.label }}</text>
                      <up-icon
                          v-if="processDropdown.value.includes(option.value)"
                          name="checkmark"
                          size="20"
                          color="#2979FF"
                      ></up-icon>
                    </view>
                    <view class="dropdown-custom-footer">
                      <up-button text="重置" size="small" @click="cancelProcessSelection"></up-button>
                      <up-button type="primary" text="确定" size="small" @click="confirmProcessSelection"></up-button>
                    </view>
                  </view>
                </up-dropdown-item>
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
      <!-- 加载状态 -->
      <view v-if="loading && taskLists.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <!-- 空数据状态 -->
      <view v-else-if="taskLists.length === 0" class="empty-container">
        <u-empty
            mode="data"
            text="暂无工单任务数据"
        >
        </u-empty>
      </view>

      <!-- 数据列表 -->
      <view v-else class="record-list">
        <view
            class="record-item"
            v-for="(task, index) in taskLists"
            :key="task.id"
        >
          <view class="record-header">
            <text class="order-number">工&nbsp;&nbsp;单&nbsp;&nbsp;号：&nbsp;&nbsp;{{ task.workOrderNo || '-' }}</text>
            <u-tag
                :text="task.processName || '-'"
                type="primary"
                size="mini"
            />
          </view>

          <view class="record-content" @click="viewDetail(task)">
            <view class="info-row">
              <text class="info-label">任务编号：</text>
              <text class="info-value">{{ task.taskNo || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品名称：</text>
              <text class="info-value">{{ task.productName || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品编码：</text>
              <text class="info-value">{{ task.productCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品规格：</text>
              <text class="info-value">{{ task.productSpec || '-' }}</text>
              <text class="info-label">计划数量：</text>
              <text class="info-value">{{ task.plannedQuantity || 0 }} {{ task.unit || '' }}</text>
            </view>
            <view v-if="task.isOperator === 1" class="info-row">
              <text class="info-label">已完成：</text>
              <text class="info-value completed">{{ task.completedQuantity || 0 }} {{ task.unit || '' }}</text>
              <text class="info-label">操作工：</text>
              <text class="info-value operator-name">{{ task.operatorNames || task.operatorName || '未指定' }}</text>
            </view>
          </view>

          <view class="record-actions">
            <view class="action-divider"></view>
            <view class="action-content">
              <text class="action-time">{{ task.createTime || '-' }}</text>
              <up-button class="print-btn" :type="task.isOperator == '1' ? 'warning' : 'primary'"
                         :text="task.isOperator === 0 ? '分配操作工' : '重新分配'" size="small"
                         @click="handleAssignOperator(task)"></up-button>
            </view>
          </view>
        </view>

        <!-- 加载更多状态 -->
        <view v-if="loadingMore" class="load-more-container">
          <u-loading-icon size="24" text="正在加载更多数据..."></u-loading-icon>
        </view>

        <!-- 没有更多数据提示 -->
        <view v-else-if="!hasMore && taskLists.length > 0" class="no-more-container">
          <text class="no-more-text">已经到底了，没有更多数据了</text>
        </view>

        <!-- 还有更多数据提示 -->
        <view v-else-if="hasMore && taskLists.length > 0" class="more-tips">
          <text class="more-text">继续上拉加载更多数据...</text>
        </view>
      </view>
    </scroll-view>

    <!-- 回到顶部按钮 -->
    <view v-if="showBackTop" class="back-top" @click="scrollToTop">
      <u-icon name="arrow-upward" color="#fff" size="20"></u-icon>
    </view>

    <!-- 详情弹出层 -->
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
          <text class="detail-title">工单详情</text>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="detail-content" scroll-y>
          <!-- 基本信息 -->
          <view class="detail-section">
            <view class="section-title">基本信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">工单编号</text>
                <text class="detail-value">{{ currentDetail.workOrderNo || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">任务编号</text>
                <text class="detail-value">{{ currentDetail.taskNo || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">产品名称</text>
                <text class="detail-value">{{ currentDetail.productName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">产品编码</text>
                <text class="detail-value">{{ currentDetail.productCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">产品规格</text>
                <text class="detail-value">{{ currentDetail.productSpec || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">计划数量</text>
                <text class="detail-value">{{ currentDetail.plannedQuantity || 0 }} {{
                    currentDetail.unit || ''
                  }}
                </text>
              </view>
              <view class="detail-item">
                <text class="detail-label">已完成数量</text>
                <text class="detail-value">{{ currentDetail.completedQuantity || 0 }} {{
                    currentDetail.unit || ''
                  }}
                </text>
              </view>
              <view class="detail-item">
                <text class="detail-label">工序</text>
                <text class="detail-value">{{ currentDetail.processName || '-' }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">操作工</text>
                <text class="detail-value">{{
                    currentDetail.operatorNames || currentDetail.operatorName || '未指定'
                  }}
                </text>
              </view>
            </view>
          </view>

          <!-- 操作信息 -->
          <view class="detail-section">
            <view class="section-title">操作信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">创建时间</text>
                <text class="detail-value">{{ currentDetail.createTime || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">状态</text>
                <u-tag
                    :text="currentDetail.isOperator === '0' ? '未分配' : '已分配'"
                    :type="currentDetail.isOperator === '0' ? 'warning' : 'success'"
                    size="mini"
                    class="status-tag-detail"
                />
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </up-popup>

    <!-- 指派操作工模态框 -->
    <up-popup
        ref="assignPopup"
        :show="showAssignPopup"
        mode="top"
        :round="16"
        :closeable="true"
        @close="closeAssignModal"
    >
      <view class="assign-modal">
        <view class="modal-header">
          <text class="modal-title">{{
              selectedTask && selectedTask.isOperator == '1' ? '重新分配' : '指派'
            }}操作工
          </text>
        </view>

        <view class="assign-modal-content">
          <!-- 显示已选操作工标签 -->
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

          <!-- 用户搜索栏 -->
          <view class="user-search-bar">
            <view class="user-search-input-wrapper">
              <u-icon name="search" size="14" color="#999" class="user-search-icon"></u-icon>
              <input
                  type="text"
                  v-model="userSearchQuery"
                  placeholder="搜索操作工姓名"
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
              <text class="empty-text">{{ userSearchQuery ? '未找到匹配的操作工' : '暂无可用用户' }}</text>
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
                <up-icon
                    v-if="selectedUserIds.includes(user.userId)"
                    name="checkmark"
                    size="20"
                    color="#2979FF"
                ></up-icon>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="modal-footer">
          <up-button text="取消" size="small" @click="closeAssignModal"></up-button>
          <up-button type="primary" text="确定" size="small" @click="confirmAssignLeader"
                     :disabled="selectedUserIds.length === 0"></up-button>
        </view>
      </view>
    </up-popup>

    <!-- 全局加载提示 -->
    <up-toast ref="uToast"></up-toast>
  </view>
</template>

<script>
import {getLeaderTasks, updateOperator} from '@/api/pro/workTask'
import {getUserList} from '@/api/system/user'
// 导入工序相关 API
import {listAllProcess} from '@/api/production/process'

export default {
  name: 'WorkOrderTaskList',
  data() {
    return {
      // 筛选相关配置
      selectedStatus: {
        label: '状态',
        value: 'all'
      },
      statusOptions: [
        {label: '全部', value: 'all'},
        {label: '未分配', value: 0},
        {label: '已分配', value: 1}
      ],
      // 工序选择配置
      selectedProcesses: [], // 已选工序列表
      processOptions: [], // 工序选项列表
      processDropdown: {
        label: '工序',
        value: []
      },

      // 数据相关
      taskLists: [], // 任务列表数据
      loadingStatus: false, // 加载状态
      searchQuery: '',
      page: 1, // 当前页码
      pageSize: 10,
      total: 0, // 总数据量

      // 指派相关
      selectedTask: null,
      userList: [], // 原始用户列表
      filteredUserList: [], // 过滤后的用户列表
      userLoading: false,
      selectedUserIds: [], // 多选用户ID数组
      userSearchQuery: '', // 用户搜索关键词
      showAssignPopup: false, // 指派弹窗显示状态

      // 详情弹出层相关
      showDetailPopup: false,
      currentDetail: {}, // 当前显示的详情数据

      // 下拉刷新状态
      refresherTriggered: false,
      loading: false, // 初始加载状态
      loadingMore: false, // 加载更多状态

      // 滚动相关
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,
    }
  },
  computed: {
    hasMore() {
      // 当没有数据时，不需要加载更多
      if (this.total === 0) return false
      // 当当前列表长度小于总数时，还有更多数据
      return this.taskLists.length < this.total
    },

    // 获取已选用户的详细信息
    selectedUsers() {
      return this.userList.filter(user => this.selectedUserIds.includes(user.userId))
    }
  },

  onLoad() {
    this.loadProcessList() // 加载工序列表
    this.fetchTableData()
  },
  methods: {
    // 构建查询参数
    buildQueryParams() {
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize
      }

      if (this.searchQuery) {
        params.searchValue = this.searchQuery
      }

      if (this.selectedStatus.value !== 'all') {
        params.isOperator = this.selectedStatus.value
      }

      // 添加工序筛选条件
      if (Array.isArray(this.processDropdown.value) && this.processDropdown.value.length > 0) {
        params.processCode = this.processDropdown.value.join(',')
      }

      return params
    },

    // 加载任务列表
    async fetchTableData() {
      if (this.page > 1) {
        this.loadingMore = true
      } else {
        this.loading = true
      }

      try {
        const params = this.buildQueryParams()
        // 根据状态选择API
        const res = await getLeaderTasks(params)

        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : []

          if (this.page === 1) {
            this.taskLists = newData
          } else {
            this.taskLists = [...this.taskLists, ...newData]
          }
          this.total = Number(res.total) || 0
        } else {
          this.$refs.uToast.show({
            type: 'error',
            message: res.msg || '获取数据失败'
          })
        }
      } catch (error) {
        this.$refs.uToast.show({
          type: 'error',
          message: '网络错误，请重试'
        })
      } finally {
        this.loading = false
        this.loadingMore = false
        this.refresherTriggered = false
      }
    },

    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true
      this.page = 1
      this.fetchTableData()
    },

    // 滚动到底部加载更多
    handleScrollToLower() {
      // 确保没有正在加载，并且还有更多数据
      if (this.loading || this.loadingMore || !this.hasMore) {
        return
      }

      this.page += 1
      this.fetchTableData()
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.fetchTableData()
    },

    // 加载工序列表
    async loadProcessList() {
      try {
        const res = await listAllProcess()
        if (res.code === 200 && Array.isArray(res.data)) {
          // 转换为下拉菜单需要的格式
          this.processOptions = res.data.map(process => ({
            label: process.processName,
            value: process.processCode
          }))
          this.processDropdown.label = '工序'
        }
      } catch (error) {
        this.$refs.uToast.show({
          type: 'error',
          message: '加载工序列表失败'
        })
      }
    },

    // 状态筛选变化
    handleStatusChange(value) {
      const selectedOption = this.statusOptions.find(option => option.value === value)
      this.selectedStatus.label = selectedOption.label;
      this.selectedStatus.value = value;
      this.page = 1
      this.fetchTableData()
    },

    // 切换工序选项
    toggleProcessOption(option) {
      const value = option.value
      const index = this.processDropdown.value.indexOf(value)
      if (index > -1) {
        // 移除选中项
        this.processDropdown.value.splice(index, 1)
      } else {
        // 添加选中项，无数量限制
        this.processDropdown.value.push(value)
      }
    },

    // 确认工序选择
    confirmProcessSelection() {
      // 更新工序标签文本
      if (this.processDropdown.value.length === 0) {
        this.processDropdown.label = '工序'
      } else if (this.processDropdown.value.length === 1) {
        const selectedProcess = this.processOptions.find(option => option.value === this.processDropdown.value[0])
        this.processDropdown.label = selectedProcess ? selectedProcess.label : '工序'
      } else {
        this.processDropdown.label = `${this.processDropdown.value.length}个工序`
      }

      if (this.$refs.statusDropdown) {
        this.$refs.statusDropdown.close()
      }

      this.page = 1
      this.fetchTableData()
    },

    // 重置工序选择
    cancelProcessSelection() {
      // 清空已选工序
      this.processDropdown.value = []
      // 重置标签显示
      this.processDropdown.label = '工序'
      // 关闭下拉菜单
      if (this.$refs.statusDropdown) {
        this.$refs.statusDropdown.close()
      }
      // 刷新数据，显示所有工序的任务
      this.page = 1
      this.fetchTableData()
    },

    // 滚动处理
    handleScroll(e) {
      const scrollTop = e.detail.scrollTop
      this.showBackTop = scrollTop > this.scrollThreshold
    },

    // 回到顶部
    scrollToTop() {
      this.scrollTop = this.scrollTop + 1
      this.showBackTop = false
    },

    // 显示详情弹出层
    viewDetail(item) {
      this.currentDetail = {...item}
      this.showDetailPopup = true
    },

    // 关闭详情弹出层
    closeDetail() {
      this.showDetailPopup = false
      this.currentDetail = {}
    },

    // 打开指派操作工模态框
    handleAssignOperator(task) {
      this.selectedTask = task
      this.showAssignPopup = true
      // 先加载用户列表，确保用户数据可用
      this.loadUsers().then(() => {
        let operatorIdsArr = []
        if (task.operatorIds && typeof task.operatorIds === 'string' && task.operatorIds.trim() !== '') {
          operatorIdsArr = task.operatorIds
              .split(',')
              .map(id => id.trim())
              .filter(id => id !== '')
        } else if (task.operatorId && task.operatorId !== '') {
          operatorIdsArr = [String(task.operatorId).trim()]
        }
        // 创建查找Map，键为字符串格式的userId
        const userMap = new Map()
        this.userList.forEach(user => {
          userMap.set(String(user.userId), user)
        })
        // 查找匹配的用户
        const matchedUsers = []
        operatorIdsArr.forEach(id => {
          const user = userMap.get(id)
          if (user) {
            matchedUsers.push(user)
          }
        })

        this.selectedUsers = matchedUsers
        this.selectedUserIds = matchedUsers.map(user => user.userId)
      })
    },

    // 关闭指派操作工模态框
    closeAssignModal() {
      this.showAssignPopup = false
      this.selectedTask = null
      this.selectedUserIds = [] // 清空多选数组
      this.userList = []
      this.filteredUserList = []
      this.userSearchQuery = '' // 清空搜索关键词
    },

    // 加载用户列表
    loadUsers() {
      this.userLoading = true
      return new Promise((resolve, reject) => {
        // 调用获取用户列表的API，这里需要根据实际API调整参数
        getUserList().then(res => {
              if (res.code === 200) {
                this.userList = res.rows || []
                this.filteredUserList = [...this.userList] // 初始化过滤列表
              } else {
                uni.showToast({title: res.msg || '加载用户列表失败', icon: 'none'})
                this.userList = []
                this.filteredUserList = []
              }
              resolve()
            })
            .catch(error => {
              uni.showToast({title: '加载用户列表失败', icon: 'none'})
              this.userList = []
              this.filteredUserList = []
              reject(error)
            })
            .finally(() => {
              this.userLoading = false
            })
      })
    },

    // 用户搜索处理
    handleUserSearch() {
      if (!this.userSearchQuery.trim()) {
        this.filteredUserList = [...this.userList]
        return
      }

      const query = this.userSearchQuery.toLowerCase().trim()
      this.filteredUserList = this.userList.filter(user =>
          user.nickName && user.nickName.toLowerCase().includes(query)
      )
    },

    // 清空用户搜索
    clearUserSearch() {
      this.userSearchQuery = ''
      this.filteredUserList = [...this.userList]
    },

    toggleSelectUser(userId) {
      if (this.selectedUserIds.includes(userId)) {
        this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId)
      } else {
        this.selectedUserIds.push(userId)
      }
    },

    // 删除已选用户
    removeSelectedUser(userId) {
      this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId)
    },

    // 确认指派操作工
    confirmAssignLeader() {
      if (!this.selectedTask) {
        uni.showToast({title: '任务信息错误', icon: 'none'})
        return
      }

      if (this.selectedUserIds.length === 0) {
        uni.showToast({title: '请选择至少一名操作工', icon: 'none'})
        return
      }

      const selectedUsers = this.userList.filter(user => this.selectedUserIds.includes(user.userId))
      const userNames = selectedUsers.map(user => user.nickName).join('、')
      const isReassign = this.selectedTask.isOperator === '1'
      const actionText = isReassign ? '重新分配' : '指派'

      // 保存当前的选中状态
      const tempSelectedUserIds = [...this.selectedUserIds]
      const tempSelectedTask = this.selectedTask

      // 先关闭指派弹窗
      this.closeAssignModal()

      uni.showModal({
        title: '确认' + actionText,
        content: `确定要将任务 ${tempSelectedTask.taskNo} ${actionText}给 ${userNames} 吗？`,
        success: (res) => {
          if (res.confirm) {
            // 恢复选中状态
            this.selectedTask = tempSelectedTask
            this.selectedUserIds = tempSelectedUserIds
            this.doAssignLeader()
          }
        }
      })
    },

    // 执行指派操作
    async doAssignLeader() {
      const params = {
        ids: this.selectedTask.id,
        operatorIds: this.selectedUserIds.join(',') // 传递多选的操作工ID数组
      }

      try {
        const res = await updateOperator(params)
        if (res.code === 200) {
          uni.showToast({title: '指派成功'})
          this.closeAssignModal()
          // 重新加载数据
          this.page = 1
          this.fetchTableData()
        } else {
          uni.showToast({title: res.msg || '指派失败', icon: 'none'})
        }
      } catch (error) {
        uni.showToast({title: '网络错误', icon: 'none'})
      }
    },


  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
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
  min-width: 280rpx;
  margin-right: 20rpx;

  &:last-child {
    margin-right: 0;
  }
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

.date-range {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 200rpx;
  padding: 8rpx 16rpx;
  margin-right: 30rpx;
  background-color: #F8F8F8;
  border-radius: 6rpx;

  .date-text {
    font-size: 14px;
    color: #333333;
  }
}

.filter-label {
  font-size: 14px;
  color: #333333;
  white-space: nowrap;
  min-width: 80rpx;
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
    width: 150rpx;
    font-size: 14px;
    color: #666666;
    flex-shrink: 0;
  }

  .info-value {
    flex: 1;
    font-size: 14px;
    color: #333333;

    &.completed {
      color: #07c160;
      font-weight: 500;
    }

    &.operator-name {
      color: #2979FF;
      font-weight: 500;
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
  padding-top: 20rpx;
}

.action-time {
  color: #5a5a5a;
  flex: 1;
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

/* 指派操作工模态框样式 */
.assign-modal {
  width: 100%;
  background-color: #fff;
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.assign-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx 30rpx;
}

/* 已选标签样式 */
.selected-info {
  margin-bottom: 20rpx;
  padding: 10rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.selected-title {
  font-size: 14px;
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
  display: inline-flex;
  align-items: center;
  background-color: #f0f8ff;
  border: 1rpx solid #e0e8ff;
  border-radius: 16rpx;
  padding: 6rpx 12rpx;
  gap: 6rpx;
  font-size: 12px;
}

.tag-text {
  color: #2979FF;
}

.tag-delete {
  cursor: pointer;
  transition: color 0.2s;

  &:active {
    color: #fa3534;
  }
}

/* 用户搜索栏样式 */
.user-search-bar {
  margin-bottom: 20rpx;
}

.user-search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 6rpx;
  padding: 0 10px;
  height: 32px;
}

.user-search-icon {
  margin-right: 6px;
}

.user-search-input {
  flex: 1;
  height: 100%;
  font-size: 13px;
  color: #333;
  background-color: transparent;
}

.user-search-input::placeholder {
  color: #999;
}

.clear-search-icon {
  margin-left: 6px;
  cursor: pointer;
}

.user-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:active {
    background-color: #f0f0f0;
  }

  &:last-child {
    border-bottom: none;
  }

  &.active {
    background-color: #f0f8ff;
  }
}

.user-name {
  font-size: 14px;
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 30rpx;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  background-color: #fff;
}

/* 禁用状态的确认按钮 */
.confirm-btn:disabled {
  background-color: #ccc;
  color: #fff;
}

/* 详情弹出层样式 */
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

:deep(.status-tag-detail) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
}

/* 自定义下拉内容样式 */
.dropdown-custom-content {
  padding: 10rpx 0;
  background-color: #fff;
}

.dropdown-custom-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  cursor: pointer;
  transition: background-color 0.2s;
  border-top: 1rpx solid #f0f0f0;

  &:active {
    background-color: #f0f0f0;
  }

  &.active {
    background-color: #f0f8ff;
  }
}

.option-label {
  font-size: 14px;
  color: #333;
}

.dropdown-custom-footer {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  padding: 10rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

:deep(.u-button--mini) {
  min-width: 120rpx;
}
</style>