import imp

from ..config import Settings

current_model = "general_insects"
path = Settings.MODEL_FOLDER
isProduction = Settings.FLASK_ENV == 'production'

metadata_cache = {}
keys = ["specVersion", "returnType", "mlFramework"]

def get_labels(model_name="general_insects"):
    filename = f'{path}/{model_name}/labels.txt'
    with open(filename, 'r') as file:
        lines = file.readlines()
    labels = [line.strip() for line in lines]
    return labels

def get_metadata(model_name):
    # Check if the metadata is already in the cache
    if model_name in metadata_cache:
        return metadata_cache[model_name]
    
    filename = f'{path}/{model_name}/metadata.txt'
    metadata = {}

    with open(filename, 'r') as file:
        lines = file.readlines()

    for key, line in zip(keys, lines):
        metadata[key] = line.strip().lower()

    metadata_cache[model_name] = metadata

    return metadata

                 
def get_prediction(image_path, new_image_path, current_model="general_insects"):
    metadata = get_metadata(current_model)

    # Preprocess the image
    preprocess = imp.load_source('img_preprocess', f'{path}/{current_model}/preprocess.py')
    img = preprocess.img_preprocess(new_image_path)
    
    # Get the prediction from the model
    predict = imp.load_source('predict', f'{path}/{current_model}/predict.py')
    prediction = predict.predict(img, f'{path}/{current_model}')

    if metadata["returnType"] == "loose":
        labels = get_labels(current_model)
        
        # Combine the labels and the predictions
        combined_list = list(zip(prediction[0], labels))
        
        # Sort the list in descending order based on the predictions
        sorted_list = sorted(combined_list, key=lambda x: x[1], reverse=True)

        # Return all predictions (Formatted as Strings without scientific notation)
        return [[f'{prob:.20f}',label] for prob,label in sorted_list]
    
    # Metadata["returnType"] == "integrated"
    return prediction
    
