# Use node image as the base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json .

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv

# Create a virtual environment
RUN python3 -m venv /venv

# Use the virtual environment
ENV PATH="/venv/bin:$PATH"

# Copy the requirements file
COPY requirements.txt .

# Install Python modules within the virtual environment
RUN pip3 install -r requirements.txt

# Copy the rest of the application files to the working directory
COPY . .

# Install npm dependencies and build the app
RUN npm install
RUN npm run build

# Expose the port
EXPOSE 5173

# Activate virtual environment and start the application
CMD ["bash", "-c", "source /venv/bin/activate && npm run start"]
