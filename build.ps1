################ Build Windows Executables ################
# This script builds the frontend and copies it to the backend
# The script then packages the backend into a portable executable
# The script then rebuilds the application for an installation executable
# Finally the script then packages the frontend into a portable executable

$applicationName = "CritterSleuth"
$rootPath = $PWD
$backendPath = Join-Path $rootPath "backend"
$frontendPath = Join-Path $rootPath "frontend"

$frontendBuildPath = Join-Path $frontendPath "build"
$backendLibraryPath = Join-Path $backendPath "library"
$backendStaticPath = Join-Path $backendPath "library/static"

# Used to inject cv2 dependency into application folder
$backendVenvPath = Join-Path $backendPath "venv"
$venvPackagePath = Join-Path $backendVenvPath "Lib\site-packages"
$distPath = Join-Path $backendPath "dist"
$applicationFolder = Join-Path $distPath $applicationName


# Write-Output $backendPath
# Write-Output $frontendPath
# Write-Output $frontendBuildPath
# Write-Output $backendStaticPath

# Build Frontend
Set-Location $frontendPath
Set-Content -Path ".\.env" -Value "REACT_APP_BACKEND_URL=http://localhost:6789/"
Add-Content -Path ".\.env" -Value "REACT_APP_DISABLE_NAVBAR=true"
Add-Content -Path ".\.env" -Value "REACT_APP_APIKEY=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_AUTHDOMAIN=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_PROJECTID=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_STORAGEBUCKET=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_MESSAGINGSENDERID=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_APPID=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_MEASUREMENTID=NULL"
npm install
npm run build

# Copy Frontend to Backend
Set-Location $rootPath
Copy-Item -Path $frontendBuildPath\* -Destination $backendStaticPath -Force -Exclude "*.json" 
Copy-Item -Path $frontendBuildPath\static\* -Destination $backendStaticPath -Recurse -Force
Move-Item $backendStaticPath\index.html $backendLibraryPath\templates\index.html -Force

# Package Backend + Frontend into Portable Executable
Set-Location $backendPath
python -m venv venv
.\venv\Scripts\activate
pip install --no-deps -r requirements.txt
pyinstaller .\pywebview_portable.py --add-data "library;library" --noconfirm --clean --name $applicationName --windowed --icon "library\static\favicon.ico"

# # Copy cv2 dependency from virtual environment to application folder because pyinstaller does not package it
# Copy-Item -Path "$venvPackagePath\cv2\*" -Destination "$applicationFolder" -Recurse

# Package Executable into Zip
$7zVar = Join-Path ".\dist" $applicationName
7z -tzip a (Join-Path $7zVar ".zip") (Join-Path $7zVar "*")

# Move Zipped Executable to Root
$NewName = Join-Path $rootPath "Complete-$applicationName-Portable-Windows.zip"
Move-Item (Join-Path $7zVar ".zip") $NewName -Force

# Package Backend + Frontend into Installation Executable
pyinstaller .\pywebview_installed.py --add-data "library;library" --noconfirm --clean --name $applicationName --windowed --icon "library\static\favicon.ico"
# # Copy cv2 dependency from virtual environment to application folder because pyinstaller does not package it
# Copy-Item -Path "$venvPackagePath\cv2\*" -Destination "$applicationFolder" -Recurse
iscc .\package.iss

# Move Installation Executable to Root
$OldName = ".\Complete-$applicationName-Setup.exe"
$NewName = Join-Path $rootPath "Complete-$applicationName-Setup.exe"
Move-Item $OldName $NewName -Force

# Disable Venv
deactivate

# Create Web-only Executable
$applicationName = "CritterSleuthWeb"

Set-Location $frontendPath
Set-Content -Path (Join-Path "." ".env") -Value "REACT_APP_BACKEND_URL=http://code-critters.onrender.com/"
Add-Content -Path ".\.env" -Value "REACT_APP_DISABLE_NAVBAR=false"
Add-Content -Path ".\.env" -Value "REACT_APP_APIKEY=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_AUTHDOMAIN=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_PROJECTID=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_STORAGEBUCKET=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_MESSAGINGSENDERID=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_APPID=NULL"
Add-Content -Path ".\.env" -Value "REACT_APP_MEASUREMENTID=NULL"
npm install
npm run build

# Package Frontend into Executable
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
pyinstaller .\pywebview_webapp.py --add-data "build;build" --noconfirm  --clean --name $applicationName --windowed --icon "public\favicon.ico"

# Package Executable into Zip
$7zVar = Join-Path ".\dist" $applicationName
$zipName = $applicationName + ".zip"
7z -tzip a (Join-Path ".\dist" $zipName) (Join-Path $7zVar "*")

# Move Zipped Executable to Root
$OldName = Join-Path ".\dist" ($applicationName + ".zip")
$NewName = Join-Path $rootPath ($applicationName + "-Portable.zip")
Move-Item $OldName $NewName -Force

# Disable Venv
deactivate

iscc .\package.iss

# Move Installation Executable to Root
$NewLocation = Join-Path $rootPath "$applicationName-Setup.exe"
Move-Item "Web-$applicationName-Setup.exe" $NewLocation -Force

# Set Location back to Root
Set-Location $rootPath