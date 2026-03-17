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
          <text class="value">{{ opqcDetail.opqcCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">检验单名称:</text>
          <text class="value">{{ opqcDetail.opqcName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">检验类型:</text>
          <text class="value">{{ getTemplateTypeText(opqcDetail.opqcType) }}</text>
        </view>
        <view class="info-item">
          <text class="label">检验模板名称:</text>
          <text class="value">{{ opqcDetail.templateName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">检测日期:</text>
          <text class="value">{{ formatDate(opqcDetail.inspectDate) }}</text>
        </view>
        <view class="info-item">
          <text class="label">单据状态:</text>
          <text class="value">{{ getStatusText(opqcDetail.status) }}</text>
        </view>
      </view>

      <!-- 生产信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">生产信息</text>
        </view>
        <view class="info-item">
          <text class="label">工单编码:</text>
          <text class="value">{{ opqcDetail.workorderCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">工单名称:</text>
          <text class="value">{{ opqcDetail.workorderName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">任务编号:</text>
          <text class="value">{{ opqcDetail.taskCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">工序名称:</text>
          <text class="value">{{ opqcDetail.processName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">工作站名称:</text>
          <text class="value">{{ opqcDetail.workstationName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">要求完成时间:</text>
          <text class="value">{{ formatDate(opqcDetail.finishTime) }}</text>
        </view>
      </view>

      <!-- 委托信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">委托信息</text>
        </view>
        <view class="info-item">
          <text class="label">委托单位:</text>
          <text class="value">{{ opqcDetail.entrustCorp || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">委托负责人:</text>
          <text class="value">{{ opqcDetail.entrustUsername || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">委托日期:</text>
          <text class="value">{{ formatDate(opqcDetail.entrustTime) }}</text>
        </view>
        <view class="info-item">
          <text class="label">外协单位:</text>
          <text class="value">{{ opqcDetail.outsourcingCorp || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">外协负责人:</text>
          <text class="value">{{ opqcDetail.outsourcingUser || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">外协日期:</text>
          <text class="value">{{ formatDate(opqcDetail.outsourcingTime) }}</text>
        </view>
      </view>

      <!-- 产品信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">产品信息</text>
        </view>
        <view class="info-item">
          <text class="label">产品物料编码:</text>
          <text class="value">{{ opqcDetail.itemCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">产品物料名称:</text>
          <text class="value">{{ opqcDetail.itemName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">规格型号:</text>
          <text class="value">{{ opqcDetail.specification || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">单位:</text>
          <text class="value">{{ opqcDetail.unitOfMeasure || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">盘重:</text>
          <text class="value">{{ opqcDetail.axleLoad || 0 }}</text>
        </view>
      </view>

      <!-- 检验信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">检验信息</text>
        </view>
        <view class="info-item">
          <text class="label">检测重量:</text>
          <text class="value">{{ opqcDetail.quantityCheck || 0 }}</text>
        </view>
        <view class="info-item">
          <text class="label">合格净重:</text>
          <text class="value">{{ opqcDetail.quantityQualified || 0 }}</text>
        </view>
        <view class="info-item">
          <text class="label">不合格重量:</text>
          <text class="value">{{ opqcDetail.quantityUnqualified || 0 }}</text>
        </view>
        <view class="info-item">
          <text class="label">检测人员:</text>
          <text class="value">{{ opqcDetail.inspector || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">检测结果:</text>
          <text class="value" :class="getResultType(opqcDetail.checkResult) === 'success' ? 'text-green' : 'text-red'">
            {{ getResultText(opqcDetail.checkResult) || '未检测' }}
          </text>
        </view>
        <view class="info-item">
          <text class="label">备注:</text>
          <text class="value">{{ opqcDetail.remark || '无' }}</text>
        </view>
      </view>
      <!-- 检测项区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">检测项</text>
        </view>

        <view v-if="opqcLineList.length === 0" class="no-line-item">
          <text class="no-line-text">暂无检测项数据</text>
        </view>

        <view v-else class="line-list">
          <view class="line-item" v-for="(line, index) in opqcLineList" :key="line.id || index">
            <view class="line-item-content">
              <view class="test-item-row">
                <text class="test-item-name">
                  {{ line.indexName || '-' }}
                  <span v-if="line.unitOfMeasure && line.unitOfMeasure.trim()">({{ line.unitOfMeasure }})</span>
                </text>
                <text class="test-data-value">{{ line.testData || '-' }}</text>
              </view>
            </view>
          </view>
        </view>
        <button class="inspect-btn" @click="openTestRecordModal(opqcDetail.opqcId)">
          查看检测记录
        </button>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 检测记录弹窗组件（根据实际路径调整） -->
    <Defectrecord
        :lineId="currentLineId"
        :dialog-show="testRecordDialogShow"
        :qcId = "opqcId"
        @close="testRecordDialogShow = false"
    />
  </view>
</template>

<script>
import { getOpqc } from '@/api/quality/qcOpqc'
import { listOpqcLine } from '@/api/quality/qcOpqcLine'
import { getTemplateByType } from "@/api/quality/qcTemplate"
// 引入检测记录弹窗组件（请根据实际项目路径调整）
import Defectrecord from '@/pages/quality/testData/index.vue'

// 检验类型字典
const TEMPLATE_TYPE_OPTIONS = [
  { value: 'OPQC', label: '委外检验' },
  { value: 'IPQC', label: '过程检验' },
  { value: 'IQC', label: '来料检验' }
]

export default {
  name: 'OpqcDetail',
  components: {
    Defectrecord
  },
  data() {
    return {
      loading: true,
      opqcDetail: {},
      opqcLineList: [],
      opqcId: '',
      currentLineId: '', // 当前点击的检测项ID
      testRecordDialogShow: false // 控制检测记录弹窗显示
    }
  },
  onLoad(options) {
    if (options.opqcId) {
      this.opqcId = options.opqcId
      // 串行加载数据，确保依赖正确
      this.loadOpqcDetail().then(() => {
        this.loadOpqcLine()
      })
    }
  },
  methods: {
    // 加载检验单详情
    async loadOpqcDetail() {
      this.loading = true
      try {
        const res = await getOpqc(this.opqcId)
        if (res.code === 200) {
          this.opqcDetail = res.data || {}
          // 计算不合格重量（如果后端未返回）
          if (!this.opqcDetail.quantityUnqualified && this.opqcDetail.quantityCheck && this.opqcDetail.quantityQualified) {
            this.opqcDetail.quantityUnqualified = Number(this.opqcDetail.quantityCheck) - Number(this.opqcDetail.quantityQualified)
          }
        } else {
          await uni.showToast({title: res.msg || '加载失败', icon: 'none'})
          setTimeout(() => this.goBack(), 1500)
        }
      } catch (error) {
        console.error('加载检验单详情失败:', error)
        await uni.showToast({title: '网络错误，请重试', icon: 'none'})
      } finally {
        this.loading = false
      }
    },

    // 加载检测项
    async loadOpqcLine() {
      try {
        // 判断是否绑定检测项
        if (this.opqcDetail.templateId === null || this.opqcDetail.templateId === '') {
          const res = await getTemplateByType("OPQC", this.opqcId)
          if (res.code === 200 && res.data !== null) {
            this.opqcDetail.templateName = res.data.templateName
            this.opqcDetail.templateId = res.data.templateId
            this.opqcDetail.templateCode = res.data.templateCode
          }
        }
        const params = { opqcId: this.opqcId }
        const res = await listOpqcLine(params)
        this.opqcLineList = res.rows ? [...res.rows] : [] // 强制数组更新
      } catch (error) {
        console.error('加载检测项失败:', error)
        await uni.showToast({title: '加载检测项失败', icon: 'none'})
        this.opqcLineList = []
      }
    },

    // 打开检测记录弹窗
    openTestRecordModal(lineId) {
      this.qcId = lineId
      this.testRecordDialogShow = true
    },

    // 返回上一页
    goBack() {
      uni.navigateBack()
    },

    // 格式化日期
    formatDate(value) {
      if (!value) return '-'
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const second = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },

    // 获取检验类型文本
    getTemplateTypeText(type) {
      const typeItem = TEMPLATE_TYPE_OPTIONS.find(item => item.value === type)
      return typeItem ? typeItem.label : '-'
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
      return resultMap[result] || '-'
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        '0': '待检验',
        '1': '已检验'
      }
      return statusMap[status] || '-'
    },

    // 获取检测结果样式类型
    getResultType(result) {
      const resultMap = {
        'ACCEPT': 'success',
        'REJECT': 'danger'
      }
      return resultMap[result] || 'default'
    },

    // 获取检测结果文本
    getResultText(result) {
      const resultMap = {
        'ACCEPT': '检验通过',
        'REJECT': '检验不通过'
      }
      return resultMap[result] || '-'
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

/* 检测项列表样式（核心改造） */
.line-list {
  margin-top: 10px;
}

.line-item {
  border: 1px solid #f5f5f5;
  border-radius: 6px;
  padding: 2px;
}

.line-item-header {
  margin-bottom: 10px;
}

.line-item-title {
  font-size: 15px;
  font-weight: bold;
  color: #007aff;
}

.line-item-content {
  padding-left: 8px;
}

/* 检测项单行布局容器 */
.test-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

/* 检测项名称+单位样式 */
.test-item-name {
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
  max-width: 60%;
  word-break: break-all;
}

/* 单位文字样式（浅灰色区分） */
.test-item-name span {
  color: #909399;
  margin-left: 4px;
}

/* 检测数据文本样式 */
.test-data-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  width: 35%;
  min-width: 120px;
  text-align: right;
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

/* 结果颜色 */
.text-green {
  color: #00b42a;
  font-weight: 600;
}

.text-red {
  color: #ff4d4f;
  font-weight: 600;
}

/* 检测数据查看链接样式 */
.record-link {
  margin-left: auto; /* 靠右对齐 */
  background: transparent;
  border: none;
  padding: 0;
  height: auto;
  line-height: normal;
  color: #0066cc; /* 链接蓝色 */
  text-decoration: underline; /* 下划线 */
  font-size: 14px;
  cursor: pointer;
}

.record-link:hover {
  color: #004080;
}

.record-link:active {
  color: #003366;
  background: transparent;
}
.inspect-btn {
  background-color: #007aff;
  color: #fff;
}
</style>