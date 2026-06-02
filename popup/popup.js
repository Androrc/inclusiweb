async function sendAction(action) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(tab.id, { action });
}

document.getElementById("increaseFont").addEventListener("click", () => {
    sendAction("increaseFont");
});

document.getElementById("decreaseFont").addEventListener("click", () => {
    sendAction("decreaseFont");
});

document.getElementById("toggleContrast").addEventListener("click", () => {
    sendAction("toggleContrast");
});