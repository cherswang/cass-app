<template>
  <!-- 扫码上料组件 -->
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
        <text class="detail-title">扫码上料</text>
      </view>

      <!-- 内容区域 -->
      <scroll-view class="detail-content" scroll-y>
        <!-- 设备编码输入 -->
        <view class="detail-section">
          <view class="form-item">
            <text class="form-label">设备编码</text>
            <view class="input-wrapper">
              <up-input
                  v-model="equipmentCode"
                  placeholder="请输入设备编码"
                  placeholder-color="#999"
                  @confirm="addBatchCode"
                  :clearable="true"
                  :adjust-position="false"
              ></up-input>
            </view>
          </view>
        </view>

        <!-- 批次号输入 -->
        <view class="detail-section">
          <view class="form-item">
            <text class="form-label">批次号</text>
            <view class="input-wrapper">
              <up-input
                  v-model="currentBatchCode"
                  placeholder="请输入批次号"
                  placeholder-color="#999"
                  :clearable="true"
                  @confirm="addBatchCode"
                  ref="batchCodeInput"
                  focus
                  :adjust-position="false"
              ></up-input>
            </view>
          </view>
        </view>

        <!-- 批次号列表 -->
        <view v-if="batchList.length > 0" class="detail-section">
          <view class="batch-header">
            <view class="section-title">已扫物料 {{ batchList.length }} 卷</view>
            <view class="section-subtitle">净重合计：{{ totalNetWeight }} kg</view>
          </view>
          <view class="divider"></view>
          <view class="batch-list">
            <view v-for="(item, index) in batchList" :key="index" class="batch-item">
              <view class="batch-item-header">
                <text class="batch-index">{{ index + 1 }}</text>
                <text class="batch-code">{{ item.batchCode }}</text>
                <view class="status-container">
                    <up-tag :type="item.status === '已上料' ? 'success' : 'warning'" >
                        {{ item.status }}
                    </up-tag>
                    <!-- <up-button type="error" style="width: 90rpx;" size="mini" text="删除" @click="deleteBatchCode(index)"></up-button> -->
                </view>
            </view>
              <view v-if="item.materialInfo" class="material-info">
                <view class="material-grid">
                  <view class="material-grid-item">
                    <text class="material-grid-label">编码：</text>
                    <text class="material-grid-value">{{ item.materialInfo.itemCode }}</text>
                    <text class="material-grid-label">名称：</text>
                    <text class="material-grid-value">{{ item.materialInfo.itemName }}</text>
                  </view>
                  <view class="material-grid-item">
                    <text class="material-grid-label">规格：</text>
                    <text class="material-grid-value">{{ item.materialInfo.specification }}</text>
                    <text class="material-grid-label">净重：</text>
                    <text class="material-grid-value">{{ item.materialInfo.netWeight }} kg</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载状态 -->
        <view v-if="materialLoading" class="loading-container">
          <up-loading-icon mode="spinner" color="#2979FF"></up-loading-icon>
          <text class="loading-text">加载物料信息中...</text>
        </view>
      </scroll-view>

      <!-- 底部固定按钮 -->
      <view class="action-section fixed-bottom">
        <view class="button-group">
          <up-button 
              type="info" 
              text="取消" 
              @click="close"
              style="flex: 1;"
          ></up-button>
        </view>
      </view>
    </view>
  </up-popup>
  
  <!-- 自定义模态框 -->
  <up-popup ref="modalPopup" :show="showCustomModal" mode="center" border-radius="12rpx" :closeable="false">
    <view class="custom-modal">
      <view class="custom-modal-header">
        <text class="custom-modal-title">{{ modalTitle }}</text>
      </view>
      <view class="custom-modal-content">
        <text class="custom-modal-text">{{ modalContent }}</text>
      </view>
      <view class="custom-modal-footer">
        <up-button type="primary" text="确定" @click="closeCustomModal" style="width: 100%;"></up-button>
      </view>
    </view>
  </up-popup>
  
  <!-- 规格变更确认模态框 -->
  <up-popup ref="specChangePopup" :show="showSpecChangeModal" mode="center" border-radius="12rpx" :closeable="false">
    <view class="custom-modal">
      <view class="custom-modal-header">
        <text class="custom-modal-title">规格不一致</text>
      </view>
      <view class="custom-modal-content">
        <text class="custom-modal-text">领料要求规格：{{ requireSpec }}\n实际上料规格：{{ actualSpec }}\n\n是否提交申请更改领料要求规格？</text>
      </view>
      <view class="custom-modal-footer">
        <view style="display: flex; gap: 10rpx; width: 100%;">
          <up-button type="info" text="取消" @click="closeSpecChangeModal" style="flex: 1;"></up-button>
          <up-button type="primary" text="确定" @click="confirmSpecChange" style="flex: 1;"></up-button>
        </view>
      </view>
    </view>
  </up-popup>
</template>

<script>
import {getInfoByBatchCode} from '@/api/wms/materialStock'
import {submitMaterialIssueByStockId} from '@/api/pro/taskIssue'
import {addMaterialSpecChangeApply} from '@/api/pro/materialSpecChangeApply'
import {getUserProfile} from '@/api/system/user'

export default {
  name: 'MaterialPick',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String,
      required: true
    },
    taskDetail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 设备编码
      equipmentCode: '',
      // 批次号相关
      currentBatchCode: '',
      batchList: [],
      materialLoading: false,
      // 用户信息
      user: {},
      // 自定义模态框
      showCustomModal: false,
      modalTitle: '',
      modalContent: '',
      // 规格变更确认
      showSpecChangeModal: false,
      requireSpec: '',
      actualSpec: ''
    }
  },
  computed: {
    // 计算净重合计
    totalNetWeight() {
      return this.batchList.reduce((total, item) => {
        if (item.materialInfo && item.materialInfo.netWeight) {
          return total + parseFloat(item.materialInfo.netWeight) || 0
        }
        return total
      }, 0).toFixed(2)
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    // 关闭弹窗
    close() {
      this.resetMaterialForm()
      this.$emit('close')
    },
    
    // 关闭扫码上料表单
    resetMaterialForm() {
      this.equipmentCode = ''
      this.currentBatchCode = ''
      this.batchList = []
      this.materialLoading = false
      this.$nextTick(() => {
        if (this.$refs.batchCodeInput && typeof this.$refs.batchCodeInput.focus === 'function') {
          this.$refs.batchCodeInput.focus()
        }
      })
    },
    
    // 显示自定义模态框
    openCustomModal(title, content) {
      this.modalTitle = title
      this.modalContent = content
      this.showCustomModal = true
    },
    
    // 关闭自定义模态框
    closeCustomModal() {
      this.showCustomModal = false
    },
    
    // 获取用户信息
    async getUser() {
      try {
        const response = await getUserProfile()
        if (response.code === 200) {
          const data = response.data
          this.user = data.user
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },
    
    // 添加批次号
    async addBatchCode() {
      if (!this.currentBatchCode || this.currentBatchCode.length < 5) {
        this.openCustomModal('提示', '请输入有效的批次号')
        return
      }
      
      // 检查是否已添加过该批次号
      if (this.batchList.some(item => item.batchCode === this.currentBatchCode)) {
        this.openCustomModal('提示', '该物料已在当前任务中投料')
        return
      }
      
      if (!this.equipmentCode) {
        this.openCustomModal('提示', '请先输入设备编码')
        return
      }
      
      this.materialLoading = true
      try {
        const res = await getInfoByBatchCode(this.currentBatchCode)
        if (res.code === 200) {
          const data = res.data
          if (!data) {
            this.openCustomModal('提示', '未获取到物料信息')
            return
          } else {
            if (data.warehouseCode === 'XBK_VIRTUAL' || data.warehouseCode === 'YLK_VIRTUAL') {
              console.log('满足上料仓库，继续其他处理！')
            } else {
              this.openCustomModal('提示', '请先从仓库领料再上料\n\n操作步骤：\n\n1.点击仓库领料进行扫码并申请领料。\n\n2.等待组长或仓库管理员执行领出。')
              return
            }
            
            // 检查规格是否一致
            if (this.taskDetail.materialRequireSpec) {
              if (this.taskDetail.materialRequireSpec !== data.specification) {
                console.info('领料要求规格和上料规格不一致！')
                this.showSpecChangeConfirm(this.taskDetail.materialRequireSpec, data.specification)
                return
              } else {
                console.log('领料要求规格和上料规格一致！')
              }
            } else {
              console.log('工序中未规定领料要求规格，不做校验！')
            }
            
            // 自动确认上料
            const params = {
              taskId: this.taskId,
              stockId: data.materialStockId,
              equipmentCode: this.equipmentCode,
              userId: this.user.userId
            }
            try {
              const submitRes = await submitMaterialIssueByStockId(params)
              if (submitRes.code === 200) {
                // 添加到批次号列表（已上料状态）
                this.batchList.push({
                  batchCode: this.currentBatchCode,
                  materialInfo: data,
                  status: '已上料',
                  statusColor: '#07c160'
                })
                this.currentBatchCode = ''
                this.$nextTick(() => {
                  if (this.$refs.batchCodeInput && typeof this.$refs.batchCodeInput.focus === 'function') {
                    this.$refs.batchCodeInput.focus()
                  }
                })
                this.$emit('materialPicked')
              } else {
                // 添加到批次号列表（未上料状态）
                this.batchList.push({
                  batchCode: this.currentBatchCode,
                  materialInfo: data,
                  status: '未上料',
                  statusColor: '#faad14'
                })
                this.currentBatchCode = ''
                this.$nextTick(() => {
                  if (this.$refs.batchCodeInput && typeof this.$refs.batchCodeInput.focus === 'function') {
                    this.$refs.batchCodeInput.focus()
                  }
                })
                this.openCustomModal('提示', '上料失败：' + submitRes.msg)
              }
            } catch (error) {
                this.openCustomModal('提示', error.msg || '获取物料信息失败')
            }
          }
        }
      } catch (error) {
        console.error('获取物料信息失败:', error)
        this.openCustomModal('提示', '网络错误，请重试')
      } finally {
        this.materialLoading = false
      }
    },
    
    // 删除批次号
    deleteBatchCode(index) {
      this.batchList.splice(index, 1)
    },
    
    // 显示规格变更确认
    showSpecChangeConfirm(requireSpec, actualSpec) {
      this.requireSpec = requireSpec
      this.actualSpec = actualSpec
      this.showSpecChangeModal = true
    },
    
    // 关闭规格变更确认模态框
    closeSpecChangeModal() {
      this.showSpecChangeModal = false
    },
    
    // 确认规格变更
    async confirmSpecChange() {
      this.showSpecChangeModal = false
      // 插入领料要求规格的申请表信息
      const data = {
        taskId: this.taskId,
        originalSpec: this.requireSpec,
        newSpec: this.actualSpec,
        applyUserId: this.user.userId,
        applyUserName: this.user.nickName,
        applyTime: new Date(),
      }
      try {
        await addMaterialSpecChangeApply(data)
        this.openCustomModal('提示', '申请提交成功')
      } catch (error) {
        console.error('提交申请失败:', error)
        this.openCustomModal('提示', '申请提交失败')
      }
    },
    

  }
}
</script>

<style lang="scss" scoped>
/* 弹窗样式 */
.detail-container {
  background: #fff;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  z-index: 1000;
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
  padding: 0 30rpx;
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
  color: #666666;
  font-weight: 500;
  width: 100rpx;
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

/* 批次号列表样式 */
.batch-list {
  margin-top: 10rpx;
  border-radius: 8rpx;
  padding: 5rpx;
  max-height: 950rpx;
  overflow-y: auto;
}

.batch-list::-webkit-scrollbar {
  width: 4rpx;
}

.batch-list::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 2rpx;
}

.batch-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.batch-item:hover {
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
}

.batch-item-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.batch-index {
  font-size: 12px;
  color: #666;
  margin-right: 12rpx;
  min-width: 30rpx;
  background-color: #f0f8ff;
  border-radius: 4rpx;
  padding: 4rpx 8rpx;
  text-align: center;
  color: #2979FF;
  font-weight: 500;
}

.batch-code {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 物料信息样式 */
.material-info {
  margin-top: 12rpx;
  background-color: transparent;
  padding: 0;
}

.material-grid {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.material-grid-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.material-grid-label {
  font-size: 14px;
  color: #666666;
  font-weight: 500;
  min-width: 80rpx;
  flex-shrink: 0;
}

.material-grid-value {
  font-size: 14px;
  color: #333333;
  flex: 1;
  word-break: break-all;
  line-height: 1.3;
}

/* 批次号列表头部 */
.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
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

.section-subtitle {
  font-size: 14px;
  color: #666666;
  font-weight: 500;
}

.divider {
  height: 1rpx;
  background-color: #f0f0f0;
  margin-bottom: 16rpx;
}

/* 状态容器样式 */
.status-container {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

/* 自定义模态框样式 */
.custom-modal {
  width: 480rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
}

.custom-modal-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
}

.custom-modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.custom-modal-content {
  padding: 40rpx 30rpx;
  min-height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-modal-text {
  font-size: 14px;
  color: #666;
  line-height: 24rpx;
  text-align: center;
}

.custom-modal-footer {
  padding: 0 30rpx 30rpx;
}

</style>