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
      <CalculatorButton class="function-btn" label="面积"/>
      
      <CalculatorButton @click="inputKey('0')" class="zero-btn" label="0"/>
      <CalculatorButton @click="inputKey('.')" label="."/>
      <CalculatorButton class="function-btn" label="换算"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CalculatorButton from '../compute/CalculatorButton.vue'

// 面积单位定义（以平方米为基准单位）
const units = [
  { value: 'km2', label: '平方千米', factor: 1e6 },      // 1平方千米 = 1,000,000平方米
  { value: 'hectare', label: '公顷', factor: 10000 },   // 1公顷 = 10,000平方米
  { value: 'are', label: '公亩', factor: 100 },         // 1公亩 = 100平方米
  { value: 'm2', label: '平方米', factor: 1 },         // 基准单位
  { value: 'dm2', label: '平方分米', factor: 0.01 },    // 1平方分米 = 0.01平方米
  { value: 'cm2', label: '平方厘米', factor: 1e-4 },    // 1平方厘米 = 0.0001平方米
  { value: 'mm2', label: '平方毫米', factor: 1e-6 },    // 1平方毫米 = 0.000001平方米
  { value: 'μm2', label: '平方微米', factor: 1e-12 },   // 1平方微米 = 1e-12平方米
  { value: 'qing', label: '顷', factor: 66666.67 },     // 1顷 = 100亩 ≈ 66,666.67平方米
  { value: 'mu', label: '亩', factor: 666.6667 }        // 1亩 ≈ 666.6667平方米
]

const inputValue = ref('')
const inputUnit = ref('km2')  // 默认输入单位改为平方米
const resultValue = ref('0')
const resultUnit = ref('m2')  // 默认输出单位改为亩
const inputField = ref(null)
const isEditingResult = ref(false)

// 转换函数（从输入计算结果）
const convert = () => {
  const value = parseFloat(inputValue.value)
  
  if (isNaN(value) || inputValue.value === '') {
    resultValue.value = '0'
    return
  }
  // 找到输入单位和结果单位
  const inputUnitObj = units.find(u => u.value === inputUnit.value)
  const resultUnitObj = units.find(u => u.value === resultUnit.value)
  
  if (!inputUnitObj || !resultUnitObj) return

  const baseValue = value * inputUnitObj.factor
  const convertedValue = baseValue / resultUnitObj.factor
  
  resultValue.value = formatNumber(convertedValue)
  isEditingResult.value = false
}

// 从结果反向计算输入
const convertFromResult = () => {
  const value = parseFloat(resultValue.value)
  
  if (isNaN(value) || resultValue.value === '') {
    inputValue.value = ''
    return
  }
  
  const resultUnitObj = units.find(u => u.value === resultUnit.value)
  const inputUnitObj = units.find(u => u.value === inputUnit.value)
  
  if (!inputUnitObj || !resultUnitObj) return
  
  const baseValue = value * resultUnitObj.factor
  const convertedValue = baseValue / inputUnitObj.factor
  inputValue.value = formatNumber(convertedValue)
}

const formatNumber = (num) => {
  if (Math.abs(num) < 1e-6 || Math.abs(num) > 1e12) {
    return num.toExponential(6)
  }
  
  if (Number.isInteger(num) || Math.abs(num) < 1000) {
    let str = Number(num.toPrecision(12)).toString()
    if (str.includes('.') && str.endsWith('0')) {
      str = str.replace(/\.?0+$/, '')
    }
    if (str === '') str = '0'
    return str
  }
  
  return num.toLocaleString('zh-CN', {
    maximumFractionDigits: 8,
    minimumFractionDigits: 0
  })
}

// 结果输入框的输入处理
const onResultInput = (event) => {
  let value = event.target.value
  value = value.replace(/[^\d.]/g, '')
  
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
    if (resultValue.value === '0' && key !== '.') {
      resultValue.value = key
    } else {
      if (key === '.' && resultValue.value.includes('.')) {
        return
      }
      resultValue.value += key
    }
    convertFromResult()
  } else {
    if (inputValue.value === '0' && key !== '.') {
      inputValue.value = key
    } else {
      if (key === '.' && inputValue.value.includes('.')) {
        return
      }
      inputValue.value += key
    }
    convert()
  }
}

const clearInput = () => {
  inputValue.value = ''
  resultValue.value = '0'
  isEditingResult.value = false
}

const deleteLast = () => {
  if (isEditingResult.value) {
    if (resultValue.value.length > 0) {
      resultValue.value = resultValue.value.slice(0, -1)
      if (resultValue.value === '') {
        resultValue.value = '0'
      }
      convertFromResult()
    }
  } else {
    if (inputValue.value.length > 0) {
      inputValue.value = inputValue.value.slice(0, -1)
      if (inputValue.value === '') {
        resultValue.value = '0'
      } else {
        convert()
      }
    }
  }
}

const onInput = (event) => {
  let value = event.target.value
  value = value.replace(/[^\d.]/g, '')
  
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  
  inputValue.value = value
  isEditingResult.value = false
  convert()
}

onMounted(() => {
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