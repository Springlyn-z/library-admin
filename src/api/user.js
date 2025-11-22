import { userList, userStats } from './mock/userData.js'

// 用户管理API接口
export const userAPI = {
  // 获取用户列表
  getUserList: (params = {}) => {
    console.log('API调用: getUserList', params)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = [...userList]
        
        // 模拟筛选
        if (params.status) {
          data = data.filter(item => item.status === params.status)
        }
        if (params.college) {
          data = data.filter(item => item.college === params.college)
        }
        if (params.keyword) {
          data = data.filter(item => 
            item.name.includes(params.keyword) || 
            item.studentId.includes(params.keyword)
          )
        }
        
        resolve({
          code: 200,
          data: {
            list: data,
            total: data.length,
            page: params.page || 1,
            pageSize: params.pageSize || 10
          },
          message: 'success'
        })
      }, 500)
    })
  },
  
  // 获取用户统计
  getUserStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: userStats,
          message: 'success'
        })
      }, 300)
    })
  },
  
  // 更新用户信用分
  updateCreditScore: (userId, score) => {
    console.log('API调用: updateCreditScore', userId, score)
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = userList.find(item => item.id === userId)
        if (user) {
          user.creditScore = score
          // 更新状态
          if (score >= 80) user.status = 'normal'
          else if (score >= 60) user.status = 'warning'
          else user.status = 'banned'
          
          resolve({
            code: 200,
            data: user,
            message: '信用分更新成功'
          })
        } else {
          resolve({
            code: 404,
            message: '用户不存在'
          })
        }
      }, 500)
    })
  },
  
  // 封禁/解封用户
  toggleUserStatus: (userId, status) => {
    console.log('API调用: toggleUserStatus', userId, status)
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = userList.find(item => item.id === userId)
        if (user) {
          user.status = status
          resolve({
            code: 200,
            data: user,
            message: status === 'banned' ? '用户已封禁' : '用户已解封'
          })
        } else {
          resolve({
            code: 404,
            message: '用户不存在'
          })
        }
      }, 500)
    })
  }
}