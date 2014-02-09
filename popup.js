var background = chrome.extension.getBackgroundPage();
var radio_custom = document.getElementById('radio-custom');
var radio_default = document.getElementById('radio-default');
var tab_custom = document.getElementById('tab-custom');
var tab_default = document.getElementById('tab-default');
var save_button = document.getElementById('save-button');

chrome.tabs.query({active: true}, function(tabs) {
    background.getSettings(
        {
            url: tabs[0].url
        },
        init
    );
});

save_button.addEventListener('click', function () {
    save();
});


function init(r) {
    console.log(r);
    if(r.settings.tabsize) {
        radio_custom.checked = true;
        setValue(tab_custom, r.settings.tabsize || 8);
        setValue(tab_default, r.default_settings.tabsize || 8);
    } else {
        radio_default.checked = true;
        setValue(tab_custom, r.default_settings.tabsize || 8);
        setValue(tab_default, r.default_settings.tabsize || 8);
    }
}

function save() {
    var settings = {};
    var default_settings = {
        tabsize: getValue(tab_default)
    };
    if(radio_custom.checked) {
        settings.tabsize = getValue(tab_custom);
    }
    chrome.tabs.query({active: true}, function(tabs) {
        background.setSettings(
            {
                url: tabs[0].url,
                settings: settings,
                default_settings: default_settings
            },
            function() {}
        );
    });
}

function setValue(elem, val) {
    for(var i = 0; i < elem.options.length; i++) {
        if(elem.options[i].value === val) {
            elem.selectedIndex = i;
            return ;
        }
    }
}

function getValue(elem) {
    return elem.options[elem.selectedIndex].value;
}
