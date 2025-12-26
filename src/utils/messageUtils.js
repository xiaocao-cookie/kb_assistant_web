// 消息提示工具函数
export const showSuccessMessage = (message) => {
  // 创建成功消息元素
  const successDiv = document.createElement('div');
  successDiv.className = 'message-toast message-success';
  successDiv.innerHTML = `
    <div class="message-content">
      <span class="message-icon">✓</span>
      <span class="message-text">${message}</span>
    </div>
  `;

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .message-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .message-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .message-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .message-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .message-icon {
      font-weight: bold;
      font-size: 16px;
    }
    
    .message-text {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;

  // 添加样式到页面头部
  if (!document.querySelector('style[data-message-toast]')) {
    style.setAttribute('data-message-toast', 'true');
    document.head.appendChild(style);
  }

  // 添加消息到页面
  document.body.appendChild(successDiv);

  // 3秒后自动消失
  setTimeout(() => {
    successDiv.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
    }, 300);
  }, 3000);

  return successDiv;
};

export const showErrorMessage = (message) => {
  // 创建错误消息元素
  const errorDiv = document.createElement('div');
  errorDiv.className = 'message-toast message-error';
  errorDiv.innerHTML = `
    <div class="message-content">
      <span class="message-icon">✕</span>
      <span class="message-text">${message}</span>
    </div>
  `;

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .message-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .message-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .message-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .message-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .message-icon {
      font-weight: bold;
      font-size: 16px;
    }
    
    .message-text {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;

  // 添加样式到页面头部
  if (!document.querySelector('style[data-message-toast]')) {
    style.setAttribute('data-message-toast', 'true');
    document.head.appendChild(style);
  }

  // 添加消息到页面
  document.body.appendChild(errorDiv);

  // 5秒后自动消失（错误消息显示时间稍长）
  setTimeout(() => {
    errorDiv.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 300);
  }, 5000);

  return errorDiv;
};

export const showInfoMessage = (message) => {
  // 创建信息消息元素
  const infoDiv = document.createElement('div');
  infoDiv.className = 'message-toast message-info';
  infoDiv.innerHTML = `
    <div class="message-content">
      <span class="message-icon">ℹ</span>
      <span class="message-text">${message}</span>
    </div>
  `;

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .message-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .message-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .message-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .message-info {
      background: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
    
    .message-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .message-icon {
      font-weight: bold;
      font-size: 16px;
    }
    
    .message-text {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;

  // 添加样式到页面头部
  if (!document.querySelector('style[data-message-toast]')) {
    style.setAttribute('data-message-toast', 'true');
    document.head.appendChild(style);
  }

  // 添加消息到页面
  document.body.appendChild(infoDiv);

  // 4秒后自动消失
  setTimeout(() => {
    infoDiv.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (infoDiv.parentNode) {
        infoDiv.parentNode.removeChild(infoDiv);
      }
    }, 300);
  }, 4000);

  return infoDiv;
};

// 清除所有消息
export const clearAllMessages = () => {
  const messages = document.querySelectorAll('.message-toast');
  messages.forEach(message => {
    message.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 300);
  });
};