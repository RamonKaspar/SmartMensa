#!/bin/bash

# Check if pip is installed
if ! command -v pip &> /dev/null; then
    echo "pip is not installed. Please install pip."
    exit 1
fi

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    echo "requirements.txt not found."
    exit 1
fi

# Install modules from requirements.txt
echo "Installing Python modules from requirements.txt..."
pip install -r requirements.txt

echo "All modules installed successfully."
