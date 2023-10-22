# Compilation Instructions
## WARNING
Do not leave any sensitive information in the backend/library/static folder.  
All files in the static folder will be distributed along with the application.

Build scripts are currently slightly broken.  
The script cannot create its venv properly.  
To fix this, create a venv in the /backend/ folder.


## Requirements
### Ubuntu (Tested on WSL 22.04.02 LTS)
 - Python 3.10.6: [Download](https://www.python.org/downloads/)
 - Node.js: [Download](https://nodejs.org/en/download/current)
### Windows
 - Python 3.11: [Download](https://www.python.org/downloads/) or ```choco install python```
 - Node.js: [Download](https://nodejs.org/en/download/current) or ```choco install nodejs``` or ```winget install -e --id OpenJS.NodeJS```
 - 7z: [Download](https://www.7-zip.org/download.html) or ```choco install 7zip.install```
 - Isso Setup: [Download](https://jrsoftware.org/isdl.php)

Make sure that all are available on the path
```shell
$ python --version
$ 7z
$ iscc
$ npm --version
```
### Automated Install [RECOMMENDED]
(Windows) Run ```build.ps1``` in the root directory  
(Linux) Run ```build.sh``` in the root directory

### Manual Steps
1. Build Frontend
   - ```cd frontend```
   - Set the ```.env``` variables
   - Install required packages ```npm install```
   - Build the frontend ```npm run build```
2. Copy the built frontend to the backend
   - Move files from ```frontend\build``` to the backend folders
      - Folders (css, js) inside ```frontend\build\static\``` should be moved to ```backend\library\static\```
      - Favicon.ico and robots.txt should also be moved to ```backend\library\static\```
      - ```index.html``` should be moved to ```backend\templates\```
3. Create, activate a venv and install dependencies (optional)
   - Windows
      ```shell
      python -m venv venv
      .\venv\Scripts\activate
      pip install --no-deps -r requirements.txt
      ```
   - Linux
      ```shell
      python -m venv venv
      source venv/bin/activate
      pip install -r ubuntu_requirements.txt
      ```
4. Run pyinstaller
    - Local App: (Run in ```\backend\```)
      ```shell
      pyinstaller .\pywebview_portable.py --hide-console "hide-early" --add-data "library;library" --add-data "sql_app.db;." --noconfirm --clean --name $applicationName --contents-directory "." --icon "library\static\favicon.ico" --hidden-import=keras --hidden-import=PIL --hidden-import=glob --hidden-import=numpy --hidden-import=tensorflow --hidden-import=cv2 --hidden-import=torchvision --hidden-import=torch
      ```
    - Local App (Installed) (Run in ```\backend\```)
      ```shell
      pyinstaller .\pywebview_installed.py --hide-console "hide-early" --add-data "library;library" --add-data "sql_app.db;." --noconfirm --clean --name $applicationName --contents-directory "." --icon "library\static\favicon.ico" --hidden-import=keras --hidden-import=PIL --hidden-import=glob --hidden-import=numpy --hidden-import=tensorflow --hidden-import=cv2 --hidden-import=torchvision --hidden-import=torch 
      ```
    - Web App (Installed or Portable): (Run in ```\frontend\```)
      ```shell
      pyinstaller .\pywebview_webapp.py --add-data "build;build" --noconfirm  --clean --name $applicationName --windowed --icon "public\favicon.ico"
      ```
5. Build setup executable (Windows only)(Installed)(Optional)
    For the Local app, run in ```\backend\```
    For the Web app, run in ```\frontend\```
     ```shell
     iscc package.iss
     ```



