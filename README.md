
# React and Django Project with Vite, Redux Toolkit, and Django Rest Framework

This project combines React for the frontend, Django Rest Framework (DRF) for the backend, and Vite for fast development.

## Frontend Setup

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/sadansubedi/Ramailo-project.git
   
Navigate to the frontend directory:
cd myblogfront
Install dependencies:
npm install
Development
To start the development server:
npm run dev
This will run your React project using Vite on http://localhost:5173/

State Management
This project uses Redux Toolkit for state management. You can find the Redux logic in the src/features directory.

RTK Query
RTK Query is used for API data fetching. It provides a powerful and ergonomic toolset for managing HTTP requests. You can find examples of using RTK Query in the src/services/userAuthApi directory.

Backend Setup
Django Installation
Install Python (if not already installed).
Create a virtual environment:
python -m venv env
Activate the virtual environment:
On Windows:
env\Scripts\activate

Install Django and Django Rest Framework:

pip install django djangorestframework
Development
Navigate to the backend directory:

cd myblogproject
Run migrations:

python manage.py migrate
Start the Django development server:

python manage.py runserver
This will start the backend server on http://127.0.0.1:8000/

Authentication
This project uses JWT authentication. You can find the authentication logic in the blog/views.py directory.
