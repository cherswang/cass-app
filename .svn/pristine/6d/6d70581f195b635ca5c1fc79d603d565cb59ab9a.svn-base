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
          <text class="value">{{ ipqcDetail.workorderCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">产品编码:</text>
          <text class="value">{{ ipqcDetail.itemCode || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">产品名称:</text>
          <text class="value">{{ ipqcDetail.itemName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">批次编号:</text>
          <text class="value">{{ ipqcDetail.batchNo || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">规格型号:</text>
          <text class="value">{{ ipqcDetail.specification || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">单位:</text>
          <text class="value">{{ ipqcDetail.unitOfMeasure || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">检测方案:</text>
          <text class="value">{{ ipqcDetail.templateName || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">检测重量:</text>
          <text class="value">{{ ipqcDetail.quantityCheck || 0 }}</text>
        </view>
        <view class="info-item">
          <text class="label">合格净重:</text>
          <text class="value">{{ ipqcDetail.quantityQualified || 0 }}</text>
        </view>
        <view class="info-item">
          <text class="label">不合格重量:</text>
          <text class="value">{{ ipqcDetail.quantityUnqualified || 0 }}</text>
        </view>
        <view class="info-item">
          <text class="label">检测人员:</text>
          <text class="value">{{ ipqcDetail.inspector || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">检测日期:</text>
          <text class="value">{{ formatDate(ipqcDetail.inspectDate) }}</text>
        </view>

        <view class="info-item">
          <text class="label">检测结果:</text>
          <text class="value" :class="getResultType(ipqcDetail.checkResult) === 'success' ? 'text-green' : 'text-red'">
            {{ getResultText(ipqcDetail.checkResult) || '未检测' }}
          </text>
        </view>
        <view class="info-item">
          <text class="label">不合格原因:</text>
          <text class="value">{{ ipqcDetail.defectName || '无' }}</text>
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
                <text class="test-data-value">{{ line.testData || '-' }}</text>
              </view>
            </view>
          </view>
        </view>

        <button class="inspect-btn" @click="openTestRecordModal(ipqcDetail.ipqcId)">
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
        :qcId = "ipqcId"
        :dialog-show="testRecordDialogShow"
        @close="testRecordDialogShow = false"
    />
  </view>
</template>

<script>
import { onLoad } from '@dcloudio/uni-app'
import { getIpqc } from '@/api/quality/qcIpqc'
import { listIpqcLine } from '@/api/quality/qcIpqcLine'
// 引入检测记录弹窗组件（请根据实际路径调整）
import Defectrecord from '@/pages/quality/testData/index.vue'

export default {
  name: 'IpqcDetail',
  components: {
    Defectrecord // 注册弹窗组件
  },
  data() {
    return {
      ipqcDetail: {},
      ipqcLineList: [],
      loading: true,
      ipqcId: '',
      currentLineId: '', // 当前点击的检测项ID
      testRecordDialogShow: false // 控制检测记录弹窗显示
    }
  },
  onLoad(options) {
    if (options.ipqcId) {
      this.ipqcId = options.ipqcId
      // 串行加载数据，确保依赖正确
      this.loadIpqcDetail().then(() => {
        this.loadIpqcLine()
      })
    }
  },
  methods: {
    // 加载检测项
    async loadIpqcLine() {
      try {
        const params = { ipqcId: this.ipqcId }
        const res = await listIpqcLine(params)
        this.ipqcLineList = res.rows ? [...res.rows] : [] // 强制数组更新
      } catch (error) {
        console.error('加载检测项失败:', error)
        uni.showToast({ title: '加载检测项失败', icon: 'none' })
        this.ipqcLineList = []
      }
    },

    // 加载检验单详情
    async loadIpqcDetail() {
      this.loading = true
      try {
        const res = await getIpqc(this.ipqcId)
        if (res.code === 200) {
          this.ipqcDetail = res.data || {}
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

    // 获取检验类型名称
    getTypeName(type) {
      const typeMap = {
        '1': '来料检验',
        '2': '过程检验',
        '3': '成品检验',
        '4': '出库检验'
      }
      return typeMap[type] || type
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

/* 检测项样式（核心改造） */
.line-list {
  margin-top: 10px;
}

.line-item {
  border: 1px solid #f5f5f5;
  border-radius: 6px;
  padding: 2px;
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