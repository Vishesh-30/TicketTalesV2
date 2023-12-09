from datetime import datetime
from celery.schedules import crontab
from flask import render_template
from flask import current_app as app
from jinja2 import Environment, FileSystemLoader
import pdfkit
import os
import pandas as pd
from json import dumps
from httplib2 import Http
import requests
from celery.result import AsyncResult
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders





from application.models import *
from application.controllers.validate import *
# from application.workers import celery
# from application.workers import ContextTask
from app import celery



path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)


@celery.task
def add(x, y):
    print("Adding")
    return x + y

@celery.task
def theater_pdf(theater_id):
    if theater_id is None:
        raise MissingParameterError(400, "Theater id is required")
    theater = Theater.query.get(theater_id)
    print(theater)
    if theater is None:
        raise InvalidParameterError(400, "Theater does not exist")
    
    show = Show.query.filter_by(theater_id=theater_id).all()
    print(show)
    if show is None:
        print("No shows for this theater")
        raise InvalidParameterError(400, "No shows for this theater")
    
    env = Environment(loader=FileSystemLoader('templates'))
    template = env.get_template('theater_pdf.html')

    html = template.render(theater=theater, show=show)

    pdf = pdfkit.from_string(html, False, configuration=config)

    # os.makedirs('pdfs', exist_ok=True)
    # with open('pdfs/theater_{}.pdf'.format(theater_id), 'wb') as f:
    #     f.write(pdf)
    return pdf


@celery.task
def theater_csv(theater_id):
    if theater_id is None:
        raise MissingParameterError(400, "Theater id is required")
    theater = Theater.query.get(theater_id)
    print(theater)
    if theater is None:
        raise InvalidParameterError(400, "Theater does not exist")
    
    shows = Show.query.filter_by(theater_id=theater_id).all()
    print(shows)
    if not shows:
        print("No shows for this theater")
        raise InvalidParameterError(400, "No shows for this theater")
    
    data = []
    # Add theater details to the data dictionary
    theater_data = {
        "Theater Name": theater.name,
        "Address": theater.address,
        "City": theater.city,
        "State": theater.state,
        "Capacity": theater.capacity,
    }
    
    # Append theater data as the first row
    data.append(theater_data)

    # Iterate through shows and add each show's data as a separate row
    for show in shows:

        

        show_data = {
            "Show ID": show.show_id,
            "Show Name": show.name,
            "Date": show.date,
            "Start Time": show.start_time,
            "End Time": show.end_time,
            "Tags": show.tags,
            "Rating": show.rating,
            "Price": show.price,
        }
        data.append(show_data)

    # Create a DataFrame from the data
    df = pd.DataFrame(data)

    # Generate the CSV content as a string
    csv_content = df.to_csv(index=False)

    return csv_content






WEBHOOK_URL = 'https://chat.googleapis.com/v1/spaces/AAAAHSPrBjs/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=pZAQyEkHHyKVM_mDYhTiPWPKVUeo7U_Fb2UzzG3FboE'




@celery.task(name = 'send_message')
def send_message():
    message = "Looks like you haven't booked any tickets in a while. Book now! and enjoy the show"
    content = {
        'text': message
    }
    
    response = requests.post(
        WEBHOOK_URL, data=dumps(content),
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code == 200:
        print('Message successfully sent')
    else:
        print('Error sending message')
        


# @celery.on_after_configure.connect
# def daily_message(sender, **kwargs):
#     sender.add_periodic_task(
#         crontab(hour=23, minute=13),
#         send_message.s(MESSAGE),
#     )






SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_ADDRESS = "Vish30@TicketTales"
SENDER_PASSWORD = "password"


def email(to_address, subject, message, attachment=None):
    msg = MIMEMultipart()
    msg['From'] = SENDER_ADDRESS
    msg['To'] = to_address
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'html'))

    if attachment:
        print("Attachment found")
        with open(attachment, 'rb') as f:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header(
            'Content-Disposition',
            f'attachment; filename={attachment}',
        )
        msg.attach(part)


    s = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
    s.login(SENDER_ADDRESS, SENDER_PASSWORD)
    s.sendmail(SENDER_ADDRESS, to_address, msg.as_string())
    s.quit()

    return True


def monthly_entertainment_report(username=None):
    data = []
    u = User.query.get(username)
    booking = Booking.query.filter_by(user_username=u.username).all()
    print(u.username)  
    for b in booking:
        show = Show.query.filter_by(show_id=b.show_id).first()
        show_data = {
            "Username": b.user_username,
            "show_id": show.show_id,
            "show_name": show.name,
            "theater_name": b.theater_name,
            "date": show.date,
            "start_time": show.start_time,
            "end_time": show.end_time,
            "tags": show.tags,
            "rating": show.rating,
            "price": show.price,
            "seats": b.seats,
            "total_price": b.total_price,
        }
        data.append(show_data)

    return data


@celery.task(name = 'send_email')
def send_email():
    user = User.query.all()
    for u in user:
        data = monthly_entertainment_report(u.username)
        print(data)

        env = Environment(loader=FileSystemLoader('templates'))
        template = env.get_template('monthly_report.html')

        html = template.render(data=data, user=u)
        
        pdf = pdfkit.from_string(html, False, configuration=config)

        with open('monthly_report.pdf', 'wb') as f:
            f.write(pdf)


        subject = "Monthly Entertainment Report"
        message = "Please find the attached monthly entertainment report"
        attachment = 'monthly_report.pdf'

        email(u.email, subject, message, attachment)