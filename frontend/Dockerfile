# Use official Node runtime as a parent image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy existing application directory contents
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the React application in development mode
CMD ["npm", "start"]