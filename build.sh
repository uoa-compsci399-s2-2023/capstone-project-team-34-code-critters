################ Build Linux Package ################
# This script builds the frontend and copies it to the backend
# The script then packages the backend into a portable executable

# Set variables
rootPath=$(pwd)
frontendPath="$rootPath/frontend"
frontendBuildPath="$frontendPath/build"
backendPath="$rootPath/backend"
backendLibraryPath="$backendPath/library"
backendStaticPath="$backendLibraryPath/static"
applicationName="CritterSleuth"
applicationFolder="$backendLibraryPath/application"

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

npm install
npm run build

# Copy Frontend to Backend
cd "$rootPath"
rsync -rlptgoDv --exclude '*.json' --exclude 'static' "$frontendBuildPath"/* "$backendStaticPath"
rsync -rlptgoDv "$frontendBuildPath/static/"* "$backendStaticPath"

# Move index.html to templates folder
mv "$backendStaticPath/index.html" "$backendLibraryPath/templates/index.html"

# Package Backend + Frontend into Portable Executable
cd "$backendPath"
pyinstaller pywebview_portable.py --add-data "library:library" --noconfirm --clean --name "$applicationName" --windowed --icon "library/static/favicon.ico"

cd "$rootPath"

# Package Executable into Zip
cd "$backendPath/dist" && zip -r "$rootPath/Complete-$applicationName-Portable-Ubuntu.zip" "$applicationName"

cd "$rootPath"