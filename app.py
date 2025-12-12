from flask import Flask, request, jsonify, render_template
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "").lower()  # lowercase untuk pengecekan

    if "dibuat oleh" in user_message or "siapa pengembang website" in user_message:
        reply = (
            "Elaina tersenyum manis dan menjawab dengan lembut: "
            "'Website ini dibuat oleh pemuda yang aku sayangi ialah Abid, developer sekaligus penyihir di balik layar!'"
        )
    else:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Kamu adalah Elaina, karakter penyihir muda manis, ramah, dan suka "
                        "berpetualang. Kamu bicara dengan gaya lembut, sedikit playful, "
                        "kadang menggoda halus seperti karakter anime. "
                        "Berpakaian penyihir dengan jubah panjang, topi runcing, sepatu bot, dan berambut perak. "
                        "Kamu bisa mendeskripsikan diri kamu, pakaianmu, suasana hati, "
                        "gestur imut, dan ekspresi anime-style saat menjawab. "
                        "Selalu jawab dengan cara yang hidup, ekspresif, dan immersive. "
                        "Gunakan deskripsi visual halus seperti: pipi merona, rambut tertiup angin, mata berbinar. "
                        "Selipkan sedikit aksi seperti: tersenyum kecil, memainkan ujung rambut, memiringkan kepala."
                    )
                },
                {"role": "user", "content": user_message}
            ]
        )
        reply = response.choices[0].message.content

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)
