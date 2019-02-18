/*
*/
//const testFolder = '/home/taka/gitRepo/';
const testFolder = '/home/katsu/gitRepo/';
const fs = require('fs');


/*
 read repositries
*/
function readRepos(socket){
    fs.readdir(testFolder, (err, files) => {
        /*
        files.forEach(file => {
            console.log(file);
        });
        console.log(typeof(files));
        */
        socket.emit('gitRepoFiles', files);
    });
}
/*
 sockets
*/
function gitRepoEvent(socket){
    socket.on('gitRepoStart', () => {
        /*
        console.log('socketon');
        var x = [];
        x.push('aaa');
        x.push('bbb');
        socket.emit('gitRepoFiles', x);
        */
        readRepos(socket);
    });
}

module.exports = gitRepoEvent;