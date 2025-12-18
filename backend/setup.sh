#!/bin/bash

# Restaurant Service System - Python Backend Setup Script
# This script automates the setup process for local development

set -e  # Exit on error

echo "🚀 Restaurant Service System - Python Backend Setup"
echo "=================================================="
echo ""

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python --version 2>&1 | awk '{print $2}')
required_version="3.11"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Python 3.11 or higher is required. You have $python_version"
    exit 1
fi
echo "✅ Python $python_version detected"
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
if [ -d "venv" ]; then
    echo "⚠️  Virtual environment already exists. Skipping..."
else
    python -m venv venv
    echo "✅ Virtual environment created"
fi
echo ""

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate
echo "✅ Virtual environment activated"
echo ""

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip --quiet
echo "✅ pip upgraded"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt --quiet
echo "✅ Dependencies installed"
echo ""

# Setup environment file
echo "⚙️  Setting up environment file..."
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Skipping..."
else
    cp .env.example .env
    echo "✅ .env file created"
fi
echo ""

# Check PostgreSQL connection
echo "🔍 Checking database connection..."
if python -c "from app.database import engine; engine.connect()" 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Could not connect to database. Please check your DATABASE_URL in .env"
    echo "   Default: postgresql://postgres:postgres@localhost:5432/restaurant_db"
fi
echo ""

# Seed database
echo "🌱 Seeding database..."
if python seed.py; then
    echo "✅ Database seeded successfully"
else
    echo "⚠️  Database seeding failed or already seeded"
fi
echo ""

# Summary
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Start the server:"
echo "   python run.py"
echo ""
echo "2. Access the API:"
echo "   • API: http://localhost:7001"
echo "   • Docs: http://localhost:7001/api/docs"
echo "   • Health: http://localhost:7001/health"
echo ""
echo "3. Test accounts:"
echo "   • Admin: admin@restaurant.com / admin123"
echo "   • Customer: customer@example.com / customer123"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "Happy coding! 🎉"

