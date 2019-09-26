/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        let parentElement = document.getElementById(id);
        let cameraElement = parentElement.querySelector('.camera');

        cameraElement.onclick = () => captureVideoErrorOnAndroid();

        parentElement.querySelector('.select-video').onclick = () => selectVideo();
        log(id);
    }
};

function log(text) {
    let node = document.createElement("LI");
    let textnode = document.createTextNode(text);
    node.appendChild(textnode);

    document.querySelector("ul.logs").appendChild(node);
}

function captureVideoErrorOnAndroid() {
    const printError = (e) => console.log(e);
    navigator.device.capture.captureVideo(function (mediaFiles) {
        const mediaFile = mediaFiles[0];
        log(`Got media file: ${JSON.stringify(mediaFile)}`)

        // note, on iOS I have to use media.localURL rather than media.fullPath
        // I also tried media.localURL on Android, but the results are the same 
        window.resolveLocalFileSystemURL(mediaFile.fullPath, function (fileEntry) {
            log(`Got fileEntry: ${JSON.stringify(fileEntry)}`)
            fileEntry.file(function (file) {
                log(`Got file: ${JSON.stringify(file)} `)
                const reader = new FileReader();

                reader.onloadend = function () {
                    log(`Result: ${this.result}, error: ${JSON.stringify(this.error)}`)
                };
                reader.readAsArrayBuffer(file);

            }, printError);
        }, printError)
    }, printError, { limit: 1, quality: 0, duration: 10 })
}


async function selectVideo() {
    const printError = (e) => console.log(e);
    const videoUrl = await this.openFilePicker();
    log(`videoUrl: ${videoUrl}`);
    return window.resolveLocalFileSystemURL(videoUrl, function (fileEntry) {
        log(`Got fileEntry: ${JSON.stringify(fileEntry)}`)
        fileEntry.file(function (file) {
            log(`Got file: ${JSON.stringify(file)} `)
            const reader = new FileReader();

            reader.onloadend = function () {
                log(`Result: ${this.result}, error: ${JSON.stringify(this.error)}`)
            };
            reader.readAsArrayBuffer(file);

        }, printError);
    }, printError)
}

function getOptions(srcType) {
    return {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.VIDEO,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
}

async function openFilePicker() {
    return new Promise((resolve, reject) => {
        const srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        const options = getOptions(srcType);
        navigator.camera.getPicture(function cameraSuccess(imageUri) {
            resolve(imageUri);
        }, function cameraError(error) {
            reject(error);
        }, options);
    })
}

app.initialize();
