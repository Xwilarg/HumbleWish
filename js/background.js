function saveWishlistInfos(ids) {
    ids.split(',').forEach(e => {
        const id = e.trim();
        let games = [];
        saveGames(id, 0, games, () => {
            let dict = {};
            dict["content-" + id] = games.join(';');
            chrome.storage.sync.set(dict);
            console.log(`[${id}] Games found: ${dict["content-" + id]}`);
        })
    });
}

function saveGames(id, page, games, onSucceed) {
    fetch(`https://store.steampowered.com/wishlist/profiles/${id}/wishlistdata?p=${page}`).then(resp => {
        resp.json().then(json => {
            if (json.success === 2) {
                console.error(`Invalid ID ${id}`);
                if (games.length > 0) {
                    onSucceed();
                }
            } else {
                for (const key in json) {
                    games.push(json[key].name.replaceAll(";", ""));
                }
                if (Object.keys(json).length === 100) {
                    saveGames(id, page + 1, games, onSucceed);
                } else {
                    onSucceed();
                }
            }
        });
    }, err => {
        console.error(`Failed to fetch for ID ${id}: ${err}`);
    });
}