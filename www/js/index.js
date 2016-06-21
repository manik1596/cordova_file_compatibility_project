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
    
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('deviceready', this.cordovaFileTest, false);
        
        document.addEventListener('deviceready', this.fileRequest, false); //devices, ionic upload
        document.addEventListener('deviceready', this.fileRequests, false); //devices, ionic upload
        
        //this.fileRequest(); //ionic serve
        //this.fileRequests(); //ionic serve
    },
    
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    cordovaFileTest: function() {
        if(cordova.file !== undefined) { app.receivedEvent('devicereadyCordovaFile'); }
    },
    fileRequest: function() {
        
        reqFS = window.requestFileSystem || window.webkitRequestFileSystem;	
        
        reqFS( window.TEMPORARY, 0, 
            function(fs){
                
                app.receivedEvent('devicereadyFileSystemRequest');
                
                fs.root.getFile(
                    "filename.txt",
                    {create : true},
                    function(fileentry){
                        
                        app.receivedEvent('devicereadyFileEntryRequest');                        
                        
                        fileentry.createWriter(
                                function(fileWriter) {

                                    fileWriter.onwriteend = function(e) {
                                        app.receivedEvent('devicereadyFileWritingReading');   
                                    };

                                    fileWriter.onerror = function(e) { };

                                    var blob = new Blob(['Test text for file creating through requestFileSystem'], {type: 'text/plain'});
                                    fileWriter.write(blob);
                                },
                                function(fail){}
                        );
                    }    
                );
                
            },
            function(fail){}
        );
                       
    },
    fileRequests: function(){
        
        if(typeof window.requestFileSystem          !== 'undefined'){app.receivedEvent('requestFileSystemTest');}
        if(typeof window.webkitRequestFileSystem    !== 'undefined'){app.receivedEvent('webkitRequestFileSystemTest');}
        if(typeof window.resolveLocalFileSystemURL  !== 'undefined'){app.receivedEvent('resolveLocalFileSystemURLTest');}
        if(typeof window.resolveLocalFileSystemURI  !== 'undefined'){app.receivedEvent('resolveLocalFileSystemURITest');}
        if(typeof window.resolveLocalFileSystem     !== 'undefined'){app.receivedEvent('resolveLocalFileSystemTest');}
        if(typeof window.requestLocalFileSystem     !== 'undefined'){app.receivedEvent('requestLocalFileSystemTest');}
        
    },
    
    
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();