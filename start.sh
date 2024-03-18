#!/bin/bash

# Start backend
cd policybot
python3.12 main.py &

# Start frontend
cd ../frontend
npm start