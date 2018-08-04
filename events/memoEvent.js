/*
node_memo_socketioのsocketioイベント部
*/



/*
 mongohq ios
 events
 memostart, memowrite, memodelete, memoupdate, next

 mongoif command
 readlimit, write, update, delete
*/



//var mongohq = require('./mongoif');

var mongohq = require('../mongoif/mongoif')
var dateformat = require('dateformat');

/*
 socketioにeventを併用している。
 不要かもしれない。
*/
/*
var EventEmitter = require('events').EventEmitter;
var ev = new EventEmitter();
var evw = new EventEmitter();
*/

/*
memo event

 events
 memostart, memowrite, memodelete, memoupdate, next
*/
/*
 read data num
*/
var rdnum = 10;

function memoEvent(socket){
    /*
     start
    */
    socket.on('memostart', function(){
        console.log('memo start!!!');
        const rdnum = 10;
        mongohq.readlimit(rdnum);
    });
    /*
     write
    */
    socket.on('memowrite', function(docs){
        console.log('memo Write!!!', docs);
        const wdata = {
            date: dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
            text: docs
        }
        mongohq.write(wdata);
    });
    /*
     delete
    */
    socket.on('memodelete', function(id){
        console.log('memo delete!!!', id);
        mongohq.deletebyId(id);
    });
    /*
     update
    */
    socket.on('memoupdate', function(json){
        console.log('memo update!!!', json);
        mongohq.update(json);
    });
    /*
     next
    */
    socket.on('next', function(){
        console.log('memo next!!!');
        rdnum += 10;
        mongohq.readlimit(rdnum);
    });
}



module.exports = memoEvent;




