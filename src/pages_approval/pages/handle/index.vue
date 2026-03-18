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
            <view class="form-rows">
              <view v-for="(widget, index) in formJson.widgetList" :key="widget.id || index">
                <!-- 处理表格类型 -->
                <view v-if="widget.type === 'table' && widget.rows" class="table-widget">
                  <view v-for="(row, rowIndex) in widget.rows" :key="row.id || rowIndex" class="table-row">
                    <view v-for="(col, colIndex) in row.cols" :key="col.id || colIndex" class="table-col">
                      <view v-for="(subWidget, subIndex) in (col.widgetList || [])" :key="subWidget.id || subIndex">
                        <view v-html="renderWidget(subWidget)"></view>
                      </view>
                    </view>
                  </view>
                </view>
                <!-- 处理网格类型 -->
                <view v-else-if="widget.type === 'grid' && widget.cols" class="grid-widget">
                  <view v-for="(col, colIndex) in widget.cols" :key="col.id || colIndex" class="grid-col">
                    <view v-for="(subWidget, subIndex) in (col.widgetList || [])" :key="subWidget.id || subIndex">
                      <view v-html="renderWidget(subWidget)"></view>
                    </view>
                  </view>
                </view>
                <!-- 处理其他类型 -->
                <view v-else v-html="renderWidget(widget)"></view>
              </view>
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
        <!-- 审批状态选择 -->
        <view class="approval-status">
          <text class="status-label">审批意见：</text>
          <view class="status-options">
            <view class="status-item" :class="{ active: bpmStepRun.passStatus === '1' }" @click="bpmStepRun.passStatus = '1'">同意</view>
            <view class="status-item" :class="{ active: bpmStepRun.passStatus === '0' }" @click="bpmStepRun.passStatus = '0'">不同意</view>
          </view>
        </view>

        <!-- 会签意见输入 -->
        <view class="approval-comment">
          <text class="comment-title">会签意见</text>
          <textarea class="comment-input" v-model="bpmStepRun.ideaText" placeholder="请输入会签意见"></textarea>
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
      <view class="buttons-container">
        <button class="btn save" @click="saveFormData">保存</button>
        <button class="btn submit" @click="sendBpmToNext">提交</button>
      </view>
    </view>
  </view>
</template>

<script>
import API from '@/api';

export default {
  components: {},
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
        stepId: '',
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
        stepAttach: '',
        signBase64: ''
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
    this.bpmList.flowTitle = options.flowTitle ? decodeURIComponent(options.flowTitle) : '';
    this.bpmList.urgency = options.urgency || '0';
    this.bpmStepRun.stepRunId = options.stepRunId || '';
    const opType = options.opType || '';
    
    console.log('处理后的参数:', {
      runId: this.bpmList.runId,
      flowId: this.bpmList.flowId,
      stepRunId: this.bpmStepRun.stepRunId,
      opType: opType
    });
    
    // 加载数据
    if (opType === 'start') {
      this.getCreateBpmFormDataBean();
    } else {
      this.getHandleBpmFormDataBean();
    }
    this.getBpmCommIdeaList();
  },
  methods: {
    // 渲染单个组件
    renderWidget(widget) {
      if (!widget) return '';
      
      // 处理容器类型组件
      if (widget.category === 'container') {
        // 处理网格容器
        if (widget.type === 'grid' && widget.cols) {
          return widget.cols.map((col, colIndex) => {
            return col.widgetList ? col.widgetList.map((subWidget, subIndex) => {
              return this.renderWidget(subWidget);
            }).join('') : '';
          }).join('');
        }
        
        // 处理表格容器
        if (widget.type === 'table' && widget.rows) {
          return widget.rows.map((row, rowIndex) => {
            return row.cols ? row.cols.map((col, colIndex) => {
              return col.widgetList ? col.widgetList.map((subWidget, subIndex) => {
                return this.renderWidget(subWidget);
              }).join('') : '';
            }).join('') : '';
          }).join('');
        }
        
        // 处理其他容器类型
        if (widget.widgetList) {
          return widget.widgetList.map((subWidget, subIndex) => {
            return this.renderWidget(subWidget);
          }).join('');
        }
      }
      
      // 处理字段类型组件
      if (widget.formItemFlag !== false) {
        const label = widget.options ? (widget.options.label || widget.options.name || '') : '';
        let value = '';
        
        if (widget.type === 'input' && widget.options) {
          if (widget.options.type === 'text') {
            value = widget.options.defaultValue || '';
            return `<view class="form-field"><text class="field-label">${label}：</text><view class="field-input"><input value="${value}" disabled /></view></view>`;
          } else if (widget.options.type === 'textarea') {
            value = widget.options.defaultValue || '';
            return `<view class="form-field"><text class="field-label">${label}：</text><view class="field-input"><textarea value="${value}" disabled></textarea></view></view>`;
          }
        } else if (widget.type === 'date-range' && widget.options && widget.options.defaultValue) {
          value = widget.options.defaultValue.join(' ~ ');
          return `<view class="form-field"><text class="field-label">${label}：</text><view class="field-input"><text class="field-value">${value}</text></view></view>`;
        } else {
          value = widget.options ? widget.options.defaultValue || '无' : '无';
          return `<view class="form-field"><text class="field-label">${label}：</text><view class="field-input"><text class="field-value">${value}</text></view></view>`;
        }
      }
      
      // 处理静态文本
      if (widget.type === 'static-text') {
        const text = widget.options ? widget.options.textContent || '' : '';
        return `<view class="static-text-widget"><text class="static-text">${text}</text></view>`;
      }
      
      // 处理HTML文本
      if (widget.type === 'html-text') {
        const html = widget.options ? widget.options.htmlContent || '' : '';
        return `<view class="html-text-widget"><text class="html-text">${html}</text></view>`;
      }
      
      // 默认空
      return '';
    },
    // 获取办理表单数据
    async getHandleBpmFormDataBean() {
      try {
        console.log('准备获取办理表单数据，参数:', {
          flowId: this.bpmList.flowId,
          runId: this.bpmList.runId,
          stepRunId: this.bpmStepRun.stepRunId
        });
        // 参考Vue后台的参数顺序
        const res = await API.bpm.bpmForm.getHandleBpmFormDataBean.get({
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
            const res2 = await API.bpm.bpmForm.getHandleBpmFormDataBean.get({
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
    
    // 获取发起表单数据
    async getCreateBpmFormDataBean() {
      try {
        console.log('准备获取发起表单数据，参数:', {
          flowId: this.bpmList.flowId,
          flowTitle: this.bpmList.flowTitle,
          urgency: this.bpmList.urgency
        });
        const res = await API.bpm.bpmForm.getCreateBpmFormDataBean.get({
          flowId: this.bpmList.flowId,
          flowTitle: this.bpmList.flowTitle,
          urgency: this.bpmList.urgency
        });
        console.log('获取发起表单数据响应:', res);
        if (res.code === 200) {
          const data = res.data || {};
          // 直接赋值，参考Vue后台的处理方式
          this.bpmList = data.bpmList || this.bpmList;
          this.bpmStep = data.bpmStep || this.bpmStep;
          this.bpmStepRun = data.bpmStepRun || this.bpmStepRun;
          this.formJson = data.formJson;
          this.formData = data.formData;
          // 设置页面标题
          uni.setNavigationBarTitle({ title: this.bpmList.flowTitle || '发起流程' });
        } else {
          // 其他错误
          uni.showToast({ title: res.message || '获取数据失败', icon: 'none' });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      } catch (error) {
        console.error('获取发起表单数据失败:', error);
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
        const res = await API.bpm.bpmCommIdea.getBpmCommIdeaList.get();
        if (res.code === 200) {
          this.commIdeaTextList = res.data || [];
        }
      } catch (error) {
        console.error('获取常用审批意见失败:', error);
      }
    },
    
    // 从formJson中提取表单数据
    extractFormData() {
      const formData = {};
      
      // 递归遍历widgetList，提取表单数据
      const traverseWidgets = (widgets) => {
        if (!widgets) return;
        
        widgets.forEach(widget => {
          // 处理容器类型
          if (widget.category === 'container') {
            if (widget.type === 'grid' && widget.cols) {
              widget.cols.forEach(col => {
                if (col.widgetList) {
                  traverseWidgets(col.widgetList);
                }
              });
            } else if (widget.type === 'table' && widget.rows) {
              widget.rows.forEach(row => {
                if (row.cols) {
                  row.cols.forEach(col => {
                    if (col.widgetList) {
                      traverseWidgets(col.widgetList);
                    }
                  });
                }
              });
            } else if (widget.widgetList) {
              traverseWidgets(widget.widgetList);
            }
          } 
          // 处理字段类型
          else if (widget.formItemFlag !== false && widget.options) {
            const name = widget.options.name;
            if (name) {
              let value = widget.options.defaultValue;
              // 确保值的类型正确
              if (value === undefined || value === null) {
                value = '';
              } else if (typeof value === 'object' && value !== null) {
                // 确保对象类型的值能够正确序列化
                value = JSON.parse(JSON.stringify(value));
              }
              formData[name] = value;
            }
          }
        });
      };
      
      // 开始遍历
      if (this.formJson && this.formJson.widgetList) {
        traverseWidgets(this.formJson.widgetList);
      }
      
      return formData;
    },
    
    // 保存表单数据
    async saveFormData() {
      try {
        // 直接使用formData，与Vue后台保持一致
        let formDataToSend = this.formData || {};
        
        // 如果formData为空，尝试从formJson中提取
        if (Object.keys(formDataToSend).length === 0 && this.formJson) {
          console.log('formData为空，尝试从formJson中提取');
          formDataToSend = this.extractFormData();
          console.log('从formJson中提取的表单数据:', formDataToSend);
        }
        
        // 创建请求数据
        const requestData = {
          formData: JSON.stringify(formDataToSend),
          flowId: this.bpmList.flowId || '',
          runId: this.bpmList.runId || '',
          flowTitle: this.bpmList.flowTitle || '',
          urgency: this.bpmList.urgency || '',
          stepRunId: this.bpmStepRun.stepRunId || '',
          signBase64: this.bpmStepRun.signBase64 || '',
          ideaText: this.bpmStepRun.ideaText || '',
          passStatus: this.bpmStepRun.passStatus || '',
          stepAttach: this.bpmStepRun.stepAttach || '',
          runAttach: this.bpmList.runAttach || ''
        };
        
        console.log('使用的表单数据:', formDataToSend);
        console.log('保存表单数据请求参数:', requestData);
        
        // 使用API调用，设置Content-Type为application/x-www-form-urlencoded
        const res = await API.bpm.bpmFormData.saveBpmFormData.post(requestData, {
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        if (res.code === 200) {
          console.log('保存成功');
          uni.showToast({ title: '保存成功', icon: 'success' });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          return res;
        } else {
          uni.showToast({ title: res.message || '保存失败', icon: 'none' });
          throw res;
        }
      } catch (error) {
        console.error('保存失败:', error);
        uni.showToast({ title: '保存失败', icon: 'none' });
        throw error;
      }
    },
    
    // 提交到下一步
    async sendBpmToNext() {
      try {
        console.log('开始提交到下一步');
        console.log('当前bpmStep:', this.bpmStep);
        console.log('当前bpmStepRun:', this.bpmStepRun);
        console.log('当前bpmList:', this.bpmList);
        
        // 先保存表单数据
        await this.saveFormData();
        
        // 获取下一步流程信息
        console.log('准备获取下一步流程信息');
        const nextStepRes = await API.bpm.bpmStepRun.getNextBpmStep.get({
          runId: this.bpmList.runId,
          currentStepId: this.bpmStep.stepId,
          stepRunId: this.bpmStepRun.stepRunId
        });
        
        console.log('获取下一步流程信息响应:', nextStepRes);
        
        if (nextStepRes.code === 200 && nextStepRes.data && nextStepRes.data.length > 0) {
          const nextSteps = nextStepRes.data; // 获取所有下一步步骤
          console.log('下一步流程信息:', nextSteps);
          
          // 构建提交参数，与Vue后台保持一致
          const submitParams = {
            nextStepInfo: JSON.stringify(nextSteps),
            runId: this.bpmList.runId || '',
            stepRunId: this.bpmStepRun.stepRunId || '',
            remindNextUser: '',
            remindCreateUser: '',
            remindParticipant: '',
            msgContent: '',
            autoSendUser: ''
          };
          
          console.log('准备提交到下一步，参数:', submitParams);
          
          // 然后提交到下一步
          // 使用API调用，设置Content-Type为application/x-www-form-urlencoded
          const res = await API.bpm.bpmStepRun.goNextStep.post(submitParams, {
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          
          console.log('提交到下一步响应:', res);
          
          if (res.code === 200) {
            uni.showToast({ title: '提交成功', icon: 'success' });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
            return res;
          } else {
            uni.showToast({ title: res.message || '提交失败', icon: 'none' });
            throw res;
          }
        } else {
          uni.showToast({ title: '未获取到下一步流程信息', icon: 'none' });
          throw new Error('No next step information');
        }
      } catch (error) {
        console.error('提交失败:', error);
        uni.showToast({ title: '提交失败', icon: 'none' });
        throw error;
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
  padding-bottom: 80px;
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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.buttons-container {
  display: flex;
  gap: 15px;
}

.btn {
  flex: 1;
  height: 38px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  transition: all 0.3s;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn.save {
  background-color: #ff4d4f;
  color: white;
}

.btn.submit {
  background-color: #409eff;
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

/* 容器样式 */
.grid-container {
  margin: 10px 0;
}

.grid-col {
  margin: 5px 0;
}

.table-container {
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

.table-cell {
  flex: 1;
  padding: 10px;
  border-right: 1px solid #e8e8e8;
}

.table-cell:last-child {
  border-right: none;
}

.container-widget {
  margin: 10px 0;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>