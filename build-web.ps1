################ Build Windows Executables ################
# This script builds and packages the frontend into a portable web application

$applicationName = "CritterSleuthWeb"
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

# Create Web-only Executable
Set-Location $frontendPath
Set-Content -Path (Join-Path "." ".env") -Value "REACT_APP_BACKEND_URL=https://crittersleuthbackend.keshuac.com/"
Add-Content -Path ".\.env" -Value "REACT_APP_DISABLE_NAVBAR=false"
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