<template>
    <div class="f-header">
        <span>
            <el-icon :size="30">
                <ElementPlus/>
            </el-icon>
            多功能计算器
        </span>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.f-header{
    @apply flex items-center bg-indigo-500 text-light-50 fixed top-0
    left-0 right-0 text-2xl;
    height:64px;
}
</style>