const {ipcRenderer} = require('electron');
const fs = require('fs');
const url = require('url');
const path = require('path');
var $ = require("jquery");

ipcRenderer.on('home', function() {
    changePage('home');
});

function changePage(newPage) {
    $("#main").load(newPage + "/" + newPage + ".html", function (responseText, textStatus, req) {
        console.log(req);
    }).hide().fadeIn('slow', 'swing');
}