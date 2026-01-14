from dotenv import load_dotenv
import os

load_dotenv(override=True)  # <- INI PENTING

class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
