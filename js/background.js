function saveWishlistInfos(ids) {
    let dict = {};
    ids.split(',').forEach(e => {
        const id = e.trim();
        fetch(`https://store.steampowered.com/wishlist/profiles/${id}/wishlistdata`).then(resp => {
            resp.text().then(text => {
                const json = JSON.parse(text);
                if (json.success === 2) {
                    console.error(`Invalid ID ${id}`);
                } else {
                    let names = "";
                    for (const key in json) {
                        names += json[key].name.replaceAll(";", "");
                    }
                    dict["content-" + id] = names;
                    console.log(`Saving games for ${id}: ${names}`);
                }
            });
        }, err => {
            console.error(`Failed to fetch for ID ${id}: ${err}`);
        });
        chrome.storage.sync.set({
            dict
        });
    });
}