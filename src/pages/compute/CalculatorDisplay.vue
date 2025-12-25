<template>
  <div class="calculator-display">
    <div class="expression" :class="{'small-font':showResult}">
      {{ expression }}
    </div>
    <div class="display" :class="{'large-font':showResult}">
      {{ display }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  display: {
    type: String,
    default: '0'
  },
  expression: {
    type: String,
    default: ''
  },
  showResult:{
    type:Boolean,
    default:false
  }
})
</script>

<style scoped>
.calculator-display {
  background: var(--card-bg);
  border: 2px solid var(--button-bg);
  border-radius: 12px;
  padding: 20px;
  text-align: right;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.expression {
  color: #0a0b0b;
  font-size: 2.2rem;  /* 输入时大字体 */
  font-weight: 400;
  min-height: 45px;
  word-break: break-all;
  opacity: 0.9;
  margin-bottom: 0px;
  transition: font-size 0.3s ease;
}

.display {
  color: #666;
  font-size: 1.5rem;  /* 输入时小字体 */
  font-weight: 400;
  line-height: 1;
  word-break: break-all;
  overflow-wrap: break-word;
  min-height: 35px;
  transition: font-size 0.3s ease;
}

/* 结果模式 - 按等号后 */
.expression.small-font {
  font-size: 1.5rem;  /* 结果时小字体 */
  color: #666;
  min-height: 30px;
}

.display.large-font {
  font-size: 2.2rem;    /* 结果时大字体 */
  font-weight: 400;
  color:#0a0b0b;
  min-height: 30px;
}

@media (max-width: 480px) {
  .expression {
    font-size: 1.8rem;
  }
  
  .display {
    font-size: 1.5rem;
  }
  
  .expression.small-font {
    font-size: 1.2rem;
  }
  
  .display.large-font {
    font-size: 2.5rem;
  }
}
</style>