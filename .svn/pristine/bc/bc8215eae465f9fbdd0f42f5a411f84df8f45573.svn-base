<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="我的任务"
        safeAreaInsetTop
        placeholder
        bg-color="#FFFFFF"
        title-color="#333333"
        :border="false"
        auto-back
    />

    <!-- 吸顶容器 -->
    <view class="sticky-container">
      <!-- 选项卡 -->
      <up-sticky offset-top="0" :index="1" bg-color="#FFFFFF">
        <view class="subsection-section">
          <up-subsection
              :list="tabList"
              :current="currentTab"
              @change="onTabChange"
              activeColor="#2979FF"
              bgColor="#FFFFFF"
              fontColor="#666"
              fontSize="14"
              bold
          ></up-subsection>
        </view>
      </up-sticky>
    </view>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 工作台 -->
      <view v-if="currentTab === 0" class="workbench-content">
        <!-- 加载状态 - 骨架屏 -->
        <view v-if="loading">
          <up-skeleton
              rows="6"
              animated
              :loading="loading"
          ></up-skeleton>
        </view>

        <!-- 当前生产任务 -->
        <view v-else-if="taskDetail" class="record-item">
          <view class="record-header">
            <text class="order-number">{{ taskDetail.processName || '-' }}  &nbsp;{{ taskDetail.productSpec || '-' }}</text>
            <UniDictTag :options="dicts" :value="taskDetail.operatorTaskStatus"/>
          </view>

          <view class="record-content">
            <view class="info-row">
              <text class="info-label">任务编号：</text>
              <text class="info-value">{{ taskDetail.taskNo || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品名称：</text>
              <text class="info-value">{{ taskDetail.productName || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品编码：</text>
              <text class="info-value">{{ taskDetail.productCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品规格：</text>
              <text class="info-value">{{ taskDetail.productSpec || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">计划数量：</text>
              <text class="info-value">{{ taskDetail.plannedQuantity || 0 }} {{ taskDetail.unit || '' }}</text>
              <text class="info-label">已完成：</text>
              <text class="info-value completed">{{ taskDetail.completedQuantity || 0 }} {{ taskDetail.unit || '' }}</text>
            </view>
          </view>
        </view>

        <!-- 快捷操作 -->
        <view class="record-item">
          <view class="section-title">
            <text class="title-text">操作</text>
          </view>
          <view class="actions-grid">
            <view 
                v-for="action in quickActions" 
                :key="action.id"
                class="action-item"
                @click="handleAction(action)"
            >
              <view class="action-icon" :style="{ background: action.color }">
                <up-icon :name="action.icon" size="30" color="#fff"></up-icon>
              </view>
              <text class="action-name">{{ action.name }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 投料记录 -->
      <view v-else-if="currentTab === 1" class="tab-content">
        <TaskIssueList :taskId="taskId" />
      </view>

      <!-- 报检记录 -->
      <view v-else-if="currentTab === 2" class="tab-content">
        <ipqc-list :taskId="taskId" />
      </view>

      <!-- 报工记录 -->
      <view v-else-if="currentTab === 3" class="tab-content">
        <task-report-list :taskId="taskId" />
      </view>
    </view>

    <!-- 扫码上料组件 -->
    <material-pick 
        :show="showMaterialPopup"
        :taskId="taskId"
        :taskDetail="taskDetail"
        @close="closeMaterialPopup"
        @materialPicked="onMaterialPicked"
    />
    
    <!-- 称重报检组件 -->
    <weight-inspection 
        :show="showWeightPopup"
        :taskId="taskId"
        :taskDetail="taskDetail"
        @close="closeWeightPopup"
        @inspection-success="onInspectionSuccess"
    />
    
    <!-- 余料下机组件 -->
    <material-dowm-machine 
        :show="showDowmMachinePopup"
        :taskId="taskId"
        :taskDetail="taskDetail"
        @close="closeDowmMachinePopup"
        @materialPicked="onMaterialPicked"
    />

    <!-- 班组选择弹窗 -->
    <up-popup ref="teamPopup" :show="showTeamPopup" mode="center" border-radius="12rpx" @close="closeTeamModal">
        <view class="team-modal">
            <view class="modal-header">
                <text class="modal-title">选择班组</text>
                <up-icon name="close" size="20" color="#999" @click="closeTeamModal"></up-icon>
            </view>

            <view class="modal-content">
                <view class="team-list">
                    <view
                        v-for="(team, index) in teamList"
                        :key="index"
                        class="team-item"
                        :class="{'active': selectedTeam === team.value}"
                        @click="selectTeam(team.value)">
                        <text class="team-name">{{ team.name }}</text>
                        <up-icon
                            v-if="selectedTeam === team.value"
                            name="checkmark-circle"
                            size="20"
                            color="#2979FF"
                        ></up-icon>
                    </view>
                </view>
            </view>

            <view class="modal-footer">
                <up-button type="info" @click="closeTeamModal">取消</up-button>
                <up-button type="primary" @click="confirmTeamSelection">确定</up-button>
            </view>
        </view>
    </up-popup>

    <!-- 移交弹窗 -->
    <up-popup ref="transferPopup" :show="showTransferPopup" mode="center" border-radius="12rpx"  @close="closeTransferModal">
        <view class="transfer-modal">
            <view class="modal-header">
                <text class="modal-title">移交任务</text>
                <up-icon name="close" size="20" color="#999" @click="closeTransferModal"></up-icon>
            </view>

            <view class="modal-content">
                <!-- 搜索输入 -->
                <view class="search-container">
                    <u-search
                        v-model="searchTerm"
                        placeholder="搜索用户"
                        clearable
                        size="small"
                   />
                </view>
                
                <view class="user-list">
                    <view v-if="userLoading" class="loading-container">
                        <u-loading-icon size="20" text="加载用户中..."></u-loading-icon>
                    </view>
                    <view v-else-if="filteredUsers.length === 0" class="empty-users">
                        <text class="empty-text">暂无可用用户</text>
                    </view>
                    <view v-else>
                        <view
                            v-for="user in filteredUsers"
                            :key="user.userId"
                            class="user-item"
                            :class="{'active': selectedUserId === user.userId}"
                            @click="selectUser(user.userId)"
                        >
                            <text class="user-name">{{ user.nickName }}</text>
                            <up-icon
                                v-if="selectedUserId === user.userId"
                                name="checkmark-circle"
                                size="20"
                                color="#2979FF"
                            ></up-icon>
                        </view>
                    </view>
                </view>
            </view>

            <view class="modal-footer">
                <up-button type="info" @click="closeTransferModal">取消</up-button>
                <up-button type="primary" @click="confirmTransfer">确定</up-button>
            </view>
        </view>
    </up-popup>

    <!-- 完工确认弹窗 -->
    <up-popup ref="completePopup" :show="showCompletePopup" mode="center" border-radius="12rpx" @close="closeCompleteModal">
        <view class="complete-modal">
            <view class="modal-header">
                <text class="modal-title">完成作业</text>
                <up-icon name="close" size="20" color="#999" @click="closeCompleteModal"></up-icon>
            </view>

            <view class="modal-content">
                <view class="reminder-content">
                    <text class="reminder-text">确定要完成当前作业吗？</text>
                    <text class="warning-text">⚠️ 请确认是否有余料未打标签等未完成事项</text>
                </view>
            </view>

            <view class="modal-footer">
                <up-button type="info" @click="closeCompleteModal">取消</up-button>
                <up-button type="primary" @click="confirmCompleteWork">确定</up-button>
            </view>
        </view>
    </up-popup>

    <!-- 全局加载提示 -->
    <up-toast ref="uToast"></up-toast>
  </view>
</template>

<script>
import {getWorkOrderTaskInfo, startWorkTask, pauseWorkTask, getWorkTaskStatus, completeWorkTask, transferWorkTask} from '@/api/pro/workTask'
import {getUserList} from '@/api/system/user'
import {getDicts} from '@/api/system/dict'
import MaterialPick from './components/material-pick.vue'
import WeightInspection from './components/weight-inspection.vue'
import MaterialDowmMachine from './components/material-dowm-machine.vue'
import IpqcList from './components/ipqc-list.vue'
import TaskReportList from './components/task-report-list.vue'
import TaskIssueList from './components/task-issue-list.vue'

export default {
  name: 'WorkOrderTaskWork',
  components: {
    MaterialPick,
    WeightInspection,
    MaterialDowmMachine,
    IpqcList,
    TaskReportList,
    TaskIssueList
  },
  data() {
    return {
      // 选项卡相关
      currentTab: 0,
      tabList: [
        {name: '工作台'},
        {name: '投料记录'},
        {name: '报检记录'},
        {name: '报工记录'}
      ],
      // 任务详情
      taskDetail: {},
      // 加载状态
      loading: true,
      // 任务ID
      taskId: '',
      // 字典数据
      dicts: {},
      // 选中的班组
      selectedTeam: '',
      // 扫码上料弹窗
      showMaterialPopup: false,
      // 称重报检弹窗
      showWeightPopup: false,
      // 余料下机弹窗
      showDowmMachinePopup: false,
      // 移交弹窗
      showTransferPopup: false,
      // 移交相关
      userList: [],
      selectedUserId: null,
      userLoading: false,
      searchTerm: '',
      // 班组选择相关
      showTeamPopup: false,
      teamList: [
        { name: 'A班', value: 'A' },
        { name: 'B班', value: 'B' }
      ],
      // 完工确认弹窗
      showCompletePopup: false,
      // 快捷操作
      quickActions: [
        {
          id: 1,
          name: '开工',
          icon: 'play-circle',
          color: '#52c41a',
          type: 'action'
        },
        {
          id: 4,
          name: '扫码上料',
          icon: 'scan',
          color: '#fa8c16',
          type: 'action'
        },
        {
          id: 2,
          name: '暂停',
          icon: 'pause-circle',
          color: '#faad14',
          type: 'action'
        },
        {
          id: 5,
          name: '称重报检',
          icon: 'bookmark',
          color: '#016dfb',
          type: 'action'
        },
          {
            id: 7,
            name: '余料打标签',
            icon: 'arrow-down',
            color: '#fa8c16',
            type: 'action'
          },
          {
            id: 3,
            name: '完工',
            icon: 'checkbox-mark',
            color: '#2979FF',
            type: 'action'
          },
        {
          id: 6,
          name: '移交',
          icon: 'man-add-fill',
          color: '#722ed1',
          type: 'action'
        }
      ]
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchTerm) {
        return this.userList
      }
      const term = this.searchTerm.toLowerCase()
      return this.userList.filter(user => 
        user.nickName.toLowerCase().includes(term)
      )
    }
  },
  onLoad(options) {
    if (options.id) {
      this.taskId = options.id
      this.loadTaskDetail()
      this.loadDicts()
    }
  },
  methods: {
    // 加载字典数据
    async loadDicts() {
      try {
        const response = await getDicts("worktask_status")
        this.dicts = response.data
      } catch (error) {
        console.error('加载字典数据失败:', error)
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
    // 选项卡切换
    onTabChange(index) {
      this.currentTab = index
    },
    // 处理快捷操作
    handleAction(action) {
      console.log('执行快捷操作:', action.name)

      if (action.type === 'action') {
        switch (action.id) {
          case 1:
            this.startWork()
            break
          case 2:
            this.pauseWork()
            break
          case 3:
            this.completeWork()
            break
          case 4:
            this.openMaterialModal()
            break
          case 5:
            // 只有任务状态为3时才能进行称重报检
            if (this.taskDetail.operatorTaskStatus === '2') {
              this.showWeightInspection()
            } else {
              uni.showToast({
                title: '只有开工时的状态才能进行称重报检',
                icon: 'none',
                duration: 1500
              })
            }
            break
          case 6:
            this.transferWork()
            break
          case 7:
            this.openMaterialDowmMachine()
            break
          default:
            this.navigateTo(action.url)
            break
        }
      } else {
        this.navigateTo(action.url)
      }
    },
    // 开工操作
    startWork() {
      if (!this.taskDetail || !this.taskDetail.id) {
        uni.showToast({
          title: '请先选择任务',
          icon: 'none',
          duration: 1000
        })
        return
      }

      // 打开班组选择弹窗
      this.showTeamPopup = true
    },
    
    // 选择班组
    selectTeam(teamName) {
      this.selectedTeam = teamName
    },
    
    // 关闭班组选择弹窗
    closeTeamModal() {
      this.showTeamPopup = false
    },
    
    // 确认班组选择
    confirmTeamSelection() {
      if (!this.selectedTeam) {
        uni.showToast({
          title: '请选择班组',
          icon: 'none',
          duration: 1000
        })
        return
      }
      
      // 确认是否开工
      uni.showModal({
        title: '开始作业',
        content: `确定要开始当前作业吗？`,
        success: async (modalRes) => {
          if (modalRes.confirm) {
            this.confirmStartWork()
          }
        }
      })
      
      this.showTeamPopup = false
    },
    // 确认开始作业
    async confirmStartWork() {
      if (!this.selectedTeam) {
        uni.showToast({
          title: '请选择班组',
          icon: 'none',
          duration: 1000
        })
        return
      }

      try {
        const result = await startWorkTask(this.taskDetail.id, '', this.selectedTeam)
        if (result.code === 200) {
          uni.showToast({
            title: '作业已开始',
            icon: 'success',
            duration: 1000
          })
          // 刷新任务详情
          this.loadTaskDetail()
        } else {
          uni.showToast({
            title: result.msg || '开始作业失败',
            icon: 'none',
            duration: 2000
          })
        }
      } catch (error) {
        uni.showToast({
          title: '开始作业失败:'+error.msg,
          icon: 'none',
          duration: 1500
        })
      }
    },
    // 暂停操作
    pauseWork() {
      if (!this.taskDetail || !this.taskDetail.id) {
        uni.showToast({
          title: '请先选择任务',
          icon: 'none',
          duration: 1000
        })
        return
      }

      uni.showModal({
        title: '暂停作业',
        content: '确定要暂停当前作业吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await pauseWorkTask(this.taskDetail.id)
              if (result.code === 200) {
                uni.showToast({
                  title: '作业已暂停',
                  icon: 'success',
                  duration: 1000
                })
                // 刷新任务详情
                this.loadTaskDetail()
              } else {
                uni.showToast({
                  title: result.msg || '暂停作业失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            } catch (error) {
              uni.showToast({
                title: '暂停作业失败:'+error.msg,
                icon: 'none',
                duration: 1500
              })
            }
          }
        }
      })
    },
    // 完工操作
    completeWork() {
      if (!this.taskDetail || !this.taskDetail.id) {
        uni.showToast({
          title: '请先选择任务',
          icon: 'none',
          duration: 1000
        })
        return
      }

      // 打开自定义完工确认弹窗
      this.showCompletePopup = true
    },
    
    // 关闭完工确认弹窗
    closeCompleteModal() {
      this.showCompletePopup = false
    },
    
    // 确认完成作业
    async confirmCompleteWork() {
      this.showCompletePopup = false
      try {
        const result = await completeWorkTask(this.taskDetail.id)
        if (result.code === 200) {
          uni.showToast({
            title: '作业已完成',
            icon: 'success',
            duration: 1000
          })
          // 刷新任务详情
          this.loadTaskDetail()
        } else {
          uni.showToast({
            title: result.msg || '完成作业失败',
            icon: 'none',
            duration: 2000
          })
        }
      } catch (error) {
        uni.showToast({
          title: '完成作业失败:'+error.msg,
          icon: 'none',
          duration: 1500
        })
      }
    },
    // 打开扫码上料弹窗
    async openMaterialModal() {
      if (!this.taskDetail || !this.taskDetail.id) {
        uni.showToast({
          title: '请先选择任务',
          icon: 'none',
          duration: 1000
        })
        return
      }

      //验证是否已开工
      try {
        await getWorkTaskStatus(this.taskDetail.id)
      } catch (e) {
        return uni.showToast({
          title: '只有生产中或已暂停状态的任务才能上料',
          icon: 'none',
          duration: 1000
        })
      }

      this.showMaterialPopup = true
    },
    // 关闭扫码上料弹窗
    closeMaterialPopup() {
      this.showMaterialPopup = false
    },
    
    // 上料完成回调
    onMaterialPicked() {
      // 刷新任务详情
      this.loadTaskDetail()
    },
    
    // 关闭称重报检弹窗
    closeWeightPopup() {
      this.showWeightPopup = false
    },
    
    // 报检成功回调
    onInspectionSuccess() {
      // 刷新任务详情
      this.loadTaskDetail()
    },
    // 显示称重报检弹窗
    showWeightInspection() {
      this.showWeightPopup = true
    },
    
    // 打开余料下机弹窗
    async openMaterialDowmMachine() {
      if (!this.taskDetail || !this.taskDetail.id) {
        uni.showToast({
          title: '请先选择任务',
          icon: 'none',
          duration: 1000
        })
        return
      }

      //验证是否已开工
      try {
        await getWorkTaskStatus(this.taskDetail.id)
      } catch (e) {
        return uni.showToast({
          title: '只有生产中或已暂停状态的任务才能下机',
          icon: 'none',
          duration: 1000
        })
      }

      this.showDowmMachinePopup = true
    },
    
    // 关闭余料下机弹窗
    closeDowmMachinePopup() {
      this.showDowmMachinePopup = false
    },
    // 移交任务
    transferWork() {
      if (!this.taskDetail || !this.taskDetail.id) {
        uni.showToast({
          title: '请先选择任务',
          icon: 'none',
          duration: 1000
        })
        return
      }

      // 检查任务状态，只有执行中或已暂停状态才能移交
      if (this.taskDetail.status != '2' && this.taskDetail.status != '3') {
        uni.showToast({
          title: '只有生产中或已暂停状态的任务才能移交',
          icon: 'none',
          duration: 2000
        })
        return
      }

      this.showTransferPopup = true
      // 先加载用户列表，确保用户数据可用
      this.loadUsers()
    },
    
    // 加载用户列表
    loadUsers() {
      this.userLoading = true
      return new Promise((resolve, reject) => {
        // 调用获取用户列表的API，这里需要根据实际API调整参数
        getUserList().then(res => {
              if (res.code === 200) {
                this.userList = res.rows || []
              } else {
                uni.showToast({title: res.msg || '加载用户列表失败', icon: 'none'})
                this.userList = []
              }
              resolve()
            })
            .catch(error => {
              uni.showToast({title: '加载用户列表失败', icon: 'none'})
              this.userList = []
              reject(error)
            })
            .finally(() => {
              this.userLoading = false
            })
      })
    },

    // 选择用户
    selectUser(userId) {
      this.selectedUserId = userId
    },

    // 确认移交
    confirmTransfer() {
      if (!this.selectedUserId) {
        uni.showToast({ title: '请选择接收人', icon: 'none' })
        return
      }

      const selectedUser = this.userList.find(user => user.userId === this.selectedUserId)
      if (!selectedUser) {
        uni.showToast({ title: '选择的用户不存在', icon: 'none'})
        return
      }

      // 先关闭移交弹窗，再显示确认对话框，确保确认对话框在顶层
      this.showTransferPopup = false
      
      // 使用setTimeout确保弹窗完全关闭后再显示确认对话框
      setTimeout(() => {
        uni.showModal({
          title: '确认移交',
          content: `确定要将任务 ${this.taskDetail.taskNo} 移交给 ${selectedUser.nickName} 吗？`,
          success: (res) => {
            if (res.confirm) {
              this.doTransfer()
            } else {
              // 如果用户取消确认，重新打开移交弹窗
              this.showTransferPopup = true
            }
          }
        })
      }, 100)
    },

    // 执行移交
    async doTransfer() {
      try {
        const result = await transferWorkTask(this.taskDetail.id, this.selectedUserId)
        if (result.code === 200) {
          uni.showToast({
            title: '移交成功',
            icon: 'success',
            duration: 6000
          })
          this.closeTransferModal()
          // 刷新任务详情
          this.loadTaskDetail()
        } else {
          uni.showToast({
            title: result.msg || '移交失败',
            icon: 'none',
            duration: 5000
          })
        }
      } catch (error) {
        uni.showToast({
          title: '移交失败:' + error.msg,
          icon: 'none',
          duration: 5000
        })
      }
    },

    // 关闭移交弹窗
    closeTransferModal() {
      this.showTransferPopup = false
      this.selectedUserId = null
      this.userList = []
    },
    navigateTo(url) {
      if (!url) {
        uni.showToast({ title: '功能开发中', icon: 'none' })
        return
      }
      uni.navigateTo({ url })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.sticky-container {
  flex-shrink: 0;
  background: #fff;
}

.subsection-section {
  padding: 0 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

/* 标签页内容区域 */
.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* 工作台内容区域 */
.workbench-content {
  flex: 1;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 记录列表 */
.record-list {
  padding: 20rpx 30rpx;
}

.record-item {
  background: white;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-number {
  font-size: 18px;
  color: #333333;
  font-weight: 500;
}

.record-content {
  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
  }

  .info-label {
    width: 150rpx;
    font-size: 14px;
    color: #666666;
    flex-shrink: 0;
  }

  .info-value {
    flex: 1;
    font-size: 14px;
    color: #333333;

    &.completed {
      color: #07c160;
      font-weight: 500;
    }

    &.operator-name {
      color: #2979FF;
      font-weight: 500;
    }
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 20rpx;
  color: #333;
}


.title-text {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-left: 6px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border-radius: 8rpx;
  transition: all 0.3s ease;
  background: #f8f9fa;
  border: 1rpx solid #f0f0f0;
  
  &:active {
    background: #f0f0f0;
    transform: scale(0.95);
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.action-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.action-name {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
  text-align: center;
}

/* 操作按钮区域 */
.button-group {
  display: flex;
  gap: 10rpx;
}

/* 移交弹窗样式 */
.transfer-modal {
  width: 550rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  z-index: 9999;
}

/* 搜索容器样式 */
.search-container {
  margin-bottom: 20rpx;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.modal-content {
  padding: 30rpx;
  max-height: 500rpx;
  overflow-y: auto;
}

.user-list {
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.loading-text {
  margin-top: 10rpx;
  color: #999;
  font-size: 14px;
}

.empty-users {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 14px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  transition: all 0.3s ease;
}

.user-item:last-child {
  border-bottom: none;
}

.user-item.active {
  background-color: #F5F9FF;
  padding-left: 20rpx;
  padding-right: 20rpx;
  margin-left: -20rpx;
  margin-right: -20rpx;
  border-radius: 8rpx;
}

.user-name {
  font-size: 14px;
  color: #333333;
}

.user-item.active .user-name {
  color: #2979FF;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 30rpx;
  gap: 20rpx;
  border-top: 1rpx solid #F0F0F0;
}

/* 班组选择弹窗样式 */
.team-modal {
  width: 550rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.team-list {
  width: 100%;
}

.team-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  transition: all 0.3s ease;
}

.team-item:last-child {
  border-bottom: none;
}

.team-item.active {
  background-color: #F5F9FF;
  padding-left: 20rpx;
  padding-right: 20rpx;
  margin-left: -20rpx;
  margin-right: -20rpx;
  border-radius: 8rpx;
}

.team-name {
  font-size: 14px;
  color: #333333;
}

.team-item.active .team-name {
  color: #2979FF;
  font-weight: 500;
}

/* 完工确认弹窗样式 */
.complete-modal {
  width: 550rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  z-index: 9999;
}

.reminder-content {
  padding: 20rpx 0;
}

.reminder-text {
  font-size: 14px;
  color: #333333;
  line-height: 24rpx;
  margin-bottom: 20rpx;
  display: block;
}

.warning-text {
  font-size: 14px;
  color: #faad14;
  line-height: 24rpx;
  display: block;
}

</style>