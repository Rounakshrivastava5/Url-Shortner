# 🔗 URL Shortener

A modern, full-stack URL shortening service built with **FastAPI** (Python) backend and **Angular** frontend, featuring a beautiful glassmorphism UI design with dark/light mode support.
![Uploading image.png…]()


## ✨ Features

### Backend (FastAPI)
- 🚀 **Fast URL Shortening** - Convert long URLs to short, shareable links
- 🎯 **Custom Short Codes** - Create personalized short URLs
- ⏰ **Expiry Management** - Set automatic expiration times (Indian Standard Time)
- 📊 **URL Analytics** - Get detailed statistics for each short URL
- 🔄 **Automatic Redirects** - Seamless redirection to original URLs
- 🛡️ **Error Handling** - Comprehensive error responses and validation
- �� **CORS Support** - Cross-origin resource sharing enabled

### Frontend (Angular)
- 🎨 **Modern Glassmorphism UI** - Beautiful, translucent design
- 🌙 **Dark/Light Mode** - Toggle between themes with persistent storage
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- ⚡ **Real-time Updates** - Instant URL list refresh
- 📋 **Copy to Clipboard** - One-click URL copying
- �� **Auto-refresh** - Keep your URL list up to date
- 🎯 **Form Validation** - Smart input validation and error handling

## 🏗️ Architecture


## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd url-shortener
```

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd url-Shortner

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### 3. Frontend Setup (Angular)

```bash
# Navigate to frontend directory
cd url-shortner-ui

# Install dependencies
npm install

# Start the development server
npm start
```

The UI will be available at: `http://localhost:4200`

## 📚 API Documentation

### Base URL
