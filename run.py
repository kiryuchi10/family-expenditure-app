#!/usr/bin/env python3
"""
Simple run script for Family Expenditure App
Starts both backend and frontend servers
"""

import os
import sys
import subprocess
import platform
import time
import threading

def run_backend():
    """Run the backend server"""
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    app_path = os.path.join(backend_dir, 'app', 'app.py')
    
    if platform.system() == "Windows":
        python_path = os.path.join(backend_dir, 'venv', 'Scripts', 'python.exe')
    else:
        python_path = os.path.join(backend_dir, 'venv', 'bin', 'python')
    
    if not os.path.exists(python_path):
        print("❌ Virtual environment not found. Please run setup.py first.")
        return
    
    print("🚀 Starting backend server...")
    try:
        subprocess.run([python_path, app_path], cwd=backend_dir)
    except KeyboardInterrupt:
        print("🛑 Backend server stopped")

def run_frontend():
    """Run the frontend server"""
    frontend_dir = os.path.join(os.path.dirname(__file__), 'frontend')
    
    print("🚀 Starting frontend server...")
    try:
        subprocess.run(['npm', 'start'], cwd=frontend_dir)
    except KeyboardInterrupt:
        print("🛑 Frontend server stopped")

def main():
    """Main run function"""
    print("🚀 Starting Family Expenditure App...")
    print("=" * 50)
    
    # Check if setup has been run
    backend_venv = os.path.join(os.path.dirname(__file__), 'backend', 'venv')
    frontend_modules = os.path.join(os.path.dirname(__file__), 'frontend', 'node_modules')
    
    if not os.path.exists(backend_venv):
        print("❌ Backend not set up. Please run: python setup.py")
        sys.exit(1)
    
    if not os.path.exists(frontend_modules):
        print("❌ Frontend not set up. Please run: python setup.py")
        sys.exit(1)
    
    try:
        # Start backend in a separate thread
        backend_thread = threading.Thread(target=run_backend)
        backend_thread.daemon = True
        backend_thread.start()
        
        # Wait a moment for backend to start
        time.sleep(3)
        
        # Start frontend (this will block)
        run_frontend()
        
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")

if __name__ == "__main__":
    main()