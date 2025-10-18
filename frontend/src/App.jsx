import React from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

const App = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-400 to-blue-500 text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* Upload Section */}
                    <div className="bg-gray-800 bg-opacity-80 rounded-xl shadow-lg p-6 backdrop-blur-md">
                        <h2 className="text-2xl font-semibold text-white mb-6">
                            Upload Files
                        </h2>
                        <FileUpload />
                    </div>
                    
                    {/* Uploaded Files Section */}
                    <div className="bg-gray-800 bg-opacity-80 rounded-xl shadow-lg p-6 backdrop-blur-md">
                        <h2 className="text-2xl font-semibold text-white mb-6">
                            Uploaded Files
                        </h2>
                        <FileList />
                    </div>

                </div>
            </main>
        </div>
    );
};

export default App;
