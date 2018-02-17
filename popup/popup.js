let username = document.getElementById('username');
chrome.storage.sync.get({
    username: ''
}, function (item) {
    username.innerText = item.username;
});

let data = document.getElementById('data');
chrome.storage.sync.get({
    "count": 0
}, function (item) {
    data.innerText = item.count;
});
