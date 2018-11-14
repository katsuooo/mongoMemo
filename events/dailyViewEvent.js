/*
 daily view event
*/

var mongoMain = require('../mongoif/mongoifMain');
var mongoAsync = require('../mongoif/mongoIfAsync.js');









/*
 mongo interface
*/

const colName = 'text';
const writeColName = 'daily';

function dailyViewEvent(socket) {
    /*
     dbname set
    */
    socket.on('dailyStart', function(){
        console.log('daily start');
        mongoMain.readAll(colName);
    });
    socket.on('saveDailys', function(docs){
        console.log('dailys save', docs);
        mongoAsync.getLatestDay();
        mongoMain.saveDailys(writeColName, docs);
        mongoMain.deleteAll(colName);
    });
}

module.exports = dailyViewEvent;




