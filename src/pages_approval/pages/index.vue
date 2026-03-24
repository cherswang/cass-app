<template>
  <view class="approval-container">
    <!-- 顶部筛选栏 -->
    <view class="filter-section">
      <up-dropdown ref="statusDropdown" :active-color="'#1890ff'">
        <up-dropdown-item
          :title="getStatusLabel(selectedStatus)"
          :options="statusOptions"
          v-model="selectedStatus"
          @change="handleStatusChange"
        />
      </up-dropdown>
    </view>
    
    <!-- 审批列表 -->
    <view class="approval-list">
      <!-- 待办 -->
      <BpmWorking 
        v-if="selectedStatus === 'bpmWorking'" 
        :selectedStatus="selectedStatus" 
        @handleDelegate="handleDelegate" 
        @handleRemind="handleRemind" 
      />
      
      <!-- 处理中 -->
      <Processing 
        v-else-if="selectedStatus === 'processing'" 
        :selectedStatus="selectedStatus" 
        @handleRemind="handleRemind" 
      />
      
      <!-- 已结束 -->
      <End 
        v-else-if="selectedStatus === 'end'" 
        :selectedStatus="selectedStatus" 
      />
      
      <!-- 我发起的 -->
      <MyCreate 
        v-else-if="selectedStatus === 'mycreate'" 
        :selectedStatus="selectedStatus" 
      />
      
      <!-- 我关注的 -->
      <Follow 
        v-else-if="selectedStatus === 'follow'" 
        :selectedStatus="selectedStatus" 
      />
      
      <!-- 草稿 -->
      <Drafts 
        v-else-if="selectedStatus === 'drafts'" 
        :selectedStatus="selectedStatus" 
      />
      
      <!-- 抄送我的 -->
      <SendToMe 
        v-else-if="selectedStatus === 'sendtome'" 
        :selectedStatus="selectedStatus" 
      />
      
      <!-- 收藏 -->
      <Collection 
        v-else-if="selectedStatus === 'collection'" 
        :selectedStatus="selectedStatus" 
      />
    </view>
    
    <!-- 委托对话框 -->
    <DelegateDialog 
      :visible="delegateDialog.visible"
      :flow-title="delegateDialog.flowTitle"
      :run-id="delegateDialog.runId"
      :step-run-id="delegateDialog.stepRunId"
      @close="closeDelegateDialog"
      @success="handleDelegateSuccess"
    />
    
  </view>
</template>

<script>
import API from '@/api'
import BpmWorking from '@/components_approval/status/BpmWorking'
import Processing from '@/components_approval/status/Processing'
import End from '@/components_approval/status/End'
import MyCreate from '@/components_approval/status/MyCreate'
import Follow from '@/components_approval/status/Follow'
import Drafts from '@/components_approval/status/Drafts'
import SendToMe from '@/components_approval/status/SendToMe'
import Collection from '@/components_approval/status/Collection'
import DelegateDialog from '@/components_approval/dialog/DelegateDialog'

export default {
  components: {
    BpmWorking,
    Processing,
    End,
    MyCreate,
    Follow,
    Drafts,
    SendToMe,
    Collection,
    DelegateDialog
  },
  data() {
    return {
      // 状态选项
      statusOptions: [
        { value: 'bpmWorking', label: '待办' },
        { value: 'processing', label: '处理中' },
        { value: 'end', label: '已结束' },
        { value: 'mycreate', label: '我发起的' },
        { value: 'follow', label: '我关注的' },
        { value: 'drafts', label: '草稿' },
        { value: 'sendtome', label: '抄送我的' },
        { value: 'collection', label: '收藏' }
      ],
      selectedStatus: 'bpmWorking',
      
      // 委托相关
      delegateDialog: {
        visible: false,
        flowTitle: '',
        runId: '',
        stepRunId: ''
      }
    }
  },
  methods: {
    // 处理状态切换
    handleStatusChange(value) {
      this.selectedStatus = value
    },
    
    // 获取状态标签
    getStatusLabel(status) {
      const labelMap = {
        bpmWorking: '待办',
        processing: '处理中',
        end: '已结束',
        mycreate: '我发起的',
        follow: '我关注的',
        drafts: '草稿',
        sendtome: '抄送我的',
        collection: '收藏'
      }
      return labelMap[status] || status
    },
    
    // 处理委托
    handleDelegate(item) {
      this.delegateDialog = {
        visible: true,
        flowTitle: item.flowTitle || item.title || '无标题',
        runId: item.runId,
        stepRunId: item.stepRunId
      }
    },
    
    // 关闭委托对话框
    closeDelegateDialog() {
      this.delegateDialog.visible = false
    },
    
    // 处理委托成功
    handleDelegateSuccess() {
      // 委托成功后的回调，这里可以添加刷新逻辑
      console.log('委托成功')
    },
    
    // 处理催办
    async handleRemind(item) {
      console.log("催办:", item);
      try {
        const res = await API.bpm.bpmStepRun.remindBpmStepRun.post({
          runId: item.runId,
          stepRunId: item.stepRunId
        })
        
        if (res.code === 200) {
          uni.showToast({ title: '催办成功', icon: 'success' })
        } else {
          uni.showToast({ title: res.message || '催办失败', icon: 'none' })
        }
      } catch (error) {
        console.error('催办失败:', error)
        uni.showToast({ title: '催办失败', icon: 'none' })
      }
    }
  }
}
</script>

<style lang="scss">
.approval-container {
  padding: 10px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 筛选栏 */
.filter-section {
  background: white;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 审批列表 */
.approval-list {
  background: white;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}
</style>