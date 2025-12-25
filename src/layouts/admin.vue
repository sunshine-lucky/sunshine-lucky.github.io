<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <fheader/>
      </el-header>
      <el-container>
        <el-aside width="200px">
            <Faside/>
        </el-aside>
        <el-main>
            <div class="theme-switcher">
        <button v-for="t in themes" :key="t.name" @click="switchTheme(t.name)"
        :class="{ active: theme === t.name }" class="theme-btn">
          {{ t.label }}
        </button>
      </div>
      <!-- <Calculator /> -->
      <router-view></router-view>
            <Fmain/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Fheader from './components/Fheader.vue'
import Faside from './components/Faside.vue'
import Fmain from './components/Fmain.vue'
import Calculator from '../pages/compute/Calculator.vue'

</script>

<style>
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
  --warning-color: #f39c12;
  --text-color: #333;
  --bg-color: #f5f5f5;
  --card-bg: white;
  --button-bg: #ecf0f1;
  --button-hover: #d5dbdb;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

#app {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.app-container {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

h1 {
  color: var(--primary-color);
  margin-bottom: 30px;
  font-size: 2.2rem;
}
</style>