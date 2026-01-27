"""
Seed treatment database with real recommendations for PlantVillage diseases
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.models.disease import Disease
from app.models.treatment import Treatment, TreatmentType, CropStage
import uuid


# Real treatment data for common diseases
TREATMENTS = [
    # Tomato Early Blight
    {
        "disease_name": "Early blight",
        "crop": "Tomato",
        "treatments": [
            {
                "type": TreatmentType.CHEMICAL,
                "name": "Chlorothalonil Fungicide",
                "dosage": {"amount": "2-3", "unit": "tablespoons per gallon", "frequency": "Every 7-10 days"},
                "instructions": {"en": "Apply when plants are dry. Cover all foliage thoroughly."},
                "effectiveness": 0.85,
                "precautions": ["Wear protective gear", "Do not apply before rain"],
            },
            {
                "type": TreatmentType.ORGANIC,
                "name": "Copper-based Fungicide",
                "dosage": {"amount": "1-2", "unit": "tablespoons per gallon", "frequency": "Weekly"},
                "instructions": {"en": "Spray in early morning or evening. Repeat after rain."},
                "effectiveness": 0.70,
                "precautions": ["Avoid during hot weather"],
            },
            {
                "type": TreatmentType.CULTURAL,
                "name": "Crop Rotation & Sanitation",
                "dosage": None,
                "instructions": {"en": "Remove infected leaves immediately. Practice 3-year crop rotation."},
                "effectiveness": 0.60,
                "precautions": ["Burn or dispose infected plant material"],
            },
        ],
    },
    # Tomato Late Blight
    {
        "disease_name": "Late blight",
        "crop": "Tomato",
        "treatments": [
            {
                "type": TreatmentType.CHEMICAL,
                "name": "Mancozeb Fungicide",
                "dosage": {"amount": "2", "unit": "tablespoons per gallon", "frequency": "Every 5-7 days"},
                "instructions": {"en": "Apply preventatively before disease appears. Critical in humid conditions."},
                "effectiveness": 0.90,
                "precautions": ["Highly toxic - use protective equipment"],
            },
          {
                "type": TreatmentType.CULTURAL,
                "name": "Immediate Removal",
                "dosage": None,
                "instructions": {"en": "Remove and destroy all infected plants immediately to prevent spread."},
                "effectiveness": 0.75,
                "precautions": ["Do not compost infected material"],
            },
        ],
    },
    # Potato Late Blight
    {
        "disease_name": "Late blight",
        "crop": "Potato",
        "treatments": [
            {
                "type": TreatmentType.CHEMICAL,
                "name": "Copper Hydroxide",
                "dosage": {"amount": "1.5-2", "unit": "lbs per acre", "frequency": "Every 7 days"},
                "instructions": {"en": "Begin applications when conditions favor disease development."},
                "effectiveness": 0.85,
                "cost_estimate": "$15-25 per acre",
            },
        ],
    },
    # Apple Scab
    {
        "disease_name": "Apple scab",
        "crop": "Apple",
        "treatments": [
            {
                "type": TreatmentType.CHEMICAL,
                "name": "Captan Fungicide",
                "dosage": {"amount": "2", "unit": "tablespoons per gallon", "frequency": "Every 7-10 days during wet weather"},
                "instructions": {"en": "Start at green tip stage. Continue through petal fall."},
                "effectiveness": 0.88,
            },
            {
                "type": TreatmentType.CULTURAL,
                "name": "Sanitation & Pruning",
                "dosage": None,
                "instructions": {"en": "Remove fallen leaves in autumn. Prune for better air circulation."},
                "effectiveness": 0.65,
            },
        ],
    },
    # Grape Black Rot
    {
        "disease_name": "Black rot",
        "crop": "Grape",
        "treatments": [
            {
                "type": TreatmentType.CHEMICAL,
                "name": "Mancozeb",
                "dosage": {"amount": "3", "unit": "lbs per 100 gallons", "frequency": "Every 10-14 days"},
                "instructions": {"en": "Apply from bud break through fruit set."},
                "effectiveness": 0.82,
            },
        ],
    },
    # Corn Northern Leaf Blight
    {
        "disease_name": "Northern Leaf Blight",
        "crop": "Corn",
        "treatments": [
            {
                "type": TreatmentType.CHEMICAL,
                "name": "Azoxystrobin",
                "dosage": {"amount": "6-15.5", "unit": "fl oz per acre", "frequency": "Once at VT stage"},
                "instructions": {"en": "Apply when first symptoms appear on lower leaves."},
                "effectiveness": 0.80,
            },
            {
                "type": TreatmentType.CULTURAL,
                "name": "Resistant Varieties",
                "dosage": None,
                "instructions": {"en": "Plant resistant hybrids. Rotate crops annually."},
                "effectiveness": 0.85,
            },
        ],
    },
]


async def seed_treatments(database_url: str):
    """Seed treatment database"""
    
    engine = create_async_engine(database_url, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        for treatment_group in TREATMENTS:
            # Find the disease
            result = await session.execute(
                select(Disease).where(
                    Disease.name == treatment_group["disease_name"],
                    Disease.crop_name == treatment_group["crop"]
                )
            )
            disease = result.scalars().first()
            
            if not disease:
                print(f"Disease not found: {treatment_group['disease_name']} ({treatment_group['crop']})")
                continue
            
            # Add treatments
            for t in treatment_group["treatments"]:
                treatment = Treatment(
                    id=uuid.uuid4(),
                    disease_id=disease.id,
                    type=t["type"],
                    name=t["name"],
                    dosage=t.get("dosage"),
                    instructions=t["instructions"],
                    effectiveness_score=t.get("effectiveness"),
                    precautions=t.get("precautions"),
                    cost_estimate=t.get("cost_estimate"),
                    crop_stage=CropStage.ANY,
                )
                session.add(treatment)
            
            print(f"Added {len(treatment_group['treatments'])} treatments for {disease.name}")
        
        await session.commit()
        print("\n✅ Treatment database seeded successfully!")


if __name__ == "__main__":
    DATABASE_URL = "postgresql+asyncpg://crop_user:crop_password@localhost:5432/crop_disease_db"
    asyncio.run(seed_treatments(DATABASE_URL))
