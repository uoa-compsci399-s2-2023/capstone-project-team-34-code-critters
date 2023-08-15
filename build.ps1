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

# Package Backend + Frontend into Executable
Set-Location $backendPath
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
pyinstaller .\pywebview_main.py --add-data "library;library" --noconfirm --onefile --clean --name "Insect Identification Application" --windowed --icon "library\static\favicon.ico"