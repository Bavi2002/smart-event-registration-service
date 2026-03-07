# Use official Node.js 20 slim image (good balance between size and compatibility)
FROM node:20-slim

# Set working directory inside container
WORKDIR /app

# Copy package files first (optimizes caching during rebuilds)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (same as in .env or default 3003)
EXPOSE 3003

# Use non-root user for better security (Node image has 'node' user)
USER node

# Start the application
CMD ["npm", "start"]