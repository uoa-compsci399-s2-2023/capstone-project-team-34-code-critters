from keras.models import load_model

def predict(img, path):    
    model = load_model(f"{path}/model.h5")
    return model(img)