// 管理员界面API服务层
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class AdminApiService {
  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // 从localStorage获取token
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '请求失败');
      }

      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }

  // RBAC - 角色管理相关API
  async listRoles() {
    return this.request('/rbac/list_roles');
  }

  async setRoles(roleData) {
    return this.request('/rbac/set_roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  }

  async listPermissions(module = null) {
    const query = module ? `?module=${module}` : '';
    return this.request(`/rbac/list_permissions${query}`);
  }

  async getRolePermissions(roleCode) {
    return this.request(`/rbac/roles/${roleCode}/permissions`);
  }

  async setRolePermissions(roleCode, permCodes) {
    return this.request(`/rbac/roles/${roleCode}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ perm_codes: permCodes }),
    });
  }

  // RBAC - 用户管理相关API
  async getUserRoles(username) {
    return this.request(`/rbac/users/${username}/roles`);
  }

  async setUserRoles(username, roleCodes) {
    return this.request(`/rbac/users/${username}/roles`, {
      method: 'PUT',
      body: JSON.stringify({ role_codes: roleCodes }),
    });
  }

  // KB管理相关API（需要用户提供具体接口）
  async listKBs() {
    return this.request('/kb/list');
  }

  async createKB(kbData) {
    return this.request('/kb/create', {
      method: 'POST',
      body: JSON.stringify(kbData),
    });
  }

  async updateKB(kbId, kbData) {
    return this.request(`/kb/${kbId}/update`, {
      method: 'PUT',
      body: JSON.stringify(kbData),
    });
  }

  async deleteKB(kbId) {
    return this.request(`/kb/${kbId}/delete`, {
      method: 'DELETE',
    });
  }

  async getKBDetail(kbId) {
    return this.request(`/kb/${kbId}/detail`);
  }

  // 管理员统计信息
  async getAdminStats() {
    return this.request('/admin/stats');
  }
}

export default new AdminApiService();