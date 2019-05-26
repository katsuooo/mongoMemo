/*
190516
panel app event
*/
var mongoMain = require('../mongoif/mongoifPanel');
var dateformat = require('dateformat');
var moment = require('moment');
var dailyMongo = require('../mongoif/mongoIfAsync.js');


const panelColName = 'panel';

/*
dark 343140
*/









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
 * to daily / save text to daily, panels are clear
 * @param {*} socket 
 */
function panelToDaily(socket, text){
    const dailyColName = 'daily';

    dailyMongo.addDayJson(dailyColName, text);
    mongoMain.saveAndClear(panelColName, socket);
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
    /**
     * data move icon click event
     */
    socket.on('panelToDaily', (text)=>{
        //console.log(text);
        panelToDaily(socket, text);
    });
}

module.exports = panelEvent;