from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_security import login_required, current_user, login_user, logout_user
from flask_restful import Resource
from celery.result import AsyncResult
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import pandas as pd
from flask import send_file

import io
import base64




from app import db, base_url, api, app, cache
from application.controllers.validate import *
from application.models import *
from application import tasks


@app.route('/')
def index():
    return render_template('index.html')



@app.route('/hello')
def hello():
        result = tasks.add.delay(4, 4)
        if result.ready():
            result_value = result.get()
            return jsonify({'result': result_value})
        else:
            return jsonify({'message': 'Task is not yet complete.'})
        

# @app.route('/theater_show_performance')
# # @cache.cached(timeout=50)
# def Theater_show_performance():

#     theaters = Theater.query.all()
#     shows = Show.query.all()
#     bookings = Booking.query.all()

#     theaters = pd.DataFrame(data=[theater.to_dict() for theater in theaters])
#     # print(theaters)
#     shows = pd.DataFrame(data=[show.to_dict() for show in shows])
#     bookings = pd.DataFrame(data=[booking.to_dict() for booking in bookings])
#     # print(bookings)

#     # return jsonify({"test": "test"})


#     #Total Revenue per Theater
#     theater_revenue = bookings.groupby('theater_name')['total_price'].sum()

#     #Total Revenue per Show
#     show_revenue = bookings.groupby('show_name')['total_price'].sum()

#     #Total Tickets Sold per Theater
#     theater_tickets = bookings.groupby('theater_name')['seats'].sum()

#     #Total Tickets Sold per Show
#     show_tickets = bookings.groupby('show_name')['seats'].sum()

#     fig = Figure( figsize=(12, 6), facecolor='None')
#     ax = fig.add_subplot(1,1,1)
#     ax.bar(theater_revenue.index, theater_revenue.values)
#     ax.set_title('Total Revenue per Theater')
#     ax.set_xlabel('Theater')
#     ax.set_ylabel('Revenue')
#     fig.tight_layout()


#     fig2 = Figure( figsize=(12, 6), facecolor='None')
#     ax2 = fig2.add_subplot(1,1,1)
#     ax2.bar(show_revenue.index, show_revenue.values)
#     ax2.set_title('Total Revenue per Show')
#     ax2.set_xlabel('Show')
#     ax2.set_ylabel('Revenue')
#     fig2.tight_layout()


#     fig3 = Figure( figsize=(12, 6), facecolor='None')
#     ax3 = fig3.add_subplot(1,1,1)
#     ax3.bar(theater_tickets.index, theater_tickets.values)
#     ax3.set_title('Total Tickets Sold per Theater')
#     ax3.set_xlabel('Theater')
#     ax3.set_ylabel('Tickets Sold')
#     fig3.tight_layout()


#     fig4 = Figure( figsize=(12, 6), facecolor='None')
#     ax4 = fig4.add_subplot(1,1,1)
#     ax4.bar(show_tickets.index, show_tickets.values)
#     ax4.set_title('Total Tickets Sold per Show')
#     ax4.set_xlabel('Show')
#     ax4.set_ylabel('Tickets Sold')
#     fig4.tight_layout()


#     output = io.BytesIO()
#     FigureCanvas(fig).print_png(output)
#     output.seek(0)
#     fig_png = base64.b64encode(output.getvalue()).decode('ascii')

#     output2 = io.BytesIO()
#     FigureCanvas(fig2).print_png(output2)
#     output2.seek(0)
#     fig2_png = base64.b64encode(output2.getvalue()).decode('ascii')

#     output3 = io.BytesIO()
#     FigureCanvas(fig3).print_png(output3)
#     output3.seek(0)
#     fig3_png = base64.b64encode(output3.getvalue()).decode('ascii')

#     output4 = io.BytesIO()
#     FigureCanvas(fig4).print_png(output4)
#     output4.seek(0)
#     fig4_png = base64.b64encode(output4.getvalue()).decode('ascii')


#     fig.savefig('fig.png')
#     fig2.savefig('fig2.png')
#     fig3.savefig('fig3.png')
#     fig4.savefig('fig4.png')


#     return jsonify({'succcess': True})








# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         username = request.get_json()
#         password = request.get_json()
#         email = request.get_json()
#         if not user.username:
#             raise MissingParameterError(400, "User name is required")
#         if not password:
#             raise MissingParameterError(400, "User password is required")
#         if not email:
#             raise MissingParameterError(400, "User email is required")
#         else:
#             user = User.query.filter_by(username=username, password=password).first()
#             if user is not None:
#                 login_user(user)
#                 return render_template('#')
#             else:
#                 return redirect(url_for('login'))
#     else:
#         return render_template('login.html')


# @app.route('/')
# def register():
#     if request.method == 'POST':
#         username = request.get_json()
#         password = request.get_json()
#         email = request.get_json()
#         if not user.username:
#             raise MissingParameterError(400, "User name is required")
#         if not password:
#             raise MissingParameterError(400, "User password is required")
#         if not email:
#             raise MissingParameterError(400, "User email is required")
#         else:
#             user = User.query.filter_by(username=username, password=password).first()
#             if user is not None:
#                 login_user(user)
#                 return render_template('#')
#             else:
#                 return redirect(url_for('register'))
#     else:
#         return render_template('register.html')
    