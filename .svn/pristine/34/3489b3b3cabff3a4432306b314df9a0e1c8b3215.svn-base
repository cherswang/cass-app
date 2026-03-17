<template>
  <view class="page">
    <!-- 详情内容 -->
    <view class="content" v-if="!loading">
      <!-- 主表信息区域 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">销售出库单基本信息</text>
        </view>

        <view class="info-item">
          <text class="label">销售出库单编号:</text>
          <text class="value">{{ form.salseCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">客户名称:</text>
          <text class="value">{{ form.clientName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">出库日期:</text>
          <text class="value">{{ formatDate(form.salseDate) }}</text>
        </view>
        <view class="info-item">
          <text class="label">销售订单号:</text>
          <text class="value">{{ form.soCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">单据状态:</text>
          <text class="value" :class="getStatusClass(form.status)">{{ getStatusText(form.status) }}</text>
        </view>
        <view class="info-item">
          <text class="label">收货人电话:</text>
          <text class="value">{{ form.tel || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">收货地址:</text>
          <text class="value">{{ form.address || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">备注:</text>
          <text class="value">{{ form.remark || '-' }}</text>
        </view>
      </view>

      <!-- 子表产品信息区域 -->
      <view class="section" v-for="(item, index) in salseLineList" :key="item.lineId || index">
        <view class="section-header">
          <text class="section-title">产品信息 {{ index + 1 }}</text>
        </view>
        <view class="content-row">
          <text class="label">批次号:</text>
          <text class="value">{{ item.batchCode || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">产品编码:</text>
          <text class="value">{{ item.itemCode || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">产品名称:</text>
          <text class="value">{{ item.itemName || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">规格型号:</text>
          <text class="value">{{ item.specification || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">毛重（kg）:</text>
          <text class="value">{{ item.grossWeight || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">盘重（kg）:</text>
          <text class="value">{{ item.tareWeight || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">净重（kg）:</text>
          <text class="value">{{ item.netWeight || '-' }}</text>
        </view>
        <view class="content-row" v-if="item.remark">
          <text class="label">备注:</text>
          <text class="value">{{ item.remark || '-' }}</text>
        </view>
      </view>

      <!-- 空产品提示 -->
      <view class="section" v-if="!loading && salseLineList.length === 0">
        <view class="empty-tip">
          <text class="empty-text">暂无产品信息</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductSalseDetail',
  data() {
    return {
      loading: true,
      // 主表数据
      form: {
        salseId: '',
        salseCode: '',
        salseName: '',
        oqcId: '',
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
        salseDate: '',
        status: 'PREPARE',
        address: '',
        tel: '',
        remark: ''
      },
      // 子表产品数据
      salseLineList: []
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
        salseId: data.salseId || '',
        salseCode: data.salseCode || '',
        salseName: data.salseName || '',
        oqcId: data.oqcId || '',
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
        salseDate: data.salseDate || '',
        status: data.status || 'PREPARE',
        address: data.address || '',
        tel: data.tel || '',
        remark: data.remark || ''
      };
      // 子表产品数据赋值
      this.salseLineList = data.materialLines && data.materialLines.length > 0
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

    /** 获取状态文本 */
    getStatusText(status) {
      const statusMap = {
        '10': '待出库',
        '20': '已出库',
        '30': '已完成',
        'PREPARE': '待处理',
        'FINISHED': '已确认'
      };
      return statusMap[status] || '未知状态';
    },

    /** 获取状态文字样式类 */
    getStatusClass(status) {
      const classMap = {
        '10': 'text-orange',     // 待出库
        'PREPARE': 'text-orange',// 待处理
        '20': 'text-blue',       // 已出库
        '30': 'text-green',      // 已完成
        'FINISHED': 'text-blue'  // 已确认
      };
      return classMap[status] || '';
    }
  }
}
</script>

<style scoped>
/* 页面基础样式 */
.page {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 内容容器 */
.content {
  width: 100%;
}

/* 区块样式 */
.section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 区块标题 */
.section-header {
  border-bottom: 1rpx solid #eee;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

/* 顶部主表信息行 */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  font-size: 28rpx;
}

/* 产品信息行（核心修改） */
.content-row {
  display: flex;
  justify-content: space-between; /* 关键：标签左、值右 */
  align-items: center;
  padding: 15rpx 0;
  font-size: 28rpx;
}

/* 标签样式（统一） */
.label {
  color: #666;
  min-width: 120rpx; /* 固定标签宽度，对齐更整齐 */
  text-align: left;
}

/* 值样式（统一靠右） */
.value {
  color: #333;
  flex: 1; /* 占满剩余宽度 */
  text-align: right; /* 关键：靠右对齐 */
  margin-left: 20rpx; /* 与标签保持间距 */
  word-break: break-all; /* 长文本换行 */
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #999;
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