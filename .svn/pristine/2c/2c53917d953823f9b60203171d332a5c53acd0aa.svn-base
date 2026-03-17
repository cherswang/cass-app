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
    <view class="form-popup-container">
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
                :disabled="mode === 'show'"
                clearable
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
                :disabled="mode === 'show'"
                :rows="4"
                maxlength="-1"
            ></u-input>
          </u-form-item>

          <!-- 故障描述资源 -->
          <u-form-item
              label="故障描述资源"
              prop="malfunctionUrl"
              borderBottom
          >
            <!-- 查看模式 -->
            <view v-if="mode === 'show' && form.malfunctionUrl" class="resource-view">
              <text class="resource-url">{{ form.malfunctionUrl }}</text>
              <u-button
                  type="primary"
                  size="mini"
                  @click="downloadResource"
                  class="download-btn"
              >下载</u-button>
            </view>

            <!-- 编辑/新增模式 -->
            <u-input
                v-else
                type="textarea"
                v-model="form.malfunctionUrl"
                placeholder="请输入故障描述资源链接"
                :disabled="mode === 'show'"
                :rows="3"
                maxlength="-1"
            ></u-input>
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
                placeholder="请输入维修情况"
                :disabled="mode === 'show'"
                :rows="4"
                maxlength="-1"
            ></u-input>
          </u-form-item>

          <!-- 备注 -->
          <u-form-item
              label="备注"
              prop="remark"
              borderBottom
          >
            <u-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入备注信息"
                :disabled="mode === 'show'"
                :rows="2"
                maxlength="-1"
            ></u-input>
          </u-form-item>
        </u-form>
      </scroll-view>

      <!-- 弹窗底部操作按钮 -->
      <view class="popup-footer" v-if="mode !== 'show'">
        <u-button
            type="default"
            @click="cancel"
            class="cancel-btn"
        >取消</u-button>
        <u-button
            type="primary"
            @click="submitForm"
            :loading="isSaving"
            class="confirm-btn"
        >确定</u-button>
      </view>

      <!-- 查看模式底部 -->
      <view class="popup-footer" v-else>
        <u-button
            type="primary"
            @click="cancel"
            class="confirm-btn full-width"
        >关闭</u-button>
      </view>
    </view>
  </up-popup>
</template>

<script>
import {updateRepairline,addRepairline} from "@/api/equip/repairline";

export default {
  name: "LineSave",
  emits: ['success', 'closed'],
  props: {
    repairId: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      // 操作模式：add/edit/show
      mode: "add",
      // 弹窗标题映射
      titleMap: {
        add: '新增设备报修单行',
        edit: '编辑设备报修单行',
        show: '查看设备报修单行'
      },
      // 表单数据
      form: {
        lineId: null,
        repairId: this.repairId,
        subjectId: null,
        subjectCode: null,
        subjectName: null,
        subjectType: null,
        subjectContent: null,
        subjectStandard: null,
        malfunction: null,
        malfunctionUrl: null,
        repairDes: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      },
      // 表单校验规则
      rules: {
        malfunction: [
          { required: true, message: "故障描述不能为空", trigger: "blur" }
        ],
      },
      // 弹窗显示状态
      visible: false,
      // 保存中状态
      isSaving: false,
      // 表单滚动区域高度
      formScrollHeight: 400,
      // 数据列表
      dataList: []
    };
  },

  computed: {
    // 弹窗标题
    popupTitle() {
      return this.titleMap[this.mode] || '设备报修单行';
    }
  },

  watch: {
    // 监听repairId变化
    repairId(newVal) {
      this.form.repairId = newVal;
    },
    // 监听弹窗显示状态
    visible(newVal) {
      if (newVal) {
        // 弹窗打开时计算表单高度
        this.calcFormHeight();
      }
    }
  },

  mounted() {
    // 监听窗口大小变化，重新计算表单高度
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
    // 计算表单滚动区域高度
    calcFormHeight() {
      // 获取系统信息
      uni.getSystemInfo({
        success: (res) => {
          // 根据屏幕高度动态计算表单高度
          const screenHeight = res.windowHeight;
          // 留出头部、底部和间距的空间
          this.formScrollHeight = screenHeight * 0.6;
        }
      });
    },

    // 打开弹窗
    open(mode) {
      this.mode = mode || "add";
      this.visible = true;
      // 返回自身便于链式调用
      return this;
    },

    // 取消按钮
    cancel() {
      this.visible = false;
    },

    // 关闭弹窗处理
    handleClose() {
      this.visible = false;
      this.$emit('closed');
    },

    // 表单注入数据
    setData(data) {
      // 重置表单
      this.resetForm();
      // 赋值数据
      Object.assign(this.form, data);
    },

    // 重置表单
    resetForm() {
      this.form = {
        lineId: null,
        repairId: this.repairId,
        subjectId: null,
        subjectCode: null,
        subjectName: null,
        subjectType: null,
        subjectContent: null,
        subjectStandard: null,
        malfunction: null,
        malfunctionUrl: null,
        repairDes: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };

      // 重置表单校验
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    },

    /** 提交表单 */
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.isSaving = true;
          try {
            let response;
            // 判断是新增还是编辑
            if (this.form.lineId != null) {
              // 编辑
              response = await updateRepairline(this.form);
            } else {
              // 新增
              response = await addRepairline(this.form);
            }

            // 处理响应
            if (response.code === 200) {
              uni.showToast({
                title: this.form.lineId ? "修改成功" : "新增成功",
                icon: 'success'
              });
              this.visible = false;
              this.$emit('success', this.form, this.mode);
            } else {
              uni.showToast({
                title: response.message || (this.form.lineId ? "修改失败" : "新增失败"),
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('提交失败:', error);
            uni.showToast({
              title: this.form.lineId ? "修改失败" : "新增失败",
              icon: 'none'
            });
          } finally {
            this.isSaving = false;
          }
        }
      });
    },

    // 下载资源
    downloadResource() {
      if (!this.form.malfunctionUrl) {
        uni.showToast({ title: '暂无资源链接', icon: 'none' });
        return;
      }

      uni.showLoading({ title: '下载中...', mask: true });

      uni.downloadFile({
        url: this.form.malfunctionUrl,
        success: (res) => {
          uni.hideLoading();
          if (res.statusCode === 200) {
            // 保存文件
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: () => {
                uni.showToast({ title: '下载成功', icon: 'success' });
              },
              fail: () => {
                uni.showToast({ title: '保存文件失败', icon: 'none' });
              }
            });
          } else {
            uni.showToast({ title: '下载失败', icon: 'none' });
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({ title: '下载失败', icon: 'none' });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.form-popup-container {
  background: #fff;
  border-radius: 16rpx;
  width: 90vw;
  max-width: 700rpx;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  padding: 20rpx 30rpx;
}

:deep(.u-form-item) {
  margin-bottom: 20rpx;
}

:deep(.u-input__textarea) {
  padding: 10rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
}

// 资源查看样式
.resource-view {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 10rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
}

.resource-url {
  font-size: 12px;
  color: #666;
  word-break: break-all;
  line-height: 1.4;
}

.download-btn {
  align-self: flex-start;
  margin-top: 5rpx;
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

.full-width {
  width: 100%;
}

// 适配不同设备的表单高度
@media (max-height: 600px) {
  .form-scroll-container {
    height: 300px !important;
  }
}

@media (min-height: 800px) {
  .form-scroll-container {
    height: 500px !important;
  }
}
</style>