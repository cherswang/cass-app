<template>
  <view class="container">
    <view class="status">
      <text>打印机状态: {{ statusText }}</text>
    </view>

    <button class="btn" @click="connectPrinter" :disabled="connecting">
      {{ connecting ? '连接中...' : '连接打印机' }}
    </button>

    <button class="btn" @click="printTest" :disabled="!isConnected">
      打印测试页
    </button>

    <button class="btn" @click="printReceipt" :disabled="!isConnected">
      打印小票
    </button>

    <button class="btn" @click="disconnect" :disabled="!isConnected">
      断开连接
    </button>
  </view>
</template>

<script>
import bluetoothService from '@/utils/bluetooth.js'
import printCommands from '@/utils/print-commands.js'

export default {
  data() {
    return {
      connecting: false,
      isConnected: false,
      statusText: '未连接'
    }
  },

  onLoad() {
    // 监听连接状态变化
    bluetoothService.isConnected = this.isConnected
  },

  onUnload() {
    bluetoothService.disconnect()
  },

  methods: {
    // 连接打印机
    async connectPrinter() {
      this.connecting = true
      this.statusText = '正在连接...'

      try {
        await bluetoothService.initBluetooth()
        await bluetoothService.startDiscovery()
      } catch (error) {
        console.error('连接失败:', error)
        uni.showToast({
          title: '连接失败',
          icon: 'error'
        })
        this.connecting = false
        this.statusText = '连接失败'
      }
    },

    // 打印测试页
    async printTest() {
      const commands = printCommands.mergeCommands([
        printCommands.init(),
        printCommands.setAlign(1), // 居中
        printCommands.setFontSize(3), // 大字体
        printCommands.printText('测试打印\n'),
        printCommands.lineFeed(),
        printCommands.setFontSize(0), // 正常字体
        printCommands.setAlign(0), // 左对齐
        printCommands.printText('打印时间: ' + new Date().toLocaleString() + '\n'),
        printCommands.lineFeed(2),
        printCommands.cutPaper()
      ])

      try {
        await bluetoothService.printData(commands.buffer)
        uni.showToast({
          title: '打印成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('打印失败:', error)
        uni.showToast({
          title: '打印失败',
          icon: 'error'
        })
      }
    },

    // 打印小票
    async printReceipt() {
      const receiptData = {
        orderNo: '202601050001',
        items: [
          { name: '商品A', price: 25.00, quantity: 2 },
          { name: '商品B', price: 15.50, quantity: 1 }
        ],
        total: 65.50
      }

      const commands = printCommands.mergeCommands([
        printCommands.init(),
        printCommands.setAlign(1),
        printCommands.setFontSize(3),
        printCommands.printText('销售小票\n'),
        printCommands.lineFeed(),

        printCommands.setAlign(0),
        printCommands.setFontSize(0),
        printCommands.printText(`订单号: ${receiptData.orderNo}\n`),
        printCommands.printText('------------------------\n'),

        // 商品列表
        ...receiptData.items.flatMap(item => [
          printCommands.printText(`${item.name} x${item.quantity}\n`),
          printCommands.setAlign(2),
          printCommands.printText(`¥${(item.price * item.quantity).toFixed(2)}\n`),
          printCommands.setAlign(0)
        ]),

        printCommands.printText('------------------------\n'),
        printCommands.setFontSize(1),
        printCommands.printText('总计:'),
        printCommands.setAlign(2),
        printCommands.printText(`¥${receiptData.total.toFixed(2)}\n`),
        printCommands.lineFeed(2),

        // 二维码
        printCommands.setAlign(1),
        printCommands.printQRCode('https://example.com/receipt/' + receiptData.orderNo),

        printCommands.lineFeed(3),
        printCommands.cutPaper()
      ])

      try {
        await bluetoothService.printData(commands.buffer)
        uni.showToast({
          title: '打印成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('打印失败:', error)
        uni.showToast({
          title: '打印失败',
          icon: 'error'
        })
      }
    },

    // 断开连接
    disconnect() {
      bluetoothService.disconnect()
      this.isConnected = false
      this.statusText = '未连接'
      uni.showToast({
        title: '已断开连接',
        icon: 'success'
      })
    }
  }
}
</script>

<style>
.container {
  padding: 30rpx;
}

.status {
  margin-bottom: 40rpx;
  padding: 20rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
}

.btn {
  margin-bottom: 20rpx;
  background-color: #007AFF;
  color: white;
  border-radius: 10rpx;
}

.btn:disabled {
  background-color: #cccccc;
}
</style>