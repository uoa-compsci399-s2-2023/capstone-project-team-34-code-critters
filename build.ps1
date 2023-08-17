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
npm install
npm run build

# Copy Frontend to Backend
Set-Location $rootPath
Copy-Item -Path $frontendBuildPath\* -Destination $backendStaticPath -Force -Exclude "*.json" 
Copy-Item -Path $frontendBuildPath\static\* -Destination $backendStaticPath -Recurse -Force
Move-Item $backendStaticPath\index.html $backendLibraryPath\index.html -Force

# Package Backend + Frontend into Portable Executable
Set-Location $backendPath
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
pyinstaller .\pywebview_portable.py --add-data "library;library" --noconfirm  --clean --name "Insect Identification Application" --windowed --icon "library\static\favicon.ico"

# Package Executable into Zip
7z -tzip a ".\dist\Insect Identification Application.zip" ".\dist\Insect Identification Application\*"

# Move Zipped Executable to Root
Move-Item ".\dist\Insect Identification Application.zip" $rootPath"\Insect Identification Application.zip" -Force

# Package Backend + Frontend into Installation Executable
pyinstaller.exe .\pywebview_installed.py --add-data "library;library" --noconfirm  --clean --name "Insect Identification Application" --windowed --icon "library\static\favicon.ico"
iscc .\package.iss

# Move Installation Executable to Root
Move-Item ".\Setup.exe" $rootPath"\Setup.exe" -Force

# Set Location back to Root
Set-Location $rootPath
