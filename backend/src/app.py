from flask import Flask, Response
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from .api.camera import generate_frames

app = Flask(__name__)


@app.route("/stream")
def video_feed():
    return Response(
        generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
