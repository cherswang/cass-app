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
        <text class="dialog-title">{{ dialogTitle }}</text>
      </view>

      <!-- 内容滚动区域 -->
      <scroll-view class="dialog-content" scroll-y>
        <!-- 加载状态 -->
        <view class="loading" v-if="loading">
          <u-loading-icon size="24" text="加载中..."></u-loading-icon>
        </view>

        <!-- 核心内容（非加载状态） -->
        <view v-else>
          <!-- 检验单基本信息区块 -->
          <view class="section">
            <view class="section-header">
              <text class="section-title">检验单基本信息</text>
            </view>
            <view class="custom-form">
              <view class="form-row border-bottom">
                <view class="form-label">检验单编号</view>
                <view class="form-content">
                  <template v-if="mode === 'show'">
                    <text class="view-mode-text">{{ form.opqcCode || '-' }}</text>
                  </template>
                  <template v-else>
                    <u-input
                        v-model="form.opqcCode"
                        placeholder="请输入检验单编号"
                        size="default"
                        :disabled="mode === 'edit'"
                    />
                  </template>
                </view>
              </view>
              <view class="form-row border-bottom">
                <view class="form-label">检验单名称</view>
                <view class="form-content">
                  <template v-if="mode === 'show'">
                    <text class="view-mode-text">{{ form.opqcName || '-' }}</text>
                  </template>
                  <template v-else>
                    <u-input
                        v-model="form.opqcName"
                        placeholder="请输入检验单名称"
                        size="default"
                    />
                  </template>
                </view>
              </view>
              <view class="form-row border-bottom">
                <view class="form-label">检验模板名称</view>
                <view class="form-content">
                  <template v-if="mode === 'show'">
                    <text class="view-mode-text">{{ form.templateName || '-' }}</text>
                  </template>
                  <template v-else>
                    <view class="template-select-container">
                      <u-input
                          v-model="form.templateName"
                          placeholder="请选择检验模板"
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
            </view>
          </view>

          <!-- 生产信息区块 -->
          <view class="section">
            <view class="section-header">
              <text class="section-title">生产信息</text>
            </view>
            <view class="custom-form">
              <view class="form-row border-bottom" v-for="(item, key) in productionFields" :key="key">
                <view class="form-label">{{ item.label }}</view>
                <view class="form-content">
                  <template v-if="mode === 'show'">
                    <text class="view-mode-text">{{ form[item.prop] || '-' }}</text>
                  </template>
                  <template v-else>
                    <u-input
                        v-model="form[item.prop]"
                        :placeholder="item.placeholder"
                        size="default"
                    />
                  </template>
                </view>
              </view>
              <view class="form-row border-bottom">
                <view class="form-label">要求完成时间</view>
                <view class="form-content">
                  <text class="view-mode-text">{{ formatDate(form.finishTime) || '-' }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 委托信息区块 -->
          <view class="section">
            <view class="section-header">
              <text class="section-title">委托信息</text>
            </view>
            <view class="custom-form">
              <view class="form-row border-bottom" v-for="(item, key) in entrustFields" :key="key">
                <view class="form-label">{{ item.label }}</view>
                <view class="form-content">
                  <template v-if="mode === 'show'">
                    <text class="view-mode-text">{{ form[item.prop] || '-' }}</text>
                  </template>
                  <template v-else>
                    <u-input
                        v-model="form[item.prop]"
                        :placeholder="item.placeholder"
                        size="default"
                    />
                  </template>
                </view>
              </view>
              <view class="form-row border-bottom">
                <view class="form-label">委托日期</view>
                <view class="form-content">
                  <text class="view-mode-text">{{ formatDate(form.entrustTime) || '-' }}</text>
                </view>
              </view>
              <view class="form-row border-bottom">
                <view class="form-label">外协日期</view>
                <view class="form-content">
                  <template v-if="mode === 'show'">
                    <text class="view-mode-text">{{ formatDate(form.outsourcingTime) || '-' }}</text>
                  </template>
                  <template v-else>
                    <view class="template-select-container">
                      <u-input
                          v-model="form.outsourcingTime"
                          placeholder="请选择外协日期"
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
                    </view>
                  </template>
                </view>
              </view>
            </view>
          </view>

          <!-- 产品信息区块 -->
          <view class="section">
            <view class="section-header">
              <text class="section-title">产品信息</text>
            </view>
            <view class="custom-form">
              <view class="form-row border-bottom" v-for="(item, key) in productFields" :key="key">
                <view class="form-label">{{ item.label }}</view>
                <view class="form-content">
                  <template v-if="mode === 'show'">
                    <text class="view-mode-text">{{ form[item.prop] || '-' }}</text>
                  </template>
                  <template v-else>
                    <u-input
                        v-model="form[item.prop]"
                        :placeholder="item.placeholder"
                        size="default"
                        :type="item.type || 'text'"
                        v-model.number="form[item.prop]"
                    />
                  </template>
                </view>
              </view>
            </view>
          </view>

          <!-- 检验信息区块 -->
          <view class="section">
            <view class="section-header">
              <text class="section-title">检验信息</text>
            </view>
            <view class="custom-form">
              <view class="form-row border-bottom">
                <view class="form-label">检测重量</view>
                <view class="form-content">
                  <text class="view-mode-text">{{ form.quantityCheck || 0 }}</text>
                </view>
              </view>
              <view class="form-row border-bottom">
                <view class="form-label">合格净重</view>
                <view class="form-content">
                  <template v-if="mode === 'show'">
                    <text class="view-mode-text">{{ form.quantityQualified || 0 }}</text>
                  </template>
                  <template v-else>
                    <u-input
                        v-model.number="form.quantityQualified"
                        type="number"
                        placeholder="请输入合格净重"
                        size="default"
                        @input="calculateUnqualified"
                    />
                  </template>
                </view>
              </view>
              <view class="form-row border-bottom">
                <view class="form-label">不合格重量</view>
                <view class="form-content">
                  <text class="view-mode-text">{{ form.quantityUnqualified || 0 }}</text>
                </view>
              </view>
              <view class="form-row border-bottom">
                <view class="form-label">检测人员</view>
                <view class="form-content">
                  <text class="view-mode-text">{{ userForm.nickName || '-' }}</text>
                </view>
              </view>
              <view class="form-row border-bottom">
                <view class="form-label">备注</view>
                <view class="form-content">
                  <template v-if="mode === 'show'">
                    <text class="view-mode-text">{{ form.remark || '-' }}</text>
                  </template>
                  <template v-else>
                    <u-input
                        v-model="form.remark"
                        placeholder="请输入备注信息"
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
          <view class="section" v-if="form.opqcId != null && form.templateId != null">
            <view class="section-header">
              <text class="section-title">检测项</text>
            </view>
            <view v-if="!opqcLineList.length" class="no-line-item">
              <u-empty text="暂无检测项数据" mode="data"></u-empty>
            </view>
            <view v-else class="custom-form line-list">
              <view class="form-row border-bottom" v-for="(line, index) in opqcLineList" :key="line.id || index">
                <view class="form-label">
                  {{ line.indexName || '-' }}
                  <span v-if="line.unitOfMeasure && line.unitOfMeasure.trim()">({{ line.unitOfMeasure }})</span>
                </view>
                <view class="form-content">
                  <template v-if="mode === 'show'">
                    <text class="view-mode-text">{{ line.testData || '-' }}</text>
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
        </view>
      </scroll-view>

      <!-- 操作按钮区（非查看模式+非加载） -->
      <view class="dialog-footer" v-if="mode !== 'show' && !loading">
        <u-button text="取消" size="small" @click="handleClose" :disabled="buttonLoading"></u-button>
        <u-button class="save-btn" type="primary" text="保存" size="small" @click="submitWithTestItems" :loading="buttonLoading" :disabled="buttonLoading"></u-button>
        <u-button class="pass-btn" type="success" text="检验通过" size="small" @click="passedByTest" :loading="buttonLoading" :disabled="buttonLoading"></u-button>
        <u-button class="reject-btn" type="error" text="检验不通过" size="small" @click="notPassedByTest" :loading="buttonLoading" :disabled="buttonLoading"></u-button>
      </view>
    </view>

    <!-- 日期选择器（外协日期） -->
    <uni-date-picker
        v-if="showDatePicker"
        :range="false"
        :value="form.outsourcingTime"
        @change="handleDateConfirm"
        @close="showDatePicker = false"
    />

    <!-- 选择方案弹窗组件 -->
    <QctemSingle
        ref="qctemSingleSelect"
        @ok="onProgramme"
    ></QctemSingle>

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
          <text class="modal-text">是否更换检验方案？更换后会删除当前单据下所有检测项信息</text>
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
  name: 'OpqcInspectDialog',
  components: {
    QctemSingle
  },
  props: {
    // 控制弹窗显示隐藏
    show: {
      type: Boolean,
      default: false
    },
    // 检验单ID
    opqcId: {
      type: String,
      default: ''
    },
    // 模式：add/edit/show
    mode: {
      type: String,
      default: 'edit',
      validator: val => ['add', 'edit', 'show'].includes(val)
    }
  },
  emits: ['update:show', 'close', 'success'],
  data() {
    return {
      loading: true,
      buttonLoading: false,
      userForm: {},
      templateTypeIndex: 0,
      templateTypeOptions: TEMPLATE_TYPE_OPTIONS,
      showDatePicker: false, // 外协日期选择器显示
      showConfirmPopup: false, // 更换模板确认弹窗
      selectedTemplate: null, // 选中的模板数据
      form: {
        opqcId: '',
        opqcCode: '',
        opqcName: '',
        opqcType: 'OPQC', // 默认为委外检验
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
      // 生产信息字段配置（简化循环）
      productionFields: [
        { label: '工单编码', prop: 'workorderCode', placeholder: '请输入工单编码' },
        { label: '工单名称', prop: 'workorderName', placeholder: '请输入工单名称' },
        { label: '任务编号', prop: 'taskCode', placeholder: '请输入任务编号' },
        { label: '工序名称', prop: 'processName', placeholder: '请输入工序名称' },
        { label: '工作站名称', prop: 'workstationName', placeholder: '请输入工作站名称' }
      ],
      // 委托信息字段配置（简化循环）
      entrustFields: [
        { label: '委托单位', prop: 'entrustCorp', placeholder: '请输入委托单位' },
        { label: '委托负责人', prop: 'entrustUsername', placeholder: '请输入委托负责人' },
        { label: '外协单位', prop: 'outsourcingCorp', placeholder: '请输入外协单位' },
        { label: '外协负责人', prop: 'outsourcingUser', placeholder: '请输入外协负责人' }
      ],
      // 产品信息字段配置（简化循环）
      productFields: [
        { label: '产品物料编码', prop: 'itemCode', placeholder: '请输入产品物料编码' },
        { label: '产品物料名称', prop: 'itemName', placeholder: '请输入产品物料名称' },
        { label: '规格型号', prop: 'specification', placeholder: '请输入规格型号' },
        { label: '单位', prop: 'unitOfMeasure', placeholder: '请输入单位' },
        { label: '盘重', prop: 'axleLoad', placeholder: '请输入盘重', type: 'number' }
      ]
    }
  },
  computed: {
    // 弹窗标题
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
  watch: {
    // 监听弹窗显示，加载数据
    show(val) {
      if (val) {
        this.initData()
      }
    },
    // 监听opqcId变化，重新加载数据
    opqcId(val) {
      if (this.show && val) {
        this.loadData()
      }
    }
  },
  methods: {
    // 初始化数据
    async initData() {
      this.loading = true
      this.form = this.$options.data().form
      this.form.opqcType = 'OPQC'
      this.opqcLineList = []
      try {
        // 先获取用户信息
        await this.getUser()
        // 新增模式直接结束加载，编辑/查看模式加载详情
        if (this.mode === 'add') {
          this.loading = false
        } else {
          await this.loadData()
        }
      } catch (error) {
        console.error('初始化失败:', error)
        uni.showToast({ title: '初始化失败', icon: 'none' })
        this.loading = false
      }
    },

    // 加载检验单详情+检测项
    async loadData() {
      try {
        await Promise.all([this.loadOpqcDetail(), this.loadOpqcLine()])
      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({ title: '加载失败，请重试', icon: 'none' })
      } finally {
        this.loading = false
      }
    },

    // 格式化日期
    formatDate(value) {
      if (!value) return ''
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
        quantityCheck
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
      try {
        const response = await getUserProfile()
        const data = response.data;
        this.userForm = data.user
        this.form.inspector = data.user.nickName
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },

    // 加载检验单详情
    async loadOpqcDetail() {
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
          this.handleClose()
        }
      } catch (error) {
        console.error('加载检验单详情失败:', error)
        await uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      }
    },

    // 加载检测项
    async loadOpqcLine() {
      try {
        // 判断是否绑定检测项
        if (!this.form.templateId) {
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
        await uni.showToast({ title: '检测项加载失败', icon: 'none' })
        this.opqcLineList = []
      }
    },

    // 关闭弹窗
    handleClose() {
      this.$emit('update:show', false)
      this.$emit('close')
      // 重置弹窗状态
      this.showDatePicker = false
      this.showConfirmPopup = false
      this.selectedTemplate = null
    },

    // 外协日期选择确认
    handleDateConfirm(e) {
      this.form.outsourcingTime = e.value
      this.showDatePicker = false
    },

    // 打开检测方案选择弹窗
    handleProgrammeSelect() {
      this.$refs.qctemSingleSelect.open()
    },

    // 检测方案选择回调（暂存数据，显示确认弹窗）
    onProgramme(cpp) {
      this.selectedTemplate = cpp
      this.showConfirmPopup = true
    },

    // 取消更换模板
    cancelTemplateChange() {
      this.showConfirmPopup = false
      this.selectedTemplate = null
    },

    // 确认更换模板
    async confirmTemplateChange() {
      if (!this.selectedTemplate) return
      this.showConfirmPopup = false

      try {
        uni.showLoading({ title: '更新中...', mask: true })
        const data = {
          templateId: this.selectedTemplate.templateId,
          templateName: this.selectedTemplate.templateName,
          opqcId: this.form.opqcId,
          itemId: this.form.itemId
        }
        await updateTemplate(data)
        uni.hideLoading()
        uni.showToast({ title: '更换检测模板成功', icon: 'success' })
        // 更新表单并刷新检测项
        this.form.templateId = this.selectedTemplate.templateId
        this.form.templateName = this.selectedTemplate.templateName
        await this.loadOpqcLine()
      } catch (e) {
        uni.hideLoading()
        console.log('更换模板异常：', e)
        uni.showToast({ title: '更换失败', icon: 'none' })
      } finally {
        this.selectedTemplate = null
      }
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
        // 触发成功回调，通知父组件刷新
        this.$emit('success')
        this.handleClose()
      } catch (error) {
        console.error('提交失败:', error)
        await uni.showToast({
          title: '操作失败：' + (error.message || '未知错误'),
          icon: 'none'
        })
      } finally {
        this.buttonLoading = false
      }
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

/* 检测方案/日期选择容器 */
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

/* 无检测项样式 */
.no-line-item {
  text-align: center;
  padding: 30px 0;
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

/* 穿透样式修改 */
:deep(.u-input__wrapper) {
  border-radius: 4px;
}

:deep(.u-button--small) {
  min-width: 120rpx;
}

:deep(.u-input--textarea) {
  min-height: 100rpx;
}
</style>