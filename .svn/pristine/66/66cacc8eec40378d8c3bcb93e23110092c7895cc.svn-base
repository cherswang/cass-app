<template>
  <up-popup
      :show="visible"
      mode="center"
      :round="16"
      :closeable="true"
      :safe-area-inset-bottom="true"
      @close="cancel"
      class="task-detail-popup"
  >
    <!-- 弹窗头部 -->
    <view class="popup-header">
      <text class="popup-title">{{ modeMap[mode] || mode }}</text>
    </view>

    <scroll-view id="popupContent" ref="popupContent" class="popup-content" scroll-y>
      <!-- 基本信息表单 -->
      <view class="form-container">
        <view class="form-row">
          <text class="form-label">任务编码</text>
          <text class="form-value">{{ form.taskCode || '-' }}</text>
        </view>
        <view class="form-row">
          <text class="form-label">计划编码</text>
          <text class="form-value">{{ form.planCode || '-' }}</text>
        </view>
        <view class="form-row">
          <text class="form-label">计划名称</text>
          <text class="form-value">{{ form.planName || '-' }}</text>
        </view>
        <view class="form-row">
          <text class="form-label">计划类型</text>
          <u-tag
              :text="getPlanTypeText(form.planType)"
              :type="getPlanTypeTagType(form.planType)"
              size="mini"
              class="form-tag"
          />
        </view>
        <view class="form-row">
          <text class="form-label">设备编码</text>
          <text class="form-value">{{ form.machineryCode || '-' }}</text>
        </view>
        <view class="form-row">
          <text class="form-label">设备名称</text>
          <text class="form-value">{{ form.machineryName || '-' }}</text>
        </view>
        <view class="form-row">
          <text class="form-label">品牌</text>
          <text class="form-value">{{ form.machineryBrand || '-' }}</text>
        </view>
        <view class="form-row">
          <text class="form-label">规格型号</text>
          <text class="form-value">{{ form.machinerySpec || '-' }}</text>
        </view>
      </view>

      <!-- 任务内容分割线 -->
      <u-divider content-text="任务项目内容" v-if="form.taskId != null" class="content-divider"></u-divider>

      <view v-if="form.taskId != null" class="task-content">
        <view class="product-cards" v-if="subjectList.length > 0">
          <view class="product-card" v-for="(item, index) in subjectList" :key="item.taskSubId || index">
            <view class="card-header">
              <text class="card-title">{{ item.subjectName || '未命名项目' }}</text>
            </view>
            <view class="card-content">
              <view class="info-row">
                <text class="label">项目编码：</text>
                <text class="value">{{item.subjectCode || '-'}}</text>
              </view>
              <view class="info-row">
                <text class="label">项目类型：</text>
                <text class="value">{{item.subjectType || '-'}}</text>
              </view>
              <view class="info-row">
                <text class="label">项目内容：</text>
                <text class="value">{{item.subjectContent || '-'}}</text>
              </view>
              <view class="info-row">
                <text class="label">标准：</text>
                <text class="value">{{item.subjectStandard || '-'}}</text>
              </view>
              <view class="info-row">
                <text class="label">结果：</text>
                <view class="input-wrapper">
                  <view class="custom-select disabled">
                    <text class="select-value">{{ item.subjectResult === '0' ? '正常' : item.subjectResult === '1' ? '异常' : '-' }}</text>
                  </view>
                </view>
              </view>
              <view class="info-row" v-if="item.treatmentMeasures">
                <text class="label">故障描述：</text>
                <text class="value">{{item.treatmentMeasures || '-'}}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 空数据状态 -->
        <view v-if="subjectList.length === 0" class="empty-state">
          <text class="empty-text">暂无任务项目</text>
        </view>
      </view>
    </scroll-view>

    <view class="popup-footer">
      <u-button type="default" size="small" @click="cancel" class="footer-btn">取 消</u-button>
    </view>
  </up-popup>
</template>

<script>
import { listCheckTaskSubject } from "@/api/equip/checkTaskSubject";

export default {
  name: "TaskDetailView",
  emits: ['closed'],
  data() {
    return {
      visible: false,
      mode: "add",
      modeMap: {
        add: '新增设备',
        edit: '编辑设备',
        show: '查看设备'
      },
      form: {},
      subjectList: [],
      planTypeDict: {
        'CHECK': { label: '点检计划', type: 'primary' },
        'MAINTEN': { label: '保养计划', type: 'success' }
      }
    };
  },

  watch: {
    'form.taskId': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchSubjectList();
        } else {
          this.subjectList = [];
        }
      }
    }
  },

  methods: {
    // 获取计划类型文本
    getPlanTypeText(planType) {
      return this.planTypeDict[planType]?.label || '未知类型';
    },

    // 获取计划类型标签样式
    getPlanTypeTagType(planType) {
      return this.planTypeDict[planType]?.type || 'info';
    },

    async fetchSubjectList() {
      try {
        const params = {
          taskId: this.form.taskId,
          pageNum: 1,
          pageSize: 100
        };
        const res = await listCheckTaskSubject(params);
        if (res.code === 200) {
          this.subjectList = (res.rows || []).map(item => ({
            ...item,
            subjectResult: item.subjectResult || '',
            treatmentMeasures: item.treatmentMeasures || ''
          }));
        }
      } catch (error) {
        console.error('加载任务项目失败:', error);
        uni.showToast({ title: '加载项目失败', icon: 'none' });
      }
    },

    // 打开弹窗
    open(mode) {
      this.mode = mode;
      this.visible = true;
      return this;
    },

    cancel() {
      try {
        uni.createSelectorQuery().in(this).select('#popupContent').scrollTo({
          scrollTop: 0,
          duration: 0
        });
      } catch (e) {
        console.log('滚动重置失败:', e);
      }
      this.visible = false;
      setTimeout(() => {
        this.$emit('closed');
      }, 200);
    },

    setData(data) {
      Object.assign(this.form, data);
    }
  }
};
</script>

<style lang="scss" scoped>
.task-detail-popup {
  width: 90vw !important;
  max-width: 700rpx !important;
  border-radius: 16rpx;
}

.popup-header {
  padding: 30rpx 30rpx 20rpx;
  text-align: center;
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.popup-content {
  max-height: 70vh;
  padding: 30rpx;
  width: 100%;
  z-index: 10;
}

.form-container {
  background-color: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.form-row {
  display: flex;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }

  .form-label {
    width: 140rpx;
    font-size: 14px;
    color: #666;
    flex-shrink: 0;
  }

  .form-value {
    flex: 1;
    font-size: 14px;
    color: #333;
    word-break: break-all;
  }

  .form-tag {
    flex: 1;
  }
}

.content-divider {
  margin: 30rpx 0;

  ::v-deep .u-divider__content {
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }
}

.task-content {
  width: 100%;
}

.product-cards {
  margin-top: 30rpx;
}

.product-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .card-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .card-content {
    .info-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 140rpx;
        font-size: 28rpx;
        color: #666;
        flex-shrink: 0;
        padding-top: 2rpx;
      }

      .value {
        font-size: 28rpx;
        color: #333;
        flex: 1;
        word-break: break-all;
      }

      .input-wrapper {
        display: flex;
        align-items: center;
        flex: 1;
      }

      .custom-select.disabled {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 60rpx;
        border: 0.5px solid #e8e8e8;
        border-radius: 6rpx;
        padding: 0 10rpx;
        font-size: 28rpx;
        color: #333;
        background-color: #f5f5f5;
        width: 100%;
        cursor: default;
      }
    }
  }
}

.empty-state {
  margin-top: 100rpx;
  text-align: center;

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.popup-footer {
  display: flex;
  justify-content: center;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}


.footer-btn {
  font-size: 16px;
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #f5f5f5 !important;
  color: #333 !important;
  border-color: #e0e0e0 !important;
  &:active {
    background-color: #e9e9e9 !important;
  }
}
</style>