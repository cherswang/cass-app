<template>
  <view class="container">
    <!-- 列表容器 -->
    <scroll-view
        class="list-scroll-container"
        scroll-y
        refresher-enabled
        :refresher-triggered="refresherTriggered"
        :refresher-background="'#f1f2f7'"
        @refresherrefresh="handleRefresh"
        @scrolltolower="handleLoadMore"
    >
      <!-- 加载中状态 -->
      <view v-if="loading && listData.length === 0" class="loading-container">
        <u-loading-icon size="28" text="加载中..."></u-loading-icon>
      </view>

      <!-- 空数据状态 -->
      <view v-else-if="listData.length === 0" class="empty-container">
        <u-empty
            mode="data"
            text="暂无点检任务项目记录"
        ></u-empty>
      </view>

      <!-- 列表内容 -->
      <view v-else class="list-content">
        <!-- 列表项 -->
        <view
            class="list-item"
            v-for="(item, index) in listData"
            :key="item.lineId + index"
        >
          <!-- 项目编码和名称 -->
          <view class="item-header">
            <view class="subject-code">
              <text class="label">项目编码：</text>
              <text class="value">{{ item.subjectCode || '-' }}</text>
            </view>
            <view class="subject-name">
              <text class="label">项目名称：</text>
              <text class="value">{{ item.subjectName || '-' }}</text>
            </view>
          </view>

          <!-- 项目详情 -->
          <view class="item-details">
            <!-- 项目类型 -->
            <view class="detail-row">
              <text class="label">项目类型：</text>
              <u-tag
                  :text="getDictLabel('mes_dvsubject_type', item.subjectType)"
                  type="primary"
                  size="mini"
                  class="dict-tag"
              ></u-tag>
            </view>

            <!-- 项目内容 -->
            <view class="detail-row">
              <text class="label">项目内容：</text>
              <text class="value">{{ item.subjectContent || '-' }}</text>
            </view>

            <!-- 标准 -->
            <view class="detail-row">
              <text class="label">标准：</text>
              <text class="value">{{ item.subjectStandard || '-' }}</text>
            </view>

            <!-- 结果 -->
            <view class="detail-row">
              <text class="label">结果：</text>
              <u-tag
                  :text="getDictLabel('equip_subject_result', item.subjectResult)"
                  :type="getResultTagType(item.subjectResult)"
                  size="mini"
                  class="dict-tag"
              ></u-tag>
            </view>

            <!-- 故障分类 -->
            <view class="detail-row">
              <text class="label">故障分类：</text>
              <u-tag
                  :text="getDictLabel('equip_is_fault', item.isFault)"
                  :type="item.isFault === '1' ? 'danger' : 'success'"
                  size="mini"
                  class="dict-tag"
              ></u-tag>
            </view>

            <!-- 故障描述 -->
            <view class="detail-row fault-desc">
              <text class="label">故障描述：</text>
              <text class="value">{{ item.treatmentMeasures || '-' }}</text>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="loadingMore" class="load-more-container">
          <u-loading-icon size="24" text="加载更多..."></u-loading-icon>
        </view>

        <!-- 没有更多数据 -->
        <view v-else-if="!hasMore && listData.length > 0" class="no-more-container">
          <text class="no-more-text">已经到底了，没有更多数据了</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {listCheckTaskSubject} from "@/api/equip/checkTaskSubject";

export default {
  name: "CheckTaskSubject",
  props: {
    taskCode: {
      type: [String, Number],
      default: ''
    },
    taskStatus: {
      type: [String, Number],
      default: undefined
    }
  },
  data() {
    return {
      // API对象
      apiObj: listCheckTaskSubject,
      // 任务ID
      taskId: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskId: null,
        taskCode: this.taskCode,
        subjectId: null,
        subjectCode: null,
        subjectName: null,
        subjectType: null,
        subjectContent: null,
        subjectStandard: null,
        subjectResult: null,
        isFault: null,
        treatmentMeasures: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
      },
      // 表单参数
      form: {},
      // 表单校验规则
      rules: {
        taskId: [
          { required: true, message: "任务ID不能为空", trigger: "blur" }
        ],
        subjectId: [
          { required: true, message: "项目ID不能为空", trigger: "blur" }
        ],
        subjectCode: [
          { required: true, message: "项目编码不能为空", trigger: "blur" }
        ],
        subjectContent: [
          { required: true, message: "项目内容不能为空", trigger: "blur" }
        ],
      },
      // 列表数据
      listData: [],
      // 加载状态
      loading: false,
      loadingMore: false,
      refresherTriggered: false,
      // 分页控制
      total: 0,
      // 字典数据（模拟，实际项目中请替换为真实的字典接口）
      dictData: {
        equip_subject_result: [],
        equip_is_fault: [],
        mes_dvsubject_type: []
      }
    };
  },

  computed: {
    // 是否还有更多数据
    hasMore() {
      return this.listData.length < this.total;
    }
  },

  watch: {
    // 监听taskCode变化，重新加载数据
    taskCode(newVal) {
      this.queryParams.taskCode = newVal;
      this.queryParams.pageNum = 1;
      this.fetchListData();
    }
  },

  onLoad() {
    // 初始化加载字典数据
    this.loadDictData();
    // 加载列表数据
    this.fetchListData();
  },

  methods: {
    // 加载字典数据
    loadDictData() {
      // 模拟加载字典数据（实际项目中请替换为真实的字典接口）
      // 这里使用模拟数据，你需要根据实际项目的字典接口进行替换
      this.dictData = {
        equip_subject_result: [
          { label: '合格', value: '01' },
          { label: '不合格', value: '02' },
          { label: '待确认', value: '03' }
        ],
        equip_is_fault: [
          { label: '无故障', value: '0' },
          { label: '有故障', value: '1' }
        ],
        mes_dvsubject_type: [
          { label: '日常点检', value: '01' },
          { label: '定期点检', value: '02' },
          { label: '专项点检', value: '03' }
        ]
      };
    },

    // 根据字典类型和值获取标签文本
    getDictLabel(dictType, value) {
      if (!value || !this.dictData[dictType]) return '-';
      const dictItem = this.dictData[dictType].find(item => item.value === value);
      return dictItem ? dictItem.label : '-';
    },

    // 根据结果值获取标签类型
    getResultTagType(resultValue) {
      switch (resultValue) {
        case '01': // 合格
          return 'success';
        case '02': // 不合格
          return 'danger';
        case '03': // 待确认
          return 'warning';
        default:
          return 'primary';
      }
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

          // 分页处理
          if (this.queryParams.pageNum === 1) {
            this.listData = newData;
          } else {
            this.listData = [...this.listData, ...newData];
          }
        } else {
          uni.showToast({
            title: res.msg || '获取数据失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取点检任务项目列表失败:', error);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: #f5f5f5;
}

.list-scroll-container {
  height: 100%;
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
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

// 列表项头部
.item-header {
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.subject-code, .subject-name {
  display: flex;
  margin-bottom: 10rpx;

  .label {
    font-size: 12px;
    color: #999;
    min-width: 80rpx;
  }

  .value {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    flex: 1;
  }
}

// 列表项详情
.item-details {
  .detail-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16rpx;

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

    .dict-tag {
      margin-left: 10rpx;
    }
  }

  .fault-desc {
    .value {
      word-break: break-all;
    }
  }
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
    padding: 20rpx;
  }
}
</style>