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

# Load the model and processor for ASL recognition
model_name = "JCYap28/asl_recognition"
model = AutoModelForImageClassification.from_pretrained(model_name)
processor = ViTImageProcessor.from_pretrained(model_name)

# Set model to evaluation mode and move to GPU if available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)
model.eval()

# Setup MediaPipe for hand detection
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils  # Optional for debugging or visualization

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,  # Detect up to 2 hands
    min_detection_confidence=0.5,  # Confidence for more reliable detection
    min_tracking_confidence=0.5    # Tracking confidence
)

@app.route('/predict', methods=['POST'])
def predict():
    if 'frame' not in request.files:
        print("No frame provided in request")
        return jsonify({"error": "No frame provided"}), 400

    # Reading the frame
    file = request.files['frame'].read()
    image = Image.open(io.BytesIO(file))
    frame = np.array(image)
    print(f"Received frame of size: {frame.shape}")

    # Convert frame to RGB as required by MediaPipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Perform hand detection using MediaPipe
    results = hands.process(rgb_frame)

    if not results.multi_hand_landmarks:
        # No hand detected, return response
        print("No hand detected in the frame")
        return jsonify({"prediction": "No hand detected"})

    print("Hand detected, processing landmarks...")

    # Process detected hands and crop region of interest
    hand_landmarks = results.multi_hand_landmarks[0]
    h, w, _ = rgb_frame.shape
    x_min, y_min = w, h
    x_max, y_max = 0, 0

    # Store the landmarks to send to the front-end
    landmark_coords = []

    # Calculate bounding box around the hand and store landmarks
    for landmark in hand_landmarks.landmark:
        x, y = int(landmark.x * w), int(landmark.y * h)
        landmark_coords.append({"x": x, "y": y})
        x_min, y_min = min(x_min, x), min(y_min, y)
        x_max, y_max = max(x_max, x), max(y_max, y)

    print(f"Hand bounding box: ({x_min}, {y_min}), ({x_max}, {y_max})")

    # Add padding to the bounding box
    padding = 20
    x_min = max(x_min - padding, 0)
    y_min = max(y_min - padding, 0)
    x_max = min(x_max + padding, w)
    y_max = min(y_max + padding, h)

    # Crop the image to the hand bounding box
    hand_image = rgb_frame[y_min:y_max, x_min:x_max]

    if hand_image.size == 0:
        print("Cropped hand image is empty")
        return jsonify({"prediction": "No hand detected"})

    print(f"Cropped hand image size: {hand_image.shape}")

    # Preprocess the cropped hand image using the ViT processor
    inputs = processor(images=hand_image, return_tensors="pt").to(device)

    # Perform the prediction
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()

    # Check if the predicted class corresponds to a valid alphabet letter (A-Z)
    if 0 <= predicted_class_idx <= 25:
        predicted_letter = chr(predicted_class_idx + ord('A'))
    else:
        predicted_letter = "Unknown"

    # Log the predicted letter for debugging
    print(f"Predicted letter: {predicted_letter}")

    # Return the predicted letter, bounding box, and hand landmarks as JSON response
    return jsonify({
        "prediction": predicted_letter,
        "landmarks": landmark_coords,
        "boundingBox": {"x_min": x_min, "y_min": y_min, "x_max": x_max, "y_max": y_max}
    })

if __name__ == '__main__':
    app.run(debug=True)
