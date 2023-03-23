# JSMultipartUplaod
A JavaScript app to do a multipart upload to JW Player.

Initially intended to be written with vanilla JavaScript, it looks like implimenting node.js is needed to upload the file in a multipart fashion.

Currently working on creating the chunks to upload. file.slice seems to create chunks of required size, but these chunks don't seem to be uploading to the JW server.
