<template>
  <view class="page">
    <!-- 内容区域 -->
    <view class="content" v-if="!loading">
      <!-- 产品信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">产品信息（{{ipqcDetail.batchNo}}）</text>
        </view>
        <view class="info-item">
          <text class="label">工单编码:</text>
          <input
              class="value-input"
              v-model="ipqcDetail.workorderCode"
              placeholder="请输入工单编码"
              :disabled="true"
          />
        </view>
        <view class="info-item">
          <text class="label">产品编码:</text>
          <input
              class="value-input"
              v-model="ipqcDetail.itemCode"
              placeholder="请输入产品编码"
              :disabled="true"
          />
        </view>

        <view class="info-item">
          <text class="label">产品名称:</text>
          <input
              class="value-input"
              v-model="ipqcDetail.itemName"
              placeholder="请输入产品名称"
              :disabled="true"
          />
        </view>

        <view class="info-item">
          <text class="label">规格型号:</text>
          <textarea
              class="value-textarea"
              v-model="ipqcDetail.specification"
              placeholder="请输入规格型号"
              :disabled="true"
          />
        </view>
        <view class="info-item">
          <text class="label">批次号编码:</text>
          <input
              class="value-input"
              v-model="ipqcDetail.batchNo"
              placeholder="请输入批次号"
              :disabled="true"
          />
        </view>

        <view class="info-item">
          <text class="label">盘重:</text>
          <input
              class="value-input"
              v-model.number="ipqcDetail.axleLoad"
              type="number"
              placeholder="请输入盘重"
              disabled
          />
        </view>
        <view class="info-item">
          <text class="label">检测方案:</text>
          <view class="value-input-group">
            <input
                class="value-input"
                v-model="ipqcDetail.templateName"
                placeholder="请选择方案"
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

        <view class="info-item">
          <text class="label">检测重量:</text>
          <input
              class="value-input"
              v-model.number="ipqcDetail.quantityCheck"
              type="number"
              placeholder="请输入检测数量"
              disabled
          />
        </view>

        <view class="info-item">
          <text class="label">合格净重:</text>
          <input
              class="value-input"
              v-model.number="ipqcDetail.quantityQualified"
              type="number"
              placeholder="请输入合格数量"
              :disabled="mode === 'show'"
              @input="calculateUnqualified"
          />
        </view>

        <view class="info-item">
          <text class="label">不合格重量:</text>
          <input
              class="value-input"
              v-model.number="ipqcDetail.quantityUnqualified"
              type="number"
              placeholder="不合格数量"
              disabled
          />
        </view>

        <view class="info-item">
          <text class="label">检测人员:</text>
          <input
              class="value-input"
              v-model="user.nickName"
              placeholder="请输入检测人员"
              :disabled="true"
          />
        </view>
      </view>
      <!-- 检测项区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">检测项</text>
        </view>

        <view v-if="ipqcLineList.length === 0" class="no-line-item">
          <text class="no-line-text">暂无检测项数据</text>
        </view>
        <view v-else class="line-list">
          <view class="line-item" v-for="(line, index) in ipqcLineList" :key="line.id || index">
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
      </view>

      <!-- 操作按钮 -->
      <view class="task-footer" v-if="mode !== 'show'">
        <button
            class="inspect-btn"
            @click="handleSave()"
            :loading="submitLoading"
        >
          <uni-icons name="edit" size="14" color="#fff"></uni-icons>
          保存
        </button>
        <button
            class="inspect-btn"
            @click="handleCheckPass()"
            :loading="submitLoading"
        >
          <uni-icons name="checkmark" size="14" color="#fff"></uni-icons>
          检验通过
        </button>
        <button
            class="delete-btn"
            @click="handleCheckReject()"
            :loading="submitLoading"
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
    <single-select
        :ipqc-type="ipqcDetail.ipqcType"
        @ok="handleTemplateSelect"
        ref="templateSelectRef"
    ></single-select>
  </view>
</template>

<script>
import { onLoad } from '@dcloudio/uni-app'
import { getIpqc, updateIpqc, updateTemplate } from '@/api/quality/qcIpqc'
import { listIpqcLine } from '@/api/quality/qcIpqcLine'
import { addTestData } from '@/api/quality/qcTestData'
import { getTemplateByType } from "@/api/quality/qcTemplate"
import { getUserProfile } from "@/api/system/user"
import SingleSelect from './single.vue'

export default {
  name: 'IpqcDetail',
  components: {
    SingleSelect
  },
  data() {
    return {
      ipqcDetail: {
        ipqcCode: '',
        ipqcName: '',
        ipqcType: '',
        workorderCode: '',
        inspectDate: '',
        itemCode: '',
        itemName: '',
        specification: '',
        unitOfMeasure: '',
        batchNo: '',
        axleLoad: '',
        quantityCheck: 0,
        quantityQualified: 0,
        quantityUnqualified: 0,
        inspector: '',
        checkResult: '',
        defectName: '',
        remark: '',
        templateName: '',
        templateId: '',
        ipqcId: ''
      },
      ipqcLineList: [],
      loading: true,
      submitLoading: false,
      ipqcId: '',
      ipqcType:'',
      user: {},
      mode: 'edit' // add/edit/show
    }
  },
  onLoad(options) {
    if (options.ipqcId) {
      this.ipqcId = options.ipqcId
      this.ipqcType = options.ipqcType
      // 支持查看模式传参
      if (options.mode) {
        this.mode = options.mode
      }
      Promise.all([this.loadIpqcDetail(), this.loadIpqcLine()])
          .catch(error => console.error('加载数据失败:', error))
    } else if (options.mode === 'add') {
      // 新增模式
      this.mode = 'add'
      this.loading = false
    }
    this.getUser();
  },
  methods: {
    // 格式化日期显示
    formatDate(dateStr) {
      if (!dateStr) return ''
      return dateStr.replace(' ', 'T') // 适配uni-app datetime picker格式
    },
    // 日期选择回调
    handleDateChange(e) {
      const date = e.detail.value.replace('T', ' ')
      this.ipqcDetail.inspectDate = date
    },
    // 计算不合格数量（检测重量 - 合格重量）
    calculateUnqualified() {
      const check = Number(this.ipqcDetail.quantityCheck) || 0
      const qualified = Number(this.ipqcDetail.quantityQualified) || 0
      this.ipqcDetail.quantityUnqualified = Number((check - qualified).toFixed(2))
    },
    // 表单基础校验
    validateForm() {
      const { itemCode, itemName, quantityCheck, quantityQualified, inspectDate, templateName } = this.ipqcDetail

      if (!itemCode) {
        uni.showToast({ title: '产品编码不能为空', icon: 'none' })
        return false
      }
      if (!itemName) {
        uni.showToast({ title: '产品名称不能为空', icon: 'none' })
        return false
      }
      if (!quantityCheck) {
        uni.showToast({ title: '检测重量不能为空', icon: 'none' })
        return false
      }
      if (!quantityQualified && quantityQualified !== 0) {
        uni.showToast({ title: '合格净重不能为空', icon: 'none' })
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
        this.roleGroup = data.roleGroup
        this.postGroup = data.postGroup
      }).catch(error => {
        console.error('获取用户信息失败:', error)
        // 可以在这里添加错误提示或其他处理逻辑
      })
    },
    async loadIpqcLine() {
      try {
        //判断是否绑定检测项
        if (this.ipqcDetail.templateId === null || this.ipqcDetail.templateId === '') {
          const res = await getTemplateByType(this.ipqcType, this.ipqcId)
          if (res.code === 200&&res.data!==null) {
            this.ipqcDetail.templateName = res.data.templateName
            this.ipqcDetail.templateId = res.data.templateId
            this.ipqcDetail.templateCode = res.data.templateCode
          }
        }
        const params = { ipqcId: this.ipqcId }
        const res = await listIpqcLine(params)
        this.ipqcLineList = res.rows || []

      } catch (error) {
        console.error('加载检测项失败:', error)
        uni.showToast({ title: '检测项加载失败', icon: 'none' })
        this.ipqcLineList = []
      }
    },
    async loadIpqcDetail() {
      this.loading = true
      try {
        const res = await getIpqc(this.ipqcId)
        if (res.code === 200) {
          this.ipqcDetail = { ...this.ipqcDetail, ...res.data }
          this.ipqcDetail.quantityQualified = this.ipqcDetail.quantityCheck || 0
        } else {
          uni.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          })
          setTimeout(() => {
            this.goBack()
          }, 1500)
        }
      } catch (error) {
        console.error('加载检验单详情失败:', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },
    handleProgrammeSelect() {
      this.$refs.templateSelectRef.open()
    },
    async handleTemplateSelect(selectedTemplate) {
      if (selectedTemplate) {
        this.ipqcDetail.templateId = selectedTemplate.templateId;
        this.ipqcDetail.templateName = selectedTemplate.templateName;
        this.ipqcDetail.templateCode = selectedTemplate.templateCode;

        uni.showModal({
          title: '提示',
          content: '是否更换检验方案并设置当前方案为该物料的默认方案？如果更换方案会删除当前该单据下所有的检验项信息',
          confirmText: '确定',
          cancelText: '取消',
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({
                  title: '更新中...',
                  mask: true
                })

                const data = {
                  templateId: selectedTemplate.templateId,
                  templateName: selectedTemplate.templateName,
                  ipqcId: this.ipqcDetail.ipqcId,
                  ipqcType: this.ipqcDetail.ipqcType,
                  itemId: this.ipqcDetail.itemId,
                  workorderId: this.ipqcDetail.workorderId
                }

                const result = await updateTemplate(data)

                uni.hideLoading()

                if (result.code === 200) {
                  uni.showToast({
                    title: '更换检测模板成功',
                    icon: 'success',
                    duration: 2000
                  })
                  await this.reloadPageData()
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
                uni.showToast({
                  title: '网络错误，请重试',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          }
        })
      }
    },
    async reloadPageData() {
      try {
        await Promise.all([
          this.loadIpqcDetail(),
          this.loadIpqcLine()
        ])
      } catch (error) {
        console.error('重新加载页面数据失败:', error)
        uni.showToast({
          title: '数据刷新失败',
          icon: 'none'
        })
      }
    },
    getTypeName(type) {
      const typeMap = {
        'IQC': '来料检验',
        'FIRST': '首检',
        'FINAL': '末检',
        'OPQC': '委外检验'
      }
      return typeMap[type] || type
    },
    getResultType(result) {
      const resultMap = {
        'ACCEPT': 'success',
        'REJECT': 'danger'
      }
      return resultMap[result] || 'default'
    },
    getResultText(result) {
      const resultMap = {
        'ACCEPT': '检验通过',
        'REJECT': '检验不通过'
      }
      return resultMap[result] || result
    },
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
    async handleSave() {
      // 基础表单校验
      if (!this.validateForm()) return

      this.submitLoading = true
      try {
        // 1. 保存主表数据（原有逻辑不变）
        const mainData = {
          ...this.ipqcDetail,
          quantityUnqualified: this.ipqcDetail.quantityUnqualified,
          status: this.ipqcDetail.status || '0',
          inspector: this.user.nickName
        }
        // 新增/编辑区分
        let res
        if (this.mode === 'add') {
          // 补充新增逻辑（如果有）
          // res = await addIpqc(mainData);
        } else {
          res = await updateIpqc(mainData)
        }

        if (res && res.code !== 200) {
          uni.showToast({ title: res.msg || '主表保存失败', icon: 'none' })
          this.submitLoading = false
          return
        }

        // 2. 保存检测项数据（原有逻辑不变）
        const lineSubmitData = this.ipqcLineList
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
              ipqcId: this.ipqcDetail.ipqcId || res.data.ipqcId,
              ipqcCode: this.ipqcDetail.ipqcCode,
              ipqcName: this.ipqcDetail.ipqcName,
              inspector: this.ipqcDetail.inspector,
              productCode: this.ipqcDetail.itemCode,
              productName: this.ipqcDetail.itemName,
              templateId: this.ipqcDetail.templateId,
              templateName: this.ipqcDetail.templateName,
              defectName: this.ipqcDetail.defectName,
              remark: this.ipqcDetail.remark,
              batchNo: this.ipqcDetail.batchNo,
              inspectDate: this.ipqcDetail.inspectDate
            })).filter(line => this.isValidTestData(line.testData))

        if (lineSubmitData.length > 0) {
          const testDataRes = await addTestData(lineSubmitData)
          if (testDataRes.code !== 200) {
            uni.showToast({ title: testDataRes.msg || '检测项保存失败', icon: 'none' })
            this.submitLoading = false
            return
          }
        }

        uni.showToast({ title: '保存成功', icon: 'success' })

        // ========== 核心修改：触发刷新事件 + 返回 ==========
        // 触发全局刷新事件
        uni.$emit('refreshIpqcList', true)
        // 延迟返回（确保提示框显示完成）
        setTimeout(() => {
          uni.navigateBack({
            delta: 1, // 返回上一级
            success: () => {
              console.log('返回上级页面并触发刷新')
            }
          })
        }, 1000)

      } catch (error) {
        console.error('保存失败:', error)
        uni.showToast({ title: '保存失败，请重试', icon: 'none' })
      } finally {
        this.submitLoading = false
      }
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
    handleCheckPass() {
      this.ipqcDetail.checkResult = 'ACCEPT'
      this.ipqcDetail.status = '1'
      this.handleSave()
    },
    handleCheckReject() {
      if (!this.ipqcDetail.defectName?.trim()) {
        uni.showToast({ title: '请填写不合格原因', icon: 'none' })
        return
      }
      this.ipqcDetail.checkResult = 'REJECT'
      this.ipqcDetail.status = '1'
      this.handleSave()
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #007aff;
  color: #ffffff;
}

.header-left,
.header-right {
  width: 40px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}
.content {
  padding: 10px;
}

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

.status-tag {
  font-size: 12px;
  padding: 2px 8px;
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
.inspect-btn {
  background-color: #007aff;
  color: #fff;
}
.delete-btn {
  background-color: #ff4d4f;
  color: #fff;
}
/* 操作按钮 */
.task-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15rpx;
  padding: 20rpx 10rpx;
  border-top: 1rpx solid #f5f5f5;
}
/* 输入框+按钮组合容器 */
.value-input-group {
  display: flex;
  align-items: center;
  width: 70%;
}

/* 保持原有输入框样式，调整右边距 */
.value-input-group .value-input {
  width: calc(100% - 40px);
  border-radius: 4px 0 0 4px; /* 左圆角 */
}

/* 搜索按钮样式 */
.search-btn {
  height: 35px;
  width: 40px;
  background-color: #f5f5f5;
  border: 1px solid #eee;
  border-left: none;
  border-radius: 0 4px 4px 0; /* 右圆角 */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.test-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

/* 检测项名称+单位样式 */
.test-item-name {
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
  /* 限制名称宽度，避免挤压输入框 */
  max-width: 60%;
  word-break: break-all;
}
/* 单位文字样式（可选，更柔和） */
.test-item-name span {
  color: #909399;
  margin-left: 4px;
}

/* 检测数据输入框样式 */
.test-data-input {
  font-size: 14px;
  color: #333;
  width: 35%; /* 调整输入框宽度，可根据需求修改 */
  min-width: 120px;
  text-align: right;
  padding: 4px 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  box-sizing: border-box;
  height: 35px;
}

/* 移除原有 info-item 样式对新布局的影响（如需要） */
.line-item-content .info-item {
  padding: 10px 0;
}

/* 原有样式不变 */
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>