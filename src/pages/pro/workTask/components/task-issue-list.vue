<template>
  <view class="container">
    <!-- 吸顶容器 -->
    <view class="sticky-container">
      <!-- 筛选栏 -->
      <up-sticky :offset-top="130" :index="2" bg-color="#FFFFFF">
        <view class="filter-section">
          <view class="filter-row">
            <view class="dropdown-wrapper">
              <up-dropdown ref="filterDropdown">
                <up-dropdown-item
                    v-model="selectedFilter"
                    :title="getSelectedFilterLabel()"
                    :options="filterOptions"
                    @change="handleFilterChange"
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
        @refresherrefresh="onRefresherRefresh"
        @scrolltolower="onScrollToLower"
        @scroll="handleScroll"
        :scroll-top="scrollTop"
    >
      <!-- 加载状态 -->
      <view v-if="taskIssueLoading && taskIssueList.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <!-- 空数据状态 -->
      <view v-else-if="taskIssueList.length === 0" class="empty-container">
        <u-empty
            mode="data"
            text="暂无投料记录"
        >
        </u-empty>
      </view>

      <!-- 投料记录列表 -->
      <view v-else class="task-list">
        <view class="task-item" v-for="(item, index) in taskIssueList" :key="item.recordId">
          <view class="task-header">
            <view class="task-no-wrapper">
              <text class="task-no">{{ item.batchCode }}</text>
            </view>
            <up-tag :type="item.feedingStatus === 0 ? 'warning' : 'success'">
              {{ item.feedingStatus === 0 ? '上机' : '下机' }}
            </up-tag>
          </view>

          <view class="task-content">
            <view class="info-row">
              <text class="info-label">物料编码:</text>
              <text class="info-value">{{ item.productCode || '-' }}</text>
              <text class="info-label">物料名称:</text>
              <text class="info-value">{{ item.productName || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">规格型号:</text>
              <text class="info-value">{{ item.productSpec || '-' }}</text>
              <text class="info-label">投料数量:</text>
              <text class="info-value">{{ item.quantityIssued }} {{ item.unit || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">投料人:</text>
              <text class="info-value">{{ item.createByName || '-' }}</text>
              <text class="info-label">设备编码:</text>
              <text class="info-value">{{ item.machineryTypeCode || '-' }}</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="task-footer">
            <view class="action-divider"></view>
            <view class="action-content">
              <text class="action-time">{{ item.createTime || '-' }}</text>
              <view class="action-buttons">
                <up-button v-if="item.feedingStatus === 1" class="print-btn" type="success" size="small" text="打标签" @click="openPrinterModal(item)">
                </up-button>
                <up-button v-else class="inspect-btn" type="primary" size="small" text="余料打标签" @click="openRemainingQuantityModal(item)">
                </up-button>
                <up-button :disabled="item.feedingStatus === 1" class="delete-btn" type="error" size="small" text="删除" @click="deleteTaskIssue(item.recordId)">
                </up-button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多状态 -->
      <view v-if="taskIssueLoading && taskIssueList.length > 0" class="load-more-container">
        <u-loading-icon size="24" text="正在加载更多数据..."></u-loading-icon>
      </view>

      <!-- 没有更多数据提示 -->
      <view v-else-if="!hasMore && taskIssueList.length > 0" class="no-more-container">
        <text class="no-more-text">已经到底了，没有更多数据了</text>
      </view>

      <!-- 还有更多数据提示 -->
      <view v-else-if="hasMore && taskIssueList.length > 0" class="more-tips">
        <text class="more-text">继续上拉加载更多数据...</text>
      </view>
    </scroll-view>

    <!-- 统计信息区域（固定在底部） -->
    <view class="statistics-container fixed-bottom statistics-layout">
      <view class="statistics-col-wrapper">
        <view class="statistics-col">
          <view class="statistics-item">
            <text class="statistics-label">共</text>
            <text class="statistics-value">{{ totalRecords }}</text>
            <text class="statistics-unit">盘</text>
          </view>
          <view class="statistics-item">
            <text class="statistics-label">已使用：</text>
            <text class="statistics-value">{{ quantityUsed.toFixed(2) }}</text>
            <text class="statistics-unit">kg</text>
          </view>
        </view>
        <view class="statistics-col">
          <view class="statistics-item">
            <text class="statistics-label">投料总重：</text>
            <text class="statistics-value">{{ totalWeight.toFixed(2) }}</text>
            <text class="statistics-unit">kg</text>
          </view>
          <view class="statistics-item">
            <text class="statistics-label">剩余净重：</text>
            <text class="statistics-value">{{ (totalWeight - quantityUsed).toFixed(2) }}</text>
            <text class="statistics-unit">kg</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 回到顶部按钮 -->
    <view v-if="showBackTop" class="back-top" @click="scrollToTop">
      <u-icon name="arrow-upward" color="#fff" size="20"></u-icon>
    </view>

    <!-- 剩余数量输入弹窗 -->
    <up-popup
        ref="remainingQuantityPopup"
        :show="showRemainingQuantityPopup"
        mode="center"
        :round="16"
        :closeable="true"
        @close="closeRemainingQuantityModal"
    >
      <view class="printer-modal">
        <view class="modal-header">
          <text class="modal-title">余料打标签</text>
        </view>

        <view class="remaining-quantity-modal-content">
          <view class="material-info-preview">
            <view class="content-row">
              <view class="content-item">
                <text class="label">物料编码:</text>
                <text class="value">{{ selectedMaterial?.productCode || '--' }}</text>
              </view>
            </view>
            <view class="content-row">
              <view class="content-item">
                <text class="label">物料名称:</text>
                <text class="value">{{ selectedMaterial?.productName || '--' }}</text>
              </view>
            </view>
            <view class="content-row">
              <view class="content-item">
                <text class="label">规格型号:</text>
                <text class="value">{{ selectedMaterial?.productSpec || '--' }}</text>
              </view>
            </view>
          </view>

          <view class="form-item">
            <text class="form-label">剩余数量</text>
            <view class="form-input-wrapper">
              <input
                  v-model="remainingQuantity"
                  class="form-input"
                  type="digit"
                  placeholder="请输入剩余数量"
                  focus
                  @input="handleQuantityInput"
              />
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <up-button text="取消" size="small" @click="closeRemainingQuantityModal"></up-button>
          <up-button type="primary" text="确定" size="small" @click="confirmRemainingQuantity"></up-button>
        </view>
      </view>
    </up-popup>

    <!-- 打印机选择弹窗 -->
    <up-popup
        ref="printerPopup"
        :show="showPrinterPopup"
        mode="center"
        :round="16"
        :closeable="true"
        @close="closePrinterModal"
    >
      <view class="printer-modal">
        <view class="modal-header">
          <text class="modal-title">选择打印机</text>
        </view>

        <view class="printer-modal-content">
          <view v-if="printerLoading" class="loading-container">
            <u-loading-icon size="24" text="加载打印机列表中..."></u-loading-icon>
          </view>
          <view v-else-if="printerList.length === 0" class="empty-printers">
            <text class="empty-text">暂无可用打印机</text>
          </view>
          <view v-else>
            <view class="printer-list">
              <view
                  v-for="printer in printerList"
                  :key="printer.id"
                  class="printer-item"
                  :class="{'active': selectedPrinter?.id === printer.id}"
                  @click="selectPrinter(printer)"
              >
                <text class="printer-name">{{ printer.printerName }}</text>
                <up-icon
                    v-if="selectedPrinter?.id === printer.id"
                    name="checkmark"
                    size="20"
                    color="#007aff"
                ></up-icon>
              </view>
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <up-button text="取消" size="small" @click="closePrinterModal"></up-button>
          <up-button type="primary" text="确定打印" size="small" @click="confirmPrint" :disabled="!selectedPrinter"></up-button>
        </view>
      </view>
    </up-popup>

    <!-- 全局加载提示 -->
    <up-toast ref="uToast"></up-toast>
  </view>
</template>

<script>
import { getTaskIssueByTaskId, updateRemainingQuantity, deleteTaskIssue,printLabel,getTaskAssignByTaskIdAndUserId } from '@/api/pro/taskIssue'
import { getPrintConfigListAll } from '@/api/system/printConfig'
import {getUserProfile} from "@/api/system/user";

export default {
  name: 'TaskIssueList',
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: {},
      // 投料记录相关
      taskIssueList: [], // 投料记录列表
      taskIssueLoading: false, // 投料记录加载状态
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页大小
      hasMore: true, // 是否有更多数据
      total: 0, // 总数据量
      refresherTriggered: false, // 下拉刷新状态
      // 剩余数量输入弹窗相关
      selectedMaterial: null,
      remainingQuantity: '',
      showRemainingQuantityPopup: false, // 剩余数量弹窗显示状态
      // 打印机相关
      printerList: [], // 打印机列表
      selectedPrinter: null, // 选中的打印机
      printerLoading: false, // 打印机列表加载状态
      printMaterial: null,
      showPrinterPopup: false, // 打印机弹窗显示状态
      // 筛选相关
      filterOptions: [], // 筛选选项列表（从接口获取）
      selectedFilter: '', // 当前选中的筛选值
      taskAssignData: null, // 存储getTaskAssignByTaskIdAndUserId接口返回数据
      // 统计信息
      totalRecords: 0,      // 总记录数（盘数）
      totalWeight: 0.00,    // 净重合计
      quantityUsed : 0.00, //已使用总量
      summary: null,        // API返回的summary字段
      // 滚动相关
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,
    }
  },
  methods: {
    // 获取选中的筛选标签
    getSelectedFilterLabel() {
      const selectedOption = this.filterOptions.find(option => option.value === this.selectedFilter)
      return selectedOption ? selectedOption.label : '筛选'
    },

    async loadFilterOptions() {
      try {
        const params = {
          taskId: this.taskId
        }
        const res = await getTaskAssignByTaskIdAndUserId(params)
        this.taskAssignData = res.data || {}
        if (res.code === 200 && res.data!== null) {
          if (Array.isArray(res.data)) {
            this.filterOptions = res.data.map(item => ({
              label: item || '',
              value: item || ''
            }))
          } else if (typeof res.data === 'object') {
            this.filterOptions = [{
              label: res || '',
              value: res || ''
            }]
          }
          this.filterOptions.unshift({
            label: '全部',
            value: ''
          })
          if (this.filterOptions.length > 0) {
            this.selectedFilter = this.filterOptions[0].value
          }
        }
      } catch (error) {
        console.error('加载筛选选项失败:', error)
        this.filterOptions = [{ label: '全部', value: '' }]
        this.selectedFilter = ''
      }
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
    handleFilterChange(filterValue) {
      this.selectedFilter = filterValue
      this.pageNum = 1
      this.hasMore = true
      this.loadTaskIssueList()
    },
    async getUser() {
      await getUserProfile().then(response => {
        const data = response.data;
        this.user = data.user
        this.roleGroup = data.roleGroup
        this.postGroup = data.postGroup
      }).catch(error => {
        console.error('获取用户信息失败:', error)
      })
    },
    async loadTaskIssueList() {
      await this.getUser();
      // 计算总页数，确保页码不会溢出
      const totalPages = Math.ceil(this.total / this.pageSize) || 1
      const currentPage = this.pageNum

      // 如果已经是最后一页，直接标记为没有更多数据，不执行加载
      if (currentPage > totalPages && this.total > 0) {
        this.taskIssueLoading = false
        this.hasMore = false
        return Promise.resolve()
      }

      this.taskIssueLoading = true
      try {
        const params = {
          taskId: this.taskId,
          pageNum: currentPage,
          pageSize: this.pageSize,
          machineryTypeCode: this.selectedFilter || undefined
        }
        const res = await getTaskIssueByTaskId(params)
        if (res.code === 200) {
          const newRows = Array.isArray(res.rows) ? res.rows : []
          const total = Number(res.total) || 0
          const totalPages = Math.ceil(total / this.pageSize) || 1
          this.total = total
          // 检查API返回的页码是否与请求的页码一致
          const apiPage = Number(res.page) || 1
          if (apiPage !== currentPage && currentPage > 1) {
            console.warn('API returned wrong page:', { requestedPage: currentPage, returnedPage: apiPage })
            this.hasMore = false
            return
          }

          if (currentPage <= totalPages) {
            if (currentPage === 1) {
              // 只有在页码为1时，才重置列表数据
              this.taskIssueList = newRows
              // 保存API返回的summary字段
              this.summary = res.summary || null
            } else {
              // 其他情况下，只追加新数据
              const existingIds = new Set(this.taskIssueList.map(item => item.recordId))
              const uniqueNewRows = newRows.filter(item => !existingIds.has(item.recordId))
              this.taskIssueList = [...this.taskIssueList, ...uniqueNewRows]
            }

            // 精确计算hasMore状态
            this.hasMore = newRows.length > 0 && currentPage < totalPages && this.taskIssueList.length < total
            this.calculateStatistics()
          } else {
            this.hasMore = false
          }
        } else {
        uni.showToast({
          title: res.msg || '加载投料记录失败',
          icon: 'none'
        })
        if (this.pageNum === 1) {
          this.taskIssueList = []
          this.summary = null
          this.calculateStatistics()
        }
      }
      } catch (error) {
        console.error('加载投料记录失败:', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
        if (this.pageNum === 1) {
          this.taskIssueList = []
          this.summary = null
          this.calculateStatistics()
        }
      } finally {
        this.taskIssueLoading = false
      }
    },
    // 计算统计信息
    calculateStatistics() {
      // 只从API返回的summary字段中获取统计数据
      if (this.summary && typeof this.summary === 'object') {
        this.totalRecords = parseInt(this.summary.countNum) || 0
        this.totalWeight = parseFloat(this.summary.quantityIssued) || 0
        this.quantityUsed = parseFloat(this.summary.quantityUsed) || 0
      } else {
        // 如果没有summary字段，则设置为默认值
        this.totalRecords = 0
        this.totalWeight = 0.00
        this.quantityUsed = 0.00
      }
    },
    refresh() {
      this.pageNum = 1
      this.hasMore = true
      return this.loadFilterOptions().then(() => {
        return this.loadTaskIssueList()
      })
    },
    onRefresherRefresh() {
      if (this.refresherTriggered) {
        return
      }

      this.refresherTriggered = true

      this.refresh().finally(() => {
        this.refresherTriggered = false
        // 数据加载完成后，重置滚动位置
        setTimeout(() => {
          const scrollView = uni.createSelectorQuery().in(this).select('.scroll-view')
          scrollView.scrollOffset(data => {
            if (data.scrollTop > 0) {
              scrollView.scrollTo({ scrollTop: 0, duration: 0 })
            }
          }).exec()
        }, 100)
      })
    },
    // 滚动到底部加载更多
    onScrollToLower() {
      // 严格检查：只有当hasMore为true且不在加载中时，才执行加载更多
      if (this.hasMore && !this.taskIssueLoading) {
        this.loadMore()
      }
    },
    // 加载更多
    loadMore() {
      // 最严格的条件判断，防止任何无效加载
      if (!this.hasMore || this.taskIssueLoading) {
        return
      }

      // 检查当前数据长度是否已经达到或超过总数据量
      if (this.taskIssueList.length >= this.total) {
        this.hasMore = false
        return
      }

      // 计算总页数，确保页码不会溢出
      const totalPages = Math.ceil(this.total / this.pageSize) || 1
      const currentPage = this.pageNum
      const nextPage = currentPage + 1

      // 如果已经是最后一页或下一页超过总页数，直接标记为没有更多数据
      if (currentPage >= totalPages || nextPage > totalPages) {
        this.hasMore = false
        return
      }

      // 增加页码，加载下一页
      this.pageNum = nextPage
      this.loadTaskIssueList()
    },
    // 打开剩余数量输入弹窗
    openRemainingQuantityModal(item) {
      this.selectedMaterial = item
      this.remainingQuantity = item.quantityAvailable || '0'
      this.showRemainingQuantityPopup = true
    },
    // 关闭剩余数量输入弹窗
    closeRemainingQuantityModal() {
      this.showRemainingQuantityPopup = false
      this.selectedMaterial = null
      this.remainingQuantity = ''
    },
    handleQuantityInput() {
      let value = this.remainingQuantity.replace(/[^0-9.]/g, '')
      if (value === '' || Number(value) < 0) {
        value = '0'
      }
      this.remainingQuantity = value
    },
    // 确认剩余数量
    async confirmRemainingQuantity() {
      const quantity = Number(this.remainingQuantity)
      if (isNaN(quantity) || quantity < 0) {
        uni.showToast({
          title: '请输入有效的剩余数量',
          icon: 'none'
        })
        return
      }

      try {
        const params = {
          recordId: this.selectedMaterial.recordId,
          quantityAvailable: quantity
        }
        const res = await updateRemainingQuantity(params)
        if (res.code === 200) {
          uni.showToast({
            title: '余料打标签成功',
            icon: 'success'
          })
          this.printMaterial = this.selectedMaterial
          this.closeRemainingQuantityModal()
          // 刷新数据
          this.refresh()
          // 打开打印机选择弹窗
          this.showPrinterPopup = true
          this.loadPrinterList()
        } else {
          uni.showToast({
            title: res.msg || '余料打标签失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('余料打标签失败:', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      }
    },

    // 打开打印机选择弹窗
    openPrinterModal(item) {
      this.printMaterial = item
      this.selectedMaterial = item
      this.showPrinterPopup = true
      this.loadPrinterList()
    },

    // 关闭打印机选择弹窗
    closePrinterModal() {
      this.showPrinterPopup = false
      this.printMaterial = null
      this.selectedPrinter = null
    },

    // 加载打印机列表
    async loadPrinterList() {
      if (!this.printMaterial && !this.selectedMaterial) {
        uni.showToast({
          title: '物料信息不存在',
          icon: 'none'
        })
        this.showPrinterPopup = false
        return
      }

      this.printerLoading = true
      try {
        // 调用后端接口获取打印机列表
        const result = await getPrintConfigListAll()
        if (result.code === 200 && result.data) {
          this.printerList = result.data
          // 默认选择第一个打印机
          if (this.printerList.length > 0) {
            this.selectedPrinter = this.printerList[0]
          }
        } else {
          this.printerList = []
        }
      } catch (error) {
        console.error('加载打印机列表失败:', error)
        this.printerList = []
        uni.showToast({
          title: '加载打印机列表失败',
          icon: 'none',
          duration: 2000
        })
      } finally {
        this.printerLoading = false
      }
    },

    // 选择打印机
    selectPrinter(printer) {
      this.selectedPrinter = printer
    },

    // 确认打印
    async confirmPrint() {
      // 校验打印物料信息
      if (!this.printMaterial) {
        uni.showToast({
          title: '打印物料信息丢失，请重试',
          icon: 'none',
          duration: 1000
        })
        this.showPrinterPopup = false
        return
      }

      if (!this.selectedPrinter) {
        uni.showToast({
          title: '请选择打印机',
          icon: 'none',
          duration: 1000
        })
        return
      }

      try {
        uni.showLoading({
          title: '标签打印中...'
        })
        // 调用后端打印标签接口
        const result = await printLabel({
          recptIds: [this.printMaterial.recordId],
          printerId: this.selectedPrinter.id
        })

        uni.hideLoading()
        uni.showToast({
          title: result.msg || '标签打印成功',
          icon: 'success',
          duration: 2000
        })
        this.showPrinterPopup = false
      } catch (error) {
        console.error('打印标签失败:', error)
        uni.hideLoading()
        uni.showToast({
          title: '打印标签失败',
          icon: 'none',
          duration: 2000
        })
        this.showPrinterPopup = false
      }
    },
    // 删除投料记录
    async deleteTaskIssue(recordId) {
      try {
        // 弹出确认对话框
        const confirmResult = await new Promise((resolve) => {
          uni.showModal({
            title: '确认删除',
            content: '确定要删除这条投料记录吗？',
            success: (res) => {
              resolve(res.confirm)
            },
            fail: () => {
              resolve(false)
            }
          })
        })

        if (!confirmResult) {
          return
        }

        const res = await deleteTaskIssue(recordId)
        if (res.code === 200) {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
          // 刷新数据
          this.refresh()
        } else {
          uni.showToast({
            title: res.msg || '删除失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('删除失败:', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      }
    }
  },
  // 组件挂载时自动加载数据
  mounted() {
    this.loadFilterOptions().then(() => {
      this.loadTaskIssueList()
    })
  }
}
</script>

<style lang="scss" scoped>/* 容器样式 */
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.sticky-container {
  flex-shrink: 0;
  background: #fff;
}

/* 筛选栏 */
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
  min-width: 100rpx;
  margin-right: 20rpx;

  &:last-child {
    margin-right: 0;
  }
}

:deep(.u-dropdown__content) {
  width: 100vw !important;
  left: -30rpx !important;
}

/* 滚动容器 */
.scroll-container {
  height: calc(100vh - 250rpx);
  box-sizing: border-box;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-container {
  padding: 100rpx 30rpx;
}

/* 任务列表 */
.task-list {
  padding: 20rpx 30rpx;
}

.task-item {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

/* 序号样式 */
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

/* 任务头部 */
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

.status-tag {
  font-size: 24rpx;
  margin-left: 10rpx;
}

/* 任务内容 */
.task-content {
  margin-bottom: 20rpx;

  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
  }

  .info-label {
    width: 120rpx;
    font-size: 14px;
    color: #666666;
    flex-shrink: 0;
  }

  .info-value {
    flex: 1;
    font-size: 14px;
    color: #333333;

    &.text-green {
      color: #07c160;
      font-weight: 500;
    }

    &.text-red {
      color: #ff4d4f;
      font-weight: 500;
    }
  }
}

/* 操作按钮 */
.task-footer {
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

.action-buttons {
  display: flex;
  gap: 15rpx;
  margin-left: auto;
}

.print-btn, .inspect-btn, .delete-btn {
  width: 120rpx;
}

/* 加载更多状态 */
.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
}

/* 没有更多数据提示 */
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

/* 还有更多数据提示 */
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

/* 统计信息区域 */
.statistics-container.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 2rpx solid #e8e8e8;
  z-index: 10;
  display: flex;
  flex-direction: column;
  height: 120rpx;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
}

.statistics-layout {
  /* 移除冲突的样式设置 */
}

.statistics-col-wrapper {
  display: flex;
  flex-direction: row;
  gap: 60rpx;
  height: 100%;
}

.statistics-col {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  justify-content: center;
  flex: 1;
}

.statistics-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.statistics-label {
  font-size: 28rpx;
  color: #333;
  margin-right: 0;
}

.statistics-value {
  font-size: 30rpx;
  font-weight: bold;
  color: #007aff;
  margin: 0;
}

.statistics-unit {
  font-size: 22rpx;
  color: #666;
}

/* 回到顶部按钮 */
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

/* 弹窗样式 */
.printer-modal {
  width: 600rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
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

.printer-modal-content {
  max-height: 500rpx;
  overflow-y: auto;
  padding: 30rpx;
}

.remaining-quantity-modal-content {
  padding: 30rpx;
}

.material-info-preview {
  background-color: #f8f9fa;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.form-item {
  margin-top: 20rpx;
  display: block;
  padding: 0 10rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin: 0 0 10rpx 10rpx;
  display: block;
}

.form-input-wrapper {
  padding-left: 10rpx;
}

.form-input {
  width: 100%;
  height: 72rpx;
  border: 1rpx solid #e8e8e8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  margin-left: 0;
}

.printer-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.printer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &.active {
    background-color: #f0f8ff;
  }

  &:active {
    background-color: #f5f5f5;
  }

  &.active:active {
    background-color: #e6f7ff;
  }
}

.printer-name {
  font-size: 28rpx;
  color: #333;
}

.empty-printers {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
}

.modal-footer {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 30rpx;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  background-color: #fff;
}

:deep(.u-button--small) {
  min-width: 120rpx;
}

.text-green {
  color: #00b42a;
  font-weight: 600;
}

.text-red {
  color: #ff4d4f;
  font-weight: 600;
}
</style>