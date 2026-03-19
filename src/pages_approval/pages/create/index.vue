<template>
  <view class="create-flow-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <uni-icons class="search-icon" type="search" size="20" color="#999"></uni-icons>
        <input 
          v-model="searchKeyword" 
          class="search-input" 
          placeholder="流程名称 / 表单名称"
        />
        <uni-icons 
          v-if="searchKeyword" 
          class="clear-icon" 
          type="clear" 
          size="20" 
          color="#999"
          @click="clearSearch"
        ></uni-icons>
      </view>
      <button class="search-btn" @click="performSearch">搜索</button>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons" v-if="showClassField">
      <button 
        class="action-btn" 
        :class="{ active: activeTab === 'common' }"
        @click="switchTab('common')"
      >常用</button>
      <button 
        class="action-btn" 
        :class="{ active: activeTab === 'all' }"
        @click="switchTab('all')"
      >全部</button>
    </view>

    <!-- 流程分类 -->
    <view class="category-section" v-if="showClassField">
      <text class="section-title">流程分类</text>
      <scroll-view class="category-scroll" scroll-x>
        <view 
          v-for="category in bpmSortList" 
          :key="category.sortId"
          class="category-item"
          :class="{ active: selectedCategory === category.sortId }"
          @click="selectCategory(category.sortId)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
    </view>

    <!-- 流程列表 -->
    <view class="flow-list-section">
      <text class="section-title">流程列表</text>
      <view v-if="loading" class="loading-container">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
      <view v-else-if="bpmFlowList.length === 0" class="empty-container">
        <uni-icons type="none" size="60" color="#ccc"></uni-icons>
        <text class="empty-text">暂无流程数据</text>
      </view>
      <view v-else class="flow-grid">
        <view v-for="item in bpmFlowList" :key="item.flowId" class="flow-card">
          <view class="flow-card-header">
            <text class="flow-name">{{ item.flowName }}</text>
          </view>
          <view class="flow-card-body">
            <view class="flow-info">
              <text class="info-label">分类：</text>
              <text class="info-value">{{ item.flowSortName }}</text>
            </view>
            <view class="flow-info">
              <text class="info-label">管理员：</text>
              <text class="info-value">{{ item.createUserName }}</text>
            </view>
          </view>
          <view class="flow-card-actions">
            <view class="action-item" @click="showBpmRemark(item)">
              <uni-icons type="info" size="20" color="#666"></uni-icons>
              <text class="action-text">说明</text>
            </view>
            <view class="action-item" @click="createBpm(item.flowId)">
              <uni-icons type="compose" size="20" color="#1890ff"></uni-icons>
              <text class="action-text">发起</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 说明弹窗 -->
    <uni-popup ref="remarkPopup" type="dialog">
      <uni-popup-dialog
        title="流程说明"
        :content="bpmRemark"
        @confirm="closeRemarkPopup"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import API from '@/api';

export default {
  data() {
    return {
      loading: false,
      activeTab: 'common',
      selectedCategory: '',
      searchKeyword: '',
      bpmSortList: [],
      bpmFlowList: [],
      bpmRemark: '',
      showClassField: false,//暂时屏蔽掉类别切换和流程分类，等后续工期给了之后再开启
    };
  },

  mounted() {
    this.getBpmSortGroup();
    this.getMyCommonBpmFlowList();
  },

  methods: {
    // 获取流程分类
    async getBpmSortGroup() {
      try {
        const res = await API.bpm.bpmSort.getBpmSortByRole.get({ model: '0' });
        if (res.code === 200) {
          this.bpmSortList = res.data || [];
        }
      } catch (error) {
        console.error('获取流程分类失败:', error);
        uni.showToast({ title: '获取流程分类失败', icon: 'none' });
      }
    },

    // 获取常用流程
    async getMyCommonBpmFlowList() {
      this.loading = true;
      try {
        const res = await API.bpm.bpmFlow.getMyCommonBpmFlowList.get({ model: '0' });
        if (res.code === 200) {
          this.bpmFlowList = res.data || [];
        }
      } catch (error) {
        console.error('获取常用流程失败:', error);
        uni.showToast({ title: '获取常用流程失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },

    // 获取全部流程
    async getAllBpmFlow() {
      this.loading = true;
      try {
        const res = await API.bpm.bpmFlow.getMyBpmFlowList.get({ model: '0' });
        if (res.code === 200) {
          this.bpmFlowList = res.data || [];
        }
      } catch (error) {
        console.error('获取全部流程失败:', error);
        uni.showToast({ title: '获取全部流程失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },

    // 根据分类获取流程
    async getBpmFlowByCategory(sortId) {
      this.loading = true;
      try {
        const res = await API.bpm.bpmFlow.getMyBpmFlowList.get({ flowSort: sortId, model: '0' });
        if (res.code === 200) {
          this.bpmFlowList = res.data || [];
        }
      } catch (error) {
        console.error('获取分类流程失败:', error);
        uni.showToast({ title: '获取分类流程失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },

    // 搜索流程
    async performSearch() {
      if (!this.searchKeyword.trim()) {
        if (this.activeTab === 'common') {
          this.getMyCommonBpmFlowList();
        } else {
          this.getAllBpmFlow();
        }
        return;
      }

      this.loading = true;
      try {
        const res = await API.bpm.bpmFlow.getMyBpmFlowList.get({ keyword: this.searchKeyword, model: '0' });
        if (res.code === 200) {
          this.bpmFlowList = res.data || [];
        }
      } catch (error) {
        console.error('搜索流程失败:', error);
        uni.showToast({ title: '搜索流程失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },

    // 清除搜索
    clearSearch() {
      this.searchKeyword = '';
      if (this.activeTab === 'common') {
        this.getMyCommonBpmFlowList();
      } else {
        this.getAllBpmFlow();
      }
    },

    // 切换标签
    switchTab(tab) {
      this.activeTab = tab;
      this.selectedCategory = '';
      if (tab === 'common') {
        this.getMyCommonBpmFlowList();
      } else {
        this.getAllBpmFlow();
      }
    },

    // 选择分类
    selectCategory(sortId) {
      this.selectedCategory = sortId;
      this.getBpmFlowByCategory(sortId);
    },

    // 显示流程说明
    showBpmRemark(item) {
      this.bpmRemark = item.remark || '暂无说明';
      this.$refs.remarkPopup.open();
    },

    // 关闭说明弹窗
    closeRemarkPopup() {
      this.$refs.remarkPopup.close();
    },

    // 创建流程
    async createBpm(flowId) {
      try {
        const res = await API.bpm.bpmFlow.getDocNumByBpmFlow.get({ flowId: flowId });
        if (res.code === 200) {
          uni.navigateTo({
            url: `/pages_approval/pages/handle/index?flowId=${flowId}&opType=start&flowTitle=${encodeURIComponent(res.data.flowTitle)}&urgency=0`
          });
        } else {
          uni.showToast({ title: res.message || '获取流程信息失败', icon: 'none' });
        }
      } catch (error) {
        console.error('创建流程失败:', error);
        uni.showToast({ title: '创建流程失败', icon: 'none' });
      }
    }
  }
};
</script>

<style lang="scss">
.create-flow-container {
  padding: 16rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
  align-items: center;

  .search-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 8rpx;
    padding: 0 16rpx;
    height: 72rpx;

    .search-icon {
      margin-right: 12rpx;
    }

    .search-input {
      flex: 1;
      height: 100%;
      border: none;
      outline: none;
      font-size: 28rpx;
      color: #333;
    }

    .clear-icon {
      margin-left: 12rpx;
    }
  }

  .search-btn {
    width: 120rpx;
    height: 72rpx;
    background-color: #1890ff;
    color: #fff;
    border: none;
    border-radius: 8rpx;
    font-size: 28rpx;
  }
}

.action-buttons {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;

  .action-btn {
    flex: 1;
    height: 64rpx;
    border: 1rpx solid #e8e8e8;
    background-color: #fff;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #666;

    &.active {
      background-color: #1890ff;
      color: #fff;
      border-color: #1890ff;
    }
  }
}

.category-section {
  margin-bottom: 16rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rpx;
    display: block;
  }

  .category-scroll {
    white-space: nowrap;
    padding-bottom: 8rpx;

    .category-item {
      display: inline-block;
      padding: 12rpx 24rpx;
      margin-right: 12rpx;
      background-color: #fff;
      border-radius: 20rpx;
      font-size: 26rpx;
      color: #666;
      border: 1rpx solid #e8e8e8;

      &.active {
        background-color: #1890ff;
        color: #fff;
        border-color: #1890ff;
      }
    }
  }
}

.flow-list-section {
  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rpx;
    display: block;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;

    .loading-spinner {
      width: 40rpx;
      height: 40rpx;
      border: 4rpx solid rgba(24, 144, 255, 0.2);
      border-top: 4rpx solid #1890ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16rpx;
    }

    .loading-text {
      font-size: 28rpx;
      color: #999;
    }
  }

  .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;

    .empty-text {
      font-size: 28rpx;
      color: #999;
      margin-top: 16rpx;
    }
  }

  .flow-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;

    .flow-card {
      background-color: #fff;
      border-radius: 12rpx;
      overflow: hidden;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

      .flow-card-header {
        padding: 16rpx;
        background-color: #f0f7ff;
        border-bottom: 1rpx solid #e8e8e8;

        .flow-name {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }

      .flow-card-body {
        padding: 16rpx;

        .flow-info {
          display: flex;
          margin-bottom: 8rpx;

          .info-label {
            font-size: 24rpx;
            color: #999;
            width: 120rpx;
          }

          .info-value {
            font-size: 24rpx;
            color: #666;
            flex: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
        }
      }

      .flow-card-actions {
        display: flex;
        border-top: 1rpx solid #e8e8e8;

        .action-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16rpx 0;
          border-right: 1rpx solid #e8e8e8;

          &:last-child {
            border-right: none;
          }

          .action-text {
            font-size: 22rpx;
            color: #666;
            margin-top: 8rpx;
          }
        }
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>