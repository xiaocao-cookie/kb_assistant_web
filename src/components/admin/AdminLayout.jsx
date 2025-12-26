import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: '仪表盘',
      icon: '📊',
      path: '/admin'
    },
    {
      id: 'rbac',
      label: 'RBAC权限管理',
      icon: '👥',
      children: [
        {
          id: 'roles',
          label: '角色管理',
          path: '/admin/roles'
        },
        {
          id: 'users',
          label: '用户管理',
          path: '/admin/users'
        },
        {
          id: 'permissions',
          label: '权限管理',
          path: '/admin/permissions'
        }
      ]
    },
    {
      id: 'kb',
      label: '知识库管理',
      icon: '📚',
      path: '/admin/kb'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* 侧边栏 */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔧</span>
            {!sidebarCollapsed && <span className="logo-text">系统管理</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                {item.children ? (
                  <div className="nav-group">
                    <div className={`nav-link nav-group-header ${isActivePath(item.path) ? 'active' : ''}`}>
                      <span className="nav-icon">{item.icon}</span>
                      {!sidebarCollapsed && (
                        <>
                          <span className="nav-label">{item.label}</span>
                          <span className="nav-arrow">▼</span>
                        </>
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <ul className="nav-submenu">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <Link 
                              to={child.path} 
                              className={`nav-sublink ${isActivePath(child.path) ? 'active' : ''}`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          {!sidebarCollapsed && (
            <div className="user-info">
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <div className="user-name">{user?.username || '管理员'}</div>
                <div className="user-role">系统管理员</div>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            {!sidebarCollapsed && <span className="logout-text">退出登录</span>}
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1 className="page-title">
              {menuItems.find(item => isActivePath(item.path))?.label || '仪表盘'}
            </h1>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="header-btn">
                <span>🔔</span>
                <span className="notification-badge">3</span>
              </button>
              <div className="user-menu">
                <div className="user-avatar-small">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name-small">{user?.username || '管理员'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;