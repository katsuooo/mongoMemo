/*
*/
const testFolder = '/home/';
//const testFolder = '/home/taka/gitRepo/';
//const testFolder = '/home/katsu/gitRepo/';
const fs = require('fs');


/*
 read repositries

case correct
 null []

case error
{ [Error: ENOENT: no such file or directory, scandir '/home/katsu/gitRepo/']
  errno: -2,
  code: 'ENOENT',
  syscall: 'scandir',
  path: '/home/katsu/gitRepo/' } undefined

*/
function checkDir(path){
    try{
        return fs.lstatSync(path).isDirectory();
    } catch(e){
        return false;
    }
}


function readRepos(socket){
    /*
    const stats = fs.lstatSync('/Users/taka');
    if(stats.isDirectory()){
        testFolder = '/Users/taka/'
    }else if(stat
    */
    /*
    try{
        const stats = fs.lstatSync('/Users/taka');
        if(stats.isDirectory()){
            testFolder = '/Users/taka/';
        }
    } catch(e){
        try{
            const stats = fs.lstatSync('/home/dingo');
            if(stats.isDirectory()){
                testFolder = '/home/dingo/';
            }     
        } catch(e){
            try{
                const stats = fs.lstatSync('/home/dingo');
                if(stats.isDirectory()){
                    testFolder = '/home/dingo/';
                }     
            } catch(e){
                testFolder = '/home/';
            }
        }
    }*/
    /*
    if(fs.lstatSync('/Users/taka').isDirectory()){
        const testFolder = '/Users/taka/'  
    }else if(fs.lstatSync('/home/taka').isDirectory()){
        const testFolder = '/home/taka/gitRepo/'
    }else if(fs.lstatSync('/home/dingo').isDirectory()){
        const testFolder = '/home/taka/gitRepo/'
    }
    */
    if(checkDir('/Users/taka')){
        const testFolder = '/Users/taka/';
    }else if(checkDir('/home/dingo')){
        const testFolder = '/home/dingo/gitRepo/';
    }else if(checkDir('/home/taka')){
        const testFOlder = '/home/taka/gitRepo/';
    }
    fs.readdir(testFolder, (err, files) => {
        /*
        files.forEach(file => {
            console.log(file);
        });
        console.log(typeof(files));
        */
        console.log(err, files);
        if (err != null){
            console.log(err);
        }
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