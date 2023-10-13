import tensorflow as tf

def img_preprocess(image_path):    
    # # Load the image file and resize it to 224 x 224 pixels
    # img = tf.keras.utils.load_img(image_path, target_size=[224, 224])
    
    # # Convert the image to an array
    # # x = tf.keras.utils.img_to_array(img)

    # # Scale the pixel values to [0, 1]
    # # x = x / 255.0

    # # Preprocess the array for MobileNet
    # x = tf.keras.applications.mobilenet.preprocess_input(x[tf.newaxis,...])

    # return x
    # Read the image file
    img = tf.io.read_file(image_path)
    # Decode the image file to a tensor and make sure it has 3 channels
    img = tf.image.decode_image(img, channels=3)

    # Resize the image to the desired size
    img = tf.image.resize(img, [224, 224])

    # Scale the pixel values to [0, 1]
    img = img / 255.0

    # Add a batch dimension
    img = tf.expand_dims(img, axis=0)
    return img