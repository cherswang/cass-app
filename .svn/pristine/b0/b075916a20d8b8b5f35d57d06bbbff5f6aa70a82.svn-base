<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="产品入库"
        :safeAreaInsetTop="true"
        :placeholder="true"
        bg-color="#FFFFFF"
        title-color="#333333"
        :border="false"
        :auto-back="true"
        rightText="新增"
        @rightClick="goToSave"
    />

    <!-- 吸顶容器 -->
    <view class="sticky-container">
      <!-- 搜索栏 -->
      <up-sticky :offset-top="0" bg-color="#FFFFFF">
        <view class="search-section">
          <view class="search-container">
            <u-search
                v-model="searchKeyword"
                placeholder="批次号/物料编码/物料名称"
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
                    :title="selectedStatus.label"
                    :options="statusOptions"
                    @change="handleStatusChange"
                    :value="selectedStatus.value"
                />
              </up-dropdown>
            </view>

<!--            <text class="filter-label">日期范围</text>-->

<!--            <view class="date-range" @click="showDatePicker = true">-->
<!--              <text class="date-text">{{ dateRangeText }}</text>-->
<!--              <u-icon name="calendar" size="20" color="#666666"></u-icon>-->
<!--            </view>-->
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
            text="暂无产品入库记录"
        >
          <template #bottom>
            <u-button
                type="primary"
                size="small"
                @click="goToSave"
                text="新增入库"
            ></u-button>
          </template>
        </u-empty>
      </view>

      <!-- 数据列表 -->
      <view v-else class="record-list">
        <view
            class="record-item"
            v-for="(item, index) in tableData"
            :key="item.recptId + index"
        >
          <view class="record-header">
            <text class="order-number">批&nbsp;&nbsp;次&nbsp;&nbsp;号：&nbsp;&nbsp;{{ getMaterialField(item, 'batchCode') || '-' }}</text>
            <u-tag
                :text="getStatusText(item.status)"
                :type="getStatusType(item.status)"
                size="mini"
            />
          </view>

          <view class="record-content"
                @click="showDetail(item)">
            <view class="info-row">
              <text class="info-label">产品名称：</text>
              <text class="info-value">{{ getMaterialField(item, 'itemName') || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品编码：</text>
              <text class="info-value">{{ getMaterialField(item, 'itemCode') || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">规&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格：</text>
              <text class="info-value">{{ getMaterialField(item, 'specification') || '-' }}</text>
              <text class="info-label">毛&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;重：</text>
              <text class="info-value price">{{ getMaterialField(item, 'grossWeight') || '-' }} kg</text>
            </view>
            <view class="info-row">
              <text class="info-label">净&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;重：</text>
              <text class="info-value price">{{ getMaterialField(item, 'netWeight') || '-' }} kg</text>
              <text class="info-label">盘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;重：</text>
              <text class="info-value price">{{ getMaterialField(item, 'tareWeight') || '-' }} kg</text>
            </view>
            <view class="info-row">
              <text class="info-label">仓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库：</text>
              <text class="info-value">{{ item.warehouseName || '-' }}</text>
            </view>
          </view>

          <view class="record-actions">
            <view class="action-divider"></view>
            <view class="action-content">
              <text class="action-time">{{ formatTime(item.createTime) }}</text>
              <u-button
                  type="primary"
                  size="mini"
                  @click.stop="openPrinterModal(item)"
                  class="print-btn"
              >打印标签
              </u-button>
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

    <!-- 日期选择器 -->
    <up-calendar
        :show="showDatePicker"
        mode="range"
        :defaultDate="defaultDateRange"
        :minDate="minDate"
        :maxDate="maxDate"
        @confirm="handleDateConfirm"
        @close="showDatePicker = false"
    />

    <!-- 打印机选择 ActionSheet -->
    <u-action-sheet
        :show="showPrinterSheet"
        :actions="printerActions"
        title="选择打印机"
        @select="handlePrinterSelect"
        @close="closePrinterSheet"
        :close-on-click-action="true"
        :safe-area-inset-bottom="true"
        cancel-text="取消"
    >
      <!-- 自定义加载状态 -->
      <template v-if="printerLoading" #header>
        <view class="sheet-loading">
          <u-loading-icon size="20" text="加载中..."></u-loading-icon>
        </view>
      </template>
    </u-action-sheet>

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
          <text class="detail-title">入库详情</text>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="detail-content" scroll-y>
          <!-- 基本信息 -->
          <view class="detail-section">
            <view class="section-title">基本信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">入库单号</text>
                <text class="detail-value">{{ currentDetail.recptCode || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">状态</text>
                <u-tag
                    :text="getStatusText(currentDetail.status)"
                    :type="getStatusType(currentDetail.status)"
                    size="mini"
                    class="status-tag-detail"
                />
              </view>
              <view class="detail-item">
                <text class="detail-label">入库日期</text>
                <text class="detail-value">{{ formatTime(currentDetail.recptDate) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">仓库</text>
                <text class="detail-value">{{ currentDetail.warehouseName || '-' }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">备注</text>
                <text class="detail-value">{{ currentDetail.remark || '无' }}</text>
              </view>
            </view>
          </view>

          <!-- 物料信息 -->
          <view class="detail-section" v-if="currentDetail.materialLines && currentDetail.materialLines.length > 0">
            <view class="section-title">物料信息</view>
            <view class="material-list">
              <view
                  class="material-item"
                  v-for="(material, index) in currentDetail.materialLines"
                  :key="material.lineId || index"
              >
                <view class="material-header">
                  <text class="material-index">物料 {{ index + 1 }}</text>
                  <text class="material-batch">{{ material.batchCode || '-' }}</text>
                </view>
                <view class="material-grid">
                  <view class="detail-item">
                    <text class="detail-label">物料编码</text>
                    <text class="detail-value">{{ material.itemCode || '-' }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">物料名称</text>
                    <text class="detail-value">{{ material.itemName || '-' }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">规格型号</text>
                    <text class="detail-value">{{ material.specification || '-' }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">单位</text>
                    <text class="detail-value">{{ material.unitOfMeasure || '-' }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">入库数量</text>
                    <text class="detail-value">{{ material.quantityRecived || '0' }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">毛重</text>
                    <text class="detail-value">{{ material.grossWeight || '0' }} kg</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">净重</text>
                    <text class="detail-value">{{ material.netWeight || '0' }} kg</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">盘重</text>
                    <text class="detail-value">{{ material.tareWeight || '0' }} kg</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">盘具型号</text>
                    <text class="detail-value">{{ material.diskModel || '' }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">长度</text>
                    <text class="detail-value">{{ material.itemLength || '' }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">坯线</text>
                    <text class="detail-value">{{ material.blankWire || '' }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">镀层</text>
                    <text class="detail-value">{{ material.platingLayer || '' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 操作信息 -->
          <view class="detail-section">
            <view class="section-title">操作信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">创建人</text>
                <text class="detail-value">{{ currentDetail.createByName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">创建时间</text>
                <text class="detail-value">{{ formatTime(currentDetail.createTime) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">更新人</text>
                <text class="detail-value">{{ currentDetail.updateByName || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">更新时间</text>
                <text class="detail-value">{{ formatTime(currentDetail.updateTime) }}</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <!-- 底部操作按钮 -->
        <view class="detail-actions">
          <u-button
              type="primary"
              @click="handleDetailPrint(currentDetail)"
              class="detail-print-btn"
          >打印标签
          </u-button>
        </view>
      </view>
    </up-popup>

    <!-- 全局加载提示 -->
    <up-toast ref="uToast"></up-toast>
  </view>
</template>

<script>
import { listProductRecpt, batchPrint } from '@/api/wms/productPut'
import { getPrintConfigListAll } from '@/api/system/printConfig'

export default {
  data() {
    // 获取当前日期和前三个月的日期
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)

    // 格式化日期为 YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    return {
      searchKeyword: '',
      showDatePicker: false,
      selectedStatus: {
        label: '全部',
        value: 'all'
      },
      // 默认设置为前三个月到今天
      dateRange: [formatDate(threeMonthsAgo), formatDate(today)],
      statusOptions: [
        { label: '全部', value: 'all' },
        { label: '已入库', value: 'FINISHED' },
        { label: '待入库', value: 'PREPARE' }
      ],

      // 日期选择范围限制
      minDate: new Date(2020, 0, 1), // 从2020年开始
      maxDate: today, // 到今天为止

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

      // 滚动相关
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,

      // 搜索条件缓存
      searchQuery: '',

      // 调试模式
      showDebug: false,

      // 打印机相关
      showPrinterSheet: false,
      printerActions: [], // ActionSheet 格式的打印机列表
      printerLoading: false,
      currentPrintItem: null,

      // 详情弹出层相关
      showDetailPopup: false,
      currentDetail: {}, // 当前显示的详情数据
    }
  },

  computed: {
    dateRangeText() {
      if (!this.dateRange || this.dateRange.length !== 2) {
        return '选择日期范围'
      }

      const [startDateStr, endDateStr] = this.dateRange
      const formatDisplay = (dateStr) => {
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}/${month}/${day}`
      }

      return `${formatDisplay(startDateStr)} - ${formatDisplay(endDateStr)}`
    },

    defaultDateRange() {
      if (!this.dateRange || this.dateRange.length !== 2) {
        return []
      }
      // 转换为 Date 对象数组
      return this.dateRange.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number)
        return new Date(year, month - 1, day)
      })
    },

    hasMore() {
      return this.tableData.length < this.total
    }
  },

  onLoad() {
    console.log('页面加载，开始获取数据')
    this.fetchTableData()
  },

  methods: {
    handleScroll(e) {
      const scrollTop = e.detail.scrollTop
      this.showBackTop = scrollTop > this.scrollThreshold
    },

    getMaterialField(task, field) {
      if (!task || !Array.isArray(task.materialLines) || task.materialLines.length === 0) {
        return ''
      }
      return task.materialLines[0][field] || ''
    },

    getStatusText(status) {
      const statusMap = {
        'FINISHED': '已入库',
        'PREPARE': '待入库'
      }
      return statusMap[status] || status
    },

    getStatusType(status) {
      const typeMap = {
        'FINISHED': 'success',
        'PREPARE': 'warning'
      }
      return typeMap[status] || 'info'
    },

    formatTime(timeStr) {
      if (!timeStr) return '-'
      return timeStr.replace(' ', ' ').substring(0, 16)
    },

    buildQueryParams() {
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize
      }

      if (this.searchQuery) {
        params.searchValue = this.searchQuery
      }

      if (this.selectedStatus.value !== 'all') {
        params.status = this.selectedStatus.value
      }

      if (this.dateRange && this.dateRange.length === 2) {
        params.startTime = this.dateRange[0] + ' 00:00:00'
        params.endTime = this.dateRange[1] + ' 23:59:59'
      }

      console.log('构建的查询参数:', params)
      return params
    },

    async fetchTableData() {
      this.loading = true
      console.log('开始获取数据，页码:', this.page)

      try {
        const params = this.buildQueryParams()
        const res = await listProductRecpt(params)
        console.log('API返回数据:', res)

        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : []

          if (this.page === 1) {
            this.tableData = newData
          } else {
            this.tableData = [...this.tableData, ...newData]
          }

          this.total = Number(res.total) || 0

          console.log(`数据加载成功: 第${this.page}页, 获取${newData.length}条, 总计${this.tableData.length}/${this.total}条`)

          // if (this.page === 1 && newData.length > 0) {
          //   this.$refs.uToast.show({
          //     type: 'success',
          //     message: `加载了${newData.length}条数据`
          //   })
          // }
        } else {
          console.log('API返回错误:', res.msg)
          this.$refs.uToast.show({
            type: 'error',
            message: res.msg || '获取数据失败'
          })
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$refs.uToast.show({
          type: 'error',
          message: '网络错误，请重试'
        })
      } finally {
        this.loading = false
        this.refresherTriggered = false
      }
    },

    handleScrollToLower() {
      console.log('🔥 滚动到底部，触发加载更多')
      console.log('当前状态:', {
        loadingMore: this.loadingMore,
        hasMore: this.hasMore,
        currentData: this.tableData.length,
        total: this.total,
        page: this.page
      })

      if (this.loadingMore) {
        console.log('正在加载中，跳过...')
        return
      }

      if (!this.hasMore) {
        console.log('没有更多数据了，跳过...')
        return
      }

      this.page += 1
      this.loadingMore = true

      console.log(`开始加载第${this.page}页数据...`)

      this.fetchTableData().finally(() => {
        this.loadingMore = false
      })
    },

    scrollToTop() {
      this.scrollTop = this.scrollTop + 1
      this.showBackTop = false
    },

    handleRefresh() {
      console.log('下拉刷新触发')
      this.refresherTriggered = true
      this.page = 1
      this.fetchTableData()
    },

    handleSearch() {
      console.log('搜索关键词:', this.searchKeyword)
      this.searchQuery = this.searchKeyword.trim()
      this.page = 1
      this.fetchTableData()
    },

    handleStatusChange(value) {
      console.log('状态选择:', value)
      const selectedOption = this.statusOptions.find(option => option.value === value)
      if (selectedOption) {
        this.selectedStatus = selectedOption
      }

      if (this.$refs.statusDropdown) {
        this.$refs.statusDropdown.close()
      }

      this.page = 1
      this.fetchTableData()
    },

    handleDateConfirm(e) {
      console.log('日期选择结果:', e)

      // 处理日期选择结果
      let selectedDates = []

      if (e.range && e.range.length === 2) {
        // 处理 range 模式
        selectedDates = e.range
      } else if (Array.isArray(e) && e.length === 2) {
        // 处理数组格式
        selectedDates = e
      } else {
        // 单选模式处理
        selectedDates = [e, e]
      }

      // 确保所有日期都是 Date 对象
      selectedDates = selectedDates.map(date => {
        if (date instanceof Date) {
          return date
        }

        if (typeof date === 'string') {
          // 处理字符串日期格式
          if (date.includes('-')) {
            const [year, month, day] = date.split('-').map(Number)
            return new Date(year, month - 1, day)
          } else if (date.includes('/')) {
            const [year, month, day] = date.split('/').map(Number)
            return new Date(year, month - 1, day)
          }
        }

        // 默认返回当前日期
        return new Date()
      })

      // 格式化日期为 YYYY-MM-DD
      this.dateRange = selectedDates.map(date => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      })

      this.showDatePicker = false

      // 重新加载数据
      this.page = 1
      this.fetchTableData()
    },

    // 打开打印机选择弹窗
    openPrinterModal(item) {
      this.currentPrintItem = item
      this.showPrinterSheet = true
      this.loadPrinterList()
    },

    // 关闭打印机选择弹窗
    closePrinterSheet() {
      this.showPrinterSheet = false
      this.currentPrintItem = null
    },

    // 加载打印机列表并转换为 ActionSheet 格式
    async loadPrinterList() {
      this.printerLoading = true
      try {
        const result = await getPrintConfigListAll()
        if (result.code === 200 && result.data) {
          // 转换为 ActionSheet 需要的格式
          this.printerActions = result.data.map(printer => ({
            name: printer.printerName,
            id: printer.id,
            // 可以添加图标等
            // icon: 'printer'
          }))
        } else {
          this.printerActions = []
        }
      } catch (error) {
        console.error('加载打印机列表失败:', error)
        this.printerActions = []
        this.$refs.uToast.show({
          type: 'error',
          message: '加载打印机列表失败'
        })
      } finally {
        this.printerLoading = false
      }
    },

    // 处理打印机选择
    handlePrinterSelect(e) {
      const selectedPrinter = e
      this.confirmPrint(selectedPrinter)
    },

    // 确认打印（直接传入选中的打印机）
    async confirmPrint(selectedPrinter) {
      if (!selectedPrinter || !this.currentPrintItem) {
        this.$refs.uToast.show({
          type: 'error',
          message: '参数错误'
        })
        return
      }

      this.$refs.uToast.show({
        type: 'loading',
        message: '标签打印中...',
        icon: true
      })

      try {
        const recptIds = this.currentPrintItem.recptId
        const params = {
          recptIds: [recptIds],
          printerId: selectedPrinter.id,
        }

        const result = await batchPrint(params)

        this.$refs.uToast.hide()
        this.$refs.uToast.show({
          type: 'success',
          message: result.msg || '标签打印成功'
        })

        this.closePrinterSheet()
      } catch (error) {
        this.$refs.uToast.hide()
        console.error('打印失败:', error)
        this.$refs.uToast.show({
          type: 'error',
          message: error.message || '打印失败，请重试'
        })
      }
    },

    goToSave() {
      uni.navigateTo({
        url: '/pages/wms/productPut/save'
      })
    },

    // 显示详情弹出层
    showDetail(item) {
      console.log('显示详情:', item)
      this.currentDetail = { ...item }
      this.showDetailPopup = true
    },

    // 关闭详情弹出层
    closeDetail() {
      this.showDetailPopup = false
      this.currentDetail = {}
    },

    // 从详情页打印
    handleDetailPrint(item) {
      this.closeDetail() // 先关闭详情弹窗
      setTimeout(() => {
        this.openPrinterModal(item) // 再打开打印机选择
      }, 300) // 等待弹窗关闭动画完成
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

    &.price {
      color: #FA3534;
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
  height: 56rpx;
  font-size: 12px;
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

/* 物料列表样式 */
.material-list {
  border: 1rpx solid #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
}

.material-item {
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.material-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx dashed #f0f0f0;
}

.material-index {
  font-size: 14px;
  font-weight: 500;
  color: #2979FF;
}

.material-batch {
  font-size: 12px;
  color: #666;
  background: #f8f8f8;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.material-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15rpx;
}

/* 底部操作按钮 */
.detail-actions {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  background: #fff;
}

.detail-print-btn {
  width: 100%;
}
</style>