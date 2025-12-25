<template>
  <div class="history-panel">
    <div class="panel-header">
      <h3>📝 计算历史</h3>
      <button 
        @click="$emit('clear-history')"
        class="clear-btn"
        :disabled="!history.length"
      >
        清空历史
      </button>
    </div>
    
    <div class="history-list" v-if="history.length">
      <div 
        v-for="(item, index) in history" 
        :key="index"
        class="history-item"
        @click="$emit('use-history', item)"
      >
        <div class="history-expression">{{ item.expression }}</div>
        <div class="history-result">{{ formatNumber(item.result) }}</div>
      </div>
    </div>
    
    <div v-else class="empty-history">
      暂无历史记录
    </div>
  </div>
</template>

<script setup>
defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

defineEmits(['clear-history', 'use-history'])

const formatNumber = (num) => {
  return Number(num).toLocaleString('zh-CN', {
    maximumFractionDigits: 8
  })
}
</script>

<style scoped>
.history-panel {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  box-shadow: var(--shadow);
  width: 300px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--button-bg);
  padding-bottom: 15px;
}

.panel-header h3 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.3rem;
}

.clear-btn {
  background: var(--danger-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.clear-btn:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: var(--button-bg);
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.history-item {
  background: var(--button-bg);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.history-item:hover {
  background: var(--button-hover);
  transform: translateX(5px);
}

.history-expression {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 5px;
  word-break: break-all;
}

.history-result {
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: 500;
  word-break: break-all;
}

.empty-history {
  text-align: center;
  color: #95a5a6;
  padding: 40px 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .history-panel {
    width: 100%;
    max-height: 300px;
  }
}
</style>