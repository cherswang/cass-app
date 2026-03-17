<template>
  <view class="container">
    <uni-list>
      <uni-list-item showExtraIcon="true" :extraIcon="{ type: 'person-filled' }" title="昵称" :rightText="user.nickName" />
      <uni-list-item showExtraIcon="true" :extraIcon="{ type: 'phone-filled' }" title="手机号码"
        :rightText="user.phonenumber" />
      <uni-list-item showExtraIcon="true" :extraIcon="{ type: 'email-filled' }" title="邮箱" :rightText="user.email" />
      <uni-list-item showExtraIcon="true" :extraIcon="{ type: 'auth-filled' }" title="岗位" :rightText="postGroup" />
      <uni-list-item showExtraIcon="true" :extraIcon="{ type: 'staff-filled' }" title="角色" :rightText="roleGroup" />
      <uni-list-item showExtraIcon="true" :extraIcon="{ type: 'calendar-filled' }" title="创建日期"
        :rightText="user.createTime" />
    </uni-list>
  </view>
</template>

<script>
import { getUserProfile } from "@/api/system/user"

export default {
  data() {
    return {
      user: {},
      roleGroup: "",
      postGroup: ""
    }
  },
  onLoad() {
    this.getUser()
  },
  methods: {
    getUser() {
      // 从本地存储中获取用户信息
      try {
        const userInfo = uni.getStorageSync('USER_INFO');
        if (userInfo) {
          this.user = {
            nickName: userInfo.userName || userInfo.nickName || '',
            phonenumber: userInfo.phone || '',
            email: userInfo.email || '',
            createTime: userInfo.createTime || ''
          };
          // 角色和岗位信息
          this.roleGroup = userInfo.userLevelName || '普通用户';
          this.postGroup = userInfo.deptName || '未知部门';
          console.log('从本地存储获取用户信息:', this.user);
        } else {
          console.warn('本地存储中没有用户信息');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #ffffff;
}
</style>
