/*
180712
pg memo controller
*/

console.log('pg memo start');

var app = angular.module('pgmemoApp', []);

/*
 type checkbox click
*/
var toggleType = function(name, $scope){
    console.log('click type');
    var idx = $scope.typeSelection.indexOf(name);
    if (idx > -1){      // already selected
        $scope.typeSelection.splice(idx, 1);
    }else {             // newly selected
        $scope.typeSelection.push(name);
    }
}
/*
 platform checkbox click
*/
var togglePlatform = function(name, $scope){
    console.log('click type');
    var idx = $scope.platformSelection.indexOf(name);
    if (idx > -1){      // already selected
        $scope.platformSelection.splice(idx, 1);
    }else {             // newly selected
        $scope.platformSelection.push(name);
    }
}



/*
 pgmemo inputs controller
*/
app.controller('pgmemoCont', function($scope, socket){
    console.log('socket test');
    socket.emit('pgmemoReadAll');
    socket.emit('pgmemoReadInfo');
    socket.on('pgmemoPutInfo', function(info){
        console.log('pgmemo get info:', info);
        $scope.info = info;
    });
    $scope.typeSelection = [];       // type selected array
    $scope.platformSelection = [];   // platform selected array
    $scope.toggleType = function(name){ // type click
        toggleType(name, $scope);
    }
    $scope.togglePlatform = function(name){ //platform click
        togglePlatform(name, $scope);
    }
    $scope.pgmemoTitle = '';
    $scope.pgmemoTag = 'ここにカンマ区切りタグ';
    $scope.pgmemoText = 'ここに本文';
});