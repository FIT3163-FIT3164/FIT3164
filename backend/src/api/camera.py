# import necessary libraries
import pyrealsense2 as rs
import numpy as np
import cv2
import threading
import time

# import configuration settings
from config import (
    DEPTH_WIDTH,
    DEPTH_HEIGHT,
    DEPTH_FORMAT,
    DEPTH_FPS,
    COLOR_WIDTH,
    COLOR_HEIGHT,
    COLOR_FORMAT,
    COLOR_FPS,
)


# realsense camera class
class RealsenseCamera:
    def __init__(self):

        # initialise the realsense pipeline and configuration

        self.pipeline = rs.pipeline()
        self.config = rs.config()

        # configure the depth and colour streams
        self.config.enable_stream(
            rs.stream.depth, DEPTH_WIDTH, DEPTH_HEIGHT, DEPTH_FORMAT, DEPTH_FPS
        )
        self.config.enable_stream(
            rs.stream.color, COLOR_WIDTH, COLOR_HEIGHT, COLOR_FORMAT, COLOR_FPS
        )

        # start the pipeline
        self.profile = self.pipeline.start(self.config)

        # get the depth scale
        depth_sensor = self.profile.get_device().first_depth_sensor()
        self.depth_scale = depth_sensor.get_depth_scale()

        # create an align object to align depth frames to color frames
        self.align = rs.align(rs.stream.color)

        # initialise frame variables
        self.depth_frame = None
        self.color_frame = None
        self.depth_image = None
        self.color_image = None

        # set up threading for frame updates
        self.thread = threading.Thread(target=self.update_frames)
        self.thread_running = True

        # initialise variables for fps calculation
        self.frame_count = 0
        self.start_time = time.time()

    def start(self):
        # start the update thread
        self.thread.start()
        time.sleep(1)

    def stop(self):
        # stop the update thread and pipeline
        self.thread_running = False
        self.thread.join()
        self.pipeline.stop()

    def update_frames(self):
        # continuously update frames while the thread is running
        while self.thread_running:

            # wait for a coherent pair of frames: depth and color
            frames = self.pipeline.wait_for_frames()
            aligned_frames = self.align.process(frames)

            # get aligned frames
            self.depth_frame = aligned_frames.get_depth_frame()
            self.color_frame = aligned_frames.get_color_frame()

            # continue if frames are not valid
            if not self.depth_frame or not self.color_frame:
                continue

            # convert images to numpy arrays
            self.color_image = np.asanyarray(self.color_frame.get_data())
            self.depth_image = cv2.applyColorMap(
                cv2.convertScaleAbs(
                    np.asanyarray(self.depth_frame.get_data()), alpha=0.03
                ),
                cv2.COLORMAP_JET,
            )

            # increment frame count
            self.frame_count += 1

    def get_color_frame(self):
        # return the latest color frame
        return self.color_image

    def get_depth_frame(self):
        # return the latest depth frame
        return self.depth_image

    def get_fps(self):
        # calculate and return the frames per second
        elapsed_time = time.time() - self.start_time
        fps = self.frame_count / elapsed_time
        return fps

    def get_resolution(self):
        # return the resolution of the color frame
        if self.color_frame:
            return self.color_frame.get_width(), self.color_frame.get_height()
        return None


# generate frames for streaming
def generate_frames():

    # initialise and start the camera
    camera = RealsenseCamera()
    camera.start()

    try:
        while True:
            # get the latest color frame
            color_frame = camera.get_color_frame()

            # skip iteration if frame is not available
            if color_frame is None:
                continue

            # get fps and resolution
            fps = camera.get_fps()
            resolution = camera.get_resolution()

            # add fps text to the frame
            cv2.putText(
                color_frame,
                f"FPS: {fps:.2f}",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
            )
            # add resolution text to the frame if available
            if resolution:
                cv2.putText(
                    color_frame,
                    f"Resolution: {resolution[0]}x{resolution[1]}",
                    (10, 60),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0, 255, 0),
                    2,
                )

            # encode the frame in JPEG format
            ret, jpeg = cv2.imencode(".jpg", color_frame)

            # yield the frame in byte format
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + jpeg.tobytes() + b"\r\n"
            )

    finally:
        # ensure camera is stopped when function exits
        camera.stop()
