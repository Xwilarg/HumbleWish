class Membership {
    get className() {
        return "content-choice-title";
    }

    get regex() {
        return new RegExp("https://www.humblebundle.com/membership/home");
    }
}

let searchs = [
    new Membership()
];

let parser = null;
for (let elem of searchs) {
    if (elem.regex.test(window.location.href)) {
        parser = elem;
        break;
    }
}

if (parser !== null) {
    let availableGames = [];

    Array.from(document.getElementsByClassName(parser.className)).forEach(e => {
        availableGames.push(e.innerHTML.trim());
    });

    chrome.storage.sync.get(null, function(elems) {
        var allKeys = Object.keys(elems);
        elems.ids.split(',').forEach(e => {
            const id = e.trim();
            console.log(elems["content-" + id].split(';'));
        });
    });
} else {
    console.debug("Page not supported by HumbleWish");
}