# Use node image as the base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json .

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip

# # Copy the shell script to the container
# COPY install_python_modules.sh .

# Copy the requirements file
COPY requirements.txt .

# Install Python modules system-wide
# RUN pip3 install -r requirements.txt

RUN apt install -y python3-selenium

# # Give execute permissions to the shell script
# RUN chmod +x install_python_modules.sh

# # Run the shell script to install Python modules from requirements.txt
# RUN ./install_python_modules.sh

# Download and install ChromeDriver
# RUN apt-get update && \
#     apt-get install -y wget unzip && \
#     CHROME_DRIVER_VERSION=$(curl -s https://chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
#     wget -q -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip && \
#     unzip /tmp/chromedriver.zip -d /usr/bin && \
#     chmod +x /usr/bin/chromedriver

# # Set an environment variable for ChromeDriver (optional)
# ENV CHROME_DRIVER_PATH=/usr/bin/chromedriver

# Copy the rest of the application files to the working directory
COPY . .

# Install npm dependencies and build the app
RUN npm install
RUN npm run build

# Expose the port
EXPOSE 5173

# Command to start the application
CMD ["npm", "run", "start"]
