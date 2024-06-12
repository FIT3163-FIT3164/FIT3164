from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__)

@api_bp.route('/test', methods=['GET'])
def test_api():
    return jsonify({"message": "API is working!"})
