if (window == top) {
    window.addEventListener('keyup', doKeyPress, false);
}

const bookmarks = {};

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
    const shortsPauseButton = document.querySelector("#play-pause-button-shape > button");
    if (shortsPauseButton) {
        shortsPauseButton.click()
    }
}

function getFullUrl(id) {
    return "https://www.youtube.com/watch?v=" + id;
}

function getIdFromUrl(line) {
    const url = new URL(line);
    if (!url.hostname.includes("youtube.com")) {
        if (url.hostname.includes("youtu.be")) {
            return url.pathname.replace("/", "");
        }
        return "";
    }

    const id = url.searchParams.get("v");
    // console.log(url.href);
    if (id) {
        return id;
    }
    return url.pathname.replace("/shorts/", "");
}

function getYoutubeUrl() {
    const curUrl = window.location.href;
    if (curUrl.includes("youtube.com")) {
        if (curUrl.includes("watch") || curUrl.includes("shorts")) {
            return curUrl;
        }
    }
    const underCursor = document.querySelector('[href*="v"]:hover');
    if (!underCursor) {
        return null;
    }
    return underCursor.href;
}

function sendToObsidian() {
    const curUrl = getYoutubeUrl();
    if (!curUrl) {
        console.log("URL not found");
        return;
    } else {
        // console.log("Process...", curUrl);
    }
    const cleanUrl = getFullUrl(getIdFromUrl(curUrl));
    const template = getObsLink(vidTemplate(cleanUrl));
    openUrl(template);
}

bookmarks['V'] = sendToObsidian;

bookmarks['B'] = function () {
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
    return "obsidian://daily?vault=obsidian&content=" + data;
}

function vidTemplate(data) {
    return "\r\n\`\`\`vid\r\n" + data + "\r\n\`\`\`\r\n\r\n";
}


function doKeyPress(event) {
    if (event.ctrlKey && event.altKey && !event.shiftKey) {
        const entry = bookmarks[String.fromCharCode(event.keyCode)];
        if (entry) {
            if (typeof (entry) === "function") {
                entry();
            } else if (typeof (entry) === "string") {
                openUrl(entry);
            }
        }
    }
}
