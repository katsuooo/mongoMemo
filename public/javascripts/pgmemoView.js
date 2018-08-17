/*
 pgmemo view block
*/


/*
checkbox click
*/
/*
 emmit click
*/
var emitByCheck = function($scope, socket){
    socket.emit('pgmemoSelCheck', $scope.pgmemoView);
}

/*
 type checkbox click
*/
var toggleTypeView = function(name, $scope){
    var idx = $scope.pgmemoView.type.indexOf(name);
    if (idx > -1){      // already selected
        $scope.pgmemoView.type.splice(idx, 1);
    }else {             // newly selected
        $scope.pgmemoView.type.push(name);
    }
}
/*
 platform checkbox click
*/
var togglePlatformView = function(name, $scope){
    var idx = $scope.pgmemoView.platform.indexOf(name);
    if (idx > -1){      // already selected
        $scope.pgmemoView.platform.splice(idx, 1);
    }else {             // newly selected
        $scope.pgmemoView.platform.push(name);
    }
}

/*
 pgmemo view main
*/
var pgmemoView = function($scope, socket){
    $scope.pgmemoView = {
        title:'',
        type:[],
        platform:[],
        tag:'',
        text:''
    }
    $scope.toggleTypeView = function(name){
        toggleTypeView(name, $scope);
        emitByCheck($scope, socket);
    }
    $scope.togglePlatformView = function(name){
        togglePlatformView(name, $scope);
        emitByCheck($scope, socket);
    }
    $scope.pgmemoTagChange = function(){
        emitByCheck($scope, socket);
    }
    socket.on('pgmemoSelRead', function(seled){
        console.log(seled);
        $scope.pgmemoSels = seled;
    });
}
