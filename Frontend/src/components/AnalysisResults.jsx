import React from 'react';

const AnalysisResults = ({ analysis }) => {
  return (
    <div className="bg-white/95 rounded-2xl p-6 shadow-md mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Analysis</h2>
      <div className={`p-5 rounded-2xl font-semibold text-xl text-center mb-6 ${
        analysis.has_bad_posture ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
      }`}>
        {analysis.has_bad_posture ? 'Issues in Posture' : 'Good Posture'}
      </div>
      
      {analysis.issues && analysis.issues.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-3">You need to improve your Posture</h3>
          <ul className="space-y-3">
            {analysis.issues.map((issue, index) => (
              <li 
                key={index} 
                className="bg-white/10 p-4 rounded-2xl border-l-4 border-red-500"
              >
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {analysis.annotated_image && (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Pose Analysis</h3>
          <img 
            src={analysis.annotated_image} 
            alt="Annotated pose" 
            className="max-w-full h-auto rounded-2xl shadow-sm max-h-96 object-contain mx-auto" 
          />
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;