function saveWishlistInfos(ids) {
    ids.split(',').forEach(e => {
        const id = e.trim();
        fetch(`https://store.steampowered.com/wishlist/profiles/${id}/wishlistdata`).then(resp => {
            resp.text().then(text => {
                const json = JSON.parse(text);
                if (json.success === 2) {
                    console.error(`Invalid ID ${id}`);
                } else {
                    let names = [];
                    for (const key in json) {
                        names.push(json[key].name.replaceAll(";", ""));
                    }
                    let dict = {};
                    dict["content-" + id] = names.join(';');
                    chrome.storage.sync.set(dict);
                    console.log(`Saving games for ${id}: ${dict["content-" + id]}`);
                }
            });
        }, err => {
            console.error(`Failed to fetch for ID ${id}: ${err}`);
        });
    });
}