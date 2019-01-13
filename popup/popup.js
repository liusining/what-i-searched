let username = document.getElementById('username');
chrome.storage.sync.get({
  username: 'Missing Name',
  authString: '',
  createRecordURL: '',
  getCountURL: ''
}, function (item) {
  // test whether username has been initialized
  if (item.username === "Missing Name") {
    username.innerHTML = "cannot find your name";
  } else {
    username.innerHTML = item.username;
  }
  // test whether database connection urls have been set
  if (item.getCountURL === "" || item.createRecordURL === "") {
    let msgContainer = document.getElementsByClassName('message')[0];
    msgContainer.innerHTML = `<p>You haven't configured database connection yet.</p>
    <p>Right Click the icon and go to options page to set configuration.</p>`
  } else {
    // retrieve searches count from database
    let countContainer = document.getElementById('data');
    let xhr = new XMLHttpRequest();
    xhr.open("GET", item.getCountURL, true);
    xhr.setRequestHeader('Authorization', 'Basic ' + item.authString);
    xhr.onload = function() {
      countContainer.innerHTML = xhr.responseText;
    }
    xhr.send();
  }
});
