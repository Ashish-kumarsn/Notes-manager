# -----------------------------------------------------------
# Stage - 1: Build Stage (Fixes the missing ENV variables issue)
# -----------------------------------------------------------
FROM node:18-alpine AS build 

# 1. Define ARGs to receive the variables from docker-compose.yml
#    This allows us to pass REACT_APP variables during the build process
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_API_URL

# 2. Set the ARGs as ENVs so they are available for 'npm run build'
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Set working directory inside the container
WORKDIR /app

# Copy only package file first for caching 
COPY package*.json ./

# Install frontend dependencies 
RUN npm install

# Copy the rest frontend source code (src,public,etc.)
COPY . .

# Build the React Production Files. The ENV variables are now available here.
RUN npm run build 

# -----------------------------------------------------------
# Stage - 2: Serve Stage (Nginx)
# -----------------------------------------------------------
FROM nginx:alpine

# Copy the built React files from the build stage to Nginx's serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to make frontend accessible 
EXPOSE 80

# Start the Nginx web server in the foreground
CMD ["nginx","-g","daemon off;"]
