from application.config import db
from flask_login import UserMixin


class User(db.Model, UserMixin):
    username = db.Column(db.String(100), unique=True, primary_key=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)


    def is_user(self):
        user = User.query.filter_by(username=self.username).first()
        if user is not None:
            return True
        else:
            return False
    
    def update_password(self, new_password):
        self.password = new_password
        db.session.commit()

    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'password': self.password
        }



class Admin(db.Model, UserMixin):
    username = db.Column(db.String(100), unique=True, primary_key=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    theater_id = db.relationship('Theater', backref=db.backref('admin', lazy=True))
    show_id = db.relationship('Show', backref=db.backref('admin', lazy=True))

    def is_admin(self):
        admin = Admin.query.filter_by(username=self.username).first()
        if admin is not None:
            return True
        else:
            return False
        
    def update_password(self, new_password):
        self.password = new_password
        db.session.commit()

    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'password': self.password
        }


class Theater(db.Model, UserMixin):
    theater_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    admin_username = db.Column(db.String(100), db.ForeignKey('admin.username'))
    # show = db.relationship('Show', backref=db.backref('theater', lazy=True))


    def to_dict(self):
        return {
            'id': self.theater_id,
            'name': self.name,
            'capacity': self.capacity,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'admin_username': self.admin_username
        }

class Show(db.Model, UserMixin):
    show_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    theater_id = db.Column(db.Integer, db.ForeignKey('theater.theater_id'), nullable=False)
    start_time = db.Column(db.String(100), nullable=False)
    end_time = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(100), nullable=False)
    tags = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    booked_seats = db.Column(db.Integer, default=0, nullable=False)
    admin_username = db.Column(db.String(100), db.ForeignKey('admin.username'), nullable=False)
    # theater = db.relationship('Theater', backref=db.backref('shows', lazy=True))

    def to_dict(self):
        return {
            'id': self.show_id,
            'name': self.name,
            'theater_id': self.theater_id,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'date': self.date,
            'tags': self.tags,
            'rating': self.rating,
            'price': self.price,
            'booked_seats': self.booked_seats,
            'admin_username': self.admin_username
        }
    

class Booking(db.Model, UserMixin):
    booking_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_username = db.Column(db.String(100), db.ForeignKey('user.username'), nullable=False)
    show_id = db.Column(db.Integer, db.ForeignKey('show.show_id'), nullable=False)
    show_date = db.Column(db.String(100), nullable=False)
    show_time = db.Column(db.String(100), nullable=False)
    seats = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    show_name = db.Column(db.String(100), nullable=False)
    theater_name = db.Column(db.String(100), nullable=False)

    # show = db.relationship('Show', backref=db.backref('bookings', lazy=True))

    def to_dict(self):
        return {
            'id': self.booking_id,
            'user_username': self.user_username,
            'show_id': self.show_id,
            'show_date': self.show_date,
            'show_time': self.show_time,
            'seats': self.seats,
            'total_price': self.total_price,
            'show_name': self.show_name,
            'theater_name': self.theater_name
        }