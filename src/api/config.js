// 用于后期api连接的配置
const isDevelopment = import.meta.env.DEV

export const API_BASE_URL = isDevelopment 
  ? '/api'  // 开发环境使用Mock或代理
  : 'https://real-api.com' // 生产环境真实API