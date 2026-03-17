<template>
  <up-popup
      :show="visible"
      mode="center"
      :round="16"
      :closeable="false"
      :mask-close-able="false"
      :safe-area-inset-bottom="true"
      @close="cancel"
  >
    <!-- 弹窗容器 -->
    <view class="line-form-popup">
      <!-- 弹窗头部 -->
      <view class="popup-header">
        <text class="popup-title">{{ popupTitle }}</text>
        <u-icon
            name="close"
            size="24"
            color="#666"
            @click="cancel"
            class="close-icon"
        ></u-icon>
      </view>

      <!-- 表单内容区域 -->
      <scroll-view
          class="form-scroll-container"
          scroll-y
          :style="{ height: formScrollHeight + 'px' }"
      >
        <!-- 表单内容 -->
        <view class="form-content">
          <u-form
              ref="form"
              :model="form"
              :rules="rules"
              label-width="100rpx"
              label-position="left"
          >
            <!-- 项目名称 -->
            <u-form-item
                label="项目名称"
                prop="subjectName"
                borderBottom
            >
              <u-input
                  v-model="form.subjectName"
                  placeholder="请输入项目名称"
                  :clearable="true"
              ></u-input>
            </u-form-item>

            <!-- 故障描述 -->
            <u-form-item
                label="故障描述"
                prop="malfunction"
                borderBottom
            >
              <u-input
                  v-model="form.malfunction"
                  type="textarea"
                  placeholder="请输入故障描述"
                  :rows="4"
                  :auto-height="true"
              ></u-input>
            </u-form-item>

            <!-- 故障描述资源 -->
            <u-form-item
                label="故障资源"
                prop="malfunctionUrl"
                borderBottom
            >
              <view class="resource-input-container">
                <u-input
                    v-model="form.malfunctionUrl"
                    type="textarea"
                    placeholder="请输入故障资源链接（多个链接用逗号分隔）"
                    :rows="3"
                    :auto-height="true"
                ></u-input>

                <!-- 资源预览/上传辅助按钮 -->
                <view class="resource-actions" v-if="form.malfunctionUrl">
                  <u-button
                      type="text"
                      size="mini"
                      @click="previewResource"
                      class="preview-btn"
                  >
                    预览资源
                  </u-button>
                </view>
              </view>
            </u-form-item>

            <!-- 维修情况 -->
            <u-form-item
                label="维修情况"
                prop="repairDes"
                borderBottom
            >
              <u-input
                  v-model="form.repairDes"
                  type="textarea"
                  placeholder="请输入维修情况描述"
                  :rows="4"
                  :auto-height="true"
              ></u-input>
            </u-form-item>
          </u-form>
        </view>
      </scroll-view>

      <!-- 弹窗底部操作按钮 -->
      <view class="popup-footer">
        <u-button
            type="default"
            @click="cancel"
            class="cancel-btn"
        >取消</u-button>
        <u-button
            type="primary"
            @click="submitForm"
            class="confirm-btn"
        >确定</u-button>
      </view>
    </view>
  </up-popup>
</template>

<script>
import repairLineAPI from "@/api/equip/repairline";

export default {
  name: "LineSave",
  emits: ['success', 'closed'],
  props: {
    repairId: {
      type: [String, Number, null],
      default: null
    }
  },
  data() {
    return {
      // 表单校验规则
      rules: {
        malfunction: [
          { required: true, message: "故障描述不能为空", trigger: "blur" }
        ],
        subjectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ]
      },
      // 操作模式
      mode: "add",
      // 表单数据
      form: {
        lineId: null,
        repairId: this.repairId,
        subjectName: '',
        malfunction: '',
        malfunctionUrl: '',
        repairDes: ''
      },
      // 弹窗显示状态
      visible: false,
      // 表单滚动高度
      formScrollHeight: 400
    };
  },

  computed: {
    // 弹窗标题
    popupTitle() {
      return this.mode === "add" ? "添加设备维修单行" : "修改设备维修单行";
    }
  },

  watch: {
    // 监听弹窗显示状态
    visible(newVal) {
      if (newVal) {
        this.calcFormHeight();
      }
    },
    // 监听repairId属性变化
    repairId(newVal) {
      this.form.repairId = newVal;
    }
  },

  mounted() {
    // 监听窗口大小变化
    uni.onWindowResize(() => {
      if (this.visible) {
        this.calcFormHeight();
      }
    });
  },

  beforeUnmount() {
    uni.offWindowResize();
  },

  methods: {
    // 计算表单滚动高度
    calcFormHeight() {
      uni.getSystemInfo({
        success: (res) => {
          // 根据屏幕高度动态计算表单高度
          const screenHeight = res.windowHeight;
          this.formScrollHeight = screenHeight * 0.6;
        }
      });
    },

    // 打开弹窗
    open(mode) {
      this.mode = mode || "add";
      this.visible = true;
      return this;
    },

    // 取消按钮
    cancel() {
      this.visible = false;
      this.$emit('closed');
    },

    // 表单注入数据
    setData(data) {
      // 清空原有数据
      this.form = {
        lineId: null,
        repairId: this.repairId,
        subjectName: '',
        malfunction: '',
        malfunctionUrl: '',
        repairDes: ''
      };

      // 赋值新数据
      Object.assign(this.form, data);
    },

    /** 提交按钮 */
    async submitForm() {
      try {
        // 验证表单
        const valid = await this.$refs.form.validate();
        if (!valid) {
          return;
        }

        // 提交数据
        let res;
        if (this.form.lineId != null) {
          // 修改
          res = await repairLineAPI.updateRepairline.put(this.form);
        } else {
          // 新增
          res = await repairLineAPI.addRepairline.post(this.form);
        }

        if (res.code == 200) {
          uni.showToast({
            title: this.form.lineId != null ? "修改成功" : "新增成功",
            icon: "success"
          });

          this.visible = false;
          this.$emit('success', this.form, this.mode);
        } else {
          uni.showToast({
            title: res.msg || (this.form.lineId != null ? "修改失败" : "新增失败"),
            icon: "none"
          });
        }
      } catch (error) {
        console.error('提交失败:', error);
        uni.showToast({
          title: '提交失败，请重试',
          icon: "none"
        });
      }
    },

    /** 预览故障资源 */
    previewResource() {
      if (!this.form.malfunctionUrl) return;

      // 处理多个链接的情况（逗号分隔）
      const urls = this.form.malfunctionUrl.split(',').map(url => url.trim()).filter(url => url);

      if (urls.length === 0) {
        uni.showToast({
          title: '暂无有效资源链接',
          icon: 'none'
        });
        return;
      }

      // 筛选图片链接进行预览
      const imageUrls = urls.filter(url => /\.(jpg|jpeg|png|gif|bmp)$/i.test(url));

      if (imageUrls.length > 0) {
        // 预览图片
        uni.previewImage({
          urls: imageUrls,
          current: imageUrls[0]
        });
      } else {
        // 非图片资源提示
        uni.showModal({
          title: '提示',
          content: '当前资源不是图片格式，无法预览',
          showCancel: false
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.line-form-popup {
  background: #fff;
  border-radius: 16rpx;
  width: 90vw;
  max-width: 700rpx;
  max-height: 90vh;
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

.form-scroll-container {
  flex: 1;
  padding: 10rpx 0;
}

.form-content {
  padding: 0 30rpx;
}

// 资源输入容器样式
.resource-input-container {
  width: 100%;

  .resource-actions {
    margin-top: 10rpx;
    display: flex;
    justify-content: flex-end;

    .preview-btn {
      color: #2979FF;
      padding: 0;
    }
  }
}

// 弹窗底部按钮样式
.popup-footer {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  gap: 20rpx;
}

.cancel-btn, .confirm-btn {
  flex: 1;
}

// 适配不同设备
@media (max-height: 600px) {
  .form-scroll-container {
    height: 350px !important;
  }
}

@media (min-height: 800px) {
  .form-scroll-container {
    height: 500px !important;
  }
}

// 表单项样式
:deep(.u-form-item) {
  margin-bottom: 20rpx;
}

:deep(.u-input__textarea) {
  padding: 10rpx;
  line-height: 1.5;
}
</style>