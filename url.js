(function () {
    let url = new URL(window.location.href);
    let regGoogle = /^\w*\.google\./;
    let regBaidu = /^www\.baidu.com/;
    if (!regGoogle.test(url.hostname) && !regBaidu.test(url.hostname)) {
      return;
    }
    let params = url.searchParams;
    let keywords = params.get('q') || params.get('wd');

    chrome.storage.sync.get({
        'count': 0
    }, function (item) {
        chrome.storage.sync.set({
            'count': item.count + 1
        })
    });
})();
