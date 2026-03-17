<template>
  <view class="page">
    <view class="content" v-if="!loading">
      <view class="section">
        <view class="section-header">
          <text class="section-title">物料入库单信息</text>
        </view>
        <view class="info-item">
          <text class="label">退料单编号:</text>
          <text class="value">{{ dataDetail.rtCode || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">生产工单:</text>
          <text class="value">{{ dataDetail.workorderCode  || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">接收仓库:</text>
          <text class="value">{{ dataDetail.warehouseName || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="label">退料日期:</text>
          <text class="value">{{ formatDate(dataDetail.rtDate) }}</text>
        </view>
      </view>

      <view class="section" v-for="(item, index) in lineList" :key="index">
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
          <text class="label">退货数量:</text>
          <text class="value">{{ item.quantityRt || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">仓库:</text>
          <text class="value">{{ item.warehouseName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">库区:</text>
          <text class="value">{{ item.locationName || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="label">库位:</text>
          <text class="value">{{ item.areaName || '-' }}</text>
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
import {listRtissueLine} from '@/api/wms/productRet'
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
        const res = await listRtissueLine({rtId: this.dataDetail.rtId})
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
    //处理日期
    formatDate(value) {
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
}
</script>