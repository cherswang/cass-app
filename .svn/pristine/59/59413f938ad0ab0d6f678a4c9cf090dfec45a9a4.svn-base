<template>
  <view class="dict-tag-container">
    <template v-for="(item, index) in safeOptions">
      <template v-if="values.includes(item.value)">
        <!-- 默认样式 -->
        <view
          v-if="item.raw.listClass == 'default' || item.raw.listClass == ''"
          :key="item.value"
          :class="['dict-tag', 'dict-tag-default', item.raw.cssClass]"
        >
          {{ item.label }}
        </view>
        <!-- 标签样式 -->
        <uni-tag
          v-else
          :key="item.value + ''"
          :text="item.label"
          :type="getTagType(item.raw.listClass)"
          :class="item.raw.cssClass"
        />
      </template>
    </template>
    <!-- 未匹配的值 -->
    <template v-if="unmatch && showValue">
      <text class="unmatch-text">{{ unmatchArray }}</text>
    </template>
  </view>
</template>

<script>
export default {
  name: 'UniDictTag',
  props: {
    options: {
      type: [Array, Object],
      default: () => []
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },
    showValue: {
      type: Boolean,
      default: false
    },
    separator: {
      type: String,
      default: ','
    }
  },
  computed: {
    safeOptions() {
      // 确保options始终为数组
      let options = this.options;
      
      if (!Array.isArray(options)) {
        // 如果options是对象且有特定结构（如来自useDict），转换为数组
        if (options && typeof options === 'object' && Object.keys(options).length === 1) {
          const dictKey = Object.keys(options)[0];
          if (Array.isArray(options[dictKey])) {
            options = options[dictKey];
          } else {
            return [];
          }
        } else {
          return [];
        }
      }
      
      // 转换字典数据格式，适配不同的字段名
      return options.map(item => {
        // 如果已经是标准格式，直接返回
        if (item.value !== undefined && item.label !== undefined) {
          return item;
        }
        
        // 转换格式：dictValue -> value, dictLabel -> label
        return {
          value: item.dictValue !== undefined ? item.dictValue : item.value,
          label: item.dictLabel !== undefined ? item.dictLabel : item.label,
          raw: {
            listClass: item.listClass || 'default',
            cssClass: item.cssClass || ''
          }
        };
      });
    },
    values() {
      if (this.value === '' || this.value === null || typeof this.value === 'undefined') return [];
      return Array.isArray(this.value) ? this.value.map((item) => '' + item) : String(this.value).split(this.separator);
    },
    unmatch() {
      if (this.safeOptions.length === 0 || this.value === '' || this.value === null || typeof this.value === 'undefined') return false;
      // 检查是否有未匹配项
      let unmatch = false;
      this.values.forEach((item) => {
        if (!this.safeOptions.some((v) => v.value === item)) {
          unmatch = true;
        }
      });
      return unmatch;
    },
    unmatchArray() {
      // 记录未匹配的项
      const itemUnmatchArray = [];
      if (this.value !== '' && this.value !== null && typeof this.value !== 'undefined') {
        this.values.forEach((item) => {
          if (!this.safeOptions.some((v) => v.value === item)) {
            itemUnmatchArray.push(item);
          }
        });
      }
      // 没有value不显示
      return this.handleArray(itemUnmatchArray);
    }
  },
  methods: {
    getTagType(listClass) {
      // 转换listClass到uni-tag支持的type
      const typeMap = {
        'primary': 'primary',
        'success': 'success',
        'warning': 'warning',
        'error': 'error',
        'info': 'default'
      };
      return typeMap[listClass] || 'default';
    },
    handleArray(array) {
      if (array.length === 0) return '';
      return array.reduce((pre, cur) => {
        return pre + ' ' + cur;
      });
    }
  }
}
</script>

<style scoped>
.dict-tag-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 30rpx;
}

.dict-tag {
  margin: 0;
}

.dict-tag-default {
  font-size: 15px;
  color: #1a1a1a;
  padding: 6px 12px;
  background-color: #f0f0f0;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  font-weight: 500;
  line-height: 1.4;
  display: inline-flex;
  align-items: center;
  min-height: 28px;
}

.unmatch-text {
  color: #dc3545;
  font-size: 14px;
  margin-left: 6px;
  font-weight: 500;
  background-color: #fff3cd;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ffeaa7;
}

/* 覆盖uni-tag的默认样式 */
.uni-tag {
  margin: 0 !important;
  font-weight: 500 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dict-tag-default {
    font-size: 14px;
    padding: 5px 10px;
    min-height: 26px;
  }

  .unmatch-text {
    font-size: 13px;
    padding: 3px 6px;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .dict-tag-default {
    color: #000;
    background-color: #fff;
    border-color: #000;
    border-width: 2px;
  }

  .unmatch-text {
    color: #000;
    background-color: #ffff00;
    border-color: #000;
  }
}
</style>