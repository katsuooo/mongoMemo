
var socket = io.connect();


socket.on('readall',function(docs){
	console.log('r-readall');

	var item2;
	var count = 0;
	$('#message_list').empty();
	docs.forEach(function(doc){
		switch(count++%4){
			case 0:
		    item2 = '<div class="panel panel-default">';
				break;
			case 1:
				item2 = '<div class="panel panel-success">';
				break;
			case 2:
		    item2 = '<div class="panel panel-info">';
				break;
			case 3:
				item2 = '<div class="panel panel-warning">';
				break;
		}
		item2 += '<div class="panel-heading" no="dummy">'+doc.date;
		item2 += '<span class="glyphicon glyphicon-remove-circle" aria-hidden="true" style="float:right;"> </span>';
		item2 += '<span class="glyphicon glyphicon-record" aria-hidden="true" style="float:right;margin-right:15px;"> </span>';
		//item2 += '<button type="button" class="btn btn-primary"><i class="glyphicon glyphicon-ok"></i></button>';
		item2 += '</div>';
    item2 += '<textarea class="panel-body animated">'+doc.text+'</textarea></div>';
    item2 = item2.replace('dummy', doc._id);
    //$('#message_list').prepend(item2).hide().fadeIn(250);
		$('#message_list').append(item2).hide().fadeIn(250);
	});
	$('#m').val("");
});

$(document).ready(function(){
	socket.emit('memostart');
	$('#send').click(function(){
		var docs = $('#m').val();
		console.log(docs)
		socket.emit('memowrite', $('#m').val());
		console.log('client-write');
	});

	$(document).on('focus', 'textarea', function(){
		$(this).autosize();
	});

	$(document).on('click', '.glyphicon-record', function(){
		if(confirm('update this record?')){
			var lid = $(this).closest('.panel-heading').attr('no');
			var ltext = $(this).closest('.panel-heading').closest('.panel').children('.panel-body').val();
			var ldate = $(this).closest('.panel-heading').text();
			console.log('ltext:',ltext);
			var json = {id:lid, text:ltext, date:ldate};
			console.log('update-yes:', json);
			socket.emit('memoupdate', json);
		}else{
			console.log('update-no');
		}
	});
	$(document).on('click', '.glyphicon-remove-circle', function(){
		if(confirm('deleat this record?')){
			var id = $(this).closest('.panel-heading').attr('no');
			console.log('deleat-yes:', id);
			socket.emit('memodelete', id);
		}else{
			console.log('deleat-no');
		}
	});
	$('#nextbtn').click(function(){
			socket.emit('next');
	});
});
