<template>
  <view class="login-page">
    <!-- 简约背景 -->
    <view class="bg-simple">
      <view class="bg-gradient"></view>
    </view>

    <view class="login-content">
      <!-- 品牌区域 -->
      <view class="brand-section">
        <view class="brand-container">
          <image class="brand-logo" :src="globalConfig.appInfo.logo" mode="aspectFill"></image>
          <view class="brand-text">
            <h1 class="brand-title">{{ globalConfig.appInfo.name || '企业办公平台' }}</h1>
            <p class="brand-subtitle">安全可靠的数字化工作空间</p>
          </view>
        </view>
      </view>

      <!-- 登录表单区域 -->
      <view class="form-section">
        <view class="form-container">
          <view class="form-header">
            <h2 class="form-title">账号登录</h2>
          </view>

          <form class="login-form" @submit.prevent="handleLogin">
            <!-- 租户选择 -->
            <!-- <view class="form-item" v-if="tenantEnabled">
              <view class="select-wrapper">
                <uni-data-select
                  v-model="loginForm.tenantId"
                  :localdata="range"
                  placeholder="选择租户"
                  class="elegant-select"
                ></uni-data-select>
              </view>
            </view> -->

            <!-- 用户名 -->
            <view class="form-item">
              <view class="input-wrapper" :class="{ focused: isUsernameFocused }">
                <uni-icons class="input-icon" type="person" size="20" color="#666"></uni-icons>
                <input
                  v-model="loginForm.accountId"
                  class="elegant-input"
                  type="text"
                  placeholder="用户名"
                  @focus="isUsernameFocused = true"
                  @blur="isUsernameFocused = false"
                />
              </view>
            </view>

            <!-- 密码 -->
            <view class="form-item">
              <view class="input-wrapper" :class="{ focused: isPasswordFocused }">
                <uni-icons class="input-icon" type="locked" size="20" color="#666"></uni-icons>
                <input
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="elegant-input"
                  placeholder="密码"
                  @focus="isPasswordFocused = true"
                  @blur="isPasswordFocused = false"
                />
                <view class="password-toggle" @click="togglePasswordVisibility">
                  <uni-icons
                    :type="showPassword ? 'eye-off' : 'eye'"
                    size="18"
                    color="#999"
                  ></uni-icons>
                </view>
              </view>
            </view>

            <!-- 验证码 -->
            <view class="form-item" v-if="captchaEnabled">
              <view class="captcha-wrapper">
                <view class="input-wrapper captcha-input" :class="{ focused: isCodeFocused }">
                  <uni-icons class="input-icon" type="text" size="20" color="#666"></uni-icons>
                  <input
                    v-model="loginForm.code"
                    type="number"
                    class="elegant-input"
                    placeholder="验证码"
                    @focus="isCodeFocused = true"
                    @blur="isCodeFocused = false"
                  />
                </view>
                <image :src="codeUrl" @click="getCode" class="captcha-img"></image>
              </view>
            </view>

            <!-- 错误提示 -->
            <view v-if="errorMessage" class="error-message">
              <uni-icons type="warn" size="16" color="#ff4d4f"></uni-icons>
              <span>{{ errorMessage }}</span>
            </view>

            <!-- 操作区域 -->
            <view class="form-actions">
              <button
                class="login-btn"
                :class="{ loading: isLoading }"
                :disabled="isLoading"
                @click="handleLogin"
              >
                <text v-if="!isLoading">登录</text>
                <text v-else>登录中...</text>
              </button>
<!--              <button-->
<!--                  class="login-btn"-->
<!--                  @click="handlePrint"-->
<!--              >测试-->
<!--              </button>-->
            </view>
          </form>

          <!-- 底部信息 -->
          <view class="form-footer">
            <text class="footer-text" @click="handleFooterClick">
              技术支持：中科凯思 v{{globalConfig.appInfo.version}}
              <!-- <text class="link" @click="handlePrivacy">《隐私政策》</text>
              和
              <text class="link" @click="handleUserAgrement">《用户协议》</text> -->
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 修改后台地址弹窗 -->
    <uni-popup ref="configPopup" type="dialog">
      <uni-popup-dialog
        title="修改后台地址"
        :value="tempBaseUrl"
        placeholder="请输入后台地址"
        @confirm="confirmConfig"
        @close="closeConfigPopup"
      >
        <view class="config-dialog-content">
          <input
            v-model="tempBaseUrl"
            class="config-input"
            placeholder="请输入后台地址"
            type="text"
          />
        </view>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive, getCurrentInstance } from "vue";
import { getCodeImg, getTenantList } from '@/api/login';
import store from '@/store';
import config from '@/config.js';
import { tab } from '@/plugins';
import { getEncryptionConfig } from '@/utils/configManager';

// 获取当前加密类型
const getEncryptionType = () => {
  console.log("信息",getEncryptionConfig())
  return getEncryptionConfig()?.encryptionType || 'SM2';
};

// 获取组件实例
const { proxy } = getCurrentInstance();

// 全局配置
const globalConfig = ref(config);

// 状态管理
const isUsernameFocused = ref(false);
const isPasswordFocused = ref(false);
const isCodeFocused = ref(false);
const codeUrl = ref("");
const captchaEnabled = ref(false);
const tenantEnabled = ref(false);
const isLoading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const errorMessage = ref("");

// 配置弹窗相关
const configPopup = ref(null);
const tempBaseUrl = ref("");
const footerClickCount = ref(0);
let clickTimer = null;

// 登录表单数据
const loginForm = reactive({
  tenantId: '000000',
  accountId: "",
  password: "",
  code: "",
  uuid: ''
});

// 租户列表
const tenantList = ref([]);
const range = ref([]);

// 获取图形验证码
function getCode() {
  getCodeImg().then(res => {
    const { data } = res;
    captchaEnabled.value = data.captchaEnabled !== false;

    if (captchaEnabled.value) {
      codeUrl.value = 'data:image/gif;base64,' + data.img;
      loginForm.uuid = data.uuid;
    }
  }).catch(err => {
    console.error('获取验证码失败:', err);
    errorMessage.value = '获取验证码失败，请重试';
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  });
}

// 获取租户列表
function getTenant() {
  getTenantList().then(res => {
    const data = res.data;
    tenantEnabled.value = data.tenantEnabled !== false;

    if (tenantEnabled.value && data.voList && data.voList.length > 0) {
      tenantList.value = data.voList;
      loginForm.tenantId = tenantList.value[0].tenantId;

      // 构建选择器数据
      range.value = tenantList.value.map(row => ({
        value: row.tenantId,
        text: row.companyName
      }));
    }
  }).catch(err => {
    console.error('获取租户列表失败:', err);
  });
}

// 切换密码可见性
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

// 处理登录
async function handleLogin(e) {
  if (e && e.preventDefault) e.preventDefault();

  errorMessage.value = '';

  if (!loginForm.accountId.trim()) {
    errorMessage.value = '请输入用户名';
    return;
  }

  if (!loginForm.password) {
    errorMessage.value = '请输入密码';
    return;
  }

  if (captchaEnabled.value && !loginForm.code.trim()) {
    errorMessage.value = '请输入验证码';
    return;
  }

  isLoading.value = true;

  try {
    await pwdLogin();
  } catch (error) {
    console.error('登录过程出错:', error);
  } finally {
    isLoading.value = false;
  }
}

// 密码登录
async function pwdLogin() {
  try {
    const loginResult = await store.dispatch('Login', {
      accountId: await proxy.$encrypt[getEncryptionType()](loginForm.accountId),
      passWord:  await proxy.$encrypt[getEncryptionType()](loginForm.password),
      code: loginForm.code
    });
    
    // 登录成功后保存用户信息
    if (loginResult.data) {
      console.log('登录成功，保存用户信息:', loginResult.data);
    }
    
    await loginSuccess();

  } catch (error) {
    if (captchaEnabled.value) {
      getCode();
    }

    errorMessage.value = error.message || error.msg || '登录失败，请检查账号密码';

    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);

    throw error;
  }
}
async function handlePrint() {
  // 登录成功处理
  tab.reLaunch('/pages/print')
}

// 登录成功处理
async function loginSuccess() {
  try {
    // uni.showToast({
    //   title: '登录成功',
    //   icon: 'success',
    //   duration: 2000
    // });
    tab.reLaunch('/pages/index')
    // setTimeout(() => {
    //   uni.switchTab({
    //     url: '/pages/index'
    //   });
    // }, 1500);

  } catch (error) {
    console.error('登录成功处理失败:', error);
    errorMessage.value = '登录状态异常，请重试';
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  }
}

// 打开隐私协议
function handlePrivacy() {
  const site = globalConfig.value.appInfo.agreements?.[0];
  if (site && site.url) {
    uni.navigateTo({
      url: `/pages/common/webview/index?title=${encodeURIComponent(site.title)}&url=${encodeURIComponent(site.url)}`
    });
  }
}

// 打开用户协议
function handleUserAgrement() {
  const site = globalConfig.value.appInfo.agreements?.[1];
  if (site && site.url) {
    uni.navigateTo({
      url: `/pages/common/webview/index?title=${encodeURIComponent(site.title)}&url=${encodeURIComponent(site.url)}`
    });
  }
}

// 处理底部文本点击
function handleFooterClick() {
  footerClickCount.value++;

  // 清除之前的定时器
  if (clickTimer) {
    clearTimeout(clickTimer);
  }

  // 设置新的定时器，2秒后重置计数
  clickTimer = setTimeout(() => {
    footerClickCount.value = 0;
  }, 2000);

  // 点击6次后弹出配置弹窗
  if (footerClickCount.value >= 6) {
    footerClickCount.value = 0;
    tempBaseUrl.value = globalConfig.value.baseUrl;
    configPopup.value.open();
  }
}

// 确认修改配置
function confirmConfig() {
  if (tempBaseUrl.value && tempBaseUrl.value.trim()) {
    // 保存到localStorage
    uni.setStorageSync('customBaseUrl', tempBaseUrl.value.trim());
    // 更新当前配置
    globalConfig.value.baseUrl = tempBaseUrl.value.trim();
    uni.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 2000
    });
  }
}

// 关闭配置弹窗
function closeConfigPopup() {
  tempBaseUrl.value = "";
}

// 组件挂载时初始化
onMounted(() => {
  // 暂时注释掉获取验证码和租户列表的请求
  // getCode();
  // getTenant();
});
</script>

<style lang="scss">
page {
  height: 100vh;
  background: #fafbfc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  overflow: hidden;
}

.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.bg-simple {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.bg-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
}

.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
  background: #fff;
  overflow: hidden;
}

.brand-section {
  flex: 0 0 380rpx;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.brand-container {
  text-align: center;
  color: white;
}

.brand-logo {
  width: 90rpx;
  height: 90rpx;
  margin-bottom: 32rpx;
  border-radius: 8px;
}

.brand-title {
  font-size: 48rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
  letter-spacing: 0.5px;
}

.brand-subtitle {
  font-size: 26rpx;
  opacity: 0.9;
  font-weight: 300;
}

.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx;
}

.form-container {
  width: 100%;
}

.form-header {
  margin-bottom: 60rpx;
  text-align: center;
}

.form-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #262626;
  margin: 0;
}

.form-item {
  margin-bottom: 32rpx;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 88rpx;
  border-bottom: 1px solid #e8e8e8;
  transition: border-color 0.3s;
}

.input-wrapper.focused {
  border-bottom-color: #1890ff;
}

.input-icon {
  margin-right: 20rpx;
  color: #999;
  flex-shrink: 0;
}

.elegant-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 28rpx;
  color: #262626;
  background: transparent;
  padding: 0;
}

.elegant-input::placeholder {
  color: #bfbfbf;
}

.password-toggle {
  padding: 8rpx;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  margin-left: 10rpx;
}

.password-toggle:active {
  background-color: #f5f5f5;
}

.select-wrapper {
  height: 88rpx;
}

.elegant-select {
  width: 100%;
}

.elegant-select ::v-deep .uni-select {
  height: 100%;
  border: none;
  border-bottom: 1px solid #e8e8e8;
}

.elegant-select ::v-deep .uni-select__value {
  height: 100%;
  line-height: 88rpx;
  font-size: 28rpx;
  color: #262626;
  padding: 0;
}

.elegant-select ::v-deep .uni-select__placeholder {
  color: #bfbfbf;
  font-size: 28rpx;
}

.elegant-select ::v-deep .uni-select__icon {
  color: #999;
}

.captcha-wrapper {
  display: flex;
  gap: 20rpx;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-img {
  width: 160rpx;
  height: 60rpx;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  transition: opacity 0.2s;
}

.captcha-img:active {
  opacity: 0.7;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 20rpx;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  margin-bottom: 24rpx;
  animation: fadeIn 0.3s ease;
}

.error-message span {
  font-size: 24rpx;
  color: #ff4d4f;
  font-weight: 500;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-actions {
  margin-top: 48rpx;
}

.remember-area {
  margin-bottom: 32rpx;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  color: #666;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  color: white;
  border: none;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.login-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #40a9ff 0%, #69c0ff 100%);
  transform: translateY(-2px);
}

.login-btn:not(:disabled):hover::before {
  left: 100%;
}

.login-btn:not(:disabled):active {
  transform: translateY(0);
}

.login-btn:disabled {
  background: #f5f5f5;
  color: #bfbfbf;
  cursor: not-allowed;
  box-shadow: none;
}

.login-btn.loading {
  background: #e6f7ff;
  color: #1890ff;
  cursor: not-allowed;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.login-btn.loading::before {
  animation: loadingShine 1.5s infinite;
}

@keyframes loadingShine {
  0% { left: -100%; }
  100% { left: 100%; }
}

.form-footer {
  margin-top: 40rpx;
  text-align: center;
}

.footer-text {
  font-size: 22rpx;
  color: #8c8c8c;
}

.link {
  color: #1890ff;
  cursor: pointer;
  transition: color 0.2s;
}

.link:active {
  color: #096dd9;
  text-decoration: underline;
}

.config-dialog-content {
  padding: 20rpx 0;
}

.config-input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #d9d9d9;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: #fff;
}

.config-input:focus {
  border-color: #1890ff;
  outline: none;
}

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    height: auto;
    width: 100%;
  }

  .brand-section {
    flex: none;
    padding: 40rpx;
    width: 100%;
  }

  .form-section {
    padding: 60rpx 40rpx;
    width: 100%;
  }

  .form-container {
    max-width: none;
  }
}
</style>