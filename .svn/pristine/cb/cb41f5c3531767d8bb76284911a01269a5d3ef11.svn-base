<template>
  <view class="page">
    <view class="content" v-if="!loading">
      <!-- 入库单基础信息 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">产品入库单信息</text>
        </view>
        <view class="info-item">
          <text class="label">入库单编号:</text>
          <text class="value">{{ dataDetail.recptCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">入库单名称:</text>
          <text class="value">{{ dataDetail.recptName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">入库日期:</text>
          <text class="value">{{ formatDate(dataDetail.recptDate) || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">入库状态:</text>
          <text class="value status-text" :class="dataDetail.status">{{ dataDetail.status === 'PREPARE' ? '待入库' : '已入库' }}</text>
        </view>
        <view class="info-item">
          <text class="label">仓库:</text>
          <text class="value">{{ dataDetail.warehouseName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">备注:</text>
          <text class="value">{{ dataDetail.remark || '-' }}</text>
        </view>
      </view>

      <!-- 物料明细列表 -->
      <view class="section" v-for="(item, index) in lineList" :key="item.lineId || index">
        <view class="section-header">
          <text class="section-title">物料信息 {{ index + 1 }}</text>
        </view>
        <view class="info-item">
          <text class="label">批次号:</text>
          <text class="value">{{ item.batchCode || '-' }}</text>
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
        <view class="info-item">
          <text class="label">入库数量:</text>
          <text class="value">{{ item.quantityRecived || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">备注:</text>
          <text class="value">{{ item.remark || '-' }}</text>
        </view>
      </view>

      <!-- 空物料数据提示 -->
      <view class="empty-section" v-if="!loading && lineList.length === 0">
        <uni-icons name="none" size="64" color="#ccc"></uni-icons>
        <text class="empty-text">暂无物料明细数据</text>
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
import { listProductRecptLine } from '@/api/wms/productPut'
import "@/static/pages/detail.css";

export default {
  name: 'ProductPutDetail',
  data() {
    return {
      dataDetail: {},
      lineList: [],
      loading: true,
    }
  },
  onLoad() {
    // 获取缓存数据
    uni.getStorage({
      key: 'rowData',
      success: (res) => {
        this.dataDetail = res.data || {};
        // 优先使用本地缓存的materialLines，减少接口请求
        if (this.dataDetail.materialLines && Array.isArray(this.dataDetail.materialLines) && this.dataDetail.materialLines.length > 0) {
          this.lineList = this.dataDetail.materialLines;
          this.loading = false;
        } else {
          // 本地无数据时调用接口加载
          this.loadLineDetail();
        }
      },
      fail: () => {
        // 缓存获取失败，返回上一页
        uni.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    });
  },
  methods: {
    // 加载物料明细（接口）
    async loadLineDetail() {
      if (!this.dataDetail.recptId) {
        this.loading = false;
        return;
      }

      this.loading = true;
      try {
        const res = await listProductRecptLine({ recptId: this.dataDetail.recptId });
        if (res.code === 200) {
          this.lineList = Array.isArray(res.rows) ? res.rows : [];
        } else {
          uni.showToast({
            title: res.msg || '物料明细加载失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('加载物料明细失败:', error);
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    // 日期格式化
    formatDate(value) {
      if (!value) return '';
      // 兼容 "2025-12-24 00:00:00" 格式
      const date = new Date(value.replace(' ', 'T'));
      if (isNaN(date.getTime())) return value;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
}
</script>

<style scoped>
page {
  background-color: #f8f8f9;
  min-height: 100vh;
}

.page {
  padding: 20rpx;
  box-sizing: border-box;
}

.content {
  width: 100%;
}

/* 区块样式 - 完全对齐物料入库页 */
.section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

/* 信息项样式 - 核心对齐：单行横向排列 */
.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

/* 最后一个信息项取消底部间距 */
.info-item:last-child {
  margin-bottom: 0;
}

/* 标签样式 - 固定宽度，统一对齐 */
.label {
  font-size: 28rpx;
  color: #666;
  width: 180rpx;
  flex-shrink: 0;
}

/* 值样式 - 自适应剩余宽度 */
.value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
  word-break: break-all;
}

/* 状态文本样式 */
.status-text.PREPARE {
  color: #007aff;
  font-weight: 500;
}

.status-text.FINISHED {
  color: #07c160;
  font-weight: 500;
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 空数据样式 */
.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  background-color: #fff;
  border-radius: 12rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 小屏适配 */
@media (max-width: 750rpx) {
  .section {
    padding: 20rpx;
  }

  .label {
    width: 160rpx; /* 小屏缩小标签宽度 */
    font-size: 26rpx;
  }

  .value {
    font-size: 26rpx;
  }
}
</style>