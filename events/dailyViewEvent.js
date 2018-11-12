/*
 daily view event
*/

var mongoMain = require('../mongoif/mongoifMain');

/*
180711
 pg memo page Events


 daily view

 parse simple memo to daily


 */


var mongoMain = require('../mongoif/mongoifMain');
var dateformat = require('dateformat');

//const PGMEMOINFO = require('../config/config.js').PGMEMOINFO;







/*
 mongo interface
*/

const colName = 'text';

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
    });
}

module.exports = dailyViewEvent;




