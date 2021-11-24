/*
190218
 ~/gitRepo/ディレクトリ内のリポジトリの表示
*/
var socket = io.connect();
var escape = require('escape-html')

/*
 templates
*/
var repoTag = "<ul></ul>";
var liTag = "<li class='list-group-item'>rname</li>"

/*
 socket get
*/
socket.on('gitRepoFiles_xxx', function(files){
    var newTag = '';
    files.forEach( (file) => {
        var x = liTag;
        x = x.replace('rname', escape(file));
        newTag += x;
    });
    $('#gitrepoList').append(newTag);
});


/*
 190516
 li >>> span
*/

var spanTag = "<span class='badge badge-pill badge-color'>fileName</span>";
var colors = ['primary','secondary','success','danger','warning','info','light','dark'];
socket.on('gitRepoFiles', (files)=>{
    var newTag = '';
    var colorNum = 0;
    files.forEach( (file)=>{
        var x = spanTag;
        x = x.replace('color',colors[colorNum++]);
        if (colorNum === colors.length){
            colorNum = 0;
        }
        x = x.replace('fileName', file);
        newTag += x;
    });
    $('#gitrepoInline').append(newTag);
});






$(document).ready(function(){
    socket.emit('gitRepoStart');
});