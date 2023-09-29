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


## Technologies Used

**Frontend Technologies:**

[![React](https://img.shields.io/badge/React-v18.2.0-%2361DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v4.9.5-%233178C6?logo=typescript)](https://www.typescriptlang.org/) 
[![JavaScript](https://img.shields.io/badge/Javascript-%23000000?logo=javascript)](https://www.javascript.com/)

**Backend Technologies:**

[![Python](https://img.shields.io/badge/Python-v3.11-%233776AB?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI%20-%20%23009688?logo=fastapi&logoColor=white
)](https://fastapi.tiangolo.com/)
[![Tensorflow](https://img.shields.io/badge/Tensorflow-%23FF6F00?logo=Tensorflow&logoColor=white)](https://www.tensorflow.org/)


**Hosting Technologies:**

[![Firebase](https://img.shields.io/badge/Firebase-%23FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/) 
[![AWS](https://img.shields.io/badge/AWS-%23232F3E?logo=amazonaws&logoColor=white)](https://aws.amazon.com) 

## Installation
Go to releases and install the latest version of the application for your operating system.<br>
There are two versions of the application.
1. The full version which includes the models and is around 1.5GB in size.
2. The cutdown web version which does not include the models and is around 100MB in size.<br>
    - The cutdown version requires an internet connection to use the models.

NOTE: Each version comes either as installer or as a portable zip file.
- The installer will install the application to your computer.
- The zip file will need to be extracted before the application can be used.


# Development Installation
## Backend Installation
### Python version
This Application was last tested in Python version 3.11.1
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

#### Importing and Adding model
Since the models are big, they are not included in the repository.\
To add the models, 
1. Create a new folder for each model with the name of the model in the `library/models` folder.\
    If there isn't a `library/models` folder: You should make one.
    ```
    library/models/example_model/
    ```
2. Copy the model to the new folder, and rename it to model
    ```
    library/models/example_model/model.h5
    ```
3. Copy the corresponding labels to the folder and rename it to `labels.txt`\
    *The application expects labels.txt to have one label per line* 
    ```
    library/models/example_model/labels.txt
    ```

#### Running the backend application (Development)
From the project's backend directory, and within the activated virtual environment (see *venv\Scripts\activate* above):
````shell
$ uvicorn asgi:app --reload
```` 
#### Running the application (Production)(Windows)
````shell
$ hypercorn main:app --bind 0.0.0.0:6789
```````
or
````shell
$ uvicorn asgi:app --bind 0.0.0.0:6789
```` 
#### Running the application via Gunicorn (Production)(LINUX or WSL Only)
From the project's backend directory, and within the activated virtual environment (see *venv\Scripts\activate* above):

````shell
$ gunicorn asgi:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:6789
```` 

### `.env` Variables
In the backend directory, there are these optional environment variables that can be set in a `.env` file:

```shell
GBIF_USER = "GBIF_USERNAME"
GBIF_PASSWORD = "GBIF_PASSWORD"
```
If these variables are not set, the application will disable use of the insect information features.

## FrontEnd Setup
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

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
See Wiki for more detailed instructions: [[Link](https://github.com/uoa-compsci399-s2-2023/capstone-project-team-34-code-critters/wiki/Compilation-Instructions)]

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
### AWS Backend
Instructions are at the [[Wiki](https://github.com/uoa-compsci399-s2-2023/capstone-project-team-34-code-critters/wiki/How-to-deploy-Backend)]

# Template

## Project Title

## Project Information

## Technologies Used

## Installation Instructions

## Configuration

## Usage Examples



## Future Plans

## Acknowledgements
