<template>
  <up-popup
      :show="visible"
      mode="center"
      :round="16"
      :closeable="false"
      :mask-close-able="false"
      :safe-area-inset-bottom="true"
      @close="handleClose"
  >
    <!-- 弹窗容器 -->
    <view class="user-select-popup">
      <!-- 弹窗头部 -->
      <view class="popup-header">
        <text class="popup-title">选择用户</text>
        <u-icon
            name="close"
            size="24"
            color="#666"
            @click="handleClose"
            class="close-icon"
        ></u-icon>
      </view>

      <!-- 表单内容 -->
      <view class="popup-content">
        <u-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="80rpx"
            label-position="left"
        >
          <u-form-item
              label="选择用户"
              prop="leaderId"
              borderBottom
          >
            <!-- 用户选择器 -->
            <u-select
                v-model="formData.leaderId"
                :list="userList"
                :loading="loading"
                :show-search="true"
                :clearabled="true"
                placeholder="请选择用户"
                label="nickName"
                value="userId"
                @change="handleSelectChange"
                @clear="handleSelectClear"
            >
              <!-- 自定义选项模板 -->
              <template #option="scope">
                <view class="user-info">
                  <text class="user-name">{{ scope.item.nickName }}</text>
                  <text class="user-department" v-if="scope.item.deptName">({{ scope.item.deptName }})</text>
                </view>
              </template>
            </u-select>
          </u-form-item>
        </u-form>
      </view>

      <!-- 弹窗底部按钮 -->
      <view class="popup-footer">
        <u-button
            type="default"
            @click="handleClose"
            :loading="confirmLoading"
            class="cancel-btn"
        >取消</u-button>
        <u-button
            type="primary"
            @click="handleConfirm"
            :loading="confirmLoading"
            class="confirm-btn"
        >确定</u-button>
      </view>
    </view>
  </up-popup>
</template>

<script>
import {list} from '@/api/system/user';

export default {
  name: 'AssignLeader',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单数据
      formData: {
        leaderId: ''
      },
      // 用户列表
      userList: [],
      // 加载状态
      loading: false,
      // 确认按钮加载状态
      confirmLoading: false,
      // 表单校验规则
      rules: {
        leaderId: [
          {
            required: true,
            message: '请选择用户',
            trigger: ['change', 'blur']
          }
        ]
      }
    };
  },
  watch: {
    // 监听弹窗显示状态
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.init();
        }
      }
    }
  },
  methods: {
    // 初始化
    async init() {
      // 重置表单
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate();
          this.formData.leaderId = '';
        }
      });

      // 加载用户列表
      await this.loadUserList();
    },

    // 加载用户列表
    async loadUserList() {
      this.loading = true;
      try {
        const res = await list();
        if (res.code === 200) {
          this.userList = res.rows || [];
        } else {
          uni.showToast({
            title: res.msg || '加载用户列表失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('加载用户列表失败:', error);
        uni.showToast({
          title: '加载用户列表失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },

    // 选择用户变化
    handleSelectChange(value) {
      this.formData.leaderId = value;
      // 清除表单校验提示
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate('leaderId');
      }
    },

    // 清空选择
    handleSelectClear() {
      this.formData.leaderId = '';
    },

    // 确认选择
    async handleConfirm() {
      this.confirmLoading = true;

      try {
        // 验证表单
        const valid = await this.$refs.formRef.validate();
        if (!valid) {
          return;
        }

        // 查找选中的用户
        const user = this.userList.find(user => user.userId === this.formData.leaderId);
        if (user) {
          this.$emit('ok', user);
          // 关闭弹窗
          this.handleClose();
        } else {
          uni.showToast({
            title: '未找到选中的用户信息',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('表单验证失败:', error);
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        });
      } finally {
        this.confirmLoading = false;
      }
    },

    // 关闭弹窗
    handleClose() {
      this.confirmLoading = false;
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.user-select-popup {
  background: #fff;
  border-radius: 16rpx;
  width: 90vw;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-icon {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
}

.popup-content {
  padding: 30rpx;
  flex: 1;
}

// 用户信息样式
.user-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10rpx 0;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.user-department {
  font-size: 12px;
  color: #909399;
  margin-top: 4rpx;
}

// 适配u-select的选项样式
:deep(.u-select__option) {
  padding: 10rpx 15rpx;
}

.popup-footer {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  gap: 20rpx;
}

.cancel-btn {
  flex: 1;
}

.confirm-btn {
  flex: 1;
}

// 适配不同屏幕尺寸
@media (max-width: 375px) {
  .user-select-popup {
    width: 95vw;
  }

  .popup-content {
    padding: 20rpx;
  }
}
</style>