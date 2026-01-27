# Crop Disease Detection - Quick Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Docker Desktop (for PostgreSQL)
- Expo Go app on your phone

## 🚀 5-Minute Setup

### 1. Install Frontend Dependencies

```bash
cd crop-prediction
npm install
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
py -3.11 -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start database
docker-compose up -d

# Initialize database
python scripts/init_db.py
python scripts/seed_treatments.py
```

### 3. Add Your Model

Place your trained `.tflite` model file in:

```
backend/models/plant_disease_model.tflite
```

### 4. Start Everything

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd crop-prediction
npx expo start
```

### 5. Run on Phone

- Open Expo Go app
- Scan the QR code
- Start diagnosing crops!

## 📝 Configuration

### Backend `.env`

Copy `.env.example` to `.env` and update:

```env
DATABASE_URL=postgresql+asyncpg://crop_user:crop_password@localhost:5432/crop_disease_db
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=your-bucket-name
```

### Frontend API URL

Update `services/api.ts` if not using localhost:8000

## 🎯 Testing Offline Mode

1. Run app on phone
2. Turn on Airplane Mode
3. Take photo of crop
4. See instant diagnosis (uses on-device AI)
5. Turn off Airplane Mode
6. App automatically syncs to server

## 🐛 Troubleshooting

**Backend won't start:**

- Check if PostgreSQL is running: `docker ps`
- Verify Python version: `python --version`

**Frontend crashes:**

- Clear cache: `npx expo start -c`
- Reinstall dependencies: `npm install`

**Model not found:**

- Ensure `.tflite` file is in `backend/models/`
- Check file name matches `plant_disease_model.tflite`

## 📚 Documentation

- Full README: [../README.md](../README.md)
- Backend API:http://localhost:8000/api/v1/docs
