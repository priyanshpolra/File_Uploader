import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      console.log('Upload successful:', response.data);
      setFile(null);
      setProgress(0);
      e.target.reset();
    } catch (err) {
      console.error('Upload error details:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Upload Your File</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full
                       file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white
                       hover:file:bg-blue-700 cursor-pointer transition-all duration-300"
            disabled={uploading}
          />
        </div>

        {progress > 0 && (
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white">
              {progress}%
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || uploading}
          className={`w-full py-3 px-6 rounded-full font-semibold text-white transition-all duration-200
                      ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'}`}
        >
          {uploading ? `Uploading... ${progress}%` : 'Upload File'}
        </button>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg shadow-inner">
            {error}
          </div>
        )}

        {file && !error && (
          <div className="text-sm text-gray-600 italic text-center">
            Selected file: <span className="font-medium">{file.name}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUpload;
