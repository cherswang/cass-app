<template>
  <view class="dialog-overlay" v-if="visible">
    <view class="dialog-container">
      <!-- 弹窗头部 -->
      <view class="dialog-header">
        <text class="dialog-title">供应商选择</text>
        <uni-icons
            type="close"
            size="20"
            color="#666"
            class="dialog-close"
            @click="visible = false"
        />
      </view>

      <!-- 搜索区域 -->
      <view class="dialog-search">
        <input
            v-model="search.searchValue"
            placeholder="请输入供应商编码/供应商名称"
            size="mini"
            @keyup.enter.native="handleQuery"
            class="search-input"
        />
        <button class="btn primary-btn" @click="handleQuery">
          <uni-icons type="search" size="14" color="#fff"></uni-icons> 搜索
        </button>
      </view>

      <!-- 表格区域 -->
      <view class="table-container" v-if="!loading">
        <view class="table-scroll">
          <table class="sc-table">
            <thead>
            <tr>
              <th style="text-align: center;">供应商名称</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(row, index) in vendorList"
                :key="row.vendorId || index"
                :class="{ 'current-row': selectedVendorId === row.vendorId }"
                @click="handleRowChange(row)"
                @dblclick="handleRowDbClick(row)"
            >
              <td style="text-align: center;">
                <div class="ellipsis">{{ row.vendorName || '-' }}</div>
              </td>
            </tr>
            <tr v-if="vendorList.length === 0">
              <td colspan="6" style="text-align: center; padding: 30px 0;">
                <text class="no-data-text">暂无数据</text>
              </td>
            </tr>
            </tbody>
          </table>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-container" v-if="loading">
        <uni-loading type="spinner" color="#007aff" size="24"></uni-loading>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 底部按钮 -->
      <view class="dialog-footer">
        <button class="btn primary-btn" @click="confirmSelect">确 定</button>
        <button class="btn default-btn" @click="visible = false">取 消</button>
      </view>
    </view>
  </view>
</template>

<script>
import { listVendor } from "@/api/md/vendor";

export default {
  name: "VendorSelect",
  data() {
    return {
      visible: false,
      selectedVendorId: undefined,
      selectedRow: undefined,
      vendorList: [],
      loading: true,
      // 搜索条件
      search: {
        searchValue: '',
        queryParams: {
          pageNum: 1,
          pageSize: 20
        }
      },
      // 单选框组名
      vendorRadioGroup: 'vendorRadio' + Date.now()
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.loadVendorList();
        });
      } else {
        this.resetQuery();
      }
    }
  },
  methods: {
    // 打开弹窗
    open() {
      this.visible = true;
      return this;
    },

    // 加载供应商列表
    async loadVendorList() {
      this.loading = true;
      try {
        // 构建查询参数
        const params = {
          ...this.search.queryParams,
          searchValue: this.search.searchValue
        };

        // 调用API获取数据
        const res = await listVendor(params);

        if (res.code === 200) {
          this.vendorList = res.rows || [];
        } else {
          uni.showToast({
            title: res.msg || '加载供应商列表失败',
            icon: 'none'
          });
          this.vendorList = [];
        }
      } catch (error) {
        console.error('加载供应商列表出错：', error);
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
        this.vendorList = [];
      } finally {
        this.loading = false;
      }
    },

    // 处理行点击
    handleRowChange(row) {
      this.selectedRow = row;
      this.selectedVendorId = row.vendorId;
    },

    // 行双击选中
    handleRowDbClick(row) {
      this.selectedRow = row;
      this.selectedVendorId = row.vendorId;
      this.confirmSelect();
    },

    // 确认选择
    confirmSelect() {
      if (!this.selectedVendorId) {
        uni.showToast({
          title: '请至少选择一条数据!',
          icon: 'none'
        });
        return;
      }

      // 触发选中事件
      this.$emit('onSelected', this.selectedRow);
      this.visible = false;
    },

    // 搜索操作
    handleQuery() {
      this.search.queryParams.pageNum = 1;
      this.loadVendorList();
    },

    // 重置操作
    resetQuery() {
      this.search = {
        searchValue: '',
        queryParams: {
          pageNum: 1,
          pageSize: 10
        }
      };
      this.selectedVendorId = undefined;
      this.selectedRow = undefined;
    },
  }
};
</script>

<style scoped>
/* 弹窗遮罩层 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
  box-sizing: border-box;
}

/* 弹窗容器 */
.dialog-container {
  width: 100%;
  max-width: 1200px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 弹窗头部 */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;
}

.dialog-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.dialog-close {
  cursor: pointer;
}

/* 搜索区域 */
.dialog-search {
  display: grid;
  grid-template-columns: 1fr auto; /* 搜索框自适应，按钮根据内容宽度 */
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background-color: #fafafa;
}

.search-input {
  height: 36px;
  padding: 0 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  min-width: 0; /* 重要：防止内容溢出 */
}

/* 按钮通用样式 */
.btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  border: none;
  box-sizing: border-box;
  white-space: nowrap;
}

.primary-btn {
  background-color: #007aff;
  color: #fff;
}

.default-btn {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #eee;
}

/* 表格容器 */
.table-container {
  padding: 0 20px;
  max-height: 400px;
  overflow: hidden;
}

.table-scroll {
  max-height: 400px;
  overflow-y: auto;
}

/* 表格样式 */
.sc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.sc-table th,
.sc-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #f5f5f5;
  text-align: center;
}

.sc-table th {
  background-color: #fafafa;
  color: #666;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 1;
}

.sc-table .current-row {
  background-color: #e6f7ff;
}

/* 无数据样式 */
.no-data-text {
  font-size: 14px;
  color: #999;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
}

.loading-text {
  font-size: 14px;
  color: #999;
  margin-top: 10px;
}

/* 底部按钮区域 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #f5f5f5;
}

@media (max-width: 768px) {
  .dialog-search {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
    min-width: auto;
  }
}
</style>