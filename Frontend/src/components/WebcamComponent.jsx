import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';

const WebcamComponent = ({
  postureType,
  setAnalysis,
  setError,
  setLoading,
  loading,
  pendingPostureType,
  setPendingPostureType,
  API_BASE_URL
}) => {
  const [stream, setStream] = useState(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startWebcam = async () => {
    setError(null);
    setAnalysis(null);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          facingMode: 'user' 
        },
        audio: false
      });
      
      setStream(mediaStream);
      setUseWebcam(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(console.error);
          };
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing webcam:', error);
      let errorMessage = 'Webcam error: ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Camera access denied. Please allow camera permissions.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found. Please connect a camera.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.';
      } else {
        errorMessage += error.message || 'Please check permissions and try again.';
      }
      
      setError(errorMessage);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setUseWebcam(false);
    setError(null);
    setAnalysis(null);
  };

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Webcam not initialized');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.readyState < 2) {
      setError('Webcam not ready. Please wait for video to load.');
      return;
    }

    try {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(async (blob) => {
        if (blob && blob.size > 0) {
          await analyzeFrame(blob);
        } else {
          setError('Failed to capture frame - no image data');
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Capture error:', error);
      setError('Failed to capture frame: ' + error.message);
    }
  }, []);

  const analyzeFrame = async (imageBlob) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'webcam_frame.jpg');
      formData.append('posture_type', postureType); // Fixed typo from 'posture_type'

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
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2 w-full">
        <button 
          onClick={useWebcam ? stopWebcam : startWebcam} 
          disabled={loading}
          className={`py-3 px-6 rounded-full font-semibold shadow-md hover:shadow-lg transition-all ${
            useWebcam 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gradient-to-r from-gray-100 to-gray-300 text-black'
          } disabled:from-gray-400 disabled:to-gray-600 disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {useWebcam ? 'Stop Webcam' : 'Start Webcam'}
        </button>
        {useWebcam && (
          <button 
            onClick={captureFrame} 
            disabled={loading || !stream}
            className="bg-gradient-to-r from-gray-100 to-gray-300 text-white py-3 px-6 rounded-full font-semibold shadow-md hover:shadow-lg transition-all disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Analyzing...' : 'Capture & Analyze'}
          </button>
        )}
      </div>

      {useWebcam && (
        <div className="bg-white/95 rounded-2xl p-6 shadow-md text-center">
          <h3 className="text-lg font-semibold text-black mb-3">Live Camera Feed</h3>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="border-4 border-white rounded-2xl shadow-md w-full max-w-lg max-h-96 object-cover mx-auto"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

export default WebcamComponent;