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
        elems.ids.split(',').forEach(e => {
            const id = e.trim();
            const wishGames = elems["content-" + id].split(';');
            availableGames.forEach(game => {
                if (wishGames.includes(game.replaceAll(";", ""))) {
                    console.debug(`[${id}] Found ${game} in wishlist`);
                }
            });
        });
    });
} else {
    console.debug("Page not supported by HumbleWish");
}