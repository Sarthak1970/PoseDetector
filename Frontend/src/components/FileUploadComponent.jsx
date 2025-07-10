import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'];
const ALL_SUPPORTED_TYPES = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];

const FileUploadComponent = ({
  postureType,
  setAnalysis,
  setError,
  setLoading,
  loading,
  pendingPostureType,
  setPendingPostureType,
  API_BASE_URL
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const validateFile = (file) => {
    if (!file) return { isValid: false, error: 'No file selected' };

    if (file.size > MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      };
    }

    if (!ALL_SUPPORTED_TYPES.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Unsupported file type. Please use JPEG, PNG, WebP images or MP4, WebM videos' 
      };
    }

    if (file.size === 0) {
      return { isValid: false, error: 'File is empty' };
    }

    return { isValid: true, error: null };
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setError(null);
    setAnalysis(null);

    if (!file) {
      setSelectedFile(null);
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      setFilePreview(null);
      return;
    }

    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      setSelectedFile(null);
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      setFilePreview(null);
      return;
    }

    setSelectedFile(file);
    
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    
    if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      const preview = URL.createObjectURL(file);
      setFilePreview(preview);
    } else {
      setFilePreview(null);
    }
  };

  const analyzeFile = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    const validation = validateFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile, selectedFile.name);
      formData.append('posture_type', postureType);

      // Fixed URL construction
      const baseUrl = API_BASE_URL.endsWith('/') 
        ? API_BASE_URL.slice(0, -1) 
        : API_BASE_URL;
      const apiUrl = `${baseUrl}/analyze-frame`;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      if (response.data) {
        setAnalysis(response.data);
      } else {
        throw new Error('No analysis data received');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      let errorMessage = 'Analysis failed: ';
      
      if (error.response) {
        errorMessage += error.response.data?.message || error.response.data?.detail || `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage += 'No response from server. Please check if the API is running.';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      if (pendingPostureType) {
        setPendingPostureType(null);
      }
    }
  };
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2 w-full">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={loading}
          className="p-4 border-2 border-dashed border-purple-400 rounded-2xl bg-white/90 cursor-pointer hover:border-purple-600 transition-colors w-full"
        />
        {selectedFile && (
          <div className="text-gray-600 bg-white/10 p-3 rounded-2xl text-center text-sm">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
          </div>
        )}
        {selectedFile && !loading && (
          <button 
            onClick={analyzeFile} 
            disabled={loading}
            className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-3 px-6 rounded-full font-semibold shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Analyzing...' : 'Start Analysis'}
          </button>
        )}
      </div>

      {filePreview && (
        <div className="bg-white/95 rounded-2xl p-6 shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">File Preview</h3>
          <img 
            src={filePreview} 
            alt="File preview" 
            className="max-w-full h-auto rounded-xl shadow-sm max-h-80 object-contain mx-auto" 
          />
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;