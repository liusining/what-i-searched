document.getElementsByTagName("button")[0].addEventListener('click', function(event) {
    event.preventDefault();
    let config = {};
    let eles = document.forms[0].elements;
    for (let i = 0; i < eles.length; i++) {
        if (eles[i].name !== "") {
            config[eles[i].name] = eles[i].value;
        }
    }
    chrome.storage.sync.set(config, function() {
        if (requestAnimationFrame.lastError) {
            alert(runtime.Error);
            return
        }
        alert("Success");
    })
})