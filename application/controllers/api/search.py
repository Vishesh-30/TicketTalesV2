from flask import request, session, redirect, url_for, render_template, flash, jsonify
from flask_restful import Resource, Api, reqparse
from flask_restful import marshal_with
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity



from application.models import *
from application.marshal import *
from application.controllers.validate import *
from app import app, api, db, login_manager




class SearchAPI(Resource):
        
    # @jwt_required()
    @marshal_with(search)
    def get(self, search = None):
        print(search)
        result = []
        if search:
            shows = Show.query.filter(Show.name.like('%'+search+'%')).all()
            if shows:
                result =  shows
            # else:
            #     result =  {'message': 'Show not found'}, 404
        print(result)
            
        if search:
            theaters = Theater.query.filter(Theater.name.like('%'+search+'%')).all()
            print(theaters)
            if theaters:
                print(True)
                result = theaters
            # else:
            #     result =  {'message': 'Nothing Found'}, 404
        if search:
            location = Theater.query.filter(Theater.city.like('%'+search+'%')).all()
            print(location)
            if location:
                print(True)
                result = location

        if search:
            tags = Show.query.filter(Show.tags.like('%'+search+'%')).all()
            print(tags)
            if tags:
                print(True)
                result = tags

        print(result)
        return result, 200


api.add_resource(SearchAPI, '/api/search/<string:search>')
