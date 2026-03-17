<template>
  <view class="repair-line-container">
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
        <u-empty mode="list" text="暂无维修单行记录"></u-empty>
      </view>

      <!-- 列表项 -->
      <view v-else class="list-content">
        <view
            class="list-item"
            v-for="(item, index) in listData"
            :key="item.lineId + index"
        >
          <!-- 列表项头部（项目名称） -->
          <view class="item-header">
            <text class="subject-name">{{ item.subjectName || '-' }}</text>
          </view>

          <!-- 列表项详情 -->
          <view class="item-details">
            <!-- 故障描述 -->
            <view class="detail-section">
              <text class="section-label">故障描述：</text>
              <text class="section-content">{{ item.malfunction || '-' }}</text>
            </view>

            <!-- 故障描述资源 -->
            <view class="detail-section" v-if="item.malfunctionUrl">
              <text class="section-label">故障资源：</text>
              <text
                  class="section-content link-text"
                  @click="previewResource(item.malfunctionUrl)"
              >
                {{ item.malfunctionUrl.length > 30 ? item.malfunctionUrl.substring(0, 30) + '...' : item.malfunctionUrl }}
              </text>
            </view>

            <!-- 维修情况 -->
            <view class="detail-section">
              <text class="section-label">维修情况：</text>
              <text class="section-content">{{ item.repairDes || '-' }}</text>
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
import repairlineaAPI from "@/api/equip/repairline";

export default {
  name: "Repairline",
  props: {
    repairId: {
      type: [String, Number, null],
      default: null
    }
  },
  data() {
    return {
      // API对象
      apiObj: repairlineaAPI.listRepairline,
      // 选中数组
      ids: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        repairId: this.repairId,
        subjectId: null,
        subjectCode: null,
        subjectName: null,
        subjectType: null,
        subjectContent: null,
        subjectStandard: null,
        malfunction: null,
        malfunctionUrl: null,
        repairDes: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        malfunction: [
          { required: true, message: "故障描述不能为空", trigger: "blur" }
        ],
      },
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
    // 监听repairId属性变化，重新加载数据
    repairId(newVal) {
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
            title: res.msg || '获取维修单行数据失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取维修单行列表失败:', error);
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
    },

    /** 预览故障资源 */
    previewResource(url) {
      if (!url) return;

      // 处理多个链接的情况（逗号分隔）
      const urls = url.split(',').map(item => item.trim()).filter(item => item);

      if (urls.length === 0) {
        uni.showToast({
          title: '暂无有效资源链接',
          icon: 'none'
        });
        return;
      }

      // 筛选图片链接进行预览
      const imageUrls = urls.filter(item => /\.(jpg|jpeg|png|gif|bmp)$/i.test(item));

      if (imageUrls.length > 0) {
        // 预览图片
        uni.previewImage({
          urls: imageUrls,
          current: imageUrls[0]
        });
      } else {
        // 非图片资源提示
        uni.showModal({
          title: '提示',
          content: '当前资源不是图片格式，无法预览',
          showCancel: false
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.repair-line-container {
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

  .subject-name {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    display: block;
    line-height: 1.4;
  }
}

// 列表项详情
.item-details {
  .detail-section {
    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .section-label {
      font-size: 12px;
      color: #999;
      display: block;
      margin-bottom: 8rpx;
    }

    .section-content {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }

    .link-text {
      color: #2979FF;
      text-decoration: underline;
      word-break: break-all;
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
}
</style>