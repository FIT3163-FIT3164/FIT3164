from flask import Flask, request, jsonify
from transformers import AutoModelForImageClassification, AutoFeatureExtractor
import torch
from PIL import Image
import io
import base64

app = Flask(__name__)

# Replace with your actual model name
model_name = "manthi01/asl_alphabet_image_detection"

# Load the model and feature extractor
model = AutoModelForImageClassification.from_pretrained(model_name)
extractor = AutoFeatureExtractor.from_pretrained(model_name)

# Set the model to evaluation mode
model.eval()
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    image_base64 = data['image']
    image_bytes = base64.b64decode(image_base64)
    image = Image.open(io.BytesIO(image_bytes))

    # Preprocess the image
    inputs = extractor(images=image, return_tensors="pt")
    inputs = {key: value.to(device) for key, value in inputs.items()}

    # Perform inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()

    return jsonify({'predicted_class': predicted_class})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
