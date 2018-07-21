/*
 socket io manager

 bin/wwwからserver引数をもらって起動
*/


var memoEvent = require('./events/memoEvent');
var pgmemoEvent = require('./events/pgmemoEvent');




function socketManager(server){
    console.log('socketManager load');
    io = require('socket.io')(server);
    io.on('connection', function(socket){
      memoEvent(socket);

      /*
       csv folder open request
      */
      /*
      socket.on('folderOpen', function(){
        require('child_process').exec('start "" "c:\\enesave\\ecoace\\ecoaceCsv"');
      });
      */
      pgmemoEvent(socket);
    });
}

module.exports = socketManager;
