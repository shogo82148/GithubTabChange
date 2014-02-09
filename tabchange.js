chrome.extension.sendMessage(
    {
        action: "get-settings",
        url: location.href
    },
    function(response) {
        var tabsize = response.settings.tabsize || response.default_settings.tabsize;
        if(!tabsize) return ;
        var css = document.createElement('link');
        css.href = chrome.extension.getURL('tab-size-' + tabsize + '.css');
        css.rel = 'stylesheet';
        css.type = 'text/css';
        var body = document.getElementsByTagName('body')[0];
        body.insertBefore(css, body.firstChild);
    }
);
