<template>
  <view class="page">
    <!-- 内容区域 -->
    <view class="content" v-if="!loading">
      <!-- 检验单基本信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">检验单基本信息</text>
        </view>
        <view class="info-item">
          <text class="label">检验单编号:</text>
          <input
              class="value-input"
              v-model="form.opqcCode"
              placeholder="请输入检验单编号"
              :disabled="mode === 'show' || mode === 'edit'"
          />
        </view>
        <view class="info-item">
          <text class="label">检验单名称:</text>
          <input
              class="value-input"
              v-model="form.opqcName"
              placeholder="请输入检验单名称"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">检验模板名称:</text>
          <view class="value-input-group">
            <input
                class="value-input"
                v-model="form.templateName"
                placeholder="请选择检验模板"
                @focus="handleProgrammeSelect()"
                :disabled="mode === 'show'"
            />
            <button
                class="search-btn"
                @click="handleProgrammeSelect()"
                :disabled="mode === 'show'"
            >
              <uni-icons type="search" size="16" color="#666"></uni-icons>
            </button>
          </view>
        </view>
      </view>

      <!-- 生产信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">生产信息</text>
        </view>
        <view class="info-item">
          <text class="label">工单编码:</text>
          <input
              class="value-input"
              v-model="form.workorderCode"
              placeholder="请输入工单编码"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">工单名称:</text>
          <input
              class="value-input"
              v-model="form.workorderName"
              placeholder="请输入工单名称"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">任务编号:</text>
          <input
              class="value-input"
              v-model="form.taskCode"
              placeholder="请输入任务编号"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">工序名称:</text>
          <input
              class="value-input"
              v-model="form.processName"
              placeholder="请输入工序名称"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">工作站名称:</text>
          <input
              class="value-input"
              v-model="form.workstationName"
              placeholder="请输入工作站名称"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">要求完成时间:</text>
          <input
              class="value-input"
              :value="formatDate(form.finishTime)"
              placeholder="暂无要求完成时间"
              disabled
          />
        </view>
      </view>

      <!-- 委托信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">委托信息</text>
        </view>
        <view class="info-item">
          <text class="label">委托单位:</text>
          <input
              class="value-input"
              v-model="form.entrustCorp"
              placeholder="请输入委托单位"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">委托负责人:</text>
          <input
              class="value-input"
              v-model="form.entrustUsername"
              placeholder="请输入委托负责人"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">委托日期:</text>
          <input
              class="value-input"
              :value="formatDate(form.entrustTime)"
              placeholder="暂无委托日期"
              disabled
          />
        </view>
        <view class="info-item">
          <text class="label">外协单位:</text>
          <input
              class="value-input"
              v-model="form.outsourcingCorp"
              placeholder="请输入外协单位"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">外协负责人:</text>
          <input
              class="value-input"
              v-model="form.outsourcingUser"
              placeholder="请输入外协负责人"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">外协日期:</text>
          <picker
              v-if="mode !== 'show'"
              mode="datetime"
              :value="form.outsourcingTime"
              @change="handleDateChange('outsourcingTime', $event)"
              class="value-input"
          >
            <view class="value-input">{{ form.outsourcingTime || '请选择外协日期' }}</view>
          </picker>
          <text v-else class="value">{{ formatDate(form.outsourcingTime) }}</text>
        </view>
      </view>

      <!-- 产品信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">产品信息</text>
        </view>
        <view class="info-item">
          <text class="label">产品物料编码:</text>
          <input
              class="value-input"
              v-model="form.itemCode"
              placeholder="请输入产品物料编码"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">产品物料名称:</text>
          <input
              class="value-input"
              v-model="form.itemName"
              placeholder="请输入产品物料名称"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">规格型号:</text>
          <input
              class="value-input"
              v-model="form.specification"
              placeholder="请输入规格型号"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">单位:</text>
          <input
              class="value-input"
              v-model="form.unitOfMeasure"
              placeholder="请输入单位"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">盘重:</text>
          <input
              class="value-input"
              v-model.number="form.axleLoad"
              type="number"
              placeholder="请输入盘重"
              disabled
          />
        </view>
      </view>

      <!-- 检验信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">检验信息</text>
        </view>
        <view class="info-item">
          <text class="label">检测重量:</text>
          <input
              class="value-input"
              v-model.number="form.quantityCheck"
              type="number"
              placeholder="请输入检测重量"
              disabled
          />
        </view>
        <view class="info-item">
          <text class="label">合格净重:</text>
          <input
              class="value-input"
              v-model.number="form.quantityQualified"
              type="number"
              placeholder="请输入合格净重"
              :disabled="mode === 'show'"
              @input="calculateUnqualified"
          />
        </view>
        <view class="info-item">
          <text class="label">不合格重量:</text>
          <input
              class="value-input"
              v-model.number="form.quantityUnqualified"
              type="number"
              placeholder="不合格重量"
              disabled
          />
        </view>
        <view class="info-item">
          <text class="label">检测人员:</text>
          <input
              class="value-input"
              v-model="userForm.nickName"
              placeholder="请输入检测人员"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">备注:</text>
          <textarea
              class="value-textarea"
              v-model="form.remark"
              placeholder="请输入备注信息"
              :disabled="mode === 'show'"
          />
        </view>
      </view>

      <!-- 检测项区块 -->
      <view class="section" v-if="form.opqcId != null && form.templateId != null">
        <view class="section-header">
          <text class="section-title">检测项</text>
        </view>

        <view v-if="!opqcLineList.length" class="no-line-item">
          <text class="no-line-text">暂无检测项数据</text>
        </view>
        <view class="line-item" v-for="(line, index) in opqcLineList" :key="line.id || index">
          <view class="line-item-content">
            <view class="test-item-row">
              <text class="test-item-name">
                {{ line.indexName || '-' }}
                <span v-if="line.unitOfMeasure && line.unitOfMeasure.trim()">({{ line.unitOfMeasure }})</span>
              </text>
              <input
                  class="test-data-input"
                  v-model="line.testData"
                  placeholder="请输入检测数据"
                  :disabled="mode === 'show'"
              />
            </view>
          </view>
        </view>

      </view>

      <!-- 操作按钮区 -->
      <view class="task-footer" v-if="mode !== 'show'">
        <button
            class="inspect-btn"
            @click="submitWithTestItems"
            :loading="buttonLoading"
        >
          <uni-icons name="edit" size="14" color="#fff"></uni-icons>
          保存
        </button>
        <button
            class="inspect-btn"
            @click="passedByTest"
            :loading="buttonLoading"
        >
          <uni-icons name="checkmark" size="14" color="#fff"></uni-icons>
          检验通过
        </button>
        <button
            class="delete-btn"
            @click="notPassedByTest"
            :loading="buttonLoading"
        >
          <uni-icons name="close" size="14" color="#fff"></uni-icons>
          检验不通过
        </button>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 选择方案弹窗组件 -->
    <QctemSingle
        ref="qctemSingleSelect"
        @ok="onProgramme"
    ></QctemSingle>
  </view>
</template>

<script>
import QctemSingle from "../qcIpqc/single";
import { addOpqc, updateOpqc, updateTemplate, getOpqc } from '@/api/quality/qcOpqc'
import { listOpqcLine } from '@/api/quality/qcOpqcLine'
import { addTestData } from '@/api/quality/qcTestData'
import { getTemplateByType } from "@/api/quality/qcTemplate"
import { getUserProfile } from "@/api/system/user";

// 检验类型字典
const TEMPLATE_TYPE_OPTIONS = [
  { value: 'OPQC', label: '委外检验' },
  { value: 'IPQC', label: '过程检验' },
  { value: 'IQC', label: '来料检验' }
]

export default {
  name: 'OpqcDetail',
  components: {
    QctemSingle
  },
  data() {
    return {
      loading: true,
      buttonLoading: false,
      mode: 'add', // add/edit/show
      userForm: {},
      templateTypeIndex: 0,
      templateTypeOptions: TEMPLATE_TYPE_OPTIONS,
      form: {
        opqcId: '',
        opqcCode: '',
        opqcName: '',
        opqcType: '',
        templateId: '',
        templateName: '',
        workorderId: '',
        workorderCode: '',
        workorderName: '',
        entrustId: '',
        entrustCode: '',
        entrustCorp: '',
        entrustCorpCode: '',
        entrustUser: '',
        entrustUsername: '',
        entrustTime: '',
        outsourcingCorp: '',
        outsourcingUser: '',
        outsourcingTime: '',
        finishTime: '',
        taskId: '',
        taskCode: '',
        taskName: '',
        workstationId: '',
        workstationCode: '',
        workstationName: '',
        processId: '',
        processCode: '',
        processName: '',
        itemId: '',
        itemCode: '',
        itemName: '',
        specification: '',
        unitOfMeasure: '',
        quantityCheck: '',
        quantityUnqualified: '',
        quantityQualified: '',
        checkResult: '',
        inspectDate: '',
        inspector: '',
        status: '',
        remark: '',
        createByNick: '',
        updateByNick: '',
        axleLoad: ''
      },
      opqcLineList: [],
      opqcId: ''
    }
  },
  computed: {
    // 页面标题
    dialogTitle() {
      const titles = {
        add: '新增委外检验单',
        edit: '修改委外检验单',
        show: '查看委外检验单'
      }
      return titles[this.mode]
    },
    // 是否为编辑模式
    isEdit() {
      return this.mode === 'edit'
    }
  },
  onLoad(options) {
    if (options.opqcId) {
      this.opqcId = options.opqcId
      this.mode = options.mode || 'edit'
      // 加载详情和检测项
      Promise.all([this.loadOpqcDetail(), this.loadOpqcLine()])
          .catch(error => console.error('加载数据失败:', error))
    } else if (options.mode === 'add') {
      // 新增模式
      this.mode = 'add'
      this.loading = false
    }
    this.getUser();
  },
  methods: {
    // 格式化日期
    formatDate(value) {
      if (!value) return '-'
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },

    // 计算不合格重量
    calculateUnqualified() {
      const check = Number(this.form.quantityCheck) || 0
      const qualified = Number(this.form.quantityQualified) || 0
      this.form.quantityUnqualified = Number((check - qualified).toFixed(2))
    },

    // 表单基础校验
    validateForm() {
      const {
        opqcCode, opqcName, opqcType, templateName, workorderCode,
        entrustCorp, itemCode, itemName, specification, unitOfMeasure,
        quantityCheck, inspectDate
      } = this.form

      if (!opqcCode) {
        uni.showToast({ title: '检验单编号不能为空', icon: 'none' })
        return false
      }
      if (!opqcName) {
        uni.showToast({ title: '检验单名称不能为空', icon: 'none' })
        return false
      }
      if (!opqcType) {
        uni.showToast({ title: '检验类型不能为空', icon: 'none' })
        return false
      }
      if (!templateName) {
        uni.showToast({ title: '检测模板名称不能为空', icon: 'none' })
        return false
      }
      if (!workorderCode) {
        uni.showToast({ title: '工单编码不能为空', icon: 'none' })
        return false
      }
      if (!entrustCorp) {
        uni.showToast({ title: '委托单位不能为空', icon: 'none' })
        return false
      }
      if (!itemCode) {
        uni.showToast({ title: '产品物料编码不能为空', icon: 'none' })
        return false
      }
      if (!itemName) {
        uni.showToast({ title: '产品物料名称不能为空', icon: 'none' })
        return false
      }
      if (!specification) {
        uni.showToast({ title: '规格型号不能为空', icon: 'none' })
        return false
      }
      if (!unitOfMeasure) {
        uni.showToast({ title: '单位不能为空', icon: 'none' })
        return false
      }
      if (!quantityCheck) {
        uni.showToast({ title: '检测重量不能为空', icon: 'none' })
        return false
      }
      return true
    },

    // 获取用户信息
    async getUser() {
      await getUserProfile().then(response => {
        const data = response.data;
        this.userForm = data.user
        this.form.inspector = data.user.nickName
      }).catch(error => {
        console.error('获取用户信息失败:', error)
      })
    },

    // 加载检验单详情
    async loadOpqcDetail() {
      this.loading = true
      try {
        const res = await getOpqc(this.opqcId)
        if (res.code === 200) {
          this.form = { ...res.data }
          this.form.quantityQualified = this.form.quantityCheck || 0
          // 设置检验类型选择器索引
          const typeIndex = this.templateTypeOptions.findIndex(item => item.value === this.form.opqcType)
          this.templateTypeIndex = typeIndex >= 0 ? typeIndex : 0
        } else {
          await uni.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          })
          setTimeout(() => {
            this.goBack()
          }, 1500)
        }
      } catch (error) {
        console.error('加载检验单详情失败:', error)
        await uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    // 加载检测项
    async loadOpqcLine() {
      try {
        // 判断是否绑定检测项
        if (this.form.templateId === null || this.form.templateId === '') {
          const res = await getTemplateByType("OPQC", this.opqcId)
          if (res.code === 200 && res.data !== null) {
            this.form.templateName = res.data.templateName
            this.form.templateId = res.data.templateId
            this.form.templateCode = res.data.templateCode
          }
        }
        const params = { opqcId: this.opqcId }
        const res = await listOpqcLine(params)
        this.opqcLineList = res.rows || []
      } catch (error) {
        console.error('加载检测项失败:', error)
        await uni.showToast({title: '检测项加载失败', icon: 'none'})
        this.opqcLineList = []
      }
    },

    // 返回上一页
    goBack() {
      uni.navigateBack()
    },

    // 处理日期选择
    handleDateChange(field, e) {
      this.form[field] = e.detail.value
    },

    // 处理检验类型选择
    handleTemplateTypeChange(e) {
      const index = e.detail.value
      this.form.opqcType = this.templateTypeOptions[index].value
    },

    // 打开检测方案选择弹窗
    handleProgrammeSelect() {
      this.$refs.qctemSingleSelect.open()
    },

    // 检测方案选择回调
    onProgramme(cpp) {
      this.form.templateName = cpp.templateName
      uni.showModal({
        title: '提示',
        content: '是否更换检验方案？更换后会删除当前单据下所有检测项信息',
        success: async (res) => {
          if (res.confirm) {
            try {
              uni.showLoading({
                title: '更新中...',
                mask: true
              })
              const data = {
                templateId: cpp.templateId,
                templateName: cpp.templateName,
                opqcId: this.form.opqcId,
                itemId: this.form.itemId
              }
              await updateTemplate(data)
              uni.hideLoading()
              await uni.showToast({
                title: '更换检测模板成功',
                icon: 'success'
              })
              this.form.templateId = cpp.templateId
              // 刷新检测项
              await this.loadOpqcLine()
            } catch (e) {
              uni.hideLoading()
              console.log('更换模板异常：', e)
              await uni.showToast({
                title: '更换失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    // 检验通过
    async passedByTest() {
      this.form.checkResult = 'ACCEPT'
      this.form.status = "1"
      await this.submitWithTestItems()
    },

    // 检验不通过
    async notPassedByTest() {
      this.form.checkResult = 'REJECT'
      this.form.status = "1"
      await this.submitWithTestItems()
    },

    // 提交保存
    async submitWithTestItems() {
      // 基础表单校验
      if (!this.validateForm()) return

      this.buttonLoading = true
      try {
        // 计算不合格重量
        this.form.quantityUnqualified = Number(this.form.quantityCheck) - Number(this.form.quantityQualified)
        // 组装提交数据
        const submitData = { ...this.form }
        delete submitData.createByNick
        delete submitData.updateByNick
        submitData.inspector = this.userForm.nickName

        let opqcId = this.form.opqcId
        // 新增/编辑区分
        if (this.isEdit) {
          await updateOpqc(submitData)
        } else {
          const res = await addOpqc(submitData)
          opqcId = res.data.opqcId
        }

        // 保存检测项数据
        const checkResultList = this.opqcLineList || []
        if (checkResultList.length > 0) {
          const testDataList = checkResultList
              .filter(item => item.testData && item.testData.trim() !== '')
              .map(item => ({
                opqcId: opqcId,
                opqcCode: this.form.opqcCode,
                opqcName: this.form.opqcName,
                ipqcCode: this.form.opqcCode,
                ipqcName: this.form.opqcName,
                ipqcId: opqcId,
                indexId: item.indexId,
                indexCode: item.indexCode,
                indexName: item.indexName,
                testData: item.testData,
                inspector: this.form.inspector || this.userForm.nickName,
                productCode: this.form.itemCode,
                productName: this.form.itemName,
                inspectDate: this.form.inspectDate,
                lineId: item.lineId,
                batchNo: this.form.taskCode,
                vendorBatch: this.form.entrustCode // 用委外编码作为批次号
              }))

          // 批量提交检测项
          if (testDataList.length > 0) {
            await addTestData(testDataList)
          }
        }

        await uni.showToast({
          title: `${this.isEdit ? '修改' : '新增'}成功`,
          icon: 'success'
        })
        // 触发列表刷新并返回
        uni.$emit('refreshOpqcList', true)
        setTimeout(() => {
          this.goBack()
        }, 1000)
      } catch (error) {
        console.error('提交失败:', error)
        await uni.showToast({
          title: '操作失败：' + (error.message || '未知错误'),
          icon: 'none'
        })
      } finally {
        this.buttonLoading = false
      }
    },

    // 获取检测项类型文本
    getIndexTypeText(result) {
      const resultMap = {
        'SIZE': '尺寸',
        'APPEARANCE': '外观',
        'WEIGHT': '重量',
        'PERFORMANCE': '性能',
        'COMPONENT': '成分'
      }
      return resultMap[result] || result
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        '0': '待检验',
        '1': '已检验'
      }
      return statusMap[status] || '-'
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 内容区域 */
.content {
  padding: 10px;
}

/* 区块样式 */
.section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding-left: 10px;
  border-left: 4px solid #007aff;
}

/* 信息项样式 */
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
  flex-shrink: 0;
  width: 30%;
}

.value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  max-width: 70%;
  text-align: right;
  word-break: break-all;
}

/* 输入框样式 */
.value-input {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  width: 70%;
  text-align: right;
  padding: 4px 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  box-sizing: border-box;
  height: 35px;
}

/* 多行文本框样式 */
.value-textarea {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  width: 70%;
  text-align: right;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  height: 80px;
  resize: none;
}

/* 输入框+按钮组合容器 */
.value-input-group {
  display: flex;
  align-items: center;
  width: 70%;
}

.value-input-group .value-input {
  width: calc(100% - 40px);
  border-radius: 4px 0 0 4px;
}

/* 搜索按钮样式 */
.search-btn {
  height: 35px;
  width: 40px;
  background-color: #f5f5f5;
  border: 1px solid #eee;
  border-left: none;
  border-radius: 0 4px 4px 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 加载状态 */
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

/* 检测项列表样式 */
.line-list {
  margin-top: 10px;
}

.line-item {
  border: 1px solid #f5f5f5;
  border-radius: 6px;
  padding: 2px;
}

.line-item-content {
  padding-left: 4px;
}

/* 无检测项样式 */
.no-line-item {
  text-align: center;
  padding: 30px 0;
}

.no-line-text {
  font-size: 14px;
  color: #999;
}

/* ========== 核心修改：统一按钮样式（和 IPQC 页面一致） ========== */
/* 操作按钮容器 */
.task-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15rpx;
  padding: 20rpx 10rpx;
  border-top: 1rpx solid #f5f5f5;
}

/* 通用按钮基础样式（复用 IPQC 样式） */
.inspect-btn {
  background-color: #007aff;
  color: #fff;
}

.delete-btn {
  background-color: #ff4d4f;
  color: #fff;
}

/* 检测项单行布局 */
.test-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.test-item-name {
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
  max-width: 60%;
  word-break: break-all;
}

.test-item-name span {
  color: #909399;
  margin-left: 4px;
}

.test-data-input {
  font-size: 14px;
  color: #333;
  width: 35%;
  min-width: 120px;
  text-align: right;
  padding: 4px 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  box-sizing: border-box;
  height: 35px;
}

.line-item-content .info-item {
  padding: 10px 0;
}
</style>