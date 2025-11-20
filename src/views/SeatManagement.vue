<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>座位管理</h2>
      <div>
        <el-button type="primary">添加座位</el-button>
        <el-button>导入Excel</el-button>
        <el-button>导出数据</el-button>
      </div>
    </div>

    <el-table :data="seatData" style="width: 100%">
      <el-table-column prop="id" label="座位ID" width="100" />
      <el-table-column prop="location" label="位置" />
      <el-table-column prop="floor" label="楼层" width="80" />
      <el-table-column prop="hasPower" label="有电源" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.hasPower" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editSeat(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteSeat(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const seatData = ref([
  { id: 'A001', location: '1楼-靠窗区-01', floor: '1F', hasPower: true, status: '可用' },
  { id: 'A002', location: '1楼-靠窗区-02', floor: '1F', hasPower: true, status: '占用' },
  { id: 'B001', location: '2楼-静音区-01', floor: '2F', hasPower: false, status: '暂离' },
  { id: 'B002', location: '2楼-静音区-02', floor: '2F', hasPower: true, status: '可用' }
])

const getStatusType = (status) => {
  const statusMap = {
    '可用': 'success',
    '占用': 'danger', 
    '暂离': 'warning'
  }
  return statusMap[status] || 'info'
}

const editSeat = (row) => {
  console.log('编辑座位:', row)
}

const deleteSeat = (row) => {
  console.log('删除座位:', row)
}
</script>