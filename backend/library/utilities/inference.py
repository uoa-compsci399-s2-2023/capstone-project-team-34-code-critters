from flask import current_app
from tensorflow.keras.models import load_model
import cv2
import numpy as np
import os
import imp

current_model = "trupanea_v2"
path = current_app.config["DIR_PATH"] + "/models/" + current_model
isProduction = os.getenv('FLASK_ENV') == 'production'

def get_labels(model_name):
    filename = f'{path}/labels.txt'
    with open(filename, 'r') as file:
        lines = file.readlines()
    labels = [line.strip() for line in lines]
    return labels
 
def get_prediction(image_path):
    model_path = ""
    if (isProduction):
        model_path = f'/var/models/model.h5'
    else:
        model_path = f'{path}/model.h5'
    model = load_model(model_path)
    labels = get_labels(current_model)
    
    preprocess = imp.load_source('img_preprocess', f'{path}/preprocess.py')
    # Convert the image from PIL format to the OpenCV BGR format
    img = np.array(preprocess.img_preprocess(image_path))[:,:,::-1]

    # Add a batch dimension to the image
    img = np.expand_dims(img, axis=0)
    
    # Normalize the image
    # img = img / 255.0

    # Get the prediction from the model
    prediction = model.predict(img)
    # Combine the labels and the predictions
    combined_list = list(zip(prediction[0], labels))

    # Sort the list in descending order based on the predictions
    sorted_list = sorted(combined_list, key=lambda x: x[1], reverse=True)

    #return the top 20% of predictions
    return [[float(prob),label] for prob,label in sorted_list]
    