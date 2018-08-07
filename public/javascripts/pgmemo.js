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

/*
 newHaiにhai要素がなければアペンドする
*/
var checkDuplicateSub = function(hai, newHai){
  for(var i=0; i<newHai.length; i++){
    if(newHai[i] === hai){
      return newHai;
    }
  }
  newHai.push(hai);
  return newHai;
}
/*
 重複チェック
 配列で重複を除く
 memo.tagで値が重複した場合、ng-repeatでエラーがでる。
 */
var checkDuplicate = function(hais){
  var newHai = [];
  hais.forEach(function(hai){
    newHai = checkDuplicateSub(hai, newHai);
  });
  hais = newHai;
  return hais;
}
/*
 pgmemo check
 pgmemo.tagに重複データがあると、ng-repeatでエラーになる。
 json化されたときにキーが重複する
*/
var pgmemoCheck = function($scope, pgmemos){
  for(i=0; i<pgmemos.length; i++){
    /*
     tag配列の重複をチェック
    */
    if(pgmemos[i].tag.constructor === [].constructor){
      pgmemos[i].tag = checkDuplicate(pgmemos[i].tag);
    }else{
      pgmemos[i].tag = [];
    }
  }  
  return pgmemos;
}




/*
 angular controller
*/
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
    //clearHens($scope.pgmemo);
  }

  /*
   readLimit on
  */
  socket.on('pgmemoReadLimit', function(d){
    $scope.pgmemos = pgmemoCheck($scope, d);
    clearHens($scope);
  });

  /*
   recently
  */
  pgmemoRecently($scope, socket);


});


