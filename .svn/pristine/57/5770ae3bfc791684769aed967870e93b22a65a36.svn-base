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
      <text class="popup-title">{{ modeMap[mode] }}</text>
    </view>

    <scroll-view id="popupContent" ref="popupContent" class="popup-content" scroll-y>
      <!-- 基本信息表单 -->
      <view class="form-container">
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
                  <view class="custom-select" @click="() => openResultPopup(item)">
                    <text class="select-value">{{ item.subjectResult === '0' ? '正常' : item.subjectResult === '1' ? '异常' : '请选择检查结果' }}</text>
                    <up-icon name="arrow-down" size="16" color="#999"></up-icon>
                  </view>
                </view>
              </view>

              <view class="info-row" v-if="item.subjectResult === '1'">
                <text class="label">故障分类：</text>
                <view class="input-wrapper">
                  <view class="custom-select" @click="() => openFaultTypePopup(item)">
                    <text class="select-value">{{ getFaultTypeText(item.isFault) }}</text>
                    <up-icon name="arrow-down" size="16" color="#999"></up-icon>
                  </view>
                </view>
              </view>

              <!-- 故障描述 -->
              <view class="info-row">
                <text class="label">故障描述：</text>
                <u-input
                    v-model="item.treatmentMeasures"
                    type="textarea"
                    placeholder="请输入故障描述（选填）"
                    :rows="2"
                    class="desc-input"
                    :disabled="item.subjectResult === '0'"
                ></u-input>
              </view>
            </view>
          </view>
        </view>

        <view v-if="subjectList.length === 0" class="empty-state">
          <text class="empty-text">暂无任务项目</text>
        </view>
      </view>
    </scroll-view>

    <!-- 弹窗底部操作栏 -->
    <view class="popup-footer">
      <u-button type="default" size="small" @click="cancel" class="footer-btn">取 消</u-button>
      <u-button type="danger" size="small" @click="submitFormRepair" class="footer-btn repair-btn">确认报修</u-button>
      <u-button type="primary" size="small" @click="submit" class="footer-btn">确 定</u-button>
    </view>
  </up-popup>

  <up-popup
      :show="showResultPopup"
      mode="bottom"
      :round="16"
      :closeable="true"
      :safe-area-inset-bottom="true"
      @close="closeResultPopup"
  >
    <view class="detail-container" style="min-height:30vh">
      <!-- 标题 -->
      <view class="detail-header">
        <text class="detail-title">选择检查结果</text>
      </view>

      <!-- 结果列表 -->
      <scroll-view scroll-y="true" class="result-list-content">
        <view class="select-item"
              v-for="item in resultOptions"
              :key="item.value"
              @click="selectResult(item)"
        >
          <text>{{ item.label }}</text>
        </view>
      </scroll-view>
    </view>
  </up-popup>

  <up-popup
      :show="showFaultTypePopup"
      mode="bottom"
      :round="16"
      :closeable="true"
      :safe-area-inset-bottom="true"
      @close="closeFaultTypePopup"
  >
    <view class="detail-container" style="min-height:30vh">
      <!-- 标题 -->
      <view class="detail-header">
        <text class="detail-title">选择故障分类</text>
      </view>

      <!-- 故障分类列表 -->
      <scroll-view scroll-y="true" class="result-list-content">
        <view class="select-item"
              v-for="item in faultTypeOptions"
              :key="item.value"
              @click="selectFaultType(item)"
        >
          <text>{{ item.label }}</text>
        </view>
      </scroll-view>
    </view>
  </up-popup>
</template>

<script>
import { getMachinery } from "@/api/equip/machinery";
import { updateCheckTask, addCheckTask } from "@/api/equip/checkTask";
import { addRepair } from "@/api/equip/repair";
import { listCheckTaskSubject } from "@/api/equip/checkTaskSubject";
import { updateCheckTaskSubject } from "@/api/equip/checkTaskSubject";

export default {
  name: "CheckTaskDetail",
  emits: ['success', 'closed'],
  data() {
    return {
      // 弹窗显示控制
      visible: false,
      // 操作模式
      mode: "add",
      modeMap: {
        add: '新增设备',
        edit: '编辑设备',
        show: '查看设备'
      },
      // 表单数据
      form: {
        taskId: null,
        taskCode: null,
        planId: null,
        planCode: null,
        planName: null,
        planType: null,
        recordId: null,
        machineryId: null,
        machineryCode: null,
        machineryName: null,
        machineryBrand: null,
        machinerySpec: null,
        executeUser: null,
        executeUsername: null,
        status: null,
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
      subjectList: [],
      resultOptions: [
        { label: '正常', value: '0' },
        { label: '异常', value: '1' }
      ],
      faultTypeOptions: [
        { label: '电气故障', value: '0' },
        { label: '机器故障', value: '1' }
      ],
      // 报修表单数据
      formRepair: {},
      // 设备信息
      machinery: {},
      showResultPopup: false,
      currentSubjectItem: null,
      showFaultTypePopup: false,
      currentFaultItem: null
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
    getPlanTypeText(planType) {
      const typeMap = {
        'CHECK': '点检计划',
        'MAINTEN': '保养计划'
      };
      return typeMap[planType] || '未知类型';
    },

    getPlanTypeTagType(planType) {
      const typeMap = {
        'CHECK': 'primary',
        'MAINTEN': 'success'
      };
      return typeMap[planType] || 'info';
    },

    getFaultTypeText(faultType) {
      if (!faultType && faultType !== '0') {
        return '请选择故障分类';
      }
      const typeMap = {
        '0': '电气故障',
        '1': '机器故障'
      };
      return typeMap[faultType] || '未知故障类型';
    },

    // 加载任务项目列表
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
            treatmentMeasures: item.treatmentMeasures || '',
            isFault: item.isFault || ''
          }));
        }
      } catch (error) {
        console.error('加载任务项目失败:', error);
        uni.showToast({ title: '加载项目失败', icon: 'none' });
      }
    },

    // 打开检查结果选择弹窗
    openResultPopup(item) {
      this.currentSubjectItem = item;
      this.showResultPopup = true;
    },

    // 关闭检查结果选择弹窗
    closeResultPopup() {
      this.showResultPopup = false;
      this.currentSubjectItem = null;
    },

    selectResult(item) {
      if (!this.currentSubjectItem) return;

      this.$set(this.currentSubjectItem, 'subjectResult', item.value);
      if (item.value === '0') {
        this.$set(this.currentSubjectItem, 'treatmentMeasures', '');
        this.$set(this.currentSubjectItem, 'isFault', '');
      } else {
        this.$set(this.currentSubjectItem, 'isFault', '');
      }
      this.$set(this.currentSubjectItem, 'isFaultFlag', item.value === '1' ? '1' : '0');

      this.closeResultPopup();
    },

    openFaultTypePopup(item) {
      this.currentFaultItem = item;
      this.showFaultTypePopup = true;
    },

    closeFaultTypePopup() {
      this.showFaultTypePopup = false;
      this.currentFaultItem = null;
    },

    selectFaultType(item) {
      if (!this.currentFaultItem) return;

      this.$set(this.currentFaultItem, 'isFault', item.value);
      this.closeFaultTypePopup();
    },

    // 打开弹窗
    open(mode) {
      this.mode = mode;
      this.visible = true;
      return this;
    },

    async submit() {
      try {
        const uncompletedItems = this.subjectList.filter(item => !item.subjectResult);
        if (uncompletedItems.length > 0) {
          uni.showToast({ title: '请完成所有项目的检查结果选择', icon: 'none' });
          return;
        }

        const abnormalItemsWithoutFaultType = this.subjectList.filter(
            item => item.subjectResult === '1' && !item.isFault
        );
        if (abnormalItemsWithoutFaultType.length > 0) {
          uni.showToast({ title: '请为异常项目选择故障分类', icon: 'none' });
          return;
        }

        const requiredFields = [
          { key: 'planId', msg: '计划ID不能为空' },
          { key: 'planCode', msg: '计划编码不能为空' },
          { key: 'planType', msg: '计划类型不能为空' },
          { key: 'recordId', msg: '流水号不能为空' },
          { key: 'machineryId', msg: '设备ID不能为空' },
          { key: 'machineryCode', msg: '设备编码不能为空' },
          { key: 'machineryName', msg: '设备名称不能为空' }
        ];

        // 校验逻辑
        for (const field of requiredFields) {
          if (!this.form[field.key]) {
            uni.showToast({ title: field.msg, icon: 'none' });
            return;
          }
        }

        // 提交主表单数据
        if (this.form.taskId != null) {
          this.form.status = '20';
          const res = await updateCheckTask(this.form);
          if (res.code === 200) {
            await this.updateAllSubjectResults();
            uni.showToast({ title: "修改成功", icon: 'success' });
            this.visible = false;
            setTimeout(() => {
              this.$emit('success', this.form, this.mode);
            }, 200);
          } else {
            uni.showToast({ title: res.msg || '修改失败', icon: 'none' });
          }
        } else {
          const res = await addCheckTask(this.form);
          if (res.code === 200) {
            uni.showToast({ title: "新增成功", icon: 'success' });
            this.visible = false;
            setTimeout(() => {
              this.$emit('success', this.form, this.mode);
            }, 200);
          } else {
            uni.showToast({ title: res.msg || '新增失败', icon: 'none' });
          }
        }
      } catch (error) {
        console.error('提交失败:', error);
        uni.showToast({ title: '网络错误，请重试', icon: 'none' });
      }
    },

    async updateAllSubjectResults() {
      try {
        const updatePromises = this.subjectList.map(item => {
          if (item.taskSubId) {
            return updateCheckTaskSubject({
              taskSubId: item.taskSubId,
              subjectResult: item.subjectResult,
              treatmentMeasures: item.treatmentMeasures,
              isFault: item.isFault || '', // 新增：提交故障分类
              isFaultFlag: item.subjectResult === '1' ? '1' : '0' // 保留原有故障标记
            });
          }
          return Promise.resolve();
        });
        await Promise.all(updatePromises);
      } catch (error) {
        console.error('更新项目结果失败:', error);
      }
    },

    cancel() {
      try {
        uni.createSelectorQuery().in(this).select('#popupContent').scrollTo({
          scrollTop: 0,
          duration: 0
        });
      } catch (e) {
        // 容错：即使滚动失败也不影响弹窗关闭
        console.log('滚动重置失败（非关键错误）:', e);
      }
      this.visible = false;
      setTimeout(() => {
        this.$emit('closed');
      }, 200);
    },

    // 表单注入数据
    setData(data) {
      Object.assign(this.form, data);
    },

    resetRepair() {
      this.formRepair = {
        repairId: null,
        repairCode: null,
        repairName: this.form.planName + "报修单",
        machineryId: this.form.machineryId,
        machineryCode: this.form.machineryCode,
        machineryName: this.form.machineryName,
        machineryBrand: this.form.machineryBrand,
        machinerySpec: this.form.machinerySpec,
        machineryTypeId: this.machinery.machineryTypeId || '',
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
        reportRepairSource: this.form.planType == 'CHECK' ? '02' : '03',
        faultTime: new Date(),
        faultType: null,
        faultDescribe: null,
        orgCode: null,
        orgName: null,
        sourceNumber: this.form.taskCode,
        repairType: null,
        reportBy: null,
        reportUsername: null,
      };
    },

    async submitFormRepair() {
      try {
        const uncompletedItems = this.subjectList.filter(item => !item.subjectResult);
        if (uncompletedItems.length > 0) {
          uni.showToast({ title: '请完成所有项目的检查结果选择', icon: 'none' });
          return;
        }

        const abnormalItemsWithoutFaultType = this.subjectList.filter(
            item => item.subjectResult === '1' && !item.isFault
        );
        if (abnormalItemsWithoutFaultType.length > 0) {
          uni.showToast({ title: '请为异常项目选择故障分类', icon: 'none' });
          return;
        }

        // 检查是否有异常项目
        const hasAbnormal = this.subjectList.some(item => item.subjectResult === '1');
        if (!hasAbnormal) {
          uni.showToast({ title: '暂无异常项目，无需报修', icon: 'none' });
          return;
        }

        // 基础校验
        const requiredFields = [
          { key: 'planId', msg: '计划ID不能为空' },
          { key: 'planCode', msg: '计划编码不能为空' },
          { key: 'machineryId', msg: '设备ID不能为空' }
        ];

        for (const field of requiredFields) {
          if (!this.form[field.key]) {
            uni.showToast({ title: field.msg, icon: 'none' });
            return;
          }
        }

        if (this.form.taskId != null) {
          uni.showLoading({ title: '处理中...', mask: true });

          // 更新任务状态
          this.form.status = '20';
          const taskRes = await updateCheckTask(this.form);

          if (taskRes.code === 200) {
            await this.updateAllSubjectResults();

            // 获取设备信息
            const machineryRes = await getMachinery(this.form.machineryId);
            if (machineryRes.code === 200) {
              this.machinery = machineryRes.data;
              this.resetRepair();

              const firstAbnormalItem = this.subjectList.find(item => item.subjectResult === '1');
              if (firstAbnormalItem) {
                this.formRepair.faultType = firstAbnormalItem.isFault;
                this.formRepair.faultDescribe = firstAbnormalItem.treatmentMeasures;
              }

              this.formRepair.repairCode = 'REP' + Date.now().toString().slice(-6);

              // 提交报修单
              const repairRes = await addRepair(this.formRepair);
              if (repairRes.code === 200) {
                uni.showToast({ title: "新增报修单成功", icon: 'success' });
                this.visible = false;
                setTimeout(() => {
                  this.$emit('success', this.form, this.mode);
                }, 200);
              } else {
                uni.showToast({ title: repairRes.msg || '新增报修单失败', icon: 'none' });
              }
            } else {
              uni.showToast({ title: '获取设备信息失败', icon: 'none' });
            }
          } else {
            uni.showToast({ title: '更新任务状态失败', icon: 'none' });
          }
        }
      } catch (error) {
        console.error('报修提交失败:', error);
        uni.showToast({ title: '网络错误，请重试', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
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
      align-items: center;
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 140rpx;
        font-size: 28rpx;
        color: #666;
        flex-shrink: 0;
      }

      .value {
        font-size: 28rpx;
        color: #333;
        flex: 1;
      }

      .input-wrapper {
        display: flex;
        align-items: center;
        flex: 1;
      }

      .custom-select {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60rpx;
        border: 0.5px solid #e8e8e8;
        border-radius: 6rpx;
        padding: 0 10rpx;
        font-size: 28rpx;
        color: #333;
        background-color: #fff;
        cursor: pointer;
        width: 100%;
      }

      .custom-select.disabled {
        background-color: #f5f5f5;
        color: #999;
        cursor: not-allowed;
      }

      .select-value {
        flex: 1;
        text-align: left;
      }

      .desc-input {
        flex: 1;
        min-height: 120rpx;
        padding: 15rpx;
        border: 1rpx solid #e0e0e0;
        border-radius: 6rpx;
        font-size: 28rpx;
        color: #333;
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
  justify-content: space-between;
  padding: 20rpx 30rpx;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.footer-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
}

.detail-container {
  background: #fff;
  min-height: 30vh;
  display: flex;
  flex-direction: column;
}

.result-list-content {
  flex: 1;
  max-height: 400rpx;
  padding: 5px 0;
}

.select-item {
  padding: 20rpx 30rpx;
  font-size: 30rpx;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1rpx solid #f0f0f0;
}

.select-item:last-child {
  border-bottom: none;
}

.select-item:hover {
  background-color: #f5f5f5;
}

.select-empty {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 13px;
}
.repair-btn {
  background-color: #ff0000 !important;
  color: #ffffff !important;
  border-color: #ff0000 !important;
  &:active {
    background-color: #e60000 !important;
  }
}
</style>