#!/bin/bash

# Navigate to frontend and build React
cd frontend
npm install
npm run build

# Navigate to backend and install dependencies
cd ../backend
npm install

# Start the backend server (which also serves React build)
node src/server.js
