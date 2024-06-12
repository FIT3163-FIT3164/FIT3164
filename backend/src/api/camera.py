# camera.py

import pyrealsense2 as rs
import numpy as np
import cv2
import threading
import time

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


class RealsenseCamera:
    def __init__(self):
        self.pipeline = rs.pipeline()
        self.config = rs.config()

        self.config.enable_stream(
            rs.stream.depth, DEPTH_WIDTH, DEPTH_HEIGHT, DEPTH_FORMAT, DEPTH_FPS
        )
        self.config.enable_stream(
            rs.stream.color, COLOR_WIDTH, COLOR_HEIGHT, COLOR_FORMAT, COLOR_FPS
        )

        self.profile = self.pipeline.start(self.config)

        depth_sensor = self.profile.get_device().first_depth_sensor()
        self.depth_scale = depth_sensor.get_depth_scale()

        self.align = rs.align(rs.stream.color)

        self.depth_frame = None
        self.color_frame = None
        self.depth_image = None
        self.color_image = None

        self.thread = threading.Thread(target=self.update_frames)
        self.thread_running = True

        self.frame_count = 0
        self.start_time = time.time()

    def start(self):
        self.thread.start()
        time.sleep(1)

    def stop(self):
        self.thread_running = False
        self.thread.join()
        self.pipeline.stop()

    def update_frames(self):
        while self.thread_running:
            frames = self.pipeline.wait_for_frames()
            aligned_frames = self.align.process(frames)

            self.depth_frame = aligned_frames.get_depth_frame()
            self.color_frame = aligned_frames.get_color_frame()

            if not self.depth_frame or not self.color_frame:
                continue

            self.color_image = np.asanyarray(self.color_frame.get_data())
            self.depth_image = cv2.applyColorMap(
                cv2.convertScaleAbs(
                    np.asanyarray(self.depth_frame.get_data()), alpha=0.03
                ),
                cv2.COLORMAP_JET,
            )

            self.frame_count += 1

    def get_color_frame(self):
        return self.color_image

    def get_depth_frame(self):
        return self.depth_image

    def get_fps(self):
        elapsed_time = time.time() - self.start_time
        fps = self.frame_count / elapsed_time
        return fps

    def get_resolution(self):
        if self.color_frame:
            return self.color_frame.get_width(), self.color_frame.get_height()
        return None


def generate_frames():
    camera = RealsenseCamera()
    camera.start()

    try:
        while True:
            color_frame = camera.get_color_frame()

            if color_frame is None:
                continue

            fps = camera.get_fps()
            resolution = camera.get_resolution()

            cv2.putText(
                color_frame,
                f"FPS: {fps:.2f}",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
            )
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

            ret, jpeg = cv2.imencode(".jpg", color_frame)

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + jpeg.tobytes() + b"\r\n"
            )

    finally:
        camera.stop()
