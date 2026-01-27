import sqlite3
import os

def seed_data():
    # Ensure the database directory exists
    os.makedirs('database', exist_ok=True)
    
    conn = sqlite3.connect('database/plant_village.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS diseases (
            id INTEGER PRIMARY KEY,
            disease_name TEXT,
            treatment TEXT
        )
    ''')
    # The 38 classes in standard alphabetical order
    diseases = [
        (0, "Apple Scab", "Apply fungicides like captan or mancozeb. Rake and destroy fallen leaves."),
        (1, "Apple Black Rot", "Prune out dead wood and cankers. Apply sulfur-based fungicides."),
        (2, "Apple Cedar Rust", "Remove nearby Juniper trees. Apply preventative fungicides in spring."),
        (3, "Apple Healthy", "No treatment needed. Keep maintaining good soil health."),
        (4, "Blueberry Healthy", "No treatment needed. Ensure proper soil acidity (pH 4.5-5.5)."),
        (5, "Cherry Powdery Mildew", "Improve air circulation. Use potassium bicarbonate or neem oil."),
        (6, "Cherry Healthy", "No treatment needed. Keep pruning for sunlight access."),
        (7, "Corn Gray Leaf Spot", "Rotate crops. Use resistant hybrids and foliar fungicides."),
        (8, "Corn Common Rust", "Plant resistant varieties. Fungicides are rarely needed but available."),
        (9, "Corn Northern Leaf Blight", "Manage crop residue. Apply fungicides if infection is severe."),
        (10, "Corn Healthy", "No treatment needed. Ensure balanced nitrogen levels."),
        (11, "Grape Black Rot", "Remove mummified fruit. Apply copper-based fungicides."),
        (12, "Grape Esca (Black Measles)", "Protect pruning wounds. No cure exists; manage vine vigor."),
        (13, "Grape Leaf Blight", "Apply organic fungicides. Remove infected leaves immediately."),
        (14, "Grape Healthy", "No treatment needed. Practice regular vine pruning."),
        (15, "Orange Citrus Greening", "No cure. Control psyllid insects. Remove infected trees."),
        (16, "Peach Bacterial Spot", "Avoid overhead irrigation. Apply copper sprays during dormancy."),
        (17, "Peach Healthy", "No treatment needed. Monitor for borers."),
        (18, "Pepper Bell Bacterial Spot", "Use pathogene-free seeds. Avoid working in wet fields."),
        (19, "Pepper Bell Healthy", "No treatment needed. Provide consistent watering."),
        (20, "Potato Early Blight", "Ensure good nutrition. Apply fungicides like chlorothalonil."),
        (21, "Potato Late Blight", "Most critical: Destroy infected tubers. Apply systemic fungicides."),
        (22, "Potato Healthy", "No treatment needed. Hill potatoes to protect tubers."),
        (23, "Raspberry Healthy", "No treatment needed. Ensure good drainage."),
        (24, "Soybean Healthy", "No treatment needed. Monitor for aphids."),
        (25, "Squash Powdery Mildew", "Increase spacing. Apply milk-water spray or sulfur."),
        (26, "Strawberry Leaf Scorch", "Remove old leaves. Use resistant cultivars."),
        (27, "Strawberry Healthy", "No treatment needed. Mulch with straw."),
        (28, "Tomato Bacterial Spot", "Copper sprays may help. Avoid handling plants when wet."),
        (29, "Tomato Early Blight", "Prune lower leaves. Apply copper or mancozeb fungicides."),
        (30, "Tomato Late Blight", "Apply fungicides immediately. Remove and burn infected plants."),
        (31, "Tomato Leaf Mold", "Improve greenhouse ventilation. Use resistant varieties."),
        (32, "Tomato Septoria Leaf Spot", "Avoid overhead watering. Apply fungicides at first sign."),
        (33, "Tomato Spider Mites", "Increase humidity. Use insecticidal soap or neem oil."),
        (34, "Tomato Target Spot", "Provide wider plant spacing. Use protective fungicides."),
        (35, "Tomato Yellow Leaf Curl Virus", "Control whiteflies. Use reflective mulches or netting."),
        (36, "Tomato Mosaic Virus", "No cure. Remove infected plants. Wash hands after handling."),
        (37, "Tomato Healthy", "No treatment needed. Support with stakes or cages.")
    ]

    cursor.executemany("INSERT OR REPLACE INTO diseases (id, disease_name, treatment) VALUES (?, ?, ?)", diseases)
    
    conn.commit()
    conn.close()
    print("Database populated successfully with 38 classes!")

if __name__ == "__main__":
    seed_data()