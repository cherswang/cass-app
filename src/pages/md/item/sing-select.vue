<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar
        title="选择物料"
        :autoBack="true"
        :safeAreaInsetTop="true"
        :placeholder="true"
    />

<!--    rightText="新增物料"-->
<!--    @rightClick="handleAddProduct"-->
    <!-- 搜索栏 -->
    <view class="search-section">
      <view class="search-container">
        <u-search
            v-model="searchKeyword"
            placeholder="物料编码/物料名称/规格型号"
            :show-action="false"
            bg-color="#F8F8F8"
            border-color="#f1f2f7"
            placeholder-color="#C8C9CC"
            shape="square"
            @search="handleSearch"
            class="search-input"
        />
        <view class="scan-icon" @click="handleSearch">
          <up-text text="搜索"></up-text>
        </view>
      </view>
    </view>

    <!-- 主体内容区域 - 左侧分类 + 右侧商品 -->
    <view class="main-content">
      <!-- 左侧分类侧边栏 -->
      <scroll-view scroll-y class="left-sidebar">
        <view
            v-for="(item,index) in categoryList"
            :key="index"
            class="category-item"
            :class="{ active: activeCategory === index }"
            @click="handleCategoryChange(index)"
        >
          <text class="category-text">{{ item.itemTypeName }}</text>
          <view v-if="activeCategory === index" class="active-indicator"></view>
        </view>
      </scroll-view>

      <!-- 右侧商品列表 -->
      <scroll-view 
        scroll-y 
        class="right-product-list"
        refresher-enabled
        :refresher-triggered="refresherTriggered"
        :refresher-background="'#f1f2f7'"
        @refresherrefresh="handleRefresh"
        @scrolltolower="handleScrollToLower"
      >
        <!-- 加载状态 -->
        <view v-if="loading && products.length === 0" class="loading-container">
          <u-loading-icon size="28" text="加载中..."></u-loading-icon>
        </view>

        <!-- 空数据状态 -->
        <view v-else-if="products.length === 0" class="empty-container">
          <u-empty
              mode="data"
              text="暂无物料数据"
          >
          </u-empty>
        </view>

        <!-- 数据列表 -->
        <view v-else class="product-section">
          <u-cell-group :border="false">
            <u-cell
                v-for="product in products"
                :key="product.itemId"
                :border="false"
                class="product-cell"
            >
              <template #title>
                <view class="product-info">
                  <text>名称：{{ product.itemName }}</text>
                  <text>规格：{{ product.specification }}</text>
                  <text>编码：{{ product.itemCode }}</text>
                  <text>备注：{{ product.remark }}</text>
                </view>
              </template>

              <template #value>
                <u-button
                    size="mini"
                    :type="product.selected ? 'warning' : 'primary'"
                    :text="product.selected ? '取消' : '选择'"
                    @click="toggleProduct(product)"
                    customStyle="width: 120rpx; height: 56rpx;"
                />
              </template>
            </u-cell>
          </u-cell-group>
        </view>

        <!-- 加载更多状态 -->
        <view v-if="loadingMore" class="load-more-container">
          <u-loading-icon size="24" text="正在加载更多数据..."></u-loading-icon>
        </view>

        <!-- 没有更多数据提示 -->
        <view v-else-if="!hasMore && products.length > 0" class="no-more-container">
          <text class="no-more-text">已经到底了，没有更多数据了</text>
        </view>

        <!-- 还有更多数据提示 -->
        <view v-else-if="hasMore && products.length > 0" class="more-tips">
          <text class="more-text">继续上拉加载更多数据...</text>
        </view>
      </scroll-view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bottom-left">
        <text class="selected-count">共 {{ total }} 条</text>
      </view>
      <view class="bottom-right">
<!--        <u-button-->
<!--            type="primary"-->
<!--            text="选好了"-->
<!--            @click="handleConfirm"-->
<!--            customStyle="width: 180rpx; height: 70rpx; margin-left: 20rpx;"-->
<!--        />-->
      </view>
    </view>
  </view>
</template>

<script>
import {getMdItemTypeTree,listMdItem} from "@/api/md/mdItem";
import {bus} from "@/plugins";
export default {
  data() {
    return {
      searchKeyword: '',
      statusValue: '',
      activeCategory: 0,
      categoryList: {},
      products: [],
      // 搜索条件
      search: {
        searchValue: '',
        params: {}, // 分类树筛选参数
        queryParams: { // 高级筛选参数
          pageNum: 1,
          pageSize: 20
        }
      },
      total: 0,
      // 分页相关
      page: 1, // 当前页码
      pageSize: 20, // 每页大小
      loading: false, // 初始加载状态
      loadingMore: false, // 加载更多状态
      refresherTriggered: false, // 下拉刷新状态
    }
  },
  computed: {
    totalAmount() {
      return this.products
          .filter(item => item.selected)
          .reduce((sum, item) => sum + parseFloat(item.price), 0)
          .toFixed(2)
    },
    hasMore() {
      // 当没有数据时，不需要加载更多
      if (this.total === 0) return false
      // 当当前列表长度小于总数时，还有更多数据
      return this.products.length < this.total
    }
  },
  created() {
    this.getTreeSelect();
    this.loadItemList();
  },
  methods: {

    // 加载分类树数据
    async getTreeSelect() {
      try {
        const response = await getMdItemTypeTree({enableFlag:'Y'});
        const rootCategory = {
          itemTypeId: response.rows[0].itemTypeId,
          itemTypeName: response.rows[0].itemTypeName
        };
        const childrenCategories = (response.rows[0].children || []).map(child => ({
          itemTypeId: child.itemTypeId,
          itemTypeName: child.itemTypeName
        }));
        this.categoryList = [rootCategory, ...childrenCategories];
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
      if (this.page > 1) {
        this.loadingMore = true
      } else {
        this.loading = true
      }

      try {
        console.log(this.activeCategory)
        // 构建查询参数
        const params = {
          pageNum: this.page,
          pageSize: this.pageSize,
          ...this.search.params,
          searchValue: this.searchKeyword,
          enableFlag:'Y'
        };
        console.log('查询参数:', params)
        const res = await listMdItem(params);
        if (res.code === 200) {
          const newData = Array.isArray(res.rows) ? res.rows : []
          if (this.page === 1) {
            this.products = newData
          } else {
            this.products = [...this.products, ...newData]
          }
          this.total = Number(res.total) || 0;
        } else {
          uni.showToast({
            title: res.msg || '加载物料列表失败',
            icon: 'none'
          });
          if (this.page === 1) {
            this.products = [];
            this.total = 0;
          }
        }
      } catch (error) {
        console.error('加载物料列表失败:', error);
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
        if (this.page === 1) {
          this.products = [];
          this.total = 0;
        }
      } finally {
        this.loading = false
        this.loadingMore = false
        this.refresherTriggered = false
      }
    },

    handleAddProduct() {
      uni.navigateTo({
        url: '/pages/md/item/save'
      })
    },

    handleSearch() {
      console.log('搜索关键词:', this.searchKeyword)
      this.page = 1
      this.loadItemList();
    },

    handleStatusChange() {
      this.$refs.statusDropdown.close()
    },

    handleCategoryChange(index) {
      this.activeCategory = index
      if(index !==0){
      this.search.params.itemTypeId=this.categoryList[this.activeCategory].itemTypeId;
      }else{
        this.search.params.itemTypeId='';
      }
      this.page = 1
      this.loadItemList();
    },

    // 下拉刷新
    handleRefresh() {
      this.refresherTriggered = true
      this.page = 1
      this.loadItemList();
    },

    // 滚动到底部加载更多
    handleScrollToLower() {
      // 确保没有正在加载，并且还有更多数据
      if (this.loading || this.loadingMore || !this.hasMore) {
        return
      }

      this.page += 1
      this.loadItemList();
    },

    toggleProduct(product) {
      product.selected = !product.selected
      if (product.selected) {
        // 获取上一个页面实例
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage) {
          // 直接调用父页面的addSelectedProduct方法
          prevPage.$vm.addSelectedProduct(product)
          // 返回上一个页面
          setTimeout(() => {
            uni.navigateBack()
          }, 100)
        }
      }
    },

    handleConfirm() {
      const selectedProducts = this.products.filter(item => item.selected)
    },

  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.search-section {
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #f0f0f0;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.search-input {
  flex: 1;
}

.scan-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  cursor: pointer;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// 左侧分类侧边栏
.left-sidebar {
  width: 200rpx;
  background-color: #f1f2f7;

  .category-item {
    position: relative;
    padding: 30rpx 20rpx;
    text-align: center;
    border-bottom: 1rpx solid #eeeeee;

    .category-text {
      font-size: 28rpx;
      color: #333333;
    }

    &.active {
      background-color: #ffffff;

      .category-text {
        color: #2979ff;
        font-weight: bold;
      }

      .active-indicator {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 40rpx;
        background-color: #2979ff;
        border-radius: 0 3rpx 3rpx 0;
      }
    }
  }
}

// 右侧商品列表
.right-product-list {
  flex: 1;
  background-color: #ffffff;

  .product-section {
    padding: 5rpx;
  }

  .product-cell {
    padding: 5rpx 0;
    border-bottom: 1rpx solid #e4e4e4;
    .product-info {
      display: flex;
      flex-direction: column;
    }
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
}

// 底部操作栏
.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #ffffff;
  border-top: 1rpx solid #f0f0f0;

  .bottom-left {
    .selected-count {
      font-size: 28rpx;
      color: #666666;
    }
  }

  .bottom-right {
    display: flex;
    align-items: center;

    .total-amount {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
  }
}

.dropdown-content {
  padding: 20rpx;

  .u-radio-group {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }
}

</style>