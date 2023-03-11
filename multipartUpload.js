const form = document.querySelector('#form');
const siteId = document.querySelector('#siteId');
const v2key = document.querySelector('#key');
const file = document.querySelector('#file');

form.addEventListener('submit', getFormData);

function getFormData(e) {
    console.log("getFormData() Executed");
    e.preventDefault();
    const key = v2key.value;
    const propertyID = siteId.value;
    filePath = file.value;
    fileSize = document.querySelector('input[type="file"]').files[0].size;
    console.log("Key: " + key);
    console.log("Property Id: " + propertyID);
    console.log("File path: " + filePath);
    console.log("File size: " + fileSize + "bytes");
    createMedia(key, propertyID)
}

function createMedia(key, id) {
    console.log("CreateMedia() Executed");
    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json', 
            'Authorization': key
        },
        body: JSON.stringify({
            'upload': {method: 'multipart'},
            'metadata': {title: 'Multipart Upload via API JS'}
        })
    };
    fetch(`https://api.jwplayer.com/v2/sites/${id}/media/`, options)
    .then(response => response.json())
    .then(response => getPartURLs(response))
    .catch(err => console.error(err));
}

function getPartURLs(response) {
    console.log("getPartURLs() Executed");
    getPartsCount()
    let uploadURL = `https://api.jwplayer.com/v2/uploads/${response.upload_id}/parts?page=1&page_length=${parts}`
    console.log("Upload URL: " + uploadURL);
    const options = {
        method: 'GET', 
        headers: {
            accept: 'application/json',
            Authorization: response.upload_token
        }
    };
    fetch(uploadURL, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

function getPartsCount(){
    let minimumPartSize = 5.24288; //MB
    let size = byteToMegabyte(fileSize);
    console.log("Size: " + size + "MB");
    parts = Math.floor((size * minimumPartSize) / 100);
    console.log("Parts: " + parts);
}

function byteToMegabyte(x){
    let l = 0, n = parseInt(x, 10) || 0;
    while(n >= 1024 && ++l){
        n = n/1024;
    }
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0));
  }
