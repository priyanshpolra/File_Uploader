import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedFileId, setCopiedFileId] = useState(null);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/files');
            setFiles(response.data.files || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch files. Please try again later.');
            console.error('Error fetching files:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileId) => {
        try {
            await axios.delete(`http://localhost:5001/api/files/${fileId}`);
            setFiles(files.filter(file => file._id !== fileId));
        } catch (err) {
            console.error('Error deleting file:', err);
            setError('Failed to delete file. Please try again.');
        }
    };

    const handleCopyLink = async (fileUrl, fileId) => {
        try {
            await navigator.clipboard.writeText(fileUrl);
            setCopiedFileId(fileId);
            setTimeout(() => setCopiedFileId(null), 2000);
        } catch (err) {
            console.error('Error copying link:', err);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {files.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                    No files uploaded yet.
                </p>
            ) : (
                <div className="grid gap-4">
                    {files.map((file) => (
                        <div 
                            key={file._id} 
                            className="bg-gray-800 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="font-medium text-lg text-purple-300">
                                        {file.filename}
                                    </h3>
                                    <div className="text-sm text-gray-400">
                                        <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <p>Type: {file.mimetype}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2 items-start">
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-400 hover:text-purple-200 px-3 py-1 rounded-md hover:bg-purple-700 hover:bg-opacity-20 transition-colors"
                                    >
                                        View
                                    </a>
                                    <button
                                        onClick={() => handleCopyLink(file.url, file._id)}
                                        className="text-green-400 hover:text-green-200 px-3 py-1 rounded-md hover:bg-green-700 hover:bg-opacity-20 transition-colors"
                                    >
                                        {copiedFileId === file._id ? 'Copied!' : 'Copy Link'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file._id)}
                                        className="text-red-400 hover:text-red-200 px-3 py-1 rounded-md hover:bg-red-700 hover:bg-opacity-20 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileList;
