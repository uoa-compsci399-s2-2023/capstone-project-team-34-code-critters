from flask import current_app
from tensorflow.keras.models import load_model
import cv2
import numpy as np
import os
import imp


current_model = "trupanea_v2"
path = current_app.config["DIR_PATH"] + "/models/" + current_model
csv_path =  current_app.config["DIR_PATH"] + "/static/" + "csv/"
csv_path =  current_app.config["DIR_PATH"] + "/static/" + "csv/"
isProduction = os.getenv('FLASK_ENV') == 'production'

def get_labels(model_name="trupanea_v2"):
    filename = f'{path}/{model_name}/labels.txt'
    with open(filename, 'r') as file:
        lines = file.readlines()
    labels = [line.strip() for line in lines]
    return labels
 
def get_prediction(image_path, current_model="trupanea_v2"):
    model_path = ""
    if (isProduction):
        model_path = f'/var/models/model.h5'
    else:
        model_path = f'{path}/{current_model}/model.h5'
    model = load_model(model_path)
    labels = get_labels(current_model)
    
    # Preprocess the image
    preprocess = imp.load_source('img_preprocess', f'{path}/{current_model}/preprocess.py')
    img = preprocess.img_preprocess(image_path)

    # Get the prediction from the model
    prediction = model.predict(img)

    # Combine the labels and the predictions
    combined_list = list(zip(prediction[0], labels))

    # Sort the list in descending order based on the predictions
    sorted_list = sorted(combined_list, key=lambda x: x[1], reverse=True)

    # Return all predictions (Formatted as Strings without scientific notation)
    return [[f'{prob:.20f}',label] for prob,label in sorted_list]
def create_CSV(predictions):

    #get how many files are in a directory
    number_of_csv_files = sum([len(files) for r, d, files in os.walk(csv_path)])
    new_csv_file = f'prediction_{number_of_csv_files}.csv'
    with open(csv_path + new_csv_file, 'w') as f:
        f.write('Prediction,Label\n')
        for pred in predictions:
            f.write(f'{pred[0]},{pred[1]}\n')

    return new_csv_file