/*
190513
angular template
*/
/*
 angular controller
*/
var app = angular.module('panelApp', []);
/*
 new form controller
*/
app.controller('panelCont', function($scope, socket){
    console.log('panel cont');
    $scope.panela = []
    $scope.panelb = []
    for(let i=0; i<16; i++){
        $scope.panela.push({text: 'x'});
        $scope.panelb.push({text: 'y'});
    }
    $scope.click1 = function(){
        console.log('click1');
        $scope.panela[0].text = 'abc';
    }
});

