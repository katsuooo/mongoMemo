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
/*
io.on('connection', function(socket){
    socket.on('chat', function(msg){
		  io.emit('chat', msg);	
	  });
		socket.on('memostart', function(){
			console.log('socket-memostart');
			//mongohq.readall(ev);
			rdnum = 10;
			mongohq.readlimit(rdnum, ev);
		});
		socket.on('memowrite', function(text, ev){
			console.log('socket-write: '+text);
			var wdata = {
				date: dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
				text: text
			}
			mongohq.write(wdata, evw);
		});
		socket.on('memodelete', function(id){
			console.log('socket-deleat: '+id);
			mongohq.delete(id, evw);
		});
		socket.on('memoupdate', function(json){
			console.log('socket-update: ',json);
			mongohq.update(json, evw);
		});
		socket.on('next', function(){
			rdnum += 10;
			mongohq.readlimit(rdnum, ev);
		});
  });
*/


var mongohq = require('./mongoif');

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
    socket.on('', function(json){
        console.log('memo update!!!', json);
    });
    /*
     next
    */
    socket.on('', function(){
        console.log('memo next!!!');
    });
}



module.exports = memoEvent;




