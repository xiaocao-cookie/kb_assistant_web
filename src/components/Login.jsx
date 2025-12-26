import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除错误信息
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigate('/chat');
      } else {
        setError(result.error || '登录失败，请检查用户名和密码');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="8" fill="#1890ff"/>
              <path d="M16 24L22 30L32 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>企业知识库助手</h1>
          <p>登录到您的账户</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#ff4d4f" strokeWidth="2"/>
                <path d="M8 4V8" stroke="#ff4d4f" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="1" fill="#ff4d4f"/>
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                登录中...
              </div>
            ) : (
              '登录'
            )}
          </button>

          <div className="login-footer">
            <span>还没有账户？</span>
            <Link to="/register" className="register-link">
              立即注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;