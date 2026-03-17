<template>
  <up-popup
      :show="dialog.show"
      mode="center"
      :round="16"
      :closeable="true"
      @close="dialog.show = false"
  >
    <view class="printer-modal">
      <!-- 弹窗头部 -->
      <view class="modal-header">
        <text class="modal-title">选择方案</text>
        <up-icon
            name="close"
            size="20"
            color="#666"
            class="dialog-close"
            @click="dialog.show = false"
        />
      </view>
      
      <!-- 搜索区域 -->
      <view class="dialog-search">
        <u-search
            v-model="search.searchValue"
            placeholder="请输入模板编号/检测模板名称"
            :show-action="false"
            bg-color="#f8f8f8"
            border-color="#f8f8f8"
            placeholder-color="#999"
            shape="square"
            @search="handleQuery"
            class="search-input"
        />
        <up-button class="search-btn" type="primary" text="搜索" size="small" @click="handleQuery">
        </up-button>
      </view>

      <!-- 列表区域 -->
      <view class="printer-modal-content">
        <view v-if="loading" class="loading-container">
          <u-loading-icon size="20" text="加载中..."></u-loading-icon>
        </view>
        <u-empty v-else-if="tableData.length === 0" text="暂无可用模板" mode="data"></u-empty>
        <view v-else class="template-list">
          <view
              v-for="(row, index) in tableData"
              :key="row.templateId || index"
              class="printer-item"
              :class="{ 'active': selectedVendorId === row.templateId }"
              @click="handleRowClick(row)"
              @dblclick="handleRowDbClick(row)"
          >
            <view class="template-info">
              <view class="template-code">{{ row.templateCode || '-' }}</view>
              <view class="template-name">{{ row.templateName || '-' }}</view>
            </view>
            <view class="template-radio">
              <up-icon
                  v-if="selectedVendorId === row.templateId"
                  name="checkmark"
                  size="20"
                  color="#2979FF"
              ></up-icon>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 底部按钮 -->
      <view class="modal-footer">
        <up-button text="取消" size="small" @click="dialog.show = false"></up-button>
        <up-button type="primary" text="确定" size="small" @click="confirmSelect"></up-button>
      </view>
    </view>
  </up-popup>
</template>

<script>
import { listTemplate } from "@/api/quality/qcTemplate"

export default {
  name: "single",
  props: {
    ipqcType: undefined
  },
  data() {
    return {
      // 对话框状态
      dialog: {
        show: false
      },
      // 表格数据
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      totalPages: 0,
      loading: false,
      // 搜索条件
      search: {
        templateCode: null,
        templateName: null,
        searchValue: null,
        queryParams: {}
      },
      // 选中状态
      selectedVendorId: undefined,
      selectedRow: undefined,
      // 字典映射（模拟原DictTag功能）
      dictMap: {
      },
      // 单选框组名
      templateRadioGroup: 'templateRadio' + Date.now()
    };
  },
  watch: {
    'dialog.show'(val) {
      if (val) {
        this.$nextTick(() => {
          // 只调用一次handleQuery()即可，避免重复请求
          this.handleQuery();
        });
      } else {
        this.selectedVendorId = undefined;
        this.selectedRow = undefined;
        this.resetQuery();
      }
    }
  },
  methods: {
    /** 搜索操作 */
    async handleQuery() {
      this.pageNum = 1; // 重置为第一页
      await this.loadTableData();
    },

    /** 重置操作 */
    async resetQuery() {
      this.search = {
        templateCode: null,
        templateName: null,
        searchValue: null,
        queryParams: {}
      };
      this.pageNum = 1;
      await this.loadTableData();
    },

    /** 加载表格数据 */
    async loadTableData() {
      console.log("进入加载数据方法");
      this.loading = true;
      try {
        const queryParams = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchValue : this.search.searchValue,
          itemCode: null,
          itemName: null,
          //qcTypes: this.ipqcType,
          ...this.search.queryParams,
          enableFlag: "Y",
        };

        // 调用改造后的API
        const res = await listTemplate(queryParams);

        if (res.code === 200) {
          this.tableData = res.rows || [];
          this.total = res.total || 0;
          this.totalPages = Math.ceil(this.total / this.pageSize);
        } else {
          uni.showToast({ title: '加载模板失败', icon: 'none' });
          this.tableData = [];
          this.total = 0;
          this.totalPages = 0;
        }
      } catch (error) {
        console.error('加载表格数据失败:', error);
        uni.showToast({ title: '网络错误，请重试', icon: 'none' });
        this.tableData = [];
        this.total = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },
    /** 行点击事件 */
    handleRowClick(row) {
      this.selectedRow = row;
      this.selectedVendorId = row.templateId;
    },

    /** 双击行选中 */
    handleRowDbClick(row) {
      this.selectedRow = row;
      this.selectedVendorId = row.templateId;
      this.$emit('ok', this.selectedRow);
      this.dialog.show = false;
    },

    /** 单选按钮变化 */
    handleRowChange(row) {
      this.selectedRow = row;
    },

    /** 确认选择 */
    confirmSelect() {
      if (!this.selectedRow) {
        uni.showToast({ title: '请选择一条数据!', icon: 'none' });
        return;
      }
      this.$emit('ok', this.selectedRow);
      this.dialog.show = false;
    },

    /** 外部调用显示组件 */
    open() {
      this.dialog.show = true;
    },
  }
};
</script>

<style scoped>
/* 弹窗容器 */
.printer-modal {
  width: 600rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

/* 弹窗头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.dialog-close {
  cursor: pointer;
}

.dialog-search {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 30rpx;
  background-color: #f8f8f8;
}

.search-input {
  flex: 1;
}

.search-btn {
  min-width: 100rpx;
}

/* 列表容器 */
.printer-modal-content {
  max-height: 500rpx;
  overflow-y: auto;
  padding: 30rpx;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

/* 模板列表 */
.template-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.printer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;

  &:active {
    background-color: #f0f0f0;
  }

  &:last-child {
    border-bottom: none;
  }

  &.active {
    background-color: #f0f8ff;
  }
}

.template-radio {
  margin-left: 20rpx;
}

.template-info {
  flex: 1;
}

.template-code {
  font-size: 14px;
  color: #666;
  margin-bottom: 4rpx;
}

.template-name {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

/* 底部按钮区域 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10rpx;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .printer-modal {
    width: 90vw;
  }
  
  .dialog-search {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-btn {
    width: 100%;
  }
}
</style>