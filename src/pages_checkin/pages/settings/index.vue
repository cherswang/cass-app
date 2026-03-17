<template>
  <view class="settings-container">
    <view class="settings-header">
      <text class="settings-title">打卡设置</text>
    </view>
    <view class="settings-list">
      <view class="settings-item">
        <!-- <text class="item-label">打卡提醒</text>
        <view class="item-control">
          <switch v-model="reminderEnabled" @change="handleReminderChange" />
        </view> -->
      </view>
      <view class="settings-item" v-if="reminderEnabled">
        <text class="item-label">提醒时间</text>
        <view class="item-control">
          <picker mode="time" :value="reminderTime" @change="handleTimeChange">
            <text class="control-text">{{ reminderTime }}</text>
          </picker>
        </view>
      </view>
      <view class="settings-item">
        <text class="item-label">打卡范围</text>
        <view class="item-control">
          <text class="control-text">{{ radiusRange }}米</text>
        </view>
      </view>
      <view class="settings-item">
        <text class="item-label">自动打卡</text>
        <!-- <view class="item-control">
          <switch v-model="autoCheckin" @change="handleAutoCheckinChange" />
        </view> -->
      </view>
      <view class="settings-item">
        <text class="item-label">打卡地点</text>
        <view class="item-control">
          <text class="control-text">{{ locationName }}</text>
        </view>
      </view>
    </view>
    <view class="settings-footer">
      <button class="btn-save" @click="saveSettings">保存设置</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      reminderEnabled: true,
      reminderTime: '08:30',
      radiusRange: 100,
      autoCheckin: false,
      locationName: '公司总部'
    }
  },
  methods: {
    handleReminderChange(e) {
      this.reminderEnabled = e.detail.value
    },
    handleTimeChange(e) {
      this.reminderTime = e.detail.value
    },
    handleAutoCheckinChange(e) {
      this.autoCheckin = e.detail.value
    },
    saveSettings() {
      uni.showToast({
        title: '设置保存成功',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss">
.settings-container {
  padding: 15px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.settings-header {
  margin-bottom: 15px;
}

.settings-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.settings-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.settings-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 14px;
  color: #262626;
}

.item-control {
  display: flex;
  align-items: center;
}

.control-text {
  font-size: 14px;
  color: #999;
}

.settings-footer {
  margin-top: 20px;
}

.btn-save {
  width: 100%;
  height: 48px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}
</style>