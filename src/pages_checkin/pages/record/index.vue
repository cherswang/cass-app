<template>
  <view class="record-container">
    <view class="record-header">
      <text class="record-title">打卡记录</text>
    </view>
    <view class="record-filter">
      <picker mode="date" :start="startDate" :end="endDate" :value="selectedDate" @change="handleDateChange">
        <view class="filter-item">
          <text class="filter-label">选择日期：</text>
          <text class="filter-value">{{ selectedDate }}</text>
          <up-icon name="arrow-down" size="16" color="#999"></up-icon>
        </view>
      </picker>
    </view>
    <view class="record-list">
      <view class="record-item" v-for="item in checkinRecords" :key="item.id">
        <view class="item-date">
          <text class="date-text">{{ item.date }}</text>
        </view>
        <view class="item-detail">
          <view class="detail-row">
            <text class="detail-label">上班打卡：</text>
            <text class="detail-time">{{ item.checkinTime }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">下班打卡：</text>
            <text class="detail-time">{{ item.checkoutTime }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">状态：</text>
            <text class="detail-status" :class="item.status === 'normal' ? 'status-normal' : 'status-abnormal'">
              {{ item.status === 'normal' ? '正常' : '异常' }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      selectedDate: '2026-03',
      checkinRecords: [
        {
          id: 1,
          date: '2026-03-13',
          checkinTime: '09:00',
          checkoutTime: '18:00',
          status: 'normal'
        },
        {
          id: 2,
          date: '2026-03-12',
          checkinTime: '09:05',
          checkoutTime: '18:10',
          status: 'normal'
        },
        {
          id: 3,
          date: '2026-03-11',
          checkinTime: '08:50',
          checkoutTime: '17:55',
          status: 'normal'
        }
      ]
    }
  },
  methods: {
    handleDateChange(e) {
      this.selectedDate = e.detail.value
      // 这里可以根据选择的日期加载对应的打卡记录
    }
  }
}
</script>

<style lang="scss">
.record-container {
  padding: 15px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.record-header {
  margin-bottom: 15px;
}

.record-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.record-filter {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: 14px;
  color: #5a5a5a;
  margin-right: 10px;
}

.filter-value {
  font-size: 14px;
  color: #262626;
  flex: 1;
}

.record-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.record-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.record-item:last-child {
  border-bottom: none;
}

.item-date {
  margin-bottom: 10px;
}

.date-text {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.item-detail {
  padding-left: 10px;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 13px;
  color: #999;
  width: 80px;
}

.detail-time {
  font-size: 13px;
  color: #262626;
}

.detail-status {
  font-size: 13px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
}

.status-normal {
  background: #f6ffed;
  color: #52c41a;
}

.status-abnormal {
  background: #fff2f0;
  color: #ff4d4f;
}
</style>