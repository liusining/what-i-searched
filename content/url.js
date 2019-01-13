(function () {
    class Search {
        constructor() {
            this.url = new URL(window.location.href);
            this.params = this.url.searchParams;
        }

        getKeywords() {
            return this.params.get('q');
        }
    }

    class BaiduSearch extends Search {
        listen(callback) {
            document.querySelector('#su').addEventListener('click', () => {
                this.update();
                callback();
            });
        }

        update() {
            this.url = new URL(window.location.href);
            this.params = this.url.searchParams;
        }

        getKeywords() {
            return document.querySelector('#kw').value;
        }
    }

    let model = {
        init: function (isBaidu) {
            if (isBaidu) {
                this.search = new BaiduSearch();
            } else {
                this.search = new Search();
            }
        },
        incrementCount: function () {
            chrome.storage.sync.get({
                'count': 0
            }, function (item) {
                chrome.storage.sync.set({
                    'count': item.count + 1
                })
            });
        }
    };

    let controller = {
        init: function () {
            let hostname = (new URL(window.location.href)).hostname;
            let regGoogle = /^\w*\.google\./;
            let regBaidu = /^www\.baidu\.com/;
            if (regGoogle.test(hostname)) {
                model.init(false);
            } else if (regBaidu.test(hostname)) {
                model.init(true);
                model.search.listen(model.incrementCount);
            } else {
                return;
            }
            model.incrementCount();
        }
    }

    controller.init();
})();
