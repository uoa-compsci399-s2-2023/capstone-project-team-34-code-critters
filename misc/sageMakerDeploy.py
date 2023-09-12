

import boto3
import re

import os
import numpy as np
import pandas as pd
import sagemaker as sage

boto_session = boto3.Session(profile_name="test-sagemaker")
session = sage.Session(boto_session=boto_session)
from sagemaker.tensorflow import TensorFlowModel

model = TensorFlowModel(model_data='s3://model-storage-bucket/trupanea_v2.tar.gz', role='MySageMakerRole', framework_version='2.13.0')

predictor = model.deploy(initial_instance_count=1, instance_type='ml.c5.xlarge', endpoint='trupanea-v2')