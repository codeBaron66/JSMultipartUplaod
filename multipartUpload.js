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







// TG5D7vab8RU8Q8W0y9h2tWInYWpoellsVkpPRk5aWTBWM1Z6aEdOMHhVWjJwNVltRTQn
// [
//     {
//         "created": "2023-03-08T20:36:39+00:00",
//         "duration": 0,
//         "error_message": null,
//         "external_id": null,
//         "hosting_type": "hosted",
//         "id": "Z94ljmiV",
//         "last_modified": "2023-03-08T20:36:39+00:00",
//         "md5": null,
//         "media_type": "unknown",
//         "metadata": {
//             "author": null,
//             "category": null,
//             "custom_params": {},
//             "description": null,
//             "external_id": null,
//             "language": null,
//             "permalink": null,
//             "protection_rule_key": null,
//             "publish_end_date": null,
//             "publish_start_date": "2023-03-08T20:36:40+00:00",
//             "tags": [],
//             "title": "Multipart Upload via API JS"
//         },
//         "mime_type": null,
//         "relationships": {},
//         "schema": null,
//         "source_url": null,
//         "status": "created",
//         "trim_in_point": null,
//         "trim_out_point": null,
//         "type": "media",
//         "upload_id": "AiddtsF2",
//         "upload_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cGxvYWRfaWQiOiJBaWRkdHNGMiIsImF3c191cGxvYWRfaWQiOiJCdXJnQmhOTzB5WEVHZkIxVlM2T25zMk5VeWhoQkc0dVF5aGZMLkM4Wi5ZZW5EekFNNFM2MHc2QWplWXBIZjYza2g1UnlZR2dPei5VWWR2ZHpUZWlFa3RWRTFVRUVOQ2NIb3MxN3ZzMXhBT2ZjaFhpZnp4STl5dDhqekFjdWZ6bCJ9.FJLdEVcgT9Yk65zXFTnxSLEVfd55ZN9g73BUqcoxtPKa-v3arcHRh0mY42ioKbszMBC9FyVG35m62gB05HiuVSYFWhxL64JSJsEg6F1hVSpcnDt-CpIbj6CSVaNcb5NlfGw2KfDKVnS8W7N29TVtpJvrcsrugHujb3VK1Sknfkr1kupzr9eRzoJpUbIabM_RdcZEoOhsGe9UJsgRaD4AljFXTn4946QR_K81qldDVxEBUubGCSRwoZ0454CenRZ96TrT9J9YfqZFu_cXU_OMxlwc1j5Rjf2rK9YCZ2q7FjdCGI0SBFWGtAel2sqNbQNXAEKqjpA_924dO_muJ_1E3l6GCJsW7IDzb0Fpmviuhr2EkIkkdb4viL2DcvG-QgpAk9TMW6sFP1t1AfS0MjM7wHC5FOP7xzIixbZJ5BQPYQp5bWSMXaM9MgnJZU0xGLV6mXu6hPO8B633Gmr76Op7JKjcDwt4lRm0KWX79MX7toAzerde2cSJIDZi6dVrHqw1MpUjx5hNxzUqzVCbNMtOYGdRKr8BivL2sLB0WuCNHe0Gu0Z5CowVRoUoYXPkzImgbunXnmfRI-u_41H1-oTSmtBpZPzcMVfY78eNPiE6yxtqRbg1jtKIs8DWyoHOxm8_b7vAGXceU9XRM2RsiWOfF8F55xKPCiCv-gp7K0mGs2s"
//     }
// ]