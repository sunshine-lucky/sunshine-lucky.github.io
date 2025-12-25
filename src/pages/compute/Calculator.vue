<template>
  <div class="calculator-wrapper">
    <div class="calculator">
      <CalculatorDisplay :display="display" :expression="expression" :show-result="showResult"/>
      <div class="buttons-grid">
        <!-- 第一行 -->
        <CalculatorButton @click="clearAll" class="function-btn" label="AC"/>
        <CalculatorButton @click="deleteLast" class="function-btn" label="⌫"/>
        <CalculatorButton @click="toggleSign" class="function-btn" label="+/-" />
        <CalculatorButton @click="appendOperator('÷')" class="operator-btn" label="÷"/>
        
        <!-- 第二行 -->
        <CalculatorButton @click="appendNumber('7')" label="7"/>
        <CalculatorButton @click="appendNumber('8')" label="8"/>
        <CalculatorButton @click="appendNumber('9')" label="9"/>
        <CalculatorButton @click="appendOperator('×')" class="operator-btn" label="×"/>
        
        <!-- 第三行 -->
        <CalculatorButton @click="appendNumber('4')" label="4"/>
        <CalculatorButton @click="appendNumber('5')" label="5"/>
        <CalculatorButton @click="appendNumber('6')" label="6"/>
        <CalculatorButton @click="appendOperator('-')" class="operator-btn" label="-"/>
        
        <!-- 第四行 -->
        <CalculatorButton @click="appendNumber('1')" label="1"/>
        <CalculatorButton @click="appendNumber('2')" label="2"/>
        <CalculatorButton @click="appendNumber('3')" label="3"/>
        <CalculatorButton @click="appendOperator('+')" class="operator-btn" label="+"/>
        
        <!-- 第五行 -->
        <CalculatorButton @click="appendNumber('0')" class="zero-btn" label="0"/>
        <CalculatorButton @click="appendDecimal()" label="."/>
        <CalculatorButton @click="calculate" class="equals-btn" label="="/>
      </div>
    </div>
    
    <HistoryPanel :history="history" @clear-history="clearHistory" @use-history="useHistoryItem"/>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CalculatorDisplay from './CalculatorDisplay.vue'
import CalculatorButton from './CalculatorButton.vue'
import HistoryPanel from './HistoryPanel.vue'

const display = ref('0')// 响应式数据
const expression = ref('')
const history = ref([])
const showResult=ref(false)//是否按了=号

let firstNumber = ''//临时变量
let operator = ''
let currentNumber = ''
let isNewCalculation = true//按了运算符

// 格式化数字,将输入的转化为数字，千位分隔符用英文逗号，最多八位小数
const formatNumber = (num) => {
  return Number(num).toLocaleString('zh-CN', {
    maximumFractionDigits: 8
  })
}

const appendNumber = (num) => {
  if (showResult.value) {//已经按了=号
    clearAll()
  }
  
  if (isNewCalculation) {
    if (firstNumber === '') {//第一位数是空的，那输入的数就是第一位
      firstNumber = num
      display.value = num
      expression.value = num
    } 
    else {
      currentNumber = num
      display.value = num
      expression.value = `${formatNumber(firstNumber)} ${operator} ${num}`
    }
    isNewCalculation = false//不是新的式子就代表前面还输了数字，后面还要输，即多位数；456之类的
  } 
  else {
    if (operator === '') {
      firstNumber += num
      display.value = firstNumber
      expression.value = firstNumber
    } 
    else {
      currentNumber += num
      display.value = currentNumber
      expression.value = `${formatNumber(firstNumber)} ${operator} ${currentNumber}`
    }
  }
  showResult.value = false
// 如果有运算符和第二个数，立即计算并显示结果
  if (operator !== '' && currentNumber !== '' && currentNumber !== '0') {
    calculateIntermediate()
  }
}

const appendOperator = (op) => {
  if (showResult.value) {//已经按下等号，但还继续按运算符
    firstNumber = display.value
    operator = op
    currentNumber = ''
    expression.value = `${formatNumber(firstNumber)} ${op}`
    isNewCalculation = true
    showResult.value = false
  } else if (firstNumber === '') {//一上来就按运算符，前面还没按数字，就把0当成第一个数
    firstNumber = display.value
    operator = op
    expression.value = `${formatNumber(firstNumber)} ${op}`
    isNewCalculation = true
    showResult.value = false
  } else {
    if (currentNumber !== '') {//默认前面第一条式子优先计算
      calculateIntermediate()
      firstNumber = display.value
    }
    operator = op
    expression.value = `${formatNumber(firstNumber)} ${op}`
    currentNumber = ''
    isNewCalculation = true
    showResult.value = false
  }
}

const updateExpression = () => {
  if (firstNumber !== '' && operator !== '') {
    expression.value = `${formatNumber(firstNumber)} ${operator} ${currentNumber}`
  } else if (firstNumber !== '') {
    expression.value = firstNumber
  }
}

// 计算中间结果.如果要输入的是2+4*6，在按下*时，就会把2+4的结果先计算出来，再*6
const calculateIntermediate = () => {
  if (firstNumber === '' || operator === '' || currentNumber === '') return
  
  let result
  const num1 = Number(firstNumber)
  const num2 = Number(currentNumber)
  
  switch (operator) {
    case '+': result = num1 + num2; break
    case '-': result = num1 - num2; break
    case '×': result = num1 * num2; break
    case '÷': 
      if (num2 === 0) {
        display.value = '错误'
        return
      }
      result = num1 / num2
      break
    default: return
  }
  
  display.value = formatNumber(result)
}

const calculate = () => {
  if (firstNumber === '' || operator === '' || currentNumber === '') return
  
  let result
  const num1 = Number(firstNumber)
  const num2 = Number(currentNumber)
  
  switch (operator) {
    case '+': result = num1 + num2; break
    case '-': result = num1 - num2; break
    case '×': result = num1 * num2; break
    case '÷': 
      if (num2 === 0) {
        display.value = '错误'
        return
      }
      result = num1 / num2
      break
    default: return
  }
  
  const historyItem = {
    expression: `${formatNumber(firstNumber)} ${operator} ${formatNumber(num2)} =`,
    result: result
  }
  
  history.value.unshift(historyItem)
  if (history.value.length > 10) history.value.pop()
  
  display.value = formatNumber(result)
  expression.value = `${formatNumber(firstNumber)} ${operator} ${formatNumber(num2)} =`
  showResult.value = true
  
  // 重置状态，准备下一次计算
  firstNumber = result.toString()
  currentNumber = ''
  isNewCalculation = true
}

const clearAll = () => {
  display.value = '0'
  expression.value = ''
  firstNumber = ''
  operator = ''
  currentNumber = ''
  showResult.value = false
  isNewCalculation = true
}

const deleteLast = () => {
  if (showResult.value) {
    clearAll()
    return
  }
  
  if (currentNumber.length > 0) {
    currentNumber = currentNumber.slice(0, -1)
    display.value = currentNumber || '0'
    updateExpression()

    if (currentNumber !== '' && operator !== '') {
      calculateIntermediate()
    }
  }
}

// 正负号切换
const toggleSign = () => {
  if (showResult.value) {
    const num = Number(display.value) * -1
    display.value = formatNumber(num)
    firstNumber = num.toString()
  } else if (currentNumber !== '') {
    currentNumber = (Number(currentNumber) * -1).toString()
    display.value = currentNumber
    updateExpression()

    if (operator !== '') {
      calculateIntermediate()
    }
  } else if (firstNumber !== '') {
    firstNumber = (Number(firstNumber) * -1).toString()
    display.value = firstNumber
    
    const parts = expression.value.split(' ')
    if (parts.length > 0) {
      parts[0] = formatNumber(firstNumber)
      expression.value = parts.join(' ')
    }
  }
}

// 处理小数点
const appendDecimal = () => {
  if (showResult.value) {
    clearAll()
  }
  
  if (!currentNumber.includes('.')) {
    if (currentNumber === '') {
      currentNumber = '0.'
    } else {
      currentNumber += '.'
    }
    display.value = currentNumber
    updateExpression()
  }
}

const clearHistory = () => {
  history.value = []
}

const useHistoryItem = (item) => {
  clearAll()
  display.value = formatNumber(item.result)
  expression.value = item.expression
  firstNumber = item.result.toString()
  showResult.value = true
}
</script>

<style scoped>
.calculator-wrapper {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.calculator {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  box-shadow: var(--shadow);
  transition: all 0.3s;
  flex: 1;
  min-width: 425px;
  max-width: 500px;
}

.buttons-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.zero-btn {
  grid-column: span 2;
}

.equals-btn {
  background: var(--secondary-color) !important;
  color: white !important;
}

.equals-btn:hover {
  background: #27ae60 !important;
}

.operator-btn {
  background: var(--primary-color) !important;
  color: white !important;
}

.operator-btn:hover {
  background: #2980b9 !important;
}

.function-btn {
  background: var(--warning-color) !important;
  color: white !important;
}

.function-btn:hover {
  background: #d68910 !important;
}

@media (max-width: 768px) {
  .calculator-wrapper {
    flex-direction: column;
    align-items: center;
  }
  
  .calculator {
    min-width: 100%;
  }
}
</style>