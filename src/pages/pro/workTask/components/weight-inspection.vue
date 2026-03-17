<template>
  <!-- 称重报检弹窗 -->
  <up-popup
      :show="show"
      mode="bottom"
      :round="16"
      :closeable="true"
      :safe-area-inset-bottom="true"
      :height="'100%'"
      @close="close"
  >
    <view class="detail-container full-screen">
      <!-- 标题 -->
      <view class="detail-header">
        <text class="detail-title">称重报检</text>
      </view>

      <!-- 内容区域 -->
      <scroll-view class="detail-content" scroll-y>
        <!-- 设备编码输入 -->
        <view class="detail-section">
          <view class="form-item">
            <text class="form-label">设备编码</text>
            <view class="equipment-type-selector-pretty">
              <view class="pretty-radio-group-row">
                <view
                    v-for="(item, index) in equipmentOptions"
                    :key="item.id"
                    class="pretty-radio-item-row"
                    :class="{'active': weightForm.equipmentCode === item.value}"
                    @click="selectEquipment(index)"
                    :disabled="isReported"
                >
                  <view class="radio-content">
                    <text class="radio-label">{{ item.text }}</text>
                  </view>
                </view>
              </view>
              <view v-if="equipmentLoading" class="loading-container" style="margin-top: 10px;">
                <up-loading-icon mode="spinner" color="#2979FF"></up-loading-icon>
                <text class="loading-text">加载设备列表中...</text>
              </view>
              <view v-else-if="equipmentOptions.length === 0" class="empty-container" style="margin-top: 10px;">
                <text class="empty-text">未找到可用设备编码，请先上料</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 报检类型 -->
        <view class="detail-section">
          <view class="form-item">
            <text class="form-label">报检类型</text>
            <view class="inspection-type-selector-pretty">
              <view class="pretty-radio-group-row">
                <view
                    class="pretty-radio-item-row"
                    :class="{'active': weightForm.inspectionType === 'FIRST'}"
                    @click="weightForm.inspectionType = 'FIRST'"
                    :disabled="isReported"
                >
                  <view class="inspection-type-badge">首</view>
                  <view class="radio-content">
                    <text class="radio-label">首检</text>
                  </view>
                </view>
                <view
                    class="pretty-radio-item-row"
                    :class="{'active': weightForm.inspectionType === 'FINAL'}"
                    @click="weightForm.inspectionType = 'FINAL'"
                    :disabled="isReported"
                >
                  <view class="inspection-type-badge">末</view>
                  <view class="radio-content">
                    <text class="radio-label">末检</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 盘具信息 -->
        <view class="detail-section">
          <view class="form-item">
            <text class="form-label">盘具信息</text>
            <view class="input-wrapper">
              <view class="custom-select" @click="openSpoolCenterPopup" :class="{'disabled': isReported}">
                <text class="select-value">{{ weightForm.spoolInfo || '请选择盘具信息' }}</text>
                <up-icon name="arrow-down" size="16" color="#999"></up-icon>
              </view>
            </view>
          </view>
        </view>

        <!-- 盘具重量 -->
        <view class="detail-section">
          <view class="form-item">
            <text class="form-label">盘具重量(kg)</text>
            <view class="input-wrapper">
              <up-input
                  v-model="weightForm.spoolWeight"
                  placeholder="请输入盘具重量"
                  placeholder-color="#999"
                  :disabled="isReported"
                  type="digit"
              ></up-input>
            </view>
          </view>
        </view>

        <!-- 完成毛重 -->
        <view class="detail-section">
          <view class="form-item">
            <text class="form-label">完成毛重(kg)</text>
            <view class="input-wrapper">
              <up-input
                  v-model="weightForm.finishedWeight"
                  placeholder="请输入完成毛重"
                  placeholder-color="#999"
                  :disabled="isReported"
                  type="digit"
              ></up-input>
            </view>
          </view>
        </view>

        <!-- 净重显示 -->
        <view class="detail-section">
          <view class="form-item">
            <text class="form-label">净重(kg)</text>
            <view class="input-wrapper">
              <view class="net-weight-display">
                <text class="net-weight-value">{{ netWeight }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 长度 -->
        <view class="detail-section">
          <view class="form-item">
            <text class="form-label">长度(m)</text>
            <view class="input-wrapper">
              <up-input
                  v-model="weightForm.itemLength"
                  placeholder="请输入长度"
                  placeholder-color="#999"
                  :disabled="isReported"
                  type="number"
              ></up-input>
            </view>
          </view>
        </view>

        <!-- 加载状态 -->
        <view v-if="submitting" class="loading-container">
          <up-loading-icon mode="spinner" color="#2979FF"></up-loading-icon>
          <text class="loading-text">报检中...</text>
        </view>
      </scroll-view>

      <!-- 底部固定按钮 -->
      <view class="action-section fixed-bottom">
        <view class="button-group">
          <up-button 
              type="info" 
              text="取消" 
              @click="close"
              style="flex: 1; margin-right: 10rpx;"
          ></up-button>
          <up-button 
              type="primary" 
              text="报检并报工" 
              @click="submitWeightInspection"
              :disabled="isReported || !weightForm.equipmentCode"
              style="flex: 1; margin-right: 10rpx;"
          ></up-button>
          <up-button 
              type="success" 
              text="打印标签" 
              @click="openPrinterModal"
              :disabled="!isReported"
              style="flex: 1;"
          ></up-button>
        </view>
      </view>
    </view>
  </up-popup>

  <!-- 盘具选择弹窗 -->
  <up-popup
      :show="showSpoolPopup"
      mode="bottom"
      :round="16"
      :closeable="true"
      :safe-area-inset-bottom="true"
      @close="closeSpoolCenterPopup"
  >
    <view class="detail-container" style="min-height:50vh">
      <!-- 标题 -->
      <view class="detail-header">
        <text class="detail-title">选择盘具信息</text>
      </view>

      <!-- 搜索框 -->
      <view class="spool-search-wrapper">
        <up-input
            v-model="spoolSearchText"
            placeholder="搜索盘具信息..."
            placeholder-color="#999"
            @input="handleSpoolSearch"
            :clearable="true"
        ></up-input>
      </view>

      <!-- 盘具列表 -->
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
  </up-popup>

  <!-- 打印机选择弹窗 -->
  <up-popup
      :show="showPrinterPopup"
      mode="bottom"
      :round="16"
      :closeable="true"
      :safe-area-inset-bottom="true"
      :height="'60%'"
      @close="closePrinterModal"
  >
    <view class="detail-container" style="min-height:40vh">
      <!-- 标题 -->
      <view class="detail-header">
        <text class="detail-title">选择打印机</text>
      </view>

      <!-- 打印机列表 -->
      <scroll-view scroll-y="true" class="printer-list-content">
        <view v-if="printerLoading" class="loading-container">
          <up-loading-icon mode="spinner" color="#2979FF"></up-loading-icon>
          <text class="loading-text">加载打印机列表中...</text>
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
                  name="checkbox-mark"
                  size="20"
                  color="#2979FF"
              ></up-icon>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 底部固定按钮 -->
      <view class="action-section fixed-bottom">
        <view class="button-group">
          <up-button 
              type="info" 
              text="取消" 
              @click="closePrinterModal"
              style="flex: 1; margin-right: 10rpx;"
          ></up-button>
          <up-button 
              type="primary" 
              text="确定打印" 
              @click="confirmPrint"
              :disabled="!selectedPrinter"
              style="flex: 1;"
          ></up-button>
        </view>
      </view>
    </view>
  </up-popup>
</template>

<script>
import { submitWeightInspection, printLabel ,getEquipmentListAll} from '@/api/pro/workTask'
import { getPrintConfigListAll } from '@/api/system/printConfig'
import { getDiskInfoListAll } from '@/api/md/diskInfo'

export default {
  name: 'WeightInspection',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    taskDetail: {
      type: Object,
      required: true
    },
    taskId: {
      type: String,
      required: true
    }
  },
  computed: {
    // 计算净重：毛重减去盘重
    netWeight() {
      const finishedWeight = parseFloat(this.weightForm.finishedWeight) || 0;
      const spoolWeight = parseFloat(this.weightForm.spoolWeight) || 0;
      return (finishedWeight - spoolWeight).toFixed(2);
    }
  },
  data() {
    return {
      // 称重报检相关
      weightForm: {
        inspectionType: 'FINAL', // 报检类型：首件/末件
        spoolInfo: '',
        spoolWeight: '',
        spoolDiameter:'',
        finishedWeight: '',
        itemLength: '',
        equipmentCode: '', // 设备编码
        isRemainMaterial: 'YES' // 是否余料
      },
      // 新增设备选择器相关数据
      equipmentOptions: [],
      equipmentIndex: -1,
      equipmentLoading: false,
      // 盘具信息选项（初始为空，通过接口加载）
      spoolOptions: [],
      // 自定义选择器相关
      showSpoolPopup: false,
      spoolSearchText: '',
      filteredSpoolOptions: [],
      // 报检状态相关
      isReported: false, // 标记是否已报检成功
      submitting: false, // 提交状态
      // 打印机相关
      showPrinterPopup: false,
      printerList: [], // 打印机列表
      selectedPrinter: null, // 选中的打印机
      printerLoading: false, // 打印机列表加载状态
      qcId: '', // 报检ID，用于打印标签
    }
  },
  mounted() {
    this.loadDiskInfo();
    // 只有当 taskDetail.id 存在时才加载设备编码列表
    if (this.taskDetail && this.taskDetail.id) {
      this.loadEquipmentList();
    }
  },
  watch: {
    // 监听 taskDetail 的变化，当 taskDetail.id 存在时重新加载设备编码列表
    taskDetail: {
      handler(newTaskDetail) {
        if (newTaskDetail && newTaskDetail.id) {
          this.loadEquipmentList();
        }
      },
      deep: true
    },
    // 监听盘具搜索文本的变化，自动触发搜索
    spoolSearchText: {
      handler(newVal) {
        this.handleSpoolSearch();
      },
      immediate: false
    }
  },
  methods: {
    // 关闭弹窗
    close() {
      this.resetForm()
      this.$emit('close')
    },

    // 处理补打标签请求
    handleReprintLabel(item) {
      this.qcId = item.ipqcId || '';
      this.showPrinterPopup = true;
      this.loadPrinterList();
    },

    // 重置表单
    resetForm() {
      this.weightForm = {
        inspectionType: 'FINAL',
        spoolInfo: '',
        spoolWeight: '',
        spoolDiameter: '',
        finishedWeight: '',
        itemLength: '',
        equipmentCode: '', // 重置设备编码
        isRemainMaterial: 'YES'
      }
      this.equipmentIndex = -1
      this.spoolSearchText = ''
      this.filteredSpoolOptions = [...this.spoolOptions]
      this.isReported = false
      this.submitting = false
      this.showSpoolPopup = false
      this.showPrinterPopup = false
    },

    // 打开盘具选择弹窗
    openSpoolCenterPopup() {
      if (this.isReported) return
      this.spoolSearchText = ''
      this.filteredSpoolOptions = [...this.spoolOptions]
      this.showSpoolPopup = true
    },

    // 关闭盘具选择弹窗
    closeSpoolCenterPopup() {
      this.showSpoolPopup = false
    },

    // 打开打印机选择弹窗
    openPrinterModal() {
      this.showPrinterPopup = true;
      this.loadPrinterList();
    },

    // 关闭打印机选择弹窗
    closePrinterModal() {
      this.showPrinterPopup = false;
    },

    async loadEquipmentList() {
      this.equipmentLoading = true;
      try {
        // 检查 taskDetail.id 是否存在
        if (!this.taskDetail || !this.taskDetail.id) {
          console.error('任务ID不存在，无法加载设备编码');
          this.equipmentOptions = [];
          uni.showToast({ title: '任务信息不完整，无法加载设备编码', icon: 'none' });
          return;
        }
        
        const response = await getEquipmentListAll(this.taskDetail.id);
        if (response.code === 200 && response.data) {
          const uniqueEquipmentCodes = [...new Set(response.data)];
          this.equipmentOptions = uniqueEquipmentCodes.map((item, index) => ({
            id: index + 1,
            title: item || '未知设备',
            text: item || '未知设备',
            value: item || '',
            originalData: item
          }));
          console.log('设备编码去重完成，原始数量：', response.data.length, '去重后数量：', this.equipmentOptions.length);
          // 默认选中第一个设备
          if (this.equipmentOptions.length > 0) {
            this.weightForm.equipmentCode = this.equipmentOptions[0].value;
            this.equipmentIndex = 0;
          }
        } else {
          this.equipmentOptions = [];
        }
      } catch (error) {
        console.error('加载设备编码失败:', error);
        this.equipmentOptions = [];
        uni.showToast({ title: '加载设备列表失败', icon: 'none' });
      } finally {
        this.equipmentLoading = false;
      }
    },

    // 选择设备编码
    selectEquipment(index) {
      if (index >= 0 && index < this.equipmentOptions.length) {
        const item = this.equipmentOptions[index];
        this.weightForm.equipmentCode = item.value;
        this.equipmentIndex = index;
      }
    },

    // 加载盘具信息
    async loadDiskInfo() {
      try {
        const response = await getDiskInfoListAll({ status: 0 }); // 只获取启用的盘具
        if (response.code === 200 && response.data) {
          // 将盘具数据转换为选择器需要的格式
          const spoolOptions = response.data.map(item => ({
            text: `${item.diskModel || '未知型号'}-${item.diskDiameter || 0}mm`,
            value: `${item.diskModel || '未知型号'}-${item.diskDiameter || 0}mm`,
            // 保留原始数据用于后续处理
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
      }
    },



    // 搜索盘具信息
    handleSpoolSearch() {
      if (!this.spoolSearchText) {
        this.filteredSpoolOptions = [...this.spoolOptions]
        return
      }
      const searchText = this.spoolSearchText.toLowerCase().trim()
      this.filteredSpoolOptions = this.spoolOptions.filter(item => {
        return item.text.toLowerCase().includes(searchText)
      })
    },

    // 选择盘具
    selectSpool(item) {
      this.weightForm.spoolInfo = item.text;
      this.weightForm.spoolId = item.originalData.id;
      this.weightForm.spoolDiameter = item.originalData.diskDiameter;
      if (item.originalData.diskWeight) {
        this.weightForm.spoolWeight = item.originalData.diskWeight;
      } else {
        this.weightForm.spoolWeight = '';
      }
      this.closeSpoolCenterPopup()
    },

    // 提交称重报检
    async submitWeightInspection() {
      try {
        // 新增设备编码校验
        if (!this.weightForm.equipmentCode) {
          uni.showToast({ title: '请选择设备编码', icon: 'none' })
          return
        }
        if (!this.weightForm.spoolInfo) {
          uni.showToast({ title: '请选择盘具信息', icon: 'none' })
          return
        }
        if (!this.weightForm.finishedWeight) {
          uni.showToast({ title: '请输入完成毛重', icon: 'none' })
          return
        }
        if (isNaN(Number(this.weightForm.finishedWeight)) || Number(this.weightForm.finishedWeight) < 0) {
          uni.showToast({ title: '完成毛重必须为非负数字', icon: 'none' })
          return
        }
        // 是否余料字段校验
        if (!this.weightForm.isRemainMaterial) {
          uni.showToast({
            title: '请选择是否余料',
            icon: 'none'
          })
          return
        }

        this.submitting = true

        const params = {
          inspectionType: this.weightForm.inspectionType,
          spoolId: this.weightForm.spoolId,
          spoolName: this.weightForm.spoolInfo,
          spoolWeight: this.weightForm.spoolWeight,
          spoolDiameter: this.weightForm.spoolDiameter,
          finishedWeight: parseFloat((this.weightForm.finishedWeight - this.weightForm.spoolWeight).toFixed(2)),
          itemLength: this.weightForm.itemLength,
          isRemainMaterial: this.weightForm.isRemainMaterial,
          machineryTypeCode : this.weightForm.equipmentCode
        }
        const res = await submitWeightInspection(this.taskId, params)

        this.submitting = false

        if (res.code == 200) {
          this.isReported = true
          this.qcId = res.data || ''
          uni.showToast({
            title: '报检成功',
            icon: 'success'
          })
          // 通知父组件刷新数据
          this.$emit('inspection-success', res.data)
        } else {
          uni.showToast({
            title: res.msg || '报检失败',
            icon: 'none'
          })
        }
      } catch (error) {
        this.submitting = false
        
        console.error('报检失败:', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      }
    },



    // 加载打印机列表
    async loadPrinterList() {
      this.printerLoading = true;
      try {
        // 调用后端接口获取打印机列表
        const result = await getPrintConfigListAll();
        if (result.code === 200 && result.data) {
          this.printerList = result.data;
          // 默认选择第一个打印机
          if (this.printerList.length > 0) {
            this.selectedPrinter = this.printerList[0];
          }
        } else {
          this.printerList = [];
        }
      } catch (error) {
        console.error('加载打印机列表失败:', error);
        this.printerList = [];
        uni.showToast({
          title: '加载打印机列表失败',
          icon: 'none',
          duration: 2000
        });
      } finally {
        this.printerLoading = false;
      }
    },

    // 选择打印机
    selectPrinter(printer) {
      this.selectedPrinter = printer;
    },

    // 确认打印
    async confirmPrint() {
      if (!this.selectedPrinter) {
        uni.showToast({
          title: '请选择打印机',
          icon: 'none',
          duration: 1000
        });
        return;
      }

      uni.showLoading({
        title: '标签打印中...'
      });

      try {
        // 调用后端打印标签接口，传入选中的打印机ID
        const result = await printLabel(this.qcId, {
          printerId: this.selectedPrinter.id // 传递选中的打印机ID
        });

        uni.hideLoading();
        uni.showToast({
          title: result.msg || '标签打印成功',
          icon: 'success',
          duration: 2000
        });
        // 关闭打印机选择弹窗
        this.closePrinterModal();
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: '打印失败，请重试',
          icon: 'none',
          duration: 2000
        });
        console.error('打印失败:', error);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
/* 弹窗样式 */
.detail-container {
  background: #fff;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
}

.detail-container .full-screen {
  height: 100%;
  max-height: none;
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
  padding: 0 50rpx;
  max-height: none;
}

.detail-section {
  margin: 30rpx 0;
}

/* 表单项目样式 */
.form-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.form-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  width: 150rpx;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
}

.input-wrapper :deep(.u-input) {
  flex: 1;
}

/* 净重显示样式 */
.net-weight-display {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 0.5px solid #e8e8e8;
}

.net-weight-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* Choose 组件自定义选项样式 */
.custom-option {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  transition: all 0.3s;
}

.custom-option:hover {
  border-color: #2979FF;
  background-color: #f0f8ff;
}

/* 自定义选择器样式 */
.custom-select {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  border: 0.5px solid #e8e8e8;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  cursor: pointer;
  width: 100%;
}

.custom-select.active {
  border-color: #2979FF;
}

.custom-select.disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.select-value {
  flex: 1;
  text-align: left;
}

/* 设备编码选择器样式 */
.equipment-type-selector-pretty {
  flex: 1;
}

/* 报检类型选择器样式 */
.inspection-type-selector-pretty {
  flex: 1;
}

.pretty-radio-group-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pretty-radio-item-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 15rpx 25rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
  min-width: 130rpx;
  justify-content: center;
}

.pretty-radio-item-row.active {
  border-color: #2979FF;
  background-color: #f0f8ff;
}

.pretty-radio-item-row:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.equipment-type-badge,
.inspection-type-badge {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #2979FF;
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-content {
  display: flex;
  align-items: center;
}

.radio-label {
  font-size: 13px;
}

/* 空状态样式 */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.empty-text {
  font-size: 14px;
  color: #ec0505;
}

/* 自定义选择器弹窗样式 */
.custom-select-popup {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 0.5px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 5px;
}

.select-popup-content {
  max-height: 200px;
  padding: 5px 0;
}

.select-item {
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.select-item:hover {
  background-color: #f5f5f5;
}

.select-empty {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 13px;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
  margin-top: 30rpx;
}

.loading-text {
  font-size: 14px;
  color: #999;
  margin-top: 20rpx;
}

/* 操作按钮区域 */
.action-section {
  padding: 30rpx;
  margin-top: 20rpx;
}

.action-section.fixed-bottom {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;
  margin-top: 0;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  z-index: 10;
}

.button-group {
  display: flex;
  gap: 10rpx;
}

/* 盘具搜索区域 */
.spool-search-wrapper {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

/* 盘具列表区域 */
.spool-list-content {
  flex: 1;
  max-height: 550rpx;
  padding: 5px 0;
}

/* 打印机列表区域 */
.printer-list-content {
  flex: 1;
  max-height: 500rpx;
  padding: 5px 0;
}

/* 打印机列表样式 */
.printer-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 30rpx;
}

.printer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.printer-item.active {
  border-color: #2979FF;
  background-color: #f0f8ff;
}

.printer-name {
  font-size: 14px;
  color: #333;
  flex: 1;
  text-align: left;
}

/* 空状态样式 */
.empty-printers {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
}
</style>