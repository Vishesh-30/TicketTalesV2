# TicketTalesV2

TicketTales is a modern ticketing platform that allows users to book tickets for various shows and events at different theatres. This project utilizes Flask for the backend API development and Vue.js for the frontend interface. It also leverages Celery and Redis for background task management and caching.

### Video Link: https://www.youtube.com/watch?v=ymIzew8RnrA&ab_channel=Vish

## Features

- User-friendly interface for browsing shows, selecting seats, and making bookings.
- Secure authentication and authorization mechanisms for user accounts.
- CRUD functionalities for managing shows, theatres, and user bookings.
- QR code generation for booking invoices, providing convenient access to tickets.
- Admin panel with powerful tools for managing shows, theatres, and user bookings.
- Background task management for daily reminders and monthly entertainment reports.
- Caching mechanisms for optimizing performance and enhancing user experience.

## Setup Instructions

1. Clone the repository: `git clone https://github.com/your-username/ticket-tales.git`
2. Install dependencies for the backend: `pip install -r requirements.txt`
3. Install dependencies for the frontend: `cd frontend && npm install`
4. Start the backend server: `python app.py`
5. Start the frontend server: `cd frontend && npm run serve`
6. Access the application at `http://localhost:8080` in your web browser.

## Technologies Used

- Flask: Backend API development
- Vue.js: Frontend interface
- Celery: Background task management
- Redis: Caching
- SQLite: Database management
- HTML/CSS: Frontend styling
- JavaScript: Frontend functionality

## Contributors

- [Your Name](https://github.com/Vishesh-30)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
