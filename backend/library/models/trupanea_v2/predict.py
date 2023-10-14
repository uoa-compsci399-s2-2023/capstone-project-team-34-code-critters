from keras.models import load_model

async def predict(img, path):    
    model = load_model(f"{path}/model.h5")
    return model.predict(img)