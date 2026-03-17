<template>
  <view class="page">
    <!-- 安全区域顶部 -->
    <view class="safe-area-top"></view>

    <!-- 固定搜索栏 -->
    <view class="search-bar fixed">
      <view class="search-input-wrapper">
        <u-icon name="search" size="16" color="#999" class="search-icon"></u-icon>
        <input
            type="text"
            v-model="searchQuery"
            placeholder="销售退货单编号/销售退货单名称"
            class="search-input"
        />
      </view>
      <button class="search-btn" @click="handleSearch">
        <u-icon name="search" size="20" color="#fff"></u-icon>
      </button>
    </view>

    <!-- 固定标签页 -->
    <view class="tabs-container">
      <up-subsection
          activeColor="#007aff"
          ref="tabs"
          :list="tabsList"
          :current="current"
          @change="handleTabChange"
          :is-scroll="false"
          swiperWidth="750"
      ></up-subsection>
    </view>

    <swiper class="swiper-box" :current="swiperCurrent" @animationfinish="handleSwiperChange">
      <!-- 待处理退货单列表（10状态） -->
      <swiper-item class="swiper-item">
        <scroll-view class="scroll-view" scroll-y @scrolltolower="() => loadMore(0)">
          <view class="list" :style="{ paddingTop: '0' }">
            <!-- 加载状态 -->
            <view v-if="loadingStatus[0] && tableData[0].length === 0" class="loading-container">
              <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
              <text class="loading-text">加载中...</text>
            </view>
            <view v-else-if="tableData[0].length === 0" class="empty-container">
              <uni-icons name="none" size="64" color="#ccc"></uni-icons>
              <text class="empty-text">暂无待处理退货单</text>
            </view>
            <!-- 列表内容 -->
            <view v-else class="task-list">
              <view class="task-item" v-for="(task, index) in tableData[0]" :key="task.rtId">
                <view class="task-header">
                  <view class="task-index">{{ index + 1 }}</view>
                  <view class="task-no-wrapper">
                    <uni-icons name="list" size="16" color="#007aff" class="task-icon"></uni-icons>
                    <text class="task-no">退货单编号: {{ task.rtCode }}</text>
                  </view>
                  <uni-tag type="warning" class="status-tag">
                    {{ getStatusText(task.status) }}
                  </uni-tag>
                </view>

                <view class="task-content">
                  <view class="content-row">
                    <view class="content-item">
                      <text class="label">客户名称:</text>
                      <text class="value">{{ task.clientName || '-' }}</text>
                    </view>
                  </view>
                  <view class="content-row">
                    <view class="content-item">
                      <text class="label">退货日期:</text>
                      <text class="value">{{ formatDate(task.rtDate) }}</text>
                    </view>
                    <view class="content-item">
                      <text class="label">仓库名称:</text>
                      <text class="value">{{ task.warehouseName || '-' }}</text>
                    </view>
                  </view>
                  <view class="content-row">
                    <view class="content-item">
                      <text class="label">单据状态:</text>
                      <text class="value text-orange">
                        {{ getStatusText(task.status) }}
                      </text>
                    </view>
                    <view class="content-item">
                      <text class="label">检验状态:</text>
                      <text class="value" :class="getIqcStatusClass(task.iqcStatus)">
                        {{ getIqcStatusText(task.iqcStatus) }}
                      </text>
                    </view>
                  </view>
                  <view class="content-row">
                    <view class="content-item">
                      <text class="label">销售订单号:</text>
                      <text class="value">{{ task.soCode || '-' }}</text>
                    </view>
                  </view>
                </view>

                <!-- 任务操作 -->
                <view class="task-footer">
                  <button class="detail-btn" @click="viewDetail(task)">
                    <uni-icons name="eye" size="14" color="#666"></uni-icons>
                    查看
                  </button>
                  <button class="assign-btn" @click="handleQcIpc(task)" v-if="task.status === '10'">
                    <uni-icons name="checkmark" size="14" color="#fff"></uni-icons>
                    报检
                  </button>
                  <button
                      class="assign-btn"
                      @click="handleExecute(task)"
                      v-if="task.status === '40' && (task.iqcStatus === '60' || task.iqcStatus === '70')"
                  >
                    <uni-icons name="arrow-right" size="14" color="#fff"></uni-icons>
                    执行入库
                  </button>
                </view>
              </view>
            </view>

            <!-- 加载更多 -->
            <view class="load-more" v-if="hasMore[0] && tableData[0].length > 0">
              <view class="load-more-content" v-if="loadingStatus[0]">
                <uni-loading type="spinner" color="#007aff" size="20"></uni-loading>
                <text class="load-more-text">加载中...</text>
              </view>
              <button v-else class="load-more-btn" @click="loadMore(0)">
                <u-icon name="more" size="16" color="#666"></u-icon>
                加载更多
              </button>
            </view>
            <view class="no-more" v-if="!hasMore[0] && tableData[0].length > 0">
              <text class="no-more-text">没有更多数据了</text>
            </view>
          </view>
        </scroll-view>
      </swiper-item>

      <!-- 已完成退货单列表（非10状态） -->
      <swiper-item class="swiper-item">
        <scroll-view class="scroll-view" scroll-y @scrolltolower="() => loadMore(1)">
          <view class="list" :style="{ paddingTop: '0' }">
            <!-- 加载状态 -->
            <view v-if="loadingStatus[1] && tableData[1].length === 0" class="loading-container">
              <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
              <text class="loading-text">加载中...</text>
            </view>
            <view v-else-if="tableData[1].length === 0" class="empty-container">
              <uni-icons name="none" size="64" color="#ccc"></uni-icons>
              <text class="empty-text">暂无已完成退货单</text>
            </view>
            <!-- 列表内容 -->
            <view v-else class="task-list">
              <view class="task-item" v-for="(task, index) in tableData[1]" :key="task.rtId">
                <view class="task-header">
                  <view class="task-index">{{ index + 1 }}</view>
                  <view class="task-no-wrapper">
                    <uni-icons name="list" size="16" color="#007aff" class="task-icon"></uni-icons>
                    <text class="task-no">退货单编号: {{ task.rtCode }}</text>
                  </view>
                  <uni-tag type="success" class="status-tag">
                    {{ getStatusText(task.status) }}
                  </uni-tag>
                </view>

                <view class="task-content">
                  <view class="content-row">
                    <view class="content-item">
                      <text class="label">客户名称:</text>
                      <text class="value">{{ task.clientName || '-' }}</text>
                    </view>
                  </view>
                  <view class="content-row">
                    <view class="content-item">
                      <text class="label">退货日期:</text>
                      <text class="value">{{ formatDate(task.rtDate) }}</text>
                    </view>
                    <view class="content-item">
                      <text class="label">仓库名称:</text>
                      <text class="value">{{ task.warehouseName || '-' }}</text>
                    </view>
                  </view>
                  <view class="content-row">
                    <view class="content-item">
                      <text class="label">单据状态:</text>
                      <text class="value text-green">
                        {{ getStatusText(task.status) }}
                      </text>
                    </view>
                    <view class="content-item">
                      <text class="label">检验状态:</text>
                      <text class="value" :class="getIqcStatusClass(task.iqcStatus)">
                        {{ getIqcStatusText(task.iqcStatus) }}
                      </text>
                    </view>
                  </view>
                  <view class="content-row">
                    <view class="content-item">
                      <text class="label">销售订单号:</text>
                      <text class="value">{{ task.soCode || '-' }}</text>
                    </view>
                  </view>
                </view>

                <!-- 任务操作 -->
                <view class="task-footer">
                  <button class="detail-btn" @click="viewDetail(task)">
                    <uni-icons name="eye" size="14" color="#666"></uni-icons>
                    查看
                  </button>
                </view>
              </view>
            </view>

            <!-- 加载更多 -->
            <view class="load-more" v-if="hasMore[1] && tableData[1].length > 0">
              <view class="load-more-content" v-if="loadingStatus[1]">
                <uni-loading type="spinner" color="#007aff" size="20"></uni-loading>
                <text class="load-more-text">加载中...</text>
              </view>
              <button v-else class="load-more-btn" @click="loadMore(1)">
                <u-icon name="more" size="16" color="#666"></u-icon>
                加载更多
              </button>
            </view>
            <view class="no-more" v-if="!hasMore[1] && tableData[1].length > 0">
              <text class="no-more-text">没有更多数据了</text>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { listRtSalse, getRtSalse, delRtSalse, confirmRtsalse, executeItemrecpt } from "@/api/wms/rtSalse";

export default {
  name: 'RtSalse',
  data() {
    return {
      // 标签页配置 - 待入库/已完成
      tabsList: [
        { name: '待入库', status: '10,20,40',isStatus: '1'}, // 待报检状态、已报检、待入库
        { name: '已入库', status: '50' } // 已入库等状态
      ],
      current: 0,
      swiperCurrent: 0,
      searchQuery: '',
      page: [1, 1],
      pageSize: 10,
      total: [0, 0],
      loadingStatus: [false, false],
      hasMore: [true, true],
      tableData: [[], []],
    }
  },
  onLoad() {
    // 加载默认标签页数据
    this.fetchTableData(0);
  },
  onShow() {
    // 监听刷新事件
    uni.$on('refreshRtSalseList', (needRefresh) => {
      if (needRefresh) {
        this.refreshAllTabsData();
      }
    });
  },
  onUnload() {
    // 移除事件监听
    uni.$off('refreshRtSalseList');
  },
  methods: {
    /** 刷新所有标签页数据 */
    refreshAllTabsData() {
      this.page = [1, 1];
      this.hasMore = [true, true];
      this.total = [0, 0];
      this.tableData[this.current] = [];
      this.fetchTableData(this.current);
    },


    /** 获取列表数据（按标签页索引） */
    fetchTableData(index) {
      if (this.loadingStatus[index]) return;

      this.loadingStatus[index] = true;
      const currentTab = this.tabsList[index];

      // 构造查询参数
      const params = {
        pageNum: this.page[index],
        pageSize: this.pageSize,
        searchValue: this.searchQuery || undefined,
        status: currentTab.status, // 按状态筛选
        isStatus : currentTab.isStatus
      };

      listRtSalse(params)
          .then(res => {
            if (res.code === 200) {
              const data = res.rows || [];
              if (this.page[index] === 1) {
                this.tableData[index] = data;
              } else {
                this.tableData[index] = [...this.tableData[index], ...data];
              }
              this.total[index] = res.total || 0;
              this.hasMore[index] = this.tableData[index].length < this.total[index];
            } else {
              uni.showToast({ title: res.msg || '加载失败', icon: 'none' });
            }
          })
          .catch((error) => {
            console.error(`加载${currentTab.name}退货单列表失败:`, error);
            uni.showToast({ title: '网络错误', icon: 'none' });
          })
          .finally(() => {
            this.loadingStatus[index] = false;
          });
    },

    /** 标签页切换 */
    handleTabChange(e) {
      const index = e.index !== undefined ? e.index : e;
      this.current = index;
      this.swiperCurrent = index;
      if (this.tableData[index].length === 0) {
        this.fetchTableData(index);
      }
    },

    /** swiper切换 */
    handleSwiperChange({ detail: { current } }) {
      this.swiperCurrent = current;
      this.current = current;
      if (this.tableData[current].length === 0) {
        this.fetchTableData(current);
      }
    },

    /** 搜索 */
    handleSearch() {
      this.refreshAllTabsData();
    },

    /** 加载更多 */
    loadMore(index) {
      if (!this.hasMore[index] || this.loadingStatus[index]) return;
      this.page[index]++;
      this.fetchTableData(index);
    },

    /** 查看详情 */
    async viewDetail(row) {
      try {
        const res = await getRtSalse(row.rtId);
        uni.setStorage({
          key: 'rowData',
          data: res.data,
          success: () => {
            uni.navigateTo({
              url: '/pages/wms/rtSalse/detail'
            });
          }
        });
      } catch (error) {
        console.error("获取详情失败:", error);
        uni.showToast({ title: '获取详情失败', icon: 'none' });
      }
    },


    /** 删除退货单 */
    async handleDelete(row) {
      try {
        await uni.showModal({
          title: '确认删除',
          content: `是否确认删除退货单编号为"${row.rtCode}"的数据项？`,
          confirmColor: '#ff4d4f'
        });

        const res = await delRtSalse(row.rtId);
        if (res.code === 200) {
          uni.showToast({ title: '删除成功', icon: 'success' });
          this.refreshAllTabsData();
        } else {
          uni.showToast({ title: res.msg || '删除失败', icon: 'none' });
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error("删除失败:", error);
          uni.showToast({ title: '操作取消', icon: 'none' });
        }
      }
    },

    /** 报检操作 */
    async handleQcIpc(row) {
      try {
        await uni.showModal({
          title: '确认报检',
          content: '是否确认对该退货单执行报检操作？',
          confirmColor: '#007aff'
        });
        uni.showLoading({
          title: '处理中...',
          mask: true
        });
        const res = await confirmRtsalse({ rtId: row.rtId });
        if (res.code === 200) {
          uni.showToast({ title: '报检成功', icon: 'success' });
          this.refreshAllTabsData();
        } else {
          uni.showToast({ title: res.msg || '报检失败', icon: 'none' });
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error("报检失败:", error);
          uni.showToast({ title: '网络错误，请重试', icon: 'none' });
        }
      } finally {
        uni.hideLoading();
      }
    },

    /** 执行入库 */
    async handleExecute(row) {


      try {
        await uni.showModal({
          title: '确认入库',
          content: '是否确认对该退货单执行入库操作？',
          confirmColor: '#007aff'
        });
        uni.showLoading({
          title: '处理中...',
          mask: true
        });
        const res = await executeItemrecpt(row.rtId);
        if (res.code === 200) {
          uni.showToast({ title: '入库成功', icon: 'success' });
          this.refreshAllTabsData();
        } else {
          uni.showToast({ title: res.msg || '入库失败', icon: 'none' });
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error("入库执行失败:", error);
          uni.showToast({ title: '网络错误，请重试', icon: 'none' });
        }
      } finally {
        uni.hideLoading();
      }
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
        '70': '部分合格'
      };
      return statusMap[status] || '未知状态';
    },

    /** 获取检验状态文本 */
    getIqcStatusText(status) {
      const statusMap = {
        '0': '未检验',
        '60': '合格',
        '70': '部分合格',
        '30': '不合格'
      };
      return statusMap[status] || '未知状态';
    },

    /** 获取检验状态样式类 */
    getIqcStatusClass(status) {
      const classMap = {
        '0': 'text-orange',
        '60': 'text-green',
        '70': 'text-green',
        '30': 'text-red'
      };
      return classMap[status] || '';
    }
  }
};
</script>

<style scoped>
page {
  height: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 安全区域适配 */
.safe-area-top {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #fff;
}

/* 页面主容器 */
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  position: relative; /* 为浮动按钮定位 */
}

/* 搜索栏固定 */
.search-bar.fixed {
  position: fixed;
  top: var(--status-bar-height);
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  height: 100rpx;
  box-sizing: border-box;
}

/* H5环境下搜索栏调整 */
/* #ifdef H5 */
.search-bar.fixed {
  top: calc(var(--status-bar-height) + 40px);
}
/* #endif */

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  margin-right: 20rpx;
  height: 72rpx;
}

.search-icon {
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
  color: #333;
  background-color: transparent;
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  width: 72rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007aff;
  color: #fff;
}

/* 标签页容器固定 */
.tabs-container {
  position: fixed;
  top: calc(var(--status-bar-height) + 100rpx);
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

/* H5环境下标签页调整 */
/* #ifdef H5 */
.tabs-container {
  top: calc(var(--status-bar-height) + 100rpx + 40px);
}
/* #endif */

/* swiper样式 */
.swiper-box {
  height: calc(100vh - calc(var(--status-bar-height) + 100rpx));
  margin-top: calc(var(--status-bar-height) + 100rpx);
  background-color: #f5f5f5;
}

/* H5环境下swiper调整 */
/* #ifdef H5 */
.swiper-box {
  height: calc(100vh - calc(var(--status-bar-height) + 100rpx + 40px));
  margin-top: calc(var(--status-bar-height) + 100rpx + 40px);
  overflow: hidden;
}
/* #endif */

.swiper-item {
  height: 100%;
}

/* 滚动区域 */
.scroll-view {
  height: 100%;
  background-color: #f5f5f5;
}

/* 列表容器 */
.list {
  background-color: #f5f5f5;
  min-height: 100%;
  max-height: 100%;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0 60rpx;
}
.loading-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 空数据状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 0 60rpx;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 任务列表 */
.task-list {
  padding: 0 20rpx 20rpx;
}
.task-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.task-index {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #007aff;
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
  align-self: center;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.task-no-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.task-icon {
  margin-right: 12rpx;
  flex-shrink: 0;
}

.task-no {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-tag {
  font-size: 24rpx;
  margin-left: 10rpx;
  flex-shrink: 0; /* 防止标签被压缩 */
}

/* 任务内容 */
.task-content {
  margin-bottom: 24rpx;
}
.content-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.content-row:last-child {
  margin-bottom: 0;
}
.content-item {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 26rpx;
  line-height: 1.4;
}
.content-item:first-child {
  margin-right: 20rpx;
}
.label {
  color: #666;
  min-width: 120rpx;
  margin-right: 12rpx;
  word-break: keep-all;
}
.value {
  color: #333;
  flex: 1;
  word-break: break-all;
}

/* 操作按钮 */
.task-footer {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 15rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}
.detail-btn, .assign-btn, .edit-btn, .delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
  line-height: 64rpx;
  font-size: 26rpx;
  border-radius: 8rpx;
  padding: 0 20rpx;
  border: none;
  gap: 8rpx;
}
.detail-btn {
  background-color: #f8f9fa;
  color: #666;
  border: 1rpx solid #e9ecef;
}
.edit-btn {
  background-color: #f0f8ff;
  color: #666;
  border: 1rpx solid #e9ecef;
}
.assign-btn {
  background-color: #007aff;
  color: #fff;
}
.delete-btn {
  background-color: #ff4d4f;
  color: #fff;
}

/* 加载更多样式 */
.load-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
  background-color: #f5f5f5;
}
.load-more-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}
.load-more-text {
  font-size: 26rpx;
  color: #999;
}
.load-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240rpx;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 28rpx;
  background-color: #f8f9fa;
  color: #666;
  border-radius: 36rpx;
  padding: 0;
  border: 1rpx solid #e9ecef;
  gap: 8rpx;
}

/* 没有更多数据 */
.no-more {
  text-align: center;
  padding: 30rpx 0;
  background-color: #f5f5f5;
}
.no-more-text {
  font-size: 26rpx;
  color: #999;
}

/* 状态文字颜色 */
.text-green {
  color: #00b42a;
  font-weight: 600;
}
.text-red {
  color: #ff4d4f;
  font-weight: 600;
}
.text-orange {
  color: #e6a23c;
  font-weight: 600;
}
</style>