from keras.models import load_model

def predict(img, path):    
    model = load_model(f"{path}/model.h5")
    print(path)
    temp = model.predict(img)
    print(temp)
    return temp
    return model.predict(img)