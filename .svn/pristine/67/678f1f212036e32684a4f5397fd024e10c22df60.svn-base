<template>
  <view class="page">
    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 详情内容 -->
    <view class="content" v-if="!loading">
      <!-- 主表信息区域 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">转移单基本信息</text>
        </view>

        <view class="info-item">
          <text class="label">转移单编号:</text>
          <text class="value">{{ form.transferCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">转移单名称:</text>
          <text class="value">{{ form.transferName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">转移单类型:</text>
          <text class="value">{{ getTransferTypeText(form.transferType) }}</text>
        </view>
        <view class="info-item">
          <text class="label">单据状态:</text>
          <text class="value" :class="getStatusClass(form.status)">{{ getStatusText(form.status) }}</text>
        </view>
        <view class="info-item">
          <text class="label">移出仓库:</text>
          <text class="value">{{ form.fromWarehouseName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">移入仓库:</text>
          <text class="value">{{ form.toWarehouseName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">转移日期:</text>
          <text class="value">{{ formatDate(form.transferDate) }}</text>
        </view>
        <view class="info-item" v-if="form.transferType == 'OUTER'">
          <text class="label">目的地:</text>
          <text class="value">{{ form.destination || '-' }}</text>
        </view>
        <view class="info-item" v-if="form.transferType == 'OUTER'">
          <text class="label">承运商:</text>
          <text class="value">{{ form.carrier || '-' }}</text>
        </view>
        <view class="info-item" v-if="form.transferType == 'OUTER'">
          <text class="label">托运单号:</text>
          <text class="value">{{ form.bookingNote || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">备注:</text>
          <text class="value">{{ form.remark || '-' }}</text>
        </view>
      </view>

      <!-- 子表物料信息区域 -->
      <view class="section" v-for="(item, index) in transferLineList" :key="item.lineId || index">
        <view class="section-header">
          <text class="section-title">物料信息 {{ index + 1 }}</text>
        </view>

        <view class="info-item">
          <text class="label">物料编码:</text>
          <text class="value">{{ item.itemCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">物料名称:</text>
          <text class="value">{{ item.itemName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">规格型号:</text>
          <text class="value">{{ item.specification || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">批次号:</text>
          <text class="value">{{ item.batchCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">单位:</text>
          <text class="value">{{ item.unitOfMeasure || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">转移数量:</text>
          <text class="value">{{ item.quantityTransfer || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">移出仓库:</text>
          <text class="value">{{ item.fromWarehouseName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">移入仓库:</text>
          <text class="value">{{ item.toWarehouseName || '-' }}</text>
        </view>
        <view class="info-item" v-if="item.remark">
          <text class="label">备注:</text>
          <text class="value">{{ item.remark || '-' }}</text>
        </view>
      </view>

      <!-- 空物料提示 -->
      <view class="section" v-if="!loading && transferLineList.length === 0">
        <view class="empty-tip">
          <text class="empty-text">暂无物料转移信息</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { onLoad } from '@dcloudio/uni-app'
import "@/static/pages/detail.css"; // 复用通用详情样式

export default {
  name: 'TransferDetail',
  data() {
    return {
      loading: true,
      // 主表数据
      form: {
        transferId: '',
        transferCode: '',
        transferName: '',
        transferType: 'INNER',
        destination: '',
        carrier: '',
        bookingNote: '',
        fromWarehouseName: '',
        toWarehouseName: '',
        transferDate: '',
        status: 'PREPARE',
        remark: ''
      },
      // 子表物料数据
      transferLineList: []
    }
  },
  onLoad() {
    // 从缓存获取父页面传递的行数据
    uni.getStorage({
      key: 'transferRowData',
      success: (res) => {
        // 注入主表和子表数据
        this.setData(res.data);
        this.loading = false;
      },
      fail: () => {
        this.loading = false;
        uni.showToast({ title: '获取数据失败', icon: 'none' });
        setTimeout(() => uni.navigateBack(), 1500);
      }
    });
  },
  methods: {
    /** 注入详情数据 */
    setData(data) {
      // 主表数据赋值
      this.form = {
        transferId: data.transferId || '',
        transferCode: data.transferCode || '',
        transferName: data.transferName || '',
        transferType: data.transferType || 'INNER',
        destination: data.destination || '',
        carrier: data.carrier || '',
        bookingNote: data.bookingNote || '',
        fromWarehouseName: data.fromWarehouseName || '',
        toWarehouseName: data.toWarehouseName || '',
        transferDate: data.transferDate || '',
        status: data.status || 'PREPARE',
        remark: data.remark || ''
      };
      //查询子表数据
      // 子表物料数据赋值
      this.transferLineList = data.materialLines && data.materialLines.length > 0
          ? data.materialLines
          : [];
    },

    /** 格式化日期 */
    formatDate(value) {
      if (!value) return '-';
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    /** 获取转移单类型文本 */
    getTransferTypeText(type) {
      const typeMap = {
        'INNER': '内部转移',
        'OUTER': '外部转移',
        '': '未知类型'
      };
      return typeMap[type] || '未知类型';
    },

    /** 获取状态文本 */
    getStatusText(status) {
      const statusMap = {
        'PREPARE': '待转移',
        'FINISHED': '已转移',
        '': '未知状态'
      };
      return statusMap[status] || '未知状态';
    },

    /** 获取状态文字样式类 */
    getStatusClass(status) {
      const classMap = {
        'PREPARE': 'text-orange',
        'FINISHED': 'text-blue',
      };
      return classMap[status] || '';
    }
  }
}
</script>

<style scoped>
page {
  background-color: #f5f5f5;
  padding: 20rpx;
  box-sizing: border-box;
}

.page {
  width: 100%;
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.loading-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 内容容器 */
.content {
  width: 100%;
}

/* 区域样式 */
.section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}
.section-header {
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid #eee;
}
.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

/* 信息项样式 */
.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15rpx;
  font-size: 28rpx;
}
.info-item:last-child {
  margin-bottom: 0;
}
.label {
  width: 160rpx;
  color: #666;
  flex-shrink: 0;
  line-height: 1.4;
}
.value {
  flex: 1;
  color: #333;
  line-height: 1.4;
  word-break: break-all;
}

/* 空数据提示 */
.empty-tip {
  padding: 40rpx 0;
  text-align: center;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 状态文字颜色 */
.text-green {
  color: #00b42a;
}
.text-red {
  color: #ff4d4f;
}
.text-blue {
  color: #007aff;
}
.text-orange {
  color: #e6a23c;
}
</style>