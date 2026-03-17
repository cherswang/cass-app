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
          <text class="section-title">销售退货单基本信息</text>
        </view>

        <view class="info-item">
          <text class="label">退货单编号:</text>
          <text class="value">{{ form.rtCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">客户名称:</text>
          <text class="value">{{ form.clientName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">退货日期:</text>
          <text class="value">{{ formatDate(form.rtDate) }}</text>
        </view>
        <view class="info-item">
          <text class="label">销售订单号:</text>
          <text class="value">{{ form.soCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">仓库名称:</text>
          <text class="value">{{ form.warehouseName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">退货原因:</text>
          <text class="value">{{ form.rtReason || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">单据状态:</text>
          <text class="value" :class="getStatusClass(form.status)">{{ getStatusText(form.status) }}</text>
        </view>
        <view class="info-item">
          <text class="label">备注:</text>
          <text class="value">{{ form.remark || '-' }}</text>
        </view>
      </view>

      <!-- 子表产品信息区域 -->
      <view class="section" v-for="(item, index) in rtLineList" :key="item.lineId || index">
        <view class="section-header">
          <text class="section-title">产品信息 {{ index + 1 }}</text>
        </view>

        <view class="info-item">
          <text class="label">批次号:</text>
          <text class="value">{{ item.batchCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">产品编码:</text>
          <text class="value">{{ item.itemCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">产品名称:</text>
          <text class="value">{{ item.itemName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">规格型号:</text>
          <text class="value">{{ item.specification || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">毛重（kg）:</text>
          <text class="value">{{ item.grossWeight || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">盘重（kg）:</text>
          <text class="value">{{ item.tareWeight || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">净重（kg）:</text>
          <text class="value">{{ item.netWeight || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">单位:</text>
          <text class="value">{{ item.unitOfMeasure || '-' }}</text>
        </view>
        <view class="info-item" v-if="item.remark">
          <text class="label">备注:</text>
          <text class="value">{{ item.remark || '-' }}</text>
        </view>
      </view>

      <!-- 空产品提示 -->
      <view class="section" v-if="!loading && rtLineList.length === 0">
        <view class="empty-tip">
          <text class="empty-text">暂无产品信息</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RtSalseDetail',
  data() {
    return {
      loading: true,
      // 主表数据
      form: {
        rtId: '',
        rtCode: '',
        rtName: '',
        soCode: '',
        clientId: '',
        clientCode: '',
        clientName: '',
        clientNick: '',
        warehouseId: '',
        warehouseCode: '',
        warehouseName: '',
        locationId: '',
        locationCode: '',
        locationName: '',
        areaId: '',
        areaCode: '',
        areaName: '',
        rtDate: '',
        rtReason: '',
        status: 'PREPARE',
        remark: ''
      },
      // 子表产品数据
      rtLineList: []
    }
  },
  onLoad() {
    // 从缓存获取父页面传递的行数据
    uni.getStorage({
      key: 'rowData',
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
        rtId: data.rtId || '',
        rtCode: data.rtCode || '',
        rtName: data.rtName || '',
        soCode: data.soCode || '',
        clientId: data.clientId || '',
        clientCode: data.clientCode || '',
        clientName: data.clientName || '',
        clientNick: data.clientNick || '',
        warehouseId: data.warehouseId || '',
        warehouseCode: data.warehouseCode || '',
        warehouseName: data.warehouseName || '',
        locationId: data.locationId || '',
        locationCode: data.locationCode || '',
        locationName: data.locationName || '',
        areaId: data.areaId || '',
        areaCode: data.areaCode || '',
        areaName: data.areaName || '',
        rtDate: data.rtDate || '',
        rtReason: data.rtReason || '',
        status: data.status || 'PREPARE',
        remark: data.remark || ''
      };
      // 子表产品数据赋值
      this.rtLineList = data.materialLines && data.materialLines.length > 0
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

    /** 获取单据状态文本 */
    getStatusText(status) {
      const statusMap = {
        '10': '待报检',
        '20': '已报检',
        '40': '待入库',
        '50': '已入库',
        '60': '合格',
        '70': '部分合格',
        'PREPARE': '待处理',
        'FINISHED': '已完成'
      };
      return statusMap[status] || '未知状态';
    },

    /** 获取状态文字样式类 */
    getStatusClass(status) {
      const classMap = {
        '10': 'text-orange',     // 待报检
        'PREPARE': 'text-orange',// 待处理
        '20': 'text-blue',       // 已报检
        '40': 'text-orange',     // 待入库
        '50': 'text-green',      // 已入库
        '60': 'text-green',      // 合格
        '70': 'text-green',      // 部分合格
        'FINISHED': 'text-blue'  // 已完成
      };
      return classMap[status] || '';
    }
  }
};
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