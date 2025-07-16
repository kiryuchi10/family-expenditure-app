import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import './FileUpload.css';

const FileUpload = ({ onFileUpload, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxSize = 16 * 1024 * 1024; // 16MB

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      setUploadStatus({ type: 'error', message: 'Please select a CSV or Excel file' });
      return;
    }

    if (file.size > maxSize) {
      setUploadStatus({ type: 'error', message: 'File size must be less than 16MB' });
      return;
    }

    setSelectedFile(file);
    setUploadStatus(null);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadStatus({ type: 'loading', message: 'Uploading file...' });
      await onFileUpload(selectedFile);
      setUploadStatus({ type: 'success', message: 'File uploaded successfully!' });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: error.message || 'Upload failed' });
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-header">
        <div className="header-left">
          <h2 className="upload-title">파일 업로드</h2>
          <p className="upload-subtitle">
            CSV 또는 Excel 파일을 업로드하여 거래 내역을 가져오세요
          </p>
        </div>
      </div>

      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${loading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="file-input-hidden"
          accept=".csv,.xlsx,.xls"
          onChange={handleInputChange}
          disabled={loading}
        />

        <div className="upload-content">
          <div className="upload-icon-container">
            <Upload className="upload-icon" />
            {loading && <div className="upload-spinner" />}
          </div>

          <div className="upload-text">
            <p className="upload-primary-text">
              {selectedFile ? selectedFile.name : (
                <>
                  <span className="upload-link">파일을 선택</span>하거나 여기로 드래그하세요
                </>
              )}
            </p>
            <p className="upload-secondary-text">
              CSV, XLSX, XLS 파일 지원 (최대 16MB)
            </p>
          </div>
        </div>

        {dragActive && (
          <div className="drag-overlay">
            <div className="drag-content">
              <Upload className="drag-icon" />
              <p className="drag-text">파일을 놓으세요</p>
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="upload-status">
          <div className="status-content">
            <div className="file-info">
              <File className="file-icon" />
              <div className="file-details">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="status-indicator">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="btn-toss-primary"
                style={{ marginRight: '0.5rem' }}
              >
                {loading ? '업로드 중...' : '업로드'}
              </button>
              <button
                onClick={clearFile}
                disabled={loading}
                className="btn-toss-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.type}`}>
          <div className="status-content">
            <div className="status-indicator">
              {uploadStatus.type === 'loading' && (
                <div className="status-loading">
                  <div className="loading-spinner" />
                  <span>{uploadStatus.message}</span>
                </div>
              )}
              {uploadStatus.type === 'success' && (
                <div className="status-success">
                  <CheckCircle className="status-icon" />
                  <span>{uploadStatus.message}</span>
                </div>
              )}
              {uploadStatus.type === 'error' && (
                <div className="status-error">
                  <AlertCircle className="status-icon" />
                  <span>{uploadStatus.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="upload-info">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">지원 형식</span>
            <span className="info-value">CSV, XLSX, XLS</span>
          </div>
          <div className="info-item">
            <span className="info-label">최대 크기</span>
            <span className="info-value">16MB</span>
          </div>
          <div className="info-item">
            <span className="info-label">처리 시간</span>
            <span className="info-value">1-2분</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;