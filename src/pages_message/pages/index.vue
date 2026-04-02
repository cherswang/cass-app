<template>
  <view class="message-container">
    <view class="message-list">
      <view v-if="loading" class="loading-container">
        <u-loading-icon size="30" color="#1890ff"></u-loading-icon>
        <text class="loading-text">加载中...</text>
      </view>
      
      <view v-else-if="messageList.length === 0" class="empty-container">
        <text class="empty-text">暂无消息</text>
      </view>
      
      <view v-else class="message-items">
        <view 
          v-for="item in messageList" 
          :key="item.smsId" 
          class="message-item" 
          @click="showMessageDetail(item)"
        >
          <view class="message-avatar">
            <u-avatar :size="48" :src="item.avatar || '/static/images/avatar/default.png'" mode="circle"></u-avatar>
            <view v-if="!item.isRead" class="unread-badge"></view>
          </view>
          
          <view class="message-content">
            <view class="message-title-row">
              <text class="message-item-title">{{ item.smsTitle }}</text>
              <text class="message-time">{{ item.smsSendTime }}</text>
            </view>
            <text class="message-description">{{ item.smsContent }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="fixed-actions">
      <u-button type="primary" @click="refreshMessages" class="fixed-btn refresh-btn">
        <text class="fixed-btn-text">刷新</text>
      </u-button>
      <u-button type="warning" @click="markAllRead" class="fixed-btn mark-read-btn">
        <text class="fixed-btn-text">全部已读</text>
      </u-button>
    </view>
  </view>
</template>

<script>
import API from '@/api'

export default {
  data() {
    return {
      messageList: [],
      loading: false
    }
  },
  onLoad() {
    this.getNoReadSms()
  },
  onShow() {
    this.getNoReadSms()
  },
  methods: {
    // 获取未读消息
    async getNoReadSms() {
      this.loading = true
      try {
        const res = await API.system.sms.getNoReadSms.get()
        console.log('API返回数据:', res)
        if (res.code === 200) {
          let data = res.data || []
          console.log('消息数据:', data)
          
          // 确保data是数组
          if (!Array.isArray(data)) {
            data = []
          }
          
          // 过滤无效数据
          data = data.filter(item => {
            return item && typeof item === 'object' && (item.smsTitle || item.smsContent)
          })
          
          // 为每条消息添加isRead字段，默认为false（未读）
          this.messageList = data.map(msg => ({
            ...msg,
            isRead: false
          }))
        } else {
          uni.showToast({ title: res.message || '获取消息失败', icon: 'none' })
        }
      } catch (error) {
        console.error('获取消息失败:', error)
        uni.showToast({ title: '获取消息失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    
    // 刷新消息
    refreshMessages() {
      this.getNoReadSms()
    },
    
    // 标记全部已读
    async markAllRead() {
      if (this.messageList.length === 0) {
        uni.showToast({ title: '暂无未读消息', icon: 'none' })
        return
      }
      
      const smsIdArr = this.messageList.map(item => item.smsId)
      
      try {
        const res = await API.system.sms.setReadStatusSmsByIds.post({ ids: smsIdArr })
        if (res.code === 200) {
          this.messageList = []
          uni.showToast({ title: '已全部标记为已读', icon: 'success' })
        } else {
          uni.showToast({ title: res.message || '标记失败', icon: 'none' })
        }
      } catch (error) {
        console.error('标记已读失败:', error)
        uni.showToast({ title: '标记已读失败', icon: 'none' })
      }
    },
    
    // 查看消息详情
    async showMessageDetail(item) {
      // 标记为已读
      const smsIdArr = [item.smsId]
      try {
        const res = await API.system.sms.setReadStatusSmsByIds.post({ ids: smsIdArr })
        if (res.code === 200) {
          // 更新消息的已读状态
          this.messageList = this.messageList.map(msg => {
            if (msg.smsId === item.smsId) {
              return { ...msg, isRead: true }
            }
            return msg
          })
        }
      } catch (error) {
        console.error('标记已读失败:', error)
      }
      
      // 根据消息类型处理跳转
      if (item.view === 'NEWS') {
        // 跳转到消息详情
        uni.navigateTo({
          url: `/pages_message/pages/detail/index?type=news&recordId=${item.recordId}`
        })
      } else if (item.view === 'NOTICE') {
        // 跳转到通知详情
        uni.navigateTo({
          url: `/pages_message/pages/detail/index?type=notice&recordId=${item.recordId}`
        })
      } else if (item.view === 'BPM_APPROVED' || item.view === 'BPM_CHANGE_USER' || item.view === 'DOC_APPROVED' || item.view === 'DOC_CHANGE_USER') {
        // 跳转到审批办理页面
        let params = item.recordId.split("#")
        uni.navigateTo({
          url: `/pages_approval/pages/handle/index?runId=${params[0]}&stepRunId=${params[1]}&flowId=${params[2]}`
        })
      } else if (item.view === 'BPM_CREATE' || item.view === 'BPM_JOIN' || item.view === 'DOC_CREATE' || item.view === 'DOC_JOIN') {
        // 跳转到查看页面
        uni.navigateTo({
          url: `/pages_approval/pages/detail/index?runId=${item.recordId}`
        })
      } else {
        // 其他类型的消息，跳转到通用详情页
        uni.navigateTo({
          url: `/pages_message/pages/detail/index?type=other&recordId=${item.recordId}&view=${item.view}`
        })
      }
    }
  }
}
</script>

<style scoped>
.message-container {
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
}

.fixed-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
  background-color: #ffffff;
  border-top: 1rpx solid #f0f0f0;
  z-index: 999;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.fixed-btn {
  flex: 1;
  padding: 16rpx;
  margin: 0 10rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
}

.fixed-btn:active {
  transform: scale(0.98);
}

.fixed-btn-text {
  font-size: 28rpx;
  font-weight: 500;
}

.refresh-btn {
  background-color: #1890ff;
  color: #ffffff;
}

.mark-read-btn {
  background-color: #faad14;
  color: #ffffff;
}

.message-list {
  flex: 1;
  padding: 16rpx 0 120rpx 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #999999;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 0;
}

.empty-text {
  margin-top: 30rpx;
  font-size: 28rpx;
  color: #999999;
}

.message-items {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.message-item {
  display: flex;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
  transition: all 0.2s ease;
}

.message-item:last-child {
  border-bottom: none;
}

.message-item:active {
  background-color: #f9f9f9;
}

.message-avatar {
  position: relative;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 16rpx;
  height: 16rpx;
  background-color: #ff4d4f;
  border-radius: 50%;
  border: 4rpx solid #ffffff;
  box-shadow: 0 1rpx 3rpx rgba(255, 77, 79, 0.4);
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12rpx;
}

.message-item-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 16rpx;
}

.message-time {
  font-size: 24rpx;
  color: #999999;
  flex-shrink: 0;
}

.message-description {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>