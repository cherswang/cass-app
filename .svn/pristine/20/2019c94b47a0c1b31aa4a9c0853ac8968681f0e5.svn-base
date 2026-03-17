class PrintCommands {
    // 初始化打印机
    init() {
        return this.hexToArrayBuffer('1B40')
    }

    // 设置对齐方式 (0:左对齐, 1:居中, 2:右对齐)
    setAlign(align = 0) {
        return this.hexToArrayBuffer(`1B61${align.toString(16).padStart(2, '0')}`)
    }

    // 设置字体大小 (0:正常, 1:双倍宽, 2:双倍高, 3:双倍宽高)
    setFontSize(size = 0) {
        const sizes = ['00', '01', '10', '11']
        return this.hexToArrayBuffer(`1D21${sizes[size] || '00'}`)
    }

    // 设置加粗
    setBold(bold = true) {
        return this.hexToArrayBuffer(bold ? '1B4501' : '1B4500')
    }

    // 打印文本
    printText(text) {
        const encoder = new TextEncoder()
        return encoder.encode(text)
    }

    // 换行
    lineFeed(lines = 1) {
        return this.hexToArrayBuffer('0A'.repeat(lines))
    }

    // 打印二维码
    printQRCode(content, size = 6) {
        // 设置二维码大小
        const sizeCmd = this.hexToArrayBuffer(`1D286B03003143${size.toString(16).padStart(2, '0')}`)

        // 设置二维码内容长度
        const len = content.length + 3
        const lenHex = len.toString(16).padStart(4, '0')
        const lenCmd = this.hexToArrayBuffer(`1D286B${lenHex.substring(0, 2)}${lenHex.substring(2, 4)}315030`)

        // 二维码内容
        const contentCmd = new TextEncoder().encode(content)

        // 打印二维码
        const printCmd = this.hexToArrayBuffer('1D286B03003151')

        // 换行
        const lineFeed = this.hexToArrayBuffer('0A')

        // 合并所有指令
        const result = new Uint8Array([
            ...sizeCmd,
            ...lenCmd,
            ...contentCmd,
            ...printCmd,
            ...lineFeed
        ])

        return result
    }

    // 切纸
    cutPaper() {
        return this.hexToArrayBuffer('1D5642')
    }

    // 十六进制字符串转ArrayBuffer
    hexToArrayBuffer(hex) {
        const bytes = new Uint8Array(hex.length / 2)
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
        }
        return bytes
    }

    // 合并多个指令
    mergeCommands(commands) {
        const totalLength = commands.reduce((sum, cmd) => sum + cmd.length, 0)
        const result = new Uint8Array(totalLength)
        let offset = 0

        commands.forEach(cmd => {
            result.set(cmd, offset)
            offset += cmd.length
        })

        return result
    }
}

export default new PrintCommands()