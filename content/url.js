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
        uploadRecord: function () {
            // prepare request body
            let record = {};
            let now = new Date();
            record["timestamp"] = now.getTime().toString();
            record["keywords"] = this.search.getKeywords()
            let body = JSON.stringify(record);
            // retrieve endpoint url from chrome storage
            chrome.storage.sync.get({
                'createRecordURL': "",
                'authString': ""
            }, function (item) {
                if (item.createRecordURL === "") {
                    console.log("Missing createRecordURL! Cannot upload search records!")
                    return
                }
                if (item.authString === "") {
                    console.log("Missing authString! Cannot upload search records!")
                    return
                }
                // upload data
                let xhr = new XMLHttpRequest();
                xhr.open("POST", item.createRecordURL, true);
                xhr.setRequestHeader('Authorization', 'Basic ' + item.authString);
                xhr.setRequestHeader("Content-Type", "application/json")
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        console.log(`upload successfully: ${body}`);
                    } else {
                        console.log(`Cannot upload record: ${body}, response: ${xhr.responseText}`);
                    }
                }
                xhr.send(body);
            });
        }
    };

    let controller = {
        init: function () {
            let hostname = (new URL(window.location.href)).hostname;
            let regGoogle = /^\w*\.google\./;
            let regDuckGo = /^duckduckgo\.com/;
            let regBaidu = /^www\.baidu\.com/;
            if (regGoogle.test(hostname)) {
                model.init(false);
            } else if (regDuckGo.test(hostname)) {
                if (!window.location.href.startsWith("https://duckduckgo.com/?q")) {
                    return;
                }
                model.init(false);
            } else if (regBaidu.test(hostname)) {
                model.init(true);
                model.search.listen(model.uploadRecord);
            } else {
                return;
            }
            model.uploadRecord();
        }
    }

    controller.init();
})();
