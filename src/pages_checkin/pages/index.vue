<template>
  <view class="container">
    <!-- 顶部信息栏 -->
    <view class="header">
      <view class="user-info">
        <view class="avatar">{{ username.charAt(0) }}</view>
        <view class="user-text">
          <text class="name">{{ username }}</text>
          <text class="rule" @click="showCheckinRules">考勤规则</text>
        </view>
        <!-- <text class="record-btn" @click="viewCheckinRecord">查看记录</text> -->
      </view>
      <view class="attend-record">
        <view class="record-item">
          <text class="label">上班{{ checkinTimeRules.morningStart }}</text>
          <view class="record-desc">
            <text class="time" :class="{ 'checked': morningChecked }">{{ morningCheckinTime || '未打卡' }}</text>
          </view>
        </view>
        <view class="record-item">
          <text class="label">下班{{ checkinTimeRules.afternoonEnd }}</text>
          <view class="record-desc">
            <text class="time" :class="{ 'checked': afternoonChecked }">{{ afternoonCheckinTime || '未打卡' }}</text>
            <text class="update" v-if="afternoonChecked" @click="updateAfternoonCheckin">更新打卡</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 中间打卡按钮 -->
    <view class="checkin-area">
      <view class="checkin-btn" @click="handleCheckin">
        <text class="btn-title">{{ checkinType }}</text>
        <text class="btn-date">{{ currentDate }}</text>
        <text class="btn-time">{{ currentTime }}</text>
      </view>
	  <view class="checkin-tip">
	    <text class="tip-text current-location">{{ addressInfo }}</text>
	  </view>
	  <view class="checkin-tip">
	    <text class="tip-icon">📍</text>
	    <text class="tip-text">经度: {{ currentLocation.longitude.toFixed(6) }} | 纬度: {{ currentLocation.latitude.toFixed(6) }}</text>
	  </view>
	  <view class="checkin-tip">
	    <text class="tip-icon">🏢</text>
	    <text class="tip-text">考勤地点: {{ checkinRange.address || '公司' }}</text>
	  </view>
    </view>
    
    <!-- 打卡确认弹窗 -->
    <view class="checkin-confirm" v-if="showConfirmDialog">
      <view class="confirm-content">
        <text class="confirm-title">确认打卡</text>
        <text class="confirm-info">请确认以下信息后进行打卡</text>
        <view class="confirm-details">
          <text class="detail-item">打卡类型: {{ currentCheckinTypeText }}</text>
          <text class="detail-item">打卡时间: {{ currentTime }}</text>
          <text class="detail-item">打卡位置: {{ addressInfo }}</text>
          <text class="detail-item">考勤时间: {{ checkinTimeRules.morningStart }} - {{ checkinTimeRules.afternoonEnd }}</text>
          <text class="detail-item">打卡范围: {{ checkinRange.disc }}米</text>
        </view>
        <view class="remark-section">
          <text class="remark-label">打卡备注 (选填):</text>
          <textarea class="remark-input" v-model="checkinRemark" placeholder="请输入打卡备注" :disabled="loading"></textarea>
        </view>
        <view class="confirm-actions">
          <button class="cancel-btn" @click="cancelCheckin" :disabled="loading">取消</button>
          <button class="confirm-btn" @click="confirmCheckin" :disabled="loading">
            <text v-if="loading">打卡中...</text>
            <text v-else>确认打卡</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import API from '@/api';

export default {
  data() {
    return {
      username: '',
      checkinType: "下班打卡", // 动态切换：上班/下班
      locationRan: false,
      addressInfo: "",
      currentDate: "",
      currentTime: "",
      // 当前位置坐标
      currentLocation: {
        latitude: 0,
        longitude: 0
      },
      // 打卡状态
      morningChecked: false,
      morningCheckinTime: '',
      afternoonChecked: false,
      afternoonCheckinTime: '',
      // 打卡规则
      checkinRules: [],
      // 打卡确认弹窗
      showConfirmDialog: false,
      // 打卡备注
      checkinRemark: '',
      // 打卡类型（用于记录当前正在进行的打卡类型）
      currentCheckinType: '',
      // 考勤配置
      attendConfig: {},
      // 操作状态
      opstatus: false,
      // 上班打卡状态 1:已打卡 0:未打卡
      onStatus: 0,
      // 下班打卡状态 1:已打卡 0:未打卡
      offStatus: 0,
      // 加载状态
      loading: false,
      // 打卡时间规则
      checkinTimeRules: {
        morningStart: '09:00',
        morningEnd: '12:00',
        afternoonStart: '13:00',
        afternoonEnd: '18:00'
      },
      // 打卡范围配置
      checkinRange: {
        lon: 0,
        lat: 0,
        disc: 500, // 默认500米
        address: ''
      }
    };
  },
  computed: {
    // 打卡类型文本
    currentCheckinTypeText() {
      return this.currentCheckinType === 'morning' ? '上班打卡' : '下班打卡';
    }
  },
  onLoad() {
    try {
      // 获取登录用户信息
      this.username = uni.getStorageSync('USER_INFO')?.userName || '用户';
      // 获取当前时间
      this.updateCurrentTime();
      // 开始定位
      this.getLocation();
      // 获取打卡规则
      this.getCheckinRules();
      // 获取考勤配置
      this.getAttendConfig();
      // 获取打卡状态
      this.getAttendStatusDay();
      this.getOffWorkAttendStatusDay();
    } catch (error) {
      console.error('onLoad错误:', error);
      console.error('错误堆栈:', error.stack);
      uni.showToast({ title: '初始化失败: ' + error.message, icon: 'none' });
    }
  },
  methods: {
    // 获取打卡规则
    getCheckinRules() {
      // 从考勤配置中提取规则
      if (this.attendConfig) {
        this.checkinRules = [];
        // 添加打卡时间规则
        if (this.attendConfig.beginTime) {
          this.checkinRules.push(`上班时间：${this.attendConfig.beginTime}`);
        }
        if (this.attendConfig.endTime) {
          this.checkinRules.push(`下班时间：${this.attendConfig.endTime}`);
        }
        // 添加打卡范围规则
        if (this.attendConfig.address) {
          this.checkinRules.push(`打卡地点：${this.attendConfig.address}`);
        }
        if (this.attendConfig.disc) {
          this.checkinRules.push(`打卡范围：${this.attendConfig.disc}米`);
        }
      } else {
        this.checkinRules = [];
      }
    },
    // 显示打卡规则
    showCheckinRules() {
      if (this.checkinRules.length === 0) {
        uni.showToast({ title: '暂无打卡规则', icon: 'none' });
        return;
      }
      
      let ruleContent = '';
      this.checkinRules.forEach((rule, index) => {
        ruleContent += `${index + 1}. ${rule}\n`;
      });
      
      uni.showModal({
        title: '打卡规则',
        content: ruleContent,
        showCancel: false
      });
    },
    // 更新当前时间
    updateCurrentTime() {
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekDay = weekDays[now.getDay()];
      this.currentDate = `${month}月${day}日 ${weekDay}`;
      
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      this.currentTime = `${hours}:${minutes}:${seconds}`;
      
      // 根据当前时间更新打卡类型
      this.updateCheckinType();
      
      // 每秒更新一次时间
      setTimeout(() => {
        this.updateCurrentTime();
      }, 1000);
    },
    // 根据当前时间更新打卡类型
    updateCheckinType() {
      const now = new Date();
      const hours = now.getHours();
      
      if (hours < 12) {
        // 上午，上班打卡
        if (this.morningChecked) {
          this.checkinType = "更新\n上班打卡";
        } else {
          this.checkinType = "上班打卡";
        }
      } else {
        // 下午，下班打卡
        if (this.afternoonChecked) {
          this.checkinType = "更新\n下班打卡";
        } else {
          this.checkinType = "下班打卡";
        }
      }
    },
    // 获取当前位置
    getLocation() {
      // 直接获取位置，避免使用可能不存在的uni.getSetting和uni.authorize
      console.log('直接获取位置');
      this.doGetLocation();
    },
    // 执行获取位置操作
    doGetLocation() {
      uni.getLocation({
        type: 'gcj02',
        altitude: true,
        accuracy: 'high',
        success: (res) => {
          console.log('获取位置成功:', res);
          this.currentLocation = {
            latitude: res.latitude,
            longitude: res.longitude
          };
          // 逆地理编码获取地址
          this.getAddressInfo(res.latitude, res.longitude);
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
          uni.showToast({ title: '获取位置失败: ' + (err.errMsg || '未知错误'), icon: 'none' });
        }
      });
    },
    // 获取地址信息
    getAddressInfo(latitude, longitude) {
      uni.request({
        url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77`,
        success: (res) => {
          if (res.data.status === 0) {
            this.addressInfo = res.data.result.address;
          }
        }
      });
    },
    // 获取考勤配置
    async getAttendConfig() {
      try {
        const userInfo = uni.getStorageSync('USER_INFO');
        console.log("用戶信息",userInfo.attend);
        if (!userInfo || !userInfo.attend) {
          uni.showToast({ title: '请联系管理员正确设置个人考勤规则', icon: 'none' });
          return;
        }
        
        console.log("获取考勤配置信息响应--0");
        // 直接使用URL参数拼接的方式
        const configId = userInfo.attend;
        const res = await API.system.attendConfig.getAttendConfigById.get({ configId });
        console.log("获取考勤配置信息响应",res);
        if (res.code === 200) {
          if (res.data) {
            this.attendConfig = res.data;
            this.opstatus = true;
            
            // 从考勤配置中提取打卡时间规则
            this.extractCheckinTimeRules(res.data);
            // 获取打卡规则
            this.getCheckinRules();
          } else {
            uni.showToast({ title: '请联系管理员正确设置个人考勤规则', icon: 'none' });
          }
        } else {
          uni.showToast({ title: res.message || '获取考勤配置失败', icon: 'none' });
        }
      } catch (error) {
        console.error('获取考勤配置失败:', error);
        uni.showToast({ title: '获取考勤配置失败', icon: 'none' });
      }
    },
    // 从考勤配置中提取打卡时间规则和范围配置
    extractCheckinTimeRules(config) {
      // 提取打卡时间规则
      if (config.beginTime) {
        this.checkinTimeRules.morningStart = config.beginTime;
      }
      if (config.endTime) {
        this.checkinTimeRules.afternoonEnd = config.endTime;
      }
      
      // 提取打卡范围配置
      if (config.lon) {
        this.checkinRange.lon = config.lon;
      }
      if (config.lat) {
        this.checkinRange.lat = config.lat;
      }
      if (config.disc) {
        this.checkinRange.disc = config.disc;
      }
      if (config.address) {
        this.checkinRange.address = config.address;
      }
      
      console.log('提取的打卡时间规则:', this.checkinTimeRules);
      console.log('提取的打卡范围配置:', this.checkinRange);
    },
    // 获取上班打卡状态
    async getAttendStatusDay() {
      try {
        console.log('开始获取上班打卡状态');
        const res = await API.office.attend.getAttendStatusDay.get();
        console.log('获取上班打卡状态响应:', res);
        if (res.code === 200) {
          this.onStatus = res.data.status;
          this.morningChecked = res.data.status === 1 || res.data.status === '1';
          if (this.morningChecked) {
            // 如果已打卡，更新打卡时间
            this.morningCheckinTime = '已打卡';
          }
          // 更新打卡类型
          this.updateCheckinType();
        } else {
          uni.showToast({ title: res.message || '获取打卡状态失败', icon: 'none' });
        }
      } catch (error) {
        console.error('获取上班打卡状态失败:', error);
      }
    },
    // 获取下班打卡状态
    async getOffWorkAttendStatusDay() {
      try {
        console.log('开始获取下班打卡状态');
        const res = await API.office.attend.getOffWorkAttendStatusDay.get();
        console.log('获取下班打卡状态响应:', res);
        if (res.code === 200) {
          this.offStatus = res.data.status;
          this.afternoonChecked = res.data.status === 1 || res.data.status === '1';
          if (this.afternoonChecked) {
            // 如果已打卡，更新打卡时间
            this.afternoonCheckinTime = '已打卡';
          }
          // 更新打卡类型
          this.updateCheckinType();
        } else {
          uni.showToast({ title: res.message || '获取打卡状态失败', icon: 'none' });
        }
      } catch (error) {
        console.error('获取下班打卡状态失败:', error);
      }
    },
    // 处理打卡
    handleCheckin() {
      const now = new Date();
      const hours = now.getHours();
      
      if (hours < 12) {
        // 上班打卡
        if (this.morningChecked) {
          uni.showToast({ title: '上班已打卡，请勿重复打卡', icon: 'none' });
          return;
        }
        this.checkinType = "上班打卡";
        this.currentCheckinType = 'morning';
      } else {
        // 下班打卡
        if (this.afternoonChecked) {
          this.checkinType = "更新\n下班打卡";
        } else {
          this.checkinType = "下班打卡";
        }
        this.currentCheckinType = 'afternoon';
      }
      
      // 显示打卡确认弹窗
      this.showConfirmDialog = true;
    },
    // 执行打卡
    async doCheckin(type) {
      try {
        this.loading = true;
        
        const userInfo = uni.getStorageSync('USER_INFO');
        if (!userInfo || !userInfo.attend) {
          uni.showToast({ title: '请联系管理员正确设置个人考勤规则', icon: 'none' });
          return;
        }
        
        // 构建打卡数据
        const checkinData = {
          configId: userInfo.attend,
          address: this.addressInfo || '',
          status: type === 'morning' ? '1' : '2',
          longitude: this.currentLocation.longitude.toString(),
          latitude: this.currentLocation.latitude.toString(),
          source: 'app',
          remark: this.checkinRemark || ''
        };
        
        console.log('打卡数据:', checkinData);
        
        // 调用后台接口上传打卡数据
        const res = await API.office.attend.insertAttend.post(checkinData);
        
        if (res.code === 200) {
          const now = new Date();
          const hours = now.getHours().toString().padStart(2, '0');
          const minutes = now.getMinutes().toString().padStart(2, '0');
          const time = `${hours}:${minutes}`;
          
          if (type === 'morning') {
            this.morningChecked = true;
            this.morningCheckinTime = time;
            this.onStatus = '1';
          } else {
            this.afternoonChecked = true;
            this.afternoonCheckinTime = time;
            this.offStatus = '1';
          }
          
          uni.showToast({ title: '打卡成功', icon: 'success' });
          this.showConfirmDialog = false;
          this.checkinRemark = '';
        } else {
          uni.showToast({ title: res.message || '打卡失败', icon: 'none' });
        }
      } catch (error) {
        console.error('打卡失败:', error);
        uni.showToast({ title: '打卡失败，请稍后重试', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },
    // 更新下班打卡
    updateAfternoonCheckin() {
      this.currentCheckinType = 'afternoon';
      this.showConfirmDialog = true;
    },
    // 取消打卡
    cancelCheckin() {
      this.showConfirmDialog = false;
      this.checkinRemark = '';
    },
    // 确认打卡
    confirmCheckin() {
      this.doCheckin(this.currentCheckinType);
    },
    // 查看打卡记录
    viewCheckinRecord() {
      uni.navigateTo({
        url: '/pages_checkin/pages/record/index'
      });
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 12px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1890ff;
  color: white;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.user-text {
  flex: 1;
}

.name {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  display: block;
  margin-bottom: 3px;
}

.rule {
  font-size: 11px;
  color: #1890ff;
  text-decoration: underline;
}

.record-btn {
  font-size: 11px;
  color: #1890ff;
  text-decoration: underline;
  margin-left: 10px;
}

.attend-record {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.record-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.record-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 13px;
  color: #5a5a5a;
  width: 70px;
}

.record-desc {
  flex: 1;
  display: flex;
  align-items: center;
}

.checked {
  margin-right: 6px;
}

.time {
  font-size: 13px;
  font-weight: 500;
  color: #262626;
  margin-right: 8px;
}

.time.checked {
  font-weight: 600;
  color: #52c41a;
}

.update {
  font-size: 11px;
  color: #1890ff;
}

.checkin-area {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.checkin-btn {
  background: #1890ff;
  color: white;
  border-radius: 50%;
  width: 180px;
  height: 180px;
  margin: 10px auto 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4);
  }
  70% {
    transform: scale(1.02);
    box-shadow: 0 0 0 15px rgba(24, 144, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
  }
}

.btn-title {
  font-size: 20px;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
  text-align: center;
}

.btn-date {
  font-size: 12px;
  margin-bottom: 4px;
  display: block;
  text-align: center;
}

.btn-time {
  font-size: 14px;
  font-weight: 500;
  display: block;
  text-align: center;
}

.checkin-tip {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 6px 10px;
  background: #f9f9f9;
  border-radius: 8px;
}

.tip-icon {
  margin-right: 6px;
  font-size: 12px;
}

.tip-text {
  font-size: 11px;
  color: #5a5a5a;
  flex: 1;
}

.current-location {
  font-size: 13px;
  font-weight: bold;
  color: #1890ff;
}

/* 打卡确认弹窗 */
.checkin-confirm {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.confirm-content {
  background: white;
  border-radius: 12px;
  padding: 18px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.confirm-title {
  font-size: 17px;
  font-weight: 600;
  color: #262626;
  text-align: center;
  margin-bottom: 12px;
  display: block;
}

.confirm-info {
  font-size: 13px;
  color: #5a5a5a;
  text-align: center;
  margin-bottom: 15px;
  display: block;
}

.confirm-details {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
}

.detail-item {
  font-size: 13px;
  color: #262626;
  display: block;
  margin-bottom: 6px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.remark-section {
  margin-bottom: 15px;
}

.remark-label {
  font-size: 13px;
  color: #5a5a5a;
  display: block;
  margin-bottom: 6px;
}

.remark-input {
  width: 100%;
  height: 80px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 8px;
  font-size: 13px;
  color: #262626;
  resize: none;
  box-sizing: border-box;
}

.confirm-actions {
  display: flex;
  gap: 8px;
}

.cancel-btn {
  flex: 1;
  height: 44px;
  background-color: #fff;
  color: #606266;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 15px;
}

.confirm-btn {
  flex: 1;
  height: 44px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
}
</style>