# app.py (Flask)
import torch
from transformers import AutoModelForImageClassification, ViTImageProcessor
import cv2
import mediapipe as mp
import numpy as np
from PIL import Image
import io
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model and processor
model_name = "JCYap28/asl_recognition"
model = AutoModelForImageClassification.from_pretrained(model_name)
processor = ViTImageProcessor.from_pretrained(model_name)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)
model.eval()

# Hand detection setup using MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.3, min_tracking_confidence=0.3)

@app.route('/predict', methods=['POST'])
def predict():
    if 'frame' not in request.files:
        return jsonify({"error": "No frame provided"}), 400

    file = request.files['frame'].read()
    image = Image.open(io.BytesIO(file))
    frame = np.array(image)

    # Log the size of the received frame
    print(f"Received frame of size: {frame.shape}")

    # Convert frame to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Hand detection using MediaPipe
    results = hands.process(rgb_frame)
    
    if not results.multi_hand_landmarks:
        print("No hand detected in the frame")
        return jsonify({"prediction": "No hand detected"})

    # Log that hands were detected
    print("Hand detected, processing landmarks...")

    # Get hand landmarks and bounding box
    hand_landmarks = results.multi_hand_landmarks[0]
    h, w, _ = frame.shape
    x_min, y_min = w, h
    x_max, y_max = 0, 0

    for landmark in hand_landmarks.landmark:
        x, y = int(landmark.x * w), int(landmark.y * h)
        x_min, y_min = min(x_min, x), min(y_min, y)
        x_max, y_max = max(x_max, x), max(y_max, y)

    # Log the bounding box coordinates
    print(f"Hand bounding box: ({x_min}, {y_min}), ({x_max}, {y_max})")

    # Crop the hand region
    hand_image = rgb_frame[y_min:y_max, x_min:x_max]
    
    if hand_image.size == 0:
        print("Cropped hand image is empty")
        return jsonify({"prediction": "No hand detected"})

    # Log the size of the cropped hand image
    print(f"Cropped hand image size: {hand_image.shape}")

    # Preprocess the hand image and pass it to the model
    inputs = processor(images=hand_image, return_tensors="pt").to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()

    # Convert predicted class index to corresponding letter
    predicted_letter = chr(predicted_class_idx + ord('A'))
    
    # Log the predicted letter
    print(f"Predicted letter: {predicted_letter}")

    return jsonify({"prediction": predicted_letter})



if __name__ == '__main__':
    app.run(debug=True)
