import config from '@/config'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { UserState, UserForm } from '@/types/store'
import { Module } from 'vuex'

const baseUrl = config.baseUrl

const user: Module<UserState, UserState> = {
  state: {
    token: getToken(),
    name: storage.get(constant.name),
    nickname: storage.get(constant.nickname),
	userid: storage.get(constant.userid),
    avatar: storage.get(constant.avatar),
    roles: storage.get(constant.roles),
    permissions: storage.get(constant.permissions)
  },
  mutations: {
    SET_TOKEN: (state, token: string) => {
      state.token = token
    },
    SET_NAME: (state, name: string) => {
      state.name = name
      storage.set(constant.name, name)
    },
    SET_NICKNAME: (state, nickname: string) => {
      state.nickname = nickname
      storage.set(constant.nickname, nickname)
    },
	SET_USERID: (state, userid: string) => {
	  state.userid = userid
	  storage.set(constant.userid, userid)
	},
    SET_AVATAR: (state, avatar: string) => {
      state.avatar = avatar
      storage.set(constant.avatar, avatar)
    },
    SET_ROLES: (state, roles: Array<string>) => {
      state.roles = roles
      storage.set(constant.roles, roles)
    },
    SET_PERMISSIONS: (state, permissions: Array<string>) => {
      state.permissions = permissions
      storage.set(constant.permissions, permissions)
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo: UserForm) {
      return new Promise((resolve, reject) => { 
        console.log("Vuex Login action received:", userInfo)
        login(userInfo).then((res: any) => {
          console.log("Login API response:", res)
          const data = res;

          // 支持多种token字段名
          const token = data.access_token || data.token || data.data?.token;
          console.log("Extracted token:", token)

          if (token) {
            setToken(token)
            commit('SET_TOKEN', token)
          } else {
            console.warn("No token found in response:", data)
          }
          console.log("登录用户信息为：",data.data);
          
          // 保存用户信息到本地存储和store中
          if (data.data && data.data.userInfo) {
            const userInfo = data.data.userInfo;
            
            // 保存到本地存储
            uni.setStorageSync('USER_INFO', userInfo);
            uni.setStorageSync('APP_COLOR', userInfo.theme || '');
            uni.setStorageSync('USER_DARK_MODE', userInfo.dark === 'true' ? true : false);
            uni.setStorageSync('USER_LANGUAGE', userInfo.language || 'zh-cn');
            
            // 保存其他数据
            uni.setStorageSync('MSG_TIME', data.data.msgtime || '');
            uni.setStorageSync('WATER_MARK', data.data.waterMark || '');
            uni.setStorageSync('WATER_MARK_CONTENT', data.data.waterMarkContent || '');
            uni.setStorageSync('WATER_MARK_SUBTEXT', data.data.waterMarkSubtext || '');
            
            // 更新store中的用户信息
            commit('SET_NAME', userInfo.userName || '');
            commit('SET_NICKNAME', userInfo.nickName || '');
            commit('SET_USERID', userInfo.accountId || '');
            
            // 头像处理
            let avatar = userInfo.avatar || '';
            if (!avatar) {
              avatar = '/static/images/profile.jpg';
            } else if (!avatar.startsWith('http')) {
              // 如果头像路径是相对路径，拼接基础URL
              avatar = baseUrl + avatar;
            }
            commit('SET_AVATAR', avatar);
            
            console.log('【Login】更新store中的用户信息:', {
              name: userInfo.userName,
              nickname: userInfo.nickName,
              userid: userInfo.accountId,
              avatar: avatar
            });
          }
          
          resolve(data)
        }).catch(error => {
          console.error("Login action error:", error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      console.log('【GetInfo】开始获取用户信息')
      return new Promise((resolve, reject) => {
        getInfo().then((res: any) => {
          console.log('【GetInfo】原始响应:', res)

          // 直接取 res.data，因为实体类就是根级别的
          const data = res.data
          console.log('【GetInfo】用户数据:', data)

          // 用户信息直接从 data 中获取，而不是 data.user
          // 根据实体类，字段名是 userName 和 nickName，不是 username 和 nickname
          const username = data.userName || ''  // 实体类中是 userName
          const nickname = data.nickName || ''  // 实体类中是 nickName
          const userid = data.accountId || ''    // 实体类中是 accountId

          // 头像处理
          let avatar = data.avatar || ''
          if (!avatar) {
            avatar = '/static/images/profile.jpg'
          } else if (!avatar.startsWith('http')) {
            // 如果头像路径是相对路径，拼接基础URL
            avatar = baseUrl + avatar
          }

          console.log('【GetInfo】处理后的数据:', {
            username,
            nickname,
            userid,
            avatar,
            roles: data.roles,
            permissions: data.permissions
          })

          // 设置角色和权限
          if (data.roles && data.roles.length > 0) {
            commit('SET_ROLES', data.roles)
            commit('SET_PERMISSIONS', data.permissions || [])
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
            commit('SET_PERMISSIONS', [])
          }

          // 设置用户信息
          commit('SET_NAME', username)
          commit('SET_NICKNAME', nickname)
          commit('SET_USERID', userid)
          commit('SET_AVATAR', avatar)

          resolve(res)
        }).catch(error => {
          console.error('【GetInfo】获取用户信息失败:', error)
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then((res) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_NAME', '')
		  commit('SET_USERID', '')
          removeToken()
          storage.clean()
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
