from flask import request, session, redirect, url_for, render_template, flash, jsonify
from flask_restful import Resource, Api, reqparse
from flask_restful import marshal_with
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity



from application.models import *
from application.marshal import *
from application.controllers.validate import *
from app import app, api, db, login_manager, cache
from application.tasks import theater_pdf, theater_csv, add

class TheaterAPI(Resource):

    @jwt_required()
    @marshal_with(theater)
    @cache.memoize(timeout=60)
    def get(self, theater_id=None):
        current_user = get_jwt_identity()
        if theater_id is not None:
            theater = Theater.query.get(theater_id)
            if theater is not None:
                return theater, 200
            else:
                return {'message': 'Theater not found'}, 404
        
        else:
            theaters = Theater.query.all()
            return theaters, 200
        
        

    @jwt_required()
    @marshal_with(theater)
    @cache.memoize(timeout=60)
    def post(self):
        admin  = Admin.query.filter_by(username=get_jwt_identity()).first()
        if admin is not None:
            data = request.get_json()
            name = data.get('name')
            capacity = data.get('capacity')
            address = data.get('address')
            city = data.get('city')
            state = data.get('state')
            if not name:
                raise MissingParameterError(400, "Theater name is required")
            if not capacity:
                raise MissingParameterError(400, "Theater capacity is required")
            if not address:
                raise MissingParameterError(400, "Theater address is required")
            if not city:
                raise MissingParameterError(400, "Theater city is required")
            if not state:
                raise MissingParameterError(400, "Theater state is required")
            else:
                if Theater.query.filter_by(name=name).first() is not None:
                    return {'message': 'Theater already exists'}, 409
                
                theater = Theater(name=name, capacity=capacity, address=address, city=city, state=state, admin_username=admin.username)
                db.session.add(theater)
                db.session.commit()
                return theater, 201
            
        else:
            return {'message': 'Admin not found'}, 404
        
        
    @jwt_required()
    @marshal_with(theater)
    @cache.memoize(timeout=60)
    def put(self, theater_id=None):
        admin  = Admin.query.filter_by(username=get_jwt_identity()).first()
        if admin is not None:
            data = request.get_json()
            name = data.get('name')
            capacity = data.get('capacity')
            address = data.get('address')
            city = data.get('city')
            state = data.get('state')
            if not name:
                raise MissingParameterError(400, "Theater name is required")
            if not capacity:
                raise MissingParameterError(400, "Theater capacity is required")
            if not address:
                raise MissingParameterError(400, "Theater address is required")
            if not city:
                raise MissingParameterError(400, "Theater city is required")
            if not state:
                raise MissingParameterError(400, "Theater state is required")
            else:
                theater = Theater.query.filter_by(theater_id=theater_id).first()
                if theater is not None:
                    theater.name = name
                    theater.capacity = capacity
                    theater.address = address
                    theater.city = city
                    theater.state = state
                    theater.admin_username = admin.username
                    db.session.commit()
                    return {'message': 'Theater updated successfully'}, 201
                else:
                    return {'message': 'Theater not found'}, 404
        else:
            return {'message': 'Admin not found'}, 404  
        

    @jwt_required()
    @marshal_with(theater)
    def delete(self, theater_id=None):
        admin  = Admin.query.filter_by(username=get_jwt_identity()).first()
        if admin is not None:
            if theater_id is not None:
                theater = Theater.query.filter_by(theater_id = theater_id).first()
                if theater is not None:
                    db.session.delete(theater)
                    db.session.commit()
                    return {'message': 'Theater deleted successfully'}, 200
                else:
                    return {'message': 'Theater not found'}, 404
            else:
                return {'message': 'Theater id is required'}, 400
        else:
            return {'message': 'Admin not found'}, 404
        



api.add_resource(TheaterAPI, '/api/theater', '/api/theater/<int:theater_id>')






#Export Jobs


@app.route('/api/theater/pdf/<int:theater_id>', methods=['GET'])
@jwt_required()
def theater_pdf_download(theater_id):
    admin = Admin.query.filter_by(username=get_jwt_identity()).first()

    if admin is not None:
        theater = Theater.query.get(theater_id)
        if theater is not None:
            pdf = theater_pdf(theater_id)
            return pdf, 200
        else:
            return {'message': 'Theater not found'}, 404
    


@app.route('/api/theater/csv/<int:theater_id>', methods=['GET'])
@jwt_required()
def theater_csv_download(theater_id):
    admin = Admin.query.filter_by(username=get_jwt_identity()).first()

    if admin is not None:
        theater = Theater.query.get(theater_id)
        if theater is not None:
            csv = theater_csv(theater_id)
            return csv, 200
        else:
            return {'message': 'Theater not found'}, 404



