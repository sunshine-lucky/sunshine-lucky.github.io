<template>
  <div class="f-aside">
    <el-menu default-active="compute" router class="el-menu-vertical-demo"
      @open="handleOpen" @close="handleClose">

    <el-menu-item index="/compute">
        <el-icon><Opportunity /></el-icon>
        <span>计算</span>
    </el-menu-item>

      <el-sub-menu index="2">
        <template #title>
          <el-icon><List /></el-icon>
          <span>换算</span>
        </template>
            <el-menu-item index="/convert/jinzhi"><el-icon><Watermelon /></el-icon>进制转换</el-menu-item>
            <el-menu-item index="/convert/wendu"><el-icon><Fries /></el-icon>温度转换</el-menu-item>
            <el-menu-item index="/convert/weight"><el-icon><Dessert /></el-icon>重量转换</el-menu-item>
            <el-menu-item index="/convert/length"><el-icon><Sugar /></el-icon>长度转换</el-menu-item>
            <el-menu-item index="/convert/area"><el-icon><ColdDrink /></el-icon>面积转换</el-menu-item>
            <el-menu-item index="/convert/volumn"><el-icon><HotWater /></el-icon>体积转换</el-menu-item>
    </el-sub-menu>
</el-menu>
</div>
</template>
<script>
export default {

};
</script>
<style>
.f-aside {
  width: 250px;
  top: 64px;
  bottom: 0;
  left: 0;
  position: fixed; /* 添加定位 */
}
</style>