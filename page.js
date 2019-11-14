
"use strict";


const languageValues = {
    c:   [ "c89"  , "c95"  , "c99"  , "c11"  , "c17", "c2x" ],
    cxx: [ "cxx98", "cxx03", "cxx11", "cxx14", "cxx17", "cxx20" ]
};


const rules = [
    {   // Match some "See also", for example at the bottom of https://en.cppreference.com/w/cpp/named_req/DefaultConstructible
        match: elem => {
            return elem.parentElement.parentElement.classList.contains("t-lines");
        }, elem: elem => {
            return elem.parentElement.parentElement.parentElement.parentElement;
        }
    },
    {   // Some "blocks" are implemented as tables; in that case, hide the row
        match: elem => {
            return elem.parentElement.tagName.toLowerCase() === "td";
        }, elem: elem => {
            return elem.parentElement.parentElement;
        }
    },
    {   // Try to hide links in the main page? Maybe hacky, needs testing
        match: elem => {
            return elem.previousElementSibling && ["a", "b"].indexOf(elem.previousElementSibling.tagName.toLowerCase()) !== -1;
        }, elem: elem => {
            return elem.previousElementSibling;
        }
    },
    {   // Inline revision notes should be hidden
        match: elem => {
            return elem.parentElement.parentElement.classList.contains("t-rev-inl");
        }, elem: elem => {
            return elem.parentElement.parentElement;
        }
    },
    {   // If the whole page applies to a specific version, hide all of it
        match: elem => {
            return elem.parentElement.tagName.toLowerCase() === "h1";
        }, elem: elem => {
            return elem.parentElement.nextElementSibling;
        }
    }
];


function setClass(className, state) {
    document.body.classList[state ? "add" : "remove"](className);
}

function updateState(state) {
    for(const language in state) {
        setClass(`select-thy-${language}`, state[language].enabled);

        let passedCurrentVer = false;
        for(const value of languageValues[language]) {
            setClass(`hide-since-thy-${value}`, passedCurrentVer);
            setClass(`hide-until-thy-${value}`, !passedCurrentVer);
            if(value === state[language].setting) {
                passedCurrentVer = true;
            }
        }

        setClass(`hide-thy-${language}-version-tags`, !state[language].show_versions);
    }
}


browser.runtime.onMessage.addListener(request => {
    if (!request.sender || request.sender !== "Select Thy Language") return;
    switch(request.topic) {
        case "stateChange":
            updateState(request.content);
    }
});


// Parse the document to label things as ".is-since-" and ".is-until-"

for(const elem of document.getElementsByClassName("t-mark-rev")) {
    // Determine language revision
    let revInfo = null;
    for(const cl of elem.classList) {
        revInfo = /^t-(since|until)-([a-z0-9]+)$/.exec(cl);
        if(revInfo) break;
    }
    // If the revision marker isn't related to one of our languages, skip it
    if(revInfo === null) continue;

    const className = `is-${revInfo[1]}-thy-${revInfo[2]}`;
    // Add the class to the revision tag anyways, in case we end up targeting an element it's outside of
    elem.classList.add(className);

    let target = elem;
    rules.forEach(rule => {
        if(rule.match(target)) {
            target = rule.elem(target);
        }
    })
    target.classList.add(className);
}

// Ask for the current state
browser.runtime.sendMessage({ sender: "Select Thy Language", topic: "getState" });
