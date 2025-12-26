import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
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

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('请输入用户名');
      return false;
    }
    if (!formData.password) {
      setError('请输入密码');
      return false;
    }
    if (formData.password.length < 6) {
      setError('密码长度至少6位');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || '注册失败，请稍后重试');
      }
    } catch (err) {
      setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-card">
          <div className="success-message">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#52c41a"/>
                <path d="M16 24L22 30L32 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>注册成功！</h2>
            <p>即将跳转到登录页面...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="8" fill="#1890ff"/>
              <path d="M16 24L22 30L32 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>创建账户</h1>
          <p>加入企业知识库助手</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">用户名 *</label>
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
              <label htmlFor="full_name">姓名</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="请输入真实姓名"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">密码 *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="至少6位密码"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">确认密码 *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="再次输入密码"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">邮箱</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="请输入邮箱地址"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">手机号</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="请输入手机号"
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                注册中...
              </div>
            ) : (
              '创建账户'
            )}
          </button>

          <div className="register-footer">
            <span>已有账户？</span>
            <Link to="/login" className="login-link">
              立即登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;