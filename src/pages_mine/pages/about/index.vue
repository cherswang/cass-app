<template>
  <view class="about-container">
    <!-- 顶部品牌区域 -->
    <view class="brand-section">
      <image class="logo" src="/static/logo200.png" mode="widthFix"></image>
      <h1 class="app-title">三晖OA移动端</h1>
      <p class="app-subtitle">高效办公，智慧管理</p>
    </view>

    <!-- 内容区域 -->
    <view class="content-section">
      <view class="card">
        <view class="list-item" v-for="(item, index) in aboutItems" :key="index">
          <!-- <view class="item-icon">
            <view :class="[item.icon, 'icon']"></view>
          </view> -->
          <view class="item-content">
            <view class="item-label">{{ item.label }}</view>
            <view v-if="item.type === 'link'" class="item-value">
              <uni-link :href="item.value" :text="item.display" showUnderLine="false"></uni-link>
            </view>
            <view v-else class="item-value">{{ item.value }}</view>
          </view>
          <view class="item-arrow">
            <view class="icon-arrow"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 版权信息 -->
    <view class="copyright">
      <view class="copyright-text">Copyright © 2026 郑州三晖电气股份有限公司 All Rights Reserved.</view>
    </view>
  </view>
</template>

<script setup>
  import config from '@/config.js'
  
  const url = config.appInfo.site_url;
  const version = config.appInfo.version;
  
  // 关于页面数据
  const aboutItems = [
    {
      label: '版本信息',
      value: `v${version}`,
      icon: 'icon-version'
    },
    {
      label: '官方邮箱',
      value: 'master@cnsms.com',
      icon: 'icon-email'
    },
    {
      label: '服务热线',
      value: '0371-67391388',
      icon: 'icon-phone'
    },
    {
      label: '公司网站',
      value: url,
      display: url,
      type: 'link',
      icon: 'icon-website'
    }
  ];
</script>

<style lang="scss">
  // 全局变量
  :root {
    --primary-color: #1a73e8;
    --primary-light: #e8f0fe;
    --text-primary: #333333;
    --text-secondary: #666666;
    --text-tertiary: #999999;
    --border-color: #e0e0e0;
    --card-background: #ffffff;
    --background-color: #f5f7fa;
    --shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  page {
    background-color: var(--background-color);
    min-height: 100vh;
  }

  .about-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 0 30rpx;
  }

  // 品牌区域
  .brand-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0 60rpx;
    animation: fadeInDown 0.8s ease-out;
  }

  .logo {
    width: 160rpx;
    height: 160rpx;
    border-radius: 20rpx;
    box-shadow: var(--shadow);
    margin-bottom: 30rpx;
    transition: transform 0.3s ease;
  }

  .logo:hover {
    transform: scale(1.05);
  }

  .app-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 12rpx;
    letter-spacing: 2rpx;
  }

  .app-subtitle {
    font-size: 24rpx;
    color: var(--text-secondary);
    opacity: 0.9;
  }

  // 内容区域
  .content-section {
    flex: 1;
    margin-bottom: 60rpx;
  }

  .card {
    background-color: var(--card-background);
    border-radius: 20rpx;
    box-shadow: var(--shadow);
    overflow: hidden;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }

  .list-item {
    display: flex;
    align-items: center;
    padding: 30rpx 30rpx;
    border-bottom: 1rpx solid var(--border-color);
    transition: background-color 0.2s ease;
  }

  .list-item:last-child {
    border-bottom: none;
  }

  .list-item:hover {
    background-color: rgba(26, 115, 232, 0.05);
  }

  .item-icon {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-light);
    border-radius: 15rpx;
    margin-right: 24rpx;
  }

  .icon {
    font-size: 32rpx;
    color: var(--primary-color);
  }

  .icon-version::before {
    content: "📱";
  }

  .icon-email::before {
    content: "📧";
  }

  .icon-phone::before {
    content: "📞";
  }

  .icon-website::before {
    content: "🌐";
  }

  .item-content {
    flex: 1;
  }

  .item-label {
    font-size: 28rpx;
    color: var(--text-primary);
    margin-bottom: 4rpx;
  }

  .item-value {
    font-size: 24rpx;
    color: var(--text-secondary);
  }

  .item-arrow {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-arrow {
    width: 12rpx;
    height: 12rpx;
    border-top: 2rpx solid var(--text-tertiary);
    border-right: 2rpx solid var(--text-tertiary);
    transform: rotate(45deg);
  }

  // 版权信息
  .copyright {
    padding: 30rpx 0;
    text-align: center;
    animation: fadeIn 1s ease-out 0.4s both;
  }

  .copyright-text {
    font-size: 20rpx;
    color: var(--text-tertiary);
    line-height: 32rpx;
  }

  // 动画效果
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30rpx);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30rpx);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // 响应式设计
  @media screen and (max-width: 375px) {
    .app-title {
      font-size: 32rpx;
    }

    .app-subtitle {
      font-size: 22rpx;
    }

    .list-item {
      padding: 24rpx 24rpx;
    }
  }
</style>