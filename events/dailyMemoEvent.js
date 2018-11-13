/*
 daily memo event
 view mongo.myMemo/daily monitor
*/
var mongoMain = require('../mongoif/mongoifMain');

/*
 mongo interface
*/

const colName = 'daily';
const writeColName = 'daily';
var readNum = 20;

/*
 read daily
*/
function readDaily(){
    mongoMain.readLimitDaily(colName, readNum);
}
/*
 exports
*/
function dailyMemoEvent(socket) {
    /*
     dbname set
    */
    socket.on('dailyMemoStart', function(){
        console.log('daily memo start');
        readDaily();
    });
    socket.on('nextDaily', function(docs){
        console.log('dailys save', docs);
        //mongoMain.readLimit(pgmemoColName, PGMEMOINFO.recentMemoNum);
        readNum += 20;
        readDaily();
    });
}

module.exports = dailyMemoEvent;