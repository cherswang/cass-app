<template>
  <view class="delegate-dialog" v-if="visible">
    <view class="dialog-mask" @click="close"></view>
    <view class="dialog-content">
      <view class="dialog-header">
        <text class="dialog-title">委托办理</text>
        <text class="dialog-close" @click="close">×</text>
      </view>
      <view class="dialog-body">
        <view class="delegate-info">
          <text class="info-label">流程标题：</text>
          <text class="info-value">{{ flowTitle }}</text>
        </view>
        <view class="delegate-form">
          <view class="delegate-form-item">
            <text class="delegate-form-label">委托给：</text>
            <view class="delegate-picker-container">
              <picker 
                mode="selector" 
                :range="delegateUsers" 
                :range-key="'userName'" 
                :value="selectedUserIndex"
                @change="handleUserChange"
              >
                <view class="delegate-picker">
                  <text>{{ delegateUsers[selectedUserIndex]?.userName || '请选择' }}</text>
                </view>
              </picker>
            </view>
          </view>
          <view class="delegate-form-item">
            <view class="delegate-checkbox-container">
              <checkbox-group @change="handleMsgTypeChange">
                <checkbox 
                  :checked="msgTypeChecked"
                  value="1"
                  class="delegate-checkbox"
                />
              </checkbox-group>
              <text class="delegate-checkbox-label">消息提醒</text>
            </view>
          </view>
        </view>
      </view>
      <view class="dialog-footer">
        <button class="dialog-btn cancel-btn" @click="close">取消</button>
        <button class="dialog-btn confirm-btn" :loading="loading" @click="submit">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
import API from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    flowTitle: {
      type: String,
      default: ''
    },
    runId: {
      type: String,
      default: ''
    },
    stepRunId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      delegateUsers: [],
      selectedUserIndex: -1,
      msgType: '',
      msgTypeChecked: false,
      loading: false
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initData()
      }
    }
  },
  methods: {
    // 初始化数据
    async initData() {
      await this.getDelegateUserList()
    },
    
    // 获取可委托用户列表
    async getDelegateUserList() {
      try {
        const res = await API.bpm.bpmDelegate.getDelegateUserList.get({ runId: this.runId, stepRunId: this.stepRunId })
        if (res.code === 200) {
          this.delegateUsers = res.data || []
          this.selectedUserIndex = -1
          this.msgType = ''
          this.msgTypeChecked = false
        } else {
          uni.showToast({ title: res.message || '获取用户列表失败', icon: 'none' })
        }
      } catch (error) {
        console.error('获取委托用户列表失败:', error)
        uni.showToast({ title: '获取用户列表失败', icon: 'none' })
      }
    },
    
    // 处理用户选择
    handleUserChange(event) {
      this.selectedUserIndex = event.detail.value
    },
    
    // 处理消息提醒选择
    handleMsgTypeChange(event) {
      const isChecked = event.detail.value.length > 0
      this.msgTypeChecked = isChecked
      this.msgType = isChecked ? 'appSms' : ''
    },
    
    // 提交委托
    async submit() {
      if (this.selectedUserIndex < 0 || !this.delegateUsers[this.selectedUserIndex]) {
        uni.showToast({ title: '请选择委托人员', icon: 'none' })
        return
      }
      
      const selectedUser = this.delegateUsers[this.selectedUserIndex]
      this.loading = true
      try {
        const res = await API.bpm.bpmStepRun.changeBpmStepRunUser.post({
          runId: this.runId,
          stepRunId: this.stepRunId,
          accountId: selectedUser.accountId,
          msgType: this.msgType
        }, {
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        
        if (res.code === 200) {
          uni.showToast({ title: '委托成功', icon: 'success' })
          this.close()
          this.$emit('success')
        } else {
          uni.showToast({ title: res.message || '委托失败', icon: 'none' })
        }
      } catch (error) {
        console.error('提交委托失败:', error)
        uni.showToast({ title: '委托失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    
    // 关闭对话框
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.delegate-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  position: relative;
  width: 80%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  z-index: 10000;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.dialog-close {
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 0 5px;
}

.dialog-body {
  padding: 20px;
}

.delegate-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.info-label {
  font-size: 14px;
  color: #666;
  margin-right: 10px;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.delegate-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.delegate-form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.delegate-form-label {
  font-size: 14px;
  color: #666;
  width: 80px;
  flex-shrink: 0;
}

.delegate-picker-container {
  flex: 1;
}

.delegate-picker {
  padding: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  text-align: right;
}

.delegate-checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.delegate-checkbox {
  transform: scale(0.9);
}

.delegate-checkbox-label {
  font-size: 14px;
  color: #666;
}

.dialog-footer {
  display: flex;
  border-top: 1px solid #f0f0f0;
  padding: 15px;
  justify-content: center;
  gap: 15px;
}

.dialog-btn {
  padding: 8px 20px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  height: 36px;
  line-height: 18px;
  border-radius: 4px;
  min-width: 100px;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
  border-right: 1px solid #f0f0f0;
}

.confirm-btn {
  background-color: #1890ff;
  color: white;
}

.confirm-btn:active {
  background-color: #40a9ff;
}
</style>