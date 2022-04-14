chrome.storage.sync.get({
    ids: ""
}, function(elems) {
    let steamIds = document.getElementById("steamIds");
    steamIds.value = elems.ids;
    steamIds.addEventListener("change", function() {
        if (this.value.trim().length !== 0) {
            chrome.storage.sync.set({
                ids: this.value
            });
            chrome.extension.getBackgroundPage().saveWishlistInfos(this.value);
        }
    });

    document.getElementById("refreshStorage").addEventListener("click", () => {
        chrome.extension.getBackgroundPage().saveWishlistInfos(elems.ids);
    });
})