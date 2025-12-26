import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../config/api';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: '您好！我是企业知识库助手，很高兴为您服务。我可以帮您解答关于公司政策、流程、制度等各类问题。请问有什么可以帮助您的吗？',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const { user, token } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await apiClient.post('/chat', {
        text: userMessage.content,
        session_id: sessionId
      });
      
      // 更新session_id
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }

      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: data.answer || '抱歉，我暂时无法回答您的问题。',
        timestamp: new Date(),
        activeRoute: data.active_route
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: '抱歉，服务器出现错误，请稍后重试。',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickQuestions = [
    '公司年假政策是什么？',
    '如何申请加班费？',
    '办公用品申请流程？',
    '差旅报销标准？'
  ];

  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <div className="chat-container">
      {/* 头部 */}
      <div className="chat-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="8" fill="#1890ff"/>
              <path d="M16 24L22 30L32 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="header-info">
            <h1>企业知识库助手</h1>
            <p>智能问答 · 专业服务</p>
          </div>
          <div className="user-info">
            <span>欢迎，{user?.username}</span>
            <button 
              onClick={() => {
                logout();
                window.navigate('/login');
              }}
              className="logout-btn"
            >
              退出
            </button>
          </div>
        </div>
      </div>

      {/* 聊天内容区域 */}
      <div className="chat-content">
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'assistant' ? (
                  <div className="assistant-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="12" fill="#1890ff"/>
                      <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                ) : (
                  <div className="user-avatar">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.content}</p>
                  {message.activeRoute && (
                    <div className="message-meta">
                      <span className="route-tag">{message.activeRoute}</span>
                    </div>
                  )}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">
                <div className="assistant-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#1890ff"/>
                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 快速问题 */}
        {messages.length === 1 && (
          <div className="quick-questions">
            <h3>常见问题</h3>
            <div className="question-grid">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="question-item"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="chat-input-area">
        <div className="input-container">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="请输入您的问题..."
            className="message-input"
            rows="1"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="input-hint">
          按 Enter 发送，Shift + Enter 换行
        </div>
      </div>
    </div>
  );
};

export default Chat;