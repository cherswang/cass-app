<template>
  <view class="container">
    <!-- 使用 uView Plus 的导航栏 -->
    <u-navbar
        :title="navTitle"
        :placeholder="true"
        bg-color="#FFFFFF"
        title-color="#333333"
        :border="false"
        :auto-back="true"
    >
      <!-- 右侧模式选择 -->
      <template #right>
        <view class="mode-selector" @click="showModePicker = true">
          <text class="mode-text">{{ selectedMode }}</text>
          <u-icon name="arrow-down" size="12" color="#666666"></u-icon>
        </view>
      </template>
    </u-navbar>

    <!-- 表单内容 -->
    <scroll-view class="form-scroll" scroll-y>
      <view class="form-container">
        <!-- 名称 -->
        <view class="form-item">
          <text class="form-label required">名称</text>
          <u-input
              v-model="form.name"
              placeholder="请输入商品名称"
              border="none"
              class="form-input"
              placeholder-class="placeholder-style"
          />
        </view>

        <!-- 类别 -->
        <view class="form-item">
          <text class="form-label required">类别</text>
          <view class="form-input" @click="showCategoryPicker = true">
            <text class="input-text" :class="{ 'placeholder': !form.category }">
              {{ form.category || '请选择商品类别' }}
            </text>
            <u-icon name="arrow-right" size="14" color="#C8C9CC"></u-icon>
          </view>
        </view>

        <!-- 进货价 -->
        <view class="form-item">
          <text class="form-label">进货价</text>
          <u-input
              v-model="form.purchasePrice"
              placeholder="￥0.00"
              border="none"
              type="digit"
              class="form-input"
              placeholder-class="placeholder-style"
          >
            <template #prefix>
              <text class="currency-symbol">￥</text>
            </template>
          </u-input>
        </view>

        <!-- 零售价 -->
        <view class="form-item">
          <text class="form-label">零售价</text>
          <u-input
              v-model="form.retailPrice"
              placeholder="￥0.00"
              border="none"
              type="digit"
              class="form-input"
              placeholder-class="placeholder-style"
          >
            <template #prefix>
              <text class="currency-symbol">￥</text>
            </template>
          </u-input>
        </view>

        <!-- 货号 -->
        <view class="form-item">
          <text class="form-label">货号</text>
          <u-input
              v-model="form.itemNumber"
              placeholder="请输入货号"
              border="none"
              class="form-input"
              placeholder-class="placeholder-style"
          />
        </view>

        <!-- 商品条码 -->
        <view class="form-item">
          <text class="form-label">商品条码</text>
          <view class="form-input">
            <u-input
                v-model="form.barcode"
                placeholder="请扫码识别或手动输入"
                border="none"
                class="barcode-input"
                placeholder-class="placeholder-style"
            />
            <u-icon name="scan" size="18" color="#2979FF" class="scan-icon"></u-icon>
          </view>
        </view>

        <!-- 库存 -->
        <view class="form-item">
          <text class="form-label">库存</text>
          <u-input
              v-model="form.stock"
              placeholder="请输入库存"
              border="none"
              type="number"
              class="form-input"
              placeholder-class="placeholder-style"
          />
        </view>

        <!-- 规格 -->
        <view class="form-item">
          <text class="form-label">规格</text>
          <u-input
              v-model="form.specification"
              placeholder="请输入规格"
              border="none"
              class="form-input"
              placeholder-class="placeholder-style"
          />
        </view>

        <!-- 图片 -->
        <view class="form-item">
          <text class="form-label">图片</text>
          <view class="upload-container">
            <u-upload
                :file-list="form.images"
                @afterRead="handleImageUpload"
                @delete="handleImageDelete"
                multiple
                max-count="5"
                :deletable="true"
                :preview-full-image="true"
            >
              <view class="upload-btn">
                <u-icon name="camera" size="20" color="#C8C9CC"></u-icon>
              </view>
            </u-upload>
          </view>
        </view>

        <!-- 商品描述 -->
        <view class="form-item textarea-item">
          <text class="form-label">商品描述</text>
          <u-textarea
              v-model="form.description"
              placeholder="请输入商品描述"
              border="none"
              height="80"
              class="textarea"
              placeholder-class="placeholder-style"
          />
        </view>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="action-buttons">
      <view class="save-buttons">
        <u-button
            type="primary"
            size="large"
            @click="handleSave"
            class="save-button"
        >
          保存
        </u-button>
        <u-button
            type="success"
            size="large"
            @click="handleSaveAndAdd"
            class="save-add-button"
        >
          保存并新增
        </u-button>
      </view>
    </view>

    <!-- 模式选择器 -->
    <u-picker
        :show="showModePicker"
        :columns="[modeOptions]"
        key-name="label"
        @confirm="handleModeConfirm"
        @cancel="showModePicker = false"
    />

    <!-- 类别选择器 -->
    <u-picker
        :show="showCategoryPicker"
        :columns="categoryOptions"
        key-name="label"
        @confirm="handleCategoryConfirm"
        @cancel="showCategoryPicker = false"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      navTitle: '新增商品',
      showModePicker: false,
      showCategoryPicker: false,
      selectedMode: '完整模式',
      modeOptions: [
        { label: '完整模式', value: 'full' },
        { label: '极简模式', value: 'simple' }
      ],
      form: {
        name: '',
        category: '',
        purchasePrice: '',
        retailPrice: '',
        itemNumber: '',
        barcode: '',
        stock: '',
        specification: '',
        images: [],
        description: ''
      },
      categoryOptions: [
        [
          { label: '电子产品', value: 'electronics' },
          { label: '服装', value: 'clothing' },
          { label: '食品', value: 'food' },
          { label: '家居', value: 'home' },
          { label: '图书', value: 'books' }
        ]
      ]
    }
  },

  methods: {
    handleModeConfirm(e) {
      const { value } = e
      this.selectedMode = value[0]?.label || '完整模式'
      this.showModePicker = false
    },

    handleCategoryConfirm(e) {
      const { value } = e
      this.form.category = value[0]?.label || ''
      this.showCategoryPicker = false
    },

    handleImageUpload(event) {
      const { file } = event
      this.form.images.push({
        url: file.url,
        status: 'success'
      })
    },

    handleImageDelete(event) {
      const { index } = event
      this.form.images.splice(index, 1)
    },

    handleEditCustom() {
      uni.showToast({
        title: '编辑自定义项',
        icon: 'none'
      })
    },

    handleSave() {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    },

    handleSaveAndAdd() {
      uni.showToast({
        title: '保存成功，准备新增',
        icon: 'success'
      })
      this.resetForm()
    },

    resetForm() {
      this.form = {
        name: '',
        category: '',
        purchasePrice: '',
        retailPrice: '',
        itemNumber: '',
        barcode: '',
        stock: '',
        specification: '',
        images: [],
        description: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #F5F5F5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

// 自定义导航栏右侧样式
.mode-selector {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background-color: #F8F8F8;
  border-radius: 6rpx;

  .mode-text {
    font-size: 14px;
    color: #666666;
  }
}

.form-scroll {
  flex: 1;
  padding: 20rpx 30rpx;
}

.form-container {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 0;
}

.form-item {
  display: flex;
  align-items: center;
  min-height: 100rpx;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #F0F0F0;

  &:last-child {
    border-bottom: none;
  }

  .form-label {
    width: 160rpx;
    font-size: 16px;
    color: #333333;

    &.required::before {
      content: '*';
      color: #FA3534;
      margin-right: 4rpx;
    }
  }

  .form-input {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 80rpx;

    .input-text {
      font-size: 16px;
      color: #333333;

      &.placeholder {
        color: #C8C9CC;
      }
    }

    .barcode-input {
      flex: 1;
    }

    .scan-icon {
      margin-left: 20rpx;
    }
  }
}

.textarea-item {
  align-items: flex-start;
  padding: 30rpx;

  .textarea {
    flex: 1;
    margin-left: 0;
  }
}

.upload-container {
  flex: 1;
  padding: 20rpx 0;

  .upload-btn {
    width: 120rpx;
    height: 120rpx;
    border: 1rpx dashed #C8C9CC;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F8F8F8;
  }
}

.currency-symbol {
  color: #333333;
  font-size: 16px;
  margin-right: 10rpx;
}

.placeholder-style {
  color: #C8C9CC !important;
  font-size: 16px;
}

.action-buttons {
  padding: 30rpx;
  background-color: #FFFFFF;
  border-top: 1rpx solid #F0F0F0;

  .save-buttons {
    display: flex;
    gap: 20rpx;

    .save-button,
    .save-add-button {
      flex: 1;
      height: 88rpx;
      border-radius: 8rpx;
      font-size: 16px;
    }
  }
}
</style>