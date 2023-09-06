# Navigate to root and sets a var
Set-Location ..
$rootDir = Get-Location
Set-Location $rootDir

# Set the path to the models folder
$modelsPath = ".\backend\library\models"

# Get a list of all subdirectories in the models folder
$subDirs = Get-ChildItem $modelsPath -Directory

# Loop through each subdirectory and create a tar archive of the model file
foreach ($subDir in $subDirs) {
    $modelPath = Join-Path $subDir.FullName "model.h5"
    $outputFileName = Join-Path $rootDir "$($subDir.Name).tar.gz"
    tar -czvf $outputFileName -C $(Split-Path $modelPath) $(Split-Path -Leaf $modelPath)
    Move-Item $outputFileName $rootDir

}