class Membership {
    get className() {
        return "content-choice-title";
    }

    get regex() {
        return new RegExp("https://www.humblebundle.com/membership/home");
    }

    displayBadge(data) {
        data.mainNode.parentNode.parentNode.parentNode.innerHTML +=
        `<div class="humblewish-wishlisted">Wishlisted by ${data.ids.length} friend${(data.ids.length > 1 ? "s" : "")}</div>`;
    }
}

class GameData {
    constructor(node) {
        this.ids = [];
        this.mainNode = node;
    }
}

let searchs = [
    new Membership()
];

let parser = null;

// Are we on a valid page
for (let elem of searchs) {
    if (elem.regex.test(window.location.href)) {
        parser = elem;
        break;
    }
}

if (parser !== null) {
    let availableGames = {};

    // Get all games present on the page
    Array.from(document.getElementsByClassName(parser.className)).forEach(e => {
        availableGames[e.innerHTML.trim()] = new GameData(e);
    });

    chrome.storage.sync.get(null, function(elems) {
        // Check each wishlist from cache
        elems.ids.split(',').forEach(e => {
            const id = e.trim();
            const wishGames = elems["content-" + id].split(';');
            for (let key in availableGames) {
                // Cache store all games separated by a semi colon so we don't forget to remove it while comparing
                if (wishGames.includes(key.replaceAll(";", ""))) {
                    console.debug(`[${id}] Found ${key} in wishlist`);
                    availableGames[key].ids.push(id);
                }
            }
        });

        // For each game that was in a wishlist, we display a badge
        for (let key in availableGames) {
            const data = availableGames[key];
            if (data.ids.length > 0) {
                parser.displayBadge(data);
            }
        }
    });
} else {
    console.debug("Page not supported by HumbleWish");
}