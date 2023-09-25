################ Build Linux Package ################
# This script builds the frontend and packages it into a web-only portable executable
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

# Create Web-only Executable
cd "$frontendPath"

echo "REACT_APP_BACKEND_URL=http://54.206.138.203:6789/" > .env
echo "REACT_APP_DISABLE_NAVBAR=false" >> .env
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

# Package Frontend into Executable
python -m venv venv
source venv/bin/activate
pip install -r ubuntu_requirements.txt
pyinstaller pywebview_webapp.py --add-data "build:build" --noconfirm  --clean --name $applicationName --windowed --icon "public\favicon.ico"

# Package Executable into Zip
cd "$frontendPath/dist" && zip -r "$rootPath/Web-$applicationName-Portable-Ubuntu.zip" "$applicationName"

deactivate

cd "$rootPath"