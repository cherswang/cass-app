<template>
  <view class="record-container">
    <view class="record-filter">
      <view class="filter-row">
        <view class="filter-item col-2">
          <text class="filter-label">年份：</text>
          <picker :range="yearOptions" :value="yearIndex" @change="handleYearChange">
            <view class="filter-picker">
              <text class="filter-value">{{ yearOptions[yearIndex] }}</text>
              <!-- <text class="filter-arrow">▼</text> -->
            </view>
          </picker>
        </view>
        <view class="filter-item col-2">
          <text class="filter-label">月份：</text>
          <picker :range="monthOptions" :value="monthIndex" @change="handleMonthChange">
            <view class="filter-picker">
              <text class="filter-value">{{ monthOptions[monthIndex] }}</text>
              <!-- <text class="filter-arrow">▼</text> -->
            </view>
          </picker>
        </view>
      </view>
      <view class="filter-row">
        <view class="filter-item col-2">
          <text class="filter-label">状态：</text>
          <picker :range="statusOptions" :value="statusIndex" @change="handleStatusChange">
            <view class="filter-picker">
              <text class="filter-value">{{ statusOptions[statusIndex] }}</text>
              <!-- <text class="filter-arrow">▼</text> -->
            </view>
          </picker>
        </view>
        <view class="filter-item col-2">
          <text class="filter-label">方式：</text>
          <picker :range="typeOptions" :value="typeIndex" @change="handleTypeChange">
            <view class="filter-picker">
              <text class="filter-value">{{ typeOptions[typeIndex] }}</text>
              <!-- <text class="filter-arrow">▼</text> -->
            </view>
          </picker>
        </view>
      </view>
      <!-- 注释掉查询按钮，使用自动查询 -->
      <!--
      <view class="filter-btn">
        <button class="search-btn" @click="searchRecords">查询</button>
      </view>
      -->
    </view>
    <view class="record-list">
      <view class="record-item" v-for="item in checkinRecords" :key="item.attendId">
        <view class="item-date">
          <text class="date-text">{{ item.nowTime || '无' }}</text>
        </view>
        <view class="item-detail">
          <!-- 核心数据：打卡时间 -->
          <view class="detail-row">
            <text class="detail-label">打卡时间：</text>
            <text class="detail-value">{{ item.createTime || '无' }}</text>
          </view>
          <!-- 核心数据：打卡方式 -->
          <view class="detail-row">
            <text class="detail-label">打卡方式：</text>
            <text class="detail-value">{{ item.status === 1 ? '已打卡' : item.status === 2 ? '下班打卡' : '无' }}</text>
          </view>
          <!-- 核心数据：打卡状态 -->
          <view class="detail-row">
            <text class="detail-label">打卡状态：</text>
            <text class="detail-status" :class="getAttendTypeClass(item.attendType)">
              {{ getAttendTypeText(item.attendType) || '无' }}
            </text>
          </view>
          <!-- 核心数据：备注 -->
          <view class="detail-row">
            <text class="detail-label">备注：</text>
            <text class="detail-value">{{ item.remark || '无' }}</text>
          </view>
          
          <!-- 以下数据为次要信息，已注释掉，如需展示可取消注释 -->
          <!--
          <view class="detail-row">
            <text class="detail-label">考勤规则：</text>
            <text class="detail-value">{{ item.title || '无' }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">打卡时间段：</text>
            <text class="detail-value">{{ (item.beginTime && item.endTime) ? `${item.beginTime} ~ ${item.endTime}` : '无' }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">经度：</text>
            <text class="detail-value">{{ item.longitude || '无' }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">纬度：</text>
            <text class="detail-value">{{ item.latitude || '无' }}</text>
          </view>
          -->
        </view>
      </view>
      <view class="empty-state" v-if="checkinRecords.length === 0 && !loading">
        <text class="empty-text">无</text>
      </view>
      <view class="loading-state" v-if="loading">
        <text class="loading-text">加载中...</text>
      </view>
      <view class="load-more" v-if="!loading && hasMore && checkinRecords.length > 0" @click="loadMore">
        <text class="load-more-text">加载更多</text>
      </view>
      <view class="no-more" v-if="!hasMore && checkinRecords.length > 0">
        <text class="no-more-text">没有更多数据了</text>
      </view>
    </view>
  </view>
</template>

<script>
import API from '@/api';

export default {
  data() {
    return {
      // 年份选项
      yearOptions: ['全部', '2024', '2025', '2026', '2027', '2028'],
      yearIndex: 0,
      // 月份选项
      monthOptions: ['全部', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthIndex: 0,
      // 打卡状态选项
      statusOptions: ['全部', '上班打卡', '下班打卡'],
      statusIndex: 0,
      // 打卡类型选项
      typeOptions: ['全部', '正常', '补卡', '迟到', '有事早退', '早退'],
      typeIndex: 0,
      // 打卡记录
      checkinRecords: [],
      // 加载状态
      loading: false,
      // 分页参数
      page: 1,
      pageSize: 15,
      // 是否有更多数据
      hasMore: true
    }
  },
  onLoad() {
    this.getYearOptions();
    this.searchRecords();
  },
  methods: {
    // 获取年份选项
    async getYearOptions() {
      try {
        const res = await API.office.attend.getMyAttendYear.get();
        if (res.code === 200) {
          // 从返回的数据中提取value字段作为年份选项
          const years = res.data.map(item => item.value);
          this.yearOptions = ['全部', ...years];
        }
      } catch (error) {
        console.error('获取年份选项失败:', error);
      }
    },
    // 处理年份选择
    handleYearChange(e) {
      this.yearIndex = e.detail.value;
      // 筛选条件变化时，重新从第一页开始加载
      this.searchRecords();
    },
    // 处理月份选择
    handleMonthChange(e) {
      this.monthIndex = e.detail.value;
      // 筛选条件变化时，重新从第一页开始加载
      this.searchRecords();
    },
    // 处理状态选择
    handleStatusChange(e) {
      this.statusIndex = e.detail.value;
      // 筛选条件变化时，重新从第一页开始加载
      this.searchRecords();
    },
    // 处理类型选择
    handleTypeChange(e) {
      this.typeIndex = e.detail.value;
      // 筛选条件变化时，重新从第一页开始加载
      this.searchRecords();
    },
    // 查询打卡记录
    async searchRecords() {
      // 重置分页参数
      this.page = 1;
      this.hasMore = true;
      this.loading = true;
      try {
        // 构建查询参数，只包含非空值
        const params = {
          page: this.page,
          pageSize: this.pageSize
        };
        if (this.yearIndex > 0) {
          params.year = this.yearOptions[this.yearIndex];
        }
        if (this.monthIndex > 0) {
          // 将中文月份转换为数字格式（如"一月" -> "01"）
          const monthMap = {
            '一月': '01', '二月': '02', '三月': '03', '四月': '04',
            '五月': '05', '六月': '06', '七月': '07', '八月': '08',
            '九月': '09', '十月': '10', '十一月': '11', '十二月': '12'
          };
          params.month = monthMap[this.monthOptions[this.monthIndex]] || '';
        }
        if (this.statusIndex > 0) {
          params.status = this.statusIndex;
        }
        if (this.typeIndex > 0) {
          params.attendType = this.typeIndex - 1;
        }
        
        console.log('查询参数:', params);
        
        const res = await API.office.attend.getMyAttendList.get(params);
        console.log('查询结果:', res);
        
        if (res.code === 200) {
          // 从响应数据中提取list字段
          this.checkinRecords = res.data?.list || [];
          // 检查是否还有更多数据
          this.hasMore = this.checkinRecords.length >= this.pageSize;
        } else {
          uni.showToast({ title: res.message || '查询失败', icon: 'none' });
        }
      } catch (error) {
        console.error('查询打卡记录失败:', error);
        uni.showToast({ title: error.message || '查询失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },
    // 加载更多数据
    async loadMore() {
      if (this.loading || !this.hasMore) {
        return;
      }
      
      this.page++;
      this.loading = true;
      try {
        // 构建查询参数，只包含非空值
        const params = {
          page: this.page,
          pageSize: this.pageSize
        };
        if (this.yearIndex > 0) {
          params.year = this.yearOptions[this.yearIndex];
        }
        if (this.monthIndex > 0) {
          // 将中文月份转换为数字格式（如"一月" -> "01"）
          const monthMap = {
            '一月': '01', '二月': '02', '三月': '03', '四月': '04',
            '五月': '05', '六月': '06', '七月': '07', '八月': '08',
            '九月': '09', '十月': '10', '十一月': '11', '十二月': '12'
          };
          params.month = monthMap[this.monthOptions[this.monthIndex]] || '';
        }
        if (this.statusIndex > 0) {
          params.status = this.statusIndex;
        }
        if (this.typeIndex > 0) {
          params.attendType = this.typeIndex - 1;
        }
        
        console.log('加载更多参数:', params);
        
        const res = await API.office.attend.getMyAttendList.get(params);
        console.log('加载更多结果:', res);
        
        if (res.code === 200) {
          // 从响应数据中提取list字段
          const newData = res.data?.list || [];
          // 合并数据
          this.checkinRecords = [...this.checkinRecords, ...newData];
          // 检查是否还有更多数据
          this.hasMore = newData.length >= this.pageSize;
        } else {
          uni.showToast({ title: res.message || '加载失败', icon: 'none' });
        }
      } catch (error) {
        console.error('加载更多失败:', error);
        uni.showToast({ title: error.message || '加载失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },
    // 获取打卡状态文本
    getAttendTypeText(type) {
      switch (type) {
        case '0':
          return '正常';
        case '1':
          return '补卡';
        case '2':
          return '迟到';
        case '3':
          return '有事早退';
        case '4':
          return '早退';
        default:
          return '未知';
      }
    },
    // 获取打卡状态样式
    getAttendTypeClass(type) {
      switch (type) {
        case '0':
          return 'status-normal';
        case '1':
          return 'status-makeup';
        case '2':
        case '3':
        case '4':
          return 'status-abnormal';
        default:
          return 'status-unknown';
      }
    }
  }
}
</script>

<style lang="scss">
.record-container {
  padding: 15px 15px 80px;
  min-height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
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
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  margin-bottom: 8px;
}

.filter-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
}

.filter-item.col-2 {
  flex: 1;
  margin-right: 8px;
  margin-bottom: 0;
}

.filter-item.col-2:last-child {
  margin-right: 0;
}

.filter-label {
  font-size: 12px;
  color: #5a5a5a;
  margin-right: 6px;
  flex-shrink: 0;
  min-width: 60px;
}

.filter-picker {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  min-width: 0;
  height: 32px;
}

.filter-value {
  font-size: 12px;
  color: #262626;
}

.filter-arrow {
  font-size: 11px;
  color: #999;
  margin-left: 8px;
}

.filter-btn {
  width: 100%;
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.search-btn {
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 16px;
  font-size: 12px;
  height: 28px;
  line-height: 16px;
}

.record-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 300px;
}

.record-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.item-date {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
}

.date-text {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.item-detail {
  padding-left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.record-item:last-child {
  border-bottom: none;
}

.item-date {
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.date-text {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.item-detail {
  padding-left: 5px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 13px;
  color: #999;
  width: 80px;
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-value {
  font-size: 13px;
  color: #262626;
  flex: 1;
  line-height: 1.4;
}

.detail-time {
  font-size: 13px;
  color: #262626;
}

.detail-status {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 2px;
}

.status-normal {
  background: #f6ffed;
  color: #52c41a;
}

.status-makeup {
  background: #e6f7ff;
  color: #1890ff;
}

.status-abnormal {
  background: #fff2f0;
  color: #ff4d4f;
}

.status-unknown {
  background: #f5f5f5;
  color: #999;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
}

.loading-text {
  font-size: 14px;
  color: #999;
}

.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin-top: 10px;
}

.load-more-text {
  font-size: 14px;
  color: #1890ff;
}

.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin-top: 10px;
}

.no-more-text {
  font-size: 14px;
  color: #999;
}
</style>
