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
# COPY requirements.txt .

# Install Python modules system-wide
# RUN pip3 install -r requirements.txt
# install all these modules system-wide: from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from fake_useragent import UserAgent
# import json
# from time import sleep

RUN apt install -y python3-selenium python3-bs4 python3-jsonschema
# python3-time python3-fake-useragent

# Copy the rest of the application files to the working directory
COPY . .

# Install npm dependencies and build the app
RUN npm install
RUN npm run build

# Expose the port
EXPOSE 5173

# Command to start the application
CMD ["npm", "run", "start"]
