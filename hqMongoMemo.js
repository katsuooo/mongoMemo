
mongohq.js



//var MONGOHQ_URL="mongodb://katsuooo:kd206@kahana.mongohq.com:10040/katsuooo";
var MONGOHQ_URL="192.168.10.132:27017";
// npm install mongodb
var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;



//function mongoTest(){
function mongohq(){
}



mongohq.prototype.readall = function(event){
	MongoClient.connect(MONGOHQ_URL, function(err, db) {
		if(err){
			return console.error(err);
		}
		// operate on the collection named "test"
		var collection = db.collection('memo');
		collection.find({}).toArray(function(err, docs) {
			if (err) {
				return console.error(err);
			}
			docs.forEach(function(doc) {
//				console.log('found document: ', doc);
			})
			event.emit('mongoread', docs);
			db.close();
		})
	})
}

mongohq.prototype.readlimit = function(dnum, event){
	MongoClient.connect(MONGOHQ_URL, function(err, db) {
		if(err){
			return console.error(err);
		}
		// operate on the collection named "test"
		var collection = db.collection('memo');
		collection.find({}).sort({date:-1}).limit(dnum).toArray(function(err, docs) {
		//collection.find({}).sort({$natural:-1}).limit(10).toArray(function(err, docs) {
		//collection.find({}).sort({_id:1}).limit(10).toArray(function(err, docs) {
			if (err) {
				return console.error(err);
			}
			docs.forEach(function(doc) {
//				console.log('found document: ', doc);
			})
			event.emit('mongoread', docs);
			db.close();
		})
	})
}


mongohq.prototype.write = function(json, wevent){
	var record;
	MongoClient.connect(MONGOHQ_URL, function(err, db) {
		if(err){
			return console.error(err);
		}
		var collection = db.collection('memo');
		collection.insert(json, function(err, docs){
			if (err) {
				return console.error(err);
			}
			console.log('just inserted ', docs.length, ' new documents!');
			wevent.emit('mongowrite');
			//mongohq.prototype.readall(wevent);
			db.close();
		})
	})
}

mongohq.prototype.delete = function(id, devent){
	var objectid = new mongodb.ObjectID.createFromHexString(id);
	//console.log('objectid.isValid=', objectid.isValid());
	MongoClient.connect(MONGOHQ_URL, function(err, db) {
		if(err){
			return console.error(err);
		}
		var collection = db.collection('memo');
		collection.remove({_id: objectid}, function(err, result) {
			if (err) {
				return console.error(err);
			}
			console.log('one delete ok!: '+ id);
			devent.emit('mongodelete');
			//db.close();
		});
	});
}


mongohq.prototype.update = function(json, devent){
	var objectid = new mongodb.ObjectID.createFromHexString(json.id);
	//console.log('objectid.isValid=', objectid.isValid());
	MongoClient.connect(MONGOHQ_URL, function(err, db) {
		if(err){
			return console.error(err);
		}
		var collection = db.collection('memo');
		console.log('mongo.update-json', json);
		collection.update({_id: objectid}, {text: json.text, date: json.date},function(err, result) {
			if (err) {
				return console.error(err);
			}
			console.log('one update ok!: ', json);
			devent.emit('mongoupdate');
			//db.close();
		});
	});
}

mongohq.prototype.test = function(){

	MongoClient.connect(MONGOHQ_URL, function(err, db) {
		if(err){
			return console.error(err);
		}
//	console.log(db);
// operate on the collection named "test"
		var collection = db.collection('test');

	// remove all records in collection (if any)
		console.log('removing documents...');
		collection.remove(function(err, result) {
			if (err) {
				return console.error(err);
			}
			console.log('collection cleared!');
		// insert two documents -> three
			console.log('inserting new documents...');
			collection.insert([{name: 'tester1'}, {name: 'coder1'}, {name: 'katsuooo1'}], function(err, docs) {
				if (err) {
					return console.error(err);
				}
				console.log('just inserted ', docs.length, ' new documents!');
				collection.find({}).toArray(function(err, docs) {
					if (err) {
						return console.error(err);
					}

					docs.forEach(function(doc) {
						console.log('found document: ', doc);
					})
				})
			})
		})
	})
}


mongohq.prototype.test2 = function(){

	MongoClient.connect(MONGOHQ_URL, function(err, db) {
		if(err){
			return console.error(err);
		}
//	console.log(db);
// operate on the collection named "test"
		var collection = db.collection('test');

	// remove all records in collection (if any)
		console.log('removing documents...');
		collection.remove(function(err, result) {
			if (err) {
				return console.error(err);
			}
			console.log('collection cleared!');
		// insert two documents -> three
			console.log('inserting new documents...');
			collection.insert([{name: 'tester1'}, {name: 'coder1'}, {name: 'katsuooo1'}], function(err, docs) {
				if (err) {
					return console.error(err);
				}
				console.log('just inserted ', docs.length, ' new documents!');
				collection.find({}).toArray(function(err, docs) {
					if (err) {
						return console.error(err);
					}
					docs.forEach(function(doc) {
						console.log('found document: ', doc);
					})
					//collection.remove({name: 'katsuooo1'}, function(err,result){
					collection.remove({_id: docs[0]._id}, function(err,result){
						if(err){
							return console.error(err);
						}
						console.log('remove katsuooo');
					});
				})
			})
		})
	})
}



// data check --- if .text is nothing, deleate record
mongohq.prototype.data_check = function(){
	MongoClient.connect(MONGOHQ_URL, function(err, db) {
		if(err){
			return console.error(err);
		}
		var collection = db.collection('memo');

		collection.find({}).toArray(function(err, docs) {
			if (err) {
				return console.error(err);
			}
			docs.forEach(function(doc) {
				console.log('found document: ', doc);
				if((doc.text === null)||(doc.text === undefined)||(doc.text === '')){
					console.log('removing one documents...' + doc._id);
					collection.remove({_id: doc._id}, function(err, result) {
					//collection.remove({text:doc.text},function(err, result){
						if (err) {
							return console.error(err);
						}
						console.log('one cleared!: '+ doc._id);
					});
				}
			});
			//db.close();
		})
	})
}




module.exports = new mongohq();





///////////////////////////////////////////////////////////////////////////////
socketio.js






var mongohq = require('./mongohq');
var dateformat = require('dateformat');
var EventEmitter = require('events').EventEmitter;
var ev = new EventEmitter();
var evw = new EventEmitter();
var rdnum = 10;

console.log('socketio start')




function socketio(server) {
	//console.log('server', server);
  io = require('socket.io')(server);
	//console.log('io', io);
  io.on('connection', function(socket){
    socket.on('chat', function(msg){
		  io.emit('chat', msg);	
	  });
		socket.on('memostart', function(){
			console.log('socket-memostart');
			//mongohq.readall(ev);
			rdnum = 10;
			mongohq.readlimit(rdnum, ev);
		});
		socket.on('memowrite', function(text, ev){
			console.log('socket-write: '+text);
			var wdata = {
				date: dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
				text: text
			}
			mongohq.write(wdata, evw);
		});
		socket.on('memodelete', function(id){
			console.log('socket-deleat: '+id);
			mongohq.delete(id, evw);
		});
		socket.on('memoupdate', function(json){
			console.log('socket-update: ',json);
			mongohq.update(json, evw);
		});
		socket.on('next', function(){
			rdnum += 10;
			mongohq.readlimit(rdnum, ev);
		});
  });
	ev.on('mongoread', function(docs){
		io.emit('readall', docs);
		docs.forEach(function(doc){
			//console.log(doc);
		});
		console.log('ev-readall complete');
	});

	evw.on('mongowrite', function(){
		//mongohq.readall(ev);
		mongohq.readlimit(rdnum, ev);
	});
	evw.on('mongodelete', function(){
		console.log('evw-mongo.delete');
		//mongohq.readall(ev);
		mongohq.readlimit(rdnum, ev);
	});
	evw.on('mongoupdate', function(){
		console.log('evw-mongo-update');
		//mongohq.readall(ev);
		mongohq.readlimit(rdnum, ev);
	});

}




module.exports = socketio;
