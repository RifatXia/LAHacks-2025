import os
import pickle
from deepface import DeepFace
from scipy.spatial.distance import cosine, euclidean
import numpy as np
from PIL import Image
import io

# --- Configuration ---
PKL_FILE_PATH = "known_face_embeddings.pkl"
MODEL_NAME = "VGG-Face"
DETECTOR_BACKEND = "mtcnn"
DISTANCE_METRIC = "cosine"
RECOGNITION_THRESHOLD = 0.3

# --- Load known embeddings at import time ---
if not os.path.exists(PKL_FILE_PATH):
    raise RuntimeError(f"Embeddings file not found at '{PKL_FILE_PATH}'")

with open(PKL_FILE_PATH, "rb") as f:
    known_embeddings_data = pickle.load(f)

if not known_embeddings_data:
    raise RuntimeError("The PKL file is empty or invalid.")

known_names = [data[0] for data in known_embeddings_data]
known_embeddings = np.array([data[1] for data in known_embeddings_data])

def calculate_distance(embedding1, embedding2, metric):
    if metric == 'cosine':
        return cosine(embedding1, embedding2)
    elif metric == 'euclidean':
        return euclidean(embedding1, embedding2)
    elif metric == 'euclidean_l2':
        embedding1_norm = embedding1 / np.linalg.norm(embedding1)
        embedding2_norm = embedding2 / np.linalg.norm(embedding2)
        return euclidean(embedding1_norm, embedding2_norm)
    else:
        raise ValueError(f"Unsupported distance metric: {metric}")

def find_best_match(target_embedding, known_embeddings, known_names, metric, threshold):
    min_dist = float('inf')
    best_match_name = "Unknown"
    best_match_index = -1

    if known_embeddings.size == 0:
        return best_match_name, min_dist

    for i, known_emb in enumerate(known_embeddings):
        dist = calculate_distance(target_embedding, known_emb, metric)
        if dist < min_dist:
            min_dist = dist
            best_match_index = i

    if best_match_index != -1 and min_dist < threshold:
        best_match_name = known_names[best_match_index]

    return best_match_name, min_dist

def recognize_face_from_bytes(image_bytes):
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    extracted_faces = DeepFace.extract_faces(
        img_path=np.array(pil_image),
        detector_backend=DETECTOR_BACKEND,
        enforce_detection=False,
        align=True
    )
    if not extracted_faces:
        return {"label": "Unknown", "distance": None, "message": "No face detected."}

    face_data = extracted_faces[0]
    detected_face_img = face_data['face']

    embedding_objs = DeepFace.represent(
        img_path=detected_face_img,
        model_name=MODEL_NAME,
        detector_backend='skip',
        enforce_detection=False,
        align=False
    )
    if not embedding_objs:
        return {"label": "Unknown", "distance": None, "message": "Could not get embedding."}
    test_embedding = np.array(embedding_objs[0]['embedding'])

    name, min_distance = find_best_match(
        test_embedding,
        known_embeddings,
        known_names,
        DISTANCE_METRIC,
        RECOGNITION_THRESHOLD
    )
    return {"label": name, "distance": float(min_distance)} 