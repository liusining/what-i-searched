let url = new URL(window.location.href);
let keywords = url.searchParams.get('q');

chrome.storage.sync.get({
    'count': 0
}, function (item) {
    chrome.storage.sync.set({
        'count': item.count + 1
    })
});