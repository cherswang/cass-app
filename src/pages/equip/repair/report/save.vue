<template>
  <!-- 页面容器 - 替代原弹窗容器 -->
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <view class="page-header">
      <!-- 移除返回按钮 -->
      <view class="header-left"></view>
      <text class="page-title">{{ pageTitle }}</text>
      <view class="header-right" @click="handleClose">
        <u-icon name="close" size="24" color="#333"></u-icon>
      </view>
    </view>

    <!-- 主要内容区域 - 滚动容器 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="content">
        <!-- 报修单编号和名称 -->
        <view class="form-row" :class="{ disabled: mode === 'show' }">
          <text class="label">报修单编号</text>
          <view class="value-section">
            <u-input
                v-model="form.repairCode"
                :disabled="mode === '编辑设备报修单' || mode === 'show'"
                placeholder="请输入报修单编号"
                clearable
                class="form-input"
            ></u-input>
          </view>
        </view>

        <view class="form-row" :class="{ disabled: mode === 'show' }">
          <text class="label">报修单名称</text>
          <view class="value-section">
            <u-input
                v-model="form.repairName"
                :disabled="mode === 'show'"
                placeholder="请输入报修单名称"
                clearable
                class="form-input"
            ></u-input>
          </view>
        </view>

        <!-- 设备信息 -->
        <view class="form-row" :class="{ disabled: true }">
          <text class="label">设备编号</text>
          <view class="value-section">
            <text class="value">{{ form.machineryCode || '暂无' }}</text>
          </view>
        </view>

        <view class="form-row" :class="{ disabled: true }">
          <text class="label">设备名称</text>
          <view class="value-section">
            <text class="value">{{ form.machineryName || '暂无' }}</text>
          </view>
        </view>

        <view class="form-row" :class="{ disabled: true }">
          <text class="label">品牌</text>
          <view class="value-section">
            <text class="value">{{ form.machineryBrand || '暂无' }}</text>
          </view>
        </view>

        <!-- 报修来源 -->
        <view class="form-row" @click="mode !== 'show' && openReportRepairSourceActionSheet()" :class="{ disabled: mode === 'show' }">
          <text class="label">报修来源</text>
          <view class="value-section">
            <text class="value">{{ getReportRepairSourceLabel(form.reportRepairSource) || '请选择报修来源' }}</text>
            <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'show'"></u-icon>
          </view>
        </view>

        <!-- 故障时间 -->
        <view class="form-row" :class="{ disabled: mode === 'show' }">
          <text class="label">故障时间</text>
          <view class="value-section">
            <picker
                v-if="mode !== 'show'"
                mode="date"
                :value="formatDate(form.faultTime)"
                @change="handleDateChange('faultTime', $event)"
                class="value-picker"
            >
              <view class="value">{{ formatDate(form.faultTime) || '请选择故障日期' }}</view>
            </picker>
            <text v-else class="value">{{ formatDate(form.faultTime) || '暂无故障日期' }}</text>
            <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'show'"></u-icon>
          </view>
        </view>

        <!-- 报修日期 -->
        <view class="form-row" :class="{ disabled: mode === 'show' }">
          <text class="label">报修日期</text>
          <view class="value-section">
            <picker
                v-if="mode !== 'show'"
                mode="date"
                :value="formatDate(form.requireDate)"
                @change="handleDateChange('requireDate', $event)"
                class="value-picker"
            >
              <view class="value">{{ formatDate(form.requireDate) || '请选择报修日期' }}</view>
            </picker>
            <text v-else class="value">{{ formatDate(form.requireDate) || '暂无报修日期' }}</text>
            <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'show'"></u-icon>
          </view>
        </view>

        <!-- 维修完成日期 -->
        <view v-if="['APPROVING', 'FINISHED', 'CONFIRMED'].includes(form.status)" class="form-row" :class="{ disabled: mode === 'show' }">
          <text class="label">维修完成日期</text>
          <view class="value-section">
            <picker
                v-if="mode !== 'show'"
                mode="date"
                :value="formatDate(form.finishDate)"
                @change="handleDateChange('finishDate', $event)"
                class="value-picker"
            >
              <view class="value">{{ formatDate(form.finishDate) || '请选择维修完成日期' }}</view>
            </picker>
            <text v-else class="value">{{ formatDate(form.finishDate) || '暂无维修完成日期' }}</text>
            <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'show'"></u-icon>
          </view>
        </view>

        <!-- 验收日期 -->
        <view v-if="['FINISHED', 'CONFIRMED'].includes(form.status)" class="form-row" :class="{ disabled: mode === 'show' }">
          <text class="label">验收日期</text>
          <view class="value-section">
            <picker
                v-if="mode !== 'show'"
                mode="date"
                :value="formatDate(form.confirmDate)"
                @change="handleDateChange('confirmDate', $event)"
                class="value-picker"
            >
              <view class="value">{{ formatDate(form.confirmDate) || '请选择验收日期' }}</view>
            </picker>
            <text v-else class="value">{{ formatDate(form.confirmDate) || '暂无验收日期' }}</text>
            <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'show'"></u-icon>
          </view>
        </view>

        <!-- 维修结果 -->
        <view v-if="['APPROVING', 'FINISHED', 'CONFIRMED'].includes(form.status)" class="form-row" @click="mode !== 'show' && openRepairResultActionSheet()" :class="{ disabled: mode === 'show' }">
          <text class="label">维修结果</text>
          <view class="value-section">
            <text class="value">{{ getRepairResultLabel(form.repairResult) || '请选择维修结果' }}</text>
            <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'show'"></u-icon>
          </view>
        </view>

        <!-- 维修人员 -->
        <view v-if="['APPROVING', 'FINISHED', 'CONFIRMED'].includes(form.status)" class="form-row" :class="{ disabled: true }">
          <text class="label">维修人员</text>
          <view class="value-section">
            <text class="value">{{ form.acceptedName || '系统自动填充' }}</text>
          </view>
        </view>

        <!-- 验收人员 -->
        <view v-if="['FINISHED', 'CONFIRMED'].includes(form.status)" class="form-row" :class="{ disabled: true }">
          <text class="label">验收人员</text>
          <view class="value-section">
            <text class="value">{{ form.confirmName || '系统自动填充' }}</text>
          </view>
        </view>

        <!-- 备注 -->
        <view class="form-row" :class="{ disabled: mode === 'show' }">
          <text class="label">备注</text>
          <view class="value-section">
            <u-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入备注内容"
                :disabled="mode === 'show'"
                class="textarea-input"
                :rows="4"
                maxlength="-1"
            ></u-input>
          </view>
        </view>

        <!-- 标签页内容 (仅编辑/查看模式显示) -->
        <view v-if="form.repairId != null" class="tabs-container">
          <view class="custom-tabs">
            <view
                v-for="(item, index) in tabsList"
                :key="index"
                class="custom-tab-item"
                :class="{ active: currentTab === index }"
                @click="handleTabChange(index)"
            >
              <text class="tab-text" :style="{ color: currentTab === index ? '#2979FF' : '#666' }">
                {{ item.name }}
              </text>
              <view class="tab-underline" v-if="currentTab === index"></view>
            </view>
          </view>

          <!-- 报修内容 -->
          <view v-show="currentTab === 0" class="tab-content-card">
            <!-- 新增按钮（仅非查看模式显示） -->
            <view class="button-row" v-if="mode !== 'show'">
              <view class="action-btn" @click="handleAddRepairLine">
                <u-icon name="plus" size="20" color="#333"></u-icon>
                <text class="btn-text">添加报修内容</text>
              </view>
            </view>
            <!-- 报修内容列表 -->
            <Repairline ref="line" :repairId="form.repairId"></Repairline>
          </view>

          <!-- 点检保养内容 -->
          <view v-show="currentTab === 1 && ['02', '03'].includes(form.reportRepairSource)" class="tab-content-card">
            <CheckLine ref="checkLine" :taskCode="form.sourceNumber"></CheckLine>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作按钮 -->
    <view class="bottom-bar" v-if="form.status === '10' && mode !== 'show'">
      <!-- 移除取消按钮 -->
      <view class="save-btn full-width" @click="submitForm" :class="{ loading: isSaving }">
        <u-icon name="spinner" size="20" v-if="isSaving"></u-icon>
        <text v-else>保 存</text>
      </view>
    </view>

    <!-- 仅查看模式底部 -->
    <view class="bottom-bar" v-else>
      <view class="save-btn full-width" @click="handleClose">
        <text>关 闭</text>
      </view>
    </view>

    <!-- 设备选择弹窗 -->
    <machinerySelect
        v-if="dialog.save"
        ref="machinerySelect"
        @closed="dialog.save = false"
        @onSelected="onMachineryAdd"
    ></machinerySelect>
  </view>
</template>

<script>
import { updateRepair, addRepair } from "@/api/equip/repair";
import Repairline from "./line.vue";
import CheckLine from "./checkLine.vue";
import machinerySelect from "../../machinerySelect/index.vue";

export default {
  name: "RepairFormPage",
  components: {
    Repairline,
    CheckLine,
    machinerySelect
  },
  onLoad(options) {
    // 页面加载时获取参数
    if (options.mode) {
      this.mode = options.mode;
    }
    if (options.data) {
      try {
        // 解析传递的表单数据
        const formData = JSON.parse(decodeURIComponent(options.data));
        this.setData(formData);
      } catch (e) {
        console.error('解析表单数据失败:', e);
      }
    }
    // 加载字典数据
    this.loadDictData();
  },
  data() {
    return {
      // 操作模式
      mode: "add",
      // 弹窗控制
      dialog: {
        save: false
      },
      // 页面标题映射
      titleMap: {
        add: '新增设备报修单',
        edit: '编辑设备报修单',
        show: '查看设备报修单'
      },
      // 表单数据
      form: {
        repairId: null,
        repairCode: null,
        repairName: null,
        machineryId: null,
        machineryCode: null,
        machineryName: null,
        machineryBrand: null,
        machinerySpec: null,
        machineryTypeId: null,
        requireDate: new Date(),
        finishDate: null,
        confirmDate: null,
        repairResult: "",
        acceptedBy: null,
        confirmBy: null,
        status: '10',
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        reportRepairSource: null,
        faultTime: new Date(),
        faultType: null,
        faultDescribe: null,
        orgCode: null,
        orgName: null,
        sourceNumber: null,
        repairType: null,
        reportBy: null,
        reportUsername: null,
      },
      // 保存中状态
      isSaving: false,
      // 标签页配置
      tabsList: [
        {
          name: '报修内容',
          icon: 'document'
        },
        {
          name: '点检保养内容',
          icon: 'list'
        }
      ],
      // 当前选中标签页
      currentTab: 0,
      // 报修来源字典列表
      reportRepairSourceList: [],
      // 维修结果字典列表
      repairResultList: []
    };
  },

  computed: {
    // 页面标题
    pageTitle() {
      return this.titleMap[this.mode] || '设备报修单';
    }
  },

  watch: {
    // 监听报修来源变化
    'form.reportRepairSource'(newVal) {
      // 切换标签页时重置到第一个标签
      this.currentTab = 0;
      // 报修来源变化时清空来源编号（01不需要来源编号）
      if (newVal === '01') {
        this.form.sourceNumber = null;
      }
    }
  },

  methods: {
    // 格式化日期
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    // 加载字典数据
    loadDictData() {
      // 模拟加载字典数据（实际项目中请替换为真实的字典接口）
      // 报修来源
      this.reportRepairSourceList = (this.dict && this.dict.type && this.dict.type.mes_report_repair_source) || [
        { label: '手动报修', value: '01' },
        { label: '点检报修', value: '02' },
        { label: '保养报修', value: '03' }
      ];

      // 维修结果
      this.repairResultList = (this.dict && this.dict.type && this.dict.type.mes_repair_result) || [
        { label: '维修成功', value: '01' },
        { label: '维修失败', value: '02' },
        { label: '待维修', value: '03' }
      ];
    },

    // 打开报修来源选择
    openReportRepairSourceActionSheet() {
      const itemList = this.reportRepairSourceList.map(item => item.label);
      uni.showActionSheet({
        itemList,
        success: (res) => {
          const selectedItem = this.reportRepairSourceList[res.tapIndex];
          this.form.reportRepairSource = selectedItem.value;
        }
      });
    },

    // 获取报修来源标签
    getReportRepairSourceLabel(value) {
      if (!value) return '';
      const item = this.reportRepairSourceList.find(i => i.value === value);
      return item ? item.label : '';
    },

    // 打开维修结果选择
    openRepairResultActionSheet() {
      const itemList = this.repairResultList.map(item => item.label);
      uni.showActionSheet({
        itemList,
        success: (res) => {
          const selectedItem = this.repairResultList[res.tapIndex];
          this.form.repairResult = selectedItem.value;
        }
      });
    },

    // 获取维修结果标签
    getRepairResultLabel(value) {
      if (!value) return '';
      const item = this.repairResultList.find(i => i.value === value);
      return item ? item.label : '';
    },

    // 日期选择处理
    handleDateChange(field, e) {
      this.form[field] = new Date(e.detail.value);
    },

    // 表单注入数据
    setData(data) {
      // 重置表单
      this.resetForm();
      // 赋值数据
      Object.assign(this.form, data);
      // 格式化日期
      if (data.requireDate) this.form.requireDate = new Date(data.requireDate);
      if (data.faultTime) this.form.faultTime = new Date(data.faultTime);
      if (data.finishDate) this.form.finishDate = new Date(data.finishDate);
      if (data.confirmDate) this.form.confirmDate = new Date(data.confirmDate);
    },

    // 重置表单
    resetForm() {
      this.form = {
        repairId: null,
        repairCode: null,
        repairName: null,
        machineryId: null,
        machineryCode: null,
        machineryName: null,
        machineryBrand: null,
        machinerySpec: null,
        machineryTypeId: null,
        requireDate: new Date(),
        finishDate: null,
        confirmDate: null,
        repairResult: "",
        acceptedBy: null,
        confirmBy: null,
        status: '10',
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        reportRepairSource: null,
        faultTime: new Date(),
        faultType: null,
        faultDescribe: null,
        orgCode: null,
        orgName: null,
        sourceNumber: null,
        repairType: null,
        reportBy: null,
        reportUsername: null,
      };
    },

    // 设备选择弹窗
    handleMachineryAdd() {
      this.dialog.save = true;
      this.$nextTick(() => {
        if (this.$refs.machinerySelect) {
          this.$refs.machinerySelect.open();
        }
      });
    },

    // 设备选择回调
    onMachineryAdd(row) {
      // 确保 row 是一个数组并且长度为 1
      if (Array.isArray(row) && row.length !== 1) {
        return uni.showToast({
          title: "只能选择一条,请重新选择",
          icon: 'none'
        });
      }

      const selectedRow = row[0];
      this.form.machineryId = selectedRow.machineryId;
      this.form.machineryTypeId = selectedRow.machineryTypeId;
      this.form.machineryCode = selectedRow.machineryCode;
      this.form.machineryName = selectedRow.machineryName;
      this.form.machineryBrand = selectedRow.machineryBrand;
    },

    // 标签页切换
    handleTabChange(index) {
      this.currentTab = index;
    },

    // 添加报修内容行
    handleAddRepairLine() {
      if (this.$refs.line) {
        this.$refs.line.handleAdd();
      }
    },

    // 表单校验
    validateForm() {
      const errors = [];
      if (!this.form.repairCode) errors.push('报修单编号不能为空');
      if (!this.form.repairName) errors.push('报修单名称不能为空');
      if (!this.form.machineryCode) errors.push('请选择设备');
      if (!this.form.reportRepairSource) errors.push('请选择报修来源');
      if (!this.form.faultTime) errors.push('请选择故障时间');
      if (!this.form.requireDate) errors.push('请选择报修日期');
      return errors;
    },

    // 提交表单
    async submitForm() {
      // 手动校验表单
      const errors = this.validateForm();
      if (errors.length > 0) {
        uni.showToast({
          title: errors[0],
          icon: 'none'
        });
        return;
      }

      this.isSaving = true;
      try {
        let response;
        // 判断是新增还是编辑
        if (this.form.repairId != null) {
          // 编辑
          response = await updateRepair(this.form);
        } else {
          // 新增
          response = await addRepair(this.form);
        }

        // 处理响应
        if (response.code === 200) {
          uni.showToast({
            title: this.form.repairId ? "修改成功" : "新增成功",
            icon: 'success'
          });
          // 提交成功后关闭页面
          setTimeout(() => {
            this.handleClose();
          }, 1500);
        } else {
          uni.showToast({
            title: response.message || (this.form.repairId ? "修改失败" : "新增失败"),
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('提交失败:', error);
        uni.showToast({
          title: this.form.repairId ? "修改失败" : "新增失败",
          icon: 'none'
        });
      } finally {
        this.isSaving = false;
      }
    },

    handleClose() {
      uni.redirectTo({
        url: '/pages/equip/repair/report/index'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;

  .header-left {
    position: absolute;
    left: 15px;
    width: 40px;
  }

  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .header-right {
    position: absolute;
    right: 15px;
  }
}

// 滚动内容区
.content-scroll {
  flex: 1;
}

// 主要内容区
.content {
  padding: 20px 15px;
  background-color: #fff;
  margin: 10px;
  border-radius: 8px;
}

// 表单行样式
.form-row {
  display: flex;
  align-items: flex-start;
  background: #fff;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
  margin-bottom: 5px;

  &.disabled {
    .value {
      color: #999;
    }

    pointer-events: none;
  }

  .label {
    font-size: 16px;
    color: #333;
    width: 100px;
    flex-shrink: 0;
    font-weight: 500;
    padding-top: 4px;
  }

  .value-section {
    flex: 1;
    display: flex;
    align-items: flex-start;

    .value {
      font-size: 16px;
      color: #666;
      flex: 1;
      padding-top: 4px;
    }

    .form-input {
      width: 100%;
      font-size: 16px;
      padding: 8px 10px;
      border: 1px solid #E5E5E5;
      border-radius: 4px;
    }

    .textarea-input {
      width: 100%;
      min-height: 100px;
      font-size: 16px;
      padding: 8px 10px;
      border: 1px solid #E5E5E5;
      border-radius: 4px;
    }
  }
}

// 最后一行表单去掉下边框
.form-row:last-of-type {
  border-bottom: none;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 0;

  .label {
    width: 100%;
    margin-bottom: 8px;
  }

  .value-section {
    width: 100%;
  }
}

// 标签页容器
.tabs-container {
  margin-top: 20px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
}

// 自定义标签页
.custom-tabs {
  display: flex;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 10px;
}

.custom-tab-item {
  flex: 1;
  height: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.tab-text {
  font-size: 16px;
  font-weight: 500;
}

.tab-underline {
  position: absolute;
  bottom: 0;
  width: 30px;
  height: 2px;
  background-color: #2979FF;
  border-radius: 1px;
}

.tab-content-card {
  padding: 5px 0;
}

// 添加按钮样式
.button-row {
  margin-bottom: 20rpx;
  .action-btn {
    width: 100%;
    height: 88rpx;
    background-color: #ffffff;
    border: 1rpx solid #e0e0e0;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20rpx;
    .u-icon {
      margin-right: 10rpx;
    }
    .btn-text {
      font-size: 28rpx;
      color: #333;
    }
  }
}

// 底部按钮栏
.bottom-bar {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  background: #fff;
  margin-top: 10px;

  .save-btn {
    width: 48%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2979FF;
    color: #fff;
    border-radius: 22px;
    font-size: 16px;
    gap: 5px;

    &.loading {
      opacity: 0.8;
      pointer-events: none;
    }

    &.full-width {
      width: 100%;
    }
  }
}

// 日期选择器
.value-picker {
  width: 100%;
}

// 适配参考页面的列表样式
:deep(.record-list) {
  padding: 10px 0;
}

:deep(.record-item) {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.empty-container) {
  padding: 40px 0;
  text-align: center;
  color: #999;
}

:deep(.loading-container) {
  padding: 20px 0;
  text-align: center;
}
</style>