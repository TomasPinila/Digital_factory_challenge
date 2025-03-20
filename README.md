# Digital Factory Challenge - Task Manager Application

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to register, login, and manage their tasks. The application is deployed, click here to see it: https://todo-mern-app-frontend-dsmm.onrender.com

## Project Structure

```
Digital_factory_challenge/
├── frontend/         # React application
├── backend/          # Express API server
```

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or newer)
-   [npm](https://www.npmjs.com/) (v8 or newer)
-   [MongoDB](https://www.mongodb.com/) account (or local MongoDB installation)



## Setup Instructions

### Clone the repository

```bash
git clone <repository-url>
cd Digital_factory_challenge
```

### Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the backend directory with the following variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    PORT=3001
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=30d
    ```
    Replace `your_mongodb_connection_string` with your actual MongoDB connection string and `your_jwt_secret` with a secure random string.

### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the frontend directory with:
    ```
    VITE_API_URL=http://localhost:3001
    ```

## Running the Application Locally

### Start the Backend Server

1. From the backend directory:
    ```bash
    npm start
    ```
    This will start the backend server at http://localhost:3001

### Start the Frontend Development Server

1. From the frontend directory:

    ```bash
    npm run dev
    ```

    This will start the frontend development server, typically at http://localhost:5173

2. Open your browser and navigate to the URL shown in your terminal.

## Technologies Used

### Frontend

-   React
-   React Router
-   Axios
-   JWT Decode
-   Bootstrap (for styling)
-   Vite (build tool)

### Backend

-   Node.js
-   Express.js
-   MongoDB with Mongoose
-   JWT for authentication
-   bcrypt for password hashing
-   dotenv for environment variables

## Features

-   User authentication (register, login, logout)
-   Create, read, update, and delete tasks
-   Protected routes with JWT authentication
-   Responsive design that works on mobile and desktop
