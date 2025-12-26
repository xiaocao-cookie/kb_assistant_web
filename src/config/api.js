// API配置文件
export const API_CONFIG = {
  // 基础API地址
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // 认证相关API
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  
  // 聊天相关API
  CHAT: {
    SEND_MESSAGE: '/chat/send',
    GET_HISTORY: '/chat/history',
    GET_CONVERSATIONS: '/chat/conversations'
  },
  
  // 管理员API
  ADMIN: {
    STATS: '/admin/stats',
    // RBAC API
    RBAC: {
      LIST_ROLES: '/rbac/list_roles',
      SET_ROLES: '/rbac/set_roles',
      LIST_PERMISSIONS: '/rbac/list_permissions',
      GET_ROLE_PERMISSIONS: '/rbac/roles/{role_code}/permissions',
      SET_ROLE_PERMISSIONS: '/rbac/roles/{role_code}/permissions',
      GET_USER_ROLES: '/rbac/users/{username}/roles',
      SET_USER_ROLES: '/rbac/users/{username}/roles'
    },
    // 知识库API
    KB: {
      LIST: '/kb/list',
      CREATE: '/kb/create',
      UPDATE: '/kb/{kb_id}/update',
      DELETE: '/kb/{kb_id}/delete',
      DETAIL: '/kb/{kb_id}/detail'
    }
  }
};

// 辅助函数：替换URL中的参数
export const buildApiUrl = (urlTemplate, params = {}) => {
  let url = urlTemplate;
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, params[key]);
  });
  return `${API_CONFIG.BASE_URL}${url}`;
};

// API请求封装
export class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // 获取token
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '请求失败' }));
        throw new Error(errorData.detail || '请求失败');
      }

      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }
  
  // GET请求
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  // POST请求
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  // PUT请求
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  // DELETE请求
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// 创建默认实例
export const apiClient = new ApiClient();