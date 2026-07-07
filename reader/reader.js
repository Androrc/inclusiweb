
// Font settings

let fontSize = 18;
const minFont = 12;
const maxFont = 32;

let currentText = "";

// Reader state

let lastSpoken = null;
let hoverReadEnabled = false;

// Initialization

chrome.storage.local.get("readerData", (data) => {

    const info = data.readerData;
    if (!info) return;

    document.getElementById("title").innerText = info.title || "Leitura";

    renderBlocks(info.blocks);

    currentText = info.blocks
        .filter(b => b.type === "text")
        .map(b => b.value)
        .join(" ");
});

// Content rendering

function renderBlocks(blocks) {

    const container = document.getElementById("content");
    container.innerHTML = "";

    blocks.forEach(block => {

        if (block.type === "text") {
            const p = document.createElement("p");
            p.innerText = block.value;
            p.classList.add("reader-paragraph");
            container.appendChild(p);
        }

        if (block.type === "image") {
            const img = document.createElement("img");
            img.src = block.value;
            container.appendChild(img);
        }

    });
}

// Text controls

function increaseFont() {

    if (fontSize < maxFont) {
        fontSize += 2;
        document.body.style.fontSize = fontSize + "px";
    }

}

function decreaseFont() {

    if (fontSize > minFont) {
        fontSize -= 2;
        document.body.style.fontSize = fontSize + "px";
    }

}

// Display modes

function toggleContrast() {

    document.body.classList.toggle("contrast");

    document
        .getElementById("btnContrast")
        .classList.toggle("active");

    const contrastEnabled = document.body.classList.contains("contrast");

    // Trade all icons
    document.querySelectorAll(".icon").forEach(icon => {

        if (contrastEnabled) {
            icon.src = icon.src.replace(".svg", "-yellow.svg");
        } else {
            icon.src = icon.src.replace("-yellow.svg", ".svg");
        }

    });

    // Trade logo
    const logo = document.querySelector(".logo img");

    if (contrastEnabled) {
        logo.src = "icons/logo-yellow.svg";
    } else {
        logo.src = "icons/logo.svg";
    }

}

function toggleDyslexia() {

    document.body.classList.toggle("dyslexia");

    document
        .getElementById("btnDyslexia")
        .classList.toggle("active");

}

// Speech controls

function stop() {
    speechSynthesis.cancel();
    limparMarcacoes();

    document.getElementById("btnReadAll")
        .classList.remove("active");
}

// Hover reading

function speakParagraph(el) {

    const text = el.innerText?.trim();

    if (!text) return;

    if (lastSpoken === text) return;

    lastSpoken = text;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";

    speechSynthesis.speak(utterance);
}

// Full page reading

function readAllWithHighlight() {

    const btn = document.getElementById("btnReadAll");
    btn.classList.add("active");

    const paragraphs = Array.from(document.querySelectorAll(".reader-paragraph"));

    let index = 0;

    function readNext() {

        if (index >= paragraphs.length) {
            btn.classList.remove("active");
            limparMarcacoes();
            return;
        }

        const p = paragraphs[index];

        document.querySelectorAll(".highlight")
            .forEach(el => el.classList.remove("highlight"));

        p.classList.add("highlight");

        const text = p.innerText;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pt-BR";

        utterance.onend = () => {

            index++;

            if (index >= paragraphs.length) {

                btn.classList.remove("active");
                limparMarcacoes();

            } else {

                readNext();

            }

        };
        speechSynthesis.speak(utterance);
    }

    speechSynthesis.cancel();
    readNext();
}

// Highlight management

function limparMarcacoes() {

    const elementosMarcados = document.querySelectorAll(".highlight");

    elementosMarcados.forEach(elemento => {
        elemento.classList.remove("highlight");
    });

    lastSpoken = null;

    window.speechSynthesis.cancel();
}

// Button events

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("btnAplus")
        .addEventListener("click", increaseFont);

    document.getElementById("btnAminus")
        .addEventListener("click", decreaseFont);

    document.getElementById("btnContrast")
        .addEventListener("click", toggleContrast);

    document.getElementById("btnDyslexia")
        .addEventListener("click", toggleDyslexia);

    document.getElementById("btnStop")
        .addEventListener("click", stop);

    document.getElementById("btnReadAll")
        .addEventListener("click", readAllWithHighlight);

    document.getElementById("btnToggleHover")
    .addEventListener("click", () => {

        hoverReadEnabled = !hoverReadEnabled;

        document
            .getElementById("btnToggleHover")
            .classList.toggle("active", hoverReadEnabled);

        if (!hoverReadEnabled) {

            speechSynthesis.cancel();
            limparMarcacoes();

        }
    });
});

// Hover event

document.addEventListener("mouseover", (e) => {

    if (!hoverReadEnabled) return;

    if (speechSynthesis.speaking && !lastSpoken) return;

    const p = e.target.closest(".reader-paragraph");

    if (!p) return;

    document.querySelectorAll(".highlight")
        .forEach(el => el.classList.remove("highlight"));

    p.classList.add("highlight");

    speakParagraph(p);

});