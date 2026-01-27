# Crop Disease Detection - Complete System

## 🌾 Project Overview

A mobile-first AI system for early agricultural diagnosis that works **offline** in remote fields. Detects crop diseases from smartphone photos and provides localized treatment recommendations.

---

### 1. **Offline-First Architecture**

- ✅ On-device TensorFlow Lite inference
- ✅ Works 100% without internet
- ✅ Background sync when connectivity returns
- ✅ SQLite local storage for scans

### 2. **Confidence-Aware Diagnosis**

- ✅ Shows confidence score (0-100%)
- ✅ Top-3 alternative predictions
- ✅ Retry suggestions for low confidence
- ✅ Image quality validation

### 3. **Privacy-Preserving Disease Alerts**

- ✅ 10km grid anonymization
- ✅ No personal GPS stored
- ✅ Nearby outbreak notifications
- ✅ Severity levels (1-5)

### 4. **Localized Treatment Recommendations**

- ✅ Chemical + organic alternatives
- ✅ Dosage in local units
- ✅ Effectiveness scores
- ✅ Cost estimates

---

## 📁 Project Structure

```
crop-prediction/           # React Native + Expo
├── app/(tabs)/
│   ├── index.tsx          # Home screen
│   ├── diagnose.tsx       # Diagnosis screen (camera + results)
│   └── history.tsx        # Scan history
├── services/
│   ├── inference-service.ts   # On-device TFLite inference
│   ├── local-db.ts           # SQLite storage
│   ├── sync-service.ts       # Background sync
│   └── api.ts                # Backend API client
└── components/            # Reusable UI components

backend/                   # FastAPI + PostgreSQL
├── app/
│   ├── api/v1/endpoints/  # REST API routes
│   ├── models/            # Database models
│   ├── services/
│   │   ├── ml/            # ML pipeline
│   │   ├── geolocation_service.py
│   │   └── storage_service.py
│   └── main.py
├── models/                # TFLite model files
└── scripts/
    ├── init_db.py         # Database initialization
    ├── seed_treatments.py # Treatment data
    └── convert_model.py   # H5 → TFLite conversion
```

---

## 🚀 Quick Start

### Frontend (React Native)

```bash
cd crop-prediction
npm install
npx expo start
```

**Run on device:**

- Android: Scan QR code with Expo Go
- iOS: Scan QR code with Camera app

### Backend (FastAPI)

```bash
cd backend

# Activate virtual environment
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start database
docker-compose up -d db redis

# Initialize database
python scripts/init_db.py
python scripts/seed_treatments.py

# Run server
uvicorn app.main:app --reload
```

API Documentation: http://localhost:8000/api/v1/docs

---

## 📱 How It Works

### 1. **Offline Scan Flow**

```
Farmer takes photo
    ↓
On-device TFLite inference (2-3 seconds)
    ↓
Save result to SQLite
    ↓
Show diagnosis + treatments
    ↓
[When internet available]
    ↓
Background sync to server
```

### 2. **Technology Stack**

| Component           | Technology           |
| ------------------- | -------------------- |
| **Frontend**        | React Native + Expo  |
| **Local Storage**   | expo-sqlite          |
| **ML Inference**    | TensorFlow Lite      |
| **Backend**         | FastAPI + PostgreSQL |
| **Image Storage**   | AWS S3               |
| **Background Sync** | NetInfo + Axios      |

---

## 🧠 ML Model

### Training

Using PlantVillage dataset (39 classes, 99.6% accuracy):

- [Kaggle Notebook](https://www.kaggle.com/code/abdallahwagih/plant-village-disease-classification-acc-99-6/notebook)

### Conversion to TFLite

```bash
cd backend
python scripts/convert_model.py --input plant_disease_model.h5
```

**Model Specs:**

- Input: 224x224 RGB image
- Output: 39-class probabilities
- Size: ~5MB (Float16 quantized)

### Supported Crops & Diseases

- **Tomato**: Early Blight, Late Blight, Leaf Mold, Bacterial Spot, etc.
- **Potato**: Early Blight, Late Blight
- **Apple**: Apple Scab, Black Rot
- **Corn**: Northern Leaf Blight, Common Rust
- **Grape**: Black Rot, Esca
- **Pepper, Peach, Strawberry, etc.**

---

## 🔌 API Endpoints

### Diagnosis

```bash
POST /api/v1/diagnosis/upload
  - Upload image for disease detection
  - Returns: diagnosis + confidence + treatments

GET /api/v1/diagnosis/{id}
  - Retrieve diagnosis by ID
```

### Disease Alerts

```bash
GET /api/v1/alerts/nearby?latitude=23.0&longitude=72.5
  - Get nearby disease outbreaks
  - Privacy-preserving (10km grid)

GET /api/v1/alerts/stats
  - Global alert statistics
```

### Offline Model Sync

```bash
GET /api/v1/models/latest
  - Check for model updates
  - Returns download URL
```

---

## 🎯 Next Steps

### Before Demo

1. ✅ Train model on Kaggle
2. ✅ Convert to `.tflite`
3. ⬜ Place in `backend/models/` folder
4. ⬜ Test inference endpoint
5. ⬜ Record demo video

### After Hackathon

- [ ] SMS/WhatsApp integration (Twilio ready)
- [ ] Voice output in local languages
- [ ] Expert escalation system
- [ ] Real GradCAM explanations instead of mock
- [ ] Treatment effectiveness tracking
- [ ] Push notifications for alerts

---

## 🏅 Demo Script

**1. Show Offline Capability**

- Turn airplane mode ON
- Take photo of diseased crop
- Instant diagnosis appears
- Save to local history

**2. Show Disease Alerts**

- Turn internet ON
- Check nearby alerts
- See disease spread map

**3. Show Treatment Recommendations**

- View chemical + organic options
- See dosage calculations
- Check effectiveness scores

**4. Show Background Sync**

- Navigate to history
- See "synced" status update automatically

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────┐
│   📱 React Native App (Offline)    │
│  ┌─────────────────────────────┐   │
│  │  TFLite Model (5MB)         │   │
│  │  → Inference in 2-3 sec     │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  SQLite Database            │   │
│  │  → Stores unsynced scans    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
            ↕ (when online)
┌─────────────────────────────────────┐
│   ☁️ FastAPI Backend (AWS)         │
│  ┌─────────────────────────────┐   │
│  │  PostgreSQL                 │   │
│  │  → Global disease tracking  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  S3 Storage                 │   │
│  │  → Image backup             │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

MIT License - See LICENSE file

---

## 🎉 Acknowledgments

- PlantVillage Dataset
- FastAPI Framework
- Expo Framework
- TensorFlow Team

---

**Built with ❤️ for farmers who need technology that works in the field, not just in labs.**
