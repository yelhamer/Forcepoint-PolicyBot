#!/bin/bash

# Function to install backend dependencies
install_backend_dependencies() {
    echo "Installing backend dependencies..."
    cd policybot || exit 1
    pip3 install -r requirements.txt || { echo "Failed to install backend dependencies."; exit 1; }
    cd .. || exit 1
}

# Function to install frontend dependencies
install_frontend_dependencies() {
    echo "Installing frontend dependencies..."
    cd frontend || exit 1
    npm install || { echo "Failed to install frontend dependencies."; exit 1; }
    cd .. || exit 1
}

# Main function
main() {
    install_backend_dependencies
    install_frontend_dependencies
    echo "Setup completed successfully."
}

# Execute main function
main