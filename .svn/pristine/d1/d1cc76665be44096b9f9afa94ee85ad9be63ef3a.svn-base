<script>
import { checkUpdate, getLatestVersion } from '@/api/system/version'
import config from './config'

export default {
	onLaunch: function () {
		console.log('App Launch')
		// 初始化加密配置
		import('@/utils/initEncryption').then(({ initEncryption }) => {
			initEncryption()
		})
		// 检查版本更新
		this.checkVersionUpdate()
		// this.$socket.connect({ url: "ws://127.0.0.1:8080/websocket" }).then(res => {
		// 	console.log("success");
		// 	this.$socket.onMessage(res => {
		// 		console.log("onmessage",res);
		// 	})
		// 	this.$socket.on("on").then(res=>{
		// 		console.log("on",res);
		// 	})
		// 	this.$socket.send({msg:"xxx"},true).then(res=>{
		// 		console.log("callback-uuid",res);
		// 	})
		// 	this.$socket.send({event:"on"})
		// })
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	methods: {
		/**
		 * 检查版本更新
		 */
		checkVersionUpdate() {
			checkUpdate(config.appInfo.version)
				.then(res => {
					if (res.data) {
						// 有新版本
						this.showUpdateDialog(res.data)
					}
				})
				.catch(err => {
					console.error('检查版本更新失败:', err)
				})
		},
		/**
		 * 显示更新提示对话框
		 * @param {Object} versionInfo - 版本信息
		 */
		showUpdateDialog(versionInfo) {
			const message = `发现新版本 ${versionInfo.version}\n${versionInfo.description || '修复了一些问题，提升了应用性能'}`
			const confirmText = versionInfo.forceUpdate === 'Y' ? '立即更新' : '稍后更新'

			uni.showModal({
				title: '版本更新',
				content: message,
				confirmText: '立即更新',
				cancelText: versionInfo.forceUpdate === 'Y' ? '' : '稍后更新',
				showCancel: versionInfo.forceUpdate === 'Y' ? false : true,
				success: (res) => {
					if (res.confirm) {
						// 开始下载更新
            const relativePath = versionInfo.downloadUrl.substring(versionInfo.downloadUrl.lastIndexOf('/upload/') + 8);
            versionInfo.downloadUrl=config.baseUrl+"/download?filePath="+relativePath;
            console.log("downloadUrl",versionInfo.downloadUrl);
            this.downloadUpdate(versionInfo)
					}
				}
			})
		},
		/**
		 * 下载更新
		 * @param {Object} versionInfo - 版本信息
		 */
		downloadUpdate(versionInfo) {
      console.log("downloadUpdate",versionInfo);
			uni.showLoading({
				title: '正在下载更新...',
				mask: true
			})

			uni.downloadFile({
				url: versionInfo.downloadUrl,
				success: (downloadResult) => {
					uni.hideLoading()
					if (downloadResult.statusCode === 200) {
						// 下载成功，开始安装
						this.installUpdate(downloadResult.tempFilePath)
					} else {
						uni.showToast({
							title: '下载失败',
							icon: 'error'
						})
					}
				},
				fail: (err) => {
					uni.hideLoading()
					uni.showToast({
						title: '下载失败',
						icon: 'error'
					})
					console.error('下载更新失败:', err)
				}
			})
		},
		/**
		 * 安装更新
		 * @param {string} filePath - 下载的文件路径
		 */
		installUpdate(filePath) {
			uni.showLoading({
				title: '正在安装更新...',
				mask: true
			})

			// 根据平台选择安装方式
			if (uni.getSystemInfoSync().platform === 'android') {
				// Android平台
				uni.showModal({
					title: '安装提示',
					content: '更新已下载完成，是否立即安装？',
					success: (res) => {
						if (res.confirm) {
							uni.openDocument({
								filePath: filePath,
								showMenu: false,
								success: () => {
									uni.hideLoading()
								},
								fail: (err) => {
									uni.hideLoading()
									console.error('安装更新失败:', err)
									uni.showToast({
										title: '安装失败',
										icon: 'error'
									})
								}
							})
						}
					}
				})
			} else if (uni.getSystemInfoSync().platform === 'ios') {
				// iOS平台，提示用户去应用商店更新
				uni.hideLoading()
				uni.showModal({
					title: '安装提示',
					content: '请前往App Store更新最新版本',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							// 这里可以跳转到应用商店
							// uni.navigateToMiniProgram({...})
						}
					}
				})
			}
		}
	}
}
</script>

<style lang="scss">
@import "uview-plus/index.scss";
@import '@/static/scss/index.scss';
</style>