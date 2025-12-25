<template>
  <button class="calculator-button" @click="$emit('click')" :style="buttonStyle">
    {{ label }}
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'default'
  }
})

const buttonStyle = computed(() => {
  const colors = {
    default: 'var(--button-bg)',
    primary: 'var(--primary-color)',
    secondary: 'var(--secondary-color)',
    warning: 'var(--warning-color)',
    danger: 'var(--danger-color)'
  }
  
  return {
    '--button-color': colors[props.color] || colors.default
  }
})

defineEmits(['click'])
</script>

<style scoped>
.calculator-button {
  background: var(--button-bg);
  border: none;
  border-radius: 12px;
  color: var(--text-color);
  font-size: 1.4rem;
  font-weight: 500;
  padding: 20px 10px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  touch-action: manipulation;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.calculator-button:hover {
  background: var(--button-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.calculator-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.calculator-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}

@media (max-width: 480px) {
  .calculator-button {
    font-size: 1.2rem;
    padding: 18px 8px;
  }
}
</style>