let span = document.getElementById('data');
chrome.storage.sync.get({
    "count": 0
}, function (item) {
    span.innerText = item.count;
});