
/*
 pgmemo left side bar
*/


/*
 henshuu item load
*/

var loadHens = function(memo){
  console.log('load hen data', memo);
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
      socket.emit('pgmemoDelete', id);
    }
  }
  /*
   hen icon on
  */
  $scope.pgHen = function(memo){
    console.log('hen click', memo);
    if(confirm('編集する？')){
      loadHens(memo);
    }
  }
}