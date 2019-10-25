
"use strict";
if(!browser) {
    browser = chrome;
}


// The default settings are picked from the latest GCC's defaults, currently 9.2.0
let state = {
    cxx: { enabled: false, setting: "cxx14" },
    c:   { enabled: false, setting: "c17" }
};

browser.runtime.onMessage.addListener(async request => {
    if (!request.sender || request.sender !== "Select Thy Language") return;
    switch(request.topic) {
        case "state":
            return Promise.resolve(state);

        case "stateChange":
            state = request.content;
        case "getState":
            // Broadcast state change to content scripts
            for(let tab of await browser.tabs.query({ url: "*://en.cppreference.com/*" })) {
                browser.tabs.sendMessage(tab.id, { sender: "Select Thy Language", topic: "stateChange", content: state });
            }
            return;
    }
});
