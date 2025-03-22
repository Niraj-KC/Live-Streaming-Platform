# Live Streaming Platform

This is a simple live streaming platform with a frontend built using JavaScript frameworks and a backend running on Node.js.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Installation and Running the Project

### Backend

Navigate to the `backend` directory and start the backend server:
```sh
cd ./backend
npm install  # Install dependencies
node ./server.js  # Start the backend server
```

#### Backend .env Configuration
Create a `.env` file inside the `backend` directory with the following content:
```sh
# .env
HTTPS_PORT=8443
# When using the secure server, the signaling URL will be built from the host and port.
# For local testing, you can use "localhost"
SIGNALLING_SERVER_HOST=127.0.0.1
SIGNALLING_SERVER_PORT=8443
SIGNALLING_SERVER_PATH=/ws
```

### Frontend

Navigate to the `frontend` directory and start the development server:
```sh
cd ./frontend
npm install  # Install dependencies
npm run dev  # Start the development server
```

#### Frontend .env Configuration
Create a `.env` file inside the `frontend` directory with the following content:
```sh
VITE_SIGNALING_SERVER_URL=wss://127.0.0.1:8443/ws
VITE_ICE_SERVERS=stun:stun.l.google.com:19302
VITE_SERVER_IP=127.0.0.1
VITE_SERVER_PORT=8443
VITE_SERVER_URL=https://127.0.0.1:8443
```

## Project Structure
```
Live-Streaming-Platform/
│── frontend/       # Frontend code
│── backend/        # Backend code
│── .gitignore      # Git ignore file
│── README.md       # Project documentation
│── package.json    # Node.js dependencies
```

## Contributing
Feel free to fork this repository, submit issues, or contribute with pull requests.

## License
This project is licensed under the MIT License.

