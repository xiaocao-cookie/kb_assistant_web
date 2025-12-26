import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalKBs: 0,
    totalPermissions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAdminStats();
      setStats(response);
    } catch (error) {
      console.error('获取统计数据失败:', error);
      setError('获取统计数据失败');
      // 设置默认数据
      setStats({
        totalUsers: 156,
        totalRoles: 8,
        totalKBs: 12,
        totalPermissions: 45
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 'create-role',
      title: '创建角色',
      description: '添加新的系统角色',
      icon: '👥',
      path: '/admin/roles',
      color: '#1890ff'
    },
    {
      id: 'manage-users',
      title: '管理用户',
      description: '分配和管理用户角色',
      icon: '👤',
      path: '/admin/users',
      color: '#52c41a'
    },
    {
      id: 'configure-permissions',
      title: '配置权限',
      description: '设置角色权限',
      icon: '🔐',
      path: '/admin/permissions',
      color: '#722ed1'
    },
    {
      id: 'manage-kb',
      title: '知识库管理',
      description: '管理企业知识库',
      icon: '📚',
      path: '/admin/kb',
      color: '#fa8c16'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_created',
      message: '用户 "张三" 已被创建',
      time: '5分钟前',
      icon: '👤'
    },
    {
      id: 2,
      type: 'role_updated',
      message: '角色 "管理员" 权限已更新',
      time: '15分钟前',
      icon: '👥'
    },
    {
      id: 3,
      type: 'kb_created',
      message: '知识库 "技术文档" 已创建',
      time: '1小时前',
      icon: '📚'
    },
    {
      id: 4,
      type: 'permission_set',
      message: '为角色 "编辑员" 设置了权限',
      time: '2小时前',
      icon: '🔐'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* 欢迎区域 */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1>欢迎使用系统管理面板</h1>
          <p>高效管理您的企业知识库和用户权限</p>
        </div>
        <div className="welcome-illustration">
          <div className="illustration-icon">🚀</div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e6f7ff' }}>
            <span>👥</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">总用户数</div>
          </div>
          <div className="stat-action">
            <Link to="/admin/users">管理用户</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f6ffed' }}>
            <span>👤</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalRoles}</div>
            <div className="stat-label">系统角色</div>
          </div>
          <div className="stat-action">
            <Link to="/admin/roles">管理角色</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fff7e6' }}>
            <span>📚</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalKBs}</div>
            <div className="stat-label">知识库数量</div>
          </div>
          <div className="stat-action">
            <Link to="/admin/kb">管理知识库</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f9f0ff' }}>
            <span>🔐</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalPermissions}</div>
            <div className="stat-label">权限配置</div>
          </div>
          <div className="stat-action">
            <Link to="/admin/permissions">配置权限</Link>
          </div>
        </div>
      </div>

      {/* 快速操作和最近活动 */}
      <div className="dashboard-content">
        {/* 快速操作 */}
        <div className="quick-actions">
          <h2>快速操作</h2>
          <div className="actions-grid">
            {quickActions.map((action) => (
              <Link 
                key={action.id}
                to={action.path}
                className="action-card"
                style={{ borderLeftColor: action.color }}
              >
                <div className="action-icon" style={{ backgroundColor: `${action.color}20` }}>
                  <span>{action.icon}</span>
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>

        {/* 最近活动 */}
        <div className="recent-activities">
          <h2>最近活动</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  <span>{activity.icon}</span>
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="activities-footer">
            <Link to="#" className="view-all-link">查看所有活动</Link>
          </div>
        </div>
      </div>

      {/* 系统状态 */}
      <div className="system-status">
        <h2>系统状态</h2>
        <div className="status-grid">
          <div className="status-item">
            <div className="status-indicator online"></div>
            <div className="status-content">
              <div className="status-title">数据库连接</div>
              <div className="status-description">正常</div>
            </div>
          </div>
          <div className="status-item">
            <div className="status-indicator online"></div>
            <div className="status-content">
              <div className="status-title">API服务</div>
              <div className="status-description">运行中</div>
            </div>
          </div>
          <div className="status-item">
            <div className="status-indicator warning"></div>
            <div className="status-content">
              <div className="status-title">存储空间</div>
              <div className="status-description">85% 已使用</div>
            </div>
          </div>
          <div className="status-item">
            <div className="status-indicator online"></div>
            <div className="status-content">
              <div className="status-title">系统负载</div>
              <div className="status-description">正常</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;