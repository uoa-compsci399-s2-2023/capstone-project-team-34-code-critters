### 2023 COMPSCI 399 Capstone Project: 

# CodeCritters


## A Pest Insect Identification GUI 

Team 34 - CodeCritters:

Lance Nillo - Project Manager
lnil547@aucklanduni.ac.nz

Helen Lu - UI + Frontend Developer
hlu750@aucklanduni.ac.nz

Dhiraj Penumala - FullStack Developer
dpen656@aucklanduni.ac.nz

Joshua Chung - Backend Developer
jchu634@aucklanduni.ac.nz

Keisuke Hara - UI + Frontend Developer
khar453@aucklanduni.ac.nz

Rukun Aaron - FullStack Developer
raar518@aucklanduni.ac.nz

## Project Information
Jira Board: [Link](https://pestguicodecritters.atlassian.net/jira/software/projects/CS399/boards/2)  
This project is for a application that supplies a GUI that
allows users to identify pest insects through a machine learning model.  
This project is available through the following platforms:
- Desktop GUI + CLI Local Application: See [Releases](https://github.com/uoa-compsci399-s2-2023/capstone-project-team-34-code-critters/releases)
- Website: [Link](https://codecritters.live/)
- Android Application (Beta): [Link](https://github.com/uoa-compsci399-s2-2023/capstone-project-team-34-code-critters-flutterapp/releases)

Note: The Android application is not hosted in this repository:  
It is hosted at https://github.com/uoa-compsci399-s2-2023/capstone-project-team-34-code-critters-flutterapp

## Technologies Used

**Frontend Technologies:**

[![React](https://img.shields.io/badge/React-v18.2.0-%2361DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v4.9.5-%233178C6?logo=typescript)](https://www.typescriptlang.org/) 
[![JavaScript](https://img.shields.io/badge/Javascript-%23000000?logo=javascript)](https://www.javascript.com/)

**Backend Technologies:**

[![Python](https://img.shields.io/badge/Python-v3.11-%233776AB?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI%20-%20%23009688?logo=fastapi&logoColor=white
)](https://fastapi.tiangolo.com/)
[![Pydantic](https://img.shields.io/badge/Pydantic-e92063?logo=pydantic)](https://pydantic-docs.helpmanual.io/)
[![Uvicorn](https://img.shields.io/badge/Uvicorn-2e303e?logo=uvicorn)](https://www.uvicorn.org/)


[![Pytorch](https://img.shields.io/badge/Pytorch-%23EE4C2C?logo=Pytorch&logoColor=white)](https://pytorch.org/)
[![Tensorflow](https://img.shields.io/badge/Tensorflow-%23FF6F00?logo=Tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![OpenCV](https://img.shields.io/badge/OpenCV-%23white?logo=OpenCV&logoColor=%23white&color=%23white)](https://opencv.org/)
[![Pillow](https://img.shields.io/badge/Pillow-%23000000?logo=pillow)](https://pillow.readthedocs.io/en/stable/)

[![GBIF](https://img.shields.io/badge/GBIF-%23white?logo=GBIF&logoColor=%23white&color=%23white)](https://www.gbif.org/)
[![OpenPyXL](https://img.shields.io/badge/OpenPyXL-2980b9
)](https://openpyxl.readthedocs.io/en/stable/)

**Hosting Technologies:**

[![Firebase](https://img.shields.io/badge/Firebase-%23FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/) 
[![AWS](https://img.shields.io/badge/AWS-%23232F3E?logo=amazonaws&logoColor=white)](https://aws.amazon.com) 
[![Docker](https://img.shields.io/badge/Docker-white?logo=Docker&logoColor=%23FFFFFF&color=%232496ED)](https://www.docker.com/)

**Packaging Technologies:**  
[![InnoSetup](https://img.shields.io/badge/InnoSetup-264b99)](https://jrsoftware.org/isinfo.php)
[![Pyinstaller](https://img.shields.io/badge/Pyinstaller-2980b9)](https://www.pyinstaller.org/)

**Android App Technologies:**  
[![Flutter](https://img.shields.io/badge/Flutter-%2302569B?logo=flutter&logoColor=white)](https://flutter.dev/)
[![Dart](https://img.shields.io/badge/Dart-%230175C2?logo=dart&logoColor=white)](https://dart.dev/)
[![TensorflowLite](https://img.shields.io/badge/TensorflowLite-%23FF6F00?logo=Tensorflow&logoColor=white)](https://www.tensorflow.org/lite)

### Client Installation
Go to [releases](https://github.com/uoa-compsci399-s2-2023/capstone-project-team-34-code-critters/releases) and install the latest version of the application for your operating system.<br>
There are two versions of the application.
1. The full version which includes the models and is around 1.5GB in size.
2. The cutdown web version which does not include the models and is around 100MB in size.<br>
    - The cutdown version requires an internet connection to use the models.

NOTE: Each version comes either as installer or as a portable zip file.
- The installer will install the application to your computer.
- The zip file will need to be extracted before the application can be used.

### Android/iOS
The mobile application is hosted on a seperate repository: [Link](https://github.com/uoa-compsci399-s2-2023/capstone-project-team-34-code-critters-flutterapp)  
Follow the instructions on the repository to install the application.

### Features/Instruction Manual
- Desktop/Portable clients can be opened by running the executable.
- Additionally the Desktop/Portable clients can be interacted with via CLI:
    ```shell
    CritterSleuth.exe --help
    ```
To enable the more information features for insects:
- Firstly, you will need to create an free GBIF account and login.
- Then, you will need to add your GBIF username and password to the application.
    - You will need to add a .env file
    - The .env file should consist of the following with your username and password:
        ```shell
        GBIF_USER = "GBIF_USERNAME"
        GBIF_PASSWORD = "GBIF_PASSWORD"
        ```
    - In the portable version, add the .env file to the root directory of the application. (i.e. the same directory as the executable)(CritterSleuth/)
    - In the installed version, add the .env file to the root directory of the application. (Default: C:\Program Files (x86)\Code Critters\CritterSleuth\)
        - Note: The application may need to be run once as administrator before the features are enabled properly.
        - The application should not require administrator privileges after the first run.
 
## Server Installation
### Docker
1. Install Docker
2. Build the docker image from the root of the directory
    ```shell
    $ docker build -t codecritters -f Server.dockerfile . 
    ```
### Manually installing Server
See [below](#running-the-application-via-gunicorn-productionlinux-or-wsl-only) for manual installation instructions.


# Development Installation
## Backend Installation
### Python version
This Application was last tested in Python version 3.11
#### Dependency Installation via ```requirements.txt```

1. Create a virtual environment ```venv```
   ```shell
   $ py -3 -m venv venv
   $ venv\Scripts\activate
   ```
2. Install dependencies
   ```shell
   $ pip install -r --no-deps requirements.txt
   ```
   Note: If running on a linux instance: use this instead
   ```shell
   $ pip install -r --no-deps ubuntu_requirements.txt
   ```

#### Core Dependencies:
Web server dependencies
- Fastapi
- Uvicorn/Gunicorn
- Pydantic (pydantic-settings)
- python-multipart
- colorama
- tqdm

GUI Libraries
- Pywebview

ML Libraries
- Pillow
- OpenCV (opencv-python)
- Tensorflow
- Pytorch (torch, torchvision)

Auxilary Libraries
- OpenPyXL (XLSX Support)
- httpx (HTTP Client)
- mmh3 (Hashing)
- SQLAlchemy (Database)


#### Importing and Adding model
To add models
1. Format the model as specified in the model spec: [Link](backend/library/models/ModelFormats.md)
2. Add the formatted model to the `backend/library/models` folder

NOTE:  
The trupanea_v2 model is not included in the repository due to its size.  
To use this model add its model.h5 file to the `backend/library/models/trupanea_v2` folder.

#### Note (Development only)
There is swagger documentation available at http://localhost:6789/docs  
There is also a redoc page available at http://localhost:6789/redoc

#### Running the backend application (Development)
From the project's backend directory, and within the activated virtual environment (see *venv\Scripts\activate* above):
````shell
$ uvicorn asgi:app --reload
```` 
or
```shell
$ python asgi.py
```
#### Running the application (Production)
````shell
$ hypercorn main:app --bind 0.0.0.0:6789
```````
or
````shell
$ uvicorn asgi:app --bind 0.0.0.0:6789
```` 
or 
```shell
$ export TZ=NZ
$ python prod_asgi.py
```
#### Running the application via Gunicorn (Production)(LINUX or WSL Only)
From the project's backend directory, and within the activated virtual environment (see *venv\Scripts\activate* above):

````shell
export TZ=NZ
$ gunicorn asgi:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:6789
```` 
or
```shell
$ export TZ=NZ
$ python prod_asgi.py
```

### `.env` Variables
In the backend directory, there are optional environment variables that can be set in a `.env` file:

```shell
GBIF_USER = "GBIF_USERNAME"
GBIF_PASSWORD = "GBIF_PASSWORD"
```
If these variables are not set, the application will disable the insect information features.

You can have multiple `.env` files for different environments.
- `.env.production.local` is used for production.
- `.env.development.local` is used for development.
- `.env` is the default file.

Each file will take precedence over the previous file.
(`.env.production.local > .env.development.local > .env`)

## FrontEnd Setup
### Installing Dependencies
In the frontend directory, you can run:
```
npm install
```

## Available Scripts
In the frontend directory, you can run:

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm run lint:fix`
run eslint and fix errors

## Environment Variables
create a .env file in the root directory of the frontend directory. 
Add the following variables to your .env file.

The following environment variables can be found under Project settings on Firebase.
```
ESLINT_NO_DEV_ERRORS=true
REACT_APP_BACKEND_URL=http://localhost:6789
REACT_APP_APIKEY=API_KEY [REQUIRED]
REACT_APP_AUTHDOMAIN=AUTH_DOMAIN [REQUIRED]
REACT_APP_PROJECTID=PROJECT_ID [REQUIRED]
REACT_APP_STORAGEBUCKET=STORAGE_BUCKET [REQUIRED]
REACT_APP_MESSAGINGSENDERID=SENDER_ID [REQUIRED]
REACT_APP_APPID=FIREBASE_APP_ID [REQUIRED]
REACT_APP_MEASUREMENTID=MEAUREMENT_ID [REQUIRED]
```

There are some optional variables for testing purposes:
```
REACT_APP_DISABLE_NAVBAR=(Default: false)
REACT_APP_DISABLE_UPGRADE_SECURE_REQUESTS=(Default: false)
```

## Compilation Instructions
To see dependencies and more details: [Link](misc\Compilation.md)

### Windows
From the root folder run the following commands:
```shell
.\build.ps1
```

### Linux Instructions
From the root folder run the following commands:
```shell
.\build.sh
```

## Deployment
### Adding extra models
Note: Models are "Hot-swap", so you can add models to a live application without restarting it.
#### Local Applications
- Extra models can be added to portable applications by adding a spec compliant model to the application `CritterSleuth\library\models` folder.
- You can create model "expansion packs" by
  - Adding spec compliant models to the `\misc\models` folder.
  - Customise the `package_models.iss` headers to your model expansion name and version.
  - Run the `package_models.iss` file using `iscc package_models.iss` in `\misc` script.
  - This will generate a `{MODEL_NAME}-ModelExpansion.exe` file in the `\misc` folder.
  - This can be distributed to users as it will install extra models to their existing installed application.
#### Web Application
- You can add extra models to the Web application by adding a spec compliant model to the `backend/library/models` folder at the backend server.
- The backend server will automatically detect the new model without needing to restart the server.  

Notes:
- Although the models are hot-swappable, please check that the model is not being used before replacing it.
- Additionally, the models are live-patchable, so you can replace and modify the model while the application is running.

## Usage examples
### Installed Application
- See [Client Installation](#client-installation) for installation instructions.
- The installed application can be opened from the start menu or by running the executable.
  - The GUI is fully featured and is the most user friendly way to interact with the application.
  - The application can also be interacted with via CLI (It should be added to the PATH automatically):
  - Notable Commands
    - Get help:
        ```shell
        CritterSleuth -h
        ```
    - Get image prediction with default model:
        ```shell
        CritterSleuth -i "path/to/image"
        ```
    - List all available models:
        ```shell
        CritterSleuth -a
        ```
    - Get image prediction with a specific model:
        ```shell
        CritterSleuth -i "path/to/image" -m "model_name"
        ```
    - ``-c`` and ``-x`` to export the results to a csv or xlsx (Excel) file respectively.
### Portable Application
- The portable application can be opened by running the executable.
    - The GUI is fully featured and is the most user friendly way to interact with the application.
    - Additionally, the portable application can be interacted with via CLI:
        ```shell
        path\to\CritterSleuth.exe -i "path/to/image"
        ```

### Deployed URL:
https://code-critters.web.app/  
http://codecritters.live/

## Future Plans
#### Frontend
- Rework the Upload page to be more appealing and user friendly.
- Implement insect information features in the frontend.
- Implement a user profile page.
- Add support for more languages.

#### Backend
- Change hashing algorithm (mmh3) or make it more cryptographically secure
- Add firebase user check to export csv/xlsx for verification
- Add a way to centralise images and models for server deployments to allow load balancing.
- Update automated tests to be more extensive
- Add more automated tests
- Add WEBP support for XLSX Export

#### Deployment
- Implement local user history
- Create a MacOS version of the application.
- Bundle the Linux application as an AppImage instead of a zip file.
- Add license page to InnoSetup setup
- Integrate portable and installed executables into one executable, which gets differentiated by an flag
- Add command line arguments to the web application
- Get Linux version to build properly
- Make CI/CD pipeline to build the application and add to releases (Hampered by the size restrictions which disallows model.h5)

## Acknowledgements
The frontend was jumpstarted using [Create React App](https://github.com/facebook/create-react-app).  
The backend was jumpstarted from this project: https://github.com/jchu634/compsci235-assignment2-jchu634.  
Special thanks to Craig Barton and Ruskin for help with setting up AWS
