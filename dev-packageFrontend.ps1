############## Frontend Packaging (Windows) ##############
# This script builds the frontend and copies it to the backend for local application testing.
# This script is not used in production. 

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

npm install
npm run build

# Copy Frontend to Backend
Set-Location $rootPath
Copy-Item -Path $frontendBuildPath\* -Destination $backendStaticPath -Force -Exclude "*.json" 
Copy-Item -Path $frontendBuildPath\static\* -Destination $backendStaticPath -Recurse -Force
Move-Item $backendStaticPath\index.html $backendLibraryPath\templates\index.html -Force