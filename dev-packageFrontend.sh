#!/bin/bash

rootPath=$(pwd)
backendPath="$rootPath/backend"
frontendPath="$rootPath/frontend"

frontendBuildPath="$frontendPath/build"
backendLibraryPath="$backendPath/library"
backendStaticPath="$backendPath/library/static"

# Build Frontend
cd "$frontendPath"
echo "REACT_APP_BACKEND_URL=http://localhost:80/" > .env
npm install
npm run build

# Copy Frontend to Backend
cd "$rootPath"
rsync -av --exclude '*.json' "$frontendBuildPath"/* "$backendStaticPath" 
mv "$backendStaticPath/index.html" "$backendLibraryPath/templates/index.html"