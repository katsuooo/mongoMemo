
var socket = io.connect();
/*
 check day
 日付ごとにデータをまとめる。
 日付は取得時にソートされてる。

 param  : day
 return :
*/
var lastDay = '';
function checkDay(){

}

/*
 gen days list
 daysDoc = [
	 {
	 day: xxxx-xx-xx,
	 text: ......
	 },
 ]


 }
 dayが複数の場合はtextに追加されてく。
 textはnullで、daysDocを作成する
 param  : day
 return : none
*/
var daysDoc = [];
function checkDupulicateDay(day){
	var dupFlag = false;
	daysDoc.forEach( (dd) => {
		if(dd.day === day){
			dupFlag = true;
		}
	});
	return dupFlag;
}
function addDaysDoc(day){
	var doc = {
		day: day,
		text: ''
	}
	daysDoc.push(doc);
}
function genDaysList(day){
	if(checkDupulicateDay(day) === false){
		addDaysDoc(day);	// 重複なし時
	}
}
function clearDaysDoc(){
	daysDoc = [];
}
function getTime(date){
	return date.split(' ')[1];
}
function addText(doc){
	//console.log('addtext');
	//console.log(doc)
	for(var i=0; i<daysDoc.length; i++){
		//console.log(daysDoc[i].day, doc.day);
		if(daysDoc[i].day === doc.day){
			var time = getTime(doc.date);
			daysDoc[i].text += ('\n\n' + time);
			daysDoc[i].text += ('\n' + doc.text);
			break;
		}
	}
}
function escapeText(text){
	//text = text.replace('<', '!!!');
	text = text.split('<').join('&lt;');
	//console.log('text');
	return text;
}
var daysDocView = [];	// view用にescape
function genView(){
	daysDocView = [];
	daysDoc.forEach( (doc) => {
		var escapes = escapeText(doc.text);
		doc.text = escapes;
		daysDocView.push(doc);
	});
}
function removeStartKai(){
	for(var i=0; i<daysDoc.length; i++){
		daysDoc[i].text = daysDoc[i].text.slice(1, );
	}
}
/*
 simpleMemoをdailyに仕分け
*/
function genDaily(docs){
	docs2 = [];		// add day key
	clearDaysDoc();
	docs.forEach( (doc) => {
		var day = doc.date.split(' ')[0];
		doc.day = day;
		docs2.push(doc);
		genDaysList(doc.day);
	})
	docs2.forEach( (doc) => {
		//console.log(doc.day);
		addText(doc);
	});
	removeStartKai();
}

/*
card view
*/
socket.on('dailyMemoGet',function(docs){
	console.log(docs);
	var item2;
	var count = 0;
	$('#message_list').empty();
	docs.forEach(function(doc){
		//primary, secondary, success, danger, warning,
		//info, light, dark
		switch(count++%8){
			case 0:
				item2 = '<div class="card border-primary">';
				item2 += '<div class="card-body text-primary" no="dummy">'+doc.day;
				break;
			case 1:
				item2 = '<div class="card border-secondary">';
				item2 += '<div class="card-body text-secondary" no="dummy">'+doc.day;
				break;
			case 2:
				item2 = '<div class="card border-success">';
				item2 += '<div class="card-body text-success" no="dummy">'+doc.day;
				break;
			case 3:
				item2 = '<div class="card border-danger">';
				item2 += '<div class="card-body text-danger" no="dummy">'+doc.day;
				break;
			case 4:
				item2 = '<div class="card border-warning">';
				item2 += '<div class="card-body text-warning" no="dummy">'+doc.day;
				break;
			case 5:
				item2 = '<div class="card border-info">';
				item2 += '<div class="card-body text-info" no="dummy">'+doc.day;
				break;
			case 6:
				item2 = '<div class="card border-light">';
				item2 += '<div class="card-body" no="dummy">'+doc.day;
				break;
			case 7:
				item2 = '<div class="card border-dark">';
				item2 += '<div class="card-body text-dark" no="dummy">'+doc.day;
				break;
		}
		item2 += '<span class="fas fa-trash-alt" aria-hidden="true" style="float:right;"> </span>';
		item2 += '<span class="fas fa-edit" aria-hidden="true" style="float:right;margin-right:15px;"> </span>';
		item2 += '</div>';
    	item2 += '<textarea class="panel-body animated" rows="8">'+doc.text+'</textarea></div>';
    	item2 = item2.replace('dummy', doc._id);
		$('#message_list').append(item2).hide().fadeIn(250);
	});
	$('#m').val("");
});





$(document).ready(function(){
	socket.emit('dailyMemoStart');	// read mongo.myMemo/daily
	/*
	$('#send').click(function(){
		var docs = $('#m').val();
		socket.emit('memowrite', $('#m').val());
	});
	*/
	$(document).on('focus', 'textarea', function(){
		$(this).autosize();
	});

	$(document).on('click', '.fa-edit', function(){
		if(confirm('update this record?')){
			var lid = $(this).closest('.card-body').attr('no');
			var ltext = $(this).closest('.card-body').closest('.card').children('.panel-body').val();
			var ldate = $(this).closest('.card-body').text();
			var json = {id:lid, text:ltext, date:ldate};
			socket.emit('dailyupdate', json);
		}else{
			console.log('update-no');
		}
	});
	$(document).on('click', '.fa-trash-alt', function(){
		if(confirm('deleat this record?')){
			var id = $(this).closest('.card-body').attr('no');
			socket.emit('dailydelete', id);
		}else{
			console.log('deleat-no');
		}
	});
	
	$('#nextbtn').click(function(){
		console.log('next20');
		socket.emit('nextDaily');
	});
	

});
