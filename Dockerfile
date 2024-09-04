# Use the official Node.js image as the base image
FROM node:20-alpine
# If you're using M1, M2 Mac, try this: 
# FROM  --platform=linux/amd64 node:16.14.0-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install\
        && npm install typescript -g

# Copy the application files
COPY . .

RUN npm run build

# Expose the port
EXPOSE 3003

# Start the application
CMD [ "node", "dist/server.js" ]