<template>
  <view class="approval-detail-container">
    <view class="detail-header">
      <text class="detail-title">{{ bpmList.flowTitle || '流程详情' }}</text>
      <text class="detail-status" :class="getStatusClass(bpmList.status)">
        {{ getStatusText(bpmList.status) }}
      </text>
    </view>
    <view class="detail-body">
      <view class="detail-section">
        <text class="section-title">基本信息</text>
        <view class="info-item">
          <text class="info-label">流程名称：</text>
          <text class="info-value">{{ bpmList.flowName || '未知流程' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">流水号：</text>
          <text class="info-value">{{ bpmList.id || '' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">提交人：</text>
          <text class="info-value">{{ bpmList.createUser || '未知' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">提交时间：</text>
          <text class="info-value">{{ bpmList.createTime || '' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">紧急程度：</text>
          <text class="info-value">{{ getUrgencyText(bpmList.urgency) }}</text>
        </view>
      </view>
      <view class="detail-section">
        <text class="section-title">审批内容</text>
        <view class="content-box">
          <text v-if="loading">加载中...</text>
          <view v-else>
            <!-- 解析并显示表单数据 -->
            <view v-if="formJson && formJson.widgetList" class="form-fields">
              <view class="form-rows">
                <view v-for="(widget, index) in formJson.widgetList" :key="widget.id || index">
                  <!-- 处理表格类型：将所有元素提取出来，按照从上到下的顺序排列 -->
                  <template v-if="widget.type === 'table' && widget.rows">
                    <view v-for="(row, rowIndex) in widget.rows" :key="row.id || rowIndex">
                      <view v-for="(col, colIndex) in row.cols" :key="col.id || colIndex">
                        <view v-for="(subWidget, subIndex) in (col.widgetList || [])" :key="subWidget.id || subIndex">
                          <!-- 处理日期类型 -->
                          <template v-if="(subWidget.type === 'date' || subWidget.type === 'date-range') && subWidget.formItemFlag !== false && subWidget.options">
                            <view class="form-field">
                              <text class="field-label">{{ subWidget.options.label || subWidget.options.name || '' }}：</text>
                              <view class="field-input">
                                <text class="field-value">{{ subWidget.options.defaultValue ? (subWidget.type === 'date-range' ? subWidget.options.defaultValue.join(' ~ ') : subWidget.options.defaultValue) : '无' }}</text>
                              </view>
                            </view>
                          </template>
                          <!-- 处理输入框类型 -->
                          <template v-else-if="subWidget.type === 'input' && subWidget.formItemFlag !== false && subWidget.options">
                            <view class="form-field">
                              <text class="field-label">{{ subWidget.options.label || subWidget.options.name || '' }}：</text>
                              <view class="field-input">
                                <text class="field-value">{{ subWidget.options.defaultValue || '无' }}</text>
                              </view>
                            </view>
                          </template>
                          <!-- 处理其他类型 -->
                          <template v-else>
                            <view v-html="renderWidget(subWidget)"></view>
                          </template>
                        </view>
                      </view>
                    </view>
                  </template>
                  <!-- 处理网格类型：将所有元素提取出来，按照从上到下的顺序排列 -->
                  <template v-else-if="widget.type === 'grid' && widget.cols">
                    <view v-for="(col, colIndex) in widget.cols" :key="col.id || colIndex">
                      <view v-for="(subWidget, subIndex) in (col.widgetList || [])" :key="subWidget.id || subIndex">
                        <!-- 处理日期类型 -->
                        <template v-if="(subWidget.type === 'date' || subWidget.type === 'date-range') && subWidget.formItemFlag !== false && subWidget.options">
                          <view class="form-field">
                            <text class="field-label">{{ subWidget.options.label || subWidget.options.name || '' }}：</text>
                            <view class="field-input">
                              <text class="field-value">{{ subWidget.options.defaultValue ? (subWidget.type === 'date-range' ? subWidget.options.defaultValue.join(' ~ ') : subWidget.options.defaultValue) : '无' }}</text>
                            </view>
                          </view>
                        </template>
                        <!-- 处理输入框类型 -->
                        <template v-else-if="subWidget.type === 'input' && subWidget.formItemFlag !== false && subWidget.options">
                          <view class="form-field">
                            <text class="field-label">{{ subWidget.options.label || subWidget.options.name || '' }}：</text>
                            <view class="field-input">
                              <text class="field-value">{{ subWidget.options.defaultValue || '无' }}</text>
                            </view>
                          </view>
                        </template>
                        <!-- 处理其他类型 -->
                        <template v-else>
                          <view v-html="renderWidget(subWidget)"></view>
                        </template>
                      </view>
                    </view>
                  </template>
                  <!-- 处理其他类型 -->
                  <template v-else>
                    <!-- 处理日期类型 -->
                    <template v-if="(widget.type === 'date' || widget.type === 'date-range') && widget.formItemFlag !== false && widget.options">
                      <view class="form-field">
                        <text class="field-label">{{ widget.options.label || widget.options.name || '' }}：</text>
                        <view class="field-input">
                          <text class="field-value">{{ widget.options.defaultValue ? (widget.type === 'date-range' ? widget.options.defaultValue.join(' ~ ') : widget.options.defaultValue) : '无' }}</text>
                        </view>
                      </view>
                    </template>
                    <!-- 处理输入框类型 -->
                    <template v-else-if="widget.type === 'input' && widget.formItemFlag !== false && widget.options">
                      <view class="form-field">
                        <text class="field-label">{{ widget.options.label || widget.options.name || '' }}：</text>
                        <view class="field-input">
                          <text class="field-value">{{ widget.options.defaultValue || '无' }}</text>
                        </view>
                      </view>
                    </template>
                    <!-- 处理其他类型 -->
                    <template v-else>
                      <view v-html="renderWidget(widget)"></view>
                    </template>
                  </template>
                </view>
              </view>
            </view>
            <text v-else>暂无表单数据</text>
          </view>
        </view>
      </view>
      <view class="detail-section" v-if="bpmList.runAttach">
        <text class="section-title">附件</text>
        <view class="attachment-list">
          <view class="attachment-item">
            <text class="attachment-name">{{ bpmList.runAttach }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import API from '@/api'

export default {
  data() {
    return {
      // 加载状态
      loading: true,
      // 流程信息
      bpmList: {
        id: '',
        runId: '',
        flowId: '',
        flowTitle: '',
        createUser: '',
        createTime: '',
        urgency: '0',
        status: '',
        runAttach: ''
      },
      // 表单信息
      formJson: null,
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
        const res = await API.bpm.bpmForm.getBpmFormDetailsByRunId.get({
          runId: this.params.runId
        })
        
        console.log('获取审批详情响应:', res)
        
        if (res.code === 200) {
          // 解析返回的数据
          const data = res.data || {}
          this.bpmList = data.bpmList || this.bpmList
          this.formJson = data.formJson || null
        } else {
          uni.showToast({ title: res.message || '获取详情失败', icon: 'none' })
          // 即使失败，也设置为空对象，避免页面崩溃
          this.formJson = null
        }
      } catch (error) {
        console.error('获取审批详情失败:', error)
        uni.showToast({ title: error.msg || '获取详情失败', icon: 'none' })
        // 即使出错，也设置为空对象，避免页面崩溃
        this.formJson = null
      } finally {
        this.loading = false
      }
    },
    // 渲染单个组件
    renderWidget(widget) {
      if (!widget) return ''
      
      // 处理容器类型组件
      if (widget.category === 'container') {
        // 网格和表格类型已经在模板中处理，这里跳过
        if (widget.type === 'grid' || widget.type === 'table') {
          return ''
        }
        
        // 处理其他容器类型
        if (widget.widgetList) {
          return widget.widgetList.map((subWidget, subIndex) => {
            return this.renderWidget(subWidget)
          }).join('')
        }
      }
      
      // 处理字段类型组件
      if (widget.formItemFlag !== false) {
        const label = widget.options ? (widget.options.label || widget.options.name || '') : ''
        let value = ''
        
        if (widget.type === 'input' && widget.options && widget.options.name) {
          if (widget.options.type === 'text') {
            value = widget.options.defaultValue || ''
            return `<view class="form-field"><text class="field-label">${label}：</text><view class="field-input"><text class="field-value">${value || '无'}</text></view></view>`
          } else if (widget.options.type === 'textarea') {
            value = widget.options.defaultValue || ''
            return `<view class="form-field"><text class="field-label">${label}：</text><view class="field-input"><text class="field-value">${value || '无'}</text></view></view>`
          }
        } else if (widget.type === 'date-range' && widget.options && widget.options.name) {
          value = widget.options.defaultValue ? widget.options.defaultValue.join(' ~ ') : ''
          return `<view class="form-field"><text class="field-label">${label}：</text><view class="field-input"><text class="field-value">${value || '无'}</text></view></view>`
        } else if (widget.type === 'date' && widget.options && widget.options.name) {
          value = widget.options.defaultValue || ''
          return `<view class="form-field"><text class="field-label">${label}：</text><view class="field-input"><text class="field-value">${value || '无'}</text></view></view>`
        } else {
          value = widget.options ? widget.options.defaultValue || '' : ''
          return `<view class="form-field"><text class="field-label">${label}：</text><view class="field-input"><text class="field-value">${value || '无'}</text></view></view>`
        }
      }
      
      // 处理静态文本
      if (widget.type === 'static-text') {
        const text = widget.options ? widget.options.textContent || '' : ''
        return `<view class="static-text-widget"><text class="static-text">${text}</text></view>`
      }
      
      // 处理HTML文本
      if (widget.type === 'html-text') {
        const html = widget.options ? widget.options.htmlContent || '' : ''
        return `<view class="html-text-widget"><text class="html-text">${html}</text></view>`
      }
      
      // 默认空
      return ''
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        '0': '处理中',
        '1': '已结束',
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
        '0': 'status-processing',
        '1': 'status-end',
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
        '0': '一般',
        '1': '紧急',
        '2': '加急'
      }
      return urgencyMap[urgency] || '未知'
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

/* 表单字段样式 */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-field {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.field-label {
  width: 100px;
  font-size: 13px;
  color: #999;
  flex-shrink: 0;
}

.field-input {
  flex: 1;
  font-size: 13px;
  color: #262626;
  word-break: break-word;
}

.field-value {
  font-size: 13px;
  color: #262626;
  word-break: break-word;
}

.static-text-widget {
  margin: 10px 0;
}

.static-text {
  font-size: 13px;
  color: #262626;
  line-height: 1.5;
}

.html-text-widget {
  margin: 10px 0;
}

.html-text {
  font-size: 13px;
  color: #262626;
  line-height: 1.5;
}

.status-processing {
  background: #fff7e6;
  color: #fa8c16;
}

.status-end {
  background: #f6ffed;
  color: #52c41a;
}
</style>