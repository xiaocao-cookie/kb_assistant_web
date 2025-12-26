import React, { useState, useEffect } from 'react';
import adminApi from '../../../services/adminApi';
import './RBACUsers.css';

const RBACUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // 这里应该有一个获取所有用户的API，目前使用模拟数据
      const mockUsers = [
        { id: 1, username: 'admin', email: 'admin@company.com', full_name: '系统管理员', status: 'active', created_at: '2023-01-01' },
        { id: 2, username: 'zhangsan', email: 'zhangsan@company.com', full_name: '张三', status: 'active', created_at: '2023-01-15' },
        { id: 3, username: 'lisi', email: 'lisi@company.com', full_name: '李四', status: 'inactive', created_at: '2023-02-01' },
        { id: 4, username: 'wangwu', email: 'wangwu@company.com', full_name: '王五', status: 'active', created_at: '2023-02-15' },
        { id: 5, username: 'zhaoliu', email: 'zhaoliu@company.com', full_name: '赵六', status: 'active', created_at: '2023-03-01' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      setError('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await adminApi.listRoles();
      setRoles(response.roles || []);
    } catch (error) {
      console.error('获取角色列表失败:', error);
      // 设置默认角色数据
      setRoles([
        { id: 1, code: 'admin', name: '系统管理员' },
        { id: 2, code: 'manager', name: '管理员' },
        { id: 3, code: 'editor', name: '编辑员' },
        { id: 4, code: 'viewer', name: '查看员' }
      ]);
    }
  };

  const handleViewUserRoles = async (username) => {
    try {
      const response = await adminApi.getUserRoles(username);
      setCurrentUser({ username });
      setUserRoles(response.roles || []);
      setShowRoleModal(true);
    } catch (error) {
      console.error('获取用户角色失败:', error);
      showErrorMessage('获取用户角色失败: ' + error.message);
    }
  };

  const handleUpdateUserRoles = async (username, roleCodes) => {
    try {
      await adminApi.setUserRoles(username, roleCodes);
      setShowRoleModal(false);
      setCurrentUser(null);
      setUserRoles([]);
      showSuccessMessage('用户角色更新成功');
    } catch (error) {
      showErrorMessage('用户角色更新失败: ' + error.message);
    }
  };

  const showSuccessMessage = (message) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'success-alert';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      document.body.removeChild(alertDiv);
    }, 3000);
  };

  const showErrorMessage = (message) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'error-alert';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      document.body.removeChild(alertDiv);
    }, 3000);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 如果选择了角色筛选，可以根据角色过滤用户
    // 这里简化处理，实际应该查询每个用户的角色
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="users-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rbac-users">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-content">
          <h1>用户管理</h1>
          <p>管理系统用户和角色分配</p>
        </div>
        <div className="header-actions">
          <button className="import-btn">
            <span>📥</span> 批量导入
          </button>
          <button className="export-btn">
            <span>📤</span> 导出用户
          </button>
        </div>
      </div>

      {/* 搜索和过滤器 */}
      <div className="page-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索用户名、姓名或邮箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="toolbar-actions">
          <select 
            className="role-filter"
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
          >
            <option value="">所有角色</option>
            {roles.map(role => (
              <option key={role.code} value={role.code}>{role.name}</option>
            ))}
          </select>
          <select className="status-filter">
            <option value="">所有状态</option>
            <option value="active">激活</option>
            <option value="inactive">禁用</option>
          </select>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="users-container">
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>用户信息</th>
                <th>邮箱</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="user-row">
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar">
                        {user.full_name?.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.full_name || user.username}</div>
                        <div className="user-username">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="user-email">{user.email}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? '✅ 激活' : '❌ 禁用'}
                    </span>
                  </td>
                  <td>
                    <div className="user-date">{user.created_at}</div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn roles-btn"
                        onClick={() => handleViewUserRoles(user.username)}
                        title="管理角色"
                      >
                        👥
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        title="编辑用户"
                      >
                        ✏️
                      </button>
                      <button 
                        className={`action-btn status-btn ${user.status === 'active' ? 'deactivate' : 'activate'}`}
                        title={user.status === 'active' ? '禁用用户' : '启用用户'}
                      >
                        {user.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>暂无用户数据</h3>
              <p>当前没有找到符合条件的用户</p>
            </div>
          )}
        </div>
      </div>

      {/* 用户角色管理模态框 */}
      {showRoleModal && currentUser && (
        <UserRoleModal
          username={currentUser.username}
          availableRoles={roles}
          currentRoles={userRoles}
          onSave={handleUpdateUserRoles}
          onCancel={() => {
            setShowRoleModal(false);
            setCurrentUser(null);
            setUserRoles([]);
          }}
        />
      )}
    </div>
  );
};

// 用户角色管理模态框组件
const UserRoleModal = ({ username, availableRoles, currentRoles, onSave, onCancel }) => {
  const [selectedRoles, setSelectedRoles] = useState(currentRoles || []);
  const [loading, setLoading] = useState(false);

  const handleRoleToggle = (roleCode) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleCode)) {
        return prev.filter(code => code !== roleCode);
      } else {
        return [...prev, roleCode];
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(username, selectedRoles);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content role-modal">
        <div className="modal-header">
          <h2>管理用户角色</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="user-info-section">
            <div className="user-avatar-large">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h3>{username}</h3>
              <p>请选择该用户应该拥有的角色</p>
            </div>
          </div>

          <div className="roles-selection">
            <h4>可用角色</h4>
            <div className="roles-grid">
              {availableRoles.map(role => (
                <div 
                  key={role.code} 
                  className={`role-option ${selectedRoles.includes(role.code) ? 'selected' : ''}`}
                  onClick={() => handleRoleToggle(role.code)}
                >
                  <div className="role-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedRoles.includes(role.code)}
                      onChange={() => handleRoleToggle(role.code)}
                    />
                  </div>
                  <div className="role-info">
                    <div className="role-name">{role.name}</div>
                    <div className="role-code">#{role.code}</div>
                    {role.description && (
                      <div className="role-description">{role.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="selected-roles-summary">
            <h4>已选择角色 ({selectedRoles.length})</h4>
            <div className="selected-roles-list">
              {selectedRoles.length === 0 ? (
                <p className="no-roles">暂未选择任何角色</p>
              ) : (
                selectedRoles.map(roleCode => {
                  const role = availableRoles.find(r => r.code === roleCode);
                  return (
                    <span key={roleCode} className="selected-role-tag">
                      {role?.name || roleCode}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={onCancel} disabled={loading}>
            取消
          </button>
          <button type="button" className="save-btn" onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <div className="mini-spinner"></div>
                保存中...
              </>
            ) : (
              '保存角色'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RBACUsers;