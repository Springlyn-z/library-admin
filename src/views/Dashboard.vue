<template>
  <div>
    <h2>实时监控大屏</h2>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="6">
        <el-card>
          <template #header>
            <span>总座位数</span>
          </template>
          <div style="text-align: center; font-size: 24px; color: #409EFF;">
            150
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>
            <span>使用中</span>
          </template>
          <div style="text-align: center; font-size: 24px; color: #F56C6C;">
            89
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>
            <span>可用座位</span>
          </template>
          <div style="text-align: center; font-size: 24px; color: #67C23A;">
            48
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>
            <span>暂离座位</span>
          </template>
          <div style="text-align: center; font-size: 24px; color: #E6A23C;">
            13
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
</script>