const input = document.querySelector(".chat-input");
const sendBtn = document.querySelector(".send-btn");
const chatContainer = document.querySelector(".chat-container");
const toggleAudioBtn = document.getElementById("toggle-audio");

const bgmList = [
    "/static/audio/backsound-animenya.mp3",
    "/static/audio/KitaKeSana.mp3",
    "/static/audio/TheAboutYou.mp3"
];

let audioEnabled = false;  
let bgmStarted = false;

const bgm = new Audio();
bgm.volume = 0.35;
bgm.loop = false;

const sendSfx = new Audio("/static/audio/TheAboutYou.mp3");
sendSfx.volume = 0.6;

function playRandomBGM() {
    if (!audioEnabled) return;

    const randomIndex = Math.floor(Math.random() * bgmList.length);
    bgm.src = bgmList[randomIndex];
    bgm.play().catch(() => {});
}

// auto lanjut lagu
bgm.addEventListener("ended", () => {
    playRandomBGM();
});

toggleAudioBtn.textContent = "🔇";

toggleAudioBtn.addEventListener("click", () => {
    audioEnabled = !audioEnabled;

    bgm.muted = !audioEnabled;
    sendSfx.muted = !audioEnabled;

    toggleAudioBtn.textContent = audioEnabled ? "🔊" : "🔇";

    if (audioEnabled) {
        if (!bgmStarted) {
            bgmStarted = true;
            bgm.volume = 0;
            playRandomBGM();

            // fade in
            let vol = 0;
            const fade = setInterval(() => {
                if (vol < 0.35) {
                    vol += 0.02;
                    bgm.volume = vol;
                } else {
                    clearInterval(fade);
                }
            }, 120);
        } else {
            bgm.play().catch(() => {});
        }
    } else {
        bgm.pause();
    }
});

function typeBotMessage(fullText, wrapper) {
    const bubble = wrapper.querySelector(".bubble-left");
    let i = 0;
    const speed = 15;

    const formattedText = fullText
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    function typing() {
        if (i < formattedText.length) {
            bubble.innerHTML = formattedText.slice(0, i + 1);
            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
}

function addMessage(text, side = "right", withTyping = false) {
    const wrapper = document.createElement("div");
    wrapper.classList.add(side === "right" ? "msg-right" : "msg-left");

    if (side === "left") {
        const avatar = document.createElement("img");
        avatar.src = "/static/Image/elaina-profil.jpg";
        avatar.classList.add("msg-avatar");
        wrapper.appendChild(avatar);
    }

    const bubble = document.createElement("div");
    bubble.classList.add(side === "right" ? "bubble-right" : "bubble-left");

    if (side === "right" || !withTyping) {
        bubble.innerHTML = text.replace(/\n/g, "<br>");
    }

    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (side === "left" && withTyping) {
        typeBotMessage(text, wrapper);
    }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // SFX hanya kalau audio ON
    if (audioEnabled) {
        sendSfx.currentTime = 0;
        sendSfx.play().catch(() => {});
    }

    addMessage(message, "right");
    input.value = "";

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => addMessage(data.reply, "left", true))
    .catch(() => addMessage("Server error 😵‍💫", "left", true));
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        bgm.pause();
    } else if (bgmStarted && audioEnabled) {
        bgm.play().catch(() => {});
    }
});

document.addEventListener("DOMContentLoaded", () => {
    addMessage("Hi, aku Elaina. Ada yang bisa aku bantu?", "left", true);
});
