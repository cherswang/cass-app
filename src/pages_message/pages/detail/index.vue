<template>
  <view class="message-detail-container">
    <view class="message-detail-header">
      <text class="message-detail-title">{{ message.smsTitle }}</text>
    </view>
    
    <view class="message-detail-content">
      <view class="message-info">
        <text class="message-sender">{{ message.smsFrom || '系统' }}</text>
        <text class="message-time">{{ message.smsSendTime }}</text>
      </view>
      
      <view class="message-body">
        <text class="message-content">{{ message.smsContent }}</text>
      </view>
      
      <view v-if="message.attachId" class="message-attachments">
        <text class="attachments-title">附件</text>
        <view class="attachments-list">
          <!-- 附件列表，这里可以根据实际情况实现 -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      message: {}
    }
  },
  onLoad(options) {
    if (options.message) {
      this.message = JSON.parse(decodeURIComponent(options.message))
    }
  }
}
</script>

<style scoped>
.message-detail-container {
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
}

.message-detail-header {
  padding: 16rpx 24rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;
}

.message-detail-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.message-detail-content {
  padding: 24rpx;
  background-color: #ffffff;
  margin-top: 16rpx;
}

.message-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.message-sender {
  font-size: 28rpx;
  color: #666666;
}

.message-time {
  font-size: 24rpx;
  color: #999999;
}

.message-body {
  margin-bottom: 24rpx;
}

.message-content {
  font-size: 30rpx;
  color: #333333;
  line-height: 1.6;
}

.message-attachments {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.attachments-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16rpx;
}

.attachments-list {
  /* 附件列表样式 */
}
</style>