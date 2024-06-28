# import necessary modules from flask
from flask import Blueprint, jsonify

# create a blueprint for the api
api_bp = Blueprint("api", __name__)


# define a route for testing
@api_bp.route("/test", methods=["GET"])
def test_api():
    # return a json response indicating the api is working
    return jsonify({"message": "API is working!"})
