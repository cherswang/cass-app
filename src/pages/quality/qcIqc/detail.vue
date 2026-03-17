<template>
  <view class="page">
    <!-- 内容区域 -->
    <view class="content" v-if="!loading">
      <!-- 基础信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">基础信息</text>
        </view>

        <view class="info-item">
          <text class="label">检验单编号:</text>
          <text class="value">{{ iqcDetail.iqcCode || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">检验单名称:</text>
          <text class="value">{{ iqcDetail.iqcName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">来料日期:</text>
          <text class="value">{{ formatDate(iqcDetail.reciveDate) }}</text>
        </view>
      </view>

      <!-- 供应商信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">供应商信息</text>
        </view>

        <view class="info-item">
          <text class="label">供应商编码:</text>
          <text class="value">{{ iqcDetail.vendorCode || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">供应商名称:</text>
          <text class="value">{{ iqcDetail.vendorName || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">批次号:</text>
          <text class="value">{{ iqcDetail.batchCode || '-' }}</text>
        </view>
      </view>

      <!-- 产品信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">产品信息</text>
        </view>

        <view class="info-item">
          <text class="label">产品编码:</text>
          <text class="value">{{ iqcDetail.itemCode || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">产品名称:</text>
          <text class="value">{{ iqcDetail.itemName || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">规格型号:</text>
          <text class="value">{{ iqcDetail.specification || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">单位:</text>
          <text class="value">{{ iqcDetail.unitOfMeasure || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">盘重:</text>
          <text class="value">{{ iqcDetail.axleLoad || 0 }}</text>
        </view>
      </view>

      <!-- 检验信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">检验信息</text>
        </view>

        <view class="info-item">
          <text class="label">检测方案:</text>
          <text class="value">{{ iqcDetail.templateName || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">检测重量:</text>
          <text class="value">{{ iqcDetail.quantityCheck || 0 }}</text>
        </view>

        <view class="info-item">
          <text class="label">合格净重:</text>
          <text class="value">{{ iqcDetail.quantityQualified || 0 }}</text>
        </view>

        <view class="info-item">
          <text class="label">不合格重量:</text>
          <text class="value">{{ iqcDetail.quantityUnqualified || 0 }}</text>
        </view>

        <view class="info-item">
          <text class="label">检测人员:</text>
          <text class="value">{{ iqcDetail.inspector || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">检测日期:</text>
          <text class="value">{{ formatDate(iqcDetail.inspectDate) }}</text>
        </view>

        <view class="info-item">
          <text class="label">检测结果:</text>
          <text class="value" :class="getResultType(iqcDetail.checkResult) === 'success' ? 'text-green' : 'text-red'">
            {{ getResultText(iqcDetail.checkResult) || '未检测' }}
          </text>
        </view>

        <view class="info-item">
          <text class="label">故障描述:</text>
          <text class="value">{{ iqcDetail.defectName || '无' }}</text>
        </view>
      </view>

      <!-- 其他信息区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">其他信息</text>
        </view>

        <view class="info-item">
          <text class="label">创建者:</text>
          <text class="value">{{ iqcDetail.createByNick || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">更新者:</text>
          <text class="value">{{ iqcDetail.updateByNick || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">备注:</text>
          <text class="value">{{ iqcDetail.remark || '无' }}</text>
        </view>
      </view>

      <!-- 检测项区块 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">检测项</text>
        </view>

        <view v-if="iqcLineList.length === 0" class="no-line-item">
          <text class="no-line-text">暂无检测项数据</text>
        </view>

        <view v-else class="line-list">
          <view class="line-item" v-for="(line, index) in iqcLineList" :key="line.id || index">
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
        <button class="inspect-btn" @click="openTestRecordModal(iqcDetail.iqcId)">
          查看检测记录
        </button>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 检测记录弹窗组件 -->
    <Defectrecord
        :lineId="currentLineId"
        :dialog-show="testRecordDialogShow"
        :qcId = "iqcId"
        @close="testRecordDialogShow = false"
    />
  </view>
</template>

<script>
import { onLoad } from '@dcloudio/uni-app'
import { getIqc } from '@/api/quality/qcIqc'
import { listIqcLine } from '@/api/quality/qcIqcLine'
import { getTemplateByType } from "@/api/quality/qcTemplate"
// 引入检测记录弹窗组件（请根据实际路径调整）
import Defectrecord from '@/pages/quality/testData/index.vue'

export default {
  name: 'IqcDetail',
  components: {
    Defectrecord // 注册弹窗组件
  },
  data() {
    return {
      iqcDetail: {},
      iqcLineList: [],
      loading: true,
      iqcId: '',
      currentLineId: '', // 当前点击的检测项ID
      testRecordDialogShow: false // 控制检测记录弹窗显示
    }
  },
  onLoad(options) {
    if (options.iqcId) {
      this.iqcId = options.iqcId
      // 串行加载数据，确保依赖正确
      this.loadIqcDetail().then(() => {
        this.loadIqcLine()
      })
    }
  },
  methods: {
    // 加载检测项
    async loadIqcLine() {
      try {
        // 判断是否绑定检测项
        if (this.iqcDetail.templateId === null || this.iqcDetail.templateId === '') {
          const res = await getTemplateByType("IQC", this.iqcId)
          if (res.code === 200 && res.data !== null) {
            this.iqcDetail.templateName = res.data.templateName
            this.iqcDetail.templateId = res.data.templateId
            this.iqcDetail.templateCode = res.data.templateCode
          }
        }

        const params = { iqcId: this.iqcId }
        const res = await listIqcLine(params)
        this.iqcLineList = res.rows ? [...res.rows] : [] // 强制数组更新
      } catch (error) {
        console.error('加载检测项失败:', error)
        uni.showToast({ title: '加载检测项失败', icon: 'none' })
        this.iqcLineList = []
      }
    },

    // 加载检验单详情
    async loadIqcDetail() {
      this.loading = true
      try {
        const res = await getIqc(this.iqcId)
        if (res.code === 200) {
          this.iqcDetail = res.data || {}
          // 计算不合格重量（如果后端未返回）
          if (!this.iqcDetail.quantityUnqualified && this.iqcDetail.quantityCheck && this.iqcDetail.quantityQualified) {
            this.iqcDetail.quantityUnqualified = Number(this.iqcDetail.quantityCheck) - Number(this.iqcDetail.quantityQualified)
          }
        } else {
          uni.showToast({ title: res.msg || '加载失败', icon: 'none' })
          setTimeout(() => this.goBack(), 1500)
        }
      } catch (error) {
        console.error('加载检验单详情失败:', error)
        uni.showToast({ title: '网络错误，请重试', icon: 'none' })
      } finally {
        this.loading = false
      }
    },

    // 打开检测记录弹窗
    openTestRecordModal(lineId) {
      this.qcId = lineId
      this.testRecordDialogShow = true // 显示弹窗
    },

    // 返回上一页
    goBack() {
      uni.navigateBack()
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
      return resultMap[result] || result
    },

    // 格式化日期
    formatDate(date) {
      if (!date) return '-'
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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
}

.value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  max-width: 60%;
  text-align: right;
  word-break: break-all;
}

/* 检测项样式 */
.line-list {
  margin-top: 10px;
}

.line-item {
  border: 1px solid #f5f5f5;
  border-radius: 6px;
  padding: 2px;
}


.test-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
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

.test-data-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  width: 35%;
  min-width: 120px;
  text-align: right;
}

.no-line-item {
  padding: 30px 0;
  text-align: center;
}

.no-line-text {
  font-size: 14px;
  color: #999;
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