<script setup>
import { ref, onMounted, watch } from 'vue'
import { 
  Search, 
  Download, 
  User, 
  UserFilled, 
  Warning, 
  Lock 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userAPI } from '../api/index.js'

const searchKeyword = ref('')
const statusFilter = ref('')
const collegeFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const creditDialogVisible = ref(false)

const userData = ref([])
const userStats = ref({
  total: 0,
  active: 0,
  online: 0,
  warning: 0,
  banned: 0
})
const currentUser = ref(null)
const creditScore = ref(0)

const creditMarks = {
  0: '0',
  60: '60',
  80: '80',
  100: '100'
}

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: statusFilter.value,
      college: collegeFilter.value,
      keyword: searchKeyword.value
    }
    
    const response = await userAPI.getUserList(params)
    if (response.code === 200) {
      userData.value = response.data.list
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 获取用户统计
const fetchUserStats = async () => {
  try {
    const response = await userAPI.getUserStats()
    if (response.code === 200) {
      userStats.value = response.data
    }
  } catch (error) {
    console.error('获取用户统计失败:', error)
  }
}

// 编辑信用分
const handleEditCredit = (user) => {
  currentUser.value = user
  creditScore.value = user.creditScore
  creditDialogVisible.value = true
}

// 更新信用分
const handleUpdateCredit = async () => {
  try {
    const response = await userAPI.updateCreditScore(currentUser.value.id, creditScore.value)
    if (response.code === 200) {
      ElMessage.success('信用分更新成功')
      creditDialogVisible.value = false
      fetchUserList()
    } else {
      ElMessage.error(response.message)
    }
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

// 封禁用户
const handleBanUser = async (userId) => {
  try {
    await ElMessageBox.confirm('确定要封禁该用户吗？', '提示', {
      type: 'warning'
    })
    
    const response = await userAPI.toggleUserStatus(userId, 'banned')
    if (response.code === 200) {
      ElMessage.success('用户已封禁')
      fetchUserList()
    }
  } catch (error) {
    // 用户取消操作
  }
}

// 解封用户
const handleUnbanUser = async (userId) => {
  try {
    const response = await userAPI.toggleUserStatus(userId, 'normal')
    if (response.code === 200) {
      ElMessage.success('用户已解封')
      fetchUserList()
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchUserList()
  fetchUserStats()
})

// 监听筛选条件变化
watch([statusFilter, collegeFilter, searchKeyword], () => {
  currentPage.value = 1
  fetchUserList()
})

const getCreditType = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

const getStatusType = (status) => {
  const statusMap = {
    'normal': 'success',
    'warning': 'warning',
    'banned': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'normal': '正常',
    'warning': '警告', 
    'banned': '封禁'
  }
  return statusMap[status] || '未知'
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .el-icon {
  font-size: 28px;
}

.stat-label {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.stat-value {
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
  margin: 4px 0 0 0;
}

.filter-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.table-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.credit-dialog {
  padding: 20px 0;
}

.slider-value {
  text-align: center;
  margin-top: 20px;
  font-weight: 600;
  color: #1e40af;
}
</style>

<template>
  <div class="user-management">
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <div class="action-buttons">
        <el-button type="primary" :icon="Search">搜索用户</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-blue-100">
            <el-icon class="text-blue-600"><User /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">总用户数</p>
            <p class="stat-value">{{ userStats.total }}</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-green-100">
            <el-icon class="text-green-600"><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">活跃用户</p>
            <p class="stat-value">{{ userStats.active }}</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-yellow-100">
            <el-icon class="text-yellow-600"><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">警告用户</p>
            <p class="stat-value">{{ userStats.warning }}</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-red-100">
            <el-icon class="text-red-600"><Lock /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">封禁用户</p>
            <p class="stat-value">{{ userStats.banned }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索姓名/学号"
          :prefix-icon="Search"
          style="width: 300px"
        />
        <el-select v-model="statusFilter" placeholder="用户状态">
          <el-option label="全部状态" value="" />
          <el-option label="正常" value="normal" />
          <el-option label="警告" value="warning" />
          <el-option label="封禁" value="banned" />
        </el-select>
        <el-select v-model="collegeFilter" placeholder="所属学院">
          <el-option label="全部学院" value="" />
          <el-option label="计算机学院" value="计算机学院" />
          <el-option label="电子信息学院" value="电子信息学院" />
          <el-option label="管理学院" value="管理学院" />
        </el-select>
      </div>
    </el-card>

    <!-- 用户表格 -->
    <el-card class="table-card">
      <el-table :data="userData" v-loading="loading" style="width: 100%">
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="college" label="学院" width="140" />
        <el-table-column prop="major" label="专业" width="140" />
        <el-table-column label="信用分" width="100">
          <template #default="{ row }">
            <el-tag :type="getCreditType(row.creditScore)" effect="light">
              {{ row.creditScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="light">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentSeat" label="当前座位" width="120" />
        <el-table-column prop="lastLogin" label="最后登录" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                type="primary" 
                size="small" 
                @click="handleEditCredit(row)"
              >
                信用分
              </el-button>
              <el-button 
                v-if="row.status !== 'banned'"
                type="warning" 
                size="small"
                @click="handleBanUser(row.id)"
              >
                封禁
              </el-button>
              <el-button 
                v-else
                type="success" 
                size="small"
                @click="handleUnbanUser(row.id)"
              >
                解封
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 编辑信用分对话框 -->
    <el-dialog v-model="creditDialogVisible" title="修改信用分" width="400px">
      <div class="credit-dialog">
        <p>用户: {{ currentUser?.name }} ({{ currentUser?.studentId }})</p>
        <el-slider
          v-model="creditScore"
          :min="0"
          :max="100"
          :marks="creditMarks"
          show-stops
        />
        <div class="slider-value">当前信用分: {{ creditScore }}</div>
      </div>
      <template #footer>
        <el-button @click="creditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateCredit">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>