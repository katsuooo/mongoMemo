/*
180711
 pg memo page Events


 pg memo format

 date
 titel
 tag[]
 platform[]
 text

 */


//var mongoif = require('./mongoif/mongoif');
//var mongoif = require('./mongoif/mongoif');
var mongoMain = require('../mongoif/mongoifMain');
var dateformat = require('dateformat');

const PGMEMOINFO = require('../config/config.js').PGMEMOINFO;




/*
 tag break down
  del space
  split ','
*/
var tagBreak = function(str){
    var x = str.replace(/\s/g, '');
    xx = x.split(',');
    return xx;
}
/*
new memo adjust
*/
var jsonMemoAdjust = function(json){
    json.tag = tagBreak(json.tag);
    json.date = dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    return json;
}
/*
 check new or update
 _idデータがある場合はupdateする。
 ない場合は新規
*/
var checkIdtag = function(newMemo){
    newMemo = jsonMemoAdjust(newMemo);
    if('_id' in newMemo){
        mongoMain.update(pgmemoColName, newMemo);
    }else{
        mongoMain.write(pgmemoColName, newMemo);
    }
}



/*
 mongo interface
*/

const pgmemoColName = 'pgmemo';

function pgmemoEvent(socket) {
    /*
     dbname set
    */
    socket.on('pgmemoReadAll', function(){
        console.log('pg readAll');
    });
    socket.on('pgmemoReadLimit', function(){
        console.log('pg readLimit');
        mongoMain.readLimit(pgmemoColName, PGMEMOINFO.recentMemoNum);
    });
    socket.on('pgmemoReadInfo', function(){
        console.log('pgmemo read info');
        socket.emit('pgmemoPutInfo', PGMEMOINFO);
    });
    socket.on('pgmemoNew', function(newMemo){
        checkIdtag(newMemo);
    });
    socket.on('pgmemoDelete', function(delID){
        console.log('del');
        mongoMain.deletebyId(pgmemoColName, delID);
    });
};



module.exports = pgmemoEvent;




