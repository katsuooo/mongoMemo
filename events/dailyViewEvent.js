/*
 daily view event
*/

var mongoMain = require('../mongoif/mongoifMain');









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
        //mongoMain.readLimit(pgmemoColName, PGMEMOINFO.recentMemoNum);
        mongoMain.saveDailys(writeColName, docs);
        mongoMain.deleteAll(colName);
    });
}

module.exports = dailyViewEvent;




