<template>
  <view class="page">
    <view class="content" v-if="!loading">
      <view class="section">
        <view class="section-header">
          <text class="section-title">生产领料单信息</text>
        </view>
        <view class="info-item">
          <text class="label">领料单编号:</text>
          <text class="value">{{ dataDetail.issueCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">领料日期:</text>
          <text class="value">{{ dataDetail.issueDate || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">领料人:</text>
          <text class="value">{{ dataDetail.createByName || '-' }}</text>
        </view>
      </view>

      <view class="section" v-for="(item, index) in lineList" :key="index">
        <view class="section-header">
          <text class="section-title">物料信息 {{ index + 1 }}</text>
        </view>
        <!-- 核心修改：为每个物料信息行添加 flex 布局容器 -->
        <view class="content-row">
          <text class="label">物料编码:</text>
          <text class="value">{{ item.itemCode || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">物料名称:</text>
          <text class="value">{{ item.itemName || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">规格型号:</text>
          <text class="value">{{ item.specification || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">单位:</text>
          <text class="value">{{ item.unitOfMeasure || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">批次号:</text>
          <text class="value">{{ item.batchCode || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">领料数量:</text>
          <text class="value">{{ item.quantityIssued || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">毛重:</text>
          <text class="value">{{ item.grossWeight || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">净重:</text>
          <text class="value">{{ item.netWeight || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">盘重:</text>
          <text class="value">{{ item.tareWeight || '-' }}</text>
        </view>
        <view class="content-row">
          <text class="label">仓库:</text>
          <text class="value">{{ item.warehouseName || '-' }}</text>
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
import {onLoad} from '@dcloudio/uni-app'
import {listIssueLine} from '@/api/wms/productOut'
import "@/static/pages/detail.css";

export default {
  name: 'MaterialPutDetail',
  data() {
    return {
      dataDetail: {},
      lineList: [],
      loading: true,
    }
  },
  onLoad() {
    uni.getStorage({
      key: 'rowData',
      success: (res) => {
        this.dataDetail = res.data;
        this.loadLineDetail()
      },
    });

  },
  methods: {
    async loadLineDetail() {
      this.loading = true
      try {
        const res = await listIssueLine({issueId: this.dataDetail.issueId})
        if (res.code === 200) {
          this.lineList = res.rows || [];
        } else {
          uni.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          })
          // 延迟返回，让用户看到错误信息
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      } catch (error) {
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
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

/* 顶部领料单信息行 */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  font-size: 28rpx;
}

/* 物料信息行（核心修改） */
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
</style>