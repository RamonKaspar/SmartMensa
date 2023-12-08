# Use node image as the base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json .

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip

RUN apt install -y python3-bs4 python3-jsonschema python3-pydantic python3-requests python3-lxml

# Copy the rest of the application files to the working directory
COPY . .

# Install npm dependencies and build the app
RUN npm install
RUN npm run build

# Expose the port
EXPOSE 5173

# Command to start the application
CMD ["npm", "run", "start"]
