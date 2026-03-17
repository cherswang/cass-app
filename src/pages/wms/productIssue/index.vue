<script lang="ts">
import {defineComponent, ref, onMounted} from 'vue'
import {getInfoByBatchCode} from '@/api/wms/materialStock'
import {addIssueheader} from '@/api/wms/productOut'

export default defineComponent({
  name: "ProductIssue",
  setup() {
    // 扫码输入框
    const scanCode = ref('')
    // 扫码结果列表
    const materialList = ref<Array<any>>([])
    // 扫码数量
    const scanCount = ref(0)
    // 总净重
    const totalNetWeight = ref(0)
    // 加载状态
    const loading = ref(false)
    // 表单数据
    const formData = ref({
      issueCode: '',
      warehouseId: '',
      warehouseCode: '',
      warehouseName: '',
      locationId: '',
      locationCode: '',
      locationName: '',
      areaId: '',
      areaCode: '',
      areaName: '',
      status: 'PREPARE',
      remark: ''
    })

    // 扫码功能
    const handleScan = async () => {
      if (!scanCode.value.trim()) {
        uni.showToast({
          title: '请输入批次码',
          icon: 'none'
        })
        return
      }

      loading.value = true
      // 隐藏软键盘（在移动端很有用）
      uni.hideKeyboard()
      try {
        const response = await getInfoByBatchCode(scanCode.value.trim())
        if (response.code === 200 && response.data) {
          // 添加到列表
          materialList.value.push(response.data)
          // 更新统计信息
          scanCount.value = materialList.value.length
          // 计算总净重
          totalNetWeight.value = materialList.value.reduce((sum, item) => {
            return sum + (Number(item.netWeight) || 0)
          }, 0)
          // 清空输入框
          scanCode.value = ''
        } else {
          uni.showToast({
            title: '扫码失败: ' + (response.msg || '未知错误'),
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '扫码失败: 网络错误',
          icon: 'none'
        })
        console.error('扫码失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 申请领料
    const handleApplyIssue = async () => {
      if (materialList.value.length === 0) {
        uni.showToast({
          title: '请先扫码添加物料',
          icon: 'none'
        })
        return
      }

      loading.value = true
      try {
        // 构造请求数据
        const requestData = {
          ...formData.value,
          // 生成领料单号
          issueCode: 'IS' + Date.now(),
          // 子表数据
          materialLines: materialList.value.map((item, index) => ({
            materialStockId: item.materialStockId,
            itemId: item.itemId,
            itemCode: item.itemCode,
            itemName: item.itemName,
            specification: item.specification,
            unitOfMeasure: item.unitOfMeasure,
            batchCode: item.batchCode,
            quantityIssued: item.grossWeight,
            grossWeight: item.grossWeight,
            netWeight: item.netWeight,
            tareWeight: item.tareWeight,
            warehouseId: item.warehouseId,
            warehouseCode: item.warehouseCode,
            warehouseName: item.warehouseName,
            locationId: item.locationId,
            locationCode: item.locationCode,
            locationName: item.locationName,
            areaId: item.areaId,
            areaCode: item.areaCode,
            areaName: item.areaName,
            remark: ''
          }))
        }
        console.log('领料申请数据:', requestData)
        const response = await addIssueheader(requestData)
        console.log('领料申请结果:', response)
        if (response.code == 200) {
          uni.showToast({
            title: '领料申请成功',
            icon: 'success'
          })
          // 清空数据
          materialList.value = []
          scanCount.value = 0
          totalNetWeight.value = 0
        } else {
          uni.showToast({
            title: '领料申请失败: ' + (response.msg || '未知错误'),
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '领料申请失败: 网络错误',
          icon: 'none'
        })
        console.error('领料申请失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 删除扫码记录
    const handleDelete = (index: number) => {
      // 获取要删除的记录
      const deletedItem = materialList.value[index]
      // 删除记录
      materialList.value.splice(index, 1)
      // 更新统计信息
      scanCount.value = materialList.value.length
      // 更新总净重
      totalNetWeight.value = materialList.value.reduce((sum, item) => {
        return sum + (Number(item.netWeight) || 0)
      }, 0)
    }

    // 回车键触发扫码
    const handleKeyDown = (e: any) => {
      if (e.key === 'Enter') {
        handleScan()
      }
    }

    return {
      scanCode,
      materialList,
      scanCount,
      totalNetWeight,
      loading,
      formData,
      handleScan,
      handleApplyIssue,
      handleDelete,
      handleKeyDown
    }
  }
})
</script>

<template>
  <div class="product-issue-container">
    <!-- 固定区域：扫码和统计 -->
    <div class="fixed-area">
      <!-- 扫码区域 -->
      <div class="scan-area">
        <div class="scan-input-group">
        <input 
          v-model="scanCode" 
          type="text" 
          placeholder="请扫描或输入批次码" 
          class="scan-input" 
          @confirm="handleScan"
          autocomplete="off"
          focus
        />
        <button @click="handleScan" class="scan-btn" :disabled="loading">
          {{ loading ? '扫码中...' : '扫码' }}
        </button>
      </div>
      </div>
      
      <!-- 统计区域 -->
      <div class="stats-area">
        <div class="stat-item">
          <label>扫码数量</label>
          <span class="stat-value">{{ scanCount }}</span>
        </div>
        <div class="stat-item">
          <label>总净重</label>
          <span class="stat-value">{{ totalNetWeight.toFixed(2) }} kg</span>
        </div>
      </div>
    </div>
    
    <!-- 列表区域 -->
    <div class="list-area">
      <h4>扫码结果列表</h4>
      <!-- 卡片列表容器 -->
      <div class="card-list">
        <div v-for="(item, index) in materialList" :key="index" class="material-card">
          <div class="card-header">
            <div class="card-index">{{ index + 1 }}</div>
            <button @click="handleDelete(index)" class="delete-btn">删除</button>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="label">批&nbsp;&nbsp;次&nbsp;&nbsp;码：</span>
              <span class="value">{{ item.batchCode }}</span>
            </div>
            <div class="card-row">
              <span class="label">产品编码：</span>
              <span class="value">{{ item.itemCode }}</span>
            </div>
            <div class="card-row">
              <div class="merged-item">
                <span class="label">产品名称：</span>
                <span class="value">{{ item.itemName }}</span>
              </div>
              <div class="merged-item">
                <span class="label">规格型号：</span>
                <span class="value">{{ item.specification }}</span>
              </div>
            </div>
            <div class="card-row">
              <span class="label">净&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;重：</span>
              <span class="value">{{ Number(item.netWeight).toFixed(2) }} kg</span>
            </div>
          </div>
        </div>
        <div v-if="materialList.length === 0" class="empty-tip">
          暂无扫码记录
        </div>
      </div>
    </div>
    
    <!-- 操作区域 -->
    <div class="action-area">
      <button @click="handleApplyIssue" class="apply-btn" :disabled="loading || materialList.length === 0">
        {{ loading ? '申请中...' : '申请领料' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 重置样式，确保在PDA上正常显示 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 页面容器，适合PDA全屏显示 */
.product-issue-container {
  padding: 10px;
  width: 100%;
  height: 100vh;
  background-color: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 固定区域 */
.fixed-area {
  margin-bottom: 10px;
}

/* 页面标题，加大字号，适合PDA显示 */
.page-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #333;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
}

/* 扫码区域，优化布局 */
.scan-area {
  margin-bottom: 10px;
}

/* 扫码输入组，水平布局，扫码按钮在文本框后面 */
.scan-input-group {
  display: flex;
  gap: 10px;
}

/* 扫码输入框，调整尺寸和字号 */
.scan-input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  background-color: white;
}

.scan-input:focus {
  border-color: #409eff;
}

/* 扫码按钮，调整尺寸和字号，放在文本框后面 */
.scan-btn {
  width: 60px;
  height: 36px;
  padding: 0 8px;
  font-size: 13px;
  font-weight: bold;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  line-height: 36px;
}

.scan-btn:hover:not(:disabled) {
  background-color: #66b1ff;
}

.scan-btn:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
}

/* 统计区域，优化布局和样式 */
.stats-area {
  display: flex;
  gap: 15px;
  padding: 12px;
  background-color: white;
  border-radius: 6px;
}

/* 统计项，优化布局 */
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
}

.stat-item:last-child {
  border-bottom: none;
}

/* 统计标签，调整字号 */
.stat-item label {
  font-size: 14px;
  font-weight: bold;
  color: #606266;
}

/* 统计值，加大字号和粗细 */
.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

/* 列表区域，优化样式 */
.list-area {
  background-color: white;
  border-radius: 6px;
  padding: 12px;
  /* 计算高度：减去固定区域和操作区域的高度 */
  flex: 1;
  overflow: hidden;
  margin-bottom: 50px;
}

/* 列表标题，加大字号 */
.list-area h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
}

/* 卡片列表容器，添加滚动条 */
.card-list {
  overflow-y: auto;
  max-height: calc(100% - 50px);
}

/* 滚动条样式 */
.card-list::-webkit-scrollbar {
  width: 8px;
}

.card-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.card-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.card-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 物料卡片样式 */
.material-card {
  background-color: white;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  margin-bottom: 10px;
  padding: 12px;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

/* 卡片序号 */
.card-index {
  font-size: 14px;
  font-weight: bold;
  color: #409eff;
  background-color: #ecf5ff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 卡片主体 */
.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}

/* 卡片行 */
.card-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
}

/* 合并项 */
.merged-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 卡片标签 */
.card-row .label {
  font-size: 11px;
  color: #606266;
  font-weight: bold;
}

/* 卡片值 */
.card-row .value {
  font-size: 12px;
  color: #333;
  word-break: break-all;
}

/* 删除按钮，加大尺寸，适合触摸 */
.delete-btn {
  padding: 4px 8px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  line-height: 1;
}

.delete-btn:hover {
  background-color: #f78989;
}

/* 空提示，优化样式 */
.empty-tip {
  text-align: center;
  padding: 30px 20px;
  color: #909399;
  background-color: white;
  font-size: 16px;
}

/* 操作区域，优化样式 */
.action-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #ebeef5;
  text-align: center;
  z-index: 100;
}

/* 申请按钮，加大尺寸，适合触摸 */
.apply-btn {
  width: 100%;
  height: 38px;
  font-size: 14px;
  font-weight: bold;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  line-height: 38px;
  padding: 0;
  display: inline-block;
}

.apply-btn:hover:not(:disabled) {
  background-color: #85ce61;
}

.apply-btn:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
}

/* 响应式调整，确保在各种PDA设备上正常显示 */
@media (max-width: 768px) {
  .product-issue-container {
    padding: 10px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .scan-input,
  .scan-btn {
    height: 50px;
    font-size: 18px;
    line-height: 50px;
  }
  
  .apply-btn {
    height: 55px;
    font-size: 20px;
    line-height: 55px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  /* 卡片响应式调整 */
  .card-row {
    gap: 10px;
  }
  
  .merged-item {
    flex: 1;
    min-width: 100px;
  }
  
  /* 统计区域响应式 */
  .stats-area {
    gap: 15px;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 22px;
  }
  
  .scan-input,
  .scan-btn {
    height: 48px;
    font-size: 17px;
    line-height: 48px;
  }
  
  .apply-btn {
    height: 52px;
    font-size: 19px;
    line-height: 52px;
  }
  
  .stat-item label {
    font-size: 16px;
  }
  
  .stat-value {
    font-size: 18px;
  }
  
  /* 统计区域响应式 */
  .stats-area {
    gap: 10px;
    padding: 10px;
  }
  
  /* 卡片响应式调整 */
  .material-card {
    padding: 12px;
  }
  
  .card-header {
    margin-bottom: 10px;
    padding-bottom: 8px;
  }
  
  .card-body {
    gap: 8px;
  }
}
</style>