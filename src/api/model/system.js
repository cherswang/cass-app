import http from '@/utils/request';
import config from '@/config';
import { tansParams } from '@/utils/common';

export default {
	register: {
		getRegInfo: {
			url: `/get/system/getRegInfo`,
			name: "获取软件信息",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		regSoft: {
			url: `/set/file/regSoft`,
			name: "软件注册",
			post: async function (data, config = {}) {
				var res = await http.postFile(this.url, data, config);
				if (res.code == 200) {
					location.reload()
				}
				return res;
			}
		}
	},
	sysConfigInit: {
		getSysConfigInfo: {
			url: `/get/system/getSysConfigInit`,
			name: "获取系统配置",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getSysConfigInitForReSetPassword: {
			url: `/get/system/getSysConfigInitForReSetPassword`,
			name: "获取重置密码的系统规则",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		update: {
			url: `/set/system/updateSysConfigInit`,
			name: "更新系统配置",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
	},
	sysConfig:{
		getSysConfig: {
			url: `/get/system/getSysConfig`,
			name: "获取系统服务配置",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		setSysConfig: {
			url: `/set/system/setSysConfig`,
			name: "更新系统服务配置",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
	},
	sysMsgConfig: {
		getSysMsgConfigByCode:
			{
				url: `/get/system/getSysMsgConfigByCode`,
				name: "按模块获取消息权限",
				get: async function (params) {
					return await http.get(this.url, params);
				}
			},
		getSysMsgConfigList:
			{
				url: `/get/system/getSysMsgConfigList`,
				name: "获取设置权限列表",
				get: async function (params) {
					return await http.get(this.url, params);
				}
			},
		insert: {
			url: `/set/system/insertSysMsgConfig`,
			name: "创建MSG提醒",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		update: {
			url: `/set/system/updateSysMsgConfig`,
			name: "更新MSG提醒",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		delete: {
			url: `/set/system/deleteSysMsgConfig`,
			name: "删除MSG提醒",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
	},
	shortMenu:{
		setMyShortMenu:{
			url: `/set/system/setMyShortMenu`,
			name: "设置个人的快捷菜单",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		getSysMenuInRoleForShortMenu:{
			url: `/get/system/getSysMenuInRoleForShortMenu`,
			name: "获取快捷菜单备选",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getMyShortcutMenu:{
			url: `/get/system/getMyShortcutMenu`,
			name: "获取个人的快捷方式",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		}
	},
	menu: {
		myMenus: {
			url: `/get/system/getSysMenuInRole`,
			name: "获取我的菜单",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		list: {
			url: `/get/system/getAllSysMenuListForTree`,
			name: "获取菜单",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		insert: {
			url: `/set/system/insertSysMenu`,
			name: "创建菜单",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		update: {
			url: `/set/system/updateSysMenu`,
			name: "更新菜单",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		position: {
			url: `/set/system/updateSysMenuPosition`,
			name: "更新菜单",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {
						//'response-status': 401
					}
				});
			}
		},
		delete: {
			url: `/set/system/deleteSysMenu`,
			name: "删除菜单",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {
						//'response-status': 401
					}
				});
			}
		}
	},
	unit:
		{
			getUnit: {
				url: `/get/system/getUnit`,
				name: "获取单位信息",
				get: async function () {
					return await http.get(this.url);
				}
			},
			getUnitListForSelect:{
				url: `/get/system/getUnitListForSelect`,
				name: "获取组织机构列表",
				get: async function () {
					return await http.get(this.url);
				}
			},
			update: {
				url: `/set/system/updateUnit`,
				name: "更新单位信息",
				post: async function (data) {
					return await http.post(this.url, data, {
						headers: {
							//'response-status': 401
						}
					});
				}
			},
		},
	userRole: {
		insert: {
			url: `/set/system/insertUserRole`,
			name: "创建角色",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		update: {
			url: `/set/system/updateUserRole`,
			name: "更新角色",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		delete: {
			url: `/set/system/deleteUserRole`,
			name: "删除角色",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteUserRoleByIds: {
			url: `/set/system/deleteUserRoleByIds`,
			name: "批量删除角色",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		list: {
			url: `/get/system/getAllUserRole`,
			name: "获取角色列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAllUserRoleForSelect: {
			url: `/get/system/getAllUserRoleForSelect`,
			name: "获取角色列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getPermissionByRoleId: {
			url: `/get/system/getPermissionByRoleId`,
			name: "获取权限",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		cloneUserRole:{
			url: `/set/system/cloneUserRole`,
			name: "克隆权限",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		}
	},
	unitDept: {
		getExpDeptRecord:{
			url: `/get/system/getExpDeptRecord`,
			name: "导出部门列表",
			fileDownload: async function (data) {
				return await http.fileDownload(this.url, data,{
					headers: {}
				})
			}
		},
		list: {
			url: `/get/system/getAllUnitDeptList`,
			name: "获取部门列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAllUnitDeptList: {
			url: `/get/system/getAllUnitDeptList`,
			name: "获取部门列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getDeptListByDeptIdForSelect: {
			url: `/get/system/getDeptListByDeptIdForSelect`,
			name: "获取备选部门列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getDeptListByDeptIds: {
			url: `/get/system/getDeptListByDeptIds`,
			name: "按部部ID获取部门列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertUnitDept: {
			url: `/set/system/insertUnitDept`,
			name: "创建部门",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		updateUnitDept: {
			url: `/set/system/updateUnitDept`,
			name: "更新部门",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteUnitDept: {
			url: `/set/system/deleteUnitDept`,
			name: "删除部门",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteUnitDeptByBatch: {
			url: `/set/system/deleteUnitDeptByBatch`,
			name: "批量删除部门",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		syncDingDingUnitDept:{
			url: `/set/system/syncDingDingUnitDept`,
			name: "同步部门到钉钉后台",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		syncWeiXinUnitDept:{
			url: `/set/system/syncWeiXinUnitDept`,
			name: "同步部门到企业微信后台",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		importUnitDept:{
			url: `/set/system/importUnitDept`,
			name: "批量导入部门",
			post: async function (data, config = {}) {
				return await http.postFile(this.url, data, config);
			}
		},
		setInitUnitDept: {
			url: `/set/system/setInitUnitDept`,
			name: "初始化当前组织下部门",
			post: async function () {
				return await http.post(this.url, null, {
					headers: {}
				});
			}
		},
	},
	userOptRole: {
		getAllUserOptRoleList: {
			url: `/get/system/getAllUserOptRoleList`,
			name: "获取所有数所操作权限列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getUserOptRoleList: {
			url: `/get/system/getUserOptRoleList`,
			name: "获取数据权限列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insert: {
			url: `/set/system/insertUserOptRole`,
			name: "创建数据权限",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		update: {
			url: `/set/system/updateUserOptRole`,
			name: "更新数据权限",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		delete: {
			url: `/set/system/deleteUserOptRole`,
			name: "删除数据权限",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteUserOptRoleByIds: {
			url: `/set/system/deleteUserOptRoleByIds`,
			name: "批量删除数据权限",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		}
	},
	user: {
		getLeaveUserList:{
			url: `/get/system/getLeaveUserList`,
			name: "获取离职人员列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
		getExpUserInfoRecord:{
			url: `/get/system/getExpUserInfoRecord`,
			name: "导出用户列表",
			fileDownload: async function (data) {
				return await http.fileDownload(this.url, data,{
					headers: {}
				})
			}
		},
		getAllUserForTree: {
			url: `/get/system/getAllUserForTree`,
			name: "获取人员列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getUserInfoById:{
			url: `/get/system/getUserInfoById`,
			name: "获取用户详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMySubordinates:{
			url: `/get/system/getMySubordinates`,
			name: "获取本人下属用户列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		list: {
			url: `/get/system/getUserListByDeptId`,
			name: "获取用户列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getUserListByAccountIds: {
			url: `/get/system/getUserListByAccountIds`,
			name: "按账号获取人员列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getUserListByDeptIdForSelect: {
			url: `/get/system/getUserListByDeptIdForSelect`,
			name: "获取用户列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		updateNewPassWord: {
			url: `/set/system/updateNewPassWord`,
			name: "到期更新密码",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		resetNewPassWord: {
			url: `/set/system/resetNewPassWord`,
			name: "到期更新密码",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		updatePassWord: {
			url: `/set/system/updatePassWord`,
			name: "个人修改密码",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		logOut: {
			url: `/set/system/logOut`,
			name: "退出账号",
			post: async function () {
				return await http.post(this.url, null,{});
			}
		},
		insert: {
			url: `/set/system/insertUser`,
			name: "创建账号",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		delete: {
			url: `/set/system/deleteUser`,
			name: "管理员删除账号",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteByAccountIds: {
			url: `/set/system/deleteByAccountIds`,
			name: "管理员批量删除账号",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		update: {
			url: `/set/system/updateUser`,
			name: "更新个人账号",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		updateUserInfo: {
			url: `/set/system/updateUserInfo`,
			name: "管理人员更新账号",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		setPassWordByEmail: {
			url: `/set/system/setPassWordByEmail`,
			name: "通过邮件找回密码",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		syncWeiXinAccount:{
			url: `/set/system/syncWeiXinAccount`,
			name: "同步微信账号",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		syncDingDingAccount:{
			url: `/set/system/syncDingDingAccount`,
			name: "同步钉钉账号",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		importUser:{
			url: `/set/system/importUser`,
			name: "批量导入用户账号",
			post: async function (data, config = {}) {
				return await http.postFile(this.url, data, config);
			}
		},
		cloneAdminDesk:{
			url: `/set/system/cloneAdminDesk`,
			name: "克隆管理员桌面",
			post: async function () {
				return await http.post(this.url, null,{headers: {}});
			}
		},
		setInitUser: {
			url: `/set/system/setInitUser`,
			name: "初始化当前组织机构下的人员账号",
			post: async function () {
				return await http.post(this.url, null, {headers: {}});
			}
		},
	},
	sysTasks: {
		list: {
			url: `/get/system/getSysTasksList`,
			name: "获取定时任务",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insert: {
			url: `/set/system/insertSysTasks`,
			name: "创建定时任务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		update: {
			url: `/set/system/updateSysTasks`,
			name: "更新定时任务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		startRunSysTasks:{
			url: `/set/system/startRunSysTasks`,
			name: "立即执行定时任务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		delete: {
			url: `/set/system/deleteSysTasks`,
			name: "删除定时任务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		}
	},
	userLevel: {
		getUserLevelListForManage: {
			url: `/get/system/getUserLevelListForManage`,
			name: "获取所有职务列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAllUserLevelForSearch: {
			url: `/get/system/getAllUserLevelForSearch`,
			name: "获取所有职务",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getUserLevelForSelect:{
			url: `/get/system/getUserLevelForSelect`,
			name: "获取所有职务",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		insert: {
			url: `/set/system/insertUserLevel`,
			name: "创建职务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		delete: {
			url: `/set/system/deleteUserLevel`,
			name: "删除职务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteUserLevelByIds: {
			url: `/set/system/deleteUserLevelByIds`,
			name: "批量删除职务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		update: {
			url: `/set/system/updateUserLevel`,
			name: "更新职务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		}
	},
	sysLuceneConfig: {
			getAllSysLuceneConfig: {
				url: `/get/system/getAllSysLuceneConfig`,
				name: "获取当前全文检索列表",
				get: async function (params) {
					return await http.get(this.url, params);
				}
			},
			setSysLuceneConfig: {
				url: `/set/system/setSysLuceneConfig`,
				name: "更新全文检索配置",
				post: async function (data) {
					return await http.post(this.url, data, {headers: {}});
				}
			}
			},
	sysAttachBackConfig: {
		getAllSysAttachBackConfig: {
			url: `/get/system/getAllSysAttachBackConfig`,
			name: "获取当前全文检索列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		setSysAttachBackConfig: {
			url: `/set/system/setSysAttachBackConfig`,
			name: "更新全文检索配置",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		}
	},
	attendConfig: {
		getAllAttendConfigList: {
			url: `/get/system/getAllAttendConfigList`,
			name: "获取系统考勤规则",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAttendConfigById:{
			url: `/get/system/getAttendConfigById`,
			name: "获取考勤配置详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},

		getAttendConfigList: {
			url: `/get/system/getAttendConfigList`,
			name: "获取考勤规则列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertAttendConfig:{
			url: `/set/system/insertAttendConfig`,
			name: "创建考勤规则",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteAttendConfig:{
			url: `/set/system/deleteAttendConfig`,
			name: "删除考勤规则",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateAttendConfig:{
			url: `/set/system/updateAttendConfig`,
			name: "更新考勤规则",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
	},
	sysLog: {
		getAccessAddressById: {
			url: `/get/system/getAccessAddressById`,
			name: "通过Ip获取当前日志Ip所在地址",/*可能会出现IP地址查询API变化导致查询出错*/
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		list: {
			url: `/get/system/getSysLogList`,
			name: "获取个人登录日志列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAllSysLogList: {
			url: `/get/system/getAllSysLogList`,
			name: "获取系统日志列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAllSysLogListBySafetyAuditor:{
			url: `/get/system/getAllSysLogListBySafetyAuditor`,
			name: "审计员查看日志列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		deleteSysLog: {
			url: `/set/system/deleteSysLog`,
			name: "删除日志",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteSysLogByIds: {
			url: `/set/system/deleteSysLogByIds`,
			name: "批量删除日志",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteSysLogByTime: {
			url: `/set/system/deleteSysLogByTime`,
			name: "按时间段删除系统日志",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
	},
	monitor: {
		getHardwareInfo: {
			url: `/get/system/getHardwareInfo`,
			name: "获取服务器CPU信息",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		kickAccount: {
			url: `/set/system/kickAccount`,
			name: "踢出账号",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		clearSysRedis: {
			url: `/set/system/clearSysRedis`,
			name: "清空redis缓存",
			post: async function () {
				return await http.post(this.url,null);
			}
		},
		setMainMode: {
			url: `/set/system/setMainMode`,
			name: "维护",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		relieveMaintenanceMode: {
			url: `/set/system/relieveMaintenanceMode`,
			name: "启用",
			post: async function () {
				return await http.post(this.url,null);
			}
		},
		getSysRunStatus:{
			url: `/get/system/getSysRunStatus`,
			name: "获取当前系统是否在维护",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		}
	},
	sysDic: {
		getSysDicTree: {
			url: `/get/system/getSysDicTree`,
			name: "获取字典树",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getSysDicList: {
			url: `/get/system/getSysDicList`,
			name: "字典明细",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getSysDicParentList: {
			url: `/get/system/getSysDicParentList`,
			name: "获取字典数据",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		insert: {
			url: `/set/system/insertSysDic`,
			name: "添加字典",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		delete: {
			url: `/set/system/deleteSysDic`,
			name: "删除字典",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		dropSysDic: {
			url: `/set/system/dropSysDic`,
			name: "字典拖拽排序",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteSysDicByIds: {
			url: `/set/system/deleteSysDicByIds`,
			name: "批量删除字典",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		update: {
			url: `/set/system/updateSysDic`,
			name: "更新字典",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getSysDicByCode: {
			url: `/get/system/getSysDicByCode`,
			name: "获取字典数据",
			get: async function (data) {
				return await http.get(this.url, data);
			}
		},
	},
	ddConfig: {
		updateDdConfig: {
			url: `/set/system/updateDdConfig`,
			name: "更新企业钉钉配置",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getDdConfig: {
			url: `/get/system/getDdConfig`,
			name: "获取企业钉钉配置",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
	},
	wxConfig: {
		updateWxConfig: {
			url: `/set/system/updateWxConfig`,
			name: "更新企业微信配置",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getWxConfig: {
			url: `/get/system/getWxConfig`,
			name: "获取企业微信配置",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
	},
	sysDbInterface:{
		insertSysDbInterface: {
			url: `/set/system/insertSysDbInterface`,
			name: "创建数据接口",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		updateSysDbInterface: {
			url: `/set/system/updateSysDbInterface`,
			name: "更新数据接口",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteSysDbInterface: {
			url: `/set/system/deleteSysDbInterface`,
			name: "删除数据接口",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteSysDbInterfaceByIds: {
			url: `/set/system/deleteSysDbInterfaceByIds`,
			name: "批量删除数据接口",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getSysDbInterfaceList: {
			url: `/get/system/getSysDbInterfaceList`,
			name: "获取数据接口列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
		getSysDbInterfaceForSelect:{
			url: `/get/system/getSysDbInterfaceForSelect`,
			name: "获取下拉数据接口列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getDataBySysDbInterface:{
			url: `/get/system/getDataBySysDbInterface`,
			name: "获取接口数据",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		}
	},
	dbSourceConfig: {
		getDbSourceListForSelect: {
			url: `/get/system/getDbSourceListForSelect`,
			name: "获取数据源选择列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getSysDbSourceList: {
			url: `/get/system/getSysDbSourceList`,
			name: "获取第三方数据源列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insert: {
			url: `/set/system/insertSysDbSource`,
			name: "创建第三方数据源",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		update: {
			url: `/set/system/updateSysDbSource`,
			name: "更新第三方数据源",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		delete: {
			url: `/set/system/deleteSysDbSource`,
			name: "删除第三方数据源",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteDbSourceByIds: {
			url: `/set/system/deleteDbSourceByIds`,
			name: "批量第三方数据源",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		}
	},
	sysOrgConfig: {
		createOrgConfig: {
			url: `/set/system/createOrgConfig`,
			name: "创建新机构",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		clearSysOrg: {
			url: `/set/system/clearSysOrg`,
			name: "管理员删除指定机构",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		update: {
			url: `/set/system/updateSysOrgConfig`,
			name: "更新机构信息",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getSysOrgConfigList: {
			url: `/get/system/getSysOrgConfigList`,
			name: "获取机构列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
	},
	initialization: {
		doInitialization: {
			url: `/set/system/doInitialization`,
			name: "系统初始化",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
	},
	sysInterface: {
		setSysInterface: {
			url: `/set/system/setSysInterface`,
			name: "设置系统界面",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		getSysInterface: {
			url: `/get/system/getSysInterface`,
			name: "获取系统界面配置",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getSysInterfaceForLogin:{
			url: `/get/system/getSysInterfaceForLogin`,
			name: "获取登录时系统界面配置",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		}
	},
	sysDeskConfig: {
		getAllSysDeskConfig: {
			url: `/get/system/getAllSysDeskConfig`,
			name: "获取桌面模块列表配置",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAllSysDeskConfigList:{
			url: `/get/system/getAllSysDeskConfigList`,
			name: "获取可用桌面模块列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getDeskConfigList: {
			url: `/get/system/getDeskConfigList`,
			name: "获取所有桌面模块",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getAllComps: {
			url: `/get/system/getAllComps`,
			name: "获取个人桌面模块",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		insert: {
			url: `/set/system/insertSysDeskConfig`,
			name: "创建桌面模块",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		update: {
			url: `/set/system/updateSysDeskConfig`,
			name: "更新桌面模块",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		delete: {
			url: `/set/system/deleteSysDeskConfig`,
			name: "删除桌面模块",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteSysDeskConfigByIds: {
			url: `/set/system/deleteSysDeskConfigByIds`,
			name: "批量删除桌面模块",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		}
	},
	tempOrg: {
		getTempUnitList: {
			url: `/get/system/getTempUnitList`,
			name: "获取虚拟组织列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getTempUnitListForSelect: {
			url: `/get/system/getTempUnitListForSelect`,
			name: "获取虚拟组织下拉列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getTempUnitListForSelect2: {
			url: `/get/system/getTempUnitListForSelect2`,
			name: "获取虚拟组织下拉列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getPendingTempUnitList: {
			url: `/get/system/getPendingTempUnitList`,
			name: "获取虚拟组织筛选列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		insert: {
			url: `/set/system/insertTempUnit`,
			name: "创建虚拟组织",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		update: {
			url: `/set/system/updateTempUnit`,
			name: "更新虚拟组织",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		delete: {
			url: `/set/system/deleteTempUnit`,
			name: "删除虚拟组织",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getTempUserLevelListForManage: {
			url: `/get/system/getTempUserLevelListForManage`,
			name: "获取所有虚拟职务列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getTempUserLevelForSelect: {
			url: `/get/system/getTempUserLevelForSelect`,
			name: "获取所有虚拟职务",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAllTempUserLevelForSearch:{
			url: `/get/system/getAllTempUserLevelForSearch`,
			name: "按要求查询虚拟职务列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertTempUserLevel: {
			url: `/set/system/insertTempUserLevel`,
			name: "创建虚拟职务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteTempUserLevel: {
			url: `/set/system/deleteTempUserLevel`,
			name: "删除虚拟职务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteTempUserLevelByIds: {
			url: `/set/system/deleteTempUserLevelByIds`,
			name: "批量虚拟删除职务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		updateTempUserLevel: {
			url: `/set/system/updateTempUserLevel`,
			name: "更新虚拟职务",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getTempDeptList: {
			url: `/get/system/getTempDeptList`,
			name: "获取所有虚拟部门",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getDeptListByTempDeptIdForSelect:{
			url: `/get/system/getDeptListByTempDeptIdForSelect`,
			name: "按条件获取虚拟部门列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getDeptListByTempDeptIds:{
			url: `/get/system/getDeptListByTempDeptIds`,
			name: "按部门ID字符串获取虚拟部门列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAllTempUnitDeptForTree: {
			url: `/get/system/getAllTempUnitDeptForTree`,
			name: "获取所有虚拟部门树",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertTempUnitDept: {
			url: `/set/system/insertTempUnitDept`,
			name: "创建虚拟部门",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		updateTempUnitDept: {
			url: `/set/system/updateTempUnitDept`,
			name: "更新虚拟部门",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteTempUnitDept: {
			url: `/set/system/deleteTempUnitDept`,
			name: "删除虚拟部门",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteTempUnitDeptByBatch: {
			url: `/set/system/deleteTempUnitDeptByBatch`,
			name: "批量删除部门",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		getTempUserByDeptId: {
			url: `/get/system/getTempUserByDeptId`,
			name: "获取所有虚拟部门下人员",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getUserListByTempDeptIdForSelect:{
			url: `/get/system/getUserListByTempDeptIdForSelect`,
			name: "获取所有虚拟部门下人员",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertTempUser: {
			url: `/set/system/insertTempUser`,
			name: "创建组织人员",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		updateTempUser: {
			url: `/set/system/updateTempUser`,
			name: "更新虚拟组织人员",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteTempUser: {
			url: `/set/system/deleteTempUser`,
			name: "删除虚拟组织人员",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteTempUserByIds: {
			url: `/set/system/deleteTempUserByIds`,
			name: "管理员批量虚拟人员账号",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
	},
	sysSecurity: {
		setSysSecurityApproval:{
			url: `/set/system/setSysSecurityApproval`,
			name: "执行三员事件审批",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getSysSecurityEventColumnComment:{
			url: `/get/system/getSysSecurityEventColumnComment`,
			name: "获取系统安全日志表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getSysSecurityApprovalList: {
			url: `/get/system/getSysSecurityApprovalList`,
			name: "获取系统安全日志表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getSysSecurityEventList:{
			url: `/get/system/getSysSecurityEventList`,
			name: "获取所有安全事件审批列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getThreeEventLogList: {
			url: `/get/system/getSysSecurityEventLogList`,
			name: "获取系统安全日志表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		deleteSysSecurityEventByIds: {
			url: `/set/system/deleteSysSecurityEventByIds`,
			name: "批量删除系统安全日志",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteSysSecurityEvent: {
			url: `/set/system/deleteSysSecurityEvent`,
			name: "删除系统安全日志",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getSysSecurityUser: {
			url: `/get/system/getSysSecurityUser`,
			name: "获取三员管理人员设置",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		setSysSecurityUser: {
			url: `/set/system/setSysSecurityUser`,
			name: "设置三员管理权限",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		insertSysSecurityConfig: {
			url: `/set/system/insertSysSecurityConfig`,
			name: "创建三员管理模块权限",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		updateSysSecurityConfig: {
			url: `/set/system/updateSysSecurityConfig`,
			name: "更新三员管理模块权限",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteSysSecurityConfig: {
			url: `/set/system/deleteSysSecurityConfig`,
			name: "删除三员管理模块权限",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getSysSecurityConfigList: {
			url: `/get/system/getSysSecurityConfigList`,
			name: "获取三员管理模块权限列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getSystemLogList: {
			url: `/get/system/getSystemLogList`,
			name: "获取系统运行日志列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
	},
	sms: {
		getNoReadSms: {
			url: `/get/system/getNoReadSms`,
			name: "获取未读消息列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getNoReadSmsById: {
			url: `/get/system/getNoReadSmsById`,
			name: "获取消息详情信息",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
		setReadStatusSmsByIds: {
			url: `/set/system/setReadStatusSmsByIds`,
			name: "设置消息已读",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteSmsByIds:{
			url: `/set/system/deleteSmsByIds`,
			name: "批量删除消息",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		sendSms:{
			url: `/set/system/sendSms`,
			name: "发送内部短信息",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		updateSms:{
			url: `/set/system/updateSms`,
			name: "更新消息状态",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteSms:{
			url: `/set/system/deleteSms`,
			name: "删除消息",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getMySmsList:{
			url: `/get/system/getMySmsList`,
			name: "获取个人所有消息列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		}
	},
	mobilesms:{
		sendMobileSms:{
			url: `/set/system/sendMobileSms`,
			name: "添加短信发送计划",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		getMySendMobileSms:{
			url: `/get/system/getMySendMobileSms`,
			name: "获取手机短信息列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		deleteMobileSms:{
			url: `/set/system/deleteMobileSms`,
			name: "删除手机短信",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		deleteMobileSmsByIds:{
			url: `/set/system/deleteMobileSmsByIds`,
			name: "批量删除消息",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		}
	},
	app: {
		list: {
			url: `/system/app/list`,
			name: "应用列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
	},
	log: {
		list: {
			url: `/system/log/list`,
			name: "日志列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		}
	},
	table: {
		list: {
			url: `/system/table/list`,
			name: "表格列管理列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		info: {
			url: `/system/table/info`,
			name: "表格列管理详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		}
	},
	mobileNet:{
		getLocation:{
			url: `/get/system/getLocation`,
			name: "获取地理位置",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		}
	},
	sysMessageType:{
		getSysMessageTypeForSelect:{
			url: `/get/system/getSysMessageTypeForSelect`,
			name: "获取系统消息类型",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		}
	},
	getMyPassword:{
		url: `/set/system/getMyPassword`,
		name: "忘记密码发送邮件",
		post: async function (data) {
			return await http.post(this.url, data, {headers: {}});
		}
	},
	sysCodeRule:{
		createRuleCodeStr:{
			url: `/get/system/createRuleCodeStr`,
			name: "按规则生成编号",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getSysCodeRuleListForSelect:{
			url: `/get/system/getSysCodeRuleListForSelect`,
			name: "获取下接编号规则列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getSysCodeRuleList: {
			url: `/get/system/getSysCodeRuleList`,
			name: "获取编号规则列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertSysCodeRule: {
			url: `/set/system/insertSysCodeRule`,
			name: "添加编号规则",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		updateSysCodeRule: {
			url: `/set/system/updateSysCodeRule`,
			name: "更新编号规则",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteSysCodeRule: {
			url: `/set/system/deleteSysCodeRule`,
			name: "删除编号规则",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteSysCodeRuleByIds: {
			url: `/set/system/deleteSysCodeRuleByIds`,
			name: "批量删编号规则",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
	},
	getAddressByClient:{
		url: `/get/system/getAddressByClient`,
		name: "获取当前用户所在地理信息",
		get: async function () {
			return await http.get(this.url);
		}
	},
	getCityCodeByClient:{
		url: `/get/system/getCityCodeByClient`,
		name: "按地址获取当前城市的编号",
		get: async function () {
			return await http.get(this.url);
		}
	},
	getCitWeatherByClient:{
		url: `/get/system/getCitWeatherByClient`,
		name: "获取当前城市的天气",
		get: async function () {
			return await http.get(this.url);
		}
	},
	getCityCodeList:{
		url: `/get/system/getCityCodeList`,
		name: "获取城市编码列表",
		get: async function (params) {
			return await http.get(this.url,params);
		}
	},
	userGroup:{
		getUserListByGroup:{
			url: `/get/system/getUserListByGroup`,
			name: "按用户分组获取人员列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
		getUserGroupListForManage:{
			url: `/get/system/getUserGroupListForManage`,
			name: "获取个人用户分组",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getUserGroupListByAccountId:{
			url: `/get/system/getUserGroupListByAccountId`,
			name: "获取个人用户分组",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		insertUserGroup: {
			url: `/set/system/insertUserGroup`,
			name: "添加用户分组",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		updateUserGroup: {
			url: `/set/system/updateUserGroup`,
			name: "更新用户分组",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteUserGroup: {
			url: `/set/system/deleteUserGroup`,
			name: "删除用户分组",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteUserGroupByIds: {
			url: `/set/system/deleteUserGroupByIds`,
			name: "批量删除用户分组",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
	},
	sysBannerConfig:{
		getSysBannerConfig:{
			url: `/get/system/getSysBannerConfig`,
			name: "获取系统Banner图配置信息",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		updateSysBannerConfig:{
			url: `/set/system/updateSysBannerConfig`,
			name: "配置系统Banner图",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		}
	},
	getTodayKanbanInfo:{
		url: `/get/system/getTodayKanbanInfo`,
		name: "获取今日看板数据",
		get: async function () {
			return await http.get(this.url);
		}
	},
	sysEvent:{
		getSysEventTree:{
			url: `/get/system/getSysEventTree`,
			name: "获取系统事件列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
	},
	verification:{
		getUserInfoVerificationList:{
			url: `/get/system/getUserInfoVerificationList`,
			name: "获取用户校验信息列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
		getUnitDeptVerificationList:{
			url: `/get/system/getUnitDeptVerificationList`,
			name: "获取部门信息校验信息列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
		getUserRoleVerificationList:{
			url: `/get/system/getUserRoleVerificationList`,
			name: "获取权限校验信息列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
		getUserLevelVerificationList:{
			url: `/get/system/getUserLevelVerificationList`,
			name: "获取行政级别校验信息列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
		setUserInfoSignature:{
			url: `/set/system/setUserInfoSignature`,
			name: "用户信息签名",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		setUnitDeptSignature:{
			url: `/set/system/setUnitDeptSignature`,
			name: "部门信息签名",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		setUserRoleSignature:{
			url: `/set/system/setUserRoleSignature`,
			name: "权限信息签名",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		},
		setUserLevelSignature:{
			url: `/set/system/setUserLevelSignature`,
			name: "设置行政级别记录签名",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		}
	},
	sysPortal:{
		insertSysPortal: {
			url: `/set/system/insertSysPortal`,
			name: "创建自定义门户",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		updateSysPortal: {
			url: `/set/system/updateSysPortal`,
			name: "更新自定义门户",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteSysPortal: {
			url: `/set/system/deleteSysPortal`,
			name: "删除自定义门户",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteSysPortalByIds: {
			url: `/set/system/deleteSysPortalByIds`,
			name: "批量删除自定义门户",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		getAllSysPortalList:{
			url: `/get/system/getAllSysPortalList`,
			name: "获取全部门户列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
		getSysPortalByPortalId:{
			url: `/get/system/getSysPortalByPortalId`,
			name: "获取自定义门户详情",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
		getMySysPortalForSelect:{
			url: `/get/system/getMySysPortalForSelect`,
			name: "获取个人权限内的门户列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		}
	},
	sysPortalItem:{
		insertSysPortalItem: {
			url: `/set/system/insertSysPortalItem`,
			name: "创建自定义门户组件",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		updateSysPortalItem: {
			url: `/set/system/updateSysPortalItem`,
			name: "更新自定义门户组件",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteSysPortalItem: {
			url: `/set/system/deleteSysPortalItem`,
			name: "删除自定义门户组件",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteSysPortalItemByIds: {
			url: `/set/system/deleteSysPortalItemByIds`,
			name: "批量删除自定义门户组件",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		getAllSysPortalItemList:{
			url: `/get/system/getAllSysPortalItemList`,
			name: "获取自定义门户组件列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		}
	},
	sysResource:{
		getResourceFileList:{
			url: `/get/system/getResourceFileList`,
			name: "获取系统资源文件列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		uploadSysResource:{
			url: `/set/system/uploadSysResource`,
			name: "上传静态资源文件",
			post: async function (data, config = {}) {
				return await http.postFile(this.url, data, config);
			}
		},
		deleteSysResource:{
			url: `/set/system/deleteSysResource`,
			name: "删除系统资源文件",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteSysResourceByFileNames:{
			url: `/set/system/deleteSysResourceByFileNames`,
			name: "批量删除系统资源文件",
			post: async function (data) {
				return await http.post(this.url, data, {headers: {}});
			}
		}
	},
	getEncryptionKey:{
		url: `/get/system/getEncryptionKey`,
		name: "生成密钥",
		get: async function (params) {
			return await http.get(this.url,params);
		}
	},
	dbUnit: {
		getDbSqlFile: {
			url: `/get/system/getDbSqlFile`,
			name: "生成数据结构",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		}
	},
	pending: {
		getMyPendingInfo: {
			url: `/get/system/getMyPendingInfo`,
			name: "获取个人待办信息",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		}
	},
	userOut:{
		getAllUserOutForWeek: {
			url: `/get/system/getAllUserOutForWeek`,
			name: "获取近期外出人员列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		}
	},
	sysDataBase:{
		getSystemDBTableInfo: {
			url: `/get/system/getSystemDBTableInfo`,
			name: "获取系统表信息列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		}
	},
	sensitiveWord:{
		insertSensitiveWord: {
			url: `/set/system/insertSensitiveWord`,
			name: "创建敏感词",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		updateSensitiveWord: {
			url: `/set/system/updateSensitiveWord`,
			name: "更新敏感词",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteSensitiveWord: {
			url: `/set/system/deleteSensitiveWord`,
			name: "删除敏感词",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteSensitiveWordByIds: {
			url: `/set/system/deleteSensitiveWordByIds`,
			name: "批量删除敏感词",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		getSensitiveWordListForManage:{
			url: `/get/system/getSensitiveWordListForManage`,
			name: "获取敏感词信息列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
	},
	sysWarningRole:{
		getSysWarningRoleList:{
			url: `/get/system/getSysWarningRoleList`,
			name: "获取当前预警规则列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
	},
	businessDept:{
		insertBusinessDept: {
			url: `/set/system/insertBusinessDept`,
			name: "创建业务条线",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		updateBusinessDept: {
			url: `/set/system/updateBusinessDept`,
			name: "更新业务条线",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteBusinessDept: {
			url: `/set/system/deleteBusinessDept`,
			name: "删除业务条线",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		deleteBusinessDeptByIds: {
			url: `/set/system/deleteBusinessDeptByIds`,
			name: "批量删除业务条线",
			post: async function (data) {
				return await http.post(this.url, data, {
					headers: {}
				});
			}
		},
		getAllBusinessDeptListForSelect:{
			url: `/get/system/getAllBusinessDeptListForSelect`,
			name: "获取所有业务条线列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getAllBusinessDeptList:{
			url: `/get/system/getAllBusinessDeptList`,
			name: "获取所有业务条线列表",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
	},
	sysDb:{
		getAllTableName:{
			url: `/get/system/getAllTableName`,
			name: "获取所有表信息",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getTableColumn:{
			url: `/get/system/getTableColumn`,
			name: "获取指定表字段信息",
			get: async function (params) {
				return await http.get(this.url,params);
			}
		},
	}

}
