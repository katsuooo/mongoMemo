/*
190513
angular template
*/



/**
 * 
 * @param {*} all 
 */
/*
 複数パネル想定なので、配列で帰ってくる。
*/
function getCurrent(all){
    var current;
    all.forEach((p) => {
        if(p.title === 'current'){
            current = p;
        } 
    });
    return current;
}


/**
 * 
 * @param {json} all 
 */
var all = {};
/*
{ _id: 5cdf6938a5a69a0fac8a6ee9,
    datetime: '2019-05-18T11:08:53+09:00',
    title: 'current',
    panel:
     [ '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}',
       '{"p_title":"","datetime":"2019-05-18T11:08:53+09:00","text":[]}' ] }
の配列
*/
function setAllPanels(fromMongo, $scope){
    all = JSON.parse(JSON.stringify(fromMongo));
    let current = getCurrent(all);
    console.log('current', current);
    for (var i=0; i<8; i++){
        var index = i*2;
        $scope.panela[i].text = current.panel[index].text.join('\n')
        $scope.panelb[i].text = current.panel[index+1].text.join('\n')
        $scope.panela[i].datetime = current.panel[index].datetime;
        $scope.panelb[i].datetime = current.panel[index+1].datetime;
    }
    console.log('datetime type', typeof($scope.panela[0].datetime));
    console.log($scope.panela[0].datetime);
}
/*
 datetime のupdate
*/
function datetimeUpdate(para, $scope){
    console.log('para', para);
    console.log('b', $scope.panelb);
    var hai = parseInt(para.index/2);
    var ab = para.index%2;
    console.log(hai, ab);
    if (ab == 1){
        $scope.panelb[hai].datetime = para.datetime;        
    }else{
        $scope.panela[hai].datetime = para.datetime;             
    }
    console.log($scope.panela);
}
/*
 angular controller
*/
var app = angular.module('panelApp', []);
/*
 new form controller
*/
app.controller('panelCont', function($scope, socket){
    console.log('panel cont');
    $scope.panela = [];
    $scope.panelb = [];
    
    for(let i=0; i<8; i++){
        $scope.panela.push({text: 'x', datetime:'niku'});
        $scope.panelb.push({text: 'y', datetime:'meshi'});
    }

    $scope.click1 = function(){
        console.log('click1');
        $scope.panela[0].text = 'abc';
    }
    socket.emit('panelStart');
    socket.on('panelReadAll', (d) => {
        //console.log('panel-read-all', d);
        setAllPanels(d, $scope);
    });
    socket.on('update', (para) => {
        console.log(para);
        datetimeUpdate(para, $scope);
    });
    /*
     textarea string change
    */
    $scope.textChange = ((index, label) => {
        console.log(index, label, $scope.panela[index]['text'],all[0]._id)
        let textNo = index * 2;
        let text = $scope.panela[index]['text'];
        if (label === 'b'){
            textNo += 1;
            text = $scope.panelb[index]['text'];
        }
        socket.emit('textChange', {index: textNo, textarea: text, _id: all[0]._id});
    });
    /*
     textarea click
    */
    $scope.textClick = ((index, label) => {
        console.log('click');
    });
});

