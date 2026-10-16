import os
import json
import psycopg2
from dotenv import load_dotenv

load_dotenv('.env')
db_url = os.getenv('DATABASE_URL')
conn = psycopg2.connect(db_url)
cur = conn.cursor()

# 1. Update Black Forest explicitly
cur.execute("""
    UPDATE products 
    SET image_name = '/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp' 
    WHERE id = 1 
       OR slug = 'black-forest' 
       OR name ILIKE 'Black Forest' 
       OR image_name ILIKE '%%black_forest%%'
""")
print(f"Updated Black Forest in products: {cur.rowcount} rows affected.")

# 2. Update category image for Cakes
cur.execute("""
    UPDATE categories 
    SET image_name = '/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp' 
    WHERE slug = 'cakes' 
       OR name ILIKE '%%cake%%' 
       OR image_name ILIKE '%%black_forest%%'
""")
print(f"Updated categories: {cur.rowcount} rows affected.")

# 3. Update all other cakes in the database using products-data.json
products_data = json.load(open('lib/products-data.json', encoding='utf-8'))
cake_items = [p for p in products_data if p.get('category') == 'cakes']

updated_count = 0
for p in cake_items:
    name = p['name']
    image = p['image']
    slug = p['id']
    cur.execute("""
        UPDATE products 
        SET image_name = %s 
        WHERE slug = %s OR name ILIKE %s
    """, (image, slug, name))
    updated_count += cur.rowcount

print(f"Updated {updated_count} cake rows in DB to use /PRODUCT_IMAGES/cakes/NORMAL CAKES/*.webp")

conn.commit()

# Verify
cur.execute("""
    SELECT id, name, slug, image_name 
    FROM products 
    WHERE name ILIKE 'Black Forest' OR slug ILIKE '%%black-forest%%'
""")
print("\nVerification for Black Forest:")
for r in cur.fetchall():
    print(r)

# Verify first 10 cakes
cur.execute("""
    SELECT id, name, slug, image_name 
    FROM products 
    ORDER BY id 
    LIMIT 15
""")
print("\nFirst 15 products in DB:")
for r in cur.fetchall():
    print(r)

cur.close()
conn.close()
