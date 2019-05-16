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
    socket.emit('panelStart');
    socket.on('panelReadAll', (d) =>{
        console.log('panel-read-all', d);
    });
    /*
     textarea string change
    */
    $scope.textChange = ((index, label) => {
        console.log(index, label, $scope.panela[index]['text'])
        let textNo = index * 2;
        let text = $scope.panela[index]['text'];
        if (label === 'b'){
            textNo += 1;
            text = $scope.panelb[index]['text'];
        }
        socket.emit('textChange', {index: textNo, textarea: text});
    });
});

