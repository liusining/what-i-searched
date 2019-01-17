# What I Searched

A chrome extension that help you record your search history, supporting Google, Google Scholar, Baidu and DuckDuckGo.

## How to use it

If you want to use full feature of this project:

1. Create an AWS DynamoDB table named `what_i_searched`, whose partition key must be `Timestamp` and of type `Number`.
2. Create an AWS SNS topic, and replace the `topicArn` constant in `backend/mydb` with your own topic ARN.
3. Build the backend packages respectively: `GOOS=linux GOARCH=amd64 go build ./create_record` and `GOOS=linux GOARCH=amd64 go build ./get_count`.
4. Create AWS Lambda functions with those compiled packages.
5. Set up API gateways to invoke these Lambda functions you created in the above step.
6. Download this chrome extension and set up configuration in its options page.

If you've finished all these requirements, I would say thanks to you and wish your effort get paid.

## References

- [Chrome.storage.sync example](https://gist.github.com/IzumiSy/765cfd6dc02c79de875e)
- [How to make a chrome extension](https://robots.thoughtbot.com/how-to-make-a-chrome-extension)
- [chrome.identity User Authentication in a Chrome Extension](https://stackoverflow.com/questions/25044936/chrome-identity-user-authentication-in-a-chrome-extension)
- [Getting the client's timezone in JavaScript](https://stackoverflow.com/a/34602679/6633748)
- [OAuth 2.0 Scopes for Google APIs](https://developers.google.com/identity/protocols/googlescopes)
- [Call An Asynchronous Javascript Function Synchronously](https://stackoverflow.com/a/33579720/6633748)
