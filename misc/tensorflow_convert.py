import tensorflow as tf

modelPath = r''

model = tf.keras.models.load_model(modelPath)
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# Optimizations (Size)
# converter.optimizations = [tf.lite.Optimize.DEFAULT]
# converter.target_spec.supported_ops = [tf.lite.OpsSet.EXPERIMENTAL_TFLITE_BUILTINS_ACTIVATIONS_INT16_WEIGHTS_INT8]

tflite_model = converter.convert()

tflite_model_path = 'model.tflite'
tf.io.write_file(tflite_model_path, tflite_model)