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
        parentElement.querySelector('.camera').onclick = () => videoCapture();
        log(id);
    }
};

function log(text) {
    let node = document.createElement("LI");
    let textnode = document.createTextNode(text);
    node.appendChild(textnode);

    document.querySelector("ul.logs").appendChild(node);
}

/**
 * Method 2
 * Adding sample code from this issue https://github.com/apache/cordova-plugin-media-capture/issues/135
 * to make sure we're doing the same thing
 */
function videoCapture() {
    new Promise((resolve, reject) => {
        navigator.device.capture.captureVideo(
          function (mediaFiles) {
              resolve(mediaFiles[0]);
          },
          function (err) {
              reject(err);
          },
          {
              limit: 1,
              duration: 30
          }
        );
    })
      .then(mediaFile => successVideo(mediaFile))
      .catch(err => {
          console.log(err);
      });
}

function successVideo(mediaFile) {
    let videoUrl = mediaFile.fullPath;
    log('Full path: ' + videoUrl);

    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(
          videoUrl,
          function (entry) {
              entry.file(
                function (file) {
                    setTimeout(() => {
                        const reader = new FileReader();
                        reader.onloadend = function () {
                          log("reader.onloadend");
                          log(`capture: result: ${this.result}, error: ${JSON.stringify(this.error)}`);
                          resolve([this.result, file, entry]);
                        };
                        reader.onerror = function (ev) {
                          log("reader.onerror: " + JSON.stringify(ev));
                          reject(ev);
                        };
                        reader.readAsArrayBuffer(file);
                    }, 1000);
                },
                function (err) {
                    reject(err);
                }
              );
          },
          function (err) {
              reject(err);
          }
        );
    });
}

app.initialize();
