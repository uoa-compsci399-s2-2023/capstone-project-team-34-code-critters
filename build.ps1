$rootPath = $PWD
$backendPath = Join-Path $rootPath "backend"
$frontendPath = Join-Path $rootPath "frontend"

$frontendBuildPath = Join-Path $frontendPath "build"
$backendLibraryPath = Join-Path $backendPath "library"
$backendStaticPath = Join-Path $backendPath "library/static"

$applicationName = "Insect-Identification-Application"
# Write-Output $backendPath
# Write-Output $frontendPath
# Write-Output $frontendBuildPath
# Write-Output $backendStaticPath

# Build Frontend
Set-Location $frontendPath
Set-Content -Path ".\.env" -Value "REACT_APP_BACKEND_URL=http://localhost:80/"
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
pip install -r requirements.txt
pyinstaller .\pywebview_portable.py --add-data "library;library" --noconfirm --clean --name $applicationName --windowed --icon "library\static\favicon.ico"

# Package Executable into Zip
$7zVar = Join-Path ".\dist" $applicationName
7z -tzip a (Join-Path $7zVar ".zip") (Join-Path $7zVar "*")

# Move Zipped Executable to Root
$NewName = Join-Path $rootPath "Complete-$applicationName-Portable.zip"
Move-Item (Join-Path $7zVar ".zip") $NewName -Force

# Package Backend + Frontend into Installation Executable
pyinstaller.exe .\pywebview_installed.py --add-data "library;library" --noconfirm --clean --name $applicationName --windowed --icon "library\static\favicon.ico"
iscc .\package.iss

# Move Installation Executable to Root
$OldName = Join-Path ".\Complete-$applicationName-Setup.exe"
$NewName = Join-Path $rootPath "Complete-$applicationName-Setup.exe"
Move-Item $OldName $NewName -Force

# Disable Venv
deactivate

# Create Web-only Executable
Set-Location $frontendPath
Set-Content -Path (Join-Path "." ".env") -Value "REACT_APP_BACKEND_URL=http://code-critters.onrender.com/"
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
$NewName = Join-Path $rootPath ("Web-" + $applicationName + "-Portable.zip")
Move-Item $OldName $NewName -Force

# Disable Venv
deactivate

# Set Location back to Root
Set-Location $rootPath