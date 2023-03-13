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
    console.log("File size: " + fileSize + " bytes");
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
        }),
        upload: {
            "mime_type": "video/mp4"
          }
    };
    fetch(`https://api.jwplayer.com/v2/sites/${id}/media/`, options)
    .then(response => response.json())
    .then(response => getPartURLs(response))
    .catch(err => console.error(err));
}

function getPartURLs(response) {
    console.log("getPartURLs() Executed");
    getPartsCount();
    upload_token = response.upload_token
    upload_id = response.upload_id
    let uploadURL = `https://api.jwplayer.com/v2/uploads/${upload_id}/parts?page=1&page_length=${parts}`
    console.log("Upload URL: " + uploadURL);
    const options = {
        method: 'GET', 
        headers: {
            accept: 'application/json',
            Authorization: upload_token
        }
    };
    fetch(uploadURL, options)
    .then(response => response.json())
    .then(response => uploadParts(response))
    .catch(err => console.error(err));
}

function uploadParts(response){
    console.log("uploadParts() Executed");
    createChunks(document.querySelector('input[type="file"]').files[0], fileSize / parts);
    console.log(response.parts);
    console.log(chunks);
    let responseParts = response.parts;
    responseParts.forEach((element, index) => {
        let url = element.upload_link;
        console.log(url);
        let data = chunks[index];
        console.log("chunks index: " + data);
        const options = {
            method: 'PUT',
            upload: {
                "mime_type": "video/mp4"
              },
            "data": data
        }
        fetch(url, options)
        .catch(err => console.error(err));
        });
        setTimeout(() => {
            completeUpload();
        }, 10000);
    }

function completeUpload(){
    const options = {
        method: 'PUT', 
        headers: {
            accept: 'application/json',
            Authorization: upload_token
        }};
    fetch(`https://api.jwplayer.com/v2/uploads/${upload_id}/complete/`, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

function createChunks (file,cSize/* cSize should be bytes */) {
    console.log("createChunks() Executed");
    console.log(file);
    console.log("Part size: " + cSize + " bytes");
    let startPointer = 0;
    let endPointer = file.size;
    chunks = [];
    while(startPointer<endPointer){
        let newStartPointer = startPointer+cSize;
        chunks.push(file.slice(startPointer,newStartPointer, "video/mp4")); 
        startPointer = newStartPointer;
    }
    return chunks;
}

// function createChunks(){
//     console.log("createChunks() Executed");
//     let file = document.querySelector('input[type="file"]').files[0];
//     console.log(file);
//     let chunkSize = fileSize / parts;
//     console.log("chunk size: " + chunkSize + " bytes");
//     let chunks = Math.ceil(fileSize/chunkSize,chunkSize);
//     let chunk = 0;
//     chunks2 = [];

//     console.log('file size..',fileSize);
//     console.log('chunks...',chunks);
// //build an if statement somewher here to say @if less that chunkSize, add to chunks2 array. This should add all parts, including last one which is smaller than the others.
//     while (chunk <= chunks) {
//         var offset = chunk*chunkSize;
//         console.log('current chunk..', chunk);
//         console.log('offset...', chunk*chunkSize);
//         console.log('file blob from offset...', offset)
//         console.log(file.slice(offset,offset+chunkSize));
//         chunks2.push(file.slice(offset,offset+chunkSize));
//         chunk++;
//     }
//     console.log(chunks2);
// }

function getPartsCount(){
    let minimumPartSize = 5.24288; //MB
    let size = byteToMegabyte(fileSize);
    console.log("File size: " + size + "MB");
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
