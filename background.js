if (window == top) {
    window.addEventListener('keyup', doKeyPress, false);
}

var bookmarks = {};

function openUrl(url) {
    var handle = open(url);
    // handle.blur();
    // window.focus(); 
    // chrome.tabs.update({url: url});
}

function stopVideo() {
    const video = document.querySelector(".video-stream.html5-main-video");
    if (video) {
        video.pause();
    }    
}

function sendToObsidian() {
    const curUrl = window.location.href;
    const template = getObsLink(vidTemplate(curUrl));
    openUrl(template);    
}

bookmarks['V'] = sendToObsidian;

bookmarks['B'] = function() {
    stopVideo();
    sendToObsidian();
};

bookmarks['S'] = 'http://superuser.com';

function getObsLinkOld(dataX) {
    const data = encodeURIComponent(dataX);
    return `obsidian://adv-uri?vault=obsidian&daily=true&data=${data}&mode=append`;
}

function getObsLinkTest(data) {
    return "obsidian://daily?vault=obsidian&content=Hello&silent=true";
}

function getObsLink(dataX) {
    const data = encodeURIComponent(dataX);
    return "obsidian://daily?vault=obsidian&content="+data;
}

function vidTemplate(data) {
    return "\r\n\`\`\`vid\r\n" + data + "\r\n\`\`\`\r\n\r\n";
}


function doKeyPress(event){
    if(event.ctrlKey && event.altKey && !event.shiftKey) {
        var entry = bookmarks[String.fromCharCode(event.keyCode)];
        if(entry) {
            if (typeof(entry) === "function") {
                entry();
            } else if (typeof(entry) === "string") {
                openUrl(entry);
            }
        }   
    }
}
