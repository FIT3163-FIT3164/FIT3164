# import necessary modules from flask
from flask import Flask, Response
import os
import sys

# set up the python path to include the current directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# import the function to generate video frames
from .api.camera import generate_frames

# initialise the flask application
app = Flask(__name__)


# define the route for video streaming
@app.route("/stream")
def video_feed():

    # return a response object that generates video frames
    return Response(
        generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )


# run the application if this script is executed directly
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
