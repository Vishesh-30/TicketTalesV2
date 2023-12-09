from flask import request, session, redirect, url_for, render_template, flash, jsonify
from flask_restful import Resource, Api, reqparse
from flask_restful import marshal_with
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity



from application.models import *
from application.marshal import *
from application.controllers.validate import *
from app import app, api, db, login_manager, cache




class BookingAPI(Resource):
    
        @jwt_required()
        @marshal_with(booking)
        @cache.memoize(timeout=60)
        def get(self, booking_id=None, username=None):
            current_user = get_jwt_identity()
            
            if booking_id is not None:
                # Return a single booking by booking_id
                booking = Booking.query.get(booking_id)
                if booking is not None:
                    return booking, 201
                else:
                    return {'message': 'Booking not found'}, 404
            elif username is not None:
                # Return all bookings for a specific user by username
                bookings = Booking.query.filter_by(user_username=username).all()
                return bookings, 201
            else:
                # Return all bookings (for admin or other purposes)
                bookings = Booking.query.all()
                return bookings, 201
            
            

        @jwt_required()
        @marshal_with(booking)
        @cache.memoize(timeout=60)
        def post(self):
            user = User.query.filter_by(username=get_jwt_identity()).first()
            if user is not None:
                data = request.get_json()
                user_username = data.get('user_username')
                show_id = data.get('show_id')
                show_date = data.get('show_date')
                show_time = data.get('show_time')
                seats = data.get('seats')
                total_price = data.get('total_price')
                show_name = data.get('show_name')
                theater_name = data.get('theater_name')
                available_seats = data.get('available_seats')

                if available_seats < seats:
                    return {'message': 'Not enough seats'}, 400

                if not user_username or not show_id or not show_date or not show_time or not seats or not total_price or not show_name or not theater_name:
                    raise MissingParameterError(400, "All fields are required")
                if user_username != user.username:
                    return {'message': 'Invalid user'}, 400
                if seats < 1:
                    return {'message': 'Invalid number of seats'}, 400
                else:
                    # Retrieve the specific show by show_id
                    show = Show.query.filter_by(show_id=show_id).first()

                    if show is None:
                        return {'message': 'Show not found'}, 404

                    # Update booked seats for the show
                    show.booked_seats += seats

                    # Create a booking record
                    booking = Booking(
                        user_username=user_username,
                        show_id=show_id,
                        show_date=show_date,
                        show_time=show_time,
                        seats=seats,
                        total_price=total_price,
                        show_name=show_name,
                        theater_name=theater_name
                    )

                    db.session.add(booking)
                    db.session.commit()

                    return booking, 201
            else:
                return {'message': 'User not found'}, 404



        @jwt_required()
        @marshal_with(booking)
        @cache.memoize(timeout=60)
        def put(self, booking_id=None):
            user  = User.query.filter_by(username=get_jwt_identity()).first()
            if user is not None:
                data = request.get_json()
                user_username = data.get('username')
                show_id = data.get('show_id')
                seats = data.get('seats')
                total_price = data.get('total_price')
                show_name = data.get('show_name')
                theater_name = data.get('theater_name')


                if not user_username or not show_id or not seats or not total_price or not show_name or not theater_name:
                    raise MissingParameterError(400, "All fields are required")
                if user_username != user.username:
                    return {'message': 'Invalid user'}, 400
                if seats < 1:
                    return {'message': 'Invalid number of seats'}, 400
                existing_booking = Booking.query.filter_by(user_username=user_username, show_id=show_id).first()
                if existing_booking is not None:
                    existing_booking.seats = seats
                    existing_booking.total_price = total_price
                    existing_booking.show_name = show_name
                    existing_booking.theater_name = theater_name
                    db.session.commit()
                    return existing_booking, 200
                else:
                    return {'message': 'Booking does not exist'}, 404
                
            else:
                return {'message': 'User not found'}, 404
            
        @jwt_required()
        @marshal_with(booking)
        def delete(self, booking_id=None):
            user  = User.query.filter_by(username=get_jwt_identity()).first()
            if user is not None:
                if booking_id is not None:
                    booking = Booking.query.filter_by(booking_id=booking_id).first()
                    if booking is not None:
                        show = Show.query.filter_by(show_id=booking.show_id).first()
                        show.booked_seats -= booking.seats
                        db.session.delete(booking)
                        db.session.commit()
                        return {'message': 'Booking deleted successfully'}, 200
                    else:
                        return {'message': 'Booking not found'}, 404
                else:
                    return {'message': 'Booking id is required'}, 400
            else:
                return {'message': 'User not found'}, 404




api.add_resource(BookingAPI, '/api/booking', '/api/booking/<int:booking_id>', '/api/booking/<int:booking_id>/<string:user_username>', '/api/booking/<string:username>')