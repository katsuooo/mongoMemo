/*
190218
 ~/gitRepo/ディレクトリ内のリポジトリの表示
*/
var socket = io.connect();

/*
 templates
*/
var repoTag = "<ul></ul>";
var liTag = "<li class='list-group-item'>rname</li>"

/*
 socket get
*/
socket.on('gitRepoFiles', function(files){
    //console.log('socketon');
    //console.log(files);
    var newTag = '';
    files.forEach( (file) => {
        var x = liTag;
        x = x.replace('rname', file);
        newTag += x;
    });
    console.log('newTag', newTag);
    $('#gitrepoList').append(newTag);
});

$(document).ready(function(){
    socket.emit('gitRepoStart');
});