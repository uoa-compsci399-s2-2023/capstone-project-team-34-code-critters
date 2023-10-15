############# MODEL TAR CREATION #############
# This script will create a tar archive of each model file in the backend/library/models folder
# and place it in the root directory of the project.
# This is intended for uploads to AWS S3 storage for deployment to sageMaker.

########## UNSUPPORTED ##########
# This script is no longer used as AWS is no longer used for deployment.

Write-Output "THIS SCRIPT IS UNSUPPORTED, AND MAY NOT WORK AS INTENDED"
Write-Output "Type 'y' to continue, or any other key to exit"
$continue = Read-Host
if ($continue -ne "y") {
    exit
}

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