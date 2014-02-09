var match_url = new RegExp("^https://github.com/([^/]+)/([^/]+)");

function checkForValidUrl(tabId, changeInfo, tab) {
    var m = match_url.test(tab.url);
    if(!m) return;
    chrome.pageAction.show(tabId);
};

function getSettings(request, sendResponse) {
    var url = request.url;
    var m = match_url.exec(url);
    if(!m) {
        sendResponse({});
        return ;
    }
    var user = m[1];
    var repository = m[2];
    var json = localStorage[user + '/' + repository];
    var settings = {};
    if(json) try {
        settings = JSON.parse(json);
    } catch (e) {};

    var default_json = localStorage['default_settings'];
    var default_settings = {};
    if(default_json) try {
        default_settings = JSON.parse(default_json);
    } catch (e) {};

    sendResponse({
        url: url,
        settings: settings,
        default_settings: default_settings
    });
}

function setSettings(request, sendResponse) {
    var url = request.url;
    var m = match_url.exec(url);
    if(!m) {
        sendResponse({});
        return ;
    }
    var user = m[1];
    var repository = m[2];
    console.log(JSON.stringify(request.settings));
    localStorage[user + '/' + repository] = JSON.stringify(request.settings);
    localStorage['default_settings'] = JSON.stringify(request.default_settings);

    sendResponse({});
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        var action = request.action;
        if (action === "get-settings") {
            getSettings(request, sendResponse);
        } else if(action === "set-settings") {
            setSettings(request, sendResponse);
        } else {
            sendResponse({});
        }
    }
);

chrome.tabs.onUpdated.addListener(checkForValidUrl);
