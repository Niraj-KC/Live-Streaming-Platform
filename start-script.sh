#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Prompt the user for the public IP address
EC2_PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)

# Validate input
if [ -z "$EC2_PUBLIC_IP" ]; then
    echo "No IP provided. Exiting."
    exit 1
fi

# Define the absolute path
PROJECT_DIR="/home/ec2-user/Live-Streaming-Platform"

# Configure frontend .env file
cd "$PROJECT_DIR/frontend" || { echo "Failed to change directory to frontend"; exit 1; }

cat > .env <<EOF
VITE_SIGNALING_SERVER_URL=wss://$EC2_PUBLIC_IP:8443/ws
VITE_SERVER_URL=https://$EC2_PUBLIC_IP:8443
EOF

echo "Frontend .env file created successfully."

# Configure backend .env file
cd "$PROJECT_DIR/backend" || { echo "Failed to change directory to backend"; exit 1; }

cat > .env <<EOF
SIGNALLING_SERVER_HOST=$EC2_PUBLIC_IP
SIGNALLING_SERVER_PORT=8443
SIGNALLING_SERVER_PATH=/ws

STUN_SERVER=stun:stun.l.google.com:19302
TURN_SERVER=turn:$EC2_PUBLIC_IP:3478
TURN_USERNAME=admin
TURN_CREDENTIAL=admin
EOF

echo "Backend .env file created successfully."

# Build the frontend and copy the dist folder to backend
cd "$PROJECT_DIR/frontend" || { echo "Failed to change directory back to frontend"; exit 1; }
echo "Running npm build"
npm run build || { echo "npm build failed"; exit 1; }

echo "Copying dist to backend"
cp -r ./dist "$PROJECT_DIR/backend/" || { echo "Copying dist failed"; exit 1; }

# Run the server
echo "Running server.js"
cd "$PROJECT_DIR/backend" || { echo "Failed to change directory to backend"; exit 1; }
node ./server.js
