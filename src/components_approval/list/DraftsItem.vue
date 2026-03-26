<template>
  <view class="approval-item">
    <view class="item-header">
      <text class="item-title">{{ item.flowTitle || item.title }}</text>
      <text class="item-status status-drafts">草稿</text>
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
        <text class="content-label">创建时间：</text>
        <text class="content-value">{{ item.createTime || item.time }}</text>
      </view>
      <view class="item-footer">
        <view class="btn-container">
          <button class="view-btn" @click.stop="$emit('navigateToDetail', item)">查看</button>
          <button class="handle-btn" @click.stop="$emit('navigateToHandle', item)">办理</button>
          <button class="delete-btn" @click.stop="$emit('handleDelete', item)">删除</button>
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
.status-drafts {
  background: #f0f0f0;
  color: #666;
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

/* 办理按钮 */
.handle-btn {
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

.handle-btn:active {
  background-color: #73d13d;
}

/* 删除按钮 */
.delete-btn {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  vertical-align: middle;
  background-color: #ff4d4f;
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

.delete-btn:active {
  background-color: #ff7875;
}
</style>