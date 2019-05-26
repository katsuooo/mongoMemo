/*
190526
index event
*/
var mongoInfo = require('../config/config').MONGOINFO;
var mongoConfig = require('../config/config').mongoConfig;
/* mongoinfo
{ url: 'mongodb://192.168.10.132',
  port: 27017,
  db: 'myMemo',
  collection: { simple: 'text', pgmemo: 'pgmemo' } }
*/
function indexEvent(socket){
    socket.on('index_start', () => {
        socket.emit('mongo_url_info', mongoInfo);
    });
    socket.on('new_url', (new_one) => {
        console.log(new_one);
        mongoConfig.write(new_one);
    });
}

module.exports = indexEvent;
