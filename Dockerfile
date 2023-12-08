# Use node image as the base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Install required dependencies
RUN apt-get update && \
    apt-get install -y wget unzip gnupg2

# Download and install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable=120.0.6099.71-1

# Download and install specific version of ChromeDriver
RUN wget -q "https://chromedriver.storage.googleapis.com/120.0.6099.71/chromedriver_linux64.zip" && \
    unzip chromedriver_linux64.zip && \
    mv chromedriver /app/chromedriver && \
    chmod +x /app/chromedriver && \
    rm chromedriver_linux64.zip

# Copy package.json to the working directory
COPY package.json .

# Install Python and pip
RUN apt-get install -y python3 python3-pip

RUN apt install -y python3-selenium python3-bs4 python3-jsonschema python3-pydantic

# Copy the rest of the application files to the working directory
COPY . .

# Install npm dependencies and build the app
RUN npm install
RUN npm run build

# Expose the port
EXPOSE 5173

# Command to start the application
CMD ["npm", "run", "start"]
