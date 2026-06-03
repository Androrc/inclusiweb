async function sendAction(action) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(tab.id, { action });
}

document.getElementById("openReader").addEventListener("click", () => {
    sendAction("openReaderMode");
});