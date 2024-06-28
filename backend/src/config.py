# import the realsense wrapper library
import pyrealsense2 as rs

# define depth stream configuration
DEPTH_WIDTH = 1280
DEPTH_HEIGHT = 720
DEPTH_FORMAT = rs.format.z16
DEPTH_FPS = 30

# define color stream configuration
COLOR_WIDTH = 1280
COLOR_HEIGHT = 720
COLOR_FORMAT = rs.format.bgr8
COLOR_FPS = 30
