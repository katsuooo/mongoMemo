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

const PGMEMOINFO = require('../config/config.js').PGMEMOINFO;
console.log(PGMEMOINFO);



function pgmemoEvent(socket) {
    socket.on('pgmemoReadAll', function(){
        console.log('pg readAll');
    });
    socket.on('pgmemoReadInfo', function(){
        console.log('pgmemo read info');
        socket.emit('pgmemoPutInfo', PGMEMOINFO);
    });

};



module.exports = pgmemoEvent;




