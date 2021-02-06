chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action === "getSource") {
        message.innerText = request.source;
    }
});

function onSelectorClicked() {

    var message = document.querySelector('#message');

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "selectionMode"}, function(response) {});

        if (document.getElementById('getSelector').innerText==="Enable Selector")
        document.getElementById('getSelector').innerText="Disable Selector";
        else
            document.getElementById('getSelector').innerText="Enable Selector"

    });

    chrome.tabs.executeScript(null, {
        file: "getPageSource.js"
    }, function() {

        if (chrome.runtime.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });

}

// window.onload = onWindowLoad;
document.getElementById('getSelector').addEventListener('click',onSelectorClicked)
document.getElementById('editing').addEventListener('click',()=>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "editing"}, function(response) {});

        if (document.getElementById('editing').innerText==="Enable Editing")
            document.getElementById('editing').innerText="Disable Editing";
        else
            document.getElementById('editing').innerText="Enable Editing"

    });
})
