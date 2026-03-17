class BluetoothService {
    constructor() {
        this.deviceId = ''
        this.serviceId = ''
        this.characteristicId = ''
        this.isConnected = false
        this.platform = ''
    }

    // 初始化平台检测
    initPlatform() {
        // #ifdef H5
        this.platform = 'H5'
        // #endif
        // #ifdef MP-WEIXIN
        this.platform = 'MP-WEIXIN'
        // #endif
    }

    // 初始化蓝牙
    async initBluetooth() {
        this.initPlatform()

        if (this.platform === 'H5') {
            return this.initBluetoothH5()
        } else if (this.platform === 'MP-WEIXIN') {
            return this.initBluetoothMp()
        } else {
            throw new Error('当前平台不支持蓝牙功能')
        }
    }

    // H5 平台蓝牙初始化
    async initBluetoothH5() {
        if (!navigator.bluetooth) {
            throw new Error('您的浏览器不支持 Web Bluetooth API')
        }
        console.log('H5 蓝牙适配器准备就绪')
        return true
    }

    // 小程序平台蓝牙初始化
    async initBluetoothMp() {
        return new Promise((resolve, reject) => {
            uni.openBluetoothAdapter({
                success: (res) => {
                    console.log('小程序蓝牙适配器打开成功')
                    resolve(res)
                },
                fail: (err) => {
                    console.error('小程序蓝牙适配器打开失败:', err)
                    reject(err)
                }
            })
        })
    }

    // 搜索设备
    async startDiscovery() {
        if (this.platform === 'H5') {
            return this.startDiscoveryH5()
        } else if (this.platform === 'MP-WEIXIN') {
            return this.startDiscoveryMp()
        }
    }

    // H5 搜索设备
    async startDiscoveryH5() {
        try {
            console.log('H5 开始搜索打印机...')

            // 请求蓝牙设备
            const device = await navigator.bluetooth.requestDevice({
                filters: [
                    { name: 'HPRT' },
                    { namePrefix: 'HPRT' },
                    { services: ['0000ae30-0000-1000-8000-00805f9b34fb'] }
                ],
                optionalServices: ['0000ae30-0000-1000-8000-00805f9b34fb']
            })

            console.log('找到设备:', device.name)
            return this.connectDeviceH5(device)
        } catch (error) {
            console.error('H5 搜索设备失败:', error)
            throw error
        }
    }

    // 小程序搜索设备
    async startDiscoveryMp() {
        return new Promise((resolve, reject) => {
            uni.startBluetoothDevicesDiscovery({
                services: ['0000AE30-0000-1000-8000-00805F9B34FB'],
                success: (res) => {
                    console.log('小程序开始搜索设备')
                    this.onDeviceFoundMp()
                    resolve(res)
                },
                fail: (err) => {
                    console.error('小程序搜索设备失败:', err)
                    reject(err)
                }
            })
        })
    }

    // H5 连接设备
    async connectDeviceH5(device) {
        try {
            console.log('H5 正在连接设备...')

            device.addEventListener('gattserverdisconnected', () => {
                this.handleDisconnect()
            })

            const server = await device.gatt.connect()
            const service = await server.getPrimaryService('0000ae30-0000-1000-8000-00805f9b34fb')
            const characteristic = await service.getCharacteristic('0000ae01-0000-1000-8000-00805f9b34fb')

            this.device = device
            this.server = server
            this.service = service
            this.characteristic = characteristic
            this.isConnected = true

            console.log('H5 设备连接成功')
            return true
        } catch (error) {
            console.error('H5 设备连接失败:', error)
            throw error
        }
    }

    // 小程序设备发现监听
    onDeviceFoundMp() {
        uni.onBluetoothDeviceFound((devices) => {
            console.log('小程序发现设备:', devices)
            if (devices.devices && devices.devices.length > 0) {
                const printer = devices.devices.find(device =>
                    device.name && device.name.includes('HPRT')
                )
                if (printer) {
                    console.log('找到汉印打印机:', printer)
                    this.stopDiscovery()
                    this.connectDeviceMp(printer.deviceId)
                }
            }
        })
    }

    // 小程序连接设备
    async connectDeviceMp(deviceId) {
        return new Promise((resolve, reject) => {
            uni.createBLEConnection({
                deviceId,
                success: (res) => {
                    console.log('小程序设备连接成功:', deviceId)
                    this.deviceId = deviceId
                    this.getServicesMp()
                    resolve(res)
                },
                fail: (err) => {
                    console.error('小程序设备连接失败:', err)
                    reject(err)
                }
            })
        })
    }

    // 小程序获取服务
    getServicesMp() {
        uni.getBLEDeviceServices({
            deviceId: this.deviceId,
            success: (res) => {
                console.log('小程序获取服务成功:', res.services)
                const service = res.services.find(s =>
                    s.uuid.toLowerCase().includes('ae30')
                )
                if (service) {
                    this.serviceId = service.uuid
                    this.getCharacteristicsMp()
                }
            },
            fail: (err) => {
                console.error('小程序获取服务失败:', err)
            }
        })
    }

    // 小程序获取特征值
    getCharacteristicsMp() {
        uni.getBLEDeviceCharacteristics({
            deviceId: this.deviceId,
            serviceId: this.serviceId,
            success: (res) => {
                console.log('小程序获取特征值成功:', res.characteristics)
                const characteristic = res.characteristics.find(c =>
                    c.properties.write
                )
                if (characteristic) {
                    this.characteristicId = characteristic.uuid
                    this.isConnected = true
                    uni.showToast({
                        title: '打印机连接成功',
                        icon: 'success'
                    })
                }
            },
            fail: (err) => {
                console.error('小程序获取特征值失败:', err)
            }
        })
    }

    // 发送打印数据
    async printData(data) {
        if (!this.isConnected) {
            throw new Error('打印机未连接')
        }

        if (this.platform === 'H5') {
            return this.printDataH5(data)
        } else if (this.platform === 'MP-WEIXIN') {
            return this.printDataMp(data)
        }
    }

    // H5 发送数据
    async printDataH5(data) {
        try {
            let buffer
            if (typeof data === 'string') {
                const encoder = new TextEncoder()
                buffer = encoder.encode(data).buffer
            } else if (data instanceof Uint8Array) {
                buffer = data.buffer
            } else {
                buffer = data
            }

            await this.characteristic.writeValue(buffer)
            console.log('H5 数据发送成功')
            return true
        } catch (error) {
            console.error('H5 发送数据失败:', error)
            throw error
        }
    }

    // 小程序发送数据
    async printDataMp(data) {
        return new Promise((resolve, reject) => {
            uni.writeBLECharacteristicValue({
                deviceId: this.deviceId,
                serviceId: this.serviceId,
                characteristicId: this.characteristicId,
                value: data,
                success: (res) => {
                    console.log('小程序发送数据成功')
                    resolve(res)
                },
                fail: (err) => {
                    console.error('小程序发送数据失败:', err)
                    reject(err)
                }
            })
        })
    }

    // 断开连接
    disconnect() {
        if (this.platform === 'H5') {
            if (this.device && this.device.gatt.connected) {
                this.device.gatt.disconnect()
            }
        } else if (this.platform === 'MP-WEIXIN') {
            if (this.deviceId) {
                uni.closeBLEConnection({
                    deviceId: this.deviceId
                })
            }
        }
        this.handleDisconnect()
    }

    // 处理断开连接
    handleDisconnect() {
        this.isConnected = false
        this.device = null
        this.deviceId = ''
        this.serviceId = ''
        this.characteristicId = ''
        console.log('打印机已断开连接')
    }
}

export default new BluetoothService()