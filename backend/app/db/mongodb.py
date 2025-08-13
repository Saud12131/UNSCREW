from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os 
from urllib.parse import quote_plus
load_dotenv()

# Get raw credentials from env
MONGO_USER = os.getenv("MONGO_USER", "")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "")
MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = os.getenv("MONGO_PORT", "27017")

# Create URI with escaped username and password
if MONGO_USER and MONGO_PASSWORD:
    MONGO_URI = f"mongodb://{quote_plus(MONGO_USER)}:{quote_plus(MONGO_PASSWORD)}@{MONGO_HOST}:{MONGO_PORT}"
else:
    MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}"

client = AsyncIOMotorClient(MONGO_URI)
db = client["interview_db"]