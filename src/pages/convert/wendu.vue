<template>
  <div class="calculator">
    <div class="converter-area">
      <div class="converter-row">
        <input type="text" v-model="inputValue" @input="onInput" @keydown="onKeyDown"
        ref="inputField" class="converter-input" placeholder="输入数值"/>
        <select v-model="inputUnit" @change="convert" class="unit-select">
          <option v-for="unit in units" :key="unit.value" :value="unit.value">
            {{ unit.label }}
          </option>
        </select>
      </div>
      
      <div class="converter-row">
        <input type="text" v-model="resultValue" @input="onResultInput" @focus="onResultFocus"
          class="converter-input result-input" placeholder="结果"/>
        <select v-model="resultUnit" @change="convertFromResult" class="unit-select">
          <option v-for="unit in units" :key="unit.value" :value="unit.value">
            {{ unit.label }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="keyboard-grid">
      <CalculatorButton @click="inputKey('7')" label="7"/>
      <CalculatorButton @click="inputKey('8')" label="8"/>
      <CalculatorButton @click="inputKey('9')" label="9"/>
      <CalculatorButton @click="deleteLast" class="function-btn" label="⌫"/>
      
      <CalculatorButton @click="inputKey('4')" label="4"/>
      <CalculatorButton @click="inputKey('5')" label="5"/>
      <CalculatorButton @click="inputKey('6')" label="6"/>
      <CalculatorButton @click="clearInput" class="function-btn" label="AC"/>
      
      <CalculatorButton @click="inputKey('1')" label="1"/>
      <CalculatorButton @click="inputKey('2')" label="2"/>
      <CalculatorButton @click="inputKey('3')" label="3"/>
      <CalculatorButton @click="inputKey('-')" class="function-btn" label="-"/>
      
      
      <CalculatorButton @click="inputKey('0')" class="zero-btn" label="0"/>
      <CalculatorButton @click="inputKey('.')" label="."/>
      <CalculatorButton class="function-btn" label="温度"/>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CalculatorButton from '../compute/CalculatorButton.vue'

// 温度单位定义
const units = [
  { value: 'celsius', label: '摄氏度 (°C)' },
  { value: 'fahrenheit', label: '华氏度 (°F)' },
  { value: 'kelvin', label: '开尔文 (K)' },
  { value: 'rankine', label: '兰氏度 (°R)' },
  { value: 'reaumur', label: '列氏度 (°Ré)' }
]

const inputValue = ref('')
const inputUnit = ref('celsius')  // 默认输入单位为摄氏度
const resultValue = ref('')
const resultUnit = ref('fahrenheit')  // 默认输出单位为华氏度
const inputField = ref(null)
const isEditingResult = ref(false)

// 温度转换函数
const convertTemperature = (value, fromUnit, toUnit) => {
  if (value === '' || isNaN(value)) {
    return ''
  }
  
  const num = parseFloat(value)
  
  // 首先转换到开尔文作为中间单位
  let kelvin
  
  switch (fromUnit) {
    case 'celsius': // 摄氏度转开尔文
      kelvin = num + 273.15
      break
    case 'fahrenheit': // 华氏度转开尔文
      kelvin = (num - 32) * 5/9 + 273.15
      break
    case 'kelvin': // 开尔文
      kelvin = num
      break
    case 'rankine': // 兰氏度转开尔文
      kelvin = num * 5/9
      break
    case 'reaumur': // 列氏度转开尔文
      kelvin = num * 5/4 + 273.15
      break
    default:
      return ''
  }
  
  // 从开尔文转换到目标单位
  switch (toUnit) {
    case 'celsius': // 开尔文转摄氏度
      return (kelvin - 273.15).toString()
    case 'fahrenheit': // 开尔文转华氏度
      return ((kelvin - 273.15) * 9/5 + 32).toString()
    case 'kelvin': // 开尔文
      return kelvin.toString()
    case 'rankine': // 开尔文转兰氏度
      return (kelvin * 9/5).toString()
    case 'reaumur': // 开尔文转列氏度
      return ((kelvin - 273.15) * 4/5).toString()
    default:
      return ''
  }
}

// 转换函数（从输入计算结果）
const convert = () => {
  if (inputValue.value === '') {
    resultValue.value = ''
    return
  }
  
  const converted = convertTemperature(inputValue.value, inputUnit.value, resultUnit.value)
  resultValue.value = formatTemperature(converted)
  isEditingResult.value = false
}

// 从结果反向计算输入
const convertFromResult = () => {
  if (resultValue.value === '') {
    inputValue.value = ''
    return
  }
  
  const converted = convertTemperature(resultValue.value, resultUnit.value, inputUnit.value)
  inputValue.value = formatTemperature(converted)
}

// 格式化温度数值
const formatTemperature = (value) => {
  if (value === '') return ''
  
  const num = parseFloat(value)
  if (isNaN(num)) return value
  
  // 保留合适的小数位数
  if (Math.abs(num) < 1e-6 || Math.abs(num) > 1e9) {
    return num.toExponential(6)
  }
  
  // 对于整数或小数值较小的数
  if (Math.abs(num - Math.round(num)) < 1e-8) {
    return Math.round(num).toString()
  }
  
  // 对于一般情况，保留4位小数
  const formatted = num.toFixed(4)
  // 移除末尾的0
  return formatted.replace(/\.?0+$/, '')
}

// 结果输入框的输入处理
const onResultInput = (event) => {
  let value = event.target.value
  
  // 允许数字、小数点、负号
  value = value.replace(/[^\d.-]/g, '')
  
  // 确保只有一个负号且在开头
  if (value.includes('-')) {
    const parts = value.split('-')
    if (parts.length > 2 || (parts.length === 2 && parts[0] !== '')) {
      value = '-' + parts.filter(p => p !== '').join('')
    }
  }
  
  // 确保只有一个小数点
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  
  resultValue.value = value
  isEditingResult.value = true
  
  clearTimeout(window.convertTimeout)
  window.convertTimeout = setTimeout(() => {
    convertFromResult()
  }, 300)
}

const inputKey = (key) => {
  if (isEditingResult.value) {
    if (resultValue.value === '') {
      resultValue.value = (key === '-') ? '-' : (key === '.' ? '0.' : key)
    } else if (key === '-') {
      // 处理负号
      if (resultValue.value.startsWith('-')) {
        resultValue.value = resultValue.value.substring(1)
      } else {
        resultValue.value = '-' + resultValue.value
      }
    } else if (key === '.') {
      // 处理小数点
      if (!resultValue.value.includes('.')) {
        if (resultValue.value === '') {
          resultValue.value = '0.'
        } else {
          resultValue.value += '.'
        }
      }
    } else {
      // 处理数字
      if (resultValue.value === '0' && key !== '0') {
        resultValue.value = key
      } else {
        resultValue.value += key
      }
    }
    convertFromResult()
  } else {
    if (inputValue.value === '') {
      inputValue.value = (key === '-') ? '-' : (key === '.' ? '0.' : key)
    } else if (key === '-') {
      // 处理负号
      if (inputValue.value.startsWith('-')) {
        inputValue.value = inputValue.value.substring(1)
      } else {
        inputValue.value = '-' + inputValue.value
      }
    } else if (key === '.') {
      // 处理小数点
      if (!inputValue.value.includes('.')) {
        if (inputValue.value === '') {
          inputValue.value = '0.'
        } else {
          inputValue.value += '.'
        }
      }
    } else {
      // 处理数字
      if (inputValue.value === '0' && key !== '0') {
        inputValue.value = key
      } else {
        inputValue.value += key
      }
    }
    convert()
  }
}

const clearInput = () => {
  inputValue.value = ''
  resultValue.value = ''
  isEditingResult.value = false
}

const deleteLast = () => {
  if (isEditingResult.value) {
    if (resultValue.value.length > 0) {
      resultValue.value = resultValue.value.slice(0, -1)
      if (resultValue.value === '') {
        resultValue.value = ''
      } else {
        convertFromResult()
      }
    }
  } else {
    if (inputValue.value.length > 0) {
      inputValue.value = inputValue.value.slice(0, -1)
      if (inputValue.value === '') {
        resultValue.value = ''
      } else {
        convert()
      }
    }
  }
}

const onInput = (event) => {
  let value = event.target.value
  
  // 允许数字、小数点、负号
  value = value.replace(/[^\d.-]/g, '')
  
  // 确保只有一个负号且在开头
  if (value.includes('-')) {
    const parts = value.split('-')
    if (parts.length > 2 || (parts.length === 2 && parts[0] !== '')) {
      value = '-' + parts.filter(p => p !== '').join('')
    }
  }
  
  // 确保只有一个小数点
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  
  inputValue.value = value
  isEditingResult.value = false
  
  clearTimeout(window.convertTimeout)
  window.convertTimeout = setTimeout(() => {
    convert()
  }, 300)
}

onMounted(() => {
  // 初始化一个示例值
  inputValue.value = '0'
  convert()
})
</script>

<style scoped>
.calculator {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  box-shadow: var(--shadow);
  transition: all 0.3s;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

/* 换算区域样式 */
.converter-area {
  margin-bottom: 30px;
}

.converter-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.converter-row:last-child {
  margin-bottom: 0;
}

.converter-input {
  flex: 1;
  padding: 18px 20px;
  font-size: 24px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--input-bg);
  color: var(--text-color);
  text-align: right;
  transition: all 0.3s;
}

.converter-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* 键盘区域样式 */
.keyboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.zero-btn {
  grid-column: span 2;
}

.function-btn {
  background: var(--warning-color) !important;
  color: white !important;
}

.function-btn:hover {
  background: #d68910 !important;
}
</style>