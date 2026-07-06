
// Message listener

chrome.runtime.onMessage.addListener((message) => {

    if (message.action === "openReaderMode") {

        const blocks = extractBlocks();

        chrome.runtime.sendMessage({
            action: "openReader",
            data: {
                blocks,
                title: document.title,
                url: window.location.href
            }
        });

    }

});

// Content extraction

function extractBlocks() {

    // Prefer the main article content when available

    const root =
        document.querySelector("article") ||
        document.querySelector("main") ||
        document.body;

    const elements = root.querySelectorAll("p, h1, h2, h3, img");

    const blocks = [];

    elements.forEach(el => {

        if (el.tagName === "IMG") {

            if (el.src) {
                blocks.push({
                    type: "image",
                    value: el.src
                });
            }

        } else {

            const text = el.innerText?.trim();

            // Ignore very short text blocks

            if (text && text.length > 20) {
                blocks.push({
                    type: "text",
                    value: text
                });
            }

        }

    });

    return blocks;

}