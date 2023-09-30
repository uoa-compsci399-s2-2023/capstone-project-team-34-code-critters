from keras.models import load_model
import imp

from ..config import Settings

current_model = "trupanea_v2"
path = Settings.MODEL_FOLDER
isProduction = Settings.FLASK_ENV == 'production'

def get_labels(model_name="trupanea_v2"):
    filename = f'{path}/{model_name}/labels.txt'
    with open(filename, 'r') as file:
        lines = file.readlines()
    labels = [line.strip() for line in lines]
    return labels
 
def get_prediction(image_path, new_image_path, current_model="trupanea_v2"):
    model_path = f'{path}/{current_model}/model.h5'
    model = load_model(model_path)
    labels = get_labels(current_model)
    
    # Preprocess the image
    preprocess = imp.load_source('img_preprocess', f'{path}/{current_model}/preprocess.py')
    img = preprocess.img_preprocess(new_image_path)

    # Get the prediction from the model
    prediction = model.predict(img)

    # Combine the labels and the predictions
    combined_list = list(zip(prediction[0], labels))

    # Sort the list in descending order based on the predictions
    sorted_list = sorted(combined_list, key=lambda x: x[1], reverse=True)

    # Return all predictions (Formatted as Strings without scientific notation)
    return [[f'{prob:.20f}',label] for prob,label in sorted_list]