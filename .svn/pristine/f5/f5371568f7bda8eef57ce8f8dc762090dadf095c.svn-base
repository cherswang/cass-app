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
    <view class="item-form-popup">
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
            <!-- 物料编码选择 -->
            <u-form-item
                label="物料编码"
                prop="itemCode"
                borderBottom
            >
              <view class="code-selector">
                <u-input
                    v-model="form.itemCode"
                    placeholder="请选择物料编码"
                    disabled
                    readonly
                ></u-input>
                <u-button
                    type="primary"
                    size="mini"
                    icon="search"
                    @click="handleSelectProduct"
                    class="search-btn"
                ></u-button>
              </view>
            </u-form-item>

            <!-- 物料名称 -->
            <u-form-item
                label="物料名称"
                prop="itemName"
                borderBottom
            >
              <u-input
                  v-model="form.itemName"
                  disabled
                  readonly
                  placeholder="请先选择物料编码"
              ></u-input>
            </u-form-item>

            <!-- 规格型号 -->
            <u-form-item
                label="规格型号"
                prop="specification"
                borderBottom
            >
              <u-input
                  v-model="form.specification"
                  disabled
                  readonly
                  placeholder="无"
              ></u-input>
            </u-form-item>

            <!-- 材质 -->
            <u-form-item
                label="材质"
                prop="materialQuality"
                borderBottom
            >
              <u-input
                  v-model="form.materialQuality"
                  disabled
                  readonly
                  placeholder="无"
              ></u-input>
            </u-form-item>

            <!-- 单位 -->
            <u-form-item
                label="单位"
                prop="unitOfMeasure"
                borderBottom
            >
              <u-input
                  v-model="form.unitOfMeasure"
                  disabled
                  readonly
                  placeholder="无"
              ></u-input>
            </u-form-item>

            <!-- 物料类型 -->
            <u-form-item
                label="物料类型"
                prop="itemTypeName"
                borderBottom
            >
              <u-input
                  v-model="form.itemTypeName"
                  disabled
                  readonly
                  placeholder="无"
              ></u-input>
            </u-form-item>

            <!-- 需求数量 -->
            <u-form-item
                label="需求数量"
                prop="needNumber"
                borderBottom
            >
              <u-input
                  v-model="form.needNumber"
                  type="number"
                  placeholder="请输入需求数量"
                  :clearable="false"
              ></u-input>
            </u-form-item>

            <!-- 是否到货 -->
            <u-form-item
                label="是否到货"
                prop="isArrival"
                borderBottom
            >
              <u-select
                  v-model="form.isArrival"
                  :list="readyFlagList"
                  placeholder="请选择是否到货"
                  confirm-color="#2979FF"
              ></u-select>
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

  <!-- 物料选择弹窗 -->
<!--  <ItemSelect-->
<!--      v-if="dialog.save"-->
<!--      ref="itemSelect"-->
<!--      @onSelected="onItemSelected"-->
<!--      @closed="dialog.save = false"-->
<!--  ></ItemSelect>-->
</template>

<script>
import {updateRepairItem,addRepairItem} from "@/api/equip/repairItem";
// import ItemSelect from "@/components/itemSelect/single.vue";

export default {
  name: "ItemSave",
  // components: {
  //   ItemSelect
  // },
  emits: ['success', 'closed'],
  props: {
    repair: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 弹窗控制
      dialog: {
        save: false
      },
      // 表单校验规则
      rules: {
        itemId: [
          { required: true, message: "产品物料ID不能为空", trigger: "blur" }
        ],
        itemCode: [
          { required: true, message: "物料编码不能为空", trigger: "blur" }
        ],
        itemName: [
          { required: true, message: "物料名称不能为空", trigger: "blur" }
        ],
        repairId: [
          { required: true, message: "维修单ID不能为空", trigger: "blur" }
        ],
        repairCode: [
          { required: true, message: "维修单编号不能为空", trigger: "blur" }
        ],
        unitOfMeasure: [
          { required: true, message: "单位不能为空", trigger: "blur" }
        ],
        itemOrProduct: [
          { required: true, message: "产品物料标识不能为空", trigger: "blur" }
        ],
        needNumber: [
          { required: true, message: "需求数量不能为空", trigger: "blur" }
        ],
        isArrival: [
          { required: true, message: "请选择是否到货", trigger: "change" }
        ]
      },
      // 操作模式
      mode: "add",
      // 表单数据
      form: {
        repairItemId: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        repairId: this.repair.repairId || '',
        repairCode: this.repair.repairCode || '',
        repairName: this.repair.repairName || '',
        specification: null,
        unitOfMeasure: null,
        itemOrProduct: null,
        itemTypeId: null,
        itemTypeCode: null,
        itemTypeName: null,
        needNumber: null,
        isArrival: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        materialQuality: null,
        standard: null,
        unitPrice: null,
      },
      // 弹窗显示状态
      visible: false,
      // 表单滚动高度
      formScrollHeight: 400,
      // 是否到货字典列表
      readyFlagList: [
        { label: '已到货', value: '1' },
        { label: '未到货', value: '0' }
      ]
    };
  },

  computed: {
    // 弹窗标题
    popupTitle() {
      return this.mode === "add" ? "添加设备维修备料" : "修改设备维修备料";
    }
  },

  watch: {
    // 监听弹窗显示状态
    visible(newVal) {
      if (newVal) {
        this.calcFormHeight();
      }
    },
    // 监听repair属性变化
    repair: {
      deep: true,
      handler(newVal) {
        this.form.repairId = newVal.repairId || '';
        this.form.repairCode = newVal.repairCode || '';
        this.form.repairName = newVal.repairName || '';
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
        repairItemId: null,
        itemId: null,
        itemCode: null,
        itemName: null,
        repairId: this.repair.repairId || '',
        repairCode: this.repair.repairCode || '',
        repairName: this.repair.repairName || '',
        specification: null,
        unitOfMeasure: null,
        itemOrProduct: null,
        itemTypeId: null,
        itemTypeCode: null,
        itemTypeName: null,
        needNumber: null,
        isArrival: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        materialQuality: null,
        standard: null,
        unitPrice: null,
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
        if (this.form.repairItemId != null) {
          // 修改
          res = await updateRepairItem(this.form);
        } else {
          // 新增
          res = await addRepairItem(this.form);
        }

        if (res.code == 200) {
          uni.showToast({
            title: this.form.repairItemId != null ? "修改成功" : "新增成功",
            icon: "success"
          });

          this.visible = false;
          this.$emit('success', this.form, this.mode);
        } else {
          uni.showToast({
            title: res.msg || (this.form.repairItemId != null ? "修改失败" : "新增失败"),
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

    // 物料选择弹出框
    handleSelectProduct() {
      this.dialog.save = true;
      this.$nextTick(() => {
        if (this.$refs.itemSelect) {
          this.$refs.itemSelect.open();
        }
      });
    },

    // 物料选择弹出框回调
    onItemSelected(obj) {
      if (obj != undefined && obj != null) {
        this.form.itemId = obj.itemId;
        this.form.itemCode = obj.itemCode;
        this.form.itemName = obj.itemName;
        this.form.specification = obj.specification;
        this.form.unitOfMeasure = obj.unitOfMeasure;
        this.form.itemOrProduct = obj.itemOrProduct;
        this.form.itemTypeId = obj.itemTypeId;
        this.form.itemTypeCode = obj.itemTypeCode;
        this.form.itemTypeName = obj.itemTypeName;
        this.form.materialQuality = obj.materialQuality;
        this.form.standard = obj.standard;
        this.form.unitPrice = obj.unitPrice;

        // 清除物料编码的校验提示
        this.$refs.form.clearValidate('itemCode');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.item-form-popup {
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

// 物料编码选择器样式
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
  margin-bottom: 15rpx;
}

:deep(.u-input--disabled) {
  background-color: #f8f8f8;
  color: #666;
}
</style>