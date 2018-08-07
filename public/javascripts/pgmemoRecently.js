
/*
 pgmemo left side bar
*/
/*
 clear hens
*/
var clearHens = function($scope){
  $scope.pgmemo = {};
  $scope.pgmemo.title = '';
  $scope.pgmemo.type = [];
  $scope.pgmemo.platform = [];
  $scope.pgmemo.tag = '';
  $scope.pgmemo.text = '';
}

/*
 henshuu item load
*/
/*
$scope.pgmemo = {
  title:'',
  type:[],
  platform:[],
  tag:'',
  text:''
}
*/
var loadHens = function($scope, memo){
  $scope.pgmemo = jQuery.extend(true, {}, memo);

  var hai = $scope.pgmemo.tag.join(', '); 
  $scope.pgmemo.tag = hai;
  /*
   $$hashkeyを削除する
  */
  $scope.pgmemo = JSON.parse(angular.toJson($scope.pgmemo));
  console.log('x',$scope.pgmemo, typeof($scope.pgmemo));
}


/*
 called from main controller
*/
var pgmemoRecently = function($scope, socket){
  /*
   del icon on
  */
  $scope.pgDelete = function(id){
    console.log('del click', id);
    if(confirm('delete?')){
      console.log('del confirm');
      socket.emit('pgmemoDelete', id);
    }
  }
  /*
   hen icon on
  */
  $scope.pgHen = function(memo){
    console.log(memo);
    if(confirm('編集する？')){
      loadHens($scope, memo);
    }
  }
}