from tensorflow.keras.models import load_model
import cv2
import numpy as np

current_model = "trupanea_v2"

def get_labels(model_name):
    filename = f'library\models\{model_name}\labels.txt'
    with open(filename, 'r') as file:
        lines = file.readlines()
    labels = [line.strip() for line in lines]
    return labels
 
def get_prediction(image_path):
    model = load_model(f"library\models\{current_model}\model.h5")    
    labels = get_labels(current_model)
    # Load the image
    img = cv2.imread(image_path)
    # Resize the image to match the input size of the model
    img = cv2.resize(img, (299, 299))
    # Convert the image to a numpy array
    img = np.array(img)
    # Normalize the image
    img = img / 255.0
    # Add a batch dimension to the image
    img = np.expand_dims(img, axis=0)
    # Get the prediction from the model
    prediction = model.predict(img)


    # Combine the labels and the predictions
    combined_list = list(zip(prediction[0], labels))

    # Sort the list in descending order based on the predictions
    sorted_list = sorted(combined_list, key=lambda x: x[1], reverse=True)

    #return the top 20% of predictions
    return [x for x in sorted_list[:round(len(sorted_list)*0.2)]]
    