import os
import pickle
from deepface import DeepFace
from scipy.spatial.distance import cosine, euclidean
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import time

# --- Configuration ---
# ---> ** SET THESE PATHS ** <---
PKL_FILE_PATH = "known_face_embeddings.pkl" # Path to your saved embeddings file
TEST_IMAGE_PATH = "test3.jpg" # Image to test recognition on

# ---> ** CHOOSE MODEL & SETTINGS (MUST MATCH PKL CREATION!) ** <---
# These MUST be the same settings used when creating the .pkl file with enroll_faces.py
MODEL_NAME = "VGG-Face"      # Or "Facenet", "ArcFace", etc.
DETECTOR_BACKEND = "mtcnn"   # Or "opencv", "ssd", "dlib", "retinaface"
DISTANCE_METRIC = "cosine"   # Or "euclidean", "euclidean_l2"

# ---> ** TUNE THIS THRESHOLD ** <---
RECOGNITION_THRESHOLD = 0.3  # Adjust based on testing (Lower for cosine = stricter)

# --- Optional Visualization ---
DRAW_RESULTS = True
OUTPUT_IMAGE_PATH = "test_pkl_recognition_output.jpg"
try:
    FONT = ImageFont.truetype("arial.ttf", 15)
except IOError:
    FONT = ImageFont.load_default()

# --- Function to Calculate Distance ---
# (Same as before)
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

# --- Function to Find Best Match in Database ---
def find_best_match(target_embedding, known_embeddings, known_names, metric, threshold):
    """Compares target embedding to all known embeddings and returns the best match."""
    min_dist = float('inf')
    best_match_name = "Unknown"
    best_match_index = -1

    if known_embeddings.size == 0: # Handle empty database case
        return best_match_name, min_dist

    # Calculate distances to all known embeddings
    distances = []
    for i, known_emb in enumerate(known_embeddings):
        dist = calculate_distance(target_embedding, known_emb, metric)
        distances.append(dist)
        if dist < min_dist:
            min_dist = dist
            best_match_index = i

    # Check if the minimum distance is below the threshold
    if best_match_index != -1 and min_dist < threshold:
        best_match_name = known_names[best_match_index]

    return best_match_name, min_dist

# --- Main Test Logic ---
if __name__ == "__main__":
    # 1. Check if files exist
    if not os.path.exists(PKL_FILE_PATH):
        print(f"Error: Embeddings file not found at '{PKL_FILE_PATH}'")
        print("Please run the 'enroll_faces.py' script first.")
        exit()
    if not os.path.exists(TEST_IMAGE_PATH):
        print(f"Error: Test image file not found at '{TEST_IMAGE_PATH}'")
        exit()

    # 2. Load known embeddings from PKL file
    print(f"Loading known face embeddings from: {PKL_FILE_PATH}")
    try:
        with open(PKL_FILE_PATH, "rb") as f:
            known_embeddings_data = pickle.load(f) # List of (name, embedding) tuples
    except Exception as e:
        print(f"Error loading PKL file: {e}")
        exit()

    if not known_embeddings_data:
        print("Error: The PKL file is empty or invalid.")
        exit()

    # Separate names and embeddings
    known_names = [data[0] for data in known_embeddings_data]
    known_embeddings = np.array([data[1] for data in known_embeddings_data])
    print(f"Loaded {len(known_names)} known face embeddings for {len(set(known_names))} unique individuals.")
    print(f"Using Model: {MODEL_NAME}, Detector: {DETECTOR_BACKEND}, Metric: {DISTANCE_METRIC}, Threshold: {RECOGNITION_THRESHOLD}")
    print("-" * 20)


    # 3. Process the test image
    print(f"Processing test image: {TEST_IMAGE_PATH}")
    test_img_pil = None
    draw = None
    if DRAW_RESULTS:
        try:
            test_img_pil = Image.open(TEST_IMAGE_PATH).convert("RGB")
            draw = ImageDraw.Draw(test_img_pil)
        except Exception as e:
            print(f"Error opening test image: {e}")
            exit()

    try:
        start_time = time.time()
        # Find all faces in the test image
        extracted_faces = DeepFace.extract_faces(
            img_path=TEST_IMAGE_PATH, # Can be path or numpy array
            detector_backend=DETECTOR_BACKEND,
            enforce_detection=False, # Find all faces
            align=True
        )
        end_time = time.time()
        print(f"  -> Face extraction took {end_time - start_time:.2f} seconds.")

        if not extracted_faces:
            print("  -> No faces detected in the test image.")
            if DRAW_RESULTS and test_img_pil:
                 test_img_pil.save(OUTPUT_IMAGE_PATH)
                 print(f"Saved unmodified image to {OUTPUT_IMAGE_PATH}")
            exit()

        print(f"  -> Detected {len(extracted_faces)} face(s) in the test image.")
        print("-" * 20)

        # 4. Compare each detected face to the known embeddings database
        for i, face_data in enumerate(extracted_faces):
            print(f"Processing detected face #{i+1}")
            x, y, w, h = face_data['facial_area']['x'], face_data['facial_area']['y'], face_data['facial_area']['w'], face_data['facial_area']['h']
            detected_face_img = face_data['face'] # Cropped face (numpy array)

            try:
                start_time_rep = time.time()
                # Get embedding for this specific detected face
                # Use the *same* model name as used for PKL creation
                embedding_objs = DeepFace.represent(
                    img_path=detected_face_img, # Use the cropped face data
                    model_name=MODEL_NAME,
                    detector_backend='skip', # IMPORTANT: Skip detection
                    enforce_detection=False,
                    align=False # Already aligned
                )
                end_time_rep = time.time()

                if not embedding_objs:
                    print("    -> Error: Could not get embedding for this detected face.")
                    continue

                test_embedding = np.array(embedding_objs[0]['embedding'])
                print(f"    -> Test embedding generated in {end_time_rep - start_time_rep:.2f} seconds.")

                # Find the best match in the database
                start_time_match = time.time()
                name, min_distance = find_best_match(
                    test_embedding,
                    known_embeddings,
                    known_names,
                    DISTANCE_METRIC,
                    RECOGNITION_THRESHOLD
                )
                end_time_match = time.time()
                print(f"    -> Database matching took {end_time_match - start_time_match:.4f} seconds.")
                print(f"    -> Best Match: {name} | Min Distance ({DISTANCE_METRIC}): {min_distance:.4f} | Threshold: {RECOGNITION_THRESHOLD}")

                # Draw on image if enabled
                if DRAW_RESULTS and draw:
                    box_color = "lime" if name != "Unknown" else "red"
                    draw.rectangle([(x, y), (x+w, y+h)], outline=box_color, width=3)
                    label = f"{name}\nDist: {min_distance:.3f}"
                    text_pos = (x, y - 30) if y - 30 > 0 else (x, y + 5)
                    draw.text(text_pos, label, fill=box_color, font=FONT)

            except Exception as e_inner:
                 print(f"    -> Error processing detected face #{i+1}: {e_inner}")
                 if DRAW_RESULTS and draw:
                      draw.rectangle([(x, y), (x+w, y+h)], outline="orange", width=2)
                      draw.text((x,y-10), "Error", fill="orange", font=FONT)

    except Exception as e_outer:
        print(f"Error during test image face detection/extraction: {e_outer}")

    # 5. Save the output image if drawing was enabled
    if DRAW_RESULTS and test_img_pil:
        test_img_pil.save(OUTPUT_IMAGE_PATH)
        print("-" * 20)
        print(f"Annotated image saved to: {OUTPUT_IMAGE_PATH}")

    print("Test finished.")