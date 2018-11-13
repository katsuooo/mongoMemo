/*
 daily memo event
 view mongo.myMemo/daily monitor
*/
var mongoMain = require('../mongoif/mongoifMain');

/*
 mongo interface
*/

const colName = 'text';
const writeColName = 'daily';

function dailyMemoEvent(socket) {
    /*
     dbname set
    */
    socket.on('dailyMemoStart', function(){
        console.log('daily start');
        mongoMain.readAll(colName);
    });
    socket.on('saveMemoDailys', function(docs){
        console.log('dailys save', docs);
        //mongoMain.readLimit(pgmemoColName, PGMEMOINFO.recentMemoNum);
        mongoMain.saveDailys(writeColName, docs)
    });
}

module.exports = dailyMemoEvent;