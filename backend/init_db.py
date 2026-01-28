#!/usr/bin/env python3
"""
Initialize database tables
"""
import asyncio
from app.db.base import engine, Base
from app.models import diagnosis, disease_alert

async def init_db():
    """Create all database tables"""
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Database tables created successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())
