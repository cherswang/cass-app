<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar
        title="新建物料入库"
        :placeholder="true"
        bg-color="#FFFFFF"
        title-color="#333333"
        :border="false"
        :auto-back="true"
    />
    <!-- 主体内容 -->
    <view class="content">
      <!-- 供应商信息行 -->
      <view class="warehouse-row" @click="handleSelectVendor">
        <text class="label">供应商</text>
        <view class="value-section">
          <text class="value">{{ form.vendorName || '请选择供应商' }}</text>
          <u-icon name="arrow-right" color="#999" size="16"></u-icon>
        </view>
      </view>

      <!-- 仓库信息行 -->
      <view class="warehouse-row" @click="selectWarehouse">
        <text class="label">仓库</text>
        <view class="value-section">
          <text class="value">{{ selectedWarehouse }}</text>
          <u-icon name="arrow-right" color="#999" size="16"></u-icon>
        </view>
      </view>

      <!-- 供应商选择弹窗 -->
      <u-popup ref="vendorPopup" mode="bottom" :mask-click="false" :show="showVendorPopup">
        <view class="vendor-popup-content">
          <view class="popup-header">
            <text class="popup-title">选择供应商</text>
            <u-icon name="close" size="20" color="#999" @click="showVendorPopup = false"></u-icon>
          </view>

          <!-- 搜索区域 -->
          <view class="search-section">
            <view class="search-wrapper">
              <u-search
                  v-model="searchValue"
                  placeholder="请输入供应商编码/名称"
                  bg-color="#F8F8F8"
                  @search="handleVendorSearch"
                  @input="handleVendorInput"
                  class="vendor-search"
                  :show-action="false"
              ></u-search>
              <up-button
                  type="primary"
                  plain
                  size="small"
                  class="search-btn"
                  @click="handleVendorSearch"
              >
                搜索
              </up-button>
            </view>
          </view>

          <!-- 供应商列表容器 -->
          <scroll-view
              class="vendor-scroll"
              scroll-y
              @scrolltolower="handleVendorLoadMore"
              style="max-height: 600rpx;"
          >
            <!-- 供应商列表 -->
            <view class="vendor-list">
              <view v-if="vendorLoading" class="loading-container">
                <u-loading-icon size="20" text="加载中..."></u-loading-icon>
              </view>
              <view v-else-if="vendorList.length === 0" class="empty-container">
                <text class="empty-text">暂无供应商数据</text>
              </view>
              <view v-else>
                <view
                    v-for="vendor in vendorList"
                    :key="vendor.vendorId"
                    class="vendor-item"
                    :class="{'active': selectedVendor?.vendorId === vendor.vendorId}"
                    @click="selectVendorItem(vendor)"
                >
                  <text class="vendor-name">{{ vendor.vendorName }}</text>
                  <u-icon
                      v-if="selectedVendor?.vendorId === vendor.vendorId"
                      name="checkmark"
                      size="20"
                      color="#2979FF"
                  ></u-icon>
                </view>

                <!-- 加载更多状态 -->
                <view v-if="vendorLoadingMore" class="loading-more-container">
                  <u-loading-icon size="16" text="加载中..."></u-loading-icon>
                </view>

                <!-- 没有更多数据 -->
                <view v-else-if="vendorList.length >= vendorTotal" class="no-more-container">
                  <text class="no-more-text">已经到底了，没有更多数据了</text>
                </view>
              </view>
            </view>
          </scroll-view>

          <!-- 底部按钮 -->
          <view class="popup-footer">
            <up-button size="small" @click="showVendorPopup = false">取消</up-button>
            <up-button type="primary" size="small" @click="confirmVendorSelect" :disabled="!selectedVendor">确定</up-button>
          </view>
        </view>
      </u-popup>

      <!-- 选择物料按钮 -->
      <view class="button-row">
        <view class="action-btn" @click="selectProduct" style="width: 100%;">
          <u-icon name="plus" size="20" color="#333"></u-icon>
          <text class="btn-text">选择物料</text>
        </view>
      </view>

      <!-- 产品卡片列表 -->
      <view class="product-cards" v-if="selectedProducts.length > 0">
        <view class="product-card" v-for="(product, index) in selectedProducts" :key="product.tempId || product.lineId">
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
              <text class="label">毛重（kg）：</text>
              <!-- 扫码数据显示文本，手动添加显示输入框 -->
              <u-input
                  clearable
                  v-model.number="product.grossWeight"
                  type="digit"
                  placeholder="请输入毛重"
                  class="input-value"
                  :precision="2"
                  :disabled="formMode === 'show'"
                  @blur="calculateNetWeight(index)"
                  @input="calculateNetWeight(index)"
              ></u-input>
            </view>
            <view class="info-row">
              <text class="label">盘重（kg）：</text>
              <u-input
                  clearable
                  v-model.number="product.tareWeight"
                  type="digit"
                  placeholder="请输入盘重"
                  class="input-value"
                  :precision="2"
                  :disabled="formMode === 'show'"
                  @blur="calculateNetWeight(index)"
                  @input="calculateNetWeight(index)"
              ></u-input>
            </view>
            <view class="info-row">
              <text class="label">净重（kg）：</text>
              <text class="value">{{ product.netWeight ? product.netWeight.toFixed(2) : '0.00' }}</text>
            </view>
            <view class="info-row" v-if="formMode !== 'show'">
              <text class="label">镀层：</text>
              <u-input
                  clearable
                  v-model="product.platingLayer"
                  placeholder="请输入镀层"
                  class="input-value full-width"
              ></u-input>
            </view>
            <view class="info-row" v-if="formMode !== 'show'">
              <text class="label">备注：</text>
              <u-input
                  clearable
                  v-model="product.remark"
                  placeholder="请输入备注"
                  class="input-value full-width"
              ></u-input>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态提示 -->
      <view class="empty-state" v-else>
        <text class="empty-text">暂无选中的物料</text>
      </view>
    </view>

    <!-- 底部统计与结算 -->
    <view class="bottom-bar">
      <text class="product-count">共 {{ productCount }} 个物料</text>
      <view class="total-section">
        <text class="total-label">净重合计：</text>
        <text class="total-price">{{ totalNetWeight }} kg</text>
        <view class="settle-btn" @click="submitForm" :loading="buttonLoading">确定入库</view>
      </view>
    </view>
  </view>
</template>

<script>
import { addItemrecpt, updateItemrecpt } from "@/api/wms/itemrecpt";
import { getTreeList } from "@/api/wms/warehouse"
import { listVendor } from "@/api/md/vendor";
import "@/static/pages/index.css";

export default {
  name: 'addMaterialPut',
  components: {},
  data() {
    return {
      // 供应商选择相关
      showVendorPopup: false,
      vendorList: [],
      vendorLoading: false,
      vendorLoadingMore: false,
      searchValue: '',
      selectedVendor: null,
      // 分页相关
      vendorPage: 1,
      vendorPageSize: 10,
      vendorTotal: 0,
      // 仓库选择相关
      selectedWarehouse: '原料库',
      // 选中的产品列表
      selectedProducts: [],
      // 表单数据
      formData: {
        recptCode: '',
        recptName: '',
        iqcId: '',
        vendorId: '',
        vendorCode: '',
        vendorName: '',
        vendorNick: '',
        warehouseId: '',
        warehouseCode: '',
        warehouseName: '',
        locationId: '',
        locationCode: '',
        locationName: '',
        areaId: '',
        areaCode: '',
        areaName: '',
        recptDate: new Date().toISOString().split('T')[0],
        poCode: '',
        status: "10",
        remark: ''
      },
      // 加载状态
      buttonLoading: false,
      // 表单模式
      formMode: "add",
      // 仓库选择
      warehouseInfo: [],
      warehouseOptions: [],
      warehouseMultiOptions: [[], [], []],
      // 物料行
      materialLines: [],
      currentEditIndex: -1,
      // 表单数据
      form: {
        recptId: '',
        recptCode: '',
        recptName: '',
        iqcId: '',
        vendorId: '',
        vendorCode: '',
        vendorName: '',
        vendorNick: '',
        warehouseId: '',
        warehouseCode: '',
        warehouseName: '',
        locationId: '',
        locationCode: '',
        locationName: '',
        areaId: '',
        areaCode: '',
        areaName: '',
        recptDate: new Date(),
        poCode: '',
        status: "10",
        remark: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',
        materialLines: [],
      },
      // 搜索防抖定时器
      searchTimer: null
    }
  },
  computed: {
    // 计算选中产品的数量
    productCount() {
      return this.selectedProducts.length
    },
    // 计算净重合计
    totalNetWeight() {
      const total = this.selectedProducts
          .reduce((sum, product) => {
            const netWeight = Number(product.netWeight) || 0;
            return sum + netWeight;
          }, 0);
      return total.toFixed(2);
    }
  },
  methods: {
    // 仓库选择方法
    selectWarehouse() {
      uni.showActionSheet({
        itemList: ['原料库', '成品配套库', '成品闲置库', '半成品库'],
        success: (res) => {
          const warehouseNames = ['原料库', '成品配套库', '成品闲置库', '半成品库']
          const warehouseIds = ['1', '42', '43', '44']
          const warehouseCodes = ['YLK', 'CPK_VIRTUAL', 'CPX_VIRTUAL', 'BCP_VIRTUAL']

          this.selectedWarehouse = warehouseNames[res.tapIndex]
          // 更新表单中的仓库信息
          this.form.warehouseId = warehouseIds[res.tapIndex]
          this.form.warehouseCode = warehouseCodes[res.tapIndex]
          this.form.warehouseName = warehouseNames[res.tapIndex]
        }
      })
    },

    selectProduct() {
      uni.navigateTo({
        url: '/pages/md/item/sing-select'
      })
    },

    // 执行入库
    async submitForm() {
      if (this.selectedProducts.length === 0) {
        uni.showToast({
          title: '请至少添加一条物料信息',
          icon: 'none'
        })
        return
      }
      if (this.form.vendorName === null || this.form.vendorName === '' || this.form.vendorName === undefined) {
        uni.showToast({
          title: '请选择供应商',
          icon: 'none'
        })
        return
      }
      const invalidItems = this.selectedProducts.filter(item => {
        return !item.grossWeight || !item.tareWeight || isNaN(item.grossWeight) || isNaN(item.tareWeight);
      });

      if (invalidItems.length > 0) {
        uni.showToast({
          title: '请完善所有物料的毛重和盘重信息',
          icon: 'none'
        });
        return;
      }

      // 显示加载弹窗，提升用户体验
      uni.showLoading({
        title: '处理中...',
        mask: true
      })

      this.buttonLoading = true
      try {
        this.form.materialLines = this.selectedProducts.filter(item => item.itemCode)
        let recptResponse
        if (this.form.recptId) {
          recptResponse = await updateItemrecpt(this.form)
        } else {
          recptResponse = await addItemrecpt(this.form)
        }
        if (recptResponse.code === 200) {
          uni.showToast({ title: this.form.recptId ? '修改成功' : '新增成功', icon: 'success' })
          // 返回列表页
          setTimeout(() => {
            // 通知列表页刷新
            uni.$emit('refreshMaterialPutList', true)
            uni.navigateBack()
          }, 1000)
        } else {
          uni.showToast({ title: recptResponse.msg || '保存失败', icon: 'none' })
        }
      } catch (error) {
        console.error('提交失败:', error)
        uni.showToast({ title: '操作失败，请重试', icon: 'none' })
      } finally {
        this.buttonLoading = false
        // 关闭加载提示
        uni.hideLoading()
      }
    },
    
    // 添加选中的产品
    addSelectedProduct(product) {
      // 检查产品是否已存在
      const existsIndex = this.selectedProducts.findIndex(item => item.itemId === product.itemId)
      if (existsIndex === -1) {
        const newProduct = {
          ...product,
          grossWeight: '', // 毛重
          tareWeight: '',  // 盘重
          netWeight: 0,    // 净重
          platingLayer: '', // 镀层
          remark: ''       // 备注
        };
        this.selectedProducts.push(newProduct)
      }
    },

    // 移除产品
    removeProduct(index) {
      this.selectedProducts.splice(index, 1)
    },

    calculateNetWeight(index) {
      const item = this.selectedProducts[index];
      if (!item) return;

      // 处理空值和非数字情况，确保计算安全
      const grossWeight = Number(item.grossWeight) || 0;
      const tareWeight = Number(item.tareWeight) || 0;

      // 计算净重，确保结果非负，并保留2位小数
      let netWeight = grossWeight - tareWeight;
      netWeight = Math.max(0, netWeight); // 净重不能为负数
      netWeight = Math.round(netWeight * 100) / 100; // 精确到2位小数

      // 更新净重值
      item.netWeight = netWeight;

      // 强制更新视图（确保UI实时刷新）
      this.$set(this.selectedProducts, index, item);
    },

    // 重置表单
    resetForm() {
      const defaultForm = {
        recptId: this.form.recptId || '', // 保留编辑模式的ID
        recptCode: '',
        recptName: '',
        iqcId: '',
        vendorId: '',
        vendorCode: '',
        vendorName: '',
        vendorNick: '',
        warehouseId: '',
        warehouseCode: '',
        warehouseName: '',
        locationId: '',
        locationCode: '',
        locationName: '',
        areaId: '',
        areaCode: '',
        areaName: '',
        recptDate: new Date(),
        poCode: '',
        status: "10",
        remark: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      };
      this.form = { ...defaultForm };
      this.selectedProducts = [];
      this.currentEditIndex = -1;
      this.setDefaultWarehouseByGroupName("原料库");
    },

    // 获取仓库列表
    async getWarehouseList() {
      try {
        const response = await getTreeList();
        if (response) {
          this.warehouseOptions = response;
          this.formatWarehouseOptions();
        }
      } catch (error) {
        console.error('加载仓库数据失败:', error);
        uni.showToast({ title: '加载仓库数据失败', icon: 'none' });
      }
    },

    // 格式化仓库三级联动
    formatWarehouseOptions() {
      let formattedOptions = JSON.parse(JSON.stringify(this.warehouseOptions));
      formattedOptions = formattedOptions.map(w => {
        w.pId = w.warehouseId || w.pId;
        w.pName = w.warehouseName || w.pName;
        w.pCode = w.warehouseCode || w.pCode;
        if (w.children) {
          w.children = w.children.map(l => {
            l.pId = l.locationId || l.pId;
            l.pName = l.locationName || l.pName;
            l.pCode = l.locationCode || l.pCode;
            if (l.children) {
              l.children = l.children.map(a => {
                a.pId = a.areaId || a.pId;
                a.pName = a.areaName || a.pName;
                a.pCode = a.areaCode || a.pCode;
                return a;
              });
            }
            return l;
          });
        }
        return w;
      });

      this.warehouseMultiOptions[0] = formattedOptions;
      if (formattedOptions.length > 0) {
        this.warehouseMultiOptions[1] = formattedOptions[0].children || [];
        if (this.warehouseMultiOptions[1].length > 0) {
          this.warehouseMultiOptions[2] = this.warehouseMultiOptions[1][0].children || [];
        }
      }
      this.warehouseOptions = formattedOptions;
      this.setDefaultWarehouseByGroupName("原料库");
    },

    // 设置默认仓库
    setDefaultWarehouseByGroupName(targetName) {
      if (!this.form.warehouseId && this.warehouseMultiOptions[0].length > 0) {
        const targetWarehouse = this.warehouseMultiOptions[0].find(warehouse =>
            warehouse.pName && warehouse.pName.includes(targetName)
        );
        if (targetWarehouse) {
          const warehouseIndex = this.warehouseMultiOptions[0].findIndex(w => w.pId === targetWarehouse.pId);
          const locationIndex = 0;
          let areaIndex = 0;
          this.warehouseMultiOptions[1] = targetWarehouse.children || [];
          const targetLocation = this.warehouseMultiOptions[1][locationIndex] || {};
          this.warehouseMultiOptions[2] = targetLocation.children || [];
          const targetArea = this.warehouseMultiOptions[2][areaIndex] || {};
          this.warehouseInfo = [warehouseIndex, locationIndex, areaIndex];
          this.form.warehouseId = targetWarehouse.pId || '';
          this.form.warehouseCode = targetWarehouse.pCode || '';
          this.form.warehouseName = targetWarehouse.pName || '';
          this.form.locationId = targetLocation.pId || '';
          this.form.locationCode = targetLocation.pCode || '';
          this.form.locationName = targetLocation.pName || '';
          this.form.areaId = targetArea.pId || '';
          this.form.areaCode = targetArea.pCode || '';
          this.form.areaName = targetArea.pName || '';
          this.selectedWarehouse = targetWarehouse.pName || '';
        } else {
          console.warn(`未找到名称包含"${targetName}"的仓库`);
          const firstWarehouse = this.warehouseMultiOptions[0][0] || {};
          this.form.warehouseId = firstWarehouse.pId || '';
          this.form.warehouseName = firstWarehouse.pName || '';
          this.selectedWarehouse = firstWarehouse.pName || '';
        }
      }
    },

    // 打开供应商选择弹窗
    handleSelectVendor() {
      this.showVendorPopup = true
      this.loadVendorList()
    },

    // 加载供应商列表
    async loadVendorList(append = false) {
      // 如果是追加数据且没有更多数据，直接返回
      if (append && this.vendorList.length >= this.vendorTotal) {
        return
      }

      // 设置加载状态
      if (append) {
        this.vendorLoadingMore = true
      } else {
        this.vendorLoading = true
      }

      try {
        const params = {
          searchValue: this.searchValue,
          pageNum: append ? this.vendorPage + 1 : 1,
          pageSize: this.vendorPageSize
        }
        const res = await listVendor(params)
        if (res.code === 200) {
          const newData = res.rows || []
          // 更新数据和分页信息
          if (append) {
            this.vendorList = [...this.vendorList, ...newData]
            this.vendorPage += 1
          } else {
            this.vendorList = newData
            this.vendorPage = 1
          }
          this.vendorTotal = Number(res.total) || 0
        } else {
          uni.showToast({
            title: res.msg || '加载供应商列表失败',
            icon: 'none'
          })
          if (!append) {
            this.vendorList = []
            this.vendorTotal = 0
          }
        }
      } catch (error) {
        console.error('加载供应商列表出错：', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
        if (!append) {
          this.vendorList = []
          this.vendorTotal = 0
        }
      } finally {
        // 关闭加载状态
        if (append) {
          this.vendorLoadingMore = false
        } else {
          this.vendorLoading = false
        }
      }
    },

    // 搜索输入处理
    handleVendorInput() {
      // 搜索时重置分页
      this.vendorPage = 1
      this.vendorTotal = 0
      // 可以添加防抖处理
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.loadVendorList()
      }, 300)
    },

    // 搜索供应商
    handleVendorSearch() {
      this.vendorPage = 1
      this.vendorTotal = 0
      this.loadVendorList()
    },

    // 加载更多供应商
    handleVendorLoadMore() {
      if (!this.vendorLoading && !this.vendorLoadingMore && this.vendorList.length < this.vendorTotal) {
        this.loadVendorList(true)
      }
    },

    // 选择供应商项
    selectVendorItem(vendor) {
      this.selectedVendor = vendor
    },

    // 确认选择供应商
    confirmVendorSelect() {
      if (this.selectedVendor) {
        this.form.vendorId = this.selectedVendor.vendorId
        this.form.vendorCode = this.selectedVendor.vendorCode
        this.form.vendorName = this.selectedVendor.vendorName
        this.form.vendorNick = this.selectedVendor.vendorNick
        this.showVendorPopup = false
        this.selectedVendor = null
      }
    }
  },
  onLoad(options) {
    // 编辑模式：从参数获取recptId
    if (options.recptId) {
      this.form.recptId = options.recptId;
      this.formMode = "edit";
    }
    this.getWarehouseList();
    this.resetForm();
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

    .u-icon {
      margin-right: 10rpx;
    }

    .btn-text {
      font-size: 28rpx;
      color: #333;
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
        width: 160rpx;
        font-size: 28rpx;
        color: #666666;
        flex-shrink: 0;
      }

      .value {
        flex: 1;
        font-size: 28rpx;
        color: #333333;

        &.price {
          color: #FA3534;
          font-weight: 500;
        }
      }

      .input-value {
        flex: 1;
        padding: 10rpx 10rpx;
        border: 1rpx solid #e0e0e0;
        border-radius: 6rpx;
        font-size: 28rpx;
        color: #333;

        &.full-width {
          width: 100%;
        }
      }
    }
  }
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

/* 供应商弹窗样式 */
.vendor-popup-content {
  width: 100%;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.search-section {
  padding: 10rpx 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.vendor-search {
  width: 100%;
  border-radius: 6rpx;
}

.vendor-scroll {
  flex: 1;
  overflow: hidden;
}

.vendor-list {
  padding: 0;
}

.vendor-item {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
  background-color: #fff;
  position: relative;
}

.vendor-item:active {
  background-color: #f5f5f5;
}

.vendor-item:last-child {
  border-bottom: none;
}

.vendor-item.active {
  background-color: #f0f8ff;
}

.vendor-item .vendor-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  display: flex;
}

.vendor-item .vendor-code {
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.vendor-item .u-icon {
  flex-shrink: 0;
  margin-left: 20rpx;
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15rpx;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  background-color: #fff;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0;
  background-color: #fff;
}

.loading-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  background-color: #fff;
  font-size: 24rpx;
  color: #999;
}

.no-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
  background-color: #fff;
  font-size: 24rpx;
  color: #999;
}

.empty-container {
  text-align: center;
  padding: 80rpx 0;
  color: #999;
  font-size: 28rpx;
  background-color: #fff;
}


.search-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.search-btn {
  flex-shrink: 0;
  padding: 0 24rpx;
  width: 50rpx;
}
</style>