
// Message handler (popup / content script)

chrome.runtime.onMessage.addListener((message) => {

    if (message.action === "openReader") {

        // Store extracted page data before opening reader

        chrome.storage.local.set({
            readerData: message.data
        }, () => {

            // Open reader page

            chrome.tabs.create({
                url: chrome.runtime.getURL("reader/reader.html")
            });

        });
    }
});

// Keyboard shortcut handler (commands)

chrome.commands.onCommand.addListener((command) => {

    if (command === "open-reader-mode") {

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            const tab = tabs[0];

            if (!tab?.id) return;

            chrome.tabs.sendMessage(tab.id, {
                action: "openReaderMode"
            });

        });
    }
});