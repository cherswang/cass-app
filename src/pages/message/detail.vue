<template>
  <view class="container">
    <view class="header">
      <text class="back" @click="goBack">&lt;</text>
      <text class="title">{{ title }}</text>
    </view>
    <view class="content">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      <view v-else-if="error" class="error">
        <text>{{ error }}</text>
      </view>
      <view v-else class="detail">
        <view v-if="type === 'news'">
          <text class="detail-title">{{ newsDetail.title }}</text>
          <text class="detail-time">{{ newsDetail.createTime }}</text>
          <view class="detail-content" v-html="newsDetail.content"></view>
        </view>
        <view v-else-if="type === 'notice'">
          <text class="detail-title">{{ noticeDetail.title }}</text>
          <text class="detail-time">{{ noticeDetail.createTime }}</text>
          <view class="detail-content" v-html="noticeDetail.content"></view>
        </view>
        <view v-else>
          <text class="detail-title">消息详情</text>
          <text class="detail-time">{{ currentDate }}</text>
          <view class="detail-content">
            <text>消息类型: {{ view }}</text>
            <text>记录ID: {{ recordId }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import API from '@/api/index'

export default {
  data() {
    return {
      type: '',
      recordId: '',
      view: '',
      title: '消息详情',
      loading: false,
      error: '',
      newsDetail: {},
      noticeDetail: {},
      currentDate: ''
    }
  },
  onLoad(options) {
    this.type = options.type || ''
    this.recordId = options.recordId || ''
    this.view = options.view || ''
    this.currentDate = new Date().toLocaleString()
    this.loadDetail()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    async loadDetail() {
      this.loading = true
      this.error = ''
      try {
        if (this.type === 'news') {
          const res = await API.system.news.getMyNewsById.get({ id: this.recordId })
          if (res.code === 200) {
            this.newsDetail = res.data || {}
            this.title = '新闻详情'
          } else {
            this.error = res.message || '获取新闻详情失败'
          }
        } else if (this.type === 'notice') {
          const res = await API.system.notice.getMyNoticeById.get({ id: this.recordId })
          if (res.code === 200) {
            this.noticeDetail = res.data || {}
            this.title = '通知详情'
          } else {
            this.error = res.message || '获取通知详情失败'
          }
        }
      } catch (error) {
        console.error('加载详情失败:', error)
        this.error = '加载失败，请重试'
      } finally {
        this.loading = false
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
  border-bottom: 1px solid #e5e5e5;
  padding: 0 15px;
}

.back {
  font-size: 20px;
  color: #333;
  margin-right: 10px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  flex: 1;
  text-align: center;
}

.content {
  flex: 1;
  padding: 15px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #ff4d4f;
}

.detail {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
}

.detail-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.detail-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
  display: block;
}

.detail-content {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.detail-content text {
  display: block;
  margin-bottom: 10px;
}
</style>