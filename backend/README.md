# Crop Disease Detection - Backend

FastAPI backend for mobile-first crop disease detection system.

## Features

- ✅ TensorFlow Lite model inference
- ✅ Confidence-aware diagnosis
- ✅ Image quality validation & auto-enhancement
- ✅ Disease spread alerts (privacy-preserving)
- ✅ Localized treatment recommendations
- ✅ Progress tracking (before/after images)
- ✅ Offline model sync
- ✅ AWS S3 image storage
- ✅ RESTful API with FastAPI

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Database (Docker)

```bash
docker-compose up -d db redis
```

### 4. Initialize Database

```bash
python scripts/init_db.py
```

### 5. Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: http://localhost:8000  
API docs: http://localhost:8000/api/v1/docs

## Docker Deployment

```bash
docker-compose up -d
```

## API Endpoints

### Diagnosis

- `POST /api/v1/diagnosis/upload` - Upload image for disease detection
- `GET /api/v1/diagnosis/{id}` - Get diagnosis details

### Alerts

- `GET /api/v1/alerts/nearby` - Get nearby disease alerts
- `GET /api/v1/alerts/stats` - Alert statistics

### History

- `GET /api/v1/history/user/{user_id}` - User diagnosis history
- `GET /api/v1/history/recent` - Recent diagnoses

### Models

- `GET /api/v1/models/latest` - Check for model updates
- `GET /api/v1/models/info` - Model details

## Project Structure

```
backend/
├── app/
│   ├── api/v1/endpoints/    # API routes
│   ├── core/                # Configuration
│   ├── db/                  # Database setup
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   │   └── ml/              # ML services
│   └── main.py              # FastAPI app
├── models/                  # TFLite models
├── scripts/                 # Utility scripts
├── tests/                   # Tests
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## Model Training

The model is trained on the PlantVillage dataset (39 classes).  
See: https://www.kaggle.com/code/abdallahwagih/plant-village-disease-classification-acc-99-6/notebook

To convert your trained model to TensorFlow Lite:

```python
import tensorflow as tf

model = tf.keras.models.load_model("plant_disease_model.h5")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

with open("models/plant_disease_model.tflite", "wb") as f:
    f.write(tflite_model)
```

## Environment Variables

See `.env.example` for all configuration options.

Key variables:

- `DATABASE_URL` - PostgreSQL connection
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `S3_BUCKET_NAME` - Image storage bucket
- `MODEL_PATH` - Path to TFLite model
- `CONFIDENCE_THRESHOLD` - Minimum confidence (default 0.70)

## License

MIT
