@echo off

rem Start backend
cd policybot
start python main.py

rem Move back to the original directory
cd ..

rem Start frontend
cd frontend
start npm start