<template>
  <view class="dashboard-page">
    <!-- 顶部工作状态栏 -->
    <view class="work-status-bar">
      <view class="worker-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        <view class="worker-details">
          <text class="worker-name">{{ userInfo.name }}</text>
          <text class="worker-position">{{ userInfo.position }} | {{ userInfo.workshop }}</text>
        </view>
      </view>
      <view class="shift-info">
        <view class="shift-item">
          <text class="shift-label">当前班次</text>
          <text class="shift-value">{{ workStatus.shift }}</text>
        </view>
        <view class="shift-item">
          <text class="shift-label">工作时长</text>
          <text class="shift-value">{{ workStatus.hours }}h</text>
        </view>
      </view>
    </view>

    <!-- 今日任务概览 -->
    <view class="today-tasks">
      <view class="section-title">
        <uni-icons type="calendar" size="18" color="#1890ff"></uni-icons>
        <text class="title-text">今日任务</text>
      </view>
      <view class="task-overview">
        <view class="task-item">
          <view class="task-icon pending">
            <uni-icons type="clock" size="20" color="#faad14"></uni-icons>
          </view>
          <view class="task-info">
            <text class="task-count">{{ taskStats.pending }}</text>
            <text class="task-label">待处理</text>
          </view>
        </view>
        <view class="task-item">
          <view class="task-icon processing">
            <uni-icons type="refresh" size="20" color="#1890ff"></uni-icons>
          </view>
          <view class="task-info">
            <text class="task-count">{{ taskStats.processing }}</text>
            <text class="task-label">进行中</text>
          </view>
        </view>
        <view class="task-item">
          <view class="task-icon completed">
            <uni-icons type="checkmark" size="20" color="#52c41a"></uni-icons>
          </view>
          <view class="task-info">
            <text class="task-count">{{ taskStats.completed }}</text>
            <text class="task-label">已完成</text>
          </view>
        </view>
        <view class="task-item">
          <view class="task-icon quality">
            <uni-icons type="medal" size="20" color="#722ed1"></uni-icons>
          </view>
          <view class="task-info">
            <text class="task-count">{{ taskStats.qualityIssues }}</text>
            <text class="task-label">质量问题</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 当前生产任务 -->
    <view class="current-task">
      <view class="task-header">
        <view class="task-title">
          <uni-icons type="list" size="18" color="#1890ff"></uni-icons>
          <text>当前生产任务</text>
        </view>
        <text class="task-priority" :class="currentTask.priority">{{ currentTask.priorityText }}</text>
      </view>
      <view class="task-content">
        <text class="product-name">{{ currentTask.productName }}</text>
        <text class="work-order">工单号: {{ currentTask.workOrder }}</text>
        <view class="progress-section">
          <view class="progress-info">
            <text>完成进度</text>
            <text class="progress-percent">{{ currentTask.progress }}%</text>
          </view>
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: currentTask.progress + '%' }"></view>
          </view>
        </view>
        <view class="task-numbers">
          <view class="number-item">
            <text class="number">{{ currentTask.planned }}</text>
            <text class="label">计划数</text>
          </view>
          <view class="number-item">
            <text class="number">{{ currentTask.completed }}</text>
            <text class="label">已完成</text>
          </view>
          <view class="number-item">
            <text class="number">{{ currentTask.defective }}</text>
            <text class="label">不良品</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="section-title">
        <uni-icons type="flash" size="18" color="#1890ff"></uni-icons>
        <text class="title-text">快捷操作</text>
      </view>
      <view class="actions-grid">
        <view class="action-item" v-for="action in quickActions" :key="action.id" @click="handleAction(action)">
          <view class="action-icon" :style="{ background: action.color }">
            <uni-icons :type="action.icon" size="24" color="#fff"></uni-icons>
          </view>
          <text class="action-name">{{ action.name }}</text>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item" :class="{ active: activeNav === 'dashboard' }" @click="switchNav('dashboard')">
        <uni-icons type="home" size="20" :color="activeNav === 'dashboard' ? '#1890ff' : '#666'"></uni-icons>
        <text class="nav-text">工作台</text>
      </view>
      <view class="nav-item" :class="{ active: activeNav === 'apps' }" @click="switchNav('apps')">
        <uni-icons type="apps" size="20" :color="activeNav === 'apps' ? '#1890ff' : '#666'"></uni-icons>
        <text class="nav-text">应用</text>
      </view>
      <view class="nav-item" :class="{ active: activeNav === 'task' }" @click="switchNav('task')">
        <uni-icons type="list" size="20" :color="activeNav === 'task' ? '#1890ff' : '#666'"></uni-icons>
        <text class="nav-text">任务</text>
      </view>
      <view class="nav-item" :class="{ active: activeNav === 'profile' }" @click="switchNav('profile')">
        <uni-icons type="person" size="20" :color="activeNav === 'profile' ? '#1890ff' : '#666'"></uni-icons>
        <text class="nav-text">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

// 用户信息
const userInfo = reactive({
  avatar: '/static/images/avatar/worker.png',
  name: '张工',
  position: '操作工',
  workshop: '一车间'
});

// 工作状态
const workStatus = reactive({
  shift: '白班 (08:00-16:00)',
  hours: '6.5'
});

// 任务统计
const taskStats = reactive({
  pending: 3,
  processing: 2,
  completed: 8,
  qualityIssues: 1
});

// 当前任务
const currentTask = reactive({
  productName: '智能控制器主板',
  workOrder: 'WO20231215001',
  priority: 'high',
  priorityText: '紧急',
  progress: 65,
  planned: 1000,
  completed: 650,
  defective: 12
});

// 快捷操作
const quickActions = ref([
  { 
    id: 1, 
    name: '开始作业', 
    icon: 'play', 
    color: '#52c41a',
    type: 'action',
    url: '/pages/production/start-work'
  },
  { 
    id: 2, 
    name: '暂停作业', 
    icon: 'pause', 
    color: '#faad14',
    type: 'action',
    url: '/pages/production/pause-work'
  },
  { 
    id: 3, 
    name: '完成报工', 
    icon: 'checkmark', 
    color: '#1890ff',
    type: 'action',
    url: '/pages/production/report-work'
  },
  { 
    id: 4, 
    name: '异常上报', 
    icon: 'warn', 
    color: '#f5222d',
    type: 'action',
    url: '/pages/quality/issue-report'
  },
  { 
    id: 5, 
    name: '质量检验', 
    icon: 'medal', 
    color: '#722ed1',
    type: 'action',
    url: '/pages/quality/inspection'
  },
  { 
    id: 6, 
    name: '设备点检', 
    icon: 'gear', 
    color: '#fa8c16',
    type: 'action',
    url: '/pages/equipment/check'
  }
]);

// 导航状态
const activeNav = ref('dashboard');

// 处理方法
function handleAction(action) {
  console.log('执行快捷操作:', action.name);
  
  if (action.type === 'action') {
    // 直接执行的操作
    switch (action.id) {
      case 1: // 开始作业
        startWork();
        break;
      case 2: // 暂停作业
        pauseWork();
        break;
      case 3: // 完成报工
        navigateTo(action.url);
        break;
      default:
        navigateTo(action.url);
        break;
    }
  } else {
    navigateTo(action.url);
  }
}

// 开始作业
function startWork() {
  uni.showModal({
    title: '开始作业',
    content: '确定要开始当前作业吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '作业已开始',
          icon: 'success',
          duration: 1000
        });
        // 这里可以调用开始作业的API
      }
    }
  });
}

// 暂停作业
function pauseWork() {
  uni.showModal({
    title: '暂停作业',
    content: '确定要暂停当前作业吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '作业已暂停',
          icon: 'success',
          duration: 1000
        });
        // 这里可以调用暂停作业的API
      }
    }
  });
}

// 页面跳转
function navigateTo(url) {
  if (!url) {
    uni.showToast({
      title: '功能开发中',
      icon: 'none',
      duration: 1000
    });
    return;
  }
  
  uni.navigateTo({
    url: url,
    fail: (err) => {
      console.error('页面跳转失败:', err);
      uni.showToast({
        title: '页面不存在',
        icon: 'none',
        duration: 1000
      });
    }
  });
}

// 切换导航
function switchNav(nav) {
  activeNav.value = nav;
  
  if (nav === 'apps') {
    // 跳转到应用中心页面
    uni.redirectTo({
      url: '/pages/workshop/apps'
    });
  } else if (nav === 'task') {
    uni.showToast({
      title: '任务页面开发中',
      icon: 'none',
      duration: 1000
    });
  } else if (nav === 'profile') {
    uni.showToast({
      title: '个人中心开发中',
      icon: 'none',
      duration: 1000
    });
  }
}

// 模拟数据更新
function updateData() {
  // 模拟实时数据更新
  setInterval(() => {
    // 更新工作时长
    workStatus.hours = (parseFloat(workStatus.hours) + 0.1).toFixed(1);
    
    // 更新任务进度
    if (currentTask.progress < 100) {
      currentTask.progress = Math.min(currentTask.progress + 1, 100);
      currentTask.completed = Math.min(currentTask.completed + 10, currentTask.planned);
    }
  }, 30000); // 每30秒更新一次
}

// 组件挂载时初始化
onMounted(() => {
  console.log('工作台页面初始化');
  updateData();
});
</script>

<style lang="scss">
page {
  background: #f5f7fa;
  height: 100%;
}

.dashboard-page {
  padding: 20rpx 30rpx 120rpx;
  min-height: 100vh;
}

// 顶部工作状态栏
.work-status-bar {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.worker-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 3rpx solid #f0f0f0;
  margin-right: 20rpx;
}

.worker-details {
  display: flex;
  flex-direction: column;
}

.worker-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8rpx;
}

.worker-position {
  font-size: 24rpx;
  color: #666;
}

.shift-info {
  display: flex;
  gap: 40rpx;
}

.shift-item {
  text-align: center;
}

.shift-label {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.shift-value {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
}

// 今日任务
.today-tasks {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.title-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
  margin-left: 12rpx;
}

.task-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #fafafa;
  border-radius: 12rpx;
}

.task-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  
  &.pending { background: #fff7e6; }
  &.processing { background: #e6f7ff; }
  &.completed { background: #f6ffed; }
  &.quality { background: #f9f0ff; }
}

.task-info {
  display: flex;
  flex-direction: column;
}

.task-count {
  font-size: 28rpx;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4rpx;
}

.task-label {
  font-size: 22rpx;
  color: #666;
}

// 当前任务
.current-task {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.task-title {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
}

.task-priority {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
  
  &.high {
    background: #fff2f0;
    color: #f5222d;
  }
  &.medium {
    background: #fff7e6;
    color: #fa8c16;
  }
  &.low {
    background: #f6ffed;
    color: #52c41a;
  }
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #262626;
}

.work-order {
  font-size: 24rpx;
  color: #666;
}

.progress-section {
  margin: 10rpx 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  font-size: 24rpx;
  color: #666;
}

.progress-percent {
  font-weight: 600;
  color: #1890ff;
}

.progress-bar {
  height: 8rpx;
  background: #f0f0f0;
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.task-numbers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-top: 10rpx;
}

.number-item {
  text-align: center;
  padding: 16rpx;
  background: #fafafa;
  border-radius: 8rpx;
}

.number {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4rpx;
}

.label {
  font-size: 22rpx;
  color: #666;
}

// 快捷操作
.quick-actions {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-item:active {
  background: #f5f5f5;
  transform: scale(0.95);
}

.action-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.action-name {
  font-size: 24rpx;
  color: #262626;
  font-weight: 500;
  text-align: center;
}

// 底部导航
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20rpx 0;
  border-top: 1rpx solid #f0f0f0;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 20rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-item.active {
  color: #1890ff;
}

.nav-item:active {
  background: #f5f5f5;
}

.nav-text {
  font-size: 22rpx;
  margin-top: 8rpx;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .dashboard-page {
    padding: 20rpx 20rpx 120rpx;
  }
  
  .work-status-bar {
    flex-direction: column;
    gap: 20rpx;
    align-items: flex-start;
  }
  
  .shift-info {
    width: 100%;
    justify-content: space-around;
  }
  
  .task-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>