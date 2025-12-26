import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import RBACRoles from './components/admin/rbac/RBACRoles';
import RBACUsers from './components/admin/rbac/RBACUsers';
import RBACPermissions from './components/admin/rbac/RBACPermissions';
import KBManagement from './components/admin/kb/KBManagement';
import './App.css';

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// 公开路由组件（已登录用户访问时重定向）
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/chat" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* 受保护的路由 */}
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } 
      />
      
      {/* 管理员路由 */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="roles" element={<RBACRoles />} />
        <Route path="users" element={<RBACUsers />} />
        <Route path="permissions" element={<RBACPermissions />} />
        <Route path="kb" element={<KBManagement />} />
      </Route>
      
      {/* 404页面 */}
      <Route 
        path="*" 
        element={
          <div className="not-found">
            <h1>404</h1>
            <p>页面未找到</p>
            <a href="/">返回首页</a>
          </div>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
