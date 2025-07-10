import React, { useState } from 'react';
import FileUploadComponent from '../components/FileUploadComponent';
import WebcamComponent from '../components/WebcamComponent';
import AnalysisResults from '../components/AnalysisResults';

const API_BASE_URL = 'http://127.0.0.1:8000';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postureType, setPostureType] = useState('squat');
  const [pendingPostureType, setPendingPostureType] = useState(null);

  // Clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePostureChange = (value) => {
    if (loading) {
      setPendingPostureType(value);
    } else {
      setPostureType(value);
      setAnalysis(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-800 flex flex-col items-center justify-start py-8 px-4">
      <header className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 md:p-8 mb-6 w-full max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
          PoseDetector
        </h1>
        <p className="text-white/90 text-sm md:text-base max-w-2xl mx-auto">
          Upload a video or use webcam
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-6 flex-1">
        {error && (
          <div className="bg-red-500 text-white p-5 rounded-2xl shadow-md mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <div className="bg-blue-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-200 w-full">
          <div className="flex flex-col md:flex-row gap-4 justify-center flex-wrap mb-6">
            <label className={`px-4 py-2 rounded-full cursor-pointer font-semibold transition-all ${
              postureType === 'squat' 
                ? 'bg-green-700 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-white/10 text-white hover:bg-green-700'
            }`}>
              <input
                type="radio"
                value="squat"
                checked={postureType === 'squat'}
                onChange={(e) => handlePostureChange(e.target.value)}
                className="hidden"
              />
              Squats
            </label>
            <label className={`px-4 py-2 rounded-full cursor-pointer font-semibold transition-all ${
              postureType === 'sitting' 
                ? 'bg-green-700 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-white/10 text-white hover:bg-green-700'
            }`}>
              <input
                type="radio"
                value="sitting"
                checked={postureType === 'sitting'}
                onChange={(e) => handlePostureChange(e.target.value)}
                className="hidden"
              />
              Sitting Pose
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <FileUploadComponent 
              postureType={postureType}
              setAnalysis={setAnalysis}
              setError={setError}
              setLoading={setLoading}
              loading={loading}
              pendingPostureType={pendingPostureType}
              setPendingPostureType={setPendingPostureType}
              API_BASE_URL={API_BASE_URL}
            />
            
            <WebcamComponent 
              postureType={postureType}
              setAnalysis={setAnalysis}
              setError={setError}
              setLoading={setLoading}
              loading={loading}
              pendingPostureType={pendingPostureType}
              setPendingPostureType={setPendingPostureType}
              API_BASE_URL={API_BASE_URL}
            />
          </div>
        </div>

        {analysis && (
          <AnalysisResults analysis={analysis} />
        )}
      </main>
    </div>
  );
}

export default App;