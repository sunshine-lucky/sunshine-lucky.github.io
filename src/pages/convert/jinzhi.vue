<template>
  <div class="calculator">
    <div class="converter-area">
      <div class="converter-row">
        <input type="text" v-model="inputValue" @input="onInput" @keydown="onKeyDown"
        ref="inputField" class="converter-input" placeholder="输入数值"/>
        <select v-model="inputBase" @change="convert" class="unit-select">
          <option v-for="base in bases" :key="base.value" :value="base.value">
            {{ base.label }}
          </option>
        </select>
      </div>
      
      <div class="converter-row">
        <input type="text" v-model="resultValue" @input="onResultInput" @focus="onResultFocus"
          class="converter-input result-input" placeholder="结果"/>
        <select v-model="resultBase" @change="convertFromResult" class="unit-select">
          <option v-for="base in bases" :key="base.value" :value="base.value">
            {{ base.label }}
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
      <CalculatorButton class="function-btn" label="进制"/>
      
      <CalculatorButton @click="inputKey('0')" class="zero-btn" label="0"/>
      <CalculatorButton @click="inputKey('A')" class="function-btn" label="A"/>
      <CalculatorButton @click="inputKey('B')" class="function-btn" label="B"/>
      <CalculatorButton @click="inputKey('C')" class="function-btn" label="C"/>
      <CalculatorButton @click="inputKey('D')" class="function-btn" label="D"/>
      <CalculatorButton @click="inputKey('E')" class="function-btn" label="E"/>
      <CalculatorButton @click="inputKey('F')" class="function-btn" label="F"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import CalculatorButton from '../compute/CalculatorButton.vue'

// 进制定义
const bases = [
  { value: 2, label: '二进制' },
  { value: 8, label: '八进制' },
  { value: 10, label: '十进制' },
  { value: 16, label: '十六进制' }
]

const inputValue = ref('')
const inputBase = ref(10)  // 默认输入进制为十进制
const resultValue = ref('')
const resultBase = ref(2)  // 默认输出进制为二进制
const inputField = ref(null)
const isEditingResult = ref(false)

// 获取当前有效数字字符集
const validDigits = computed(() => {
  const base = isEditingResult.value ? resultBase.value : inputBase.value
  let digits = '0123456789'
  if (base > 10) {
    digits += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(0, base - 10)
  }
  return digits.slice(0, base)
})

// 进制转换函数
const convertBase = (value, fromBase, toBase) => {
  if (value === '') return ''
  
  // 转换为十进制
  let decimalValue
  try {
    decimalValue = parseInt(value, fromBase)
    if (isNaN(decimalValue)) return '输入无效'
  } catch (e) {
    return '输入无效'
  }
  
  // 从十进制转换到目标进制
  if (toBase === 10) {
    return decimalValue.toString()
  }
  
  // 转换到其他进制
  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  let num = decimalValue
  
  if (num === 0) return '0'
  
  while (num > 0) {
    result = digits[num % toBase] + result
    num = Math.floor(num / toBase)
  }
  
  return result
}

// 验证输入是否符合当前进制
const validateInput = (value, base) => {
  if (value === '') return true
  
  const validChars = validDigits.value.toUpperCase()
  const regex = new RegExp(`^[${validChars}.]+$`, 'i')
  
  // 对于浮点数，暂时只支持十进制
  if (base !== 10 && value.includes('.')) {
    return false
  }
  
  return regex.test(value.toUpperCase())
}

// 转换函数（从输入计算结果）
const convert = () => {
  if (inputValue.value === '') {
    resultValue.value = ''
    return
  }
  
  // 验证输入
  if (!validateInput(inputValue.value, inputBase.value)) {
    resultValue.value = '输入无效'
    return
  }
  
  resultValue.value = convertBase(inputValue.value, inputBase.value, resultBase.value)
  isEditingResult.value = false
}

// 从结果反向计算输入
const convertFromResult = () => {
  if (resultValue.value === '' || resultValue.value === '输入无效') {
    inputValue.value = ''
    return
  }
  
  // 验证结果输入
  if (!validateInput(resultValue.value, resultBase.value)) {
    inputValue.value = '输入无效'
    return
  }
  
  inputValue.value = convertBase(resultValue.value, resultBase.value, inputBase.value)
}

// 结果输入框的输入处理
const onResultInput = (event) => {
  let value = event.target.value.toUpperCase()
  
  // 根据当前进制过滤输入
  const validChars = validDigits.value.toUpperCase()
  value = value.split('').filter(char => validChars.includes(char)).join('')
  
  resultValue.value = value
  isEditingResult.value = true
  
  clearTimeout(window.convertTimeout)
  window.convertTimeout = setTimeout(() => {
    convertFromResult()
  }, 300)
}

const inputKey = (key) => {
  if (isEditingResult.value) {
    const currentValidDigits = validDigits.value.toUpperCase()
    const keyUpper = key.toUpperCase()
    
    if (!currentValidDigits.includes(keyUpper)) {
      return
    }
    
    if (resultValue.value === '输入无效') {
      resultValue.value = keyUpper
    } else if (resultValue.value === '0' && key !== '0') {
      resultValue.value = keyUpper
    } else {
      resultValue.value += keyUpper
    }
    convertFromResult()
  } else {
    const currentValidDigits = validDigits.value.toUpperCase()
    const keyUpper = key.toUpperCase()
    
    if (!currentValidDigits.includes(keyUpper)) {
      return
    }
    
    if (inputValue.value === '输入无效') {
      inputValue.value = keyUpper
    } else if (inputValue.value === '0' && key !== '0') {
      inputValue.value = keyUpper
    } else {
      inputValue.value += keyUpper
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
    if (resultValue.value.length > 0 && resultValue.value !== '输入无效') {
      resultValue.value = resultValue.value.slice(0, -1)
      convertFromResult()
    }
  } else {
    if (inputValue.value.length > 0 && inputValue.value !== '输入无效') {
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
  let value = event.target.value.toUpperCase()
  
  // 根据当前进制过滤输入
  const validChars = validDigits.value.toUpperCase()
  value = value.split('').filter(char => validChars.includes(char)).join('')
  
  inputValue.value = value
  isEditingResult.value = false
  
  clearTimeout(window.convertTimeout)
  window.convertTimeout = setTimeout(() => {
    convert()
  }, 300)
}

// 键盘按键处理
const onKeyDown = (event) => {
  // 允许退格、删除、Tab、Enter等控制键
  if ([8, 9, 13, 46].includes(event.keyCode)) {
    return
  }
  
  const key = event.key.toUpperCase()
  const currentValidDigits = validDigits.value.toUpperCase()
  
  // 检查按键是否在当前进制允许的字符范围内
  if (!currentValidDigits.includes(key)) {
    event.preventDefault()
  }
}

onMounted(() => {
  // 初始化时不显示结果，等待用户输入
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