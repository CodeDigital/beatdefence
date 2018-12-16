const {
    ipcRenderer
} = require('electron');
const mtrap = require('mousetrap');
const fs = require('fs');
const url = require('url');
const path = require('path');
const db = require('../database/database.js');
var $ = require("jquery");

ipcRenderer.on('home', function () {
    changePage('home');
});

ipcRenderer.on('game', function () {
    changePage('game');
});

function changePage(newPage) {
    $("#main").load(newPage + "/" + newPage + ".html", function (responseText, textStatus, req) {
        //console.log(req);
    }).hide().fadeIn(15, 'swing');
}