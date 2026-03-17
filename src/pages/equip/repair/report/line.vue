<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-navbar
        title="设备报修单行管理"
        :safeAreaInsetTop="true"
        :placeholder="true"
        bg-color="#FFFFFF"
        title-color="#333333"
        :border="false"
        :auto-back="true"
        rightText="新增"
        @rightClick="handleAdd"
    />

    <!-- 滚动列表容器 -->
    <scroll-view
        class="scroll-container"
        scroll-y
        refresher-enabled
        :refresher-triggered="refresherTriggered"
        :refresher-background="'#f1f2f7'"
        @refresherrefresh="handleRefresh"
        @scrolltolower="handleScrollToLower"
        @scroll="handleScroll"
        :scroll-top="scrollTop"
    >
      <view v-if="loading && tableData.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <view v-else-if="tableData.length === 0" class="empty-container">
        <u-empty
            mode="data"
            text="暂无设备报修单行记录"
        >
          <template #bottom>
            <u-button
                type="primary"
                size="small"
                @click="handleAdd"
                text="新增报修单行"
            ></u-button>
          </template>
        </u-empty>
      </view>

      <view v-else class="record-list">
        <view
            class="record-item"
            v-for="(item, index) in tableData"
            :key="item.lineId + index"
        >
          <!-- 多选框 -->
          <view class="selection-box" @click.stop="toggleSelection(item)">
            <u-checkbox
                :value="item.lineId"
                :checked="selectedIds.includes(item.lineId)"
                shape="circle"
                size="24"
            ></u-checkbox>
          </view>

          <view class="record-content">
            <view class="info-row">
              <text class="info-label">项目名称：</text>
              <text class="info-value">{{ item.subjectName || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">故障描述：</text>
              <text class="info-value">{{ item.malfunction || '-' }}</text>
            </view>
            <view class="info-row" v-if="item.malfunctionUrl">
              <text class="info-label">故障资源：</text>
              <text
                  class="info-value link-text"
                  @click="viewResource(item.malfunctionUrl)"
              >查看附件</text>
            </view>
            <view class="info-row">
              <text class="info-label">维修情况：</text>
              <text class="info-value">{{ item.repairDes || '-' }}</text>
            </view>
          </view>

          <view class="record-actions">
            <view class="action-buttons">
              <u-button
                  type="primary"
                  size="mini"
                  @click.stop="handleUpdate(item)"
                  class="edit-btn"
              >修改</u-button>
              <u-button
                  type="danger"
                  size="mini"
                  @click.stop="handleDeleteConfirm(item)"
                  class="delete-btn"
              >删除</u-button>
            </view>
          </view>
        </view>

        <view v-if="loadingMore" class="load-more-container">
          <u-loading-icon size="24" text="正在加载更多数据..."></u-loading-icon>
        </view>

        <view v-else-if="!hasMore && tableData.length > 0" class="no-more-container">
          <text class="no-more-text">已经到底了，没有更多数据了</text>
        </view>

        <view v-else-if="hasMore && tableData.length > 0" class="more-tips">
          <text class="more-text">继续上拉加载更多数据...</text>
        </view>
      </view>
    </scroll-view>

    <!-- 回到顶部按钮 -->
    <view v-if="showBackTop" class="back-top" @click="scrollToTop">
      <u-icon name="arrow-upward" color="#fff" size="20"></u-icon>
    </view>

    <!-- 删除确认弹窗 -->
    <u-modal
        v-model="showDeleteModal"
        title="删除确认"
        :content="deleteContent"
        :show-cancel-button="true"
        @confirm="handleDelete"
        @cancel="showDeleteModal = false"
    ></u-modal>

    <!-- 新增/编辑弹窗 -->
    <line-save
        v-if="dialog.save"
        :repairId="repairId"
        ref="lineSave"
        @success="handleSuccess"
        @closed="dialog.save=false"
    ></line-save>

    <!-- 资源预览弹窗 -->
    <up-popup
        :show="showResourcePopup"
        mode="center"
        :round="16"
        :closeable="true"
        @close="showResourcePopup = false"
    >
      <view class="resource-container">
        <text class="resource-title">故障描述资源</text>
        <view class="resource-content">
          <text class="resource-url">{{ currentResourceUrl }}</text>
          <u-button
              type="primary"
              size="small"
              @click="downloadResource"
              class="download-btn"
          >下载资源</u-button>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script>
import {listRepairline,getRepairline,delRepairline} from "@/api/equip/repairline";
import lineSave from "./lineSave";

export default {
  name: "Repairline",
  components: {
    lineSave
  },
  props: {
    repairId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      // API对象
      apiObj: listRepairline,

      // 对话框控制
      dialog: {
        save: false
      },

      // 搜索参数
      search: {
        repairId: this.repairId,
        searchValue: null,
        queryParams: {}
      },

      // 分页相关
      page: 1,
      pageSize: 10,
      total: 0,

      // 数据相关
      tableData: [],
      selectedIds: [], // 选中的ID数组
      currentRow: null, // 当前操作行

      // 加载状态
      loading: false,
      loadingMore: false,
      refresherTriggered: false,

      // 滚动相关
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,

      // 弹窗相关
      showDeleteModal: false,
      deleteContent: '确定删除选中的记录吗？',

      // 资源预览相关
      showResourcePopup: false,
      currentResourceUrl: ''
    };
  },

  computed: {
    hasMore() {
      return this.tableData.length < this.total;
    }
  },

  watch: {
    repairId(newVal) {
      this.search.repairId = newVal;
      this.page = 1;
      this.fetchTableData();
    }
  },

  onLoad() {
    this.fetchTableData();
    // 注册刷新监听
    this.registerRefreshListener();
  },

  onUnload() {
    uni.$off('refreshRepairlineList');
  },

  methods: {
    // 注册刷新监听
    registerRefreshListener() {
      uni.$on('refreshRepairlineList', (needRefresh) => {
        if (needRefresh) {
          this.page = 1;
          this.fetchTableData();
        }
      });
    },

    // 滚动事件处理
    handleScroll(e) {
      const scrollTop = e.detail.scrollTop;
      this.showBackTop = scrollTop > this.scrollThreshold;
    },

    // 切换选中状态
    toggleSelection(item) {
      const index = this.selectedIds.indexOf(item.lineId);
      if (index > -1) {
        this.selectedIds.splice(index, 1);
      } else {
        this.selectedIds.push(item.lineId);
      }
    },

    // 全选/取消全选
    toggleAllSelection() {
      if (this.selectedIds.length === this.tableData.length) {
        this.selectedIds = [];
      } else {
        this.selectedIds = this.tableData.map(item => item.lineId);
      }
    },

    // 构建查询参数
    buildQueryParams() {
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        repairId: this.search.repairId
      };

      if (this.search.searchValue) {
        params.searchValue = this.search.searchValue.trim();
      }

      // 合并其他查询参数
      Object.assign(params, this.search.queryParams);

      return params;
    },

    // 获取列表数据
    async fetchTableData() {
      this.loading = true;
      try {
        const params = this.buildQueryParams();
        const res = await this.apiObj(params);

        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : [];

          if (this.page === 1) {
            this.tableData = newData;
            this.selectedIds = []; // 重置选中状态
          } else {
            this.tableData = [...this.tableData, ...newData];
          }

          this.total = Number(res.total) || 0;
        } else {
          uni.showToast({ title: res.msg || '获取数据失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '网络错误，请重试', icon: 'none' });
      } finally {
        this.loading = false;
        this.refresherTriggered = false;
      }
    },

    // 下拉加载更多
    handleScrollToLower() {
      if (this.loadingMore) {
        return;
      }

      if (!this.hasMore) {
        return;
      }

      this.page += 1;
      this.loadingMore = true;
      this.fetchTableData().finally(() => {
        this.loadingMore = false;
      });
    },

    // 回到顶部
    scrollToTop() {
      this.scrollTop = this.scrollTop + 1;
      this.showBackTop = false;
    },

    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true;
      this.page = 1;
      this.fetchTableData();
    },

    // 新增按钮操作
    handleAdd() {
      this.dialog.save = true
      this.$nextTick(() => {
        this.$refs.lineSave.open("添加设备报修单行");
      })
    },

    // 修改按钮操作
    handleUpdate(row) {
      const lineId = row.lineId;
      getRepairline(lineId).then(response => {
        this.dialog.save = true
        this.$nextTick(() => {
          this.$refs.lineSave.open("修改设备报修单行").setData(response.data);
        })
      });
    },

    // 显示删除确认弹窗
    handleDeleteConfirm(row) {
      this.currentRow = row;
      this.deleteContent = row ? '确定删除这条报修单行记录吗？' : `确定删除选中的 ${this.selectedIds.length} 项吗？`;
      this.showDeleteModal = true;
    },

    // 批量删除确认
    handleBatchDelete() {
      if (this.selectedIds.length === 0) {
        uni.showToast({ title: '请选择要删除的记录', icon: 'none' });
        return;
      }
      this.currentRow = null;
      this.handleDeleteConfirm();
    },

    // 删除按钮操作
    async handleDelete() {
      this.showDeleteModal = false;
      uni.showLoading({ title: '删除中...', mask: true });

      try {
        // 获取要删除的ID
        const lineIds = this.currentRow ? [this.currentRow.lineId] : this.selectedIds;

        if (lineIds.length === 0) {
          uni.showToast({ title: '请选择要删除的记录', icon: 'none' });
          return;
        }

        const res = await delRepairline(lineIds.join(','));

        if (res.code == 200) {
          uni.showToast({ title: "删除成功", icon: 'success' });
          // 重置选中状态
          this.selectedIds = [];
          // 重新加载数据
          this.page = 1;
          this.fetchTableData();
        } else {
          uni.showToast({ title: res.message || '删除失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '删除失败，请重试', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },

    // 保存成功回调
    handleSuccess() {
      this.dialog.save = false;
      this.page = 1;
      this.fetchTableData();
    },

    // 查看资源
    viewResource(url) {
      this.currentResourceUrl = url;
      this.showResourcePopup = true;
    },

    // 下载资源
    downloadResource() {
      if (!this.currentResourceUrl) return;

      // 这里实现资源下载逻辑
      uni.downloadFile({
        url: this.currentResourceUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: () => {
                uni.showToast({ title: '下载成功', icon: 'success' });
                this.showResourcePopup = false;
              },
              fail: () => {
                uni.showToast({ title: '保存文件失败', icon: 'none' });
              }
            });
          }
        },
        fail: () => {
          uni.showToast({ title: '下载失败', icon: 'none' });
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.top-actions {
  padding: 10rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 20rpx;
}

.scroll-container {
  overflow: hidden;
  flex: 1;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-container {
  padding: 100rpx 30rpx;
}

.record-list {
  padding: 20rpx 30rpx;
}

.record-item {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  position: relative;
  display: flex;
  flex-direction: column;
}

.selection-box {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  z-index: 10;
}

.record-content {
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 16rpx;
}

.info-label {
  font-size: 12px;
  color: #999999;
  margin-bottom: 4rpx;
}

.info-value {
  font-size: 14px;
  color: #333333;
  line-height: 1.5;
}

.link-text {
  color: #2979FF;
  text-decoration: underline;
}

.record-actions {
  margin-top: 10rpx;
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  justify-content: flex-end;
}

.edit-btn, .delete-btn {
  width: 120rpx;
}

.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
}

.no-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
}

.no-more-text {
  color: #999;
  font-size: 14px;
}

.more-tips {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
}

.more-text {
  color: #2979FF;
  font-size: 12px;
}

.back-top {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: #2979FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.3);
  z-index: 999;
}

/* 资源预览弹窗样式 */
.resource-container {
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  width: 80vw;
  max-width: 600rpx;
}

.resource-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 30rpx;
  display: block;
}

.resource-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.resource-url {
  font-size: 14px;
  color: #666;
  word-break: break-all;
  line-height: 1.5;
}

.download-btn {
  width: 100%;
  margin-top: 10rpx;
}
</style>