<template>
  <view class="mine-container" :style="{height: `${windowHeight}px`}">
    <!--顶部个人信息栏-->
    <view class="header-section">
      <view class="flex padding justify-between">
        <view class="flex align-center">
          <view v-if="!avatar" class="cu-avatar xl round bg-white">
            <view class="iconfont icon-people text-gray icon"></view>
          </view>
          <image v-if="avatar" @click="handleToAvatar" :src="avatar" class="cu-avatar xl round" mode="widthFix">
          </image>
          <view v-if="!name" @click="handleToLogin" class="login-tip">
            点击登录
          </view>
          <view v-if="name" @click="handleToInfo" class="user-info">
			<view class="user-name">{{ name }}</view>
			<view class="user-id">ID: {{ userId }}</view>
          </view>
        </view>
        <view @click="handleToInfo" class="flex align-center">
          <text>个人信息</text>
          <view class="iconfont icon-right"></view>
        </view>
      </view>
    </view>

    <view class="content-section">
      <view class="menu-list">
        <!-- <view class="list-cell list-cell-arrow" @click="handleToEditInfo">
          <view class="menu-item-box">
            <view class="iconfont icon-user menu-icon"></view>
            <view>编辑资料</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleHelp">
          <view class="menu-item-box">
            <view class="iconfont icon-help menu-icon"></view>
            <view>常见问题</view>
          </view>
        </view> -->
        <view class="list-cell list-cell-arrow" @click="handleAbout">
          <view class="menu-item-box">
            <view class="iconfont icon-aixin menu-icon"></view>
            <view>关于我们</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleToSetting">
          <view class="menu-item-box">
            <view class="iconfont icon-setting menu-icon"></view>
            <view>应用设置</view>
          </view>
        </view>
      </view>

    </view>
  </view>
  <view>
	  <uni-popup ref="popup" type="dialog">
	    <uni-popup-dialog type="info" cancelText="关闭" confirmText="退出"
	                      title="通知" content="确定注销并退出系统吗" 
	    				  @confirm="dialogConfirm"
	                      @close="dialogClose">
	    </uni-popup-dialog>
	  </uni-popup>
  </view>
</template>

<script setup>
  import store from '@/store'
  import { ref, computed } from "vue";
  import config from '@/config.js'
  
  // 使用getters获取用户信息，确保获取到的是最新的
  const name = computed(() => store.getters.name);
  const userId = computed(() => store.getters.userid);
  // const avatar = computed(() => store.getters.avatar);
  const avatar = 'http://192.168.41.101:82/get/file/getAvatar?avatar=5.png';
  
  const version= config.appInfo.version;
  const windowHeight=ref(uni.getSystemInfoSync().windowHeight - 50);
  const popup = ref(null);
  
  console.log('【mine.vue】初始化用户信息:', {
    name: name.value,
    userId: userId.value,
    avatar: avatar.value
  });
  
  uni.$on('refresh', () => {
    // 刷新时重新获取用户信息
    store.dispatch('GetInfo').catch(error => {
      console.error('【mine.vue】刷新用户信息失败:', error);
    });
  });
  
  function handleToInfo() {
	  uni.navigateTo({
	  	url: '/pages_mine/pages/info/index'
	  });
  };
  function handleToEditInfo() {
	  uni.navigateTo({
	  	url: '/pages_mine/pages/info/edit'
	  });
  };
  function handleToSetting() {
	  uni.navigateTo({
	  	url: '/pages_mine/pages/setting/index'
	  });
  };
  function handleToLogin() {
	  uni.reLaunch({
	  	url: '/pages/login'
	  });
  };
  function handleToAvatar() {
	  uni.navigateTo({
	  	url: '/pages_mine/pages/avatar/index'
	  });
  };
  function handleLogout() {
	  popup.value.open();
  };
  function dialogConfirm() {
  	//console.log('----------------点击确认------------')
	store.dispatch('LogOut').then(() => {
			uni.reLaunch({
				url: '/pages/login'
			});
	})
  };
  function dialogClose() {
  	//console.log('点击关闭')
  };
  function handleHelp() {
	  // uni.navigateTo({
	  // 	url: '/pages_mine/pages/help/index'
	  // });
    uni.showToast({
      title: '模块建设中~',
      mask: false,
      icon:"none",
      duration: 1000
    });
  };
  function handleAbout() {
	  uni.navigateTo({
	  	url: '/pages_mine/pages/about/index'
	  });
    // uni.showToast({
    //   title: '模块建设中~',
    //   mask: false,
    //   icon:"none",
    //   duration: 1000
    // });
  };
  function handleJiaoLiuQun() {
	  // uni.showToast({
	  //   title: 'QQ群：133713780',
	  //   mask: false,
		// icon:"none",
	  //   duration: 1000
	  // });
    uni.showToast({
      title: '模块建设中~',
      mask: false,
      icon:"none",
      duration: 1000
    });
  };
  function handleBuilding() {
	  uni.showToast({
	    title: '模块建设中~',
	    mask: false,
		icon:"none",
	    duration: 1000
	  });
  }
  
</script>

<style lang="scss">

  page {
    background-color: #f5f6f7;
  }

  .mine-container {
    width: 100%;
    height: 100%;


    .header-section {
      padding: 15px 15px 45px 15px;
      background-color: #1a73e8;
      color: white;

      .login-tip {
        font-size: 18px;
        margin-left: 10px;
      }

      .cu-avatar {
        border: 2px solid #eaeaea;

        .icon {
          font-size: 40px;
        }
      }

      .user-info {
        margin-left: 15px;

        .u_title {
          font-size: 18px;
          line-height: 30px;
        }
      }
    }

    .content-section {
      position: relative;
      top: -50px;

      .mine-actions {
        margin: 15px 15px;
        padding: 20px 0px;
        border-radius: 8px;
        background-color: white;

        .action-item {
          .icon {
            font-size: 28px;
          }

          .text {
            display: block;
            font-size: 13px;
            margin: 8px 0px;
          }
        }
      }
    }
  }
    .user-name {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 4px;
    }
  
    .user-id {
      font-size: 14px;
      opacity: 0.8;
    }
</style>
