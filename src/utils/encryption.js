/**
 * 加密工具类 - 支持SM2和RSA加密
 * 使用方式：this.$encrypt.SM2('待加密内容') 或 this.$encrypt.RSA('待加密内容')
 */

import SM2 from 'sm-crypto'
import JSEncrypt from 'jsencrypt'

// 从环境变量或配置文件读取公钥
// 引入配置管理器
import { getEncryptionConfig, isConfigValid, fetchEncryptionConfig } from '@/utils/configManager'

const getPublicKey = async (type) => {
    // 如果配置有效，直接返回缓存的公钥
    if (isConfigValid()) {
        return getEncryptionConfig().publicKey
    }

    // 否则尝试获取新的配置并等待（最多2秒）
    await Promise.race([
        fetchEncryptionConfig(),
        new Promise(resolve => setTimeout(resolve, 2000))
    ])

    return getEncryptionConfig().publicKey || undefined
}

const encryptor = {
    /**
     * SM2加密 - 专门用于加密字符串
     * @param {string} data 待加密的明文（必须是字符串）
     * @param {string} publicKey 公钥（可选）
     * @returns {string} 加密后的密文（十六进制字符串）
     */
    async SM2(data, publicKey = null) {
        // 1. 确保数据是字符串
        if (data === null || data === undefined) return ''

        // 2. 如果是对象，先转为JSON字符串
        const strData = typeof data === 'object' ? JSON.stringify(data) : String(data)
        if (!strData) return ''

        try {
            const pk = publicKey || await getPublicKey('SM2')
            if (!pk) {
                console.error('SM2公钥未配置')
                return ''
            }

            // 确保公钥是字符串
            const pkStr = String(pk)
            // 确保公钥格式正确（04开头）
            const formattedPk = pkStr.startsWith('04') ? pkStr : '04' + pkStr

            // 使用mode 1 (C1C3C2) - 很多Java后端用这个模式
            // 注意：如果mode 0不行，就改成1
            const encryptData = SM2.sm2.doEncrypt(strData, formattedPk, 1)
            return encryptData
        } catch (error) {
            console.error('SM2加密失败:', error)
            return ''
        }
    },

    /**
     * 加密对象 - 推荐使用这个方法
     * @param {Object} obj 要加密的对象
     * @param {string} publicKey 公钥（可选）
     * @returns {string} 加密后的密文
     */
    encryptObject(obj, publicKey = null) {
        if (!obj) return ''
        // 将对象转为JSON字符串再加密
        const jsonStr = JSON.stringify(obj)
        return this.SM2(jsonStr, publicKey)
    },

    /**
     * SM2加密（返回Base64格式）
     */
    SM2Base64(data, publicKey = null) {
        const hexResult = this.SM2(data, publicKey)
        if (!hexResult) return ''

        try {
            // 十六进制转Base64
            return Buffer.from(hexResult, 'hex').toString('base64')
        } catch (error) {
            console.error('Base64转换失败:', error)
            return ''
        }
    },

    /**
     * RSA加密
     */
    async RSA(data, publicKey = null) {
        if (!data) return ''

        try {
            // 同样处理对象
            const strData = typeof data === 'object' ? JSON.stringify(data) : String(data)

            const pk = (publicKey || await getPublicKey('RSA')).trim()
            if (!pk) {
                console.error('RSA公钥未配置')
                return ''
            }

            const encrypt = new JSEncrypt()
            // 自动格式化公钥
            const formattedPk = pk.includes('BEGIN PUBLIC KEY') ? pk :
               `-----BEGIN PUBLIC KEY-----\n${pk}\n-----END PUBLIC KEY-----`
            encrypt.setPublicKey(formattedPk)

            // 直接加密原始字符串（不进行额外Base64编码）
            const encrypted = encrypt.encrypt(strData)

            if (!encrypted) {
                console.error('RSA加密失败，请检查公钥格式')
                return ''
            }

            // 返回Base64格式的加密结果
            return encrypted
        } catch (error) {
            console.error('RSA加密失败:', error)
            return ''
        }
    }
}

export default encryptor