<template>
  <up-popup
      :show="showDetailPopup"
      mode="bottom"
      :round="16"
      :closeable="true"
      :safe-area-inset-bottom="true"
      @close="closeDetail"
  >
    <view class="detail-container">
      <!-- 头部 -->
      <view class="detail-header">
        <view class="header-main">
          <up-text
              class="detail-title"
              :text="currentDetail.processName || '-'"
              bold
              size="20"
          ></up-text>
          <up-text
              class="detail-subtitle"
              :text="`${currentDetail.productName || ''} ${currentDetail.productSpec || ''}`"
              type="info"
              size="13"
          ></up-text>
        </view>
      </view>

      <!-- 设备选择 -->
      <view class="device-section">
        <view class="device-header">
          <up-text text="选择设备" bold size="16" class="device-title"></up-text>
          <up-choose
              v-model="selectedDeviceId"
              :options="deviceOptions"
              item-width="140rpx"
              item-height="70rpx"
              @change="handleDeviceChange"
          ></up-choose>
        </view>
      </view>

      <!-- 内容区域 -->
      <scroll-view class="detail-content" scroll-y :show-scrollbar="false">
        <!-- 任务概览 -->
        <view class="section-card">
          <view class="card-header">
            <up-text text="任务概览" bold size="16" class="card-title"></up-text>
            <up-text
                :text="`任务编号: ${currentDetail.taskCode || '-'}`"
                type="info"
                size="12"
            ></up-text>
          </view>

          <view class="stats-grid">
            <!-- 计划数量 -->
            <view class="stat-item">
              <up-text text="计划数量" type="info" size="12" class="stat-label"></up-text>
              <up-text
                  :text="`${currentDetail.plannedQuantity || 0}`"
                  bold
                  size="20"
                  class="stat-value"
              ></up-text>
              <up-text
                  :text="currentDetail.unit || '件'"
                  type="info"
                  size="12"
                  class="stat-unit"
              ></up-text>
            </view>

            <!-- 已完成 -->
            <view class="stat-item">
              <up-text text="已完成" type="info" size="12" class="stat-label"></up-text>
              <up-text
                  :text="`${currentDetail.completedQuantity || 0}`"
                  bold
                  size="20"
                  class="stat-value"
                  color="#19be6b"
              ></up-text>
              <up-text
                  :text="currentDetail.unit || '件'"
                  type="info"
                  size="12"
                  class="stat-unit"
              ></up-text>
            </view>

            <!-- 进度 -->
            <view class="stat-item progress-item">
              <up-text text="完成进度" type="info" size="12" class="stat-label"></up-text>
              <up-line-progress
                  :percent="progressPercent"
                  :show-info="true"
                  stroke-width="10"
                  :stroke-height="6"
                  active-color="#19be6b"
                  inactive-color="#f0f0f0"
                  :border-radius="3"
                  class="progress-bar"
              ></up-line-progress>
              <up-text
                  :text="`${progressPercent}%`"
                  bold
                  size="16"
                  class="progress-percent"
              ></up-text>
            </view>
          </view>

          <!-- 负责人信息 -->
          <view class="team-info">
            <view class="info-row">
              <up-text text="负责班组" type="info" size="13"></up-text>
              <up-text
                  :text="currentDetail.teamName || '未分配'"
                  bold
                  size="13"
                  color="#2979ff"
              ></up-text>
            </view>
            <view class="info-row">
              <up-text text="操作人员" type="info" size="13"></up-text>
              <up-text
                  :text="currentDetail.operatorNames || currentDetail.operatorName || '未指定'"
                  bold
                  size="13"
                  color="#f9ae3d"
              ></up-text>
            </view>
            <view class="info-row" v-if="currentDetail.createTime">
              <up-text text="创建时间" type="info" size="13"></up-text>
              <up-text
                  :text="currentDetail.createTime"
                  size="13"
                  color="#606266"
              ></up-text>
            </view>
          </view>
        </view>

        <!-- 设备状态 -->
        <view class="section-card" v-if="selectedDevice">
          <view class="card-header">
            <up-text text="设备状态" bold size="16" class="card-title"></up-text>
            <up-text
                :text="`编号: ${selectedDevice.code || '-'}`"
                type="info"
                size="12"
            ></up-text>
          </view>

          <view class="status-cards">
            <!-- 上料状态 -->
            <view class="status-card feeding-card">
              <view class="status-header">
                <up-icon name="plus-circle" color="#2979ff" size="18"></up-icon>
                <up-text text="上料状态" size="14" bold></up-text>
              </view>
              <view class="status-content">
                <view class="data-item">
                  <up-text text="卷数" type="info" size="12"></up-text>
                  <up-text
                      :text="`${feedingInfo.loadedRolls} 卷`"
                      bold
                      size="16"
                      class="data-value"
                  ></up-text>
                </view>
                <view class="data-item">
                  <up-text text="重量" type="info" size="12"></up-text>
                  <up-text
                      :text="`${feedingInfo.loadedWeight} kg`"
                      bold
                      size="16"
                      color="#f9ae3d"
                      class="data-value"
                  ></up-text>
                </view>
              </view>
              <view class="status-footer">
                <up-text
                    :text="`剩余 ${feedingInfo.remainingWeight}kg`"
                    type="success"
                    size="12"
                ></up-text>
                <up-text
                    :text="`最后上料: ${formatTime(feedingInfo.lastFeedTime)}`"
                    type="info"
                    size="11"
                ></up-text>
              </view>
            </view>

            <!-- 下机状态 -->
            <view class="status-card inspection-card">
              <view class="status-header">
                <up-icon name="download" color="#19be6b" size="18"></up-icon>
                <up-text text="下机状态" size="14" bold></up-text>
              </view>
              <view class="status-content">
                <view class="data-item">
                  <up-text text="卷数" type="info" size="12"></up-text>
                  <up-text
                      :text="`${inspectionInfo.unloadedRolls} 卷`"
                      bold
                      size="16"
                      class="data-value"
                  ></up-text>
                </view>
                <view class="data-item">
                  <up-text text="重量" type="info" size="12"></up-text>
                  <up-text
                      :text="`${inspectionInfo.unloadedWeight} kg`"
                      bold
                      size="16"
                      color="#f9ae3d"
                      class="data-value"
                  ></up-text>
                </view>
              </view>
              <view class="quality-stats">
                <view class="quality-item">
                  <up-text text="良品" type="info" size="12"></up-text>
                  <up-tag
                      :text="`${inspectionInfo.qualifiedRolls}`"
                      type="success"
                      size="mini"
                      shape="circle"
                  ></up-tag>
                </view>
                <view class="quality-item">
                  <up-text text="不良品" type="info" size="12"></up-text>
                  <up-tag
                      :text="`${inspectionInfo.unqualifiedRolls}`"
                      type="error"
                      size="mini"
                      shape="circle"
                  ></up-tag>
                </view>
              </view>
              <view class="status-footer">
                <up-text
                    :text="`最后报检: ${formatTime(inspectionInfo.lastInspectTime)}`"
                    type="info"
                    size="11"
                ></up-text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 操作按钮 -->
      <view class="action-section">
        <view class="button-grid">
          <up-button
              v-if="showStartButton"
              type="primary"
              size="medium"
              @click="handleStartWork"
              :disabled="!selectedDevice"
              :custom-style="{
                background: 'linear-gradient(135deg, #2979ff, #5cadff)',
                border: 'none',
                borderRadius: '8rpx',
                height: '80rpx'
              }"
              icon="play-circle"
              icon-color="#fff"
              class="action-btn"
          >
            开工
          </up-button>

          <up-button
              v-if="showFeedButton"
              type="warning"
              size="medium"
              @click="handleFeedMaterial"
              :disabled="!selectedDevice"
              :custom-style="{
                background: 'linear-gradient(135deg, #f9ae3d, #ffc870)',
                border: 'none',
                borderRadius: '8rpx',
                height: '80rpx'
              }"
              icon="plus-circle"
              icon-color="#fff"
              class="action-btn"
          >
            上料
          </up-button>

          <up-button
              v-if="showPauseButton"
              :type="isPaused ? 'success' : 'warning'"
              size="medium"
              @click="handlePause"
              :disabled="!selectedDevice"
              :custom-style="{
                background: isPaused
                  ? 'linear-gradient(135deg, #19be6b, #39d17c)'
                  : 'linear-gradient(135deg, #f9ae3d, #ffc870)',
                border: 'none',
                borderRadius: '8rpx',
                height: '80rpx'
              }"
              :icon="isPaused ? 'play-circle' : 'pause-circle'"
              icon-color="#fff"
              class="action-btn"
          >
            {{ isPaused ? '继续' : '暂停' }}
          </up-button>

          <up-button
              v-if="showInspectButton"
              type="success"
              size="medium"
              @click="handleInspect"
              :disabled="!selectedDevice"
              :custom-style="{
                background: 'linear-gradient(135deg, #19be6b, #39d17c)',
                border: 'none',
                borderRadius: '8rpx',
                height: '80rpx'
              }"
              icon="checkmark-circle-filled"
              icon-color="#fff"
              class="action-btn"
          >
            报检
          </up-button>

          <up-button
              v-if="showBatchOffMachineButton"
              type="error"
              size="medium"
              @click="handleBatchOffMachine"
              :disabled="!selectedDevice"
              :custom-style="{
                background: 'linear-gradient(135deg, #fa3534, #ff6b6b)',
                border: 'none',
                borderRadius: '8rpx',
                height: '80rpx'
              }"
              icon="download"
              icon-color="#fff"
              class="action-btn"
          >
            下机
          </up-button>

          <up-button
              v-if="showCompleteButton"
              type="primary"
              size="medium"
              @click="handleComplete"
              :disabled="!selectedDevice"
              :custom-style="{
                background: 'linear-gradient(135deg, #2979ff, #5cadff)',
                border: 'none',
                borderRadius: '8rpx',
                height: '80rpx'
              }"
              icon="checkmark-circle"
              icon-color="#fff"
              class="action-btn"
          >
            完工
          </up-button>

          <up-button
              type="info"
              size="medium"
              @click="showWorkRecords"
              :disabled="!selectedDevice"
              :custom-style="{
                background: 'linear-gradient(135deg, #909399, #b0b4bb)',
                border: 'none',
                borderRadius: '8rpx',
                height: '80rpx'
              }"
              icon="list-dot"
              icon-color="#fff"
              class="action-btn"
          >
            记录
          </up-button>
        </view>
      </view>
    </view>
  </up-popup>
</template>

<script>
export default {
  name: "TaskDetailPopup",
  props: {
    showDetailPopup: {
      type: Boolean,
      default: false
    },
    currentDetail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      deviceList: [],
      selectedDeviceId: null,
      deviceOptions: [],

      feedingInfo: {
        loadedRolls: 5,
        loadedWeight: 333,
        remainingWeight: 1222,
        lastFeedTime: '2024-01-24 10:30'
      },

      inspectionInfo: {
        unloadedRolls: 2,
        unloadedWeight: 150,
        qualifiedRolls: 1,
        unqualifiedRolls: 1,
        lastInspectTime: '2024-01-0 11:00'
      },

      isPaused: false,
      currentStatus: 'pending',
    }
  },
  computed: {
    selectedDevice() {
      if (this.deviceList.length === 0 || !this.selectedDeviceId) {
        return null
      }
      return this.deviceList.find(device => device.id === this.selectedDeviceId) || null
    },

    progressPercent() {
      const planned = this.currentDetail.plannedQuantity || 0
      const completed = this.currentDetail.completedQuantity || 0
      if (planned === 0) return 0
      return Math.min(Math.round((completed / planned) * 100), 100)
    },

    showStartButton() {
      return this.currentStatus === 'pending'
    },

    showFeedButton() {
      return ['working', 'paused'].includes(this.currentStatus)
    },

    showInspectButton() {
      return ['working', 'paused'].includes(this.currentStatus)
    },

    showPauseButton() {
      return this.currentStatus === 'working' || this.currentStatus === 'paused'
    },

    showCompleteButton() {
      return ['working', 'paused'].includes(this.currentStatus)
    },

    showBatchOffMachineButton() {
      return ['working', 'paused'].includes(this.currentStatus) &&
          (this.feedingInfo.loadedRolls > 0)
    }
  },
  watch: {
    showDetailPopup(newVal) {
      if (newVal) {
        this.initDeviceData()
      }
    },
    currentDetail: {
      handler(newVal) {
        if (newVal && this.showDetailPopup) {
          this.initDeviceData()
        }
      },
      deep: true
    }
  },
  methods: {
    closeDetail() {
      this.$emit('close')
      this.resetData()
    },

    getStatusType(status) {
      const statusMap = {
        pending: 'warning',
        working: 'success',
        paused: 'info',
        completed: 'primary',
        error: 'error'
      }
      return statusMap[status] || 'info'
    },

    getDeviceStatusText(status) {
      const statusMap = {
        idle: '空闲',
        working: '工作中',
        maintenance: '维修中',
        error: '故障'
      }
      return statusMap[status] || '未知'
    },

    getDeviceStatusColor(status) {
      const colorMap = {
        idle: 'success',
        working: 'warning',
        maintenance: 'info',
        error: 'error'
      }
      return colorMap[status] || 'info'
    },

    getPriorityType(priority) {
      if (priority <= 1) return 'error'
      if (priority === 2) return 'warning'
      return 'info'
    },

    initDeviceData() {
      this.deviceList = [
        { id: 1, code: 'A01', name: '挤出机A线', status: 'idle' },
        { id: 2, code: 'B02', name: '挤出机B线', status: 'working' },
        { id: 3, code: 'C03', name: '挤出机C线', status: 'idle' }
      ]

      this.deviceOptions = this.deviceList.map(device => ({
        title: device.code,
        id: device.id,
        disabled: device.status === 'working'
      }))

      const availableDevice = this.deviceList.find(device => device.status === 'idle') || this.deviceList[0]
      if (availableDevice) {
        this.selectedDeviceId = availableDevice.id
        this.loadDeviceInfo(availableDevice.id)
      }
    },

    handleDeviceChange(value) {
      this.selectedDeviceId = value
      this.loadDeviceInfo(value)
    },

    loadDeviceInfo(deviceId) {
      const deviceData = {
        1: {
          feedingInfo: { loadedRolls: 5, loadedWeight: 333, remainingWeight: 1222, lastFeedTime: '2024-01-24 10:30' },
          inspectionInfo: { unloadedRolls: 2, unloadedWeight: 150, qualifiedRolls: 1, unqualifiedRolls: 1, lastInspectTime: '2024-01-24 11:00' },
        },
        2: {
          feedingInfo: { loadedRolls: 8, loadedWeight: 500, remainingWeight: 1000, lastFeedTime: '2024-01-24 11:30' },
          inspectionInfo: { unloadedRolls: 5, unloadedWeight: 300, qualifiedRolls: 4, unqualifiedRolls: 1, lastInspectTime: '2024-01-24 12:00' },
        },
        3: {
          feedingInfo: { loadedRolls: 3, loadedWeight: 200, remainingWeight: 1500, lastFeedTime: '2024-01-24 09:45' },
          inspectionInfo: { unloadedRolls: 1, unloadedWeight: 80, qualifiedRolls: 1, unqualifiedRolls: 0, lastInspectTime: '2024-01-24 10:15' },
        }
      }

      if (deviceData[deviceId]) {
        this.feedingInfo = deviceData[deviceId].feedingInfo
        this.inspectionInfo = deviceData[deviceId].inspectionInfo
      }
    },

    handleStartWork() {
      if (!this.selectedDevice) {
        uni.$u.toast('请先选择设备')
        return
      }

      uni.showModal({
        title: '确认开工',
        content: `确定要在设备【${this.selectedDevice.code}】上开始生产吗？`,
        success: (res) => {
          if (res.confirm) {
            this.currentStatus = 'working'
            this.updateDeviceStatus(this.selectedDeviceId, 'working')

            this.$emit('operation', {
              type: 'start',
              deviceId: this.selectedDeviceId,
              deviceCode: this.selectedDevice.code,
              taskId: this.currentDetail.id
            })
            uni.$u.toast('开工成功')
          }
        }
      })
    },

    handleFeedMaterial() {
      if (!this.selectedDevice) {
        uni.$u.toast('请先选择设备')
        return
      }
      this.$emit('show-feed-popup')
    },

    handleBatchOffMachine() {
      if (!this.selectedDevice) {
        uni.$u.toast('请先选择设备')
        return
      }
      this.$emit('show-batch-off-machine-popup')
    },

    handleInspect() {
      if (!this.selectedDevice) {
        uni.$u.toast('请先选择设备')
        return
      }

      uni.showModal({
        title: '报检',
        content: '确定要提交报检申请吗？',
        success: (res) => {
          if (res.confirm) {
            this.$emit('operation', {
              type: 'inspect',
              deviceId: this.selectedDeviceId,
              deviceCode: this.selectedDevice.code,
              taskId: this.currentDetail.id
            })
            uni.$u.toast('报检成功')
          }
        }
      })
    },

    handlePause() {
      if (!this.selectedDevice) {
        uni.$u.toast('请先选择设备')
        return
      }

      const action = this.isPaused ? '继续生产' : '暂停生产'
      uni.showModal({
        title: action,
        content: `确定要${action}吗？`,
        success: (res) => {
          if (res.confirm) {
            this.isPaused = !this.isPaused
            this.currentStatus = this.isPaused ? 'paused' : 'working'
            this.updateDeviceStatus(this.selectedDeviceId, this.isPaused ? 'idle' : 'working')

            this.$emit('operation', {
              type: this.isPaused ? 'pause' : 'resume',
              deviceId: this.selectedDeviceId,
              deviceCode: this.selectedDevice.code,
              taskId: this.currentDetail.id
            })

            uni.$u.toast(`${action}成功`)
          }
        }
      })
    },

    handleComplete() {
      if (!this.selectedDevice) {
        uni.$u.toast('请先选择设备')
        return
      }

      uni.showModal({
        title: '确认完工',
        content: '确定要完成当前生产任务吗？',
        success: (res) => {
          if (res.confirm) {
            this.currentStatus = 'completed'
            this.updateDeviceStatus(this.selectedDeviceId, 'idle')
            this.$emit('operation', {
              type: 'complete',
              deviceId: this.selectedDeviceId,
              deviceCode: this.selectedDevice.code,
              taskId: this.currentDetail.id
            })
            uni.$u.toast('完工成功')
          }
        }
      })
    },

    showWorkRecords() {
      if (!this.selectedDevice) {
        uni.$u.toast('请先选择设备')
        return
      }
      this.$emit('show-records-popup')
    },

    formatTime(time) {
      if (!time) return '-'
      if (typeof time === 'string') {
        const date = new Date(time)
        if (isNaN(date.getTime())) return time
        return date.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      return time.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    updateDeviceStatus(deviceId, status) {
      const device = this.deviceList.find(d => d.id === deviceId)
      if (device) {
        device.status = status
      }
    },

    resetData() {
      this.deviceList = []
      this.deviceOptions = []
      this.selectedDeviceId = null
      this.isPaused = false
      this.currentStatus = 'pending'

      this.feedingInfo = {
        loadedRolls: 5,
        loadedWeight: 333,
        remainingWeight: 1222,
        lastFeedTime: '2024-01-24 10:30'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.detail-container {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
}

/* 头部 */
.detail-header {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  padding: 32rpx 40rpx 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  .header-main {
    flex: 1;
  }
}

/* 设备选择 */
.device-section {
  background: #ffffff;
  padding: 24rpx 40rpx;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8rpx;

  .device-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  .device-title {
    white-space: nowrap;
  }
}

/* 内容区域 */
.detail-content {
  flex: 1;
  padding: 24rpx 40rpx 0;
  overflow-y: auto;
}

/* 卡片 */
.section-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:active {
    transform: translateY(-2rpx);
    box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    padding-bottom: 16rpx;
    border-bottom: 1px solid #f0f0f0;
  }

  .card-title {
    color: #1a1a1a;
    position: relative;
    padding-left: 16rpx;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4rpx;
      height: 20rpx;
      background: linear-gradient(180deg, #2979ff, #5cadff);
      border-radius: 2rpx;
    }
  }
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 20rpx;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 12rpx;
    border-radius: 12rpx;
    background: #f8f9fa;
    position: relative;
    overflow: hidden;

    &.progress-item {
      grid-column: span 3;
      padding: 20rpx;
    }

    .stat-icon {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20rpx;
      margin-bottom: 12rpx;
    }

    .stat-label {
      margin-bottom: 8rpx;
      color: #606266;
    }

    .stat-value {
      margin: 4rpx 0;
    }

    .stat-unit {
      color: #909399;
    }

    .progress-bar {
      width: 100%;
      margin-top: 8rpx;
    }

    .progress-percent {
      margin-top: 8rpx;
      color: #19be6b;
    }
  }
}

/* 负责人信息 */
.team-info {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 16rpx;

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8rpx 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    &:last-child {
      border-bottom: none;
    }
  }
}

/* 状态卡片 */
.status-cards {
  display: flex;
  gap: 20rpx;
  margin-top: 16rpx;

  .status-card {
    flex: 1;
    border-radius: 12rpx;
    padding: 20rpx;
    position: relative;
    overflow: hidden;
    min-height: 180rpx;

    &.feeding-card {
      background: linear-gradient(135deg, #f0f8ff, #e6f7ff);
      border: 1px solid rgba(41, 121, 255, 0.1);
    }

    &.inspection-card {
      background: linear-gradient(135deg, #f6ffed, #f0f9eb);
      border: 1px solid rgba(25, 190, 107, 0.1);
    }

    .status-header {
      display: flex;
      align-items: center;
      gap: 8rpx;
      margin-bottom: 16rpx;
      color: #1a1a1a;
    }

    .status-content {
      display: flex;
      gap: 20rpx;
      margin-bottom: 16rpx;

      .data-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;

        .data-value {
          margin-top: 8rpx;
        }
      }
    }

    .quality-stats {
      display: flex;
      gap: 20rpx;
      margin-bottom: 12rpx;

      .quality-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
      }
    }

    .status-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12rpx;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }
  }
}

/* 生产信息 */
.production-info {
  margin-top: 12rpx;

  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx 8rpx;
    background: #f8f9fa;
    border-radius: 8rpx;
  }
}

/* 操作按钮 */
.action-section {
  background: #ffffff;
  padding: 24rpx 40rpx 40rpx;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;

  .action-btn {
    margin: 0;
    border: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.98);
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.6;
      transform: none !important;
    }
  }
}

/* 响应式 */
@media (max-width: 375px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;

    .stat-item.progress-item {
      grid-column: span 2;
    }
  }

  .button-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail-header {
    padding: 24rpx 32rpx 20rpx;
  }

  .device-section,
  .detail-content {
    padding-left: 32rpx;
    padding-right: 32rpx;
  }

  .section-card {
    padding: 20rpx;
  }

  .device-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12rpx;
  }

  .device-choose {
    width: 100%;
  }
}

@media (max-width: 320px) {
  .stats-grid {
    grid-template-columns: 1fr;

    .stat-item.progress-item {
      grid-column: span 1;
    }
  }

  .button-grid {
    grid-template-columns: 1fr;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4rpx;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4rpx;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>