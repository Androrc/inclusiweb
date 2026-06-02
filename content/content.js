console.log("Content Script carregado");

let currentSize = 100;
let contrastEnabled = false;

// fonte + legibilidade
function applyFontSize() {
    document.documentElement.style.fontSize = currentSize + "%";
}

// aplica ao iniciar
applyFontSize();

// listener de mensagens
chrome.runtime.onMessage.addListener((message) => {

    switch (message.action) {

        case "increaseFont":
            if (currentSize < 160) {
                currentSize += 10;
                applyFontSize();
            }
            break;

        case "decreaseFont":
            if (currentSize > 70) {
                currentSize -= 10;
                applyFontSize();
            }
            break;

        case "toggleContrast":
            contrastEnabled = !contrastEnabled;

            if (contrastEnabled) {
                document.documentElement.classList.add("inclusi-contrast");
            } else {
                document.documentElement.classList.remove("inclusi-contrast");
            }

            break;
    }

});