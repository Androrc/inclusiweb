// fonte
let fontSize = 18;
const minFont = 12;
const maxFont = 32;

let currentText = "";

// estados
let hoverReadEnabled = true;
let lastSpoken = null;

// ===============================
// INIT
// ===============================
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

// ===============================
// RENDER
// ===============================
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

// ===============================
// CONTROLES DE TEXTO
// ===============================
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

// ===============================
// VISUAL
// ===============================
function toggleContrast() {
    document.body.classList.toggle("contrast");
}

function toggleDyslexia() {
    document.body.classList.toggle("dyslexia");
}

// PARAR DE LER
function stop() {
    speechSynthesis.cancel();
    limparMarcacoes();
}

// ===============================
// TTS POR PARÁGRAFO (HOVER)
// ===============================
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

// ===============================
// LEITURA COMPLETA COM DESTAQUE
// ===============================
function readAllWithHighlight() {

    const paragraphs = Array.from(document.querySelectorAll(".reader-paragraph"));

    let index = 0;

    function readNext() {

        if (index >= paragraphs.length) return;

        const p = paragraphs[index];

        document.querySelectorAll(".highlight")
            .forEach(el => el.classList.remove("highlight"));

        p.classList.add("highlight");

        const text = p.innerText;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pt-BR";

        utterance.onend = () => {
            index++;
            readNext();
        };

        speechSynthesis.speak(utterance);
    }

    speechSynthesis.cancel();
    readNext();
}

// LIMPAR MARCAÇÃO
function limparMarcacoes() {
    const elementosMarcados = document.querySelectorAll('.highlight');

    elementosMarcados.forEach(elemento => {
        elemento.classList.remove('highlight');
    });
    
    lastSpoken = null;
    
    window.speechSynthesis.cancel();
}

// ===============================
// BOTÕES (EVENTOS)
// ===============================
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

            document.getElementById("btnToggleHover").innerText =
                hoverReadEnabled ? "🖱 Hover ON" : "🖱 Hover OFF";

            if (!hoverReadEnabled) {
                speechSynthesis.cancel();
                limparMarcacoes();
            }
        });
});

// ===============================
// HOVER READING
// ===============================
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