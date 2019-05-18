/*
190516
panel app event
*/
var mongoMain = require('../mongoif/mongoifPanel');
var dateformat = require('dateformat');
var moment = require('moment');


const panelColName = 'panel';











/**
 * panel mongo read
 * @param {*} socket 
 */
function panelMongoRead(socket){
    mongoMain.readAll(panelColName, socket);
}
/**
 * panel mongo text change
 * @param {'index': int, 'textarea': string}
 */
function panelMongoTextChange(socket, para){
    mongoMain.update(panelColName, socket, para);
}

/**
 * events main
 */
function panelEvent(socket){
    socket.on('panelStart', ()=>{
        console.log('panel start');
        panelMongoRead(socket);
    });
    socket.on('textChange', (para) => {
        console.log('textChange', para);
        panelMongoTextChange(socket, para);
    });
}

module.exports = panelEvent;