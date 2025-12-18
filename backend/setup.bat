@echo off
REM Restaurant Service System - Python Backend Setup Script (Windows)
REM This script automates the setup process for local development

echo.
echo 🚀 Restaurant Service System - Python Backend Setup
echo ==================================================
echo.

REM Check Python version
echo 📋 Checking Python version...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python is not installed or not in PATH
    exit /b 1
)
echo ✅ Python detected
echo.

REM Create virtual environment
echo 📦 Creating virtual environment...
if exist "venv" (
    echo ⚠️  Virtual environment already exists. Skipping...
) else (
    python -m venv venv
    echo ✅ Virtual environment created
)
echo.

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat
echo ✅ Virtual environment activated
echo.

REM Upgrade pip
echo ⬆️  Upgrading pip...
python -m pip install --upgrade pip --quiet
echo ✅ pip upgraded
echo.

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt --quiet
echo ✅ Dependencies installed
echo.

REM Setup environment file
echo ⚙️  Setting up environment file...
if exist ".env" (
    echo ⚠️  .env file already exists. Skipping...
) else (
    copy .env.example .env
    echo ✅ .env file created
)
echo.

REM Seed database
echo 🌱 Seeding database...
python seed.py
if %ERRORLEVEL% EQU 0 (
    echo ✅ Database seeded successfully
) else (
    echo ⚠️  Database seeding failed or already seeded
)
echo.

REM Summary
echo ==================================================
echo ✅ Setup Complete!
echo ==================================================
echo.
echo 🎯 Next Steps:
echo.
echo 1. Start the server:
echo    python run.py
echo.
echo 2. Access the API:
echo    • API: http://localhost:7001
echo    • Docs: http://localhost:7001/api/docs
echo    • Health: http://localhost:7001/health
echo.
echo 3. Test accounts:
echo    • Admin: admin@restaurant.com / admin123
echo    • Customer: customer@example.com / customer123
echo.
echo 📚 For more information, see README.md
echo.
echo Happy coding! 🎉
echo.

pause

