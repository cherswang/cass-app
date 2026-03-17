<template>
  <up-popup
      :show="show"
      mode="bottom"
      :round="16"
      :closeable="true"
      :safe-area-inset-bottom="true"
      @close="handleClose"
  >
    <view class="dialog-container">
      <!-- 弹窗头部 -->
      <view class="dialog-header">
        <text class="dialog-title">检验单</text>
      </view>

      <!-- 内容区域 -->
      <scroll-view class="dialog-content" scroll-y>
        <!-- 产品信息区块 -->
        <view class="section" v-if="!loading">
          <view class="section-header">
            <text class="section-title">产品信息（{{iqcDetail.batchCode}}）</text>
          </view>
          <view class="custom-form">
            <view class="form-row" :class="{ 'border-bottom': true }">
              <view class="form-label">检测方案</view>
              <view class="form-content">
                <template v-if="mode === 'show'">
                  <text class="view-mode-text">{{iqcDetail.templateName || '-'}}</text>
                </template>
                <template v-else>
                  <view class="template-select-container">
                    <u-input
                        v-model="iqcDetail.templateName"
                        placeholder="请选择方案"
                        size="default"
                        @click.native="handleProgrammeSelect"
                      />
                    <u-icon
                        name="search"
                        size="20"
                        color="#666"
                        class="template-select-icon"
                        @click="handleProgrammeSelect"
                    />
                  </view>
                </template>
              </view>
            </view>
            <view class="form-row" :class="{ 'border-bottom': true }">
              <view class="form-label">来料日期</view>
              <view class="form-content">
                <template v-if="mode === 'show'">
                  <text class="view-mode-text">{{formatDate(iqcDetail.reciveDate) || '-'}}</text>
                </template>
                <template v-else>
                  <u-input
                      v-model="iqcDetail.reciveDate"
                      placeholder="请选择日期"
                      size="default"
                      @click.native="showDatePicker = true"
                    />
                  <u-icon
                      name="calendar"
                      size="20"
                      color="#666"
                      class="template-select-icon"
                      @click="showDatePicker = true"
                  />
                </template>
              </view>
            </view>
            <view class="form-row" :class="{ 'border-bottom': true }">
              <view class="form-label">检测数量</view>
              <view class="form-content">
                <text class="view-mode-text">{{iqcDetail.quantityCheck || 0}}</text>
              </view>
            </view>
            <view class="form-row" :class="{ 'border-bottom': true }">
              <view class="form-label">合格数量</view>
              <view class="form-content">
                <template v-if="mode === 'show'">
                  <text class="view-mode-text">{{iqcDetail.quantityQualified || 0}}</text>
                </template>
                <template v-else>
                  <u-input
                      v-model.number="iqcDetail.quantityQualified"
                      type="number"
                      placeholder="请输入合格数量"
                      size="default"
                      @input="calculateUnqualified"
                  />
                </template>
              </view>
            </view>
            <view class="form-row" :class="{ 'border-bottom': true }">
              <view class="form-label">不合格数量</view>
              <view class="form-content">
                <text class="view-mode-text">{{iqcDetail.quantityUnqualified || 0}}</text>
              </view>
            </view>
            <view class="form-row" :class="{ 'border-bottom': true }">
              <view class="form-label">检测人员</view>
              <view class="form-content">
                <text class="view-mode-text">{{user.nickName || '-'}}</text>
              </view>
            </view>
            <view class="form-row" :class="{ 'border-bottom': true }">
              <view class="form-label">不合格原因</view>
              <view class="form-content">
                <template v-if="mode === 'show'">
                  <text class="view-mode-text">{{iqcDetail.defectName || '-'}}</text>
                </template>
                <template v-else>
                  <u-input
                      v-model="iqcDetail.defectName"
                      placeholder="请输入不合格原因"
                      size="default"
                      type="textarea"
                      :maxlength="200"
                    />
                </template>
              </view>
            </view>
          </view>
        </view>
        <!-- 检测项区块 -->
        <view class="section" v-if="!loading">
          <view class="section-header">
            <text class="section-title">检测项</text>
          </view>

          <view v-if="!iqcLineList || iqcLineList.length === 0" class="no-line-item">
            <u-empty text="暂无检测项数据" mode="data"></u-empty>
          </view>
          <view v-else class="custom-form line-list">
            <view class="form-row border-bottom" v-for="(line, index) in iqcLineList" :key="line.id || index">
              <view class="form-label">{{line.indexName || '-'}}{{line.unitOfMeasure && line.unitOfMeasure.trim() ? `(${line.unitOfMeasure})` : ''}}</view>
              <view class="form-content">
                <template v-if="mode === 'show'">
                  <text class="view-mode-text">{{line.testData || '-'}}</text>
                </template>
                <template v-else>
                  <u-input
                      v-model="line.testData"
                      placeholder="请输入检测数据"
                      size="default"
                  />
                </template>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading" v-if="loading">
          <u-loading-icon size="24" text="加载中..."></u-loading-icon>
        </view>
      </scroll-view>

      <!-- 操作按钮 -->
      <view class="dialog-footer" v-if="mode !== 'show' && !loading">
        <u-button text="取消" size="small" @click="handleClose" :disabled="submitLoading"></u-button>
        <u-button class="save-btn" type="primary" text="保存" size="small" @click="handleSave" :loading="submitLoading" :disabled="submitLoading"></u-button>
        <u-button class="pass-btn" type="success" text="检验通过" size="small" @click="handleCheckPass" :loading="submitLoading" :disabled="submitLoading"></u-button>
        <u-button class="reject-btn" type="error" text="检验不通过" size="small" @click="handleCheckReject" :loading="submitLoading" :disabled="submitLoading"></u-button>
      </view>
    </view>

    <!-- 日期选择器 -->
    <uni-date-picker
        v-if="showDatePicker"
        :range="false"
        :value="dateValue"
        @change="handleDateConfirm"
        @close="showDatePicker = false"
    />
    
    <!-- 选择方案弹窗组件 -->
    <single-select
        :iqc-type="iqcDetail.iqcType"
        @ok="handleTemplateSelect"
        ref="templateSelectRef"
    ></single-select>
    
    <!-- 确认更换方案弹窗 -->
    <up-popup
        :show="showConfirmPopup"
        mode="center"
        :round="16"
        :closeable="false"
    >
      <view class="confirm-modal">
        <view class="modal-header">
          <text class="modal-title">提示</text>
        </view>
        <view class="modal-content">
          <text class="modal-text">是否更换检验方案并设置当前方案为该物料的默认方案？如果更换方案会删除当前该单据下所有的检验项信息</text>
        </view>
        <view class="modal-footer">
          <up-button text="取消" size="small" @click="cancelTemplateChange"></up-button>
          <up-button type="primary" text="确定" size="small" @click="confirmTemplateChange"></up-button>
        </view>
      </view>
    </up-popup>
  </up-popup>
</template>

<script>
import { getIqc, updateIqc, updateTemplate } from '@/api/quality/qcIqc'
import { listIqcLine } from '@/api/quality/qcIqcLine'
import { addTestData } from '@/api/quality/qcTestData'
import { getTemplateByType } from "@/api/quality/qcTemplate"
import { getUserProfile } from "@/api/system/user"
import SingleSelect from './single.vue'

export default {
  name: 'IqcInspectDialog',
  components: {
    SingleSelect
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    iqcId: {
      type: String,
      default: ''
    },
    iqcType: {
      type: String,
      default: ''
    }
  },
  emits: ['update:show', 'close', 'success'],
  data() {
    return {
      iqcDetail: {
        iqcCode: '',
        iqcName: '',
        iqcType: '',
        reciveDate: '',
        itemCode: '',
        itemName: '',
        specification: '',
        unitOfMeasure: '',
        batchCode: '',
        quantityCheck: 0,
        quantityQualified: 0,
        quantityUnqualified: 0,
        inspector: '',
        checkResult: '',
        defectName: '',
        remark: '',
        templateName: '',
        templateId: '',
        iqcId: ''
      },
      iqcLineList: [],
      loading: true,
      submitLoading: false,
      user: {},
      mode: 'edit', // add/edit/show
      showDatePicker: false,
      dateValue: '',
      showConfirmPopup: false,
      selectedTemplate: null
    }
  },
  watch: {
    show(val) {
      if (val && this.iqcId) {
        this.loadData()
      }
    }
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        // 先加载检验单详情，再加载检测项和用户信息
        await this.loadIqcDetail()
        await Promise.all([this.loadIqcLine(), this.getUser()])
      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    
    // 计算不合格数量（检测重量 - 合格重量）
    calculateUnqualified() {
      const check = Number(this.iqcDetail.quantityCheck) || 0
      const qualified = Number(this.iqcDetail.quantityQualified) || 0
      this.iqcDetail.quantityUnqualified = Number((check - qualified).toFixed(2))
    },
    
    // 表单基础校验
    validateForm() {
      const { itemCode, itemName, quantityCheck, quantityQualified, templateName } = this.iqcDetail

      if (!itemCode) {
        uni.showToast({ title: '产品编码不能为空', icon: 'none' })
        return false
      }
      if (!itemName) {
        uni.showToast({ title: '产品名称不能为空', icon: 'none' })
        return false
      }
      if (!quantityCheck) {
        uni.showToast({ title: '检测数量不能为空', icon: 'none' })
        return false
      }
      if (!quantityQualified && quantityQualified !== 0) {
        uni.showToast({ title: '合格数量不能为空', icon: 'none' })
        return false
      }
      if (!templateName) {
        uni.showToast({ title: '请选择检测方案', icon: 'none' })
        return false
      }
      return true
    },
    
    async getUser() {
      await getUserProfile().then(response => {
        const data=response.data;
        this.user = data.user
      }).catch(error => {
        console.error('获取用户信息失败:', error)
      })
    },
    
    async loadIqcLine() {
      try {
        //判断是否绑定检测项
        if (this.iqcDetail.templateId === null || this.iqcDetail.templateId === '') {
          const res = await getTemplateByType(this.iqcType, this.iqcId)
          if (res.code === 200&&res.data!==null) {
            this.iqcDetail.templateName = res.data.templateName
            this.iqcDetail.templateId = res.data.templateId
            this.iqcDetail.templateCode = res.data.templateCode
          }
        }
        const params = { iqcId: this.iqcId }
        const res = await listIqcLine(params)
        this.iqcLineList = res.rows || []

      } catch (error) {
        console.error('加载检测项失败:', error)
        uni.showToast({ title: '检测项加载失败', icon: 'none' })
        this.iqcLineList = []
      }
    },
    
    async loadIqcDetail() {
      try {
        const res = await getIqc(this.iqcId)
        if (res.code === 200) {
          this.iqcDetail = { ...this.iqcDetail, ...res.data }
          this.iqcDetail.quantityQualified = this.iqcDetail.quantityCheck || 0
          // 确保检测方案有默认值
          if (!this.iqcDetail.templateId && !this.iqcDetail.templateName) {
            const templateRes = await getTemplateByType(this.iqcType || this.iqcDetail.iqcType, this.iqcId)
            if (templateRes.code === 200 && templateRes.data) {
              this.iqcDetail.templateName = templateRes.data.templateName
              this.iqcDetail.templateId = templateRes.data.templateId
              this.iqcDetail.templateCode = templateRes.data.templateCode
            }
          }
        } else {
          uni.showToast({ title: res.msg || '加载失败', icon: 'none' })
        }
      } catch (error) {
        console.error('加载检验单详情失败:', error)
        uni.showToast({ title: '网络错误，请重试', icon: 'none' })
      }
    },
    
    handleClose() {
      this.$emit('update:show', false)
      this.$emit('close')
    },
    
    handleProgrammeSelect() {
      this.$refs.templateSelectRef.open()
    },
    
    async handleTemplateSelect(selectedTemplate) {
      if (selectedTemplate) {
        this.iqcDetail.templateId = selectedTemplate.templateId;
        this.iqcDetail.templateName = selectedTemplate.templateName;
        this.iqcDetail.templateCode = selectedTemplate.templateCode;
        this.selectedTemplate = selectedTemplate;
        // 显示确认弹窗
        this.showConfirmPopup = true;
      }
    },
    
    // 取消更换方案
    cancelTemplateChange() {
      this.showConfirmPopup = false;
      this.selectedTemplate = null;
    },
    
    // 确认更换方案
    async confirmTemplateChange() {
      if (!this.selectedTemplate) return;
      
      this.showConfirmPopup = false;
      
      try {
        uni.showLoading({
          title: '更新中...',
          mask: true
        })

        const data = {
          templateId: this.selectedTemplate.templateId,
          templateName: this.selectedTemplate.templateName,
          iqcId: this.iqcDetail.iqcId,
          iqcType: this.iqcDetail.iqcType,
          itemId: this.iqcDetail.itemId,
          workorderId: this.iqcDetail.workorderId
        }

        const result = await updateTemplate(data)

        uni.hideLoading()

        if (result.code === 200) {
          uni.showToast({
            title: '更换检测模板成功',
            icon: 'success',
            duration: 2000
          })
          await this.loadIqcLine()
        } else {
          uni.showToast({
            title: result.msg || '更换模板失败',
            icon: 'none',
            duration: 2000
          })
        }
      } catch (error) {
        uni.hideLoading()
        console.log('异常信息：', error)
        uni.showToast({ title: '网络错误，请重试', icon: 'none', duration: 2000 })
      } finally {
        this.selectedTemplate = null;
      }
    },
    
    // 处理日期选择
    handleDateConfirm(e) {
      this.iqcDetail.reciveDate = e.value
      this.showDatePicker = false
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    
    formatTestData(testData) {
      if (testData === undefined || testData === null) {
        return ''
      }
      if (typeof testData === 'number') {
        return testData
      }
      return testData.trim()
    },
    
    isValidTestData(testData) {
      const formatted = this.formatTestData(testData)
      return typeof formatted === 'number' || (typeof formatted === 'string' && formatted !== '')
    },
    
    async handleSave() {
      // 基础表单校验
      if (!this.validateForm()) return

      try {
        this.submitLoading = true
        // 1. 保存主表数据
        const mainData = {
          ...this.iqcDetail,
          quantityUnqualified: this.iqcDetail.quantityUnqualified,
          status: this.iqcDetail.status || '0',
          inspector: this.user.nickName
        }
        
        const res = await updateIqc(mainData)

        if (res && res.code !== 200) {
          uni.showToast({ title: res.msg || '主表保存失败', icon: 'none' })
          return
        }

        // 2. 保存检测项数据
        const lineSubmitData = (this.iqcLineList || [])
            .map(line => ({
              lineId: line.lineId,
              id: line.id,
              indexId: line.indexId,
              indexCode: line.indexCode,
              indexName: line.indexName,
              testData: line.testData?.trim() || '',
              qcTool: line.qcTool,
              checkMethod: line.checkMethod,
              unitOfMeasure: line.unitOfMeasure,
              iqcId: this.iqcDetail.iqcId || res.data.iqcId,
              iqcCode: this.iqcDetail.iqcCode,
              iqcName: this.iqcDetail.iqcName,
              ipqcId: this.iqcDetail.iqcId || res.data.iqcId,
              ipqcCode: this.iqcDetail.iqcCode,
              ipqcName: this.iqcDetail.iqcName,
              inspector: this.iqcDetail.inspector || this.user.nickName,
              productCode: this.iqcDetail.itemCode,
              productName: this.iqcDetail.itemName,
              templateId: this.iqcDetail.templateId,
              templateName: this.iqcDetail.templateName,
              defectName: this.iqcDetail.defectName,
              remark: this.iqcDetail.remark,
              batchCode: this.iqcDetail.batchCode,
              batchNo: this.iqcDetail.batchCode,
              reciveDate: this.iqcDetail.reciveDate
            })).filter(line => this.isValidTestData(line.testData))

        if (lineSubmitData.length > 0) {
          const testDataRes = await addTestData(lineSubmitData)
          if (testDataRes.code !== 200) {
            uni.showToast({ title: testDataRes.msg || '检测项保存失败', icon: 'none' })
            return
          }
        }

        uni.showToast({ title: '保存成功', icon: 'success' })
        this.handleClose()
        this.$emit('success')

      } catch (error) {
        console.error('保存失败:', error)
        uni.showToast({ title: '保存失败，请重试', icon: 'none' })
      } finally {
        this.submitLoading = false
      }
    },
    
    handleCheckPass() {
      this.iqcDetail.checkResult = 'ACCEPT'
      this.iqcDetail.status = '1'
      this.handleSave()
    },
    
    handleCheckReject() {
      if (!this.iqcDetail.defectName?.trim()) {
        uni.showToast({ title: '请填写不合格原因', icon: 'none' })
        return
      }
      this.iqcDetail.checkResult = 'REJECT'
      this.iqcDetail.status = '1'
      this.handleSave()
    }
  }
}
</script>

<style scoped>
.dialog-container {
  background: #fff;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.dialog-content {
  flex: 1;
  padding: 0 30rpx;
  max-height: 50vh;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10rpx;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  background: #fff;
}

.save-btn,
.pass-btn,
.reject-btn {
  min-width: 120rpx;
}

.section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20rpx;
  margin: 20rpx 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding-left: 10px;
  border-left: 4px solid #2979FF;
}

.form-item {
  margin-bottom: 10rpx;
}

.view-mode-text {
  font-size: 14px;
  color: #333;
  line-height: 40px;
}

/* 自定义表单样式 */
.custom-form {
  width: 100%;
}

.form-row {
  display: flex;
  align-items: center;
  padding: 15rpx 0;
  position: relative;
}

.border-bottom {
  border-bottom: 1rpx solid #f0f0f0;
}

.form-label {
  font-size: 14px;
  color: #666;
  width: 240rpx;
  min-width: 240rpx;
  padding-right: 20rpx;
  box-sizing: border-box;
}

.form-content {
  flex: 1;
  min-width: 0;
}

/* 检测方案选择容器 */
.template-select-container {
  position: relative;
  width: 100%;
}

.template-select-icon {
  position: absolute;
  right: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.loading {
  padding: 60px 0;
  text-align: center;
}

.loading-text {
  font-size: 14px;
  color: #666;
}

:deep(.u-input__wrapper) {
  border-radius: 4px;
}

:deep(.u-button--small) {
  min-width: 120rpx;
}

/* 确认弹窗样式 */
.confirm-modal {
  width: 500rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.confirm-modal .modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.confirm-modal .modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.confirm-modal .modal-content {
  padding: 40rpx 30rpx;
  text-align: center;
}

.confirm-modal .modal-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.confirm-modal .modal-footer {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}
</style>