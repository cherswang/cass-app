<template>
  <view class="repair-item-container">
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
        <u-empty mode="list" text="暂无维修备料记录"></u-empty>
      </view>

      <!-- 列表项 -->
      <view v-else class="list-content">
        <view
            class="list-item"
            v-for="(item, index) in listData"
            :key="item.repairItemId + index"
        >
          <!-- 多选框 -->
          <view class="selection-box" @click.stop="toggleSelection(item)">
            <u-checkbox
                v-model="item.checked"
                shape="circle"
                size="20"
            ></u-checkbox>
          </view>

          <!-- 物料基本信息 -->
          <view class="item-content">
            <!-- 物料编码和名称 -->
            <view class="item-header">
              <text class="item-code">{{ item.itemCode || '-' }}</text>
              <text class="item-name">{{ item.itemName || '-' }}</text>
            </view>

            <!-- 物料详情 -->
            <view class="item-details">
              <view class="detail-row">
                <text class="label">材质：</text>
                <text class="value">{{ item.materialQuality || '-' }}</text>
              </view>

              <view class="detail-row">
                <text class="label">规格型号：</text>
                <text class="value">{{ item.specification || '-' }}</text>
              </view>

              <view class="detail-row">
                <text class="label">执行标准：</text>
                <text class="value">{{ item.standard || '-' }}</text>
              </view>

              <view class="detail-row">
                <text class="label">单位：</text>
                <text class="value">{{ item.unitOfMeasure || '-' }}</text>
              </view>

              <view class="detail-row">
                <text class="label">需求数量：</text>
                <text class="value">{{ item.needNumber || 0 }}</text>
              </view>

              <view class="detail-row">
                <text class="label">是否到货：</text>
                <u-tag
                    :text="getDictLabel('pro_ready_flag', item.isArrival)"
                    :type="item.isArrival === '1' ? 'success' : 'warning'"
                    size="mini"
                ></u-tag>
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

    <!-- 添加/修改备料弹窗 -->
    <item-save
        v-if="dialog.save"
        :repair="repair"
        ref="itemSave"
        @success="handleSuccess"
        @closed="dialog.save = false"
    ></item-save>
  </view>
</template>

<script>
import {listRepairItem,getRepairItem,delRepairItem} from "@/api/equip/repairItem";
import itemSave from "./itemSave.vue";

export default {
  name: "RepairItem",
  components: {
    itemSave
  },
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
      // 弹窗控制
      dialog: {
        save: false
      },
      // 选中数组
      ids: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemId: null,
        itemCode: null,
        itemName: null,
        repairId: this.repair.repairId || '',
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
      loading: false,
      loadingMore: false,
      refresherTriggered: false,
      // 分页控制
      total: 0,
      // 字典数据
      dictData: {
        pro_ready_flag: [
          { label: '已到货', value: '1' },
          { label: '未到货', value: '0' }
        ]
      }
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
    'repair.repairId'(newVal) {
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
    // 获取字典标签文本
    getDictLabel(dictType, value) {
      if (!value || !this.dictData[dictType]) return '-';
      const dictItem = this.dictData[dictType].find(item => item.value === value);
      return dictItem ? dictItem.label : '-';
    },

    // 获取列表数据
    async fetchListData() {
      // 首次加载或下拉刷新显示加载状态
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
        console.error('获取维修备料列表失败:', error);
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
          .map(i => i.repairItemId);
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
        if (this.$refs.itemSave) {
          this.$refs.itemSave.open("添加设备维修备料");
        }
      });
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      const repairItemId = row.repairItemId;
      this.loading = true;

      getRepairItem(repairItemId).then(response => {
        this.loading = false;
        this.dialog.save = true;

        this.$nextTick(() => {
          if (this.$refs.itemSave) {
            this.$refs.itemSave.open("修改设备维修备料").setData(response.data);
          }
        });
      }).catch(error => {
        this.loading = false;
        console.error('获取备料详情失败:', error);
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
        content: `确定删除选中的 ${row.repairItemId} 项吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const res = await delRepairItem(row.repairItemId);
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
          title: '请选择要删除的备料',
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
              const res = await delRepairItem(this.ids.join(','));
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
.repair-item-container {
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

// 列表项详情
.item-details {
  margin-bottom: 20rpx;

  .detail-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12rpx;

    .label {
      font-size: 12px;
      color: #999;
      min-width: 80rpx;
      margin-top: 2rpx;
    }

    .value {
      font-size: 14px;
      color: #666;
      flex: 1;
      line-height: 1.5;
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