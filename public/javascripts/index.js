
var app = angular.module('indexApp', []);
/*
 new form controller
*/
/*
info = {
collection: {simple: "text", pgmemo: "pgmemo"}
db: "myMemo"
port: 27017
url: "mongodb://192.168.10.132"
}
*/
app.controller('indexCont', function($scope, socket){
    console.log('index cont');
    socket.emit('index_start');
    socket.on('mongo_url_info', (info) => {
        console.log('mongo url', info);
        if (info.url.includes('//')){
            $scope.mongo_url = info.url.split('//')[1];
        }else{
            $scope.mongo_url = info.url;
        }
        $scope.mongo_port = info.port;
    });
    $scope.url_change = function(){
        const new_url = { url: $scope.mongo_url, port: $scope.mongo_port };
        socket.emit('new_url', new_url);
    }
});



