<template>
  <view class="container">
    <view class="header">
      <text class="title">消息通知</text>
    </view>
    <scroll-view class="content" scroll-y="true">
      <view v-if="messages.length === 0" class="empty-state">
        <text class="empty-text">暂无消息</text>
      </view>
      <view class="message-item" v-for="item in messages" :key="item.id" @click="showDetail(item)">
        <view class="message-content">
          <text class="message-title">{{ item.title || '消息通知' }}</text>
          <text class="message-time">{{ item.createTime || '' }}</text>
        </view>
        <view class="message-desc">{{ item.content || item.msgContent || '' }}</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import API from '@/api/index'

export default {
  data() {
    return {
      messages: [],
      page: 1,
      pageSize: 10,
      loading: false,
      hasMore: true
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      if (this.loading) return
      
      this.loading = true
      try {
        const res = await API.system.sms.getMySmsList.get({ page: this.page, pageSize: this.pageSize })
        console.log('API返回数据:', res)
        if (res.code === 200) {
          let data = res.data || []
          console.log('消息数据:', data)
          
          // 过滤无效数据
          data = data.filter(item => {
            return item && typeof item === 'object' && (item.title || item.content || item.msgContent)
          })
          
          if (this.page === 1) {
            this.messages = data
          } else {
            this.messages = [...this.messages, ...data]
          }
          this.hasMore = data.length === this.pageSize
        } else {
          uni.showToast({ title: res.message || '获取消息失败', icon: 'none' })
        }
      } catch (error) {
        console.error('加载消息失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    async showDetail(item) {
      // 标记消息为已读
      let smsIdArr = [item.smsId]
      let res = await API.system.sms.setReadStatusSmsByIds.post({ ids: smsIdArr })
      if (res.code == 200) {
        // 更新未读消息数
        this.getNoReadSms()
      } else {
        uni.showToast({ title: res.message || '标记已读失败', icon: 'none' })
      }
      
      // 根据消息类型处理跳转
      if (item.view === 'NEWS') {
        // 跳转到消息详情
        uni.navigateTo({
          url: `/pages/message/detail?type=news&recordId=${item.recordId}`
        })
      } else if (item.view === 'NOTICE') {
        // 跳转到通知详情
        uni.navigateTo({
          url: `/pages/message/detail?type=notice&recordId=${item.recordId}`
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
        // 其他类型的消息，暂时跳转到通用详情页
        uni.navigateTo({
          url: `/pages/message/detail?type=other&recordId=${item.recordId}&view=${item.view}`
        })
      }
    },
    async getNoReadSms() {
      try {
        const res = await API.system.sms.getNoReadSms.get()
        if (res.code === 200) {
          // 更新全局未读消息数
          this.$store.commit('setUnreadCount', res.data || 0)
        }
      } catch (error) {
        console.error('获取未读消息数失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.container {
  flex: 1;
  background-color: #f5f5f5;
}

.header {
  height: 44px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e5e5e5;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.content {
  flex: 1;
}

.message-item {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
}

.message-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.message-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 16px;
  color: #999;
}
</style>