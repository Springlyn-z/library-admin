<template>
  <div id="app">
    <h1 style="color: red; padding: 20px;">🚀 Vue应用正常运行！</h1>
    <p>如果看到这个红色文字，说明Vue框架正常</p>
    <el-button type="primary" @click="testClick">测试Element Plus按钮</el-button>
    <p>点击按钮应该弹出提示</p>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const testClick = () => {
  ElMessage.success('按钮点击成功！Element Plus正常工作')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
  background-color: #f5f5f5;
}

#app {
  padding: 20px;
}
</style>