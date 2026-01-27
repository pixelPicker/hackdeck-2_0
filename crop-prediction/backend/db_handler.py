import sqlite3
import os

DB_PATH = "database/plant_village.db"

def init_db():
    conn = sqlite3.connect('database/plant_village.db')
    cursor = conn.cursor()
    
    # Create Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS diseases (
            id INTEGER PRIMARY KEY,
            disease_name TEXT,
            treatment TEXT
        )
    ''')

    # Check if we have data (count rows)
    cursor.execute("SELECT COUNT(*) FROM diseases")
    if cursor.fetchone()[0] == 0:
        print("🌱 First run detected: Seeding database...")
        # Add your list of 38 diseases here
        diseases = [
            (0, "Apple Scab", "Apply fungicides..."),
            (1, "Apple Black Rot", "Prune out dead wood..."),
            # ... (add the rest)
        ]
        cursor.executemany("INSERT INTO diseases VALUES (?, ?, ?)", diseases)
        conn.commit()
    
    conn.close()
    print("Database check complete.")

def get_disease_info(index):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM diseases WHERE id = ?", (index,))
    result = cursor.fetchone()
    conn.close()
    return result