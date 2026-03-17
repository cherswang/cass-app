<template>
  <view class="dialog-overlay" v-if="visible">
    <view class="dialog-container">
      <!-- 弹窗头部 -->
      <view class="dialog-header">
        <text class="dialog-title">物料产品选择</text>
        <uni-icons
            type="close"
            size="20"
            color="#666"
            class="dialog-close"
            @click="visible = false"
        />
      </view>

      <!-- 搜索区域 - 强制单行显示 -->
      <view class="dialog-search">
        <input
            v-model="search.searchValue"
            placeholder="物料名称/物料编码/规格型号"
            class="search-input"
            @confirm="upSearch"
            @keyup.enter.native="upSearch"
        />
        <button class="btn primary-btn" @click="upSearch">
          <uni-icons type="search" size="14" color="#fff"></uni-icons> 搜索
        </button>
      </view>

      <!-- 主体内容：左侧分类树 + 右侧表格 -->
      <view class="dialog-body">
        <!-- 左侧分类树 -->
        <view class="left-sidebar">
          <scroll-view scroll-y class="tree-scroll" style="height: 100%;">
            <uni-tree
                :nodes="itemTypeOptions"
                :show-checkbox="false"
                :expand-on-click-node="false"
                :highlight-current="true"
                @nodeClick="handleNodeClick"
                key-name="id"
                text-name="itemTypeName"
                value-name="itemTypeId"
            ></uni-tree>
          </scroll-view>
        </view>

        <!-- 右侧内容区 -->
        <view class="right-content">
          <!-- 表格区域 -->
          <view class="table-container" v-if="!loading">
            <view class="table-scroll">
              <table class="sc-table">
                <thead>
                <tr>
                  <th style="width: 180px; text-align: center;">物料名称</th>
                  <th style="width: 150px; text-align: center;">规格型号</th>
                  <th style="width: 120px; text-align: center;">物料编码</th>
                  <th style="width: 80px; text-align: center;">单位</th>
                  <th style="width: 120px; text-align: center;">所属分类</th>
                  <th style="width: 150px; text-align: center;">创建时间</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="(row, index) in itemList"
                    :key="row.itemId || index"
                    :class="{ 'current-row': selectedItemId === row.itemId }"
                    @click="handleRowChange(row)"
                    @dblclick="handleRowDbClick(row)"
                >
                  <td style="width: 180px; text-align: center;">
                    <div class="ellipsis">{{ row.itemName || '-' }}</div>
                  </td>
                  <td style="width: 150px; text-align: center;">
                    <div class="ellipsis">{{ row.specification || '-' }}</div>
                  </td>
                  <td style="width: 120px; text-align: center;">
                    <div class="ellipsis">{{ row.itemCode || '-' }}</div>
                  </td>
                  <td style="width: 80px; text-align: center;">
                    <div>{{ row.unitOfMeasure || '-' }}</div>
                  </td>
                  <td style="width: 120px; text-align: center;">
                    <div>{{ row.itemTypeName || '-' }}</div>
                  </td>
                  <td style="width: 150px; text-align: center;">
                    <div>{{ row.createTime || '-' }}</div>
                  </td>
                </tr>
                <tr v-if="itemList.length === 0">
                  <td colspan="7" style="text-align: center; padding: 30px 0;">
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
        </view>
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
import {getMdItemTypeTree,listMdItem} from "@/api/md/mdItem";

export default {
  name: "MdItemSingle",
  data() {
    return {
      // 弹窗显示状态
      visible: false,
      // 加载状态
      loading: false,
      // 选中数据
      selectedItemId: undefined,
      selectedRows: undefined,
      // 搜索条件
      search: {
        searchValue: '',
        params: {}, // 分类树筛选参数
        queryParams: { // 高级筛选参数
          pageNum: 1,
          pageSize: 20
        }
      },
      // 表格数据
      itemList: [],
      total: 0,
      // 分类树数据
      itemTypeOptions: [],
      // 高级筛选弹窗状态
      filterBarVisible: false,
      // 筛选配置
      filterBarOptions: [
        {
          label: '物料编码',
          value: 'itemCode',
          type: 'text',
          placeholder: '请输入产品物料编码'
        },
        {
          label: '规格型号',
          value: 'specification',
          type: 'text',
          placeholder: '请输入规格型号'
        },
        {
          label: '单位',
          value: 'unitOfMeasure',
          type: 'text',
          placeholder: '请输入单位'
        }
      ]
    };
  },
  computed: {
    // 计算筛选条件数量
    filterLength() {
      return Object.keys(this.search.queryParams).filter(key => {
        return this.search.queryParams[key] && this.search.queryParams[key] !== '';
      }).length;
    }
  },
  watch: {
    // 弹窗显示时加载数据
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.getTreeSelect();
          this.loadItemList();
        });
      } else {
        this.resetSearch();
      }
    }
  },
  methods: {
    // 打开弹窗
    open() {
      this.visible = true;
      return this;
    },

    // 加载分类树数据
    async getTreeSelect() {
      try {
        const response = await getMdItemTypeTree();
        this.itemTypeOptions = response.rows || [];
      } catch (error) {
        console.error('加载分类树失败:', error);
        uni.showToast({
          title: '加载分类失败',
          icon: 'none'
        });
      }
    },

    // 加载物料列表数据
    async loadItemList() {
      this.loading = true;
      try {
        // 构建查询参数
        const params = {
          ...this.search.queryParams,
          ...this.search.params,
          searchValue: this.search.searchValue
        };

        const res = await listMdItem(params);

        if (res.code === 200) {
          this.itemList = res.rows || [];
          this.total = res.total || 0;
        } else {
          uni.showToast({
            title: res.msg || '加载物料列表失败',
            icon: 'none'
          });
          this.itemList = [];
          this.total = 0;
        }
      } catch (error) {
        console.error('加载物料列表失败:', error);
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
        this.itemList = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },

    // 搜索操作
    upSearch() {
      this.search.queryParams.pageNum = 1;
      this.loadItemList();
    },

    // 重置搜索
    resetSearch() {
      this.search = {
        searchValue: '',
        params: {},
        queryParams: {
          pageNum: 1,
          pageSize: 10
        }
      };
      this.selectedItemId = undefined;
      this.selectedRows = undefined;
      this.filterBarVisible = false;
      this.loadItemList();
    },

    // 分类树节点点击
    handleNodeClick(data) {
      this.search.params = {
        itemTypeId: data.itemTypeId,
        itemTypeName: data.itemTypeName
      };
      this.search.queryParams.pageNum = 1;
      this.loadItemList();
    },

    handleRowChange(row) {
      if (this.selectedItemId === row.itemId) {
        this.selectedItemId = undefined;
        this.selectedRows = undefined;
      } else {
        this.selectedRows = row;
        this.selectedItemId = row.itemId;
      }
    },

    // 行双击
    handleRowDbClick(row) {
      this.selectedRows = row;
      this.selectedItemId = row.itemId;
      this.confirmSelect();
    },

    // 确认选择
    confirmSelect() {
      if (!this.selectedItemId) {
        uni.showToast({
          title: '请至少选择一条数据!',
          icon: 'none'
        });
        return;
      }
      this.$emit('onSelected', this.selectedRows);
      this.visible = false;
    },

    // 高级筛选确认
    handleFilterConfirm() {
      this.search.queryParams.pageNum = 1;
      this.loadItemList();
      this.filterBarVisible = false;
    }
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
  z-index: 9999;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}

/* 弹窗容器 */
.dialog-container {
  width: 95%;
  max-width: 1400px;
  max-height: 90vh;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
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

/* 搜索区域 - 强制单行显示核心样式 */
.dialog-search {
  display: grid;
  grid-template-columns: 1fr auto; /* 搜索框自适应，按钮根据内容宽度 */
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background-color: #fafafa;
}

/* 搜索框 - 强制自适应宽度，不换行 */
.search-input {
  height: 36px;
  padding: 0 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  flex: 1; /* 占满剩余宽度 */
  min-width: 0; /* 关键：允许宽度收缩，防止溢出 */
  white-space: nowrap; /* 禁止输入框内文字换行 */
  overflow: hidden; /* 防止内容溢出 */
  text-overflow: ellipsis; /* 溢出显示省略号 */
}

/* 搜索按钮 - 固定宽度，不换行 */
.search-btn {
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
  white-space: nowrap; /* 禁止按钮文字换行 */
  flex-shrink: 0; /* 关键：按钮不收缩 */
}

/* 主体内容 */
.dialog-body {
  display: flex;
  flex: 1;
  min-height: 300px;
  overflow: hidden;
  padding: 0;
}

/* 左侧分类树 */
.left-sidebar {
  width: 250px;
  min-width: 250px;
  border-right: 1px solid #e4e7ed;
  padding: 10px;
  box-sizing: border-box;
}

.tree-scroll {
  width: 100%;
  height: 100%;
}

/* 右侧内容区 */
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
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
  flex: 1;
  overflow: hidden;
  max-height: 400px;
}

.table-scroll {
  height: 100%;
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

/* 文本溢出省略 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
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
  height: 100%;
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

/* 高级筛选弹窗 */
.filter-bar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.filter-bar-container {
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.filter-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;
}

.filter-bar-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.filter-bar-close {
  cursor: pointer;
}

.filter-bar-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.filter-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.filter-label {
  width: 100px;
  text-align: right;
  padding-right: 10px;
  font-size: 14px;
  color: #666;
}

.filter-input {
  flex: 1;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 14px;
}

.filter-bar-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #f5f5f5;
}

/* 响应式适配 - 即使小屏也强制单行 */
@media (max-width: 768px) {
  .dialog-body {
    flex-direction: column;
    height: auto;
    min-height: 200px;
  }

  .left-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
    padding-bottom: 15px;
    margin-bottom: 15px;
    max-height: 150px;
    overflow-y: auto;
  }

  /* 小屏仍保持单行，搜索框自适应收缩 */
  .dialog-search {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    min-width: 120px; /* 小屏最小宽度，保证可用 */
  }

  .ellipsis {
    max-width: 100px;
  }

  .dialog-container {
    max-height: 95vh;
  }
}
</style>