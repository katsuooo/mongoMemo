/*
190516
panel app event
*/
var mongoMain = require('../mongoif/mongoifPanel');
var dateformat = require('dateformat');


const panelColName = 'panel';

/**
 * mongo panel data
 *  datetime: string
 *  title     string
 *  panel: string[16][]
 * 
 */
var pnaelh = [];
for (let i=0; i<16; i++){
    var hai = [];
    pnaelh.push(JSON.stringify(hai));
}
var paneld = {
    datetime: '',
    title: '',
    panel: pnaelh
}
console.log(paneld);








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
function panelMongoTextChange(para){
    //mongoMain
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
        panelMongoTextChange(para);
    });
}

module.exports = panelEvent;