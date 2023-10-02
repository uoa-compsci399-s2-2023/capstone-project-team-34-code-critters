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

# Package Frontend into Executable
python -m venv venv
source venv/bin/activate
pip install -r ubuntu_requirements.txt
pyinstaller pywebview_webapp.py --noconfirm  --clean --name $applicationName --windowed --icon "public\favicon.ico"

# Package Executable into Zip
cd "$frontendPath/dist" && zip -r "$rootPath/Web-$applicationName-Portable-Ubuntu.zip" "$applicationName"

deactivate

cd "$rootPath"