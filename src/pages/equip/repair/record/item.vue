<template>
  <view class="repair-item-container">
    <!-- 列表内容区域 -->
    <scroll-view
        class="list-scroll-container"
        scroll-y
        refresher-enabled
        :refresher-triggered="refresherTriggered"
        @refresherrefresh="handleRefresh"
        @scrolltolower="handleLoadMore"
    >
      <!-- 加载中 -->
      <view v-if="loading && listData.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <!-- 空数据 -->
      <view v-else-if="listData.length === 0" class="empty-container">
        <u-empty mode="list" text="暂无备件需求记录"></u-empty>
      </view>

      <!-- 列表项 -->
      <view v-else class="list-content">
        <view
            class="list-item"
            v-for="(item, index) in listData"
            :key="item.lineId + index"
        >
          <!-- 列表项头部（关键信息） -->
          <view class="item-header">
            <view class="item-basic">
              <text class="item-code">{{ item.itemCode || '-' }}</text>
              <text class="item-name">{{ item.itemName || '-' }}</text>
            </view>
          </view>

          <!-- 列表项详情 -->
          <view class="item-details">
            <view class="detail-grid">
              <!-- 第一行 -->
              <view class="detail-row">
                <view class="detail-cell">
                  <text class="label">材质：</text>
                  <text class="value">{{ item.materialQuality || '-' }}</text>
                </view>
                <view class="detail-cell">
                  <text class="label">单位：</text>
                  <text class="value">{{ item.unitOfMeasure || '-' }}</text>
                </view>
              </view>

              <!-- 第二行 -->
              <view class="detail-row">
                <view class="detail-cell full-width">
                  <text class="label">规格型号：</text>
                  <text class="value">{{ item.specification || '-' }}</text>
                </view>
              </view>

              <!-- 第三行 -->
              <view class="detail-row">
                <view class="detail-cell full-width">
                  <text class="label">执行标准：</text>
                  <text class="value ellipsis-text">{{ item.standard || '-' }}</text>
                </view>
              </view>

              <!-- 第四行 -->
              <view class="detail-row">
                <view class="detail-cell">
                  <text class="label">需求数量：</text>
                  <text class="value">{{ item.needNumber || 0 }}</text>
                </view>
                <!-- 到货状态（原注释的dict-tag） -->
                <view class="detail-cell">
                  <text class="label">到货状态：</text>
                  <u-tag
                      :text="item.isArrival === 'Y' ? '已到货' : item.isArrival === 'N' ? '未到货' : '未设置'"
                      :type="item.isArrival === 'Y' ? 'success' : item.isArrival === 'N' ? 'warning' : 'default'"
                      size="mini"
                  ></u-tag>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="loadingMore" class="load-more-container">
          <u-loading-icon size="24" text="加载更多..."></u-loading-icon>
        </view>

        <!-- 没有更多 -->
        <view v-else-if="!hasMore && listData.length > 0" class="no-more-container">
          <text class="no-more-text">已经到底了，没有更多数据了</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {listRepairItem} from "@/api/equip/repairItem";

export default {
  name: "RepairItem",
  props: {
    repair: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // API对象
      apiObj: listRepairItem,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemId: null,
        itemCode: null,
        itemName: null,
        repairId: this.repair.repairId || null,
        repairCode: null,
        repairName: null,
        specification: null,
        unitOfMeasure: null,
        itemOrProduct: null,
        itemTypeId: null,
        itemTypeCode: null,
        itemTypeName: null,
        needNumber: null,
        isArrival: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
      },
      // 表单参数
      form: {},
      // 列表数据
      listData: [],
      // 加载状态
      loading: true,
      // 加载更多状态
      loadingMore: false,
      // 下拉刷新状态
      refresherTriggered: false,
      // 总条数
      total: 0
    };
  },

  computed: {
    // 是否还有更多数据
    hasMore() {
      return this.listData.length < this.total;
    }
  },

  watch: {
    // 监听repair属性变化，重新加载数据
    'repair.repairId'(newVal) {
      this.queryParams.repairId = newVal;
      this.queryParams.pageNum = 1;
      this.fetchListData();
    }
  },

  mounted() {
    // 初始化加载数据
    this.fetchListData();
  },

  methods: {
    // 获取列表数据
    async fetchListData() {
      // 首次加载显示加载状态
      if (this.queryParams.pageNum === 1) {
        this.loading = true;
      } else {
        this.loadingMore = true;
      }

      try {
        // 调用API获取数据
        const res = await this.apiObj(this.queryParams);

        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : [];
          this.total = Number(res.total) || 0;

          // 分页处理
          if (this.queryParams.pageNum === 1) {
            this.listData = newData;
          } else {
            this.listData = [...this.listData, ...newData];
          }
        } else {
          uni.showToast({
            title: res.msg || '获取备件数据失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取备件需求列表失败:', error);
        uni.showToast({
          title: '获取数据失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        this.loadingMore = false;
        this.refresherTriggered = false;
      }
    },

    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true;
      this.queryParams.pageNum = 1;
      this.fetchListData();
    },

    // 上拉加载更多
    handleLoadMore() {
      if (this.loadingMore || !this.hasMore) return;

      this.queryParams.pageNum += 1;
      this.fetchListData();
    }
  }
};
</script>

<style lang="scss" scoped>
.repair-item-container {
  height: 100%;
  background-color: #f5f5f5;
}

// 列表滚动容器
.list-scroll-container {
  height: 100%;
}

// 加载中样式
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

// 空数据样式
.empty-container {
  padding: 100rpx 30rpx;
}

// 列表内容样式
.list-content {
  padding: 20rpx 30rpx;
}

// 列表项样式
.list-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

// 列表项头部
.item-header {
  margin-bottom: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .item-basic {
    .item-code {
      font-size: 16px;
      color: #333;
      font-weight: 600;
      display: block;
      margin-bottom: 5rpx;
    }

    .item-name {
      font-size: 14px;
      color: #666;
    }
  }
}

// 列表项详情
.item-details {
  .detail-grid {
    width: 100%;
  }

  .detail-row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .detail-cell {
    flex: 1;
    min-width: 50%;
    display: flex;
    align-items: center;

    &.full-width {
      min-width: 100%;
      width: 100%;
    }

    .label {
      font-size: 12px;
      color: #999;
      min-width: 70rpx;
      margin-right: 5rpx;
    }

    .value {
      font-size: 14px;
      color: #666;
      flex: 1;
    }

    .ellipsis-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

// 加载更多样式
.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
}

// 没有更多数据样式
.no-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;

  .no-more-text {
    font-size: 14px;
    color: #999;
  }
}

// 适配不同设备
@media (max-width: 375px) {
  .list-content {
    padding: 15rpx 20rpx;
  }

  .list-item {
    padding: 15rpx;
  }

  .detail-cell {
    min-width: 100%;
    margin-bottom: 10rpx;

    &.full-width {
      margin-bottom: 10rpx;
    }
  }
}
</style>