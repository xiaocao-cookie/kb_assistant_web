import React, { useState, useEffect } from 'react';
import adminApi from '../../../services/adminApi';
import { showSuccessMessage, showErrorMessage } from '../../../utils/messageUtils';
import './RBACPermissions.css';

const RBACPermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [currentRole, setCurrentRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [editingPermission, setEditingPermission] = useState(null);
  const [formData, setFormData] = useState({
    module: '',
    code: '',
    name: '',
    description: '',
    resource: ''
  });

  const modules = [
    { code: 'all', name: '全部模块' },
    { code: 'kb', name: '知识库管理' },
    { code: 'user', name: '用户管理' },
    { code: 'role', name: '角色管理' },
    { code: 'permission', name: '权限管理' },
    { code: 'system', name: '系统管理' }
  ];

  useEffect(() => {
    fetchPermissions();
    fetchRoles();
  }, []);

  useEffect(() => {
    filterPermissions();
  }, [permissions, selectedModule, searchTerm]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await adminApi.listPermissions();
      setPermissions(response.permissions || []);
    } catch (error) {
      console.error('获取权限列表失败:', error);
      setError('获取权限列表失败');
      // 设置默认数据用于演示
      setPermissions([
        { id: 1, code: 'kb_view', name: '查看知识库', module: 'kb', description: '查看知识库内容', resource: '/kb/*', is_system: 1 },
        { id: 2, code: 'kb_create', name: '创建知识库', module: 'kb', description: '创建新的知识库', resource: '/kb/create', is_system: 1 },
        { id: 3, code: 'kb_edit', name: '编辑知识库', module: 'kb', description: '编辑知识库内容', resource: '/kb/edit/*', is_system: 1 },
        { id: 4, code: 'kb_delete', name: '删除知识库', module: 'kb', description: '删除知识库', resource: '/kb/delete/*', is_system: 1 },
        { id: 5, code: 'user_view', name: '查看用户', module: 'user', description: '查看用户列表和详情', resource: '/admin/users', is_system: 1 },
        { id: 6, code: 'user_create', name: '创建用户', module: 'user', description: '创建新用户', resource: '/admin/users/create', is_system: 1 },
        { id: 7, code: 'user_edit', name: '编辑用户', module: 'user', description: '编辑用户信息', resource: '/admin/users/edit/*', is_system: 1 },
        { id: 8, code: 'user_delete', name: '删除用户', module: 'user', description: '删除用户', resource: '/admin/users/delete/*', is_system: 1 },
        { id: 9, code: 'role_view', name: '查看角色', module: 'role', description: '查看角色列表和详情', resource: '/admin/roles', is_system: 1 },
        { id: 10, code: 'role_create', name: '创建角色', module: 'role', description: '创建新角色', resource: '/admin/roles/create', is_system: 1 },
        { id: 11, code: 'role_edit', name: '编辑角色', module: 'role', description: '编辑角色信息', resource: '/admin/roles/edit/*', is_system: 1 },
        { id: 12, code: 'role_delete', name: '删除角色', module: 'role', description: '删除角色', resource: '/admin/roles/delete/*', is_system: 1 },
        { id: 13, code: 'permission_view', name: '查看权限', module: 'permission', description: '查看权限列表', resource: '/admin/permissions', is_system: 1 },
        { id: 14, code: 'permission_create', name: '创建权限', module: 'permission', description: '创建新权限', resource: '/admin/permissions/create', is_system: 1 },
        { id: 15, code: 'permission_edit', name: '编辑权限', module: 'permission', description: '编辑权限信息', resource: '/admin/permissions/edit/*', is_system: 1 },
        { id: 16, code: 'permission_delete', name: '删除权限', module: 'permission', description: '删除权限', resource: '/admin/permissions/delete/*', is_system: 1 },
        { id: 17, code: 'system_config', name: '系统配置', module: 'system', description: '管理系统配置', resource: '/admin/system/config', is_system: 1 },
        { id: 18, code: 'system_logs', name: '系统日志', module: 'system', description: '查看系统日志', resource: '/admin/system/logs', is_system: 1 }
      ]);
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
      setRoles([
        { id: 1, code: 'admin', name: '系统管理员', description: '拥有系统所有权限', is_system: 1 },
        { id: 2, code: 'manager', name: '管理员', description: '拥有大部分管理权限', is_system: 1 },
        { id: 3, code: 'editor', name: '编辑员', description: '可以编辑和发布内容', is_system: 1 },
        { id: 4, code: 'viewer', name: '查看员', description: '只能查看内容', is_system: 1 }
      ]);
    }
  };

  const filterPermissions = () => {
    let filtered = permissions;

    if (selectedModule !== 'all') {
      filtered = filtered.filter(perm => perm.module === selectedModule);
    }

    if (searchTerm) {
      filtered = filtered.filter(perm =>
        perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPermissions(filtered);
  };

  const handleCreatePermission = async (permissionData) => {
    try {
      // 模拟创建权限
      const newPermission = {
        id: Date.now(),
        ...permissionData,
        is_system: 0
      };
      setPermissions([...permissions, newPermission]);
      setShowCreateModal(false);
      resetForm();
      showSuccessMessage('权限创建成功');
    } catch (error) {
      showErrorMessage('权限创建失败: ' + error.message);
    }
  };

  const handleEditPermission = async (permissionData) => {
    try {
      // 模拟更新权限
      const updatedPermissions = permissions.map(perm =>
        perm.id === editingPermission.id
          ? { ...perm, ...permissionData }
          : perm
      );
      setPermissions(updatedPermissions);
      setShowCreateModal(false);
      setEditingPermission(null);
      resetForm();
      showSuccessMessage('权限更新成功');
    } catch (error) {
      showErrorMessage('权限更新失败: ' + error.message);
    }
  };

  const handleDeletePermission = async (permissionId) => {
    if (!window.confirm('确定要删除这个权限吗？')) {
      return;
    }

    try {
      // 模拟删除权限
      const filtered = permissions.filter(perm => perm.id !== permissionId);
      setPermissions(filtered);
      showSuccessMessage('权限删除成功');
    } catch (error) {
      showErrorMessage('权限删除失败: ' + error.message);
    }
  };

  const handleAssignPermissions = async (roleCode, permissionCodes) => {
    try {
      await adminApi.setRolePermissions(roleCode, permissionCodes);
      setShowAssignModal(false);
      setCurrentRole(null);
      setRolePermissions([]);
      showSuccessMessage('角色权限分配成功');
    } catch (error) {
      showErrorMessage('角色权限分配失败: ' + error.message);
    }
  };

  const openAssignModal = async (role) => {
    setCurrentRole(role);
    try {
      const response = await adminApi.getRolePermissions(role.code);
      setRolePermissions(response.perm_codes || []);
      setShowAssignModal(true);
    } catch (error) {
      console.error('获取角色权限失败:', error);
      setRolePermissions([]);
      setShowAssignModal(true);
    }
  };

  const resetForm = () => {
    setFormData({
      module: '',
      code: '',
      name: '',
      description: '',
      resource: ''
    });
  };

  const openCreateModal = (permission = null) => {
    if (permission) {
      setEditingPermission(permission);
      setFormData({
        module: permission.module,
        code: permission.code,
        name: permission.name,
        description: permission.description,
        resource: permission.resource
      });
    } else {
      setEditingPermission(null);
      resetForm();
    }
    setShowCreateModal(true);
  };

  const getModuleName = (moduleCode) => {
    const module = modules.find(m => m.code === moduleCode);
    return module ? module.name : moduleCode;
  };

  if (loading) {
    return <div className="permissions-loading">加载中...</div>;
  }

  return (
    <div className="permissions-container">
      <div className="permissions-header">
        <h2>权限管理</h2>
        <button 
          className="btn btn-primary"
          onClick={() => openCreateModal()}
        >
          <i className="icon-plus"></i>
          创建权限
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="permissions-filters">
        <div className="filter-group">
          <label>模块筛选：</label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="form-select"
          >
            {modules.map(module => (
              <option key={module.code} value={module.code}>
                {module.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>搜索权限：</label>
          <input
            type="text"
            placeholder="输入权限名称、代码或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label>为角色分配权限：</label>
          <select
            onChange={(e) => {
              const role = roles.find(r => r.code === e.target.value);
              if (role) openAssignModal(role);
            }}
            className="form-select"
            value=""
          >
            <option value="">选择角色</option>
            {roles.map(role => (
              <option key={role.code} value={role.code}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="permissions-stats">
        <div className="stat-item">
          <span className="stat-number">{filteredPermissions.length}</span>
          <span className="stat-label">权限数量</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{modules.length - 1}</span>
          <span className="stat-label">模块数量</span>
        </div>
      </div>

      <div className="permissions-table-container">
        <table className="permissions-table">
          <thead>
            <tr>
              <th>权限代码</th>
              <th>权限名称</th>
              <th>模块</th>
              <th>资源路径</th>
              <th>描述</th>
              <th>系统权限</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermissions.map(permission => (
              <tr key={permission.id}>
                <td className="permission-code">{permission.code}</td>
                <td className="permission-name">{permission.name}</td>
                <td>
                  <span className={`module-badge module-${permission.module}`}>
                    {getModuleName(permission.module)}
                  </span>
                </td>
                <td className="permission-resource">{permission.resource}</td>
                <td className="permission-description">{permission.description}</td>
                <td>
                  <span className={`system-badge ${permission.is_system ? 'is-system' : 'custom'}`}>
                    {permission.is_system ? '系统权限' : '自定义'}
                  </span>
                </td>
                <td className="permission-actions">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => openCreateModal(permission)}
                    disabled={permission.is_system}
                    title={permission.is_system ? '系统权限不能编辑' : '编辑权限'}
                  >
                    编辑
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeletePermission(permission.id)}
                    disabled={permission.is_system}
                    title={permission.is_system ? '系统权限不能删除' : '删除权限'}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPermissions.length === 0 && (
          <div className="no-permissions">
            <p>没有找到符合条件的权限</p>
          </div>
        )}
      </div>

      {/* 创建/编辑权限模态框 */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingPermission ? '编辑权限' : '创建权限'}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingPermission(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (editingPermission) {
                  handleEditPermission(formData);
                } else {
                  handleCreatePermission(formData);
                }
              }}>
                <div className="form-group">
                  <label>所属模块 *</label>
                  <select
                    value={formData.module}
                    onChange={(e) => setFormData({...formData, module: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="">选择模块</option>
                    {modules.filter(m => m.code !== 'all').map(module => (
                      <option key={module.code} value={module.code}>
                        {module.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>权限代码 *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="form-input"
                    placeholder="如：user_create"
                    required
                    disabled={!!editingPermission}
                  />
                </div>

                <div className="form-group">
                  <label>权限名称 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="form-input"
                    placeholder="如：创建用户"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>资源路径</label>
                  <input
                    type="text"
                    value={formData.resource}
                    onChange={(e) => setFormData({...formData, resource: e.target.value})}
                    className="form-input"
                    placeholder="如：/admin/users/create"
                  />
                </div>

                <div className="form-group">
                  <label>权限描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="form-textarea"
                    placeholder="描述权限的具体用途"
                    rows="3"
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingPermission(null);
                      resetForm();
                    }}
                  >
                    取消
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPermission ? '更新' : '创建'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 角色权限分配模态框 */}
      {showAssignModal && currentRole && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h3>为角色「{currentRole.name}」分配权限</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowAssignModal(false);
                  setCurrentRole(null);
                  setRolePermissions([]);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="permission-assignment">
                <div className="assignment-header">
                  <input
                    type="text"
                    placeholder="搜索权限..."
                    className="form-input"
                    onChange={(e) => {
                      const searchTerm = e.target.value.toLowerCase();
                      // 这里可以添加实时搜索功能
                    }}
                  />
                </div>
                
                <div className="permission-modules">
                  {modules.filter(m => m.code !== 'all').map(module => {
                    const modulePermissions = filteredPermissions.filter(p => p.module === module.code);
                    if (modulePermissions.length === 0) return null;
                    
                    return (
                      <div key={module.code} className="permission-module">
                        <h4 className="module-title">{module.name}</h4>
                        <div className="module-permissions">
                          {modulePermissions.map(permission => (
                            <label key={permission.id} className="permission-checkbox">
                              <input
                                type="checkbox"
                                checked={rolePermissions.includes(permission.code)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setRolePermissions([...rolePermissions, permission.code]);
                                  } else {
                                    setRolePermissions(rolePermissions.filter(code => code !== permission.code));
                                  }
                                }}
                              />
                              <span className="checkbox-label">
                                <strong>{permission.name}</strong>
                                <small>{permission.description}</small>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAssignModal(false);
                  setCurrentRole(null);
                  setRolePermissions([]);
                }}
              >
                取消
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleAssignPermissions(currentRole.code, rolePermissions)}
              >
                保存权限分配
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RBACPermissions;