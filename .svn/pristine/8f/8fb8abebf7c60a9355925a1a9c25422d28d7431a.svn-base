<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="过程检验"
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
                placeholder="检验单编号/产品名称/批次号"
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
            :key="item.ipqcId"
        >
          <view class="record-header">
            <text class="order-number">批次号：&nbsp;&nbsp;{{ item.batchNo || '-' }}</text>
            <u-tag
                :text="item.status == 0 ? '未检验' : '已检验'"
                :type="item.status == 0 ? 'warning' : 'success'"
                size="mini"
            />
          </view>

          <view class="record-content" @click="viewDetail(item)">
            <view class="info-row">
              <text class="info-label">任务编号：</text>
              <text class="info-value">{{ item.taskCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品编码：</text>
              <text class="info-value">{{ item.itemCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品名称：</text>
              <text class="info-value">{{ item.itemName || '-' }}</text>
              <text class="info-label">规格型号：</text>
              <text class="info-value">{{ item.specification || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">检测数量：</text>
              <text class="info-value">{{ item.quantityCheck || 0 }} {{ item.unitOfMeasure || '-' }}</text>
              <text class="info-label">检测类型：</text>
              <text class="info-value">{{ getIpqcTypeName(item.ipqcType) }}</text>
            </view>
            <view v-if="item.checkResult" class="info-row">
              <text class="info-label">合格数量：</text>
              <text class="info-value completed">{{ item.quantityQualified || 0 }} {{ item.unitOfMeasure || '-' }}</text>
              <text class="info-label">不合格数：</text>
              <text class="info-value">{{ item.quantityUnqualified || 0 }} {{ item.unitOfMeasure || '-' }}</text>
            </view>
            <view v-if="item.checkResult" class="info-row">
              <text class="info-label">检测结果：</text>
              <text class="info-value" :class="getResultType(item.checkResult) === 'success' ? 'completed' : 'error'">{{ getResultText(item.checkResult) }}</text>
            </view>
          </view>

          <view class="record-actions">
            <view class="action-divider"></view>
            <view class="action-content">
              <text class="action-time">{{ item.createTime || '-' }}</text>
              <view class="action-buttons">
<!--                <up-button class="detail-btn" type="default" text="查看" size="small" @click="show(item)"></up-button>-->
                <up-button v-if="!item.checkResult" class="inspect-btn" type="primary" text="检验" size="small" @click="edit(item)"></up-button>
<!--                <up-button v-if="!item.checkResult" class="delete-btn" type="error" text="删除" size="small" @click="del(item)"></up-button>-->
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
                <up-icon
                    v-if="selectedPrinter?.id === printer.id"
                    name="checkmark"
                    size="20"
                    color="#2979FF"
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
          <text class="detail-title">检验单详情</text>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="detail-content" scroll-y>
          <!-- 基本信息 -->
          <view class="detail-section">
            <view class="section-title">基本信息</view>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="detail-label">批次号</text>
                <text class="detail-value">{{ currentDetail.batchNo || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">任务编号</text>
                <text class="detail-value">{{ currentDetail.taskCode || '-' }}</text>
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
                <text class="detail-value">{{ currentDetail.quantityCheck || 0 }} {{ currentDetail.unitOfMeasure || '' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">检测类型</text>
                <text class="detail-value">{{ getIpqcTypeName(currentDetail.ipqcType) }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">状态</text>
                <u-tag
                    :text="currentDetail.status == 0 ? '未检验' : '已检验'"
                    :type="currentDetail.status == 0 ? 'warning' : 'success'"
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
                <text class="detail-value">{{ currentDetail.quantityQualified || 0 }} {{ currentDetail.unitOfMeasure || '' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">不合格数</text>
                <text class="detail-value">{{ currentDetail.quantityUnqualified || 0 }} {{ currentDetail.unitOfMeasure || '' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">检测结果</text>
                <u-tag
                    :text="getResultText(currentDetail.checkResult)"
                    :type="getResultType(currentDetail.checkResult)"
                    size="mini"
                    class="status-tag-detail"
                />
              </view>
              <view class="detail-item">
                <text class="detail-label">检验时间</text>
                <text class="detail-value">{{ currentDetail.inspectDate || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">检验人员</text>
                <text class="detail-value">{{ currentDetail.inspector || '-' }}</text>
              </view>
              <view class="detail-item full-width">
                <text class="detail-label">不合格原因</text>
                <text class="detail-value">{{ currentDetail.defectName || '-' }}</text>
              </view>
            </view>
          </view>

          <!-- 检测项 -->
          <view class="detail-section">
            <view class="section-title">检测项</view>
            <view v-if="loadingLineList" class="loading-container">
              <u-loading-icon size="20" text="加载检测项中..."></u-loading-icon>
            </view>
            <view v-else-if="ipqcLineList.length === 0" class="empty-container">
              <u-empty mode="data" text="暂无检测项数据"></u-empty>
            </view>
            <view v-else class="test-items-section">
              <view class="test-items-scroll">
                <view class="test-items-grid">
                  <view
                      class="test-item"
                      v-for="(line, index) in ipqcLineList"
                      :key="line.id || index"
                  >
                    <text class="test-item-label">{{ line.indexName || '-' }}{{ line.unitOfMeasure && line.unitOfMeasure.trim() ? `(${line.unitOfMeasure})` : '' }}</text>
                    <text class="test-item-value">{{ line.testData || '-' }}</text>
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
                <text class="detail-label">创建时间</text>
                <text class="detail-value">{{ currentDetail.createTime || '-' }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">创建人</text>
                <text class="detail-value">{{ currentDetail.createByName || '-' }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <!-- 查看检验记录按钮（固定到底部） -->
        <view class="inspect-record-button-fixed">
          <up-button type="primary" text="查看检验记录" size="default" @click="openTestRecordModal(currentDetail.ipqcId)"></up-button>
        </view>
      </view>
    </up-popup>

    <!-- 检验弹窗 -->
    <IpqcInspectDialog
        v-model:show="showInspectDialog"
        :ipqc-id="currentInspectItem?.ipqcId"
        :ipqc-type="currentInspectItem?.ipqcType"
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
    
    <!-- 全局加载提示 -->
    <up-toast ref="uToast"></up-toast>
  </view>
</template>

<script>
import qcIpqcDialog from './ipqcSaveDialog.vue'
import IpqcInspectDialog from './ipqcInspectDialog.vue'
import { listIpqc, delIpqc, printLabel } from '@/api/quality/qcIpqc'
import { listIpqcLine } from '@/api/quality/qcIpqcLine'
import { getPrintConfigListAll } from '@/api/system/printConfig'
import Defectrecord from '@/pages/quality/testData/index.vue'

// 检验类型字典（整合两个页面的字典）
const IPQC_TYPE_OPTIONS = [
  { value: 'FIRST', label: '首检', type: 'primary' },
  { value: 'FINAL', label: '末检', type: 'warning' },
]

export default {
  name: 'QcIpqcList',
  components: {
    qcIpqcDialog,
    IpqcInspectDialog,
    Defectrecord
  },
  data() {
    return {
      // 筛选相关配置
      selectedStatus: {
        label: '检验状态',
        value: 'all'
      },
      statusOptions: [
        { label: '全部', value: 'all' },
        { label: '待检验', value: '0' },
        { label: '已检验', value: '1' }
      ],
      selectedResult: {
        label: '检验结果',
        value: 'all'
      },
      resultOptions: [
        { label: '全部', value: 'all' },
        { label: '检验通过', value: 'ACCEPT' },
        { label: '检验不通过', value: 'REJECT' }
      ],

      searchQuery: '',
      // 分页相关
      page: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loading: false,
      loadingMore: false,
      refresherTriggered: false,

      // 检验类型字典
      ipqcTypeOptions: IPQC_TYPE_OPTIONS,
      auths: uni.getStorageSync('auths') || [],
      printerList: [],
      selectedPrinter: null,
      printerLoading: false,
      currentPrintItem: null,
      showPrinterPopup: false,

      // 滚动相关
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,
      
      // 详情弹窗相关
      showDetailPopup: false,
      currentDetail: {},
      
      // 检验弹窗相关
      showInspectDialog: false,
      currentInspectItem: null,
      
      // 检验记录弹窗相关
      testRecordDialogShow: false,
      currentLineId: '',
      qcId: '',
      
      // 检测项数据
      ipqcLineList: [],
      loadingLineList: false
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
    uni.$on('refreshIpqcList', (needRefresh) => {
      if (needRefresh) {
        this.page = 1
        this.fetchTableData()
      }
    })
  },
  onUnload() {
    uni.$off('refreshIpqcList')
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
        params.status = this.selectedStatus.value
      }

      if (this.selectedResult.value !== 'all') {
        params.checkResult = this.selectedResult.value
      }

      return params
    },

    // 获取检验单列表
    async fetchTableData() {
      if (this.page > 1) {
        this.loadingMore = true
      } else {
        this.loading = true
      }

      try {
        const params = this.buildQueryParams()
        const res = await listIpqc(params)

        if (res.code === 200) {
          const data = res.rows || []
          if (this.page === 1) {
            this.tableData = data
          } else {
            this.tableData = [...this.tableData, ...data]
          }
          this.total = Number(res.total) || 0
        } else {
          this.$refs.uToast.show({
            type: 'error',
            message: res.msg || '获取数据失败'
          })
        }
      } catch (error) {
        console.error('加载检验单列表失败:', error)
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



    // 状态筛选变化
    handleStatusChange(value) {
      const selectedOption = this.statusOptions.find(option => option.value === value)
      this.selectedStatus.label = selectedOption.label
      this.selectedStatus.value = value
      this.page = 1
      this.fetchTableData()
    },

    // 检验结果筛选变化
    handleResultChange(value) {
      const selectedOption = this.resultOptions.find(option => option.value === value)
      this.selectedResult.label = selectedOption.label
      this.selectedResult.value = value
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

    // 检验
    edit(row) {
      this.currentInspectItem = row
      this.showInspectDialog = true
    },
    
    // 处理检验弹窗关闭
    handleInspectClose() {
      this.showInspectDialog = false
      this.currentInspectItem = null
    },
    
    // 处理检验成功
    handleInspectSuccess() {
      this.showInspectDialog = false
      this.currentInspectItem = null
      // 重新加载数据
      this.page = 1
      this.fetchTableData()
    },

    // 查看
    viewDetail(row) {
      this.currentDetail = { ...row }
      this.showDetailPopup = true
      // 加载检测项数据
      this.loadIpqcLine(row.ipqcId)
    },

    // 关闭详情弹窗
    closeDetail() {
      this.showDetailPopup = false
      this.currentDetail = {}
    },

    // 删除
    del(row) {
      uni.showModal({
        title: '提示',
        content: '确定要删除该检验单吗？',
        success: (res) => {
          if (res.confirm) {
            delIpqc(row.ipqcId).then(result => {
              if (result.code === 200) {
                uni.showToast({ title: '删除成功' })
                this.page = 1
                this.fetchTableData()
              } else {
                uni.showToast({ title: result.msg || '删除失败', icon: 'none' })
              }
            }).catch(error => {
              console.error('删除失败:', error)
              uni.showToast({ title: '网络错误', icon: 'none' })
            })
          }
        }
      })
    },

    // 获取检验类型标签样式
    getIpqcTypeTagType(typeValue) {
      const type = this.ipqcTypeOptions.find(item => item.value === typeValue)
      return type ? type.type : 'default'
    },

    // 获取检验类型名称
    getIpqcTypeName(typeValue) {
      const type = this.ipqcTypeOptions.find(item => item.value === typeValue)
      return type ? type.label : '未知类型'
    },

    // 获取检测结果文本
    getResultText(result) {
      const resultMap = {
        'ACCEPT': '检验通过',
        'REJECT': '检验不通过'
      }
      return resultMap[result] || result
    },

    // 获取检测结果类型
    getResultType(result) {
      const resultMap = {
        'ACCEPT': 'success',
        'REJECT': 'danger'
      }
      return resultMap[result] || 'default'
    },

    // 打开打印机选择弹窗
    openPrinterModal(item) {
      this.currentPrintItem = item
      this.showPrinterPopup = true
      this.loadPrinterList()
    },

    // 关闭打印机选择弹窗
    closePrinterModal() {
      this.showPrinterPopup = false
      this.selectedPrinter = null
      this.currentPrintItem = null
    },
    
    // 打开检测记录弹窗
    openTestRecordModal(lineId) {
      this.qcId = lineId
      this.testRecordDialogShow = true // 显示弹窗
    },
    
    // 加载检测项数据
    async loadIpqcLine(ipqcId) {
      if (!ipqcId) return
      
      this.loadingLineList = true
      try {
        const params = { ipqcId }
        const res = await listIpqcLine(params)
        this.ipqcLineList = res.rows || []
      } catch (error) {
        console.error('加载检测项失败:', error)
        this.ipqcLineList = []
      } finally {
        this.loadingLineList = false
      }
    },
    
    // 关闭检测记录弹窗
    closeTestRecordModal() {
      this.testRecordDialogShow = false
      this.qcId = ''
    },

    async loadPrinterList() {
      this.printerLoading = true
      try {
        const result = await getPrintConfigListAll()
        console.log('打印机列表:', result)
        if (result.code === 200 && result.data) {
          this.printerList = result.data
          if (this.printerList.length > 0) {
            this.selectedPrinter = this.printerList[0]
          }
        } else {
          this.printerList = []
        }
      } catch (error) {
        console.error('加载打印机列表失败:', error)
        this.printerList = []
        this.$refs.uToast.show({
          type: 'error',
          message: '加载打印机列表失败'
        })
      } finally {
        this.printerLoading = false
      }
    },

    selectPrinter(printer) {
      this.selectedPrinter = printer
    },

    async confirmPrint() {
      if (!this.selectedPrinter || !this.currentPrintItem) {
        this.$refs.uToast.show({
          type: 'error',
          message: '参数错误'
        })
        return
      }

      uni.showLoading({
        title: '标签打印中...'
      })

      try {
        const recptList = {
          id: this.currentPrintItem.ipqcId,
          status: this.currentPrintItem.status
        }
        const params = {
          recptList: [recptList],
          printerId: this.selectedPrinter.id,
          type: 'ipqcType'
        }
        const result = await printLabel(params)
        uni.hideLoading()
        this.$refs.uToast.show({
          type: 'success',
          message: result.msg || '标签打印成功'
        })
        this.closePrinterModal()
      } catch (error) {
        uni.hideLoading()
        console.error('打印失败:', error)
        this.$refs.uToast.show({
          type: 'error',
          message: error.message || '打印失败，请重试'
        })
      }
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

.scan-icon, .search-icon {
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

.detail-btn, .inspect-btn, .delete-btn, .print-btn {
  width: 100rpx;
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
</style>