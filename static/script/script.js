const input = document.querySelector(".chat-input");
const sendBtn = document.querySelector(".send-btn");
const chatContainer = document.querySelector(".chat-container");

function typeBotMessage(fullText, wrapper) {
    const bubble = wrapper.querySelector(".bubble-left");
    let i = 0;
    const speed = 25;

    function typing() {
        if (i < fullText.length) {
            bubble.textContent += fullText.charAt(i);
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

    if (side === "right" || withTyping === false) {
        bubble.textContent = text;
    }

    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (side === "left" && withTyping === true) {
        typeBotMessage(text, wrapper);
    }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "right");

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    })
        .then((res) => res.json())
        .then((data) => {
            addMessage(data.reply, "left", true); 
        })
        .catch(() => {
            addMessage("Maaf, server lagi error.", "left", true);
        });

    input.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
    addMessage("Hi, aku Elaina. Senang bertemu denganmu!", "left", true);
});

document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("bgm");
    const btn = document.getElementById("toggle-audio");

    audio.volume = 0.5; 

    audio.play().catch(() => {
        console.log("Autoplay diblok, tunggu user interaction.");
    });

    btn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            btn.textContent = "🔊";
        } else {
            audio.pause();
            btn.textContent = "🔈";
        }
    });
});

const textElement = document.querySelector(".typing-header");
const fullText = textElement.textContent;
textElement.textContent = ""; // mulai kosong
let i = 0;

function typeAndDelete() {
    i = 0;
    textElement.textContent = "";

    // Fase mengetik
    function typing() {
        if (i < fullText.length) {
            textElement.textContent += fullText.charAt(i);
            i++;
            setTimeout(typing, 150);
        } else {
            // setelah selesai mengetik, delay sebentar lalu hapus dari kanan ke kiri
            setTimeout(deleting, 1000);
        }
    }

    // Fase menghapus
    function deleting() {
        if (i > 0) {
            textElement.textContent = fullText.substring(0, i - 1);
            i--;
            setTimeout(deleting, 100); // kecepatan hapus lebih cepat
        } else {
            // setelah selesai menghapus, ulang animasi
            setTimeout(typeAndDelete, 500);
        }
    }

    typing();
}

// mulai animasi
typeAndDelete();
