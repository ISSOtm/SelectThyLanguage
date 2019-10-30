
"use strict";
if(!browser) {
    browser = chrome;
}


function sendMessage(topic, content) {
    return browser.runtime.sendMessage({ sender: "Select Thy Language", topic: topic, content: content });
}

(async function() {
    let state = await sendMessage("state");
    let selectors = document.getElementById("selectors");

    for(const language in state) {
        const langElem = selectors.querySelector(`[data-language="${language}"]`);
        langElem.querySelector(".enable").checked        = state[language].enabled;
        langElem.querySelector(".selection").value       = state[language].setting;
        langElem.querySelector(".show-versions").checked = state[language].show_versions;

        (function(language, langElem) {
            langElem.addEventListener("change", function() {
                state[language].enabled       = langElem.querySelector(".enable").checked;
                state[language].setting       = langElem.querySelector(".selection").value;
                state[language].show_versions = langElem.querySelector(".show-versions").checked;

                sendMessage("stateChange", state);
            });
        })(language, langElem);
    }
})();
