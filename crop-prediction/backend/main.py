from fastapi import FastAPI, UploadFile, File
from contextlib import asynccontextmanager
import db_handler
import model_handler

# This ensures DB setup happens ONLY on first run/startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    db_handler.init_db() # Setup DB
    app.state.model, app.state.model_type = model_handler.load_model() # Load AI
    yield

app = FastAPI(lifespan=lifespan)

@app.post("/diagnose")
async def diagnose(file: UploadFile = File(...)):
    image_data = await file.read()
    
    # 1. Get Prediction Index
    idx, conf = model_handler.predict_image(app.state.model, app.state.model_type, image_data)
    
    # 2. Lookup in DB
    info = db_handler.get_disease_info(idx)
    
    # 3. Wrap and return to Frontend
    return {
        "diagnosis": info["disease_name"] if info else "Unknown",
        "treatment": info["treatment"] if info else "No data available",
        "confidence": f"{conf * 100:.2f}%"
    }