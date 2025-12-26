import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="homepage">
      {/* 头部导航 */}
      <header className="homepage-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>企业知识库助手</h1>
            </div>
            <nav className="nav-links">
              {isAuthenticated ? (
                <div className="user-section">
                  <span className="welcome-text">欢迎，{user?.username || '用户'}</span>
                  <Link to="/chat" className="nav-btn btn-primary">
                    进入知识库助手
                  </Link>
                  <button onClick={handleLogout} className="nav-btn btn-secondary">
                    退出登录
                  </button>
                </div>
              ) : (
                <div className="auth-section">
                  <Link to="/login" className="nav-btn btn-secondary">
                    登录
                  </Link>
                  <Link to="/register" className="nav-btn btn-primary">
                    注册
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="homepage-main">
        <div className="container">
          {!isAuthenticated ? (
            // 未登录状态 - 展示产品介绍
            <section className="hero-section">
              <div className="hero-content">
                <h2>智能知识管理，助力企业数字化转型</h2>
                <p className="hero-description">
                  企业知识库助手是一个功能强大的知识管理平台，
                  提供智能问答、文档管理、团队协作等功能，
                  帮助企业高效管理和利用知识资产。
                </p>
                <div className="hero-actions">
                  <Link to="/register" className="cta-button btn-large btn-primary">
                    立即注册
                  </Link>
                  <Link to="/login" className="cta-button btn-large btn-outline">
                    已有账号？立即登录
                  </Link>
                </div>
              </div>
              <div className="hero-image">
                <div className="placeholder-image">
                  <span>🚀</span>
                  <Link to="/admin" className="admin-link">
                    智能化知识管理体验
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            // 已登录状态 - 展示功能导航
            <section className="user-dashboard">
              <div className="dashboard-header">
                <h2>欢迎使用企业知识库助手</h2>
                <p>选择一个功能模块开始使用</p>
              </div>
              
              <div className="feature-cards">
                {/* 知识库助手 */}
                <div className="feature-card primary">
                  <div className="card-icon">💬</div>
                  <h3>知识库助手</h3>
                  <p>与智能助手对话，快速获取所需信息和答案</p>
                  <Link to="/chat" className="card-action btn-primary">
                    立即使用
                  </Link>
                </div>

                {/* 管理员入口 */}
                <div className="feature-card admin">
                  <div className="card-icon">⚙️</div>
                  <h3>系统管理</h3>
                  <p>管理系统设置、用户权限和知识库内容</p>
                  <Link to="/admin" className="card-action btn-admin">
                    进入管理后台
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* 功能特色展示 */}
          <section className="features-section">
            <h3>平台特色</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🤖</div>
                <h4>智能问答</h4>
                <p>基于自然语言处理技术，精准理解用户意图</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📚</div>
                <h4>知识管理</h4>
                <p>集中管理企业知识，支持多维度分类和标签</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔍</div>
                <h4>智能搜索</h4>
                <p>强大的搜索引擎，快速定位所需内容</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <h4>团队协作</h4>
                <p>支持多人协作编辑，实时同步更新</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="homepage-footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2025 企业知识库助手. 保留所有权利.</p>
            <div className="footer-links">
              <a href="#" className="footer-link">关于我们</a>
              <a href="#" className="footer-link">帮助中心</a>
              <a href="#" className="footer-link">联系我们</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;