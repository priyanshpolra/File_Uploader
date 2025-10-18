import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchFiles();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                <p className="text-gray-500 text-center py-8">
                    No files uploaded yet.
                </p>
            ) : (
                <div className="grid gap-4">
                    {files.map((file) => (
                        <div 
                            key={file._id} 
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="font-medium text-gray-900">
                                        {file.filename}
                                    </h3>
                                    <div className="text-sm text-gray-500">
                                        <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <p>Type: {file.mimetype}</p>
                                        <p>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50"
                                    >
                                        Download
                                    </a>
                                    <button
                                        onClick={() => handleDelete(file._id)}
                                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50"
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