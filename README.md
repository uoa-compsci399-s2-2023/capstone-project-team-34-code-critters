# 2023 COMPSCI 399 Capstone Project: 
TODO: Group Members:

## Python version

This Application was last tested in Python version 3.11.1


## Installation
**Installation via requirements.txt**

```shell
$ py -3 -m venv venv
$ venv\Scripts\activate
$ pip install -r requirements.txt
```

**Importing and Adding models**\
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


## Execution of the web application

**Running the Flask application**

From the project directory, and within the activated virtual environment (see *venv\Scripts\activate* above):

````shell
$ flask run
```` 
