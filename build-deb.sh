################ Build Debian Package ################
# This script builds the frontend and copies it to the backend
# The script then packages the backend into a portable executable
# The script then packages the portable executable into a debian package

############### THIS SCRIPT DOES NOT CURRENTLY WORK ###############

echo "This script is currently not working. Please use the build.sh script instead."
exit 1

# Set variables
rootPath=$(pwd)
frontendPath="$rootPath/frontend"
frontendBuildPath="$frontendPath/build"
backendPath="$rootPath/backend"
backendLibraryPath="$backendPath/library"
backendStaticPath="$backendLibraryPath/static"
applicationName="CritterSleuth"
applicationFolder="$backendLibraryPath/application"
debPackagePath="$rootPath/deb-package"

# Build Frontend
cd "$frontendPath"
echo "REACT_APP_BACKEND_URL=http://localhost:6789/" > .env
echo "REACT_APP_DISABLE_NAVBAR=true" >> .env
npm install
npm run build

# Copy Frontend to Backend
cd "$rootPath"
rsync -rlptgoDv --exclude '*.json' "$frontendBuildPath"/* "$backendStaticPath"
rsync -rlptgoDv "$frontendBuildPath/static/"* "$backendStaticPath"

# Move index.html to templates folder
mv "$backendStaticPath/index.html" "$backendLibraryPath/templates/index.html"

# Package Backend + Frontend into Portable Executable
cd "$backendPath"
pyinstaller pywebview_portable.py --add-data "library:library" --noconfirm --clean --name "$applicationName" --windowed --icon "library/static/favicon.ico"

cd "$rootPath"

# Create directory structure for package files
mkdir -p "$debPackagePath/DEBIAN"
mkdir -p "$debPackagePath/usr/bin"
mkdir -p "$debPackagePath/usr/share/$applicationName"
mkdir -p "$debPackagePath/usr/share/applications"

# Create .desktop file
cat > "$rootPath/$applicationName.desktop" << EOF
[Desktop Entry]
Name=$applicationName
Exec=/usr/bin/$applicationName
Icon=/usr/share/$applicationName/icon.png
Type=Application
Categories=Utility;
EOF

# Copy files to appropriate directories
cp -r "$backendPath/dist/$applicationName" "$debPackagePath/usr/bin"
cp "$rootPath/$applicationName.desktop" "$debPackagePath/usr/share/applications"

# Create control file
cat > "$debPackagePath/DEBIAN/control" << EOF
Package: $applicationName
Version: 1.0
Section: base
Priority: optional
Architecture: all
Maintainer: NAME HERE <youremail@example.com>
Description: Machine Learning Insection recogniser
EOF

# Set permissions for package files
chmod -R 755 "$debPackagePath/DEBIAN"
chmod -R 755 "$debPackagePath/usr"
chmod 644 "$rootPath/$applicationName.desktop"

# Build the package
dpkg-deb --build "$debPackagePath" "$rootPath/Complete-$applicationName-Ubuntu.deb"