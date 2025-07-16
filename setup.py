#!/usr/bin/env python3
"""
Setup script for Family Expenditure App
Handles virtual environment creation and dependency installation
"""

import os
import sys
import subprocess
import platform

def run_command(command, cwd=None):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error running command: {command}")
            print(f"Error output: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"Exception running command {command}: {e}")
        return False

def setup_backend():
    """Setup the backend environment"""
    print("🔧 Setting up backend...")
    
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    
    # Create virtual environment
    print("📦 Creating virtual environment...")
    if platform.system() == "Windows":
        venv_command = "python -m venv venv"
        activate_command = "venv\\Scripts\\activate"
        pip_command = "venv\\Scripts\\pip"
    else:
        venv_command = "python3 -m venv venv"
        activate_command = "source venv/bin/activate"
        pip_command = "venv/bin/pip"
    
    if not run_command(venv_command, cwd=backend_dir):
        print("❌ Failed to create virtual environment")
        return False
    
    # Install dependencies
    print("📚 Installing Python dependencies...")
    if not run_command(f"{pip_command} install --upgrade pip", cwd=backend_dir):
        print("❌ Failed to upgrade pip")
        return False
    
    # Try simple requirements first
    if not run_command(f"{pip_command} install -r requirements_simple.txt", cwd=backend_dir):
        print("❌ Failed to install simple requirements")
        return False
    
    print("✅ Backend setup complete!")
    return True

def setup_frontend():
    """Setup the frontend environment"""
    print("🔧 Setting up frontend...")
    
    frontend_dir = os.path.join(os.path.dirname(__file__), 'frontend')
    
    # Check if npm is available
    if not run_command("npm --version"):
        print("❌ npm is not installed. Please install Node.js first.")
        return False
    
    # Install dependencies
    print("📚 Installing Node.js dependencies...")
    if not run_command("npm install", cwd=frontend_dir):
        print("❌ Failed to install npm dependencies")
        return False
    
    print("✅ Frontend setup complete!")
    return True

def main():
    """Main setup function"""
    print("🚀 Setting up Family Expenditure App...")
    print("=" * 50)
    
    # Setup backend
    if not setup_backend():
        print("❌ Backend setup failed")
        sys.exit(1)
    
    print()
    
    # Setup frontend
    if not setup_frontend():
        print("❌ Frontend setup failed")
        sys.exit(1)
    
    print()
    print("🎉 Setup complete!")
    print("=" * 50)
    print("📋 Next steps:")
    print("1. Start the backend:")
    if platform.system() == "Windows":
        print("   cd backend && venv\\Scripts\\activate && python app\\app.py")
    else:
        print("   cd backend && source venv/bin/activate && python app/app.py")
    print("2. Start the frontend:")
    print("   cd frontend && npm start")
    print("3. Open http://localhost:3000 in your browser")

if __name__ == "__main__":
    main()