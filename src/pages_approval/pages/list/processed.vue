<template>
  <view class="approval-list-container">
    <view class="list-header">
      <text class="list-title">已处理</text>
    </view>
    <view class="approval-list">
      <view class="approval-item" v-for="item in processedApprovals" :key="item.id" @click="navigateToDetail(item.id)">
        <view class="item-header">
          <text class="item-title">{{ item.title }}</text>
          <text class="item-status status-processed">{{ item.result }}</text>
        </view>
        <view class="item-info">
          <text class="item-submitter">提交人：{{ item.submitter }}</text>
          <text class="item-time">{{ item.time }}</text>
        </view>
        <view class="item-content">
          <text class="content-text">{{ item.content }}</text>
        </view>
        <view class="item-result">
          <text class="result-label">处理结果：</text>
          <text class="result-text">{{ item.result }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      processedApprovals: [
        {
          id: 1,
          title: '报销申请',
          submitter: '李四',
          time: '2026-03-13 09:30',
          content: '报销办公用品费用，共计120元。',
          result: '已通过'
        },
        {
          id: 2,
          title: '请假申请',
          submitter: '赵六',
          time: '2026-03-12 14:00',
          content: '因家中有事，申请请假2天。',
          result: '已通过'
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

.status-processed {
  background: #f6ffed;
  color: #52c41a;
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
  margin-bottom: 8px;
}

.content-text {
  font-size: 13px;
  color: #5a5a5a;
  line-height: 1.4;
}

.item-result {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.result-label {
  font-size: 12px;
  color: #999;
  margin-right: 8px;
}

.result-text {
  font-size: 12px;
  font-weight: 500;
  color: #52c41a;
}
</style>