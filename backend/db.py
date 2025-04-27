from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

# You can use environment variables for security
MONGO_URI = os.getenv("MONGO_URI") or "mongodb+srv://rifatxia:hackathon123@cluster0.4alho2f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI, server_api=ServerApi('1'))

# Optionally, you can define a function to get a database
def get_db(db_name="memory_db"):
    return client[db_name]

# Test connection at import time (optional)
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"MongoDB connection error: {e}") 