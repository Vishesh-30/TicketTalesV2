from flask_restful import fields


user = {
    "user_id": fields.Integer,
    "username": fields.String,
    "password": fields.String,
    "email": fields.String,
}

theater = {
    "theater_id": fields.Integer,
    "name": fields.String,
    "capacity": fields.Integer,
    "address": fields.String,
    "city": fields.String,
    "state": fields.String,
    "admin_username": fields.String,
}

show = {
    "show_id": fields.Integer,
    "name": fields.String,
    "date": fields.String,
    "start_time": fields.String,
    "end_time": fields.String,
    "tags": fields.String,
    "rating": fields.Float,
    "price": fields.Float,
    "booked_seats": fields.Integer,
    "theater_id": fields.Integer,
    "admin_username": fields.String,
}

booking = {
    "booking_id": fields.Integer,
    "user_username": fields.String,
    "show_id": fields.Integer,
    "show_date": fields.String,
    "show_time": fields.String,
    "seats": fields.String,
    "total_price": fields.Float,
    "show_name": fields.String,
    "theater_name": fields.String,
}


search = {
    "show_id": fields.Integer,
    "name": fields.String,
    "date": fields.String,
    "start_time": fields.String,
    "end_time": fields.String,
    "tags": fields.String,
    "rating": fields.Float,
    "price": fields.Float,
    "booked_seats": fields.Integer,
    "theater_id": fields.Integer,
    "admin_username": fields.String,
    "theater_id": fields.Integer,
    "name": fields.String,
    "capacity": fields.Integer,
    "address": fields.String,
    "city": fields.String,
    "state": fields.String,
    "admin_username": fields.String,
}