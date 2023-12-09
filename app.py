from flask import Flask, render_template
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from celery.schedules import crontab
from celery import Celery
from flask_caching import Cache


from application.config import LocalDevelopmentConfig, db
# from application import workers


app = None
api = None
celery = None
cache = None
base_url = 'http://127.0.0.1:5000'
def create_app():
    app = Flask(__name__, template_folder = 'templates', static_folder = 'static')
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api = Api(app)
    app.app_context().push()
    CORS(app)



    celery = Celery(
        app.import_name,
        backend = app.config['CELERY_RESULT_BACKEND'],
        broker = app.config['CELERY_BROKER_URL'],
        timezone = 'Asia/Kolkata',
    )


    celery.conf.update(
        broker_url = app.config['CELERY_BROKER_URL'],
        result_backend = app.config['CELERY_RESULT_BACKEND'],
        broker_connection_retry_on_startup = True,
        timezone = 'Asia/Kolkata',
    )

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
            
    celery.Task = ContextTask   

    celery.conf.beat_schedule = {
        'send_message_': {
            'task': 'send_message',
            'schedule': crontab(minute='*/5'),
        },
        'send_email_': {
            'task': 'send_email',
            'schedule': crontab(minute='*/5'),
        }
    }

    
    # with app.app_context():
    #     db.create_all()
    #     db.session.commit()

    cache = Cache(app)
    app.app_context().push()


    return app, api, celery, cache

app, api, celery, cache = create_app()
jwt = JWTManager(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(username):
    user =  User.query.get(username)
    if user:
        return user
    admin = Admin.query.get(username)
    if admin:
        return admin
    return None





from application.controllers.controllers import *
from application.controllers.api.login import *
from application.controllers.api.theater import *
from application.controllers.api.shows import *
from application.controllers.api.booking import *
from application.controllers.api.search import *






if __name__ == '__main__':
    app.run(debug=True)
