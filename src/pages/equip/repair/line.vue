<template>
  <view class="repair-line-container">
    <!-- 顶部操作栏 -->
    <view class="header-bar">
      <view class="left-actions">
        <u-button
            type="primary"
            size="mini"
            icon="plus"
            @click="handleAdd"
        >新增</u-button>

        <u-button
            type="danger"
            size="mini"
            icon="trash"
            :disabled="!hasSelectedItems"
            @click="handleBatchDelete"
        >删除</u-button>
      </view>
    </view>

    <!-- 列表内容 -->
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
          <!-- 多选框 -->
          <view class="selection-box" @click.stop="toggleSelection(item)">
            <u-checkbox
                v-model="item.checked"
                shape="circle"
                size="20"
            ></u-checkbox>
          </view>

          <!-- 维修单行信息 -->
          <view class="item-content">
            <!-- 项目名称 -->
            <view class="item-header">
              <text class="subject-name">{{ item.subjectName || '-' }}</text>
            </view>

            <!-- 详情信息 -->
            <view class="item-details">
              <view class="detail-row">
                <text class="label">故障描述：</text>
                <text class="value">{{ item.malfunction || '-' }}</text>
              </view>

              <view class="detail-row" v-if="item.malfunctionUrl">
                <text class="label">故障资源：</text>
                <text
                    class="value link-text"
                    @click="viewResource(item.malfunctionUrl)"
                >查看附件</text>
              </view>

              <view class="detail-row">
                <text class="label">维修情况：</text>
                <text class="value">{{ item.repairDes || '-' }}</text>
              </view>
            </view>

            <!-- 操作按钮 -->
            <view class="item-actions">
              <u-button
                  type="text"
                  size="mini"
                  @click.stop="handleUpdate(item)"
              >修改</u-button>

              <u-button
                  type="text"
                  size="mini"
                  color="#f56c6c"
                  @click.stop="handleDelete(item)"
              >删除</u-button>
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

    <!-- 添加/修改维修单行弹窗 -->
    <line-save
        v-if="dialog.save"
        :repairId="repairId"
        ref="saveDialog"
        @success="handleSuccess"
        @closed="dialog.save = false"
    ></line-save>
  </view>
</template>

<script>
import repairLineAPI from "@/api/equip/repairline";
import lineSave from "./lineSave.vue";

export default {
  name: "Repairline",
  components: {
    lineSave
  },
  props: {
    repairId: {
      type: [String, Number, null],
      default: null
    }
  },
  data() {
    return {
      // API对象
      apiObj: repairLineAPI.listRepairline,
      // 弹窗控制
      dialog: {
        save: false
      },
      // 加载状态
      loading: true,
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
      search: {
        searchValue: null
      },
      // 表单参数
      form: {},
      // 列表数据
      listData: [],
      // 加载更多状态
      loadingMore: false,
      // 下拉刷新状态
      refresherTriggered: false,
      // 总条数
      total: 0
    };
  },

  computed: {
    // 是否有选中项
    hasSelectedItems() {
      return this.listData.some(item => item.checked);
    },
    // 是否还有更多数据
    hasMore() {
      return this.listData.length < this.total;
    }
  },

  watch: {
    // 监听repairId变化
    repairId(newVal) {
      this.queryParams.repairId = newVal;
      this.queryParams.pageNum = 1;
      this.fetchListData();
    }
  },

  onLoad() {
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

          // 为每条数据添加选中状态
          const dataWithChecked = newData.map(item => ({
            ...item,
            checked: false
          }));

          // 分页处理
          if (this.queryParams.pageNum === 1) {
            this.listData = dataWithChecked;
          } else {
            this.listData = [...this.listData, ...dataWithChecked];
          }
        } else {
          uni.showToast({
            title: res.msg || '获取数据失败',
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

    // 切换选中状态
    toggleSelection(item) {
      item.checked = !item.checked;
      // 更新选中的ID列表
      this.ids = this.listData
          .filter(i => i.checked)
          .map(i => i.lineId);
    },

    // 本地更新数据
    handleSuccess(data, mode) {
      // 刷新列表数据
      this.queryParams.pageNum = 1;
      this.fetchListData();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.dialog.save = true;
      this.$nextTick(() => {
        if (this.$refs.saveDialog) {
          this.$refs.saveDialog.open("添加设备维修单行");
        }
      });
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      const lineId = row.lineId;
      this.loading = true;

      repairLineAPI.getRepairline.get(lineId).then(response => {
        this.loading = false;
        this.dialog.save = true;

        this.$nextTick(() => {
          if (this.$refs.saveDialog) {
            this.$refs.saveDialog.open("修改设备维修单行").setData(response.data);
          }
        });
      }).catch(error => {
        this.loading = false;
        console.error('获取维修单行详情失败:', error);
        uni.showToast({
          title: '获取详情失败，请重试',
          icon: 'none'
        });
      });
    },

    /** 删除按钮操作（单条） */
    handleDelete(row) {
      uni.showModal({
        title: '提示',
        content: `确定删除选中的 ${row.lineId} 项吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const res = await repairLineAPI.delRepairline.delete(row.lineId);
              if (res.code == 200) {
                uni.showToast({
                  title: "删除成功",
                  icon: "success"
                });
                // 刷新列表
                this.queryParams.pageNum = 1;
                this.fetchListData();
              } else {
                uni.showToast({
                  title: res.message || "删除失败",
                  icon: "none"
                });
              }
            } catch (error) {
              console.error('删除失败:', error);
              uni.showToast({
                title: '删除失败，请重试',
                icon: "none"
              });
            }
          }
        }
      });
    },

    /** 批量删除操作 */
    handleBatchDelete() {
      if (!this.ids || this.ids.length === 0) {
        uni.showToast({
          title: '请选择要删除的维修单行',
          icon: 'none'
        });
        return;
      }

      uni.showModal({
        title: '提示',
        content: `确定删除选中的 ${this.ids.length} 项吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const res = await repairLineAPI.delRepairline.delete(this.ids.join(','));
              if (res.code == 200) {
                uni.showToast({
                  title: "删除成功",
                  icon: "success"
                });
                // 刷新列表
                this.queryParams.pageNum = 1;
                this.fetchListData();
              } else {
                uni.showToast({
                  title: res.message || "删除失败",
                  icon: "none"
                });
              }
            } catch (error) {
              console.error('批量删除失败:', error);
              uni.showToast({
                title: '删除失败，请重试',
                icon: "none"
              });
            }
          }
        }
      });
    },

    /** 查看故障资源 */
    viewResource(url) {
      if (!url) return;

      // 根据URL类型处理不同的资源查看方式
      if (url.startsWith('http')) {
        // 图片资源
        if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(url)) {
          uni.previewImage({
            urls: [url],
            current: url
          });
        } else {
          // 其他文件类型
          uni.showToast({
            title: '暂不支持该类型文件预览',
            icon: 'none'
          });
        }
      } else {
        uni.showToast({
          title: '无效的资源链接',
          icon: 'none'
        });
      }
    },

    /** 导出按钮操作（保留方法，兼容原有调用） */
    handleExport() {
      // 移动端导出功能需要特殊处理，这里先提示
      uni.showToast({
        title: '移动端暂不支持导出功能',
        icon: 'none'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.repair-line-container {
  height: 100%;
  background-color: #f5f5f5;
}

// 顶部操作栏
.header-bar {
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .left-actions {
    display: flex;
    gap: 15rpx;
  }
}

// 列表滚动容器
.list-scroll-container {
  height: calc(100% - 90rpx);
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
  display: flex;
  align-items: flex-start;
}

// 多选框
.selection-box {
  padding: 10rpx;
  margin-right: 15rpx;
}

// 列表项内容
.item-content {
  flex: 1;
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
  }
}

// 列表项详情
.item-details {
  margin-bottom: 20rpx;

  .detail-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 16rpx;

    .label {
      font-size: 12px;
      color: #999;
      margin-bottom: 5rpx;
    }

    .value {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }

    .link-text {
      color: #2979FF;
      text-decoration: underline;
    }
  }
}

// 操作按钮
.item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  padding-top: 10rpx;
  border-top: 1rpx solid #f8f8f8;
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