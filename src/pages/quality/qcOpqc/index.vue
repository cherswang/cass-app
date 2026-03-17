<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="委外检验"
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
                placeholder="搜索检验单编号/产品名称/委托单位"
                :show-action="false"
                bg-color="#F8F8F8"
                border-color="#F8F8F8"
                placeholder-color="#C8C9CC"
                shape="square"
                @search="handleSearch"
                class="search-input"
            />

            <view class="search-icon" @click="handleSearch">
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
                    v-model="selectedResult.value"
                    :title="selectedResult.label"
                    :options="resultOptions"
                    @change="handleResultChange"
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
      <!-- 加载状态 -->
      <view v-if="loading && tableData.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <!-- 空数据状态 -->
      <view v-else-if="tableData.length === 0" class="empty-container">
        <u-empty
            mode="data"
            text="暂无检验单数据"
        >
        </u-empty>
      </view>

      <!-- 数据列表 -->
      <view v-else class="record-list">
        <view
            class="record-item"
            v-for="(item, index) in tableData"
            :key="item.opqcId"
        >
          <view class="record-header">
            <text class="order-number">检验单编号：&nbsp;&nbsp;{{ item.opqcCode || '-' }}</text>
            <u-tag
                :text="getStatusText(item.status) || '-'"
                :type="getStatusTagType(item.status)"
                size="mini"
            />
          </view>

          <view class="record-content" @click="viewDetail(item)">
            <view class="info-row">
              <text class="info-label">委托单位：</text>
              <text class="info-value">{{ item.entrustCorp || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品名称：</text>
              <text class="info-value">{{ item.itemName || '-' }}</text>
            </view>


            <view class="info-row">
              <text class="info-label">工单编码：</text>
              <text class="info-value">{{ item.workorderCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">任务编号：</text>
              <text class="info-value">{{ item.taskCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">工序名称：</text>
              <text class="info-value">{{ item.processName || '-' }}</text>
            </view>


            <view class="info-row">
              <text class="info-label">规格型号：</text>
              <text class="info-value">{{ item.specification || '-' }}</text>
              <text class="info-label">检测数量：</text>
              <text class="info-value">{{ item.quantityCheck || 0 }}</text>
            </view>
            <view class="info-row" v-if="selectedStatus.value === '0' || selectedStatus.value === 'all'">
            </view>
            <view class="info-row" v-else>
              <text class="info-label">检测结果：</text>
              <u-tag
                  :text="getCheckResultText(item.checkResult) || '-'"
                  :type="getCheckResultTagType(item.checkResult)"
                  size="mini"
                  class="status-tag-info"
              />
            </view>
            <view v-if="item.checkResult" class="info-row">
              <text class="info-label">不合格数：</text>
              <text class="info-value">{{ item.quantityUnqualified || 0 }}</text>
              <text class="info-label">检测人员：</text>
              <text class="info-value">{{ item.inspector || '-' }}</text>
            </view>
            <view v-if="item.checkResult" class="info-row">
              <text class="info-label">检测结果：</text>
              <text class="info-value" :class="getCheckResultTagType(item.checkResult) === 'success' ? 'completed' : 'error'">
                {{ getCheckResultText(item.checkResult) || '-' }}
              </text>
              <text class="info-label">合格数量：</text>
              <text class="info-value completed">{{ item.quantityQualified || 0 }} {{ item.unitOfMeasure || '-' }}</text>
            </view>
          </view>

          <view class="record-actions">
            <view class="action-divider"></view>
            <view class="action-content">
              <text class="action-time">{{ item.createTime || '-' }}</text>
              <view class="action-buttons">
                <up-button v-if="!item.checkResult" class="inspect-btn" type="primary" text="检验" size="small" @click="edit(item)"></up-button>
                <up-button v-else class="print-btn" type="success" text="打印" size="small" @click="openPrinterModal(item)"></up-button>
              </view>
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

    <!-- 打印机选择弹窗 -->
    <up-popup
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
            <u-loading-icon size="20" text="加载打印机列表中..."></u-loading-icon>
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
                <up-icon v-if="selectedPrinter?.id === printer.id" name="checkmark" size="20" color="#2979FF"></up-icon>
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
        <view class="detail-header">
          <text class="detail-title">检验单详情</text>
        </view>

        <scroll-view class="detail-content" scroll-y>
          <!-- 基本信息 -->
          <view class="detail-section">
            <view class="section-title">基本信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">检验单名称</text>
                <text class="detail-value">{{ currentDetail.opqcName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">检验单编号</text>
                <text class="detail-value">{{ currentDetail.opqcCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">委托单位</text>
                <text class="detail-value">{{ currentDetail.entrustCorp || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">工单编码</text>
                <text class="detail-value">{{ currentDetail.workorderCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">任务编号</text>
                <text class="detail-value">{{ currentDetail.taskCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">工序名称</text>
                <text class="detail-value">{{ currentDetail.processName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">产品名称</text>
                <text class="detail-value">{{ currentDetail.itemName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">产品编码</text>
                <text class="detail-value">{{ currentDetail.itemCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">规格型号</text>
                <text class="detail-value">{{ currentDetail.specification || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">检测数量</text>
                <text class="detail-value">{{ currentDetail.quantityCheck || 0 }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">状态</text>
                <u-tag
                    :text="getStatusText(currentDetail.status)"
                    :type="getStatusTagType(currentDetail.status)"
                    size="mini"
                    class="status-tag-detail"
                />
              </view>
            </view>
          </view>

          <!-- 检验信息 -->
          <view class="detail-section" v-if="currentDetail.checkResult">
            <view class="section-title">检验信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">合格数量</text>
                <text class="detail-value completed">{{ currentDetail.quantityQualified || 0 }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">不合格数量</text>
                <text class="detail-value error">{{ currentDetail.quantityUnqualified || 0 }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">检测结果</text>
                <u-tag
                    :text="getCheckResultText(currentDetail.checkResult)"
                    :type="getCheckResultTagType(currentDetail.checkResult)"
                    size="mini"
                    class="status-tag-detail"
                />
              </view>
              <view class="detail-item">
                <text class="detail-label">检测人员</text>
                <text class="detail-value">{{ currentDetail.inspector || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">要求完成时间</text>
                <text class="detail-value">{{ formatDate(currentDetail.finishTime) || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">实际检测时间</text>
                <text class="detail-value">{{ formatDate(currentDetail.inspectDate) || '-' }}</text>
              </view>
            </view>
          </view>

          <!-- 检测项 -->
          <view class="detail-section">
            <view class="section-title">检测项</view>
            <view v-if="loadingOpqcLine" class="loading-container">
              <u-loading-icon size="20" text="加载检测项中..."></u-loading-icon>
            </view>
            <view v-else-if="opqcLineList.length === 0" class="empty-container">
              <u-empty mode="data" text="暂无检测项数据"></u-empty>
            </view>
            <view v-else class="test-items-section">
              <view class="test-items-scroll">
                <view class="test-items-grid">
                  <view
                      class="test-item"
                      v-for="(line, index) in opqcLineList"
                      :key="line.id || index"
                  >
                    <text class="test-item-label">{{ line.indexName || '-' }}{{ line.unitOfMeasure && line.unitOfMeasure.trim() ? `(${line.unitOfMeasure})` : '' }}</text>
                    <text class="test-item-value">{{ line.testData || '-' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="detail-section">
            <view class="section-title">操作信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">创建时间</text>
                <text class="detail-value">{{ currentDetail.createTime || '-' }}</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="inspect-record-button-fixed">
          <up-button type="primary" text="查看检验记录" size="default" @click="openTestRecordModal(currentDetail.opqcId)"></up-button>
        </view>
      </view>
    </up-popup>

    <!-- 检验弹窗 -->
    <OpqcInspectDialog
        v-model:show="showInspectDialog"
        :opqc-id="currentInspectItem?.opqcId"
        @close="handleInspectClose"
        @success="handleInspectSuccess"
    />

    <!-- 检验记录弹窗 -->
    <Defectrecord
        :lineId="currentLineId"
        :qcId="qcId"
        :dialog-show="testRecordDialogShow"
        @close="closeTestRecordModal"
    />

    <!-- 全局提示 -->
    <up-toast ref="uToast"></up-toast>
  </view>
</template>

<script>
import OpqcInspectDialog from './opqcInspectDialog.vue'
import Defectrecord from '@/pages/quality/testData/index.vue'
import { listOpqc, delOpqc } from '@/api/quality/qcOpqc'
import { listOpqcLine } from '@/api/quality/qcOpqcLine'
import { getPrintConfigListAll } from '@/api/system/printConfig'
import { printLabel } from '@/api/quality/qcIpqc'

// 单据状态字典
const ORDER_STATUS_OPTIONS = [
  { value: '0', label: '待检验', type: 'warning' },
  { value: '1', label: '已检验', type: 'success' }
]

// 检测结果字典
const CHECK_RESULT_OPTIONS = [
  { value: 'ACCEPT', label: '检验通过', type: 'success' },
  { value: 'REJECT', label: '检验不通过', type: 'danger' }
]

export default {
  name: 'QcOpqcList',
  components: { OpqcInspectDialog, Defectrecord },
  data() {
    return {
      selectedStatus: { label: '检验状态', value: 'all' },
      statusOptions: [
        { label: '全部', value: 'all' },
        { label: '待检验', value: '0' },
        { label: '已检验', value: '1' }
      ],
      selectedResult: { label: '检验结果', value: 'all' },
      resultOptions: [
        { label: '全部', value: 'all' },
        { label: '检验通过', value: 'ACCEPT' },
        { label: '检验不通过', value: 'REJECT' }
      ],

      // 数据相关
      tableData: [],
      loading: false,
      loadingMore: false,
      searchQuery: '',
      page: 1,
      pageSize: 10,
      total: 0,

      orderStatusOptions: ORDER_STATUS_OPTIONS,
      checkResultOptions: CHECK_RESULT_OPTIONS,
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,
      refresherTriggered: false,
      printerList: [],
      selectedPrinter: null,
      printerLoading: false,
      currentPrintItem: null,
      showPrinterPopup: false,
      showDetailPopup: false,
      currentDetail: {},
      opqcLineList: [],
      loadingOpqcLine: false,
      showInspectDialog: false,
      currentInspectItem: null,
      testRecordDialogShow: false,
      currentLineId: '',
      qcId: ''
    }
  },
  computed: {
    hasMore() {
      if (this.total === 0) return false
      return this.tableData.length < this.total
    }
  },
  onLoad() {
    this.fetchTableData()
  },
  onShow() {
    // 监听全局刷新事件
    uni.$on('refreshOpqcList', (needRefresh) => {
      if (needRefresh) {
        this.page = 1
        this.fetchTableData()
      }
    })
  },
  onUnload() {
    // 移除全局事件监听
    uni.$off('refreshOpqcList')
  },
  methods: {
    // 构建查询参数
    buildQueryParams() {
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize
      }
      if (this.searchQuery) params.searchValue = this.searchQuery
      if (this.selectedStatus.value !== 'all') params.status = this.selectedStatus.value
      if (this.selectedResult.value !== 'all') params.checkResult = this.selectedResult.value
      return params
    },

    async fetchTableData() {
      this.page > 1 ? (this.loadingMore = true) : (this.loading = true)
      try {
        const res = await listOpqc(this.buildQueryParams())
        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : []
          this.tableData = this.page === 1 ? newData : [...this.tableData, ...newData]
          this.total = Number(res.total) || 0
        } else {
          this.$refs.uToast.show({ type: 'error', message: res.msg || '获取数据失败' })
        }
      } catch (err) {
        this.$refs.uToast.show({ type: 'error', message: '网络错误，请重试' })
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

    handleScrollToLower() {
      if (this.loading || this.loadingMore || !this.hasMore) return
      this.page += 1
      this.fetchTableData()
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.fetchTableData()
    },

    // 检验状态筛选变化
    handleStatusChange(value) {
      const opt = this.statusOptions.find(item => item.value === value)
      this.selectedStatus = { label: opt.label, value }
      this.page = 1
      this.fetchTableData()
    },

    handleResultChange(value) {
      const opt = this.resultOptions.find(item => item.value === value)
      this.selectedResult = { label: opt.label, value }
      this.page = 1
      this.fetchTableData()
    },

    handleScroll(e) {
      this.showBackTop = e.detail.scrollTop > this.scrollThreshold
    },

    // 回到顶部
    scrollToTop() {
      this.scrollTop = this.scrollTop + 1
      this.showBackTop = false
    },

    // 查看详情
    viewDetail(row) {
      this.currentDetail = { ...row }
      this.showDetailPopup = true
      this.loadOpqcLine(row.opqcId)
    },

    // 关闭详情
    closeDetail() {
      this.showDetailPopup = false
      this.currentDetail = {}
      this.opqcLineList = []
    },

    // 打开检验弹窗
    edit(row) {
      this.currentInspectItem = row
      this.showInspectDialog = true
    },

    // 关闭检验弹窗
    handleInspectClose() {
      this.showInspectDialog = false
      this.currentInspectItem = null
    },

    // 检验成功回调
    handleInspectSuccess() {
      this.showInspectDialog = false
      this.currentInspectItem = null
      this.page = 1
      this.fetchTableData()
    },

    // 删除检验单
    del(row) {
      uni.showModal({
        title: '提示',
        content: `是否确认删除委外检验单【${row.opqcCode}】？`,
        success: (res) => {
          if (res.confirm) {
            delOpqc(row.opqcId).then(res => {
              if (res.code === 200) {
                uni.showToast({ title: '删除成功' })
                this.page = 1
                this.fetchTableData()
              } else {
                uni.showToast({ title: res.msg || '删除失败', icon: 'none' })
              }
            }).catch(() => {
              uni.showToast({ title: '网络错误', icon: 'none' })
            })
          }
        }
      })
    },

    getStatusTagType(status) {
      const item = this.orderStatusOptions.find(i => i.value === status)
      return item?.type || 'default'
    },

    getStatusText(status) {
      const item = this.orderStatusOptions.find(i => i.value === status)
      return item?.label || '未知状态'
    },

    getCheckResultTagType(result) {
      const item = this.checkResultOptions.find(i => i.value === result)
      return item?.type || 'default'
    },

    getCheckResultText(result) {
      const item = this.checkResultOptions.find(i => i.value === result)
      return item?.label || '未知结果'
    },

    // 日期格式化
    formatDate(value) {
      if (!value) return '-'
      const date = new Date(value)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },

    // 打开打印弹窗
    openPrinterModal(item) {
      this.currentPrintItem = item
      this.showPrinterPopup = true
      this.loadPrinterList()
    },

    // 关闭打印弹窗
    closePrinterModal() {
      this.showPrinterPopup = false
      this.selectedPrinter = null
      this.currentPrintItem = null
    },

    // 加载打印机列表
    async loadPrinterList() {
      this.printerLoading = true
      try {
        const res = await getPrintConfigListAll()
        if (res.code === 200 && res.data) {
          this.printerList = res.data
          this.selectedPrinter = this.printerList[0] || null
        } else {
          this.printerList = []
        }
      } catch (err) {
        this.printerList = []
        uni.showToast({ title: '加载打印机失败', icon: 'none' })
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
      if (!this.selectedPrinter || !this.currentPrintItem) {
        uni.showToast({ title: '参数错误', icon: 'none' })
        return
      }
      uni.showLoading({ title: '打印中...' })
      try {
        const params = {
          recptList: [{ id: this.currentPrintItem.opqcId, status: this.currentPrintItem.status }],
          printerId: this.selectedPrinter.id,
          type: 'opqcType'
        }
        const res = await printLabel(params)
        uni.hideLoading()
        uni.showToast({ title: res.msg || '打印成功', icon: 'success' })
        this.closePrinterModal()
      } catch (err) {
        uni.hideLoading()
        uni.showToast({ title: '打印失败，请重试', icon: 'none' })
      }
    },

    // 加载检测项
    async loadOpqcLine(opqcId) {
      if (!opqcId) return
      this.loadingOpqcLine = true
      try {
        const res = await listOpqcLine({ opqcId })
        this.opqcLineList = res.rows || []
      } catch (err) {
        this.opqcLineList = []
      } finally {
        this.loadingOpqcLine = false
      }
    },

    // 打开检验记录
    openTestRecordModal(opqcId) {
      this.qcId = opqcId
      this.testRecordDialogShow = true
    },

    // 关闭检验记录
    closeTestRecordModal() {
      this.testRecordDialogShow = false
      this.qcId = ''
    }
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

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
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

    &.error {
      color: #ff4d4f;
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

.action-buttons {
  display: flex;
  gap: 10rpx;
}

.inspect-btn, .print-btn, .delete-btn {
  width: 100rpx;
}

.load-more-container, .no-more-container {
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

/* 打印机弹窗样式 */
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

.printer-name {
  font-size: 14px;
  color: #333;
}

.empty-printers {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
}

.modal-footer {
  display: flex;
  justify-content: center;
  padding: 20rpx 30rpx;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  background-color: #fff;
}

:deep(.u-button--mini) {
  min-width: 120rpx;
}

.inspect-record-button-fixed {
  padding: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  background-color: #fff;
}

.inspect-record-button-fixed up-button {
  width: 100%;
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

/* 检测项区域 */
.test-items-section {
  margin-top: 10rpx;
}

.test-items-scroll {
  overflow-x: auto;
  margin: 0 -10rpx;
  padding: 0 10rpx;
}

.test-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200rpx, 1fr));
  gap: 15rpx;
  min-width: max-content;
}

.test-item {
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.test-item-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8rpx;
  word-break: break-word;
}

.test-item-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.status-tag-info {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
}
</style>