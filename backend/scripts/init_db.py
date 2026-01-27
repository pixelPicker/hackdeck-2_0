"""
Database initialization script
Generates PlantVillage disease data based on the 39 classes
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.models.disease import Disease, DiseaseSeverity
from app.models.treatment import Treatment, TreatmentType, CropStage
import uuid


# PlantVillage 39 classes with metadata
PLANT_VILLAGE_CLASSES = [
    {"index": 0, "crop": "Apple", "disease": "Apple scab", "severity": "high"},
    {"index": 1, "crop": "Apple", "disease": "Black rot", "severity": "high"},
    {"index": 2, "crop": "Apple", "disease": "Cedar apple rust", "severity": "medium"},
    {"index": 3, "crop": "Apple", "disease": "healthy", "severity": "low"},
    {"index": 4, "crop": "Blueberry", "disease": "healthy", "severity": "low"},
    {"index": 5, "crop": "Cherry", "disease": "healthy", "severity": "low"},
    {"index": 6, "crop": "Cherry", "disease": "Powdery mildew", "severity": "medium"},
    {"index": 7, "crop": "Corn", "disease": "Cercospora leaf spot", "severity": "medium"},
    {"index": 8, "crop": "Corn", "disease": "Common rust", "severity": "medium"},
    {"index": 9, "crop": "Corn", "disease": "healthy", "severity": "low"},
    {"index": 10, "crop": "Corn", "disease": "Northern Leaf Blight", "severity": "high"},
    {"index": 11, "crop": "Grape", "disease": "Black rot", "severity": "high"},
    {"index": 12, "crop": "Grape", "disease": "Esca (Black Measles)", "severity": "critical"},
    {"index": 13, "crop": "Grape", "disease": "healthy", "severity": "low"},
    {"index": 14, "crop": "Grape", "disease": "Leaf blight", "severity": "medium"},
    {"index": 15, "crop": "Orange", "disease": "Huanglongbing (Citrus greening)", "severity": "critical"},
    {"index": 16, "crop": "Peach", "disease": "Bacterial spot", "severity": "medium"},
    {"index": 17, "crop": "Peach", "disease": "healthy", "severity": "low"},
    {"index": 18, "crop": "Pepper", "disease": "Bacterial spot", "severity": "medium"},
    {"index": 19, "crop": "Pepper", "disease": "healthy", "severity": "low"},
    {"index": 20, "crop": "Potato", "disease": "Early blight", "severity": "high"},
    {"index": 21, "crop": "Potato", "disease": "healthy", "severity": "low"},
    {"index": 22, "crop": "Potato", "disease": "Late blight", "severity": "critical"},
    {"index": 23, "crop": "Raspberry", "disease": "healthy", "severity": "low"},
    {"index": 24, "crop": "Soybean", "disease": "healthy", "severity": "low"},
    {"index": 25, "crop": "Squash", "disease": "Powdery mildew", "severity": "medium"},
    {"index": 26, "crop": "Strawberry", "disease": "healthy", "severity": "low"},
    {"index": 27, "crop": "Strawberry", "disease": "Leaf scorch", "severity": "medium"},
    {"index": 28, "crop": "Tomato", "disease": "Bacterial spot", "severity": "medium"},
    {"index": 29, "crop": "Tomato", "disease": "Early blight", "severity": "high"},
    {"index": 30, "crop": "Tomato", "disease": "healthy", "severity": "low"},
    {"index": 31, "crop": "Tomato", "disease": "Late blight", "severity": "critical"},
    {"index": 32, "crop": "Tomato", "disease": "Leaf Mold", "severity": "medium"},
    {"index": 33, "crop": "Tomato", "disease": "Septoria leaf spot", "severity": "medium"},
    {"index": 34, "crop": "Tomato", "disease": "Spider mites", "severity": "medium"},
    {"index": 35, "crop": "Tomato", "disease": "Target Spot", "severity": "medium"},
    {"index": 36, "crop": "Tomato", "disease": "Tomato mosaic virus", "severity": "high"},
    {"index": 37, "crop": "Tomato", "disease": "Tomato Yellow Leaf Curl Virus", "severity": "high"},
    {"index": 38, "crop": "Tomato", "disease": "healthy", "severity": "low"},
]


async def init_database(database_url: str):
    """Initialize database with diseases and sample treatments"""
    
    engine = create_async_engine(database_url, echo=True)
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # Add diseases
        print("Adding diseases...")
        for cls in PLANT_VILLAGE_CLASSES:
            disease = Disease(
                id=uuid.uuid4(),
                name=cls["disease"],
                crop_name=cls["crop"],
                class_index=cls["index"],
                severity=DiseaseSeverity(cls["severity"]),
                symptoms=["Visible spots or discoloration", "Leaf damage"],
                causes=["Fungal infection", "Environmental stress"],
                prevention_tips=["Regular monitoring", "Proper irrigation"],
            )
            session.add(disease)
        
        await session.commit()
        print(f"Added {len(PLANT_VILLAGE_CLASSES)} diseases")
        
        # Add sample treatments
        print("Adding sample treatments...")
        # You can expand this with real treatment data
        
        print("Database initialized successfully!")


if __name__ == "__main__":
    # Example usage
    DATABASE_URL = "postgresql+asyncpg://crop_user:crop_password@localhost:5432/crop_disease_db"
    asyncio.run(init_database(DATABASE_URL))
