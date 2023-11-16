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
Add-Content -Path ".\.env" -Value "DISABLE_ESLINT_PLUGIN=true"
Add-Content -Path ".\.env" -Value "REACT_APP_DISABLE_UPGRADE_INSECURE_REQUESTS=true"

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
pyinstaller .\pywebview_portable.py --hide-console "hide-early" --add-data "library;library" --add-data "sql_app.db;." --noconfirm --clean --name $applicationName --icon "library\static\favicon.ico" --hidden-import=keras --hidden-import=PIL --hidden-import=glob --hidden-import=numpy --hidden-import=tensorflow --hidden-import=cv2 --hidden-import=torchvision --hidden-import=torch 

# Package Executable into Zip
$7zVar = Join-Path ".\dist" $applicationName
7z -tzip a (Join-Path $7zVar ".zip") (Join-Path $7zVar "*")

# Move Zipped Executable to Root
$NewName = Join-Path $rootPath "$applicationName-Portable-Windows.zip"
Move-Item (Join-Path $7zVar ".zip") $NewName -Force

# Package Backend + Frontend into Installation Executable
pyinstaller .\pywebview_installed.py --hide-console "hide-early" --add-data "library;library" --add-data "sql_app.db;." --noconfirm --clean --name $applicationName --contents-directory "." --icon "library\static\favicon.ico" --hidden-import=keras --hidden-import=PIL --hidden-import=glob --hidden-import=numpy --hidden-import=tensorflow --hidden-import=cv2 --hidden-import=torchvision --hidden-import=torch 
iscc .\package.iss

# # Move Installation Executable to Root
$OldName = ".\$applicationName-Setup.exe"
$NewName = Join-Path $rootPath "$applicationName-Setup.exe"
Move-Item $OldName $NewName -Force

# # Disable Venv
# deactivate

# # Create Web-only Executable
$applicationName = "CritterSleuthWeb"

Set-Location $frontendPath

# Package Frontend into Executable
pyinstaller .\pywebview_webapp.py --noconfirm  --clean --name $applicationName --windowed --icon "public\favicon.ico"

# Package Executable into Zip
$7zVar = Join-Path ".\dist" $applicationName
$zipName = $applicationName + ".zip"
7z -tzip a (Join-Path ".\dist" $zipName) (Join-Path $7zVar "*")

# Move Zipped Executable to Root
$OldName = Join-Path ".\dist" ($applicationName + ".zip")
$NewName = Join-Path $rootPath ($applicationName + "-Portable-windows.zip")
Move-Item $OldName $NewName -Force

# Disable Venv
deactivate

iscc .\package.iss

# Move Installation Executable to Root
$NewLocation = Join-Path $rootPath "$applicationName-Setup.exe"
Move-Item "Web-$applicationName-Setup.exe" $NewLocation -Force

# Set Location back to Root
Set-Location $rootPath
