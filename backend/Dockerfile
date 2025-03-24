# Use a lightweight Node.js image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the backend code (everything in the current backend folder)
COPY . .

# Copy the built frontend assets from the frontend/dist folder (relative to the repository root)
# COPY ./dist ./dist

# Install production dependencies
RUN npm install --production

# Expose the port your server listens on (as per your server.js, default 8443)
EXPOSE 8443

# Start the server
CMD ["node", "server.js"]
