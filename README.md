# Live Streaming Platform

This is a simple live streaming platform with a frontend built using JavaScript frameworks and a backend running on Node.js.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://docs.docker.com/desktop/)

## Installation and Running the Project

### Building the Frontend

```sh
cd .\frontend\
npm run build
```

### Copy the build to backend

```sh
copy .\frontend\dist\* .\backend\dist
```

### Building the Docker container

```sh
docker build -f backend/Dockerfile -t live-streaming-app .
```

### Setting-up Docket container

```sh
docker run -d --name coturn -p 3478:3478 -p 3478:3478/udp -e TURN_REALM=[YourIP] -e TURN_USER=user:password instrumentisto/coturn

docker run -d -p 8443:8443 -e SIGNALLING_SERVER_HOST=[YourIP] -e SIGNALLING_SERVER_PORT=8443 -e SIGNALLING_SERVER_PATH=/ws -e STUN_SERVER=stun:stun.l.google.com:19302 -e TURN_SERVER=turn:[YourIP]:3478 -e TURN_USERNAME=user -e TURN_CREDENTIAL=password --name live-streaming-app live-streaming-app
```

### For existing container

```sh
docker start coturn live-streaming-app
docker stop coturn live-streaming-app
```

### For viewing the logs of container

```sh
docker logs live-streaming-app
```

OR

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

## install node

```
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"
# Download and install Node.js:
nvm install 22
```

## install git

```
sudo apt install git
```

## clone repo

```
git clone https://github.com/Niraj-KC/Live-Streaming-Platform/
```

## chmod

```
chmod +x ./Live-Streaming-Platform/start-script.sh
```

## start-service

```
sudo nano /etc/systemd/system/mystartup.service
```

## create service

```
[Unit]
Description=My Startup Script
After=network.target

[Service]
Type=simple
Environment="PATH=/home/ec2-user/.nvm/versions/node/v18.16.0/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=/home/ec2-user/Live-Streaming-Platform/start-script.sh
Restart=on-failure
User=ec2-user
WorkingDirectory=/home/ec2-user/Live-Streaming-Platform
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

## install dependancy

```
cd ./Live-Streaming-Platform
cd ./frontend
npm i
cd ../backend
npm i
```

## start service

```
sudo systemctl daemon-reload
sudo systemctl enable mystartup.service
sudo systemctl start mystartup.service
sudo systemctl status mystartup.service
```

## info commads
```
journalctl -u mystartup.service --no-pager --lines=50
sudo systemctl status mystartup.service
```