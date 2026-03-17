<template>
  <view class="ipqc-container">
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
      <!-- 加载状态 -->
      <view v-if="ipqcLoading && ipqcList.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <!-- 空数据状态 -->
      <view v-else-if="ipqcList.length === 0" class="empty-container">
        <u-empty
            mode="data"
            text="暂无报检记录"
        >
        </u-empty>
      </view>

      <!-- 报检记录列表 -->
      <view v-else class="record-list">
        <view
            class="record-item"
            v-for="(item, index) in ipqcList"
            :key="item.ipqcId"
        >
          <view class="record-header">
            <!-- 序号 -->
            <view class="task-index">{{ (pageNum - 1) * pageSize + index + 1 }}</view>
            <view class="ipqc-batch-info">
              <text class="batch-code">{{ item.batchNo || '' }}</text>
            </view>
            <up-tag :type="item.status == 0 ? 'warning' : 'success'">
              {{ item.status == 0 ? '未检验' : '已检验' }}
            </up-tag>
          </view>

          <view class="record-content">
            <view class="info-row">
              <text class="info-label">任务编码：</text>
              <text class="info-value">{{ item.taskCode || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">工序：</text>
              <text class="info-value">{{ item.processName || '-' }}</text>
              <text class="info-label">检测类型：</text>
              <text class="info-value">{{ item.ipqcType == 'FINAL' ? '首检' : '末检' }}</text>

            </view>
            <view class="info-row">
              <text class="info-label">长度：</text>
              <text class="info-value">{{ item.itemLength || 0 }} m</text>
              <text class="info-label">检测数量：</text>
              <text class="info-value">{{ item.quantityCheck || 0 }} {{ item.unitOfMeasure || '' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">合格数量：</text>
              <text class="info-value">{{ item.quantityQualified || 0 }} {{ item.unitOfMeasure || '' }}</text>
              <text class="info-label">不合格数：</text>
              <text class="info-value">{{ item.quantityUnqualified || 0 }} {{ item.unitOfMeasure || '' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">检测人员：</text>
              <text class="info-value">{{ item.inspector || '-' }}</text>
              <text class="info-label">检测日期：</text>
              <text class="info-value">{{ item.inspectDate || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">检测结果：</text>
              <text
                  class="info-value"
                  :class="{
                    'check-pass': item.checkResult === 'ACCEPT',
                    'check-fail': item.checkResult && item.checkResult !== 'ACCEPT',
                    'check-empty': !item.checkResult
                  }"
              >
                {{
                  item.checkResult === 'ACCEPT' ? '检验通过' :
                      (item.checkResult && item.checkResult !== 'ACCEPT' ? '检验不通过' : '未检测')
                }}
              </text>
            </view>
          </view>

          <view class="record-actions">
            <view class="action-divider"></view>
            <view class="action-content">
              <text class="action-time">{{ item.createTime }}</text>
              <up-button class="print-btn" type="primary" size="small" text="补打标签" @click="reprintLabel(item)"></up-button>
            </view>
          </view>
        </view>

        <!-- 加载更多状态 -->
        <view v-if="ipqcLoading && ipqcList.length > 0" class="load-more-container">
          <u-loading-icon size="24" text="正在加载更多数据..."></u-loading-icon>
        </view>

        <!-- 没有更多数据提示 -->
        <view v-else-if="!hasMore && ipqcList.length > 0" class="no-more-container">
          <text class="no-more-text">已经到底了，没有更多数据了</text>
        </view>

        <!-- 还有更多数据提示 -->
        <view v-else-if="hasMore && ipqcList.length > 0" class="more-tips">
          <text class="more-text">继续上拉加载更多数据...</text>
        </view>
      </view>
    </scroll-view>

    <!-- 回到顶部按钮 -->
    <view v-if="showBackTop" class="back-top" @click="scrollToTop">
      <u-icon name="arrow-upward" color="#fff" size="20"></u-icon>
    </view>

    <!-- 全局加载提示 -->
    <up-toast ref="uToast"></up-toast>

    <!-- 打印机选择弹窗 -->
    <up-popup
        :show="showPrinterPopup"
        mode="bottom"
        :round="16"
        :closeable="true"
        :safe-area-inset-bottom="true"
        :height="'60%'"
        @close="closePrinterModal"
    >
      <view class="detail-container" style="min-height:40vh">
        <!-- 标题 -->
        <view class="detail-header">
          <text class="detail-title">选择打印机</text>
        </view>

        <!-- 打印机列表 -->
        <scroll-view scroll-y="true" class="printer-list-content">
          <view v-if="printerLoading" class="loading-container">
            <up-loading-icon mode="spinner" color="#2979FF"></up-loading-icon>
            <text class="loading-text">加载打印机列表中...</text>
          </view>
          <view v-else-if="printerList.length === 0" class="empty-printers">
            <text class="empty-text">暂无可用打印机</text>
          </view>
          <view v-else>
            <view class="printer-list">
              <view
                  v-for="printer in printerList"
                  :key="printer.id"
                  class="printer-item"
                  :class="{'active': selectedPrinter?.id === printer.id}"
                  @click="selectPrinter(printer)"
              >
                <text class="printer-name">{{ printer.printerName }}</text>
                <up-icon
                    v-if="selectedPrinter?.id === printer.id"
                    name="checkbox-mark"
                    size="20"
                    color="#2979FF"
                ></up-icon>
              </view>
            </view>
          </view>
        </scroll-view>

        <!-- 底部固定按钮 -->
        <view class="action-section fixed-bottom">
          <view class="button-group">
            <up-button 
                type="info" 
                text="取消" 
                @click="closePrinterModal"
                style="flex: 1; margin-right: 10rpx;"
            ></up-button>
            <up-button 
                type="primary" 
                text="确定打印" 
                @click="confirmPrint"
                :disabled="!selectedPrinter"
                style="flex: 1;"
            ></up-button>
          </view>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script>
import {getIpqcByTaskId} from '@/api/quality/qcIpqc'
import {getUserProfile} from "@/api/system/user";
import {printLabel} from '@/api/pro/workTask'
import {getPrintConfigListAll} from '@/api/system/printConfig'

export default {
  name: 'IpqcList',
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: {},
      // 报检记录相关
      ipqcList: [], // 报检记录列表
      ipqcLoading: false, // 报检记录加载状态
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页大小
      hasMore: true, // 是否有更多数据
      total: 0, // 总数据量
      refresherTriggered: false, // 下拉刷新状态
      // 滚动相关
      showBackTop: false,
      scrollTop: 0,
      scrollThreshold: 300,
      // 打印机相关
      showPrinterPopup: false,
      printerList: [],
      selectedPrinter: null,
      printerLoading: false,
      selectedIpqcItem: null,
    }
  },
  computed: {
    hasMoreData() {
      // 当没有数据时，不需要加载更多
      if (this.total === 0) return false
      // 当当前列表长度小于总数时，还有更多数据
      return this.ipqcList.length < this.total
    },
  },
  methods: {
    async getUser() {
      await getUserProfile().then(response => {
        const data = response.data;
        this.user = data.user
        this.roleGroup = data.roleGroup
        this.postGroup = data.postGroup
      }).catch(error => {
        console.error('获取用户信息失败:', error)
        this.$refs.uToast.show({
          type: 'error',
          message: '获取用户信息失败'
        })
      })
    },
    // 加载报检记录
    async loadIpqcList() {
      await this.getUser();
      // 计算总页数，确保页码不会溢出
      const totalPages = Math.ceil(this.total / this.pageSize) || 1
      const currentPage = this.pageNum

      // 如果已经是最后一页，直接标记为没有更多数据，不执行加载
      if (currentPage > totalPages && this.total > 0) {
        this.ipqcLoading = false
        this.hasMore = false
        return Promise.resolve()
      }

      this.ipqcLoading = true
      try {
        const params = {
          taskId: this.taskId,
          createBy : this.user.userId,
          pageNum: currentPage,
          pageSize: this.pageSize
        }
        const res = await getIpqcByTaskId(params)
        if (res.code === 200) {
          const newRows = Array.isArray(res.rows) ? res.rows : []
          const total = Number(res.total) || 0
          const totalPages = Math.ceil(total / this.pageSize) || 1

          this.total = total

          // 检查API返回的页码是否与请求的页码一致
          const apiPage = Number(res.page) || 1

          if (apiPage !== currentPage && currentPage > 1) {
            console.warn('API returned wrong page:', {requestedPage: currentPage, returnedPage: apiPage})
            this.hasMore = false
            return
          }

          if (currentPage <= totalPages) {
            if (currentPage === 1) {
              // 只有在页码为1时，才重置列表数据
              this.ipqcList = newRows
            } else {
              // 其他情况下，只追加新数据
              const existingIds = new Set(this.ipqcList.map(item => item.ipqcId))
              const uniqueNewRows = newRows.filter(item => !existingIds.has(item.ipqcId))
              this.ipqcList = [...this.ipqcList, ...uniqueNewRows]
            }

            // 精确计算hasMore状态
            this.hasMore = newRows.length > 0 && currentPage < totalPages && this.ipqcList.length < total
          } else {
            this.hasMore = false
          }

          // 特别处理：如果当前页码已经是总页数，直接标记为没有更多数据
          if (currentPage >= totalPages) {
            this.hasMore = false
          }
        } else {
          this.$refs.uToast.show({
            type: 'error',
            message: res.msg || '加载报检记录失败'
          })
          if (this.pageNum === 1) {
            this.ipqcList = []
          }
        }
      } catch (error) {
        console.error('加载报检记录失败:', error)
        this.$refs.uToast.show({
          type: 'error',
          message: '网络错误，请重试'
        })
        if (this.pageNum === 1) {
          this.ipqcList = []
        }
      } finally {
        this.ipqcLoading = false
        this.refresherTriggered = false
      }
    },

    // 补打标签
    reprintLabel(item) {
      this.selectedIpqcItem = item
      this.showPrinterPopup = true
      this.loadPrinterList()
    },

    // 加载打印机列表
    async loadPrinterList() {
      this.printerLoading = true;
      try {
        // 调用后端接口获取打印机列表
        const result = await getPrintConfigListAll();
        if (result.code === 200 && result.data) {
          this.printerList = result.data;
          // 默认选择第一个打印机
          if (this.printerList.length > 0) {
            this.selectedPrinter = this.printerList[0];
          }
        } else {
          this.printerList = [];
        }
      } catch (error) {
        console.error('加载打印机列表失败:', error);
        this.printerList = [];
        uni.showToast({
          title: '加载打印机列表失败',
          icon: 'none',
          duration: 2000
        });
      } finally {
        this.printerLoading = false;
      }
    },

    // 选择打印机
    selectPrinter(printer) {
      this.selectedPrinter = printer;
    },

    // 关闭打印机弹窗
    closePrinterModal() {
      this.showPrinterPopup = false;
      this.selectedPrinter = null;
      this.selectedIpqcItem = null;
    },

    // 确认打印
    async confirmPrint() {
      if (!this.selectedPrinter) {
        uni.showToast({
          title: '请选择打印机',
          icon: 'none',
          duration: 1000
        });
        return;
      }

      if (!this.selectedIpqcItem || !this.selectedIpqcItem.ipqcId) {
        uni.showToast({
          title: '报检记录信息不完整',
          icon: 'none',
          duration: 1000
        });
        return;
      }

      uni.showLoading({
        title: '标签打印中...'
      });

      try {
        // 调用后端打印标签接口，传入选中的打印机ID
        const result = await printLabel(this.selectedIpqcItem.ipqcId, {
          printerId: this.selectedPrinter.id // 传递选中的打印机ID
        });

        uni.hideLoading();
        uni.showToast({
          title: result.msg || '标签打印成功',
          icon: 'success',
          duration: 2000
        });
        // 关闭打印机选择弹窗
        this.closePrinterModal();
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: '打印失败，请重试',
          icon: 'none',
          duration: 2000
        });
        console.error('打印失败:', error);
      }
    },

    // 刷新数据
    refresh() {
      this.pageNum = 1
      this.hasMore = true
      this.loadIpqcList()
    },

    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true
      this.pageNum = 1
      this.hasMore = true
      this.loadIpqcList()
    },

    // 滚动到底部加载更多
    handleScrollToLower() {
      // 确保没有正在加载，并且还有更多数据
      if (this.ipqcLoading || !this.hasMore) {
        return
      }

      this.pageNum += 1
      this.loadIpqcList()
    },

    // 滚动处理
    handleScroll(e) {
      const scrollTop = e.detail.scrollTop
      this.showBackTop = scrollTop > this.scrollThreshold
    },

    // 回到顶部
    scrollToTop() {
      this.scrollTop = this.scrollTop + 1
      this.showBackTop = false
    }
  },
  // 组件挂载时自动加载数据
  mounted() {
    this.loadIpqcList()
  }
}
</script>

<style lang="scss" scoped>
.ipqc-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #f5f7fa;
}

/* 滚动区域 */
.scroll-container {
  height: calc(100vh - 150rpx);
  overflow: hidden;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

/* 空数据状态 */
.empty-container {
  padding: 100rpx 30rpx;
}

/* 记录列表 */
.record-list {
  padding: 20rpx 30rpx;
}

.record-item {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.status-tag {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 16rpx;
  background-color: #f0f0f0;
  color: #666;
  margin-left: 10rpx;
}

/* 序号样式 */
.task-index {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #2979FF;
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.ipqc-time {
  font-size: 24rpx;
  color: #666;
}

.batch-code {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-right: 12rpx;
}

.ipqc-batch-info {
  flex: 1;
  display: flex;
  align-items: center;
}

.record-content {
  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
  }

  .info-label {
    width: 130rpx;
    font-size: 14px;
    color: #666666;
    flex-shrink: 0;
  }

  .info-value {
    flex: 1;
    font-size: 14px;
    color: #333333;

    &.check-pass {
      color: #07c160;
      font-weight: 500;
    }

    &.check-fail {
      color: #ff4d4f;
      font-weight: 500;
    }

    &.check-empty {
      color: #999;
    }
  }
}

.record-actions {
  position: relative;
  margin-top: 20rpx;
}

.action-divider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1rpx;
  background-color: #F0F0F0;
}

.action-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
}

.action-time {
  color: #5a5a5a;
  flex: 1;
}

.print-btn {
  width: 120rpx;
  margin-left: auto;
}

/* 加载更多状态 */
.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
}

/* 没有更多数据提示 */
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

/* 还有更多数据提示 */
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

/* 回到顶部按钮 */
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

/* 打印机选择弹窗样式 */
.detail-container {
  background: #fff;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
}

.detail-header {
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.printer-list-content {
  flex: 1;
  max-height: 500rpx;
  padding: 5px 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.loading-text {
  margin-top: 10rpx;
  color: #999;
  font-size: 14px;
}

.empty-printers {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 14px;
}

.printer-list {
  padding: 0 30rpx;
}

.printer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.printer-item:last-child {
  border-bottom: none;
}

.printer-item.active {
  background-color: #f0f8ff;
}

.printer-name {
  font-size: 16px;
  color: #333;
}

.action-section.fixed-bottom {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  background-color: #fff;
}

.button-group {
  display: flex;
  gap: 10rpx;
}
</style>