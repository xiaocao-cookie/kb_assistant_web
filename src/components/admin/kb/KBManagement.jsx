import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../config/api';
import { showSuccessMessage, showErrorMessage } from '../../../utils/messageUtils';
import './KBManagement.css';

const KBManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadFormData, setUploadFormData] = useState({
    visibility: 'public',
    doc_id: '',
    overwrite: false
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, visibilityFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // 模拟获取文档列表数据
      setDocuments([
        {
          doc_id: 'doc-001',
          original_filename: 'React开发指南.pdf',
          stored_path: '/home/supercao/PycharmProjects/kb_assistant/data/docs/1703123456_abc123def456.pdf',
          visibility: 'public',
          uploader_user_id: 1,
          uploader_username: 'admin',
          chunk_count: 45,
          created_at: new Date('2024-01-15T10:30:00'),
          updated_at: new Date('2024-12-20T14:20:00')
        },
        {
          doc_id: 'doc-002',
          original_filename: '产品使用手册.docx',
          stored_path: '/home/supercao/PycharmProjects/kb_assistant/data/docs/1703200000_def456ghi789.docx',
          visibility: 'private',
          uploader_user_id: 2,
          uploader_username: 'manager',
          chunk_count: 32,
          created_at: new Date('2024-02-01T09:15:00'),
          updated_at: new Date('2024-12-22T16:45:00')
        },
        {
          doc_id: 'doc-003',
          original_filename: 'API接口文档.md',
          stored_path: '/home/supercao/PycharmProjects/kb_assistant/data/docs/1703300000_ghi789jkl012.md',
          visibility: 'public',
          uploader_user_id: 3,
          uploader_username: 'developer',
          chunk_count: 28,
          created_at: new Date('2024-02-10T11:20:00'),
          updated_at: new Date('2024-12-18T13:30:00')
        }
      ]);
    } catch (error) {
      console.error('获取文档列表失败:', error);
      setError('获取文档列表失败');
      showErrorMessage('获取文档列表失败');
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (visibilityFilter !== 'all') {
      filtered = filtered.filter(doc => doc.visibility === visibilityFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.doc_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.uploader_username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadFiles(files);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      showErrorMessage('请选择要上传的文件');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      if (uploadFiles.length === 1) {
        // 单文件上传
        await uploadSingleFile(uploadFiles[0]);
      } else {
        // 批量上传
        await uploadMultipleFiles(uploadFiles);
      }
      
      showSuccessMessage('文件上传成功');
      setShowUploadModal(false);
      setUploadFiles([]);
      setUploadFormData({
        visibility: 'public',
        doc_id: '',
        overwrite: false
      });
      await fetchDocuments();
    } catch (error) {
      console.error('上传失败:', error);
      showErrorMessage('上传失败: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('visibility', uploadFormData.visibility);
    if (uploadFormData.doc_id) {
      formData.append('doc_id', uploadFormData.doc_id);
    }
    formData.append('overwrite', uploadFormData.overwrite.toString());

    const response = await fetch('/kb/ingest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '上传失败');
    }

    const result = await response.json();
    setUploadProgress(100);
    return result;
  };

  const uploadMultipleFiles = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('visibility', uploadFormData.visibility);
    if (uploadFormData.doc_id) {
      formData.append('doc_id', uploadFormData.doc_id);
    }
    formData.append('overwrite', uploadFormData.overwrite.toString());

    const response = await fetch('/kb/ingest/batch', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '批量上传失败');
    }

    const result = await response.json();
    setUploadProgress(100);
    return result;
  };

  const handleDeleteDoc = async (docId) => {
    if (!window.confirm('确定要删除这个文档吗？')) {
      return;
    }

    try {
      // 模拟删除操作
      const filtered = documents.filter(doc => doc.doc_id !== docId);
      setDocuments(filtered);
      showSuccessMessage('文档删除成功');
    } catch (error) {
      console.error('删除文档失败:', error);
      showErrorMessage('删除文档失败');
    }
  };

  const handleUpdateVisibility = async (docId, newVisibility) => {
    try {
      // 模拟更新可见性
      const updatedDocs = documents.map(doc =>
        doc.doc_id === docId ? { ...doc, visibility: newVisibility } : doc
      );
      setDocuments(updatedDocs);
      showSuccessMessage('文档可见性更新成功');
    } catch (error) {
      console.error('更新可见性失败:', error);
      showErrorMessage('更新可见性失败');
    }
  };

  const handleReembed = async (docId) => {
    if (!window.confirm('确定要重新嵌入这个文档吗？这将删除并重新处理所有文档块。')) {
      return;
    }

    try {
      // 模拟重新嵌入操作
      showSuccessMessage('文档重新嵌入成功');
      await fetchDocuments();
    } catch (error) {
      console.error('重新嵌入失败:', error);
      showErrorMessage('重新嵌入失败');
    }
  };

  const handleViewDetail = async (doc) => {
    setCurrentDoc(doc);
    setShowDetailModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVisibilityBadge = (visibility) => {
    return visibility === 'public' ? (
      <span className="badge badge-success">公开</span>
    ) : (
      <span className="badge badge-warning">私有</span>
    );
  };

  const formatFileSize = (fileSize) => {
    if (!fileSize) return '未知';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(fileSize) / Math.log(1024));
    return Math.round(fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredDocuments = filterDocuments();

  if (loading) {
    return (
      <div className="kb-loading">
        <div className="loading-spinner"></div>
        <p>加载文档列表中...</p>
      </div>
    );
  }

  return (
    <div className="kb-container">
      <div className="kb-header">
        <h2>知识库文档管理</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.16 15.42 6.16 15.16C6.16 14.92 6.15 14.49 6.14 14.03C3.14 14.58 2.8 12.94 2.8 12.94C2.48 11.95 2.03 11.69 2.03 11.69C1.77 11.37 2.19 11.37 2.43 11.37C2.76 11.37 2.97 11.72 2.97 12.13C3.3 12.41 3.91 12.25 4.41 12.11C4.46 11.58 4.66 11.24 4.88 11.04C3.73 10.83 2.47 10.19 2.47 7.27C2.47 6.23 2.79 5.32 3.29 4.61C3.22 4.41 2.99 3.66 3.37 2.75C3.37 2.75 3.96 2.55 6.14 4.25C6.79 4.08 7.39 4 8 4C8.61 4 9.21 4.08 9.87 4.25C12.05 2.55 12.63 2.75 12.63 2.75C13.01 3.66 12.78 4.41 12.71 4.61C13.21 5.32 13.53 6.23 13.53 7.27C13.53 9.2 12.27 9.83 11.12 10.04C11.35 10.24 11.55 10.6 11.55 11.09C11.55 11.74 11.54 12.25 11.54 12.79C11.54 13.05 11.83 13.29 12.23 13.22C15.71 12.16 18 9.17 18 5.83C18 2.69 15.31 0 12 0L8 0Z"/>
          </svg>
          上传文档
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#ff4d4f" strokeWidth="2"/>
            <path d="M8 4V8" stroke="#ff4d4f" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="8" cy="11" r="1" fill="#ff4d4f"/>
          </svg>
          {error}
        </div>
      )}

      <div className="kb-filters">
        <div className="filter-group">
          <label>搜索文档：</label>
          <input
            type="text"
            placeholder="输入文件名、文档ID或上传者..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label>可见性筛选：</label>
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">全部</option>
            <option value="public">公开</option>
            <option value="private">私有</option>
          </select>
        </div>
      </div>

      <div className="kb-stats">
        <div className="stat-item">
          <span className="stat-number">{documents.length}</span>
          <span className="stat-label">文档总数</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{documents.filter(doc => doc.visibility === 'public').length}</span>
          <span className="stat-label">公开文档</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{documents.filter(doc => doc.visibility === 'private').length}</span>
          <span className="stat-label">私有文档</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{documents.reduce((sum, doc) => sum + doc.chunk_count, 0)}</span>
          <span className="stat-label">文档块总数</span>
        </div>
      </div>

      <div className="documents-grid">
        {filteredDocuments.map(doc => (
          <div key={doc.doc_id} className="doc-card">
            <div className="doc-card-header">
              <div className="doc-info">
                <h3 className="doc-title">{doc.original_filename}</h3>
                <p className="doc-id">ID: {doc.doc_id}</p>
              </div>
              <div className="doc-actions">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleViewDetail(doc)}
                  title="查看详情"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C3.96243 12.5 1.5 10.0376 1.5 7Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 4.5C7 4.5 8.5 5.5 8.5 7C8.5 8.5 7 9.5 7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteDoc(doc.doc_id)}
                  title="删除文档"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="doc-card-body">
              <div className="doc-meta">
                <div className="meta-row">
                  <span className="meta-label">可见性：</span>
                  {getVisibilityBadge(doc.visibility)}
                </div>
                <div className="meta-row">
                  <span className="meta-label">文档块数：</span>
                  <span className="meta-value">{doc.chunk_count}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">上传者：</span>
                  <span className="meta-value">{doc.uploader_username}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">存储路径：</span>
                  <span className="meta-value file-path">{doc.stored_path}</span>
                </div>
              </div>

              <div className="doc-dates">
                <small className="date-item">
                  创建时间：{formatDate(doc.created_at)}
                </small>
                <small className="date-item">
                  更新时间：{formatDate(doc.updated_at)}
                </small>
              </div>
            </div>

            <div className="doc-card-footer">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  const newVisibility = doc.visibility === 'public' ? 'private' : 'public';
                  handleUpdateVisibility(doc.doc_id, newVisibility);
                }}
              >
                {doc.visibility === 'public' ? '设为私有' : '设为公开'}
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => handleReembed(doc.doc_id)}
              >
                重新嵌入
              </button>
            </div>
          </div>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="no-documents">
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path d="M32 8C17.088 8 4 21.088 4 36C4 50.912 17.088 64 32 64C46.912 64 60 50.912 60 36C60 21.088 46.912 8 32 8Z" stroke="#d9d9d9" strokeWidth="2"/>
                <path d="M24 32H40" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round"/>
                <path d="M32 24V40" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3>暂无文档</h3>
              <p>还没有上传任何文档，点击上方按钮开始上传吧</p>
            </div>
          </div>
        )}
      </div>

      {/* 上传文档模态框 */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>上传文档</h3>
              <button
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="upload-section">
                <div className="form-group">
                  <label>选择文件</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="file-input"
                      accept=".pdf,.doc,.docx,.txt,.md,.html,.rtf"
                    />
                    <div className="file-input-display">
                      {uploadFiles.length > 0 ? (
                        <div className="selected-files">
                          <p>已选择 {uploadFiles.length} 个文件：</p>
                          <ul>
                            {uploadFiles.map((file, index) => (
                              <li key={index}>
                                {file.name} ({formatFileSize(file.size)})
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="file-input-placeholder">
                          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <path d="M24 8C15.163 8 8 15.163 8 24C8 32.837 15.163 40 24 40C32.837 40 40 32.837 40 24C40 15.163 32.837 8 24 8Z" stroke="#d9d9d9" strokeWidth="2"/>
                            <path d="M16 24H32" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M24 16V32" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <p>点击选择文件或拖拽文件到此处</p>
                          <small>支持 PDF、Word、TXT、Markdown、HTML、RTF 格式</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>可见性</label>
                    <select
                      value={uploadFormData.visibility}
                      onChange={(e) => setUploadFormData({...uploadFormData, visibility: e.target.value})}
                      className="form-select"
                    >
                      <option value="public">公开</option>
                      <option value="private">私有</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>文档ID (可选)</label>
                    <input
                      type="text"
                      value={uploadFormData.doc_id}
                      onChange={(e) => setUploadFormData({...uploadFormData, doc_id: e.target.value})}
                      className="form-input"
                      placeholder="留空将自动生成"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={uploadFormData.overwrite}
                      onChange={(e) => setUploadFormData({...uploadFormData, overwrite: e.target.checked})}
                    />
                    <span className="checkbox-text">覆盖已存在的文档 (如果有相同的ID)</span>
                  </label>
                </div>

                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${uploadProgress}%`}}
                      ></div>
                    </div>
                    <p>上传中... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={uploading || uploadFiles.length === 0}
              >
                {uploading ? '上传中...' : '开始上传'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 文档详情模态框 */}
      {showDetailModal && currentDoc && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h3>文档详情</h3>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="doc-detail">
                <div className="detail-section">
                  <h4>基本信息</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>文档ID</label>
                      <span className="detail-value">{currentDoc.doc_id}</span>
                    </div>
                    <div className="detail-item">
                      <label>文件名</label>
                      <span className="detail-value">{currentDoc.original_filename}</span>
                    </div>
                    <div className="detail-item">
                      <label>可见性</label>
                      {getVisibilityBadge(currentDoc.visibility)}
                    </div>
                    <div className="detail-item">
                      <label>文档块数</label>
                      <span className="detail-value">{currentDoc.chunk_count}</span>
                    </div>
                    <div className="detail-item">
                      <label>上传者</label>
                      <span className="detail-value">{currentDoc.uploader_username}</span>
                    </div>
                    <div className="detail-item">
                      <label>创建时间</label>
                      <span className="detail-value">{formatDate(currentDoc.created_at)}</span>
                    </div>
                    <div className="detail-item">
                      <label>更新时间</label>
                      <span className="detail-value">{formatDate(currentDoc.updated_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>存储信息</h4>
                  <div className="detail-item full-width">
                    <label>存储路径</label>
                    <span className="detail-value file-path">{currentDoc.stored_path}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>操作</h4>
                  <div className="detail-actions">
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        const newVisibility = currentDoc.visibility === 'public' ? 'private' : 'public';
                        handleUpdateVisibility(currentDoc.doc_id, newVisibility);
                        setCurrentDoc({...currentDoc, visibility: newVisibility});
                      }}
                    >
                      {currentDoc.visibility === 'public' ? '设为私有' : '设为公开'}
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleReembed(currentDoc.doc_id)}
                    >
                      重新嵌入
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => {
                        handleDeleteDoc(currentDoc.doc_id);
                        setShowDetailModal(false);
                      }}
                    >
                      删除文档
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KBManagement;