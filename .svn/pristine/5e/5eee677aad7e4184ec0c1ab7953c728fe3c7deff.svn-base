import { fetchEncryptionConfig } from '@/utils/configManager'

// 导出初始化函数
export const initEncryption = async () => {
  try {
    console.log('正在初始化加密配置...')
    const config = await fetchEncryptionConfig()

    if (!config.publicKey) {
      console.warn('加密配置初始化失败，将使用默认配置')
    } else {
      console.log('加密配置初始化成功:', {
        encryptionType: config.encryptionType,
        publicKey: config.publicKey.slice(0, 10) + '...' // 只显示部分公钥
      })
    }

    return config
  } catch (error) {
    console.error('加密配置初始化异常:', error)
    return null
  }
}

// 立即执行初始化（可选）
initEncryption()