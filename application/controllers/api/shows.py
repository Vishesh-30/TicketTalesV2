from flask import request, session, redirect, url_for, render_template, flash, jsonify
from flask_restful import Resource, Api, reqparse
from flask_restful import marshal_with
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity



from application.models import *
from application.marshal import *
from application.controllers.validate import *
from app import app, api, db, login_manager, cache




class ShowAPI(Resource):
    
        @jwt_required()
        @marshal_with(show)
        @cache.memoize(timeout=60)
        def get(self, show_id = None, theater_id=None,):
            # current_user = get_jwt_identity()
            if theater_id is not None:
                if show_id is not None:
                    show = Show.query.get(show_id)
                    if show is not None:
                        return show, 200
                    else:
                        return {'message': 'Show not found'}, 404
                else:
                    shows = Show.query.filter_by(theater_id = theater_id).all()
                    return shows, 200
            
            else:
                shows = Show.query.all()
                return shows, 200
            
    
        @jwt_required()
        @marshal_with(show)
        @cache.memoize(timeout=60)
        def post(self):
            admin  = Admin.query.filter_by(username=get_jwt_identity()).first()
            if admin is not None:
                data = request.get_json()
                name = data.get('name')
                date = data.get('date')
                start_time = data.get('start_time')
                end_time = data.get('end_time')
                tags = data.get('tags')
                rating = data.get('rating')
                price = data.get('price')
                theater_id = data.get('theater_id')

                if not name or not start_time or not end_time or not date or not tags or not rating or not price or not theater_id:
                    raise MissingParameterError(400, "All fields are required")
                
                existing_show = Show.query.filter_by(name=name).first()
                if existing_show is not None:
                    return {'message': 'Show already exists'}, 409

                theater = Theater.query.get(theater_id)
                if theater is None:
                    return {'message': 'Theater does not exist'}, 404

                existing_show_at_time = Show.query.filter_by(theater_id=theater_id, date=date, start_time=start_time).first()
                if existing_show_at_time is not None:
                    return {'message': f'Show already exists at this time, theater is available after {existing_show_at_time.end_time}'}, 409

                
                show = Show(name=name, date=date, start_time=start_time, end_time=end_time, tags=tags, rating=rating, price=price, booked_seats=0, theater_id=theater_id, admin_username=admin.username)
                db.session.add(show)
                db.session.commit()
                return show, 201
                
            else:
                return {'message': 'Admin not found'}, 404
            
    
        @jwt_required()
        @marshal_with(show)
        @cache.memoize(timeout=60)
        def put(self, show_id=None):
            admin  = Admin.query.filter_by(username=get_jwt_identity()).first()
            if admin is not None:
                if show_id is not None:
                    show = Show.query.get(show_id)
                    if show is not None:
                        data = request.get_json()
                        name = data.get('name')
                        start_time = data.get('start_time')
                        end_time = data.get('end_time')
                        date = data.get('date')
                        tags = data.get('tags')
                        rating = data.get('rating')
                        price = data.get('price')
                        if not name:
                            raise MissingParameterError(400, "Show name is required")
                        if not start_time:
                            raise MissingParameterError(400, "Show start time is required")
                        if not end_time:
                            raise MissingParameterError(400, "Show end time is required")
                        if not date:
                            raise MissingParameterError(400, "Show date is required")
                        if not tags:
                            raise MissingParameterError(400, "Show tags are required")
                        if not rating:
                            raise MissingParameterError(400, "Show rating is required")
                        if not price:
                            raise MissingParameterError(400, "Show price is required")
                        else:
                            
                            show.name = name
                            show.start_time = start_time
                            show.end_time = end_time
                            show.date = date
                            show.tags = tags
                            show.rating = rating
                            show.price = price
                            db.session.commit()
                            return show, 200
            

        @jwt_required()
        def delete(self, show_id=None):
            admin  = Admin.query.filter_by(username=get_jwt_identity()).first()
            if admin is not None:
                if show_id is not None:
                    show = Show.query.get(show_id)
                    if show is not None:
                        db.session.delete(show)
                        db.session.commit()
                        return {'message': 'Show deleted'}, 200
                    else:
                        return {'message': 'Show not found'}, 404
                else:
                    return {'message': 'Show id is required'}, 400
            else:
                return {'message': 'You are not authorized to delete a show'}, 401
            




api.add_resource(ShowAPI, '/api/shows', '/api/shows/<int:theater_id>', '/api/shows/<int:theater_id>/<int:show_id>', '/api/shows/<int:show_id>', '/api/shows/delete/<int:show_id>', '/api/shows/update/<int:show_id>')
