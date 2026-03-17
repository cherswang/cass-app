<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar
        title="核对库存信息"
        :placeholder="true"
        bg-color="#FFFFFF"
        title-color="#333333"
        :border="false"
        :auto-back="true"
    />
    <!-- 主体内容 -->
    <view class="content">
      <!-- 扫码输入区域 -->
      <view class="scan-input-section">
        <text class="label">批次码</text>
        <view class="scan-input-wrapper">
          <u-input
              ref="scanInput"
              v-model="scanCodeInput"
              type="text"
              placeholder="请输入批次码"
              class="scan-input"
              focus
              @confirm="handleScan(scanCodeInput.trim())"
              @keyup.enter="handleScan(scanCodeInput.trim())"
          ></u-input>
        </view>
      </view>
      <!-- 产品卡片列表 -->
      <view class="product-cards" v-if="selectedProducts.length > 0">
        <view class="product-card" v-for="(product, index) in selectedProducts" :key="product.itemId">
          <view class="card-header">
            <text class="card-title">{{ product.itemName }}<text v-if="product.batchCode" class="value">（{{ product.batchCode }}）</text></text>
            <u-icon name="close" size="20" color="#999" @click="removeProduct(index)"></u-icon>
          </view>
          <view class="card-content">
            <view class="info-row">
              <text class="label">规格：</text>
              <text class="value">{{ product.specification }}</text>
            </view>
            <view class="info-row">
              <text class="label">编码：</text>
              <text class="value">{{ product.itemCode }}</text>
            </view>
            <view class="info-row">
              <!-- 修改1: 毛重改为输入框 -->
              <text class="label">毛重：</text>
              <u-input
                  v-model="product.grossWeight"
                  type="digit"
                  placeholder="请输入毛重"
                  class="input-value"
                  :precision="2"
                  @input="calculateNetWeight(product)"
              ></u-input>
              <text class="label">盘重：</text>
              <u-input
                  v-model="product.tareWeight"
                  type="digit"
                  placeholder="请输入盘重"
                  class="input-value"
                  :precision="2"
                  @input="calculateNetWeight(product)"
              ></u-input>
            </view>
            <!-- 修改2: 净重改为计算结果显示 -->
            <view class="info-row">
              <text class="label">净重：</text>
              <text class="value">{{ calculateNetWeight(product) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态提示 -->
      <view class="empty-state" v-else>
        <text class="empty-text">暂无信息</text>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="bottom-bar">
      <view class="action-buttons">
        <up-button
            type="warning"
            @click="handleClear"
            class="clear-btn"
        >清空</up-button>
        <up-button
            type="primary" 
            @click="handlePrint"
            class="print-btn"
            :disabled="!hasConfirmed"
        >打印标签</up-button>
        <up-button
            type="success"
            @click="settle"
            class="clear-btn"
        >确认</up-button>
      </view>
    </view>

  </view>

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
</template>

<script>
import { getInfoByBatchCode,updateStocktakingline,batchPrint } from '@/api/wms/stocktaking'
import { getPrintConfigListAll } from '@/api/system/printConfig'
export default {
  data() {
    return {

      // 选中的产品列表
      selectedProducts: [],
      // 表单数据
      formData: {
        recptCode: '',
        warehouseId: '42',
        warehouseCode: 'CPK_VIRTUAL',
        warehouseName: '成品配货库',
        status: 'PREPARE',
        remark: ''
      },
      // 加载状态
      loading: false,

      // 扫码相关
      scanCodeInput: '',
      
      // 打印机相关
      showPrinterSheet: false,
      printerActions: [], // ActionSheet 格式的打印机列表
      printerLoading: false,
      currentPrintItem: null,
      
      // 标记是否已经确认修改
      hasConfirmed: false,

    }
  },
  computed: {
    // 计算选中产品的数量
    productCount() {
      return this.selectedProducts.length
    },
    // 修改4: 计算净重合计
    totalNetWeight() {
      return this.selectedProducts
          .reduce((sum, product) => {
            const netWeight = this.calculateNetWeightValue(product)
            return sum + netWeight
          }, 0)
          .toFixed(2)
    },


  },
  mounted() {
  },
  methods: {
    // 修改5: 计算净重数值
    calculateNetWeightValue(product) {
      const grossWeight = parseFloat(product.grossWeight || 0)
      const tareWeight = parseFloat(product.tareWeight || 0)
      const netWeight = grossWeight - tareWeight
      return isNaN(netWeight) || netWeight < 0 ? 0 : netWeight
    },

    // 修改6: 计算净重（用于显示）
    calculateNetWeight(product) {
      const netWeight = this.calculateNetWeightValue(product)
      // 更新产品的netWeight字段
      product.netWeight = netWeight.toFixed(2)
      return netWeight.toFixed(2)
    },

    // 处理扫码
    handleScan(scanCode) {
      if (!scanCode) {
        uni.showToast({
          title: '请输入批次码',
          icon: 'none'
        })
        return
      }
      // 校验是否重复扫码
      const isDuplicate = this.selectedProducts.some(item => item.batchCode === scanCode)
      if (isDuplicate) {
        uni.showToast({
          title: '该批次码已扫码，请勿重复',
          icon: 'none'
        })
        return
      }

      this.loading = true
      getInfoByBatchCode({batchCode:scanCode}).then(res => {
        if (res.code === 200 && res.data) {
          console.log('扫码成功:', res.data)
          // 初始化产品字段
          const product = res.data
          product.diskModel = product.diskModel || ''
          product.itemLength = product.itemLength || ''
          product.diskId = product.diskId || ''
          product.diskDiameter = product.diskDiameter || undefined
          product.blankWire = product.blankWire || ''
          product.platingLayer = product.platingLayer || ''
          
          // 检查是否已经盘过库
          if (product.takingStatus === 'COUNTED') {
            // 显示确认对话框
            uni.showModal({
              title: '提示',
              content: '该批次物料已经盘过库，是否继续？',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  // 用户确定继续，回填已盘点的字段值
                  product.grossWeight = product.takingGrossWeight || product.grossWeight
                  product.netWeight = product.takingNetWeight || product.netWeight
                  product.tareWeight = product.takingTareWeight || product.tareWeight
                  // 如果扫码获取的数据有毛重和盘重，自动计算净重
                  if (product.grossWeight && product.tareWeight) {
                    this.calculateNetWeight(product)
                  }
                  // 限制只允许一条记录，先清空再添加
                  this.selectedProducts = [product]
                  // 扫码后清空输入框
                  this.scanCodeInput = ''
                } else if (modalRes.cancel) {
                  // 用户取消，清空输入框
                  this.scanCodeInput = ''
                }
              }
            })
          } else {
            // 未盘过库，正常处理
            // 如果扫码获取的数据有毛重和盘重，自动计算净重
            if (product.grossWeight && product.tareWeight) {
              this.calculateNetWeight(product)
            }
            // 限制只允许一条记录，先清空再添加
            this.selectedProducts = [product]
            // 扫码后清空输入框
            this.scanCodeInput = ''
          }
        } else {
          uni.showToast({
            title: '未找到物料信息',
            icon: 'none'
          })
        }
      })
          .catch((error) => {
            console.error('扫码失败:', error)
            uni.showToast({
              title: '扫码失败: 网络错误',
              icon: 'none'
            })
          })
          .finally(() => {
            this.loading = false
          })
    },

    // 执行入库
    async settle() {
      if (this.selectedProducts.length === 0) {
        uni.showToast({
          title: '请先选择产品物料',
          icon: 'none'
        })
        return
      }

      // 显示入库中提示
      uni.showLoading({
        title: '更改中...',
        mask: true
      })

      this.loading = true
      let successCount = 0
      let failList = []
      try {
        // 直接处理第一条记录，因为扫码只会有一条
        const order = this.selectedProducts[0];
        
        // 修改10: 入库时使用计算得到的净重
        const netWeight = this.calculateNetWeightValue(order)
        order.netWeight = netWeight.toFixed(2)
        
        // 创建只包含必要字段的请求数据
        const stocktakingLineData = {
          lineId: order.lineId,
          takingId: order.takingId,
          takingQuantity: parseInt(order.quantity) || null,
          takingGrossWeight: order.grossWeight || null,
          takingNetWeight: order.netWeight || null,
          takingTareWeight: order.tareWeight || null,
          takingStatus:'COUNTED'
        }
        try {
          const res = await updateStocktakingline(stocktakingLineData);
          console.log('更新结果:', res)
          if (res.code == 200) {
            uni.showToast({
              title: '操作成功！',
              icon: 'none'
            })
            // 标记已确认修改
            this.hasConfirmed = true
            // 确认后光标重新聚焦到扫码输入框
            this.$nextTick(() => {
              if (this.$refs.scanInput) {
                if (typeof this.$refs.scanInput.focus === 'function') {
                  this.$refs.scanInput.focus()
                } else if (this.$refs.scanInput.$el) {
                  const inputElement = this.$refs.scanInput.$el.querySelector('input')
                  if (inputElement && typeof inputElement.focus === 'function') {
                    inputElement.focus()
                  }
                }
              }
            })
          } else {
            failList.push({
              batchCode: order.batchCode || order.itemCode,
              msg: res.msg || '接口返回失败'
            })
          }
        } catch (error) {
          failList.push({
            batchCode: order.batchCode || order.itemCode,
            msg: error.message || '网络错误'
          })
        }

      } catch (error) {
        console.error('异常:', error)
        uni.showToast({
          title: '失败：系统异常',
          icon: 'none'
        })
      } finally {
        this.loading = false
        // 关闭加载提示
        uni.hideLoading()
      }
    },
    // 移除产品
    removeProduct(index) {
      this.selectedProducts.splice(index, 1)
    },
    // 处理打印标签
    handlePrint() {
      if (this.selectedProducts.length === 0) {
        uni.showToast({
          title: '请先添加',
          icon: 'none'
        })
        return
      }
      if (!this.hasConfirmed) {
        uni.showToast({
          title: '请先点击确认',
          icon: 'none'
        })
        return
      }
      this.showPrinterSheet = true
      this.loadPrinterList()
    },

    // 处理清空
    handleClear() {
      // 清空产品列表
      this.selectedProducts = []
      // 清空扫码输入框
      this.scanCodeInput = ''
      // 自动聚焦到扫码输入框
      this.$nextTick(() => {
        if (this.$refs.scanInput) {
          if (typeof this.$refs.scanInput.focus === 'function') {
            this.$refs.scanInput.focus()
          } else if (this.$refs.scanInput.$el) {
            const inputElement = this.$refs.scanInput.$el.querySelector('input')
            if (inputElement && typeof inputElement.focus === 'function') {
              inputElement.focus()
            }
          }
        }
      })
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
            id: printer.id
          }))
        } else {
          this.printerActions = []
        }
      } catch (error) {
        console.error('加载打印机列表失败:', error)
        this.printerActions = []
        uni.showToast({ title: '加载打印机列表失败', icon: 'none' })
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
      if (!selectedPrinter || this.selectedProducts.length === 0) {
        uni.showToast({
          title: '参数错误',
          icon: 'none'
        })
        return
      }

      uni.showLoading({
        title: '标签打印中...',
        mask: true
      })

      try {
        // 准备打印数据
        const lineIds = this.selectedProducts.map(item => item.lineId).filter(Boolean)
        if (lineIds.length === 0) {
          uni.showToast({
            title: '暂无打印数据',
            icon: 'none'
          })
          return
        }

        const params = {
          lineIds: lineIds,
          printerId: selectedPrinter.id,
        }

        const result = await batchPrint(params)

        uni.hideLoading()
        uni.showToast({
          title: result.msg || '标签打印成功',
          icon: 'success'
        })

        this.showPrinterSheet = false
      } catch (error) {
        uni.hideLoading()
        console.error('打印失败:', error)
        uni.showToast({
          title: '打印失败，请重试',
          icon: 'none'
        })
      }
    },

    // 关闭打印机选择弹窗
    closePrinterSheet() {
      this.showPrinterSheet = false
    },

    // 修改13: 移除旧的calculateGrossWeight方法，因为现在是根据毛重计算净重
  },
  onLoad() {
    // 页面加载时自动聚焦到扫码输入框
    this.$nextTick(() => {
      if (this.$refs.scanInput) {
        if (typeof this.$refs.scanInput.focus === 'function') {
          this.$refs.scanInput.focus()
        } else if (this.$refs.scanInput.$el) {
          const inputElement = this.$refs.scanInput.$el.querySelector('input')
          if (inputElement && typeof inputElement.focus === 'function') {
            inputElement.focus()
          }
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 30rpx;
  padding-bottom: 160rpx;
}

/* 扫码输入区域 */
.scan-input-section {
  background-color: #ffffff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 30rpx;

  .label {
    font-size: 32rpx;
    color: #333;
    font-weight: normal;
    margin-bottom: 20rpx;
    display: block;
  }

  .scan-input-wrapper {
    display: flex;
    align-items: center;
    gap: 15rpx;

    .scan-input {
      flex: 1;
      height: 70rpx;
      border: 1rpx solid #e0e0e0;
      border-radius: 8rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      color: #333;
    }

    .scan-btn {
      white-space: nowrap;
      height: 70rpx;
      line-height: 70rpx;
      padding: 0 30rpx;
    }
  }
}



/* 按钮行 - 修改图标和文字布局 */
.button-row {
  display: flex;
  justify-content: space-between;

  .action-btn {
    width: 48%;
    height: 88rpx;
    background-color: #ffffff;
    border: 1rpx solid #e0e0e0;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20rpx;

    &:active {
      opacity: 0.8;
    }

    .u-icon {
      margin-right: 10rpx;
    }

    .btn-text {
      font-size: 28rpx;
    }
  }

  .action-btn.disabled {
    background-color: #f5f5f5;
    border-color: #e8e8e8;
    pointer-events: all; /* 保持可点击，用于显示提示 */

    &:active {
      opacity: 1;
    }
  }
}

/* 产品卡片列表 */
.product-cards {
  margin-top: 30rpx;
}

.product-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    .card-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  .card-content {
    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 100rpx;
        font-size: 28rpx;
        color: #666;
      }

      .value {
        font-size: 28rpx;
        color: #333;
        flex: 1;
      }

      .input-value {
        flex: 1;
        padding: 10rpx 10rpx;
        border: 1rpx solid #e0e0e0;
        border-radius: 6rpx;
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

.custom-select {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60rpx;
  border: 1rpx solid #e8e8e8;
  border-radius: 6rpx;
  padding: 0 15rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #fff;
  cursor: pointer;
  flex: 1;
}
.select-value {
  flex: 1;
  text-align: left;
}


/* 空状态提示 */
.empty-state {
  margin-top: 100rpx;
  text-align: center;

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

/* 底部栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1rpx solid #f0f0f0;

  .action-buttons {
    display: flex;
    gap: 20rpx;
    width: 100%;
    max-width: 800rpx;

    .print-btn {
      flex: 1;
      height: 80rpx;
      font-size: 28rpx;
    }

    .clear-btn {
      flex: 1;
      height: 80rpx;
      font-size: 28rpx;
    }

    .settle-btn {
      flex: 1;
      background-color: #2979ff;
      color: #ffffff;
      padding: 18rpx 40rpx;
      border-radius: 35rpx;
      font-size: 28rpx;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.sheet-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
  color: #999;
}
</style>