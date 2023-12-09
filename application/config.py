from flask_sqlalchemy import SQLAlchemy


class Config:
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = None
    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'
    CACHE_TYPE = 'RedisCache'
    CACHE_REDIS_HOST = 'localhost'
    CACHE_REDIS_PORT = 6379

class LocalDevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///TicketTalesV2.sqlite3'

    SECRET_KEY =  'vish_30 is the secret key'
    SECURITY_REGISTERABLE = True
    SECURITY_PASSWORD_SALT = 'vish_30 is the salt'

    CELERY_BROKER_URL = 'redis://localhost:6379/1'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/2'

    CACHE_TYPE = 'RedisCache'
    CACHE_REDIS_HOST = 'localhost'
    CACHE_REDIS_PORT = 6379


db = SQLAlchemy()