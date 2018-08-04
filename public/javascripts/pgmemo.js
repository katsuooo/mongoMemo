/*
180712
pg memo controller
*/










/*
checkbox click
*/

/*
 type checkbox click
*/
var toggleType = function(name, $scope){
    console.log('click type');
    var idx = $scope.pgmemo.type.indexOf(name);
    if (idx > -1){      // already selected
        $scope.pgmemo.type.splice(idx, 1);
    }else {             // newly selected
        $scope.pgmemo.type.push(name);
    }
}
/*
 platform checkbox click
*/
var togglePlatform = function(name, $scope){
    console.log('click type');
    var idx = $scope.pgmemo.platform.indexOf(name);
    if (idx > -1){      // already selected
        $scope.pgmemo.platform.splice(idx, 1);
    }else {             // newly selected
        $scope.pgmemo.platform.push(name);
    }
}

/*
 input on button handlar
*/
var inputBtnOn = function(memos){
  console.log('input button on', memos);
}







var app = angular.module('pgmemoApp', []);
/*
 new form controller
*/
app.controller('pgmemoCont', function($scope, socket){
 console.log('angularjs(1) base');
 //$scope.test = 'teat val';
 
 //socket.emit('pgmemoReadAll');
 socket.emit('pgmemoReadInfo');
 socket.on('pgmemoPutInfo', function(info){
     console.log('pgmemo get info:', info);
     $scope.info = info;
     socket.emit('pgmemoReadLimit');
 });
 
 
  $scope.pgmemo = {
    title:'',
    type:[],
    platform:[],
    tag:'',
    text:''
  }
 
  /*
  checkboxで選択された要素の配列
  */
  /*
  $scope.typeSelection = [];
  $scope.platformSelection = [];
  */
  $scope.toggleType = function(name){
    toggleType(name, $scope);
  }
  $scope.togglePlatform = function(name){
    togglePlatform(name, $scope);
  }

  /*
   checkbox data
  */
 /*
  $scope.info = {
    type:[
      'python',
      'node',
      'angularjs',
      'reactjs',
      'javascript',
      'bootstrap',
      'html',
      'css',
      'c'
    ],
    platform:[
      'win10',
      'windows',
      'ubuntu18',
      'ubuntu',
      'linux',
      'mac',
      'pic',
      'embedded'
    ]
  }
  */
  /*
   input On button
  */
  $scope.inputOn = function(){
    inputBtnOn($scope.pgmemo);
    socket.emit('pgmemoNew', $scope.pgmemo);
  }

  /*
   readLimit on
  */
  socket.on('pgmemoReadLimit', function(d){
    console.log('pgmemoReadLimit', d);
    $scope.pgmemos = d;
  });

  /*
   recently
  */
  pgmemoRecently($scope, socket);
});


