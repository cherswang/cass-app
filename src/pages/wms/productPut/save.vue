<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar
        title="新建入库单"
        :placeholder="true"
        bg-color="#FFFFFF"
        title-color="#333333"
        :border="false"
        :auto-back="true"
    />
    <!-- 主体内容 -->
    <view class="content">
      <!-- 仓库信息行 -->
      <view class="warehouse-row" @click="selectWarehouse">
        <text class="label">仓库</text>
        <view class="value-section">
          <text class="value">{{ selectedWarehouse }}</text>
          <u-icon name="arrow-right" color="#999" size="16"></u-icon>
        </view>
      </view>

      <!-- 两个功能按钮 -->
      <view class="button-row">
        <view
            class="action-btn"
            :class="{ disabled: isManualBtnDisabled }"
            @click="selectProduct"
        >
          <u-icon name="plus" size="20" :color="isManualBtnDisabled ? '#999' : '#333'"></u-icon>
          <text class="btn-text" :style="{ color: isManualBtnDisabled ? '#999' : '#333' }">选择产品物料</text>
        </view>

        <view
            class="action-btn"
            :class="{ disabled: isScanBtnDisabled }"
            @click="scanProduct"
        >
          <u-icon name="scan" size="20" :color="isScanBtnDisabled ? '#999' : '#333'"></u-icon>
          <text class="btn-text" :style="{ color: isScanBtnDisabled ? '#999' : '#333' }">扫码添加</text>
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
              <!-- 扫码数据显示文本，手动添加显示输入框 -->
              <text v-if="product.batchCode" class="value">{{ product.tareWeight || 0 }}</text>
              <u-input
                  v-else
                  v-model="product.tareWeight"
                  type="digit"
                  placeholder="请输入盘重"
                  class="input-value"
                  :precision="2"
                  @input="calculateNetWeight(product)"
              ></u-input>
            </view>
            <view class="info-row" v-if="!product.batchCode">
              <text class="label">盘具：</text>
              <view class="custom-select" @click="() => openSpoolCenterPopup(index)">
                <text class="select-value">{{ product.diskModel || '请选择盘具信息' }}</text>
                <u-icon name="arrow-down" color="#999" size="16"></u-icon>
              </view>
            </view>
            <view class="info-row" v-if="!product.batchCode">
              <text class="label">长度：</text>
              <u-input
                  v-model="product.itemLength"
                  type="digit"
                  placeholder="请输入长度"
                  class="input-value"
                  :precision="2"
              ></u-input>
            </view>
            <!-- 修改2: 净重改为计算结果显示 -->
            <view class="info-row">
              <text class="label">净重：</text>
              <text class="value">{{ calculateNetWeight(product) }}</text>
            </view>
            <view class="info-row">
            <text class="label">镀层：</text>
            <u-input
                v-model="product.platingLayer"
                type="digit"
                placeholder="请输入镀层"
                class="input-value"
            ></u-input>
            </view>
            <view class="info-row">
              <text class="label">坯线：</text>
              <view class="blank-wire-input-wrapper">
                <u-input
                    v-model="product.blankWire"
                    type="text"
                    placeholder="请选择坯线物料"
                    class="input-value"
                    :disabled="false"
                    @click="() => selectBlankWire(index)"
                ></u-input>
                <u-icon
                    name="search"
                    color="#2979ff"
                    size="20"
                    class="search-btn"
                    @click="() => selectBlankWire(index)"
                ></u-icon>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态提示 -->
      <view class="empty-state" v-else>
        <text class="empty-text">暂无选中的产品</text>
      </view>
    </view>

    <!-- 底部统计与结算 -->
    <view class="bottom-bar">
      <text class="product-count">共 {{ productCount }} 盘</text>
      <view class="total-section">
        <!-- 修改3: 底部统计改为净重合计 -->
        <text class="total-label">净重合计：</text>
        <text class="total-price">{{ totalNetWeight }}</text>
        <view class="settle-btn" @click="settle">确定入库</view>
      </view>
    </view>

    <!-- 盘具选择弹窗 -->
    <uni-popup ref="spoolCenterPopup" type="center" :mask-click="false">
      <view class="spool-select-modal">
        <view class="modal-header">
          <text class="modal-title">选择盘具信息</text>
          <uni-icons name="close" size="20" color="#999" @click="closeSpoolCenterPopup"></uni-icons>
        </view>
        <view class="spool-search-wrapper">
          <input
              v-model="spoolSearchText"
              class="search-input"
              placeholder="搜索盘具信息..."
              @input="handleSpoolSearch"
          />
        </view>
        <scroll-view scroll-y="true" class="spool-list-content">
          <view class="select-item"
                v-for="item in filteredSpoolOptions"
                :key="item.value"
                @click="selectSpool(item)"
          >
            <text>{{ item.text }}</text>
          </view>
          <view class="select-empty" v-if="filteredSpoolOptions.length === 0">
            <text>未找到匹配的盘具信息</text>
          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <!-- 扫码输入弹窗 -->
    <uni-popup ref="scanPopup" type="center" :mask-click="true">
      <view class="scan-modal">
        <view class="modal-header">
          <text class="modal-title">扫码添加</text>
          <uni-icons name="close" size="20" color="#999" @click="closeScanPopup"></uni-icons>
        </view>
        <view class="modal-content">
          <input
              ref="scanInput"
              v-model="scanCodeInput"
              class="scan-input"
              placeholder="请输入批次码"
              :focus="isScanInputFocus"
              @confirm="confirmScan"
          />
        </view>
        <view class="modal-footer">
          <view class="modal-btn cancel-btn" @click="closeScanPopup">取消</view>
          <view class="modal-btn confirm-btn" @click="confirmScan">确定</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { getInfoByBatchCode } from '@/api/wms/materialStock'
import { addRecptHeader, execute } from '@/api/wms/productPut'
import { listWarehouse } from '@/api/wms/warehouse'
import { getDiskInfoListAll } from '@/api/md/diskInfo'
export default {
  data() {
    return {
      // 仓库选择相关
      selectedWarehouse: '成品配套库',
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
      spoolOptions: [],
      spoolSearchText: '',
      filteredSpoolOptions: [],
      currentProductIndex: -1,
      addMode: 'none', // 添加模式：'none'（无模式），'manual'（手动添加），'scan'（扫码添加）

      // 扫码相关
      scanCodeInput: '',
      isScanInputFocus: false,
      // 坯线选择相关
      isBlankWireSelection: false, // 是否是坯线选择模式
      currentProductIndexForBlankWire: -1 // 当前正在编辑坯线的产品索引
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
    // 手动选择按钮是否禁用
    isManualBtnDisabled() {
      // 如果有已选产品，且当前不是手动添加模式，则禁用
      return this.selectedProducts.length > 0 && this.addMode !== 'manual'
    },
    // 扫码添加按钮是否禁用
    isScanBtnDisabled() {
      // 如果有已选产品，且当前不是扫码添加模式，则禁用
      return this.selectedProducts.length > 0 && this.addMode !== 'scan'
    }
  },
  mounted() {
    this.loadDiskInfo()
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

    async loadDiskInfo() {
      try {
        const response = await getDiskInfoListAll({ status: 0 }); // 只获取启用的盘具
        if (response.code === 200 && response.data) {
          const spoolOptions = response.data.map(item => ({
            text: `${item.diskModel || '未知型号'}-${item.diskDiameter || 0}mm`,
            value: `${item.diskModel || '未知型号'}-${item.diskDiameter || 0}mm`,
            originalData: item
          }));
          this.spoolOptions = spoolOptions;
          this.filteredSpoolOptions = [...spoolOptions];
        } else {
          console.warn('盘具接口返回数据为空或格式错误');
          this.spoolOptions = [];
          this.filteredSpoolOptions = [];
        }
      } catch (error) {
        console.error('加载盘具信息失败:', error);
        this.spoolOptions = [];
        this.filteredSpoolOptions = [];
        uni.showToast({ title: '加载盘具列表失败', icon: 'none' });
      }
    },
    openSpoolCenterPopup(index) {
      this.currentProductIndex = index
      this.spoolSearchText = ''
      this.filteredSpoolOptions = [...this.spoolOptions]
      this.$refs.spoolCenterPopup.open()
    },
    closeSpoolCenterPopup() {
      this.$refs.spoolCenterPopup.close()
      this.currentProductIndex = -1
    },
    handleSpoolSearch() {
      if (!this.spoolSearchText) {
        this.filteredSpoolOptions = [...this.spoolOptions]
        return
      }
      this.filteredSpoolOptions = this.spoolOptions.filter(item => {
        return item.text.toLowerCase().includes(this.spoolSearchText.toLowerCase())
      })
    },
    selectSpool(item) {
      if (this.currentProductIndex >= 0 && this.currentProductIndex < this.selectedProducts.length) {
        this.selectedProducts[this.currentProductIndex].diskModel = item.text
        this.selectedProducts[this.currentProductIndex].diskId = item.originalData?.id
        this.selectedProducts[this.currentProductIndex].diskDiameter = item.originalData?.diskDiameter
        if (item.originalData?.diskWeight) {
          this.selectedProducts[this.currentProductIndex].tareWeight = item.originalData.diskWeight
          // 修改7: 选择盘具时，如果已有毛重，自动计算净重
          if (this.selectedProducts[this.currentProductIndex].grossWeight) {
            this.calculateNetWeight(this.selectedProducts[this.currentProductIndex])
          }
        }
      }
      this.closeSpoolCenterPopup()
    },
    // 仓库选择方法
    selectWarehouse() {
      uni.showActionSheet({
        itemList: ['成品配套库', '成品闲置库', '半成品库','线边库'],
        success: (res) => {
          const warehouseNames = ['成品配套库', '成品闲置库', '半成品库','线边库']
          const warehouseIds = ['42', '43', '44','3'] // 假设的仓库ID
          const warehouseCodes = ['CPK_VIRTUAL', 'CPX_VIRTUAL', 'BCP_VIRTUAL','XBK_VIRTUAL'] // 假设的仓库编码

          this.selectedWarehouse = warehouseNames[res.tapIndex]
          // 更新表单中的仓库信息
          this.formData.warehouseId = warehouseIds[res.tapIndex]
          this.formData.warehouseCode = warehouseCodes[res.tapIndex]
          this.formData.warehouseName = warehouseNames[res.tapIndex]
        }
      })
    },

    // 打开扫码弹窗
    scanProduct() {
      // 如果已经有产品且当前不是扫码模式，则提示
      if (this.selectedProducts.length > 0 && this.addMode !== 'scan') {
        uni.showToast({
          title: '已通过手动选择产品，请勿混合使用',
          icon: 'none',
          duration: 2000
        })
        return
      }

      // 设置添加模式
      if (this.addMode === 'none') {
        this.addMode = 'scan'
      }

      console.log('扫码添加按钮被点击')

      // 重置扫码输入
      this.scanCodeInput = ''
      this.isScanInputFocus = true

      // 打开扫码弹窗
      this.$refs.scanPopup.open()

      // 设置一个延迟以确保弹窗已打开，然后聚焦输入框
      setTimeout(() => {
        this.isScanInputFocus = true
        // 如果需要，可以在这里通过ref手动聚焦
        if (this.$refs.scanInput) {
          this.$refs.scanInput.focus()
        }
      }, 100)
    },

    // 关闭扫码弹窗
    closeScanPopup() {
      this.$refs.scanPopup.close()
      this.isScanInputFocus = false
    },

    // 确认扫码
    confirmScan() {
      const scanCode = this.scanCodeInput.trim()

      if (!scanCode) {
        uni.showToast({
          title: '请输入批次码',
          icon: 'none'
        })
        return
      }

      // 关闭弹窗
      this.closeScanPopup()

      // 处理扫码逻辑
      this.handleScan(scanCode)
    },

    // 手动选择产品
    selectProduct() {
      // 设置添加模式
      if (this.addMode === 'none') {
        this.addMode = 'manual'
      }

      uni.navigateTo({
        url: '/pages/md/item/sing-select'
      })
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
      getInfoByBatchCode(scanCode).then(res => {
        if (res.code === 200 && res.data) {
          // 初始化产品字段
          const product = res.data
          product.diskModel = product.diskModel || ''
          product.itemLength = product.itemLength || ''
          product.diskId = product.diskId || ''
          product.diskDiameter = product.diskDiameter || undefined
          product.blankWire = product.blankWire || ''
          product.platingLayer = product.platingLayer || ''
          // 修改8: 如果扫码获取的数据有毛重和盘重，自动计算净重
          if (product.grossWeight && product.tareWeight) {
            this.calculateNetWeight(product)
          }
          // 添加到列表
          this.selectedProducts.push(product)
          // 扫码后清空输入框
          this.scanCodeInput = ''
        } else {
          uni.showToast({
            title: '扫码失败: ' + (res.msg || '未知错误'),
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

      // 验证必填项
      for (const [index, product] of this.selectedProducts.entries()) {
        if (!product.grossWeight || parseFloat(product.grossWeight) <= 0) {
          uni.showToast({
            title: `第${index + 1}个产品毛重不能为空或小于等于0`,
            icon: 'none'
          })
          return
        }
        if (!product.tareWeight || parseFloat(product.tareWeight) < 0) {
          uni.showToast({
            title: `第${index + 1}个产品盘重不能为空或小于0`,
            icon: 'none'
          })
          return
        }
        // 修改9: 验证净重不能为负数
        const netWeight = this.calculateNetWeightValue(product)
        if (netWeight < 0) {
          uni.showToast({
            title: `第${index + 1}个产品净重不能为负数`,
            icon: 'none'
          })
          return
        }
      }

      // 显示入库中提示
      uni.showLoading({
        title: '入库中...',
        mask: true
      })

      this.loading = true
      let successCount = 0
      let failList = []
      try {
        if (this.selectedProducts.length > 0) {
          this.formData.workorderId = this.selectedProducts[0].workorderId;
          this.formData.workorderCode = this.selectedProducts[0].workorderCode;
          this.formData.workorderName = this.selectedProducts[0].workorderName;
        }
        for (const [index, order] of this.selectedProducts.entries()) {
          order.diskModel = order.diskModel || ''
          order.itemLength = order.itemLength || ''
          order.diskId = order.diskId || ''
          order.diskDiameter = order.diskDiameter || undefined
          order.blankWire = order.blankWire || ''
          order.warehouseId = this.formData.warehouseId || ''
          order.warehouseCode = this.formData.warehouseCode || ''
          order.warehouseName = this.formData.warehouseName || ''
          order.locationId = this.formData.locationId || ''
          order.locationCode = this.formData.locationCode || ''
          order.locationName = this.formData.locationName || ''
          order.areaId = this.formData.areaId || ''
          order.areaCode = this.formData.areaCode || ''
          order.areaName = this.formData.areaName || ''
          // 修改10: 入库时使用计算得到的净重
          const netWeight = this.calculateNetWeightValue(order)
          order.netWeight = netWeight.toFixed(2)
          order.quantityRecived = order.netWeight

          const requestData = {
            ...this.formData,
            recptCode: `PR${Date.now()}_${index + 1}`, // 避免单号重复
            recptDate: new Date().toISOString().split('T')[0],
            materialLines: [order]
          }
          try {
            const res = await addRecptHeader(requestData);
            if (res.code === 200) {
              successCount++
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
            console.error(`产品${order.itemCode}入库失败:`, error)
          }
        }
        if (failList.length === 0) {
          uni.showToast({
            title: `全部${successCount}条物料入库成功！`,
            icon: 'success',
            duration: 2000
          })
          this.selectedProducts = []
          this.addMode = 'none'
          // 获取上一个页面实例
          const pages = getCurrentPages()
          const prevPage = pages[pages.length - 2]
          if (prevPage) {
            // 调用上一个页面的方法，传递选中的产品信息
            prevPage.$vm.fetchTableData()
            // 返回上一个页面
            setTimeout(() => {
              uni.navigateBack()
            }, 100)
          }
        } else {
          uni.showModal({
            title: '入库结果',
            content: `成功入库${successCount}条，失败${failList.length}条：\n${failList.map(item => `批次${item.batchCode}：${item.msg}`).join('\n')}`,
            showCancel: false,
            confirmText: '确定'
          })
        }
      } catch (error) {
        console.error('入库流程异常:', error)
        uni.showToast({
          title: '入库失败：系统异常',
          icon: 'none'
        })
      } finally {
        this.loading = false
        // 关闭加载提示
        uni.hideLoading()
      }
    },

    // 添加选中的产品或更新坯线信息
    addSelectedProduct(product) {
      if (this.isBlankWireSelection) {
        // 坯线选择模式：更新现有产品的坯线字段
        if (this.currentProductIndexForBlankWire >= 0 && this.currentProductIndexForBlankWire < this.selectedProducts.length) {
          // 将选中产品的规格型号赋值给坯线字段
          this.selectedProducts[this.currentProductIndexForBlankWire].blankWire = product.specification
          // 强制刷新数组，确保UI更新
          this.selectedProducts = [...this.selectedProducts]
          // 重置坯线选择模式
          this.isBlankWireSelection = false
          this.currentProductIndexForBlankWire = -1
        }
      } else {
        // 产品选择模式：添加新产品（允许重复添加）
        const newProduct = {
          ...product,
          diskModel: '',
          itemLength: '',
          diskId: '',
          diskDiameter: undefined,
          blankWire: '',
          platingLayer:'',
          grossWeight: '', // 修改11: 初始化毛重字段
          tareWeight: '',
          netWeight: ''   // 修改12: 初始化净重字段
        }
        // 添加新产品
        this.selectedProducts.push(newProduct)
      }
    },

    // 移除产品
    removeProduct(index) {
      this.selectedProducts.splice(index, 1)
      if (this.selectedProducts.length === 0) {
        this.addMode = 'none'
      }
    },

    // 选择坯线物料
    selectBlankWire(index) {
      // 设置坯线选择模式和当前产品索引
      this.isBlankWireSelection = true
      this.currentProductIndexForBlankWire = index
      uni.navigateTo({
        url: '/pages/md/item/sing-select'
      })
    },

    // 修改13: 移除旧的calculateGrossWeight方法，因为现在是根据毛重计算净重
  },
  onLoad() {
    // 页面加载时不需要特殊处理
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 30rpx;
  padding-bottom: 160rpx;
}

/* 仓库信息行 */
.warehouse-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 30rpx;

  .label {
    font-size: 32rpx;
    color: #333;
    font-weight: normal;
  }

  .value-section {
    display: flex;
    align-items: center;

    .value {
      font-size: 32rpx;
      color: #666;
      margin-right: 15rpx;
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

/* 坯线输入框样式 */
.blank-wire-input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
}

.blank-wire-input-wrapper .input-value {
  height: 60rpx;
  padding: 0 15rpx;
  padding-right: 50rpx;
}

.blank-wire-input-wrapper .search-btn {
  position: absolute;
  right: 15rpx;
  cursor: pointer;
  z-index: 1;
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
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #f0f0f0;

  .product-count {
    font-size: 26rpx;
    color: #666;
  }

  .total-section {
    display: flex;
    align-items: center;

    .total-label {
      font-size: 26rpx;
      color: #ff4444;
    }

    .total-price {
      font-size: 32rpx;
      color: #ff4444;
      font-weight: bold;
      margin-right: 20rpx;
    }

    .settle-btn {
      background-color: #2979ff;
      color: #ffffff;
      padding: 18rpx 40rpx;
      border-radius: 35rpx;
      font-size: 28rpx;
    }
  }
}

.spool-select-modal {
  width: 600rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.spool-search-wrapper {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.search-input {
  width: 100%;
  height: 70rpx;
  border: 1rpx solid #e8e8e8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.spool-list-content {
  max-height: 400rpx;
  padding: 10rpx 0;
}

.select-item {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  cursor: pointer;
  transition: background-color 0.2s;
}

.select-item:hover {
  background-color: #f5f5f5;
}

.select-empty {
  padding: 40rpx;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}

/* 扫码弹窗样式 */
.scan-modal {
  width: 600rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.modal-content {
  padding: 40rpx 30rpx;
}

.scan-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  background-color: #fff;

  &:focus {
    border-color: #2979ff;
  }
}

.modal-footer {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.modal-btn {
  flex: 1;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  cursor: pointer;
  transition: background-color 0.2s;

  &:active {
    opacity: 0.8;
  }
}

.cancel-btn {
  color: #666;
  border-right: 1rpx solid #f0f0f0;

  &:active {
    background-color: #f5f5f5;
  }
}

.confirm-btn {
  color: #2979ff;
  font-weight: bold;

  &:active {
    background-color: #f0f7ff;
  }
}
</style>