<template>
  <view class="approval-item">
    <view class="item-header">
      <text class="item-title">{{ item.flowTitle || item.title }}</text>
      <text class="item-status status-processing">处理中</text>
    </view>
    <view class="item-content">
      <view class="content-row">
        <text class="content-label">流水号：</text>
        <text class="content-value">{{ item.id }}</text>
      </view>
      <view class="content-row">
        <text class="content-label">流程分类：</text>
        <text class="content-value">{{ item.flowName || '未知流程' }}</text>
      </view>
      <view class="content-row">
        <text class="content-label">步骤名称：</text>
        <text class="content-value">{{ item.stepName || '未知步骤' }}</text>
      </view>
      <view class="content-row">
        <text class="content-label">转交部门：</text>
        <text class="content-value">{{ item.deptName || '无' }}</text>
      </view>
      <view class="content-row">
        <text class="content-label">转交人：</text>
        <text class="content-value">{{ item.createUser || item.submitter || '未知' }}</text>
      </view>
      <view class="content-row">
        <text class="content-label">转交时间：</text>
        <text class="content-value">{{ item.createTime || item.time }}</text>
      </view>
      <view class="content-row">
        <text class="content-label">停留时间：</text>
        <text class="content-value">{{ getTimeDifference(item.createTime || item.time) }}</text>
      </view>
      <view class="content-row">
        <text class="content-label">流程状态：</text>
        <text class="content-value">{{ getFlowStatusText(item) }}</text>
      </view>
      <view class="content-row">
        <text class="content-label">紧急程度：</text>
        <text class="content-value">{{ getUrgencyText(item.urgency) }}</text>
      </view>
      <view class="content-row">
        <text class="content-label">办理时限：</text>
        <text class="content-value">{{ getPassTimeText(item.passTime) }}</text>
      </view>
      <view class="content-row" v-if="item.recTime">
        <text class="content-label">接收时间：</text>
        <text class="content-value">{{ item.recTime }}</text>
      </view>
      <view class="item-footer">
        <view class="btn-container">
          <button class="view-btn" @click.stop="$emit('navigateToDetail', item)">查看</button>
          <button class="remind-btn" @click.stop="$emit('handleRemind', item)">催办</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 计算停留时间
    getTimeDifference(startDate) {
      if (!startDate) return '0天0时0分'
      
      const now = new Date()
      const start = new Date(startDate)
      const duration = now - start
      
      const days = Math.floor(duration / (1000 * 60 * 60 * 24))
      const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
      
      return `${days}天${hours}时${minutes}分`
    },
    // 获取流程状态文本
    getFlowStatusText(item) {
      const { createTime, passTime } = item
      if (passTime != 0) {
        const timestamp1 = new Date(createTime).getTime() + passTime * 60 * 60 * 1000
        const timestamp = new Date().getTime()
        if (timestamp1 > timestamp) {
          return '正常'
        } else {
          return '已超时'
        }
      } else {
        return '正常'
      }
    },
    // 获取紧急程度文本
    getUrgencyText(urgency) {
      const urgencyMap = {
        0: '一般',
        1: '紧急',
        2: '加急'
      }
      return urgencyMap[urgency] || '未知'
    },
    // 获取办理时限文本
    getPassTimeText(passTime) {
      if (passTime == 0) {
        return '无限制'
      } else {
        return `${passTime}小时`
      }
    }
  }
}
</script>

<style scoped>
.approval-item {
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.approval-item:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
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

/* 状态样式 */
.status-processing {
  background: #e6f7ff;
  color: #1890ff;
}

.item-content {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.content-row {
  display: flex;
  margin-bottom: 6px;
  align-items: flex-start;
}

.content-label {
  font-size: 12px;
  color: #999;
  width: 60px;
  flex-shrink: 0;
}

.content-value {
  font-size: 12px;
  color: #666;
  flex: 1;
  line-height: 1.4;
}

/* 底部操作栏 */
.item-footer {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

/* 按钮容器 */
.btn-container {
  width: 100%;
  padding-left: 0;
  margin-left: 0;
  font-size: 0; /* 消除inline-block元素间的空格 */
}

/* 查看按钮 */
.view-btn {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  vertical-align: middle;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 14px;
  font-size: 13px;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  text-align: center;
  box-sizing: border-box;
}

.view-btn:active {
  background-color: #40a9ff;
}

/* 催办按钮 */
.remind-btn {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  vertical-align: middle;
  background-color: #52c41a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 14px;
  font-size: 13px;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  text-align: center;
  box-sizing: border-box;
}

.remind-btn:active {
  background-color: #73d13d;
}
</style>