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
          <text class="label">来料检验单编号:</text>
          <input
              class="value-input"
              v-model="form.iqcCode"
              placeholder="请输入来料检验单编号"
              :disabled="mode === 'show' || mode === 'edit'"
          />
        </view>
        <view class="info-item">
          <text class="label">来料检验单名称:</text>
          <input
              class="value-input"
              v-model="form.iqcName"
              placeholder="请输入来料检验单名称"
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
        <view class="info-item">
          <text class="label">来料日期:</text>
          <text class="value">{{ formatDate(form.reciveDate)}}</text>
        </view>
      </view>
      <!-- 供应商信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">供应商信息</text>
        </view>
        <view class="info-item">
          <text class="label">供应商编码:</text>
          <input
              class="value-input"
              v-model="form.vendorCode"
              placeholder="请输入供应商编码"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">供应商名称:</text>
          <input
              class="value-input"
              v-model="form.vendorName"
              placeholder="请输入供应商名称"
              :disabled="mode === 'show'"
          />
        </view>
        <view class="info-item">
          <text class="label">批次号:</text>
          <input
              class="value-input"
              v-model="form.batchCode"
              placeholder="请输入批次号"
              :disabled="mode === 'show'"
          />
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
              v-model="user.nickName"
              placeholder="请输入检测人员"
              :disabled="mode === 'show'"
          />
        </view>

        <view class="info-item">
          <text class="label">故障描述:</text>
          <textarea
              class="value-textarea"
              v-model="form.defectName"
              placeholder="请输入故障描述"
              :disabled="mode === 'show'"
          />
        </view>
      </view>

      <!-- 其他信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">其他信息</text>
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
      <view class="section" v-if="form.iqcId != null && form.templateId != null">
        <view class="section-header">
          <text class="section-title">检测项</text>
        </view>

        <view v-if="!ipqcLineList.length" class="no-line-item">
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
import { onLoad } from '@dcloudio/uni-app'
import QctemSingle from "../qcIpqc/single";
import { addIqc, updateIqc, updateTemplate,getIqc} from '@/api/quality/qcIqc'
import { listIqcLine } from '@/api/quality/qcIqcLine'
import { addTestData } from '@/api/quality/qcTestData'
import { getTemplateByType } from "@/api/quality/qcTemplate"
import {getUserProfile} from "@/api/system/user";

export default {
  name: 'IqcDetail',
  components: {
    QctemSingle
  },
  data() {
    return {
      loading: true,
      buttonLoading: false,
      mode: 'add', // add/edit/show
      user: {},
      form: {
        iqcId: '',
        iqcCode: '',
        iqcName: '',
        templateId: '',
        vendorId: '',
        vendorCode: '',
        vendorName: '',
        vendorNick: '',
        batchCode: '',
        itemId: '',
        itemCode: '',
        itemName: '',
        specification: '',
        unitOfMeasure: '',
        quantityCheck: '',
        quantityUnqualified: '',
        checkResult: '',
        reciveDate: '',
        inspectDate: '',
        inspector: '',
        status: '',
        remark: '',
        templateName: '',
        defectName: '',
        createByNick: '',
        updateByNick: '',
        axleLoad: '',
        quantityQualified: ''
      },
      ipqcLineList: [],
      iqcId: ''
    }
  },
  computed: {
    // 页面标题
    dialogTitle() {
      const titles = {
        add: '新增来料检验单',
        edit: '修改来料检验单',
        show: '查看来料检验单'
      }
      return titles[this.mode]
    },
    // 是否为编辑模式
    isEdit() {
      return this.mode === 'edit'
    }
  },
  onLoad(options) {
    if (options.iqcId) {
      this.iqcId = options.iqcId
      this.mode = options.mode || 'edit'
      // 加载详情和检测项
      Promise.all([this.loadIqcDetail(), this.loadIqcLine()])
          .catch(error => console.error('加载数据失败:', error))
    } else if (options.mode === 'add') {
      // 新增模式
      this.mode = 'add'
      this.loading = false
    }
    this.getUser();
  },
  methods: {
    // 格式化日期适配uni-app picker
    formatDate(value) {
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
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
        iqcCode, iqcName, specification, unitOfMeasure, quantityQualified,
        templateName
      } = this.form

      if (!iqcCode) {
        uni.showToast({ title: '来料检验单编号不能为空', icon: 'none' })
        return false
      }
      if (!iqcName) {
        uni.showToast({ title: '来料检验单名称不能为空', icon: 'none' })
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
      if (!quantityQualified && quantityQualified !== 0) {
        uni.showToast({ title: '合格净重不能为空', icon: 'none' })
        return false
      }
      if (!templateName) {
        uni.showToast({ title: '检测模板名称不能为空', icon: 'none' })
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
    // 加载检验单详情
    async loadIqcDetail() {
      this.loading = true
      try {
        const res = await getIqc(this.iqcId)
        if (res.code === 200) {
          this.form = { ...res.data }
          this.form.quantityQualified = this.form.quantityCheck || 0
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
    // 加载检测项
    async loadIqcLine() {
      try {
        //判断是否绑定检测项
        if (this.form.templateId === null || this.form.templateId === '') {
          const res = await getTemplateByType("IQC", this.iqcId)
          if (res.code === 200&&res.data!==null) {
            this.form.templateName = res.data.templateName
            this.form.templateId = res.data.templateId
            this.form.templateCode = res.data.templateCode
          }
        }
        const params = { iqcId: this.iqcId }
        const res = await listIqcLine(params)
        this.ipqcLineList = res.rows || []
      } catch (error) {
        console.error('加载检测项失败:', error)
        uni.showToast({ title: '检测项加载失败', icon: 'none' })
        this.ipqcLineList = []
      }
    },
    // 返回上一页
    goBack() {
      uni.navigateBack()
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
                iqcId: this.form.iqcId,
                itemId: this.form.itemId
              }
              await updateTemplate(data)
              uni.hideLoading()
              uni.showToast({
                title: '更换检测模板成功',
                icon: 'success'
              })
              this.form.templateId = cpp.templateId
              // 刷新检测项
              await this.loadIqcLine()
            } catch (e) {
              uni.hideLoading()
              console.log('更换模板异常：', e)
              uni.showToast({
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
      if (!this.form.defectName?.trim()) {
        uni.showToast({ title: '请填写故障描述', icon: 'none' })
        return
      }
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
        const check = Number(this.form.quantityCheck) || 0
        const qualified = Number(this.form.quantityQualified) || 0
        this.form.quantityUnqualified = Number((check - qualified).toFixed(2))
        // 组装提交数据
        const submitData = { ...this.form }
        delete submitData.createByNick
        delete submitData.updateByNick
        submitData.inspector = this.user.nickName

        let iqcId = this.form.iqcId
        // 新增/编辑区分
        if (this.isEdit) {
          await updateIqc(submitData)
        } else {
          const res = await addIqc(submitData)
          iqcId = res.data.iqcId
        }

        // 保存检测项数据
        const checkResultList = this.ipqcLineList || []
        if (checkResultList.length > 0) {
          const testDataList = checkResultList
              .filter(item => item.testData && item.testData.trim() !== '')
              .map(item => ({
                iqcId: iqcId,
                iqcCode: this.form.iqcCode,
                iqcName: this.form.iqcName,
                ipqcCode: this.form.iqcCode,
                ipqcName: this.form.iqcName,
                ipqcId: this.form.iqcId,
                indexId: item.indexId,
                indexCode: item.indexCode,
                indexName: item.indexName,
                testData: item.testData,
                inspector: this.form.inspector || this.user.nickName,
                productCode: this.form.itemCode,
                productName: this.form.itemName,
                inspectDate: this.form.inspectDate,
                lineId: item.lineId,
                batchNo: this.form.batchCode,
                batchCode: this.form.batchCode
              }))

          // 批量提交检测项
          if (testDataList.length > 0) {
            await addTestData(testDataList)
          }
        }

        uni.showToast({
          title: `${this.isEdit ? '修改' : '新增'}成功`,
          icon: 'success'
        })
        // 触发列表刷新并返回
        uni.$emit('refreshIqcList', true)
        setTimeout(() => {
          this.goBack()
        }, 1000)
      } catch (error) {
        console.error('提交失败:', error)
        uni.showToast({
          title: '操作失败：' + (error.message || '未知错误'),
          icon: 'none'
        })
      } finally {
        this.buttonLoading = false
      }
    },
    // 关闭页面（取消）
    handleClose() {
      uni.navigateBack()
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
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 头部样式 */
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

/* 操作按钮 */
.task-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15rpx;
  padding: 20rpx 10rpx;
  border-top: 1rpx solid #f5f5f5;
}

.inspect-btn {
  background-color: #007aff;
  color: #fff;
}

.delete-btn {
  background-color: #ff4d4f;
  color: #fff;
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