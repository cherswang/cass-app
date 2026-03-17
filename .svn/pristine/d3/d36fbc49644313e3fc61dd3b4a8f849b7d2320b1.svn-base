<template>
  <view class="container">
    <u-navbar
        :title="titleMap[mode]"
        :placeholder="true"
        bg-color="#FFFFFF"
        title-color="#333333"
        :border="false"
        :auto-back="true"
    />

    <view class="content">
      <view class="form-row" :class="{ disabled: mode === 'view' }">
        <text class="label">计划编码</text>
        <view class="value-section">
          <u-input
              v-model="form.planCode"
              placeholder="请输入计划编码"
              :disabled="mode === 'view' || mode === 'edit'"
              class="form-input"
          ></u-input>
        </view>
      </view>
      <view class="form-row" :class="{ disabled: mode === 'view' }">
        <text class="label">计划名称</text>
        <view class="value-section">
          <u-input
              v-model="form.planName"
              placeholder="请输入计划名称"
              :disabled="mode === 'view'"
              class="form-input"
          ></u-input>
        </view>
      </view>

      <view class="form-row" @click="openPlanTypeActionSheet" :class="{ disabled: mode === 'view' }">
        <text class="label">计划类型</text>
        <view class="value-section">
          <text class="value">{{ getPlanTypeLabel(form.planType) || '请选择计划类型' }}</text>
          <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'view'"></u-icon>
        </view>
      </view>

      <view class="form-row" :class="{ disabled: mode === 'view' }">
        <text class="label">开始日期</text>
        <view class="value-section">
          <picker
              v-if="mode !== 'view'"
              mode="date"
              :value="form.startDate"
              @change="handleDateChange('startDate', $event)"
              class="value-picker"
          >
            <view class="value">{{ form.startDate || '请选择开始日期' }}</view>
          </picker>
          <text v-else class="value">{{ form.startDate || '暂无开始日期' }}</text>
          <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'view'"></u-icon>
        </view>
      </view>

      <view class="form-row" :class="{ disabled: mode === 'view' }">
        <text class="label">结束日期</text>
        <view class="value-section">
          <picker
              v-if="mode !== 'view'"
              mode="date"
              :value="form.endDate"
              @change="handleDateChange('endDate', $event)"
              class="value-picker"
          >
            <view class="value">{{ form.endDate || '请选择结束日期' }}</view>
          </picker>
          <text v-else class="value">{{ form.endDate || '暂无结束日期' }}</text>
          <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'view'"></u-icon>
        </view>
      </view>

      <view class="form-row" @click="openExecuteTypeActionSheet" :class="{ disabled: mode === 'view' }">
        <text class="label">执行类型</text>
        <view class="value-section">
          <text class="value">{{ getExecuteTypeLabel(form.executeType) || '请选择执行类型' }}</text>
          <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'view'"></u-icon>
        </view>
      </view>

      <view v-if="form.executeType === '10'" class="cycle-row" :class="{ disabled: mode === 'view' }">
        <text class="label">执行频率</text>
        <view class="cycle-content">
          <u-input
              v-model="form.cycleCount"
              placeholder="请输入次数"
              type="number"
              :disabled="mode === 'view'"
              class="cycle-count"
          ></u-input>
          <view class="cycle-type" @click="openCycleTypeActionSheet">
            <text class="value">{{ getCycleTypeLabel(form.cycleType) || '请选择频率' }}</text>
            <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'view'"></u-icon>
          </view>
        </view>
      </view>

      <view v-if="form.executeType === '20'" class="form-row" :class="{ disabled: mode === 'view' }">
        <text class="label">执行日期</text>
        <view class="value-section">
          <picker
              v-if="mode !== 'view'"
              mode="date"
              :value="form.executeDate"
              @change="handleDateChange('executeDate', $event)"
              class="value-picker"
          >
            <view class="value">{{ form.executeDate || '请选择执行日期' }}</view>
          </picker>
          <text v-else class="value">{{ form.executeDate || '暂无执行日期' }}</text>
          <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'view'"></u-icon>
        </view>
      </view>

      <view class="form-row" @click="mode !== 'view' && handleExecuteUserAdd()" :class="{ disabled: mode === 'view' }">
        <text class="label">执行人</text>
        <view class="value-section">
          <text class="value">{{ form.executeUsername || '请选择执行人' }}</text>
          <u-icon name="arrow-right" color="#999" size="16" v-if="mode !== 'view'"></u-icon>
        </view>
      </view>

      <view class="form-row" :class="{ disabled: mode === 'view' }">
        <text class="label">备注</text>
        <view class="value-section">
          <u-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注内容"
              :disabled="mode === 'view'"
              class="textarea-input"
              rows="4"
          ></u-input>
        </view>
      </view>

      <view v-if="showTabs" class="tabs-container">
        <view class="custom-tabs">
          <view
              v-for="(item, index) in tabList"
              :key="index"
              class="custom-tab-item"
              :class="{ active: currentTab === index }"
              @click="handleCustomTabChange(index)"
          >
            <text class="tab-text" :style="{ color: currentTab === index ? '#2979FF' : '#666' }">
              {{ item.name }}
            </text>
            <view class="tab-underline" v-if="currentTab === index"></view>
          </view>
        </view>
        <view v-show="currentTab === 0" class="tab-content-card">
          <view class="button-row" v-if="mode !== 'view'">
            <view class="action-btn" style="width: 100%" @click="handleSelectMachinery">
              <u-icon name="plus" size="20" color="#333"></u-icon>
              <text class="btn-text">添加设备</text>
            </view>
          </view>
          <view class="product-cards" v-if="machineryList && machineryList.length > 0">
            <view class="product-card" v-for="(item, idx) in machineryList" :key="item.machineryId || 'mach_' + idx">
              <view class="card-header">
                <text class="card-title">{{ item.machineryName || '-' }}：{{item.machineryCode || '-'}}</text>
                <u-icon
                    name="close"
                    size="20"
                    color="#999"
                    v-if="mode !== 'view'"
                    @click="delMachinery(idx)"
                ></u-icon>
              </view>
              <view class="card-content">
                <view class="info-row">
                  <text class="label">设备编码：</text>
                  <text class="value">{{ item.machineryCode || '-' }}</text>
                </view>
                <view class="info-row">
                  <text class="label">设备名称：</text>
                  <text class="value">{{ item.machineryName || '-' }}</text>
                </view>
                <view class="info-row">
                  <text class="label">品牌：</text>
                  <text class="value">{{item.machineryBrand || '-' }}</text>
                </view>
                <view class="info-row">
                  <text class="label">规格型号：</text>
                  <text class="value">{{ item.machinerySpec || '-' }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="empty-state" v-else>
            <text class="empty-text">暂无选择设备</text>
          </view>
        </view>
        <view v-show="currentTab === 1" class="tab-content-card">
          <view class="button-row" v-if="mode !== 'view'">
            <view class="action-btn" style="width: 100%" @click="handleSelectSubject">
              <u-icon name="plus" size="20" color="#333"></u-icon>
              <text class="btn-text">添加项目</text>
            </view>
          </view>
          <view class="product-cards" v-if="subjectList && subjectList.length > 0">
            <view class="product-card" v-for="(item, idx) in subjectList" :key="item.subjectId || 'sub_' + idx">
              <view class="card-header">
                <text class="card-title">{{ item.subjectName || '-' }}：{{item.subjectCode || '-'}}</text>
                <u-icon
                    name="close"
                    size="20"
                    color="#999"
                    v-if="mode !== 'view'"
                    @click="delSubject(idx)"
                ></u-icon>
              </view>
              <view class="card-content">
                <view class="info-row">
                  <text class="label">项目编码：</text>
                  <text class="value">{{ item.subjectCode || '-' }}</text>
                </view>
                <view class="info-row">
                  <text class="label">项目类型：</text>
                  <text class="value">{{ item.subjectType || '-' }}</text>
                </view>
                <view class="info-row">
                  <text class="label">项目内容：</text>
                  <text class="value">{{ item.subjectContent || '-' }}</text>
                </view>
                <view class="info-row">
                  <text class="label">执行标准：</text>
                  <text class="value">{{ item.subjectStandard || '-' }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="empty-state" v-else>
            <text class="empty-text">暂无选择项目</text>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-bar" v-if="mode !== 'view'">
      <view class="cancel-btn" @click="handleCancel">取 消</view>
      <view class="save-btn" @click="submit()" :class="{ loading: submitLoading }">
        <u-icon name="spinner" size="20" v-if="submitLoading"></u-icon>
        <text v-else>保 存</text>
      </view>
    </view>
    <up-popup
        ref="assignUserPopup"
        :show="dialog.assignUser"
        mode="top"
        :round="16"
        :closeable="true"
        @close="closeAssignUserModal"
    >
      <view class="assign-modal">
        <view class="modal-header">
          <text class="modal-title">选择执行人</text>
        </view>

        <view class="assign-modal-content">
          <view class="selected-info" v-if="selectedUserIds.length > 0">
            <text class="selected-title">已选择：</text>
            <view class="selected-tags">
              <view
                  v-for="user in selectedUsers"
                  :key="user.userId"
                  class="selected-tag"
              >
                <text class="tag-text">{{ user.nickName }}</text>
                <u-icon
                    name="close-circle"
                    size="14"
                    color="#999"
                    class="tag-delete"
                    @click="removeSelectedUser(user.userId)"
                ></u-icon>
              </view>
            </view>
          </view>

          <view class="user-search-bar">
            <view class="user-search-input-wrapper">
              <u-icon name="search" size="14" color="#999" class="user-search-icon"></u-icon>
              <input
                  type="text"
                  v-model="userSearchQuery"
                  placeholder="搜索执行人姓名"
                  class="user-search-input"
                  @input="handleUserSearch"
              />
              <u-icon
                  v-if="userSearchQuery"
                  name="close-circle"
                  size="14"
                  color="#999"
                  class="clear-search-icon"
                  @click="clearUserSearch"
              ></u-icon>
            </view>
          </view>

          <scroll-view
              class="user-list"
              scroll-y
              :scroll-with-animation="true"
          >
            <view v-if="userLoading" class="loading-container">
              <u-loading-icon size="20" text="加载中..."></u-loading-icon>
            </view>
            <view v-else-if="filteredUserList.length === 0" class="empty-users">
              <text class="empty-text">{{ userSearchQuery ? '未找到匹配的执行人' : '暂无可用用户' }}</text>
            </view>
            <view v-else>
              <view
                  v-for="user in filteredUserList"
                  :key="user.userId"
                  class="user-item"
                  :class="{ active: selectedUserIds.includes(user.userId) }"
                  @click="toggleSelectUser(user.userId)"
              >
                <text class="user-name">{{ user.nickName }}</text>
                <u-icon
                    v-if="selectedUserIds.includes(user.userId)"
                    name="checkmark"
                    size="20"
                    color="#2979FF"
                ></u-icon>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="modal-footer">
          <up-button text="取消" size="small" @click="closeAssignUserModal"></up-button>
          <up-button type="primary" text="确定" size="small" @click="confirmAssignUser"
                     :disabled="selectedUserIds.length === 0"></up-button>
        </view>
      </view>
    </up-popup>

    <u-popup ref="machineryPopup" mode="bottom" :mask-click="false" :show="showMachineryPopup">
      <view class="machinery-popup-content">
        <view class="popup-header">
          <text class="popup-title">选择设备</text>
          <u-icon name="close" size="20" color="#999" @click="showMachineryPopup = false"></u-icon>
        </view>

        <view class="search-section">
          <view class="search-wrapper">
            <u-search
                v-model="machinerySearchValue"
                placeholder="请输入设备编码/名称"
                bg-color="#F8F8F8"
                @search="handleMachinerySearch"
                @input="handleMachineryInput"
                class="machinery-search"
                :show-action="false"
            ></u-search>
            <up-button
                type="primary"
                plain
                size="small"
                class="search-btn"
                @click="handleMachinerySearch"
            >
              搜索
            </up-button>
          </view>
        </view>
        <scroll-view
            class="machinery-scroll"
            scroll-y
            @scrolltolower="handleMachineryLoadMore"
            style="max-height: 600rpx;"
        >
          <view class="machinery-list">
            <view v-if="machineryLoading" class="loading-container">
              <u-loading-icon size="20" text="加载中..."></u-loading-icon>
            </view>
            <view v-else-if="machineryListTemp.length === 0" class="empty-container">
              <text class="empty-text">暂无设备数据</text>
            </view>
            <view v-else>
              <view
                  v-for="machinery in machineryListTemp"
                  :key="machinery.machineryId"
                  class="machinery-item"
                  :class="{'active': selectedMachineryIds.includes(machinery.machineryId)}"
                  @click="toggleSelectMachinery(machinery)"
              >
                <view class="machinery-info">
                  <text class="machinery-name">{{ machinery.machineryCode}}</text>
                  <text class="machinery-code">{{ machinery.machineryName || '-' }}</text>
                </view>
                <u-icon
                    v-if="selectedMachineryIds.includes(machinery.machineryId)"
                    name="checkmark"
                    size="20"
                    color="#2979FF"
                ></u-icon>
              </view>

              <view v-if="machineryLoadingMore" class="loading-more-container">
                <u-loading-icon size="16" text="加载中..."></u-loading-icon>
              </view>

              <view v-else-if="machineryListTemp.length >= machineryTotal" class="no-more-container">
                <text class="no-more-text">已经到底了，没有更多数据了</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="popup-footer">
          <up-button size="small" @click="showMachineryPopup = false">取消</up-button>
          <up-button type="primary" size="small" @click="confirmMachinerySelect" :disabled="selectedMachineryIds.length === 0">
            确定 ({{ selectedMachineryIds.length }})
          </up-button>
        </view>
      </view>
    </u-popup>

    <u-popup ref="subjectPopup" mode="bottom" :mask-click="false" :show="showSubjectPopup">
      <view class="machinery-popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ form.planType === 'CHECK' ? '选择点检项目' : '选择保养项目' }}</text>
          <u-icon name="close" size="20" color="#999" @click="showSubjectPopup = false"></u-icon>
        </view>

        <view class="search-section">
          <view class="search-wrapper">
            <u-search
                v-model="subjectSearchValue"
                placeholder="请输入项目编码/内容"
                bg-color="#F8F8F8"
                @search="handleSubjectSearch"
                @input="handleSubjectInput"
                class="machinery-search"
                :show-action="false"
            ></u-search>
            <up-button
                type="primary"
                plain
                size="small"
                class="search-btn"
                @click="handleSubjectSearch"
            >
              搜索
            </up-button>
          </view>
        </view>
        <scroll-view
            class="machinery-scroll"
            scroll-y
            @scrolltolower="handleSubjectLoadMore"
            style="max-height: 600rpx;"
        >
          <view class="machinery-list">
            <view v-if="subjectLoading" class="loading-container">
              <u-loading-icon size="20" text="加载中..."></u-loading-icon>
            </view>
            <view v-else-if="subjectListTemp.length === 0" class="empty-container">
              <text class="empty-text">暂无项目数据</text>
            </view>
            <view v-else>
              <view
                  v-for="subject in subjectListTemp"
                  :key="subject.subjectId"
                  class="machinery-item"
                  :class="{'active': selectedSubjectIds.includes(subject.subjectId)}"
                  @click="toggleSelectSubject(subject)"
              >
                <view class="machinery-info">
                  <text class="machinery-name">{{ subject.subjectCode}}</text>
                  <text class="machinery-code">{{ subject.subjectContent || subject.subjectName || '-' }}</text>
                </view>
                <u-icon
                    v-if="selectedSubjectIds.includes(subject.subjectId)"
                    name="checkmark"
                    size="20"
                    color="#2979FF"
                ></u-icon>
              </view>

              <view v-if="subjectLoadingMore" class="loading-more-container">
                <u-loading-icon size="16" text="加载中..."></u-loading-icon>
              </view>

              <view v-else-if="subjectListTemp.length >= subjectTotal" class="no-more-container">
                <text class="no-more-text">已经到底了，没有更多数据了</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="popup-footer">
          <up-button size="small" @click="showSubjectPopup = false">取消</up-button>
          <up-button type="primary" size="small" @click="confirmSubjectSelect" :disabled="selectedSubjectIds.length === 0">
            确定 ({{ selectedSubjectIds.length }})
          </up-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {addCheckPlan, updateCheckPlan, getCheckPlan} from "@/api/equip/checkplan";
import {getUserList} from '@/api/system/user'
import {listMachinery, listMachineryType} from "@/api/equip/machinery";
import {listDvsubject} from "@/api/equip/dvsubject";
import {listChecksubject} from "@/api/equip/checksubject";
import {listCheckMachinery} from "@/api/equip/checkmachinery";

export default {
  emits: ['success', 'closed'],
  data() {
    return {
      showTabs: false,
      dialog: { assignUser: false },
      planTypeOptions: [
        { label: '设备点检计划', value: 'CHECK' },
        { label: '定修保养计划', value: 'MAINTEN' }
      ],
      executeTypeOptions: [
        { label: '周期执行', value: '10' },
        { label: '指定日期', value: '20' }
      ],
      cycleTypeOptions: [
        { label: '小时', value: 'HOUR' },
        { label: '天', value: 'DAY' },
        { label: '周', value: 'WEEK' },
        { label: '月', value: 'MONTH' },
        { label: '季度', value: 'QUARTER' },
        { label: '年', value: 'YEAR' }
      ],
      mode: "add",
      titleMap: { add: '新增计划', edit: '编辑计划', view: '查看计划' },
      currentTab: 0,
      tabList: [{ name: '设备清单' }, { name: '点检项目' }],
      submitLoading: false,
      form: {
        planId: null,
        planCode: null,
        planName: null,
        planType: 'CHECK',
        startDate: '',
        endDate: '',
        cycleType: null,
        cycleCount: null,
        executeUser: null,
        executeUsername: null,
        status: 'PREPARE',
        remark: null,
        attr1: null, attr2: null, attr3: null, attr4: null,
        createBy: null, createTime: null,
        updateBy: null, updateTime: null,
        executeType: '10',
        executeDate: '',
      },
      userList: [],
      filteredUserList: [],
      userLoading: false,
      selectedUserIds: [],
      userSearchQuery: '',
      machineryList: [],
      subjectList: [],

      showMachineryPopup: false,
      machineryListTemp: [],
      machineryLoading: false,
      machineryLoadingMore: false,
      machinerySearchValue: '',
      selectedMachineryIds: [],
      machineryPage: 1,
      machineryPageSize: 10,
      machineryTotal: 0,
      selectedMachineryType: { label: '全部', value: 'all' },
      machineryTypeOptions: [
        { label: '全部', value: 'all' }
      ],
      machinerySearchTimer: null,

      showSubjectPopup: false,
      subjectListTemp: [],
      subjectLoading: false,
      subjectLoadingMore: false,
      subjectSearchValue: '',
      selectedSubjectIds: [],
      subjectPage: 1,
      subjectPageSize: 10,
      subjectTotal: 0,
      subjectSearchTimer: null
    }
  },
  computed: {
    selectedUsers() {
      return this.userList.filter(user => this.selectedUserIds.includes(user.userId))
    }
  },
  watch: {
    'form.planType'(val, oldVal) {
      this.tabList[1].name = val === 'CHECK' ? '点检项目' : '保养项目';
      if (this.showSubjectPopup) {
        this.subjectPage = 1;
        this.loadSubjectList();
      }
      if (oldVal && oldVal !== val) {
        this.subjectList = []
      }
    },
    'form.planId'(val) {
      this.updateTabsVisibility();
    },
    'mode'(val) {
      this.updateTabsVisibility();
    }
  },
  onLoad(options) {
    const { planId, type } = options;
    if (type === 'edit' || type === 'view') {
      this.mode = type;
      this.form.planId = planId;
      this.loadPlanDetail(planId).then(() => {
        this.$nextTick(() => {
        });
      });
    } else {
      this.mode = 'add';
    }
    this.fetchMachineryTypeList();
    this.updateTabsVisibility();
  },
  methods: {
    handleCancel() {
      this.dialog.assignUser = false;
      this.showMachineryPopup = false;
      this.showSubjectPopup = false;
      try {
        uni.navigateBack({
        });
      } catch (error) {
        console.error('取消操作出错:', error);
      }
    },
    updateTabsVisibility() {
      const shouldShow = this.form.planId != null || this.mode !== 'view';
      this.showTabs = shouldShow;
    },
    async loadPlanDetail(planId) {
      try {
        uni.showLoading({ title: '加载中...', mask: true });
        const res = await getCheckPlan(planId);

        if (res.code === 200 && res.data) {
          const detail = res.data;
          const formatDateValue = (dateStr) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          };

          this.form = {
            ...this.form,
            ...detail,
            startDate: formatDateValue(detail.startDate),
            endDate: formatDateValue(detail.endDate),
            executeDate: formatDateValue(detail.executeDate),
            cycleCount: detail.cycleCount ? detail.cycleCount.toString() : ''
          };

          if (detail.planType) {
            this.tabList[1].name = detail.planType === 'CHECK' ? '点检项目' : '保养项目';
          }

          try {
            const machineryRes = await listCheckMachinery({ planId: planId });
            if (machineryRes.code === 200) {
              this.machineryList = machineryRes.rows || [];
            } else {
              this.machineryList = [];
              uni.showToast({ title: '加载设备列表失败', icon: 'none' });
            }
          } catch (error) {
            this.machineryList = [];
            console.error('加载计划设备列表失败:', error);
          }

          try {
            const subjectRes = await listChecksubject({
              planId: planId,
              subjectType: detail.planType
            });

            if (subjectRes.code === 200) {
              this.subjectList = subjectRes.rows || [];
            } else {
              this.subjectList = [];
              uni.showToast({ title: '加载项目列表失败', icon: 'none' });
            }
          } catch (error) {
            this.subjectList = [];
            console.error('加载计划项目列表失败:', error);
          }

          this.$nextTick(() => {
            this.updateTabsVisibility();
            this.showTabs = true;
          });
        } else {
          uni.showToast({ title: res.msg || '加载详情失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '加载详情失败', icon: 'none' });
        console.error('加载计划详情失败:', error);
      } finally {
        uni.hideLoading();
      }
    },
    openPlanTypeActionSheet() {
      if (this.mode === 'view') return
      const itemList = this.planTypeOptions.map(item => item.label)
      uni.showActionSheet({
        itemList,
        success: (res) => {
          const selectedItem = this.planTypeOptions[res.tapIndex]
          const oldPlanType = this.form.planType
          this.form.planType = selectedItem.value
          this.tabList[1].name = selectedItem.value === 'CHECK' ? '点检项目' : '保养项目'
          if (oldPlanType && oldPlanType !== selectedItem.value) {
            this.subjectList = []
          }
        }
      })
    },
    getPlanTypeLabel(value) {
      if (!value) return ''
      const item = this.planTypeOptions.find(i => i.value === value)
      return item ? item.label : ''
    },
    openExecuteTypeActionSheet() {
      if (this.mode === 'view') return
      const itemList = this.executeTypeOptions.map(item => item.label)
      uni.showActionSheet({
        itemList,
        success: (res) => {
          const selectedItem = this.executeTypeOptions[res.tapIndex]
          this.form.executeType = selectedItem.value
          if (selectedItem.value === '10') {
            this.form.executeDate = ''
          } else {
            this.form.cycleType = null
            this.form.cycleCount = null
          }
        }
      })
    },
    getExecuteTypeLabel(value) {
      if (!value) return ''
      const item = this.executeTypeOptions.find(i => i.value === value)
      return item ? item.label : ''
    },
    openCycleTypeActionSheet() {
      if (this.mode === 'view') return
      const itemList = this.cycleTypeOptions.map(item => item.label)
      uni.showActionSheet({
        itemList,
        success: (res) => {
          const selectedItem = this.cycleTypeOptions[res.tapIndex]
          this.form.cycleType = selectedItem.value
        }
      })
    },
    getCycleTypeLabel(value) {
      if (!value) return ''
      const item = this.cycleTypeOptions.find(i => i.value === value)
      return item ? item.label : ''
    },
    open(mode) {
      this.mode = mode;
      this.tabList[1].name = this.form.planType === 'CHECK' ? '点检项目' : '保养项目';
      this.updateTabsVisibility();
      return this;
    },
    handleDateChange(field, e) {
      this.form[field] = e.detail.value
    },
    handleCustomTabChange(index) {
      this.currentTab = index;
    },
    handleExecuteUserAdd() {
      this.dialog.assignUser = true
      this.loadUsers().then(() => {
        if (this.form.executeUser) {
          const arr = this.form.executeUser.split(',').map(i => i.trim()).filter(Boolean)
          this.selectedUserIds = arr
        } else {
          this.selectedUserIds = []
        }
      })
    },
    loadUsers() {
      this.userLoading = true
      return new Promise((resolve, reject) => {
        getUserList().then(res => {
          if (res.code === 200) {
            this.userList = res.rows || []
            this.filteredUserList = [...this.userList]
          } else {
            uni.showToast({ title: res.msg || '加载失败', icon: 'none' })
          }
          resolve()
        }).catch(err => {
          uni.showToast({ title: '加载用户失败', icon: 'none' })
          reject(err)
        }).finally(() => {
          this.userLoading = false
        })
      })
    },
    handleUserSearch() {
      const q = this.userSearchQuery.trim().toLowerCase()
      if (!q) {
        this.filteredUserList = [...this.userList]
        return
      }
      this.filteredUserList = this.userList.filter(u =>
          u.nickName?.toLowerCase().includes(q)
      )
    },
    clearUserSearch() {
      this.userSearchQuery = ''
      this.filteredUserList = [...this.userList]
    },
    toggleSelectUser(userId) {
      if (this.selectedUserIds.includes(userId)) {
        this.selectedUserIds = this.selectedUserIds.filter(i => i !== userId)
      } else {
        this.selectedUserIds.push(userId)
      }
    },
    removeSelectedUser(userId) {
      this.selectedUserIds = this.selectedUserIds.filter(i => i !== userId)
    },
    confirmAssignUser() {
      if (!this.selectedUserIds.length) {
        uni.showToast({ title: '请选择执行人', icon: 'none' })
        return
      }
      const users = this.userList.filter(u => this.selectedUserIds.includes(u.userId))
      this.form.executeUser = users.map(u => u.userId).join(',')
      this.form.executeUsername = users.map(u => u.nickName).join('、')
      this.closeAssignUserModal()
    },
    closeAssignUserModal() {
      this.dialog.assignUser = false
      this.selectedUserIds = []
      this.userList = []
      this.filteredUserList = []
      this.userSearchQuery = ''
    },
    validateForm() {
      const err = []
      if (!this.form.planCode) err.push('计划编码不能为空')
      if (!this.form.planName) err.push('计划名称不能为空')
      if (!this.form.planType) err.push('计划类型不能为空')
      if (!this.form.executeType) err.push('执行类型不能为空')
      if (!this.form.executeUsername) err.push('请选择执行人')
      if (!this.form.startDate) err.push('请选择开始日期')
      if (!this.form.endDate) err.push('请选择结束日期')
      if (this.form.executeType === '10') {
        if (!this.form.cycleCount) err.push('请输入执行次数')
        if (!this.form.cycleType) err.push('请选择执行频率')
      }
      if (this.form.executeType === '20' && !this.form.executeDate) {
        err.push('请选择执行日期')
      }
      if (this.form.startDate && this.form.endDate) {
        if (new Date(this.form.startDate) > new Date(this.form.endDate)) {
          err.push('开始日期不能晚于结束日期')
        }
      }
      return err
    },
    submit() {
      const err = this.validateForm()
      if (err.length) {
        uni.showToast({ title: err[0], icon: 'none' })
        return
      }
      this.submitLoading = true
      const submitForm = {
        ...this.form,
        machineryList: this.machineryList,
        subjectList: this.subjectList,
        isFlag : 'app'
      }
      const api = this.form.planId ? updateCheckPlan(submitForm) : addCheckPlan(submitForm)
      api.then(() => {
        uni.showToast({ title: this.form.planId ? '修改成功' : '新增成功', icon: 'success' })
        this.$emit('success', this.form, this.mode)
        uni.$emit('refreshCheckplanList', true);
        setTimeout(() => {
          this.visible = false
          this.submitLoading = false
          uni.navigateBack()
        }, 1000)
      }).catch(() => {
        uni.showToast({ title: '操作失败', icon: 'none' })
        this.submitLoading = false
      })
    },
    setData(data) {
      Object.assign(this.form, data)
      this.tabList[1].name = data.planType === 'CHECK' ? '点检项目' : '保养项目';
      this.updateTabsVisibility();
    },
    handleSelectMachinery() {
      this.showMachineryPopup = true
      this.selectedMachineryIds = []
      this.loadMachineryList()
    },

    // 获取设备类型列表
    async fetchMachineryTypeList() {
      try {
        const res = await listMachineryType();
        if (res.code === 200) {
          this.machineryTypeOptions = [
            { label: '全部', value: 'all' },
            ...(res.data || []).map(item => ({
              label: item.label,
              value: item.machineryTypeId
            }))
          ];
        }
      } catch (error) {
        uni.showToast({ title: '加载设备类型失败', icon: 'none' });
      }
    },

    // 加载设备列表
    async loadMachineryList(append = false) {
      if (append && this.machineryListTemp.length >= this.machineryTotal) {
        return
      }
      if (append) {
        this.machineryLoadingMore = true
      } else {
        this.machineryLoading = true
      }

      try {
        const params = {
          searchValue: this.machinerySearchValue,
          pageNum: append ? this.machineryPage + 1 : 1,
          pageSize: this.machineryPageSize
        }

        // 设备类型筛选
        if (this.selectedMachineryType.value !== 'all') {
          params.machineryTypeId = this.selectedMachineryType.value;
        }

        const res = await listMachinery(params)
        if (res.code === 200) {
          const newData = res.rows || []
          // 更新数据和分页信息
          if (append) {
            this.machineryListTemp = [...this.machineryListTemp, ...newData]
            this.machineryPage += 1
          } else {
            this.machineryListTemp = newData
            this.machineryPage = 1
          }
          this.machineryTotal = Number(res.total) || 0
        } else {
          uni.showToast({
            title: res.msg || '加载设备列表失败',
            icon: 'none'
          })
          if (!append) {
            this.machineryListTemp = []
            this.machineryTotal = 0
          }
        }
      } catch (error) {
        console.error('加载设备列表出错：', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
        if (!append) {
          this.machineryListTemp = []
          this.machineryTotal = 0
        }
      } finally {
        // 关闭加载状态
        if (append) {
          this.machineryLoadingMore = false
        } else {
          this.machineryLoading = false
        }
      }
    },

    // 搜索输入处理
    handleMachineryInput() {
      // 搜索时重置分页
      this.machineryPage = 1
      this.machineryTotal = 0
      clearTimeout(this.machinerySearchTimer)
      this.machinerySearchTimer = setTimeout(() => {
        this.loadMachineryList()
      }, 300)
    },

    // 搜索设备
    handleMachinerySearch() {
      this.machineryPage = 1
      this.machineryTotal = 0
      this.loadMachineryList()
    },

    // 加载更多设备
    handleMachineryLoadMore() {
      if (!this.machineryLoading && !this.machineryLoadingMore && this.machineryListTemp.length < this.machineryTotal) {
        this.loadMachineryList(true)
      }
    },
    // 切换设备选中状态
    toggleSelectMachinery(machinery) {
      const index = this.selectedMachineryIds.indexOf(machinery.machineryId);
      if (index > -1) {
        this.selectedMachineryIds.splice(index, 1);
      } else {
        this.selectedMachineryIds.push(machinery.machineryId);
      }
    },

    // 确认选择设备
    confirmMachinerySelect() {
      if (this.selectedMachineryIds.length === 0) {
        uni.showToast({ title: '请至少选择一台设备', icon: 'none' });
        return;
      }

      // 获取选中的设备详情
      const selectedItems = this.machineryListTemp.filter(item =>
          this.selectedMachineryIds.includes(item.machineryId)
      );

      // 批量添加到设备列表，避免重复
      selectedItems.forEach(machinery => {
        const isExist = this.machineryList.some(item => item.machineryId === machinery.machineryId);
        if (!isExist) {
          this.machineryList.push({
            ...machinery,
            remark: ''
          });
        }
      });

      // 关闭弹窗
      this.showMachineryPopup = false;
      uni.showToast({ title: `已选择${this.selectedMachineryIds.length}台设备`, icon: 'success' });
      this.selectedMachineryIds = [];
    },

    // 删除设备
    delMachinery(index) {
      uni.showModal({
        title: '提示',
        content: '确定删除该设备吗？',
        success: (res) => {
          if (res.confirm) {
            this.machineryList.splice(index, 1)
          }
        }
      })
    },

    // 打开项目选择弹窗
    handleSelectSubject() {
      this.showSubjectPopup = true
      this.selectedSubjectIds = [] // 清空选中状态
      this.loadSubjectList()
    },

    // 加载项目列表
    async loadSubjectList(append = false) {
      if (append && this.subjectListTemp.length >= this.subjectTotal) {
        return
      }

      // 设置加载状态
      if (append) {
        this.subjectLoadingMore = true
      } else {
        this.subjectLoading = true
      }

      try {
        const params = {
          searchValue: this.subjectSearchValue,
          subjectType: this.form.planType === 'CHECK' ? 'CHECK' : 'MAINTEN', // 根据计划类型筛选
          pageNum: append ? this.subjectPage + 1 : 1,
          pageSize: this.subjectPageSize
        }

        const res = await listDvsubject(params)
        if (res.code === 200) {
          const newData = res.rows || []
          // 更新数据和分页信息
          if (append) {
            this.subjectListTemp = [...this.subjectListTemp, ...newData]
            this.subjectPage += 1
          } else {
            this.subjectListTemp = newData
            this.subjectPage = 1
          }
          this.subjectTotal = Number(res.total) || 0
        } else {
          uni.showToast({
            title: res.msg || '加载项目列表失败',
            icon: 'none'
          })
          if (!append) {
            this.subjectListTemp = []
            this.subjectTotal = 0
          }
        }
      } catch (error) {
        console.error('加载项目列表出错：', error)
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
        if (!append) {
          this.subjectListTemp = []
          this.subjectTotal = 0
        }
      } finally {
        // 关闭加载状态
        if (append) {
          this.subjectLoadingMore = false
        } else {
          this.subjectLoading = false
        }
      }
    },

    // 项目搜索输入处理
    handleSubjectInput() {
      this.subjectPage = 1
      this.subjectTotal = 0
      clearTimeout(this.subjectSearchTimer)
      this.subjectSearchTimer = setTimeout(() => {
        this.loadSubjectList()
      }, 300)
    },

    // 搜索项目
    handleSubjectSearch() {
      this.subjectPage = 1
      this.subjectTotal = 0
      this.loadSubjectList()
    },

    // 加载更多项目
    handleSubjectLoadMore() {
      if (!this.subjectLoading && !this.subjectLoadingMore && this.subjectListTemp.length < this.subjectTotal) {
        this.loadSubjectList(true)
      }
    },

    // 切换项目选中状态
    toggleSelectSubject(subject) {
      const index = this.selectedSubjectIds.indexOf(subject.subjectId);
      if (index > -1) {
        this.selectedSubjectIds.splice(index, 1);
      } else {
        this.selectedSubjectIds.push(subject.subjectId);
      }
    },

    // 确认选择项目
    confirmSubjectSelect() {
      if (this.selectedSubjectIds.length === 0) {
        uni.showToast({ title: '请至少选择一个项目', icon: 'none' });
        return;
      }

      // 获取选中的项目详情
      const selectedItems = this.subjectListTemp.filter(item =>
          this.selectedSubjectIds.includes(item.subjectId)
      );

      selectedItems.forEach(subject => {
        const isExist = this.subjectList.some(item => item.subjectId === subject.subjectId);
        if (!isExist) {
          this.subjectList.push({
            ...subject,
            remark: ''
          });
        }
      });

      // 关闭弹窗
      this.showSubjectPopup = false;
      uni.showToast({ title: `已选择${this.selectedSubjectIds.length}个项目`, icon: 'success' });
      this.selectedSubjectIds = [];
    },

    // 删除项目
    delSubject(index) {
      uni.showModal({
        title: '提示',
        content: '确定删除该项目吗？',
        success: (res) => {
          if (res.confirm) {
            this.subjectList.splice(index, 1)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.value-picker {
  width: 100%;
}

.container {
  background-color: #F5F5F5;
  min-height: 100vh;
}
.content {
  padding: 30rpx;
  padding-bottom: 120rpx;
}
.form-row {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  &.disabled {
    background: #F9F9F9;
    .value { color: #999; }
    pointer-events: none;
  }
  .label {
    font-size: 28rpx;
    color: #333;
    width: 180rpx;
    flex-shrink: 0;
    font-weight: 500;
  }
  .value-section {
    flex: 1;
    display: flex;
    align-items: center;
    .value {
      font-size: 28rpx;
      color: #666;
      flex: 1;
    }
    .form-input {
      width: 100%;
      font-size: 28rpx;
      padding: 15rpx;
      border: 1px solid #E5E5E5;
      border-radius: 8rpx;
    }
    .textarea-input {
      width: 100%;
      min-height: 160rpx;
      font-size: 28rpx;
      padding: 15rpx;
      border: 1px solid #E5E5E5;
      border-radius: 8rpx;
    }
  }
}
.cycle-row {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  &.disabled {
    background: #F9F9F9;
    .value { color: #999; }
    pointer-events: none;
  }
  .label {
    width: 180rpx;
    flex-shrink: 0;
    font-size: 28rpx;
    color: #333;
  }
  .cycle-content {
    flex: 1;
    display: flex;
    gap: 20rpx;
    align-items: center;
    .cycle-count {
      flex: 1;
      padding: 15rpx;
      border: 1px solid #E5E5E5;
      border-radius: 8rpx;
    }
    .cycle-type {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx;
      border: 1px solid #E5E5E5;
      border-radius: 8rpx;
      .value {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}
.form-row:last-of-type {
  flex-direction: column;
  align-items: flex-start;
  .label {
    width: 100%;
    margin-bottom: 15rpx;
  }
  .value-section {
    width: 100%;
  }
}
.tabs-container {
  margin-top: 30rpx;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.custom-tabs {
  display: flex;
  width: 100%;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

.custom-tab-item {
  flex: 1;
  height: 88rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  font-weight: 500;
}

.tab-underline {
  position: absolute;
  bottom: 0;
  width: 60rpx;
  height: 4rpx;
  background-color: #2979FF;
  border-radius: 2rpx;
}

.tab-content-card {
  padding: 20rpx;
}
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
.product-cards {
  margin-top: 10rpx;
}
.product-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
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
        width: 160rpx;
        font-size: 28rpx;
        color: #666666;
        flex-shrink: 0;
      }
      .value {
        flex: 1;
        font-size: 28rpx;
        color: #333333;
      }
      .input-value {
        flex: 1;
        padding: 10rpx 10rpx;
        border: 1rpx solid #e0e0e0;
        border-radius: 6rpx;
        font-size: 28rpx;
        color: #333;
        &.full-width {
          width: 100%;
        }
      }
    }
  }
}
.empty-state {
  margin-top: 50rpx;
  text-align: center;
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  border-top: 1rpx solid #f0f0f0;
  .cancel-btn {
    width: 48%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: #F5F5F5;
    color: #666;
    border-radius: 44rpx;
    font-size: 28rpx;
  }
  .save-btn {
    width: 48%;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2979FF;
    color: #fff;
    border-radius: 44rpx;
    font-size: 28rpx;
    gap: 10rpx;
    &.loading {
      opacity: 0.8;
      pointer-events: none;
    }
  }
}
.assign-modal {
  background: #fff;
  border-radius: 16rpx 16rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
  .modal-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }
}

.assign-modal-content {
  flex: 1;
  padding: 20rpx 30rpx;
  max-height: 60vh;
  overflow: hidden;
}

.selected-info {
  margin-bottom: 20rpx;
  .selected-title {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 10rpx;
    display: block;
  }
  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
  }
  .selected-tag {
    background: #F5F7FA;
    border-radius: 20rpx;
    padding: 8rpx 16rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    .tag-text {
      font-size: 24rpx;
      color: #333;
    }
    .tag-delete {
      margin-left: 8rpx;
    }
  }
}

.user-search-bar {
  margin-bottom: 20rpx;
  .user-search-input-wrapper {
    display: flex;
    align-items: center;
    background: #F5F7FA;
    border-radius: 8rpx;
    padding: 0 20rpx;
    height: 72rpx;
  }
  .user-search-icon {
    margin-right: 10rpx;
  }
  .user-search-input {
    flex: 1;
    height: 100%;
    font-size: 26rpx;
    color: #333;
    background: transparent;
    border: none;
    outline: none;
  }
  .clear-search-icon {
    margin-left: 10rpx;
  }
}

.user-list {
  height: 400rpx;
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20rpx 0;
  }
  .empty-users {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40rpx 0;
    .empty-text {
      font-size: 26rpx;
      color: #999;
    }
  }
  .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    &.active {
      .user-name {
        color: #2979FF;
        font-weight: 500;
      }
    }
    .user-name {
      font-size: 28rpx;
      color: #333;
    }
  }
}

.modal-footer {
  padding: 20rpx 30rpx;
  display: flex;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  button {
    flex: 1;
    height: 72rpx;
    border-radius: 8rpx;
  }
}

.machinery-popup-content {
  width: 100%;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.search-section {
  padding: 10rpx 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.machinery-search {
  width: 100%;
  border-radius: 6rpx;
}

.search-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.search-btn {
  flex-shrink: 0;
  padding: 0 24rpx;
  width: 50rpx;
}

.filter-section {
  padding: 5rpx 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.dropdown-wrapper {
  min-width: 140rpx;
  width: 100%;
}

:deep(.u-dropdown__content) {
  width: 100vw !important;
  left: 0 !important;
}

:deep(.u-dropdown__content__popup) {
  width: 100% !important;
}

.machinery-scroll {
  flex: 1;
  overflow: hidden;
}

.machinery-list {
  padding: 0;
}

.machinery-item {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
  background-color: #fff;
  position: relative;
}

.machinery-item:active {
  background-color: #f5f5f5;
}

.machinery-item:last-child {
  border-bottom: none;
}

.machinery-item.active {
  background-color: #f0f8ff;
}

.machinery-info {
  flex: 1;
}

.machinery-item .machinery-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.machinery-item .machinery-code {
  color: #999;
  font-size: 24rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.machinery-item .u-icon {
  flex-shrink: 0;
  margin-left: 20rpx;
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15rpx;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  background-color: #fff;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0;
  background-color: #fff;
}

.loading-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  background-color: #fff;
  font-size: 24rpx;
  color: #999;
}

.no-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
  background-color: #fff;
  font-size: 24rpx;
  color: #999;
}

.empty-container {
  text-align: center;
  padding: 80rpx 0;
  color: #999;
  font-size: 28rpx;
  background-color: #fff;
}
</style>