chrome.runtime.onMessage.addListener((message) => {

    if (message.action === "openReader") {

        chrome.storage.local.set({
            readerData: message.data
        }, () => {

            chrome.tabs.create({
                url: chrome.runtime.getURL("reader/reader.html")
            });

        });
    }
});