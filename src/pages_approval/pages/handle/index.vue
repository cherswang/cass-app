<template>
  <view class="handle-container">
    <!-- 头部信息 -->
    <view class="handle-header">
      <view class="header-left">
        <text class="flow-title">{{ bpmList.flowTitle }}</text>
      </view>
      <view class="header-right">
        <text class="step-name">{{ bpmStep.stepName }}</text>
      </view>
    </view>

    <!-- 流程表单 -->
    <view class="form-section">
      <text class="section-title">表单内容</text>
      <view class="form-content">
        <text v-if="loading">加载中...</text>
        <view v-else>
          <!-- 解析并显示表单数据 -->
          <view v-if="formJson && formJson.widgetList" class="form-fields">
            <!-- 递归解析widgetList -->
            <view class="form-rows">
              <widget-item v-for="(widget, index) in formJson.widgetList" :key="widget.id || index" :widget="widget" />
            </view>
          </view>
          <view v-else-if="formData" class="form-fields">
            <view class="form-other-fields">
              <view v-for="(value, key) in formData" :key="key" class="form-field">
                <text class="field-label">{{ getFieldLabel(key) }}：</text>
                <text class="field-value">{{ formatFieldValue(value) }}</text>
              </view>
            </view>
          </view>
          <text v-else>暂无表单数据</text>
        </view>
      </view>
    </view>



    <!-- 审批意见 -->
    <view class="approval-section">
      <view class="approval-content">
        <!-- 会签意见输入 -->
        <view class="approval-comment">
          <text class="comment-title">会签意见</text>
          <textarea class="comment-input" v-model="bpmStepRun.ideaText" placeholder="请输入审批意见"></textarea>
        </view>

        <!-- 常用意见 -->
        <view class="common-ideas" v-if="commIdeaTextList.length > 0">
          <text class="ideas-label">常用意见：</text>
          <view class="ideas-list">
            <text class="idea-item" v-for="(item, index) in commIdeaTextList" :key="index" @click="bpmStepRun.ideaText = item">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <text class="buttons-title">审批意见</text>
      <view class="buttons-container">
        <button class="btn reject" @click="handleReject">不同意</button>
        <button class="btn approve" @click="handleApprove">同意</button>
      </view>
    </view>
  </view>
</template>

<script>
import API from '@/api/model/bpm';

export default {
  components: {
    'widget-item': {
      props: {
        widget: {
          type: Object,
          required: true
        }
      },
      template: `
        <view>
          <!-- 处理表格类型 -->
          <view v-if="widget.type === 'table' && widget.rows" class="table-widget">
            <view v-for="(row, rowIndex) in widget.rows" :key="row.id || rowIndex" class="table-row">
              <view v-for="(col, colIndex) in row.cols" :key="col.id || colIndex" class="table-col">
                <widget-item v-for="(subWidget, subIndex) in col.widgetList" :key="subWidget.id || subIndex" :widget="subWidget" />
              </view>
            </view>
          </view>
          <!-- 处理网格类型 -->
          <view v-else-if="widget.type === 'grid' && widget.cols" class="grid-widget">
            <view v-for="(col, colIndex) in widget.cols" :key="col.id || colIndex" class="grid-col">
              <widget-item v-for="(subWidget, subIndex) in col.widgetList" :key="subWidget.id || subIndex" :widget="subWidget" />
            </view>
          </view>
          <!-- 处理静态文本 -->
          <view v-else-if="widget.type === 'static-text'" class="static-text-widget">
            <text class="static-text">{{ widget.options.textContent }}</text>
          </view>
          <!-- 处理表单字段 -->
          <view v-else-if="widget.formItemFlag !== false" class="form-field">
            <text class="field-label">{{ widget.options.label || widget.options.name }}：</text>
            <view class="field-input">
              <input v-if="widget.options.type === 'text'" :value="widget.options.defaultValue" disabled />
              <textarea v-else-if="widget.options.type === 'textarea'" :value="widget.options.defaultValue" disabled></textarea>
              <text v-else class="field-value">{{ widget.options.defaultValue || '无' }}</text>
            </view>
          </view>
          <!-- 递归处理其他容器类型 -->
          <view v-else-if="widget.widgetList" class="container-widget">
            <widget-item v-for="(subWidget, subIndex) in widget.widgetList" :key="subWidget.id || subIndex" :widget="subWidget" />
          </view>
        </view>
      `
    }
  },
  data() {
    return {
      // 加载状态
      loading: true,
      // 流程信息
      bpmList: {
        runId: '',
        flowId: '',
        flowTitle: '',
        urgency: '0',
        followFlag: false,
        runAttach: ''
      },
      // 步骤信息
      bpmStep: {
        stepName: '',
        approval: '0',
        goBack: '0'
      },
      // 步骤运行信息
      bpmStepRun: {
        opFlag: '0',
        stepRunId: '',
        ideaText: '',
        passStatus: '1',
        stepAttach: ''
      },
      // 表单信息
      formJson: null,
      formData: null,
      // 常用意见
      commIdeaTextList: []
    };
  },
  onLoad(options) {
    console.log('办理页面接收的参数:', options);
    // 接收参数
    this.bpmList.runId = options.runId || '';
    this.bpmList.flowId = options.flowId || '';
    this.bpmList.flowTitle = options.flowTitle || '';
    this.bpmList.urgency = options.urgency || '0';
    this.bpmStepRun.stepRunId = options.stepRunId || '';
    
    console.log('处理后的参数:', {
      runId: this.bpmList.runId,
      flowId: this.bpmList.flowId,
      stepRunId: this.bpmStepRun.stepRunId
    });
    
    // 加载数据
    this.getHandleBpmFormDataBean();
    this.getBpmCommIdeaList();
  },
  methods: {
    // 获取办理表单数据
    async getHandleBpmFormDataBean() {
      try {
        console.log('准备获取办理表单数据，参数:', {
          flowId: this.bpmList.flowId,
          runId: this.bpmList.runId,
          stepRunId: this.bpmStepRun.stepRunId
        });
        // 参考Vue后台的参数顺序
        const res = await API.bpmForm.getHandleBpmFormDataBean.get({
          flowId: this.bpmList.flowId,
          runId: this.bpmList.runId,
          stepRunId: this.bpmStepRun.stepRunId
        });
        console.log('获取办理表单数据响应:', res);
        if (res.code === 200) {
          const data = res.data || {};
          // 直接赋值，参考Vue后台的处理方式
          this.bpmList = data.bpmList || this.bpmList;
          this.bpmStep = data.bpmStep || this.bpmStep;
          this.bpmStepRun = data.bpmStepRun || this.bpmStepRun;
          this.formJson = data.formJson;
          this.formData = data.formData;
          // 设置页面标题
          uni.setNavigationBarTitle({ title: this.bpmList.flowTitle || '流程办理' });
        } else if (res.code === 100) {
          // 重复处理错误，但是Vue后台能够获取到数据，可能是参数问题
          console.error('流程重复处理错误，但是Vue后台能够获取到数据，可能是参数问题');
          // 尝试使用不同的参数顺序
          try {
            console.log('尝试使用不同的参数顺序');
            const res2 = await API.bpmForm.getHandleBpmFormDataBean.get({
              runId: this.bpmList.runId,
              stepRunId: this.bpmStepRun.stepRunId,
              flowId: this.bpmList.flowId
            });
            console.log('使用不同参数顺序的响应:', res2);
            if (res2.code === 200) {
              const data = res2.data || {};
              this.bpmList = data.bpmList || this.bpmList;
              this.bpmStep = data.bpmStep || this.bpmStep;
              this.bpmStepRun = data.bpmStepRun || this.bpmStepRun;
              this.formJson = data.formJson;
              this.formData = data.formData;
              uni.setNavigationBarTitle({ title: this.bpmList.flowTitle || '流程办理' });
            } else {
              uni.showToast({ title: res2.message || '获取数据失败', icon: 'none' });
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            }
          } catch (error) {
            console.error('尝试不同参数顺序失败:', error);
            uni.showToast({ title: '获取数据失败', icon: 'none' });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        } else {
          // 其他错误
          uni.showToast({ title: res.message || '获取数据失败', icon: 'none' });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      } catch (error) {
        console.error('获取办理表单数据失败:', error);
        uni.showToast({ title: '获取数据失败', icon: 'none' });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } finally {
        this.loading = false;
      }
    },
    
    // 获取常用审批意见
    async getBpmCommIdeaList() {
      try {
        const res = await API.bpmCommIdea.getBpmCommIdeaList.get();
        if (res.code === 200) {
          this.commIdeaTextList = res.data || [];
        }
      } catch (error) {
        console.error('获取常用审批意见失败:', error);
      }
    },
    
    // 同意
    async handleApprove() {
      this.bpmStepRun.passStatus = '1';
      await this.sendBpmToNext();
    },
    
    // 不同意
    async handleReject() {
      this.bpmStepRun.passStatus = '0';
      await this.sendBpmToNext();
    },
    
    // 提交到下一步
    async sendBpmToNext() {
      try {
        const res = await API.bpmStepRun.goNextStep.post({
          runId: this.bpmList.runId,
          stepRunId: this.bpmStepRun.stepRunId,
          flowId: this.bpmList.flowId,
          ideaText: this.bpmStepRun.ideaText,
          passStatus: this.bpmStepRun.passStatus,
          urgency: this.bpmList.urgency
        });
        
        if (res.code === 200) {
          uni.showToast({ title: '提交成功', icon: 'success' });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          uni.showToast({ title: res.message || '提交失败', icon: 'none' });
        }
      } catch (error) {
        console.error('提交失败:', error);
        uni.showToast({ title: '提交失败', icon: 'none' });
      }
    },
    
    // 获取字段标签
    getFieldLabel(key) {
      // 这里可以根据key映射到对应的中文标签
      // 暂时直接返回key
      return key;
    },
    
    // 格式化字段值
    formatFieldValue(value) {
      if (value === null || value === undefined) {
        return '无';
      }
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return value.toString();
    },
    
    // 返回上一页
    navigateBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss">
.handle-container {
  padding: 15px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.handle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.flow-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.step-name {
  font-size: 14px;
  color: #666;
  background-color: #f0f0f0;
  padding: 4px 10px;
  border-radius: 12px;
}

.urgency-section {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.urgency-options {
  display: flex;
  gap: 10px;
}

.urgency-item {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 16px;
  font-size: 13px;
  color: #666;
  transition: all 0.3s;
}

.urgency-item.active {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.form-section {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-content {
  min-height: 100px;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.approval-section {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.approval-status {
  margin-bottom: 15px;
}

.status-label {
  font-size: 14px;
  color: #666;
  margin-right: 10px;
}

.status-options {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.status-item {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 16px;
  font-size: 13px;
  color: #666;
  transition: all 0.3s;
}

.status-item.active {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.approval-comment {
  margin-bottom: 15px;
}

.comment-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.comment-input {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  resize: none;
}

.common-ideas {
  margin-top: 10px;
}

.ideas-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.ideas-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.idea-item {
  padding: 4px 12px;
  background-color: #f0f0f0;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.action-buttons {
  margin-top: 20px;
}

.buttons-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.buttons-container {
  display: flex;
  gap: 15px;
}

.btn {
  flex: 1;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  border: none;
}

.btn.reject {
  background-color: #ff4d4f;
  color: white;
}

.btn.approve {
  background-color: #52c41a;
  color: white;
}

.comment-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.field-value {
  font-size: 14px;
  color: #666;
  padding: 8px;
  background-color: #fafafa;
  border-radius: 4px;
  word-break: break-all;
}

.field-input {
  width: 100%;
}

.field-input input,
.field-input textarea {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  color: #666;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-sizing: border-box;
}

.field-input textarea {
  min-height: 80px;
  resize: none;
}

.form-rows {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.form-other-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 递归组件样式 */
.table-widget {
  margin: 10px 0;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
}

.table-row:last-child {
  border-bottom: none;
}

.table-col {
  flex: 1;
  padding: 10px;
  border-right: 1px solid #e8e8e8;
}

.table-col:last-child {
  border-right: none;
}

.grid-widget {
  margin: 10px 0;
}

.grid-col {
  margin: 5px 0;
}

.static-text-widget {
  margin: 10px 0;
  padding: 10px;
  text-align: center;
}

.static-text {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.container-widget {
  margin: 5px 0;
}

/* 表单字段样式 */
.form-field {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.field-input {
  width: 100%;
}
</style>