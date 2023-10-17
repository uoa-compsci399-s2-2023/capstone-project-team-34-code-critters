############## Frontend Packaging (Linux) ##############
# This script builds the frontend and copies it to the backend for local application testing.
# This script is not used in production. 

rootPath=$(pwd)
backendPath="$rootPath/backend"
frontendPath="$rootPath/frontend"

frontendBuildPath="$frontendPath/build"
backendLibraryPath="$backendPath/library"
backendStaticPath="$backendPath/library/static"

# Build Frontend
cd "$frontendPath"
echo "REACT_APP_BACKEND_URL=http://localhost:6789/" > .env
echo "REACT_APP_DISABLE_NAVBAR=true" >> .env
echo "REACT_APP_APIKEY=NULL" >> .env
echo "REACT_APP_AUTHDOMAIN=NULL" >> .env
echo "REACT_APP_PROJECTID=NULL" >> .env
echo "REACT_APP_STORAGEBUCKET=NULL" >> .env
echo "REACT_APP_MESSAGINGSENDERID=NULL" >> .env
echo "REACT_APP_APPID=NULL" >> .env
echo "REACT_APP_MEASUREMENTID=NULL" >> .env
echo "REACT_APP_DISABLE_UPGRADE_SECURE_REQUESTS=true" >> .env
echo "REACT_APP_DISABLE_LOCAL_STORAGE=true" >> .env

npm install
npm run build

# Copy Frontend to Backend
cd "$rootPath"
rsync -rlptgoDv --exclude '*.json' --exclude 'static' "$frontendBuildPath"/* "$backendStaticPath"
rsync -rlptgoDv "$frontendBuildPath/static/"* "$backendStaticPath"
mv "$backendStaticPath/index.html" "$backendLibraryPath/templates/index.html"

cd "$rootPath"
