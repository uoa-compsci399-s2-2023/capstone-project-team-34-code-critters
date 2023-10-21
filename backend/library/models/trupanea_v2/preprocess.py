from PIL import Image, ImageOps, ImageFilter
from glob import glob
import numpy as np
import cv2

def img_preprocess(img_path, size=299):
    """
    Prepares the images for training/testing:
    - greyscale
    - resize (changes aspect). Note: assumes all are the same size, which they aren't! They have been cropped.
    """
    img = Image.open(img_path, mode='r')

    # Denoise
    # img = img.filter(ImageFilter.UnsharpMask) # POOR
    img = img.filter(ImageFilter.BLUR) # Works well
    
    # Grey scale
    img = np.array(ImageOps.grayscale(img)).astype(float)
    
    """
    # Standardise to 0..255 - NOT USED (doesn't alter the brightness)
    min = np.min(img)
    max = np.max(img)
    # print("min={} max={}".format(min, max))
    img = img * (255.0 / (max-min)) # Adjust contrast
    # print("New min={} max={}".format(np.min(img), np.max(img)))
    img = img - np.min(img)
    # print("Final min={} max={}".format(np.min(img), np.max(img)))
    """
    
    # Normalise to +- 2SD
    # print("OLD mean={} min={} max={}".format(np.mean(img), np.min(img), np.max(img)))
    vmin = int(np.mean(img) - (2 * np.std(img)))
    vmax = int(np.mean(img) + (2 * np.std(img)))
    img = np.clip(img, vmin, vmax)
    img -= vmin
    img *= 256. / (vmax - vmin)

    # print("NEW mean={} min={} max={}".format(np.mean(img), np.min(img), np.max(img)))
    
    """
    mean = np.mean(img)
    print("mean={}".format(mean))
    img = img + (127 - mean) # Adjust brightness
    print("New mean={}".format(np.mean(img)))
    """
    
    # img = Image.fromarray(img.astype('uint8'),'L')
    
    # # Resize - changes the aspect ratio
    # img = img.resize((size, size))
    # img = img.convert('BGR')
    # temp = BytesIO()
    # img.save(temp, format='png')
    # return temp
    # print('color space:', img.mode)
    img = cv2.resize(img, (299, 299))
    img = cv2.convertScaleAbs(img, alpha=(255.0/65535.0))
    img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    
    # img = np.array(preprocess.img_preprocess(image_path))

    # Add a batch dimension to the image
    img = np.expand_dims(img, axis=0)

    # Normalize the image
    # img = img / 255.0
    
    return img
    img.save(f"{img_path}preprocessed_{filename}")
    