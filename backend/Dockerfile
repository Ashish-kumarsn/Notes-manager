# Backend dockerfile 
# This Dockerfile build a lightweight Node.js image 
# that runs Express backend server


# Use official Node.js directory inside the container

FROM node:18-alpine

# Set working directory inside the container 
# Everything from now one will happen in this /app folder
WORKDIR /app

# Copy only package files first
# This helps Docker cache dependencies and speeds up rebuilds.
COPY package*.json ./

# Install backend dependencies 
RUN npm install 

# Copy the rest backend source code 
# This bring the files like server.js,routes,models etc.
COPY . .

# Expose the port your backend runs on.
EXPOSE 5000

# Define the command that starts backend server
# This will run when the container starts.

CMD ["npm","start"]


