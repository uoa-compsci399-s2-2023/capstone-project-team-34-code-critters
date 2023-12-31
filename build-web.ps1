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

# Package Frontend into Executable
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
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