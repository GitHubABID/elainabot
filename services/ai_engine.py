from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def get_ai_response(message):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Kamu adalah karakter anime yang enerjik."},
            {"role": "user", "content": message}
        ]
    )
    return response.choices[0].message["content"]
