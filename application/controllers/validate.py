from werkzeug.exceptions import HTTPException
from flask import make_response

class NotFoundError(HTTPException):
    def __init__(self, status_code, status_message):
        self.response = make_response(status_code, status_message)

class MissingParameterError(HTTPException):
    def __init__(self, status_code, status_message):
        self.response = make_response(status_message,status_code)

class InvalidParameterError(HTTPException):
    def __init__(self, status_code, status_message):
        self.response = make_response(status_message,status_code)