<template>
  <view class="page">
    <view class="content" v-if="!loading">
      <view class="section">
        <!-- 任务单号 -->
        <view class="info-item">
          <text class="label">任务单号:</text>
          <text class="value">{{ taskDetail.taskNo || '-' }}</text>
        </view>
        
        <!-- 工单号 -->
        <view class="info-item">
          <text class="label">所属工单号:</text>
          <text class="value">{{ taskDetail.workOrderNo || '-' }}</text>
        </view>
        
        <!-- 生产订单号 -->
        <view class="info-item">
          <text class="label">生产订单号:</text>
          <text class="value">{{ taskDetail.orderNo || '-' }}</text>
        </view>
        
        <!-- 产品编码 -->
        <view class="info-item">
          <text class="label">产品编码:</text>
          <text class="value">{{ taskDetail.productCode || '-' }}</text>
        </view>
        
        <!-- 产品名称 -->
        <view class="info-item">
          <text class="label">产品名称:</text>
          <text class="value">{{ taskDetail.productName || '-' }}</text>
        </view>
        
        <!-- 产品规格 -->
        <view class="info-item">
          <text class="label">产品规格:</text>
          <text class="value">{{ taskDetail.productSpec || '-' }}</text>
        </view>
        
        <!-- 工序编码 -->
        <view class="info-item">
          <text class="label">工序编码:</text>
          <text class="value">{{ taskDetail.processCode || '-' }}</text>
        </view>
        
        <!-- 工序名称 -->
        <view class="info-item">
          <text class="label">工序名称:</text>
          <text class="value">{{ taskDetail.processName || '-' }}</text>
        </view>

        <!-- 计划数量 -->
        <view class="info-item">
          <text class="label">计划数量:</text>
          <text class="value">{{ taskDetail.plannedQuantity || 0 }} {{ taskDetail.unit || '' }}</text>
        </view>
        
        <!-- 已完成数量 -->
        <view class="info-item">
          <text class="label">已完成数量:</text>
          <text class="value completed">{{ taskDetail.completedQuantity || 0 }} {{ taskDetail.unit || '' }}</text>
        </view>
        
        <!-- 计划开始日期 -->
        <view class="info-item">
          <text class="label">计划开始日期:</text>
          <text class="value">{{ formatDate(taskDetail.plannedStartDate) }}</text>
        </view>
        
        <!-- 计划完成日期 -->
        <view class="info-item">
          <text class="label">计划完成日期:</text>
          <text class="value">{{ formatDate(taskDetail.plannedEndDate) }}</text>
        </view>
        
        <!-- 实际开始日期 -->
        <view class="info-item">
          <text class="label">实际开始日期:</text>
          <text class="value">{{ formatDate(taskDetail.actualStartDate) }}</text>
        </view>
        
        <!-- 实际完成日期 -->
        <view class="info-item">
          <text class="label">实际完成日期:</text>
          <text class="value">{{ formatDate(taskDetail.actualEndDate) }}</text>
        </view>
        
        <!-- 任务状态 -->
        <view class="info-item">
          <text class="label">任务状态:</text>
          <UniDictTag :options="dicts" :value="taskDetail.status"/>
        </view>
        
        <!-- 关键工序标志 -->
        <view class="info-item">
          <text class="label">是否关键工序:</text>
          <text class="value">{{ taskDetail.keyFlag === 'Y' ? '是' : '否' }}</text>
        </view>
        <!-- 备注 -->
        <view class="info-item">
          <text class="label">备注:</text>
          <text class="value">{{ taskDetail.remark || '无' }}</text>
        </view>
        
        <!-- 创建时间 -->
        <view class="info-item">
          <text class="label">创建时间:</text>
          <text class="value">{{ formatDate(taskDetail.createTime) }}</text>
        </view>
      </view>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 固定底部的返回按钮 -->
    <view class="fixed-footer">
      <button class="back-btn" @click="goBack">返回</button>
    </view>
  </view>
</template>

<script>
import { getWorkOrderTaskInfo } from '@/api/pro/workTask'
import {getDicts} from '@/api/system/dict'

export default {
  name: 'WorkOrderTaskDetail',
  data() {
    return {
      taskDetail: {},
      loading: true,
      taskId: '',
      dicts: {}
    }
  },
  onLoad(options) {
    this.loadDicts();
    if (options.id) {
      this.taskId = options.id
      this.loadTaskDetail()
    }
  },
  methods: {
    // 加载字典数据
    async loadDicts() {
      try {
        const response = await getDicts("worktask_status")
        this.dicts = response.data
      } catch (error) {
        this.dicts = {} // 确保即使失败也有默认值
      }
    },
    async loadTaskDetail() {
      this.loading = true
      try {
        const res = await getWorkOrderTaskInfo(this.taskId)
        if (res.code === 200) {
          this.taskDetail = res.data || {}
        } else {
          uni.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          })
          // 延迟返回，让用户看到错误信息
          setTimeout(() => {
            this.goBack()
          }, 1500)
        }
      } catch (error) {
        console.error('加载任务详情失败:', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    goBack() {
      uni.navigateBack()
    },
    
    
    formatDate(date) {
      if (!date) return '-'
      
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 70px; /* 为固定底部按钮预留空间 */
}

.content {
  padding: 10px;
}

.section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 14px;
  color: #666;
}

.value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  max-width: 60%;
  text-align: right;
  word-break: break-all;
}

.completed {
  color: #07c160;
}

.loading {
  padding: 60px 0;
  text-align: center;
}

.loading-text {
  display: block;
  margin-top: 10px;
  color: #999;
  font-size: 14px;
}

/* 固定底部的样式 */
.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  background-color: #ffffff;
  z-index: 999;
  box-sizing: border-box;
}

.back-btn {
  width: 100%;
  height: 45px;
  background-color: #007aff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 45px;
  padding: 0;
}
</style>