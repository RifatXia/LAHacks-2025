import os
import numpy as np
import cv2
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image as keras_image
from numpy.linalg import norm

DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")

# Load ResNet50 model (excluding top layer for feature extraction)
resnet_model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

def allowed_file(filename):
    return filename.lower().endswith(('.png', '.jpg', '.jpeg'))

def get_name_from_filename(filename):
    return os.path.splitext(filename)[0]

def extract_features(img):
    # img: OpenCV image (BGR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_resized = cv2.resize(img_rgb, (224, 224))
    x = keras_image.img_to_array(img_resized)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    features = resnet_model.predict(x)
    return features.flatten()

def cosine_similarity(vec1, vec2):
    if norm(vec1) == 0 or norm(vec2) == 0:
        return 0.0
    return np.dot(vec1, vec2) / (norm(vec1) * norm(vec2))

def find_most_similar(image_bytes):
    # Convert uploaded image bytes to OpenCV image
    file_bytes = np.frombuffer(image_bytes, np.uint8)
    uploaded_img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    if uploaded_img is None:
        return {"error": "Invalid image file."}

    uploaded_features = extract_features(uploaded_img)

    max_similarity = -1
    best_match_name = None

    for filename in os.listdir(DATASET_DIR):
        if not allowed_file(filename):
            continue
        img_path = os.path.join(DATASET_DIR, filename)
        dataset_img = cv2.imread(img_path)
        if dataset_img is None:
            continue
        dataset_features = extract_features(dataset_img)
        similarity = cosine_similarity(uploaded_features, dataset_features)
        if similarity > max_similarity:
            max_similarity = similarity
            best_match_name = get_name_from_filename(filename)

    if best_match_name is None:
        return {"error": "No valid images in dataset."}
    return {"name": best_match_name, "similarity": float(max_similarity)} 