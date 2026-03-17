<template>
  <up-popup
      :show="dialogShow"
      mode="center"
      :round="16"
      :closeable="true"
      @close="handleClose"
      class="test-record-popup"
  >
    <view class="dialog-container">
      <!-- 弹窗头部 -->
      <view class="dialog-header">
        <text class="dialog-title">检测记录</text>
      </view>

      <!-- 搜索栏 -->
      <!-- <view class="search-section" v-if="tableData.length > 0">
        <u-search
            v-model="searchKeyword"
            placeholder="搜索检验单编号/产品名称/批次号"
            :show-action="false"
            bg-color="#F8F8F8"
            border-color="#F8F8F8"
            placeholder-color="#C8C9CC"
            shape="square"
            @search="handleSearch"
            class="search-input"
        />
      </view> -->

      <!-- 记录列表区域 -->
      <view class="record-list-container">
        <!-- 加载状态 -->
        <view class="loading" v-if="loading">
          <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 无数据状态 -->
        <view class="empty-container" v-else-if="filteredTableData.length === 0">
          <u-empty mode="data" text="暂无检测记录数据"></u-empty>
        </view>

        <!-- 记录列表 -->
        <scroll-view v-else class="record-list" scroll-y="true" style="height: 500px;">
          <view
              class="record-item"
              v-for="(row, index) in filteredTableData"
              :key="row.id || index"
              :class="{ 'current-row': currentRowId === row.id }"
              @click="handleRowClick(row)"
          >
            <!-- 记录头部 -->
            <view class="record-header">
              <text class="order-number">批次号：{{ row.batchNo || '-' }}</text>
            </view>

            <!-- 记录内容 -->
            <view class="record-content">
              <!-- 检测项 -->
              <view class="test-items-section">
                <view class="section-title">检测项</view>
                <view class="test-items-scroll">
                  <view class="test-items-grid">
                    <view
                        class="test-item"
                        v-for="(column, idx) in dynamicColumns"
                        :key="idx"
                    >
                      <text class="test-item-label">{{ column }}</text>
                      <text class="test-item-value">{{ row.testDataMap[column] || '-' }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>

            <!-- 记录操作信息 -->
            <view class="record-actions">
              <view class="action-divider"></view>
              <view class="action-content">
                <text class="action-time">{{ formatDate(row.createTime) }}</text>
                <text class="action-creator">创建人：{{ row.createByName || '-' }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 底部按钮 -->
      <view class="dialog-footer">
        <up-button type="default" text="取消" size="small" @click="handleClose"></up-button>
        <up-button type="primary" text="返回" size="small" @click="handleClose" v-if="optType === 'view'"></up-button>
      </view>
    </view>
  </up-popup>
</template>

<script>
import { listTestData, delTestData } from "@/api/quality/qcTestData";

export default {
  name: "Defectrecord",
  props: {
    qcId: null,
    qcType: null,
    lineId: null,
    optType: null,
    dialogShow: Boolean
  },
  data() {
    return {
      loading: false,
      testDataList: [], // 原始数据
      tableData: [], // 处理后的分组数据
      filteredTableData: [], // 搜索过滤后的数据
      dynamicColumns: [], // 动态检测项列（检测项名称）
      currentRowId: undefined,
      searchKeyword: '',
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        qcId: this.qcId,
        lineId: this.lineId,
        ipqcId: this.qcId,
        ipqcCode: undefined,
        ipqcName: undefined,
        indexId: undefined,
        indexCode: undefined,
        indexName: undefined,
        testData: undefined,
        inspector: undefined,
        productCode: undefined,
        productName: undefined,
        inspectDate: undefined,
        createByNick: undefined,
        updateByNick: undefined,
        checkTag: undefined,
        params: {}
      }
    };
  },
  watch: {
    dialogShow(newVal) {
      if (newVal) {
        this.queryParams.qcId = this.qcId; // 同步父组件qcId
        this.queryParams.ipqcId = this.qcId;
        this.queryParams.lineId = this.lineId;
        this.getList(); // 加载数据
      } else {
        this.testDataList = [];
        this.tableData = [];
        this.filteredTableData = [];
        this.dynamicColumns = [];
        this.currentRowId = undefined;
        this.searchKeyword = '';
      }
    },
    lineId(newVal) {
      if (this.dialogShow && newVal) {
        this.queryParams.lineId = newVal;
        this.getList();
      }
    },
    tableData() {
      this.filteredTableData = [...this.tableData];
    },
    searchKeyword() {
      this.filterData();
    }
  },
  methods: {
    /** 日期格式化 */
    formatDate(date) {
      if (!date) return '-';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    /** 查询数据并处理动态列 */
    getList() {
      this.loading = true;
      listTestData(this.queryParams)
          .then(response => {
            if (response.code === 200 || response.success) {
              this.testDataList = response.rows || response.data || [];
              this.handleTableData(); // 处理分组和动态列
            } else {
              throw new Error(response.msg || '加载数据失败');
            }
          })
          .catch(error => {
            console.error("加载检测记录失败：", error);
            uni.showToast({ title: error.message || '加载失败，请重试', icon: 'none' });
            this.testDataList = [];
            this.tableData = [];
            this.dynamicColumns = [];
          })
          .finally(() => {
            this.loading = false;
          });
    },

    /** 处理表格数据：分组 + 生成动态列 */
    handleTableData() {
      if (!this.testDataList.length) {
        this.tableData = [];
        this.filteredTableData = [];
        this.dynamicColumns = [];
        return;
      }

      // 1. 提取所有唯一的检测项名称（动态列）
      const indexNames = [...new Set(this.testDataList.map(item => item.indexName).filter(Boolean))];
      this.dynamicColumns = indexNames;

      // 2. 按「检验单+批次+checkTag」分组（合并相同主记录）
      const groupMap = {};
      this.testDataList.forEach(item => {
        const groupKey = `${item.ipqcCode}_${item.batchNo}_${item.checkTag}`;
        if (!groupMap[groupKey]) {
          // 初始化分组数据
          groupMap[groupKey] = {
            id: item.id,
            ipqcCode: item.ipqcCode,
            ipqcName: item.ipqcName,
            productCode: item.productCode,
            productName: item.productName,
            batchNo: item.batchNo,
            inspector: item.inspector,
            inspectDate: item.inspectDate,
            createTime: item.createTime,
            createByName: item.createByName,
            testDataMap: {} // 检测项名称 -> 检测数据
          };
        }
        // 填充检测数据到映射表
        groupMap[groupKey].testDataMap[item.indexName] = item.testData;
      });

      // 3. 转换为表格数据数组
      this.tableData = Object.values(groupMap);
      this.filteredTableData = [...this.tableData];
    },

    /** 搜索过滤数据 */
    filterData() {
      if (!this.searchKeyword) {
        this.filteredTableData = [...this.tableData];
        return;
      }

      const keyword = this.searchKeyword.toLowerCase();
      this.filteredTableData = this.tableData.filter(row => {
        return (
          row.ipqcCode?.toLowerCase().includes(keyword) ||
          row.productName?.toLowerCase().includes(keyword) ||
          row.batchNo?.toLowerCase().includes(keyword) ||
          row.inspector?.toLowerCase().includes(keyword) ||
          row.productCode?.toLowerCase().includes(keyword)
        );
      });
    },

    /** 搜索事件 */
    handleSearch() {
      this.filterData();
    },
    /** 行点击事件 */
    handleRowClick(row) {
      this.currentRowId = row.id;
    },

    /** 删除事件（保留原逻辑） */
    handleDelete(row) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条检测记录吗？',
        confirmText: '删除',
        cancelText: '取消',
        success: async (res) => {
          if (res.confirm) {
            try {
              await delTestData(row.id);
              uni.showToast({ title: '删除成功', icon: 'success' });
              this.getList(); // 重新加载列表
            } catch (error) {
              console.error("删除检测记录失败：", error);
              uni.showToast({ title: error.message || '删除失败', icon: 'none' });
            }
          }
        }
      });
    },

    /** 关闭弹窗 */
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
/* 弹窗容器 */
.dialog-container {
  max-width: 1200px;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.test-record-popup {
  --up-popup-background: transparent;
}

/* 弹窗头部 */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;
  background-color: #fafafa;
}

.dialog-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 搜索栏 */
.search-section {
  padding: 10px 20px;
  border-bottom: 1px solid #f5f5f5;
  background-color: #fafafa;
}

.search-input {
  width: 100%;
}

/* 记录列表容器 */
.record-list-container {
  flex: 1;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  position: relative;
}

/* 加载状态 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
  flex: 1;
}

.loading-text {
  display: block;
  margin-top: 10px;
  color: #999;
  font-size: 14px;
}

/* 空状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100rpx 30rpx;
  flex: 1;
}

.empty-hint {
  margin-top: 20rpx;
  font-size: 14px;
  color: #999;
}

/* 记录列表 */
.record-list {
  padding: 20rpx;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* 确保滚动条显示 */
.record-list::-webkit-scrollbar {
  width: 6rpx;
}

.record-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3rpx;
}

.record-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3rpx;
}

.record-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 记录项 */
.record-item {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.record-item:hover {
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
}

.record-item.current-row {
  border: 1rpx solid #2979FF;
  box-shadow: 0 0 0 2rpx rgba(41, 121, 255, 0.1);
}

/* 记录头部 */
.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-number {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
}

/* 记录内容 */
.record-content {
  margin-bottom: 20rpx;
}

/* 信息行 */
.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
  flex-wrap: wrap;
}

.info-label {
  width: 150rpx;
  font-size: 14px;
  color: #666666;
  flex-shrink: 0;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #333333;
  margin-right: 20rpx;
}

/* 检测项区域 */
.test-items-section {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 15rpx;
  padding-left: 10rpx;
  border-left: 4rpx solid #2979FF;
}

.test-items-scroll {
  overflow-x: auto;
  margin: 0 -10rpx;
  padding: 0 10rpx;
}

.test-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200rpx, 1fr));
  gap: 15rpx;
  min-width: max-content;
}

.test-item {
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.test-item-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8rpx;
  word-break: break-word;
}

.test-item-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 记录操作信息 */
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
  padding-top: 15rpx;
}

.action-time {
  color: #999;
  font-size: 12px;
  flex: 1;
}

.action-creator {
  color: #999;
  font-size: 12px;
  text-align: right;
}

/* 底部按钮区域 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15rpx;
  padding: 20rpx;
  border-top: 1rpx solid #f5f5f5;
  background-color: #fafafa;
}

/* 按钮样式 */
:deep(.u-button--small) {
  min-width: 120rpx;
}

/* 响应式调整（适配移动端） */
@media (max-width: 768px) {
  .dialog-container {
    width: 95vw;
    max-height: 90vh; /* 限制弹窗高度，避免超出屏幕 */
  }

  .record-list {
    padding: 10rpx;
  }

  .record-item {
    padding: 20rpx;
    margin-bottom: 15rpx;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8rpx;
  }

  .info-label {
    width: 100%;
  }

  .info-value {
    margin-right: 0;
  }

  .test-items-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dialog-footer {
    padding: 15rpx;
  }
}
</style>