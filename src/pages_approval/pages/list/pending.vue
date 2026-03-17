<template>
  <view class="approval-list-container">
    <view class="list-header">
      <text class="list-title">待审批</text>
    </view>
    <view class="approval-list">
      <view class="approval-item" v-for="item in pendingApprovals" :key="item.id" @click="navigateToDetail(item.id)">
        <view class="item-header">
          <text class="item-title">{{ item.title }}</text>
          <text class="item-status status-pending">待审批</text>
        </view>
        <view class="item-info">
          <text class="item-submitter">提交人：{{ item.submitter }}</text>
          <text class="item-time">{{ item.time }}</text>
        </view>
        <view class="item-content">
          <text class="content-text">{{ item.content }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pendingApprovals: [
        {
          id: 1,
          title: '请假申请',
          submitter: '张三',
          time: '2026-03-13 10:00',
          content: '因个人原因，申请请假1天，望批准。'
        },
        {
          id: 2,
          title: '加班申请',
          submitter: '王五',
          time: '2026-03-12 18:00',
          content: '因项目赶工，申请加班2小时，望批准。'
        }
      ]
    }
  },
  methods: {
    navigateToDetail(id) {
      uni.navigateTo({
        url: `/pages_approval/pages/detail/index?id=${id}`
      })
    }
  }
}
</script>

<style lang="scss">
.approval-list-container {
  padding: 15px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.list-header {
  margin-bottom: 15px;
}

.list-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.approval-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.approval-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.approval-item:last-child {
  border-bottom: none;
}

.approval-item:active {
  background: #f5f5f5;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  flex: 1;
}

.item-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-submitter {
  font-size: 12px;
  color: #999;
}

.item-time {
  font-size: 12px;
  color: #999;
}

.item-content {
  margin-top: 8px;
}

.content-text {
  font-size: 13px;
  color: #5a5a5a;
  line-height: 1.4;
}
</style>