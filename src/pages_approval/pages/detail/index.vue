<template>
  <view class="approval-detail-container">
    <view class="detail-header">
      <text class="detail-title">{{ approvalDetail.flowTitle || approvalDetail.title }}</text>
      <text class="detail-status" :class="getStatusClass(approvalDetail.status)">
        {{ getStatusText(approvalDetail.status) }}
      </text>
    </view>
    <view class="detail-body">
      <view class="detail-section">
        <text class="section-title">基本信息</text>
        <view class="info-item">
          <text class="info-label">流程名称：</text>
          <text class="info-value">{{ approvalDetail.flowName }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">步骤名称：</text>
          <text class="info-value">{{ approvalDetail.stepName }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">提交人：</text>
          <text class="info-value">{{ approvalDetail.createUser || approvalDetail.submitter }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">提交时间：</text>
          <text class="info-value">{{ approvalDetail.createTime || approvalDetail.submitTime }}</text>
        </view>
        <view class="info-item" v-if="approvalDetail.recTime">
          <text class="info-label">接收时间：</text>
          <text class="info-value">{{ approvalDetail.recTime }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">紧急程度：</text>
          <text class="info-value">{{ getUrgencyText(approvalDetail.urgency) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">办理时限：</text>
          <text class="info-value">{{ getPassTimeText(approvalDetail.passTime) }}</text>
        </view>
      </view>
      <view class="detail-section">
        <text class="section-title">审批内容</text>
        <view class="content-box">
          <text class="content-text">{{ approvalDetail.content || '暂无内容' }}</text>
        </view>
      </view>
      <view class="detail-section" v-if="approvalDetail.attachments && approvalDetail.attachments.length > 0">
        <text class="section-title">附件</text>
        <view class="attachment-list">
          <view class="attachment-item" v-for="(attachment, index) in approvalDetail.attachments" :key="index">
            <up-icon name="document" size="24" color="#1890ff"></up-icon>
            <text class="attachment-name">{{ attachment.name }}</text>
            <text class="attachment-size">{{ attachment.size }}</text>
          </view>
        </view>
      </view>
      <view class="detail-section" v-if="approvalDetail.status === 'processed'">
        <text class="section-title">处理结果</text>
        <view class="result-item">
          <text class="result-label">处理状态：</text>
          <text class="result-value">{{ approvalDetail.result }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">处理时间：</text>
          <text class="result-value">{{ approvalDetail.processTime }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">处理意见：</text>
          <text class="result-value">{{ approvalDetail.comment }}</text>
        </view>
      </view>
    </view>
    <view class="detail-footer" v-if="approvalDetail.status === 'pending' || !approvalDetail.status">
      <button class="btn-reject" @click="handleReject">拒绝</button>
      <button class="btn-approve" @click="handleApprove">批准</button>
    </view>
  </view>
</template>

<script>
import API from '@/api'

export default {
  data() {
    return {
      approvalDetail: {
        flowTitle: '',
        flowName: '',
        stepName: '',
        createUser: '',
        createTime: '',
        recTime: '',
        urgency: 0,
        passTime: 0,
        content: '',
        status: '',
        attachments: [],
        result: '',
        processTime: '',
        comment: ''
      },
      params: {
        runId: '',
        stepRunId: '',
        flowId: ''
      }
    }
  },
  onLoad(options) {
    // 接收参数
    this.params.runId = options.runId || ''
    this.params.stepRunId = options.stepRunId || ''
    this.params.flowId = options.flowId || ''
    
    console.log('Approval Params:', this.params)
    
    // 加载审批详情
    this.fetchApprovalDetail()
  },
  methods: {
    // 获取审批详情
    async fetchApprovalDetail() {
      if (!this.params.runId) return
      
      try {
        // 调用获取审批详情的API
        const res = await API.bpm.bpmStepRun.getBpmFlowDetail.get({
          runId: this.params.runId,
          stepRunId: this.params.stepRunId,
          flowId: this.params.flowId
        })
        
        if (res.code === 200) {
          // 解析返回的数据
          const data = res.data || {}
          this.approvalDetail = {
            flowTitle: data.flowTitle || data.title || '',
            flowName: data.flowName || '',
            stepName: data.stepName || '',
            createUser: data.createUser || data.submitter || '',
            createTime: data.createTime || data.submitTime || '',
            recTime: data.recTime || '',
            urgency: data.urgency || 0,
            passTime: data.passTime || 0,
            content: data.content || '暂无内容',
            status: data.status || '',
            attachments: data.attachments || [],
            result: data.result || '',
            processTime: data.processTime || '',
            comment: data.comment || ''
          }
        } else {
          uni.showToast({ title: res.message || '获取详情失败', icon: 'none' })
        }
      } catch (error) {
        console.error('获取审批详情失败:', error)
        uni.showToast({ title: '获取详情失败', icon: 'none' })
      }
    },
    // 批准
    handleApprove() {
      uni.showModal({
        title: '批准',
        content: '确定要批准该申请吗？',
        success: (res) => {
          if (res.confirm) {
            // 这里应该调用批准API
            uni.showToast({
              title: '批准成功',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        }
      })
    },
    // 拒绝
    handleReject() {
      uni.showModal({
        title: '拒绝',
        content: '确定要拒绝该申请吗？',
        success: (res) => {
          if (res.confirm) {
            // 这里应该调用拒绝API
            uni.showToast({
              title: '拒绝成功',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        }
      })
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        pending: '待审批',
        processed: '已处理',
        approved: '已批准',
        rejected: '已拒绝'
      }
      return statusMap[status] || '未知状态'
    },
    // 获取状态样式类
    getStatusClass(status) {
      const classMap = {
        pending: 'status-pending',
        processed: 'status-processed',
        approved: 'status-approved',
        rejected: 'status-rejected'
      }
      return classMap[status] || ''
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

<style lang="scss">
.approval-detail-container {
  padding: 15px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  flex: 1;
  margin-right: 10px;
}

.detail-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-processed {
  background: #f6ffed;
  color: #52c41a;
}

.status-approved {
  background: #f6ffed;
  color: #52c41a;
}

.status-rejected {
  background: #fff1f0;
  color: #ff4d4f;
}

.detail-body {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  font-size: 13px;
  color: #999;
  width: 80px;
}

.info-value {
  font-size: 13px;
  color: #262626;
  flex: 1;
}

.content-box {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
}

.content-text {
  font-size: 14px;
  color: #5a5a5a;
  line-height: 1.5;
}

.attachment-list {
  margin-top: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.attachment-item:last-child {
  border-bottom: none;
}

.attachment-name {
  flex: 1;
  font-size: 13px;
  color: #262626;
  margin-left: 10px;
}

.attachment-size {
  font-size: 12px;
  color: #999;
}

.result-item {
  display: flex;
  margin-bottom: 10px;
}

.result-label {
  font-size: 13px;
  color: #999;
  width: 80px;
}

.result-value {
  font-size: 13px;
  color: #262626;
  flex: 1;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.btn-reject {
  flex: 1;
  height: 48px;
  background-color: #fff;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.btn-approve {
  flex: 1;
  height: 48px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}
</style>