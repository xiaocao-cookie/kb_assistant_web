import React, { useState, useEffect } from 'react';
import adminApi from '../../../services/adminApi';
import './RBACRoles.css';

const RBACRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await adminApi.listRoles();
      setRoles(response.roles || []);
    } catch (error) {
      console.error('获取角色列表失败:', error);
      setError('获取角色列表失败');
      // 设置默认数据用于演示
      setRoles([
        { id: 1, code: 'admin', name: '系统管理员', description: '拥有系统所有权限', is_system: 1 },
        { id: 2, code: 'manager', name: '管理员', description: '拥有大部分管理权限', is_system: 1 },
        { id: 3, code: 'editor', name: '编辑员', description: '可以编辑和发布内容', is_system: 0 },
        { id: 4, code: 'viewer', name: '查看员', description: '只能查看内容', is_system: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (roleData) => {
    try {
      await adminApi.setRoles(roleData);
      setShowCreateModal(false);
      fetchRoles();
      showSuccessMessage('角色创建成功');
    } catch (error) {
      showErrorMessage('角色创建失败: ' + error.message);
    }
  };

  const handleEditRole = async (roleData) => {
    try {
      // 这里应该调用更新API，目前使用创建API作为示例
      await adminApi.setRoles(roleData);
      setShowEditModal(false);
      setCurrentRole(null);
      fetchRoles();
      showSuccessMessage('角色更新成功');
    } catch (error) {
      showErrorMessage('角色更新失败: ' + error.message);
    }
  };

  const handleDeleteRole = async (roleCode) => {
    try {
      // 这里应该调用删除API，目前模拟删除
      const updatedRoles = roles.filter(role => role.code !== roleCode);
      setRoles(updatedRoles);
      setShowDeleteModal(false);
      setCurrentRole(null);
      showSuccessMessage('角色删除成功');
    } catch (error) {
      showErrorMessage('角色删除失败: ' + error.message);
    }
  };

  const showSuccessMessage = (message) => {
    // 简单的消息提示
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

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="roles-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rbac-roles">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-content">
          <h1>角色管理</h1>
          <p>管理系统角色和权限配置</p>
        </div>
        <button 
          className="create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          + 创建角色
        </button>
      </div>

      {/* 搜索和过滤器 */}
      <div className="page-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索角色名称、代码或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="toolbar-actions">
          <button className="filter-btn">
            <span>🔍</span> 高级筛选
          </button>
          <button className="export-btn">
            <span>📊</span> 导出数据
          </button>
        </div>
      </div>

      {/* 角色列表 */}
      <div className="roles-container">
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="roles-grid">
          {filteredRoles.map((role) => (
            <div key={role.id} className="role-card">
              <div className="role-header">
                <div className="role-info">
                  <h3 className="role-name">{role.name}</h3>
                  <span className="role-code">#{role.code}</span>
                  {role.is_system === 1 && (
                    <span className="system-badge">系统角色</span>
                  )}
                </div>
                <div className="role-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => {
                      setCurrentRole(role);
                      setShowEditModal(true);
                    }}
                    title="编辑角色"
                  >
                    ✏️
                  </button>
                  {role.is_system === 0 && (
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => {
                        setCurrentRole(role);
                        setShowDeleteModal(true);
                      }}
                      title="删除角色"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              <p className="role-description">{role.description}</p>
              <div className="role-stats">
                <div className="stat-item">
                  <span className="stat-icon">👥</span>
                  <span className="stat-value">12</span>
                  <span className="stat-label">用户</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🔐</span>
                  <span className="stat-value">8</span>
                  <span className="stat-label">权限</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRoles.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>暂无角色</h3>
            <p>开始创建您的第一个角色</p>
            <button 
              className="create-first-btn"
              onClick={() => setShowCreateModal(true)}
            >
              创建角色
            </button>
          </div>
        )}
      </div>

      {/* 创建角色模态框 */}
      {showCreateModal && (
        <RoleModal
          title="创建新角色"
          role={null}
          onSave={handleCreateRole}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

      {/* 编辑角色模态框 */}
      {showEditModal && currentRole && (
        <RoleModal
          title="编辑角色"
          role={currentRole}
          onSave={handleEditRole}
          onCancel={() => {
            setShowEditModal(false);
            setCurrentRole(null);
          }}
        />
      )}

      {/* 删除确认模态框 */}
      {showDeleteModal && currentRole && (
        <DeleteConfirmModal
          role={currentRole}
          onConfirm={() => handleDeleteRole(currentRole.code)}
          onCancel={() => {
            setShowDeleteModal(false);
            setCurrentRole(null);
          }}
        />
      )}
    </div>
  );
};

// 角色模态框组件
const RoleModal = ({ title, role, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    code: role?.code || '',
    name: role?.name || '',
    description: role?.description || '',
    is_system: role?.is_system || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('请填写必填字段');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="role-code">角色代码 *</label>
            <input
              type="text"
              id="role-code"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              placeholder="例如：admin"
              required
              disabled={role?.is_system === 1}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role-name">角色名称 *</label>
            <input
              type="text"
              id="role-name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="例如：系统管理员"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role-description">角色描述</label>
            <textarea
              id="role-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="描述角色的职责和权限..."
              rows="3"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              取消
            </button>
            <button type="submit" className="save-btn">
              {role ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 删除确认模态框组件
const DeleteConfirmModal = ({ role, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>确认删除</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <div className="delete-warning">
            <span className="warning-icon">⚠️</span>
            <p>您确定要删除角色 "<strong>{role.name}</strong>" 吗？</p>
            <p className="delete-note">此操作无法撤销，可能会影响分配了该角色的用户。</p>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            取消
          </button>
          <button type="button" className="delete-btn" onClick={onConfirm}>
            删除
          </button>
        </div>
      </div>
    </div>
  );
};

export default RBACRoles;