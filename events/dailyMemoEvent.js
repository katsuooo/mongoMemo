/*
 daily memo event
 view mongo.myMemo/daily monitor
*/
var mongoMain = require('../mongoif/mongoifMain');
var mongoAsync = require('../mongoif/mongoIfAsync');
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
    /*
     edit icon
    */
    socket.on( 'dailyupdate', (json) => {
        mongoAsync.update(colName, json, readNum);
    });
    /*
     delete icon
    */
    socket.on( 'dailydelete', (id) => {
        mongoAsync.deletebyId(colName, id, readNum);
    });

    
}

module.exports = dailyMemoEvent;