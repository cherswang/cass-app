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
    <view class="repair-form-popup">
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
        <!-- 表单主内容 -->
        <view class="form-content">
          <u-form
              ref="form"
              :model="form"
              :rules="rules"
              label-width="100rpx"
              label-position="left"
          >
            <!-- 维修单编号和名称 -->
            <view class="form-row">
              <u-form-item
                  label="维修单编号"
                  prop="repairCode"
                  borderBottom
              >
                <u-input
                    v-model="form.repairCode"
                    placeholder="请输入维修单编号"
                    :disabled="mode === '修改设备维修单'"
                ></u-input>
              </u-form-item>

              <u-form-item
                  label="维修单名称"
                  prop="repairName"
                  borderBottom
              >
                <u-input
                    v-model="form.repairName"
                    placeholder="请输入维修单名称"
                    disabled
                ></u-input>
              </u-form-item>
            </view>

            <!-- 设备信息 -->
            <view class="form-row">
              <u-form-item
                  label="设备编号"
                  prop="machineryCode"
                  borderBottom
              >
                <view class="code-selector">
                  <u-input
                      v-model="form.machineryCode"
                      placeholder="请选择设备"
                      disabled
                      readonly
                  ></u-input>
                  <u-button
                      type="primary"
                      size="mini"
                      icon="search"
                      @click="handleMachineryAdd"
                      class="search-btn"
                  ></u-button>
                </view>
              </u-form-item>

              <u-form-item
                  label="设备名称"
                  prop="machineryName"
                  borderBottom
              >
                <u-input
                    v-model="form.machineryName"
                    placeholder="请选择设备"
                    disabled
                ></u-input>
              </u-form-item>

              <u-form-item
                  label="品牌"
                  prop="machineryBrand"
                  borderBottom
              >
                <u-input
                    v-model="form.machineryBrand"
                    placeholder="请选择设备"
                    disabled
                ></u-input>
              </u-form-item>
            </view>

            <!-- 报修来源和时间 -->
            <view class="form-row">
              <u-form-item
                  label="报修来源"
                  prop="reportRepairSource"
                  borderBottom
              >
                <u-select
                    v-model="form.reportRepairSource"
                    :list="reportRepairSourceList"
                    placeholder="请选择报修来源"
                    disabled
                    confirm-color="#2979FF"
                ></u-select>
              </u-form-item>

              <u-form-item
                  label="故障时间"
                  prop="faultTime"
                  borderBottom
              >
                <u-datetime-picker
                    v-model="form.faultTime"
                    mode="date"
                    placeholder="请选择故障日期"
                    disabled
                    @confirm="onDateConfirm('faultTime', $event)"
                ></u-datetime-picker>
              </u-form-item>

              <u-form-item
                  v-if="form.reportRepairSource && '01' != form.reportRepairSource"
                  label="报修来源编号"
                  prop="sourceNumber"
                  borderBottom
              >
                <u-input
                    v-model="form.sourceNumber"
                    placeholder="请输入来源编号"
                    disabled
                ></u-input>
              </u-form-item>
            </view>

            <!-- 日期信息 -->
            <view class="form-row">
              <u-form-item
                  label="报修日期"
                  prop="requireDate"
                  borderBottom
              >
                <u-datetime-picker
                    v-model="form.requireDate"
                    mode="date"
                    placeholder="请选择报修日期"
                    disabled
                    @confirm="onDateConfirm('requireDate', $event)"
                ></u-datetime-picker>
              </u-form-item>

              <u-form-item
                  v-if="form.status =='APPROVING' || form.status=='FINISHED' || form.status=='CONFIRMED' "
                  label="维修完成日期"
                  prop="finishDate"
                  borderBottom
              >
                <u-datetime-picker
                    v-model="form.finishDate"
                    mode="date"
                    placeholder="请选择维修完成日期"
                    @confirm="onDateConfirm('finishDate', $event)"
                ></u-datetime-picker>
              </u-form-item>

              <u-form-item
                  v-if="form.status=='FINISHED' || form.status=='CONFIRMED' "
                  label="验收日期"
                  prop="confirmDate"
                  borderBottom
              >
                <u-datetime-picker
                    v-model="form.confirmDate"
                    mode="date"
                    placeholder="请选择验收日期"
                    @confirm="onDateConfirm('confirmDate', $event)"
                ></u-datetime-picker>
              </u-form-item>
            </view>

            <!-- 维修结果和人员 -->
            <view class="form-row">
              <u-form-item
                  label="维修结果"
                  borderBottom
              >
                <u-radio-group
                    v-model="form.repairResult"
                    placement="column"
                >
                  <u-radio
                      v-for="dict in repairResultList"
                      :key="dict.value"
                      :label="dict.value"
                      :name="dict.value"
                  >
                    {{ dict.label }}
                  </u-radio>
                </u-radio-group>
              </u-form-item>

              <u-form-item
                  v-if="form.status =='APPROVING' || form.status=='FINISHED' || form.status=='CONFIRMED' "
                  label="维修人员"
                  prop="acceptedName"
                  borderBottom
              >
                <u-input
                    v-model="form.acceptedName"
                    readonly
                    placeholder="无"
                ></u-input>
              </u-form-item>

              <u-form-item
                  v-if="form.status=='FINISHED' || form.status=='CONFIRMED' "
                  label="验收人员"
                  prop="confirmName"
                  borderBottom
              >
                <u-input
                    v-model="form.confirmName"
                    readonly
                    placeholder="无"
                ></u-input>
              </u-form-item>
            </view>

            <!-- 备注 -->
            <u-form-item
                label="备注"
                prop="remark"
                borderBottom
            >
              <u-input
                  v-model="form.remark"
                  type="textarea"
                  placeholder="请输入内容"
                  :rows="4"
              ></u-input>
            </u-form-item>
          </u-form>

          <!-- 标签页内容（仅在有repairId时显示） -->
          <view v-if="form.repairId != null" class="tabs-container">
            <u-tabs
                v-model="activeTab"
                :list="tabList"
                :is-scroll="true"
                active-color="#2979FF"
                inactive-color="#666"
                height="80rpx"
                class="form-tabs"
            ></u-tabs>

            <!-- 报修内容 -->
            <view v-show="activeTab === 0" class="tab-content">
              <Repairline ref="line" :repairId="form.repairId"></Repairline>
            </view>

            <!-- 备件需求 -->
            <view v-show="activeTab === 1" class="tab-content">
              <repair-item ref="item" :repair="form"></repair-item>
            </view>

            <!-- 点检保养内容 -->
            <view
                v-show="activeTab === 2 && (form.reportRepairSource == '02' || form.reportRepairSource == '03')"
                class="tab-content"
            >
              <check-line ref="line" :taskCode="form.sourceNumber"></check-line>
            </view>
          </view>
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
            v-if="(form.status =='20' || form.status =='30')"
            @click="submitForm"
            class="submit-btn"
        >提交</u-button>

        <u-button
            type="primary"
            v-if="(form.status == '20' || form.status =='30')"
            @click="finish"
            class="finish-btn"
        >完成维修</u-button>
      </view>
    </view>
  </up-popup>

  <!-- 设备选择弹窗 -->
  <machinery-select
      v-if="dialog.save"
      ref="machinerySelect"
      @closed="dialog.save = false"
      @onSelected="onMachineryAdd"
  ></machinery-select>
</template>

<script>
import repairAPI from "@/api/equip/repair";
import Repairline from './line.vue';
import RepairItem from './item.vue';
import CheckLine from './report/checkLine.vue';
import machinerySelect from "../machinerySelect/index.vue";

export default {
  name: "RepairSave",
  components: {
    machinerySelect,
    Repairline,
    RepairItem,
    CheckLine
  },
  emits: ['success', 'closed'],
  data() {
    return {
      // 操作模式
      mode: "add",
      // 弹窗控制
      dialog: {
        save: false
      },
      // 表单参数
      form: {},
      // 表单校验规则
      rules: {
        repairCode: [
          { required: true, message: "维修单编号不能为空", trigger: "blur" }
        ],
        machineryId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
        machineryCode: [
          { required: true, message: "设备编码不能为空", trigger: "blur" }
        ],
        machineryName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        requireDate: [
          { required: true, message: "请选择报修日期", trigger: "blur" }
        ],
      },
      // 弹窗显示状态
      visible: false,
      // 表单滚动高度
      formScrollHeight: 500,
      // 激活的标签页
      activeTab: 0,
      // 标签页列表
      tabList: [
        { name: '报修内容' },
        { name: '备件需求' },
        { name: '点检保养内容' }
      ],
      // 报修来源字典列表
      reportRepairSourceList: [
        { label: '生产维修', value: '01' },
        { label: '点检维修', value: '02' },
        { label: '保养维修', value: '03' }
      ],
      // 维修结果字典列表
      repairResultList: [
        { label: '修复成功', value: 'SUCCESS' },
        { label: '报废', value: 'FAILURE' },
        { label: '待维修', value: 'PENDING' }
      ]
    };
  },

  computed: {
    // 弹窗标题
    popupTitle() {
      return this.mode === "add" ? "添加设备维修单" : "修改设备维修单";
    }
  },

  watch: {
    // 监听弹窗显示状态
    visible(newVal) {
      if (newVal) {
        this.calcFormHeight();
      }
    },
    // 监听报修来源变化，控制标签页显示
    'form.reportRepairSource'() {
      if (this.form.reportRepairSource == '02' || this.form.reportRepairSource == '03') {
        this.tabList[2].disabled = false;
      } else {
        this.tabList[2].disabled = true;
        if (this.activeTab === 2) {
          this.activeTab = 0;
        }
      }
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
          this.formScrollHeight = screenHeight * 0.7;
        }
      });
    },

    // 日期选择确认
    onDateConfirm(field, value) {
      this.form[field] = value;
    },

    // 打开弹窗
    open(mode) {
      this.mode = mode || "add";
      this.visible = true;
      this.activeTab = 0; // 默认选中第一个标签页
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
      this.form = {};
      // 赋值新数据
      Object.assign(this.form, data);

      // 初始化标签页状态
      if (data.reportRepairSource == '02' || data.reportRepairSource == '03') {
        this.tabList[2].disabled = false;
      } else {
        this.tabList[2].disabled = true;
      }
    },

    // 设备资源选择回调
    onMachineryAdd(row) {
      if (row) {
        this.form.machineryId = row.machineryId;
        this.form.machineryTypeId = row.machineryTypeId;
        this.form.machineryCode = row.machineryCode;
        this.form.machineryName = row.machineryName;
        this.form.machineryBrand = row.machineryBrand;

        // 清除设备编码的校验提示
        this.$refs.form.clearValidate('machineryCode');
      }
    },

    // 设备资源选择弹出
    handleMachineryAdd() {
      this.dialog.save = true;
      this.$nextTick(() => {
        if (this.$refs.machinerySelect) {
          this.$refs.machinerySelect.open();
        }
      });
    },

    // 完成维修
    async finish() {
      try {
        // 验证表单
        const valid = await this.$refs.form.validate();
        if (!valid) {
          return;
        }

        if (!this.form.repairResult) {
          uni.showToast({
            title: "请选择维修结果",
            icon: "none"
          });
          return;
        }

        if (this.form.repairId != null) {
          this.form.status = '40';
          // 提交数据
          const res = await repairAPI.updateRepair.put(this.form);

          if (res.code == 200) {
            uni.showToast({
              title: "保存成功",
              icon: "success"
            });
            this.visible = false;
            this.$emit('success', this.form, this.mode);
          } else {
            uni.showToast({
              title: res.msg || "保存失败",
              icon: "none"
            });
          }
        }
      } catch (error) {
        console.error('完成维修失败:', error);
        uni.showToast({
          title: '操作失败，请重试',
          icon: "none"
        });
      }
    },

    /** 提交按钮 */
    async submitForm() {
      try {
        // 验证表单
        const valid = await this.$refs.form.validate();
        if (!valid) {
          return;
        }

        let res;
        if (this.form.repairId != null) {
          // 修改
          this.form.status = '30';
          res = await repairAPI.updateRepair.put(this.form);
        } else {
          // 新增
          res = await repairAPI.addRepair.post(this.form);
        }

        if (res.code == 200) {
          uni.showToast({
            title: this.form.repairId != null ? "修改成功" : "新增成功",
            icon: "success"
          });
          this.visible = false;
          this.$emit('success', this.form, this.mode);
        } else {
          uni.showToast({
            title: res.msg || (this.form.repairId != null ? "修改失败" : "新增失败"),
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
    }
  }
};
</script>

<style lang="scss" scoped>
.repair-form-popup {
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

// 表单行样式
.form-row {
  margin-bottom: 10rpx;

  :deep(.u-form-item) {
    margin-bottom: 15rpx;
  }
}

// 设备编码选择器样式
.code-selector {
  display: flex;
  align-items: center;

  :deep(.u-input) {
    flex: 1;
  }

  .search-btn {
    margin-left: 10rpx;
    height: 60rpx;
    width: 60rpx;
    padding: 0;
  }
}

// 标签页容器
.tabs-container {
  margin-top: 30rpx;
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
}

.form-tabs {
  margin-bottom: 20rpx;
}

.tab-content {
  padding: 10rpx 0;
}

// 弹窗底部按钮样式
.popup-footer {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  gap: 15rpx;
  flex-wrap: wrap;
}

.cancel-btn, .submit-btn, .finish-btn {
  flex: 1;
  min-width: 120rpx;
}

// 适配不同设备
@media (max-height: 600px) {
  .form-scroll-container {
    height: 400px !important;
  }
}

@media (min-height: 800px) {
  .form-scroll-container {
    height: 600px !important;
  }
}

// 表单样式优化
:deep(.u-input--disabled) {
  background-color: #f8f8f8;
  color: #666;
}

:deep(.u-radio-group) {
  padding: 10rpx 0;
}

:deep(.u-radio) {
  margin-bottom: 10rpx;
}

:deep(.u-textarea) {
  padding: 10rpx;
}
</style>