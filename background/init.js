async function getSpreadsheetId() {
    return await new Promise(function (resolve, reject) {
        chrome.storage.sync.get({
            spreadsheetId: false
        }, (item) => {
            if (item.spreadsheetId) {
                // TODO: Check whether the sheet exists
                resolve(item.spreadsheetId);
            } else {
                reject();
            }
        });
    });
}

chrome.identity.getAuthToken({
    interactive: true
}, function (token) {
    if (chrome.runtime.lastError) {
        // TODO: notify popup.html
        return;
    }
    getSpreadsheetId().then(function (spreadsheetId) {
        // TODO: notify popup.js
        alert(spreadsheetId);
    }, function () {
        let profilePromise = new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
            xhr.onload = function () {
                resolve(JSON.parse(this.responseText).given_name);
            };
            xhr.send();
        });

        profilePromise.then((username) => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://sheets.googleapis.com/v4/spreadsheets');
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.onload = function () {
                //  TODO; store sheet id
                let resp = JSON.parse(this.responseText);
                chrome.storage.sync.set({
                    username: username,
                    spreadsheetId: resp.spreadsheetId,
                    dataSheetId: resp.sheets[0].properties.sheetId
                });
            };
            let initSheet = {
                "properties": {
                    "title": `${username}'s search history since ${(new Date()).toJSON().slice(0, 10)}`,
                    "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                "sheets": [{
                    "properties": {
                        "title": "Data"
                    },
                    "data": [{
                        "startRow": 0,
                        "startColumn": 0,
                        "rowData": [{
                            "values": [{
                                    "userEnteredValue": {
                                        "stringValue": "Date"
                                    },
                                    "userEnteredFormat": {
                                        "textFormat": {
                                            "bold": true
                                        }
                                    }
                                },
                                {
                                    "userEnteredValue": {
                                        "stringValue": "Count"
                                    },
                                    "userEnteredFormat": {
                                        "textFormat": {
                                            "bold": true
                                        }
                                    }
                                },
                                {
                                    "userEnteredValue": {
                                        "stringValue": "Content"
                                    },
                                    "userEnteredFormat": {
                                        "textFormat": {
                                            "bold": true
                                        }
                                    }
                                }
                            ]
                        }]
                    }]
                }]
            };
            xhr.send(JSON.stringify(initSheet));
        });
    });
});
