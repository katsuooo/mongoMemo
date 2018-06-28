/*
190515 kdesign

 mongodb interface for client side


 io use socketio

*/

var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;
var socket;

console.log('mongoif start');

/*
 latest New event
*/






/**************************************************************
 server functions
*/

/****************************
 sougou Event
*/
function sougouEvent(socket){
  /*
   read Latest data
  */
  socket.on('readLatest', function(){
    console.log('getEmmit!!!');
    MongoClient.connect(serverConfig.MONGO_URL, function(err, db) {
      if(err){
        return console.error(err);
      }
      var collection = db.collection('Latest');
      collection.find({}).toArray(function(err, docs) {
        if (err) {
          return console.error(err);
        };
        db.close();
        if(docs.length === 0){	// not exist t_settings
          console.log('mongodb has no Latest');
          var defFile = fs.readFileSync(serverConfig.LATEST_DEFAULT_FILE, 'utf-8');
          docs = JSON.parse(defFile.toString().trim());
        }else{
          docs = JSON.parse(JSON.stringify(docs[0]));
        }
        io.emit('r_readLatest', docs);
        //console.log(docs);
      });
    });
  });
  /*
   read config data
  */
  socket.on('readConfig', function(){
    console.log('getEmmit!!!');
    MongoClient.connect(serverConfig.MONGO_URL, function(err, db) {
      if(err){
        return console.error(err);
      }
      var collection = db.collection('config');
      collection.find({}).toArray(function(err, docs) {
        if (err) {
          return console.error(err);
        };
        db.close();
        if(docs.length === 0){	// not exist t_settings
          console.log('mongodb has no config');
          var defFile = fs.readFileSync(serverConfig.SYSCONFIG_DEFAULT_FILE, 'utf-8');
          docs = JSON.parse(defFile.toString().trim());
        }else{
          docs = JSON.parse(JSON.stringify(docs[0]));
        }
        console.log('readconfig');
        io.emit('r_readConfig', docs);
      });
    });
  });


}

/*****************************
 parent Event
*/
function parentEvent(socket){
  // from data save
  socket.on('parentSave', (docs) => {
    console.log('parent Save');
    MongoClient.connect(serverConfig.MONGO_URL, function(err, db) {
      if(err){
        return console.error(err);
      }
      var collection = db.collection('config');
      var o_id = new mongodb.ObjectID(docs._id);
      delete docs['_id'];
      collection.update(
        {_id: o_id},
        {$set: docs},
        {upsert: true},
        function(err, result){
          if(err){
            console.log('err', err);
            return console.error(err);
          }
          io.emit('r_parentSave');
          db.close();
          //events.ev.emit('configChangeEvent');  // >>>> servertoMongo
        }
      );
    });; // mongoclient end
  }); // socket end
}




/*********************************
 child Event
*/
function childEvent(socket, id){
  /*
   child save
  */
  socket.on('childSave', function(docs){
    var no = docs.child;  // children hai No
    MongoClient.connect(serverConfig.MONGO_URL, function(err, db) {
      if(err){
        return console.error(err);
      }
      var collection = db.collection('config');


      /*
       test
      */
/*
      collection.find({children:{$elemMatch:{child: no}}}).toArray(function(err, docs) {
        if (err) {
          return console.error(err);
        };
        db.close();
        console.log(docs);
      });
*/



      var o_id = new mongodb.ObjectID(docs._id);
      delete docs['_id'];
//console.log(docs);
      collection.update(
        //{children:{$elemMatch:{child: no}}},
        //{$set: JSON.parse(JSON.stringify(docs))},
        {_id: o_id},
        //{$set: docs},
        docs,
        {upsert: true},
        function(err, result) {
          if(err){
            console.log('err', err);
            return console.error(err);
          }
          //console.log('upsert', result);
          io.emit('r_childSave');
          db.close();
          //events.ev.emit('configChangeEvent');  // >>>> servertoMongo
      });  // update




    });  // mongo
  }); // socket
}



/*****************************************************

  mead event

*/

function measEvent(socket){
  /*
   read 30min data
  */
  socket.on('read30min', function(daysum){
    console.log('read30min socketon');
    if(daysum > 0) daysum = 0;
    var day = new moment();
    var daystr = day.add(daysum,'days').format("YYYY-MM-DD");
    console.log('powerday', daystr);
    var collectionName = 'power_' + daystr;
    MongoClient.connect(serverConfig.MONGO_URL, function(err, db) {
      if(err){
        return console.error(err);
      }
      var collection = db.collection(collectionName);
      collection.find({}).toArray(function(err, docs) {
        if (err) {
          return console.error(err);
        };
        db.close();
        //docs = JSON.parse(JSON.stringify(docs[0]));
        console.log('read30min', daysum, docs);
        io.emit('r_read30min', docs);
      });
    });
  });
}



/*****************************************************

  header event

*/

function headerEvent(socket){
  /*
   read 30min data
  */
  socket.on('getUartState', function(daysum){
    console.log('getUartState socketon');
    MongoClient.connect(serverConfig.MONGO_URL, function(err, db) {
      if(err){
        return console.error(err);
      }
      var collection = db.collection('serverState');
      collection.find({}).toArray(function(err, docs) {
        if (err) {
          return console.error(err);
        };
        db.close();
        //docs = JSON.parse(JSON.stringify(docs[0]));
        console.log(docs);
        io.emit('uartState', docs[0].uartState);
      });
    });
  });
}

/*
memo event
*/
function memoEvent(socket){
  socket.on('memowrite', function(docs){
    console.log('getEmmit!!!', docs);
  });
}







/******************************************************************
  socketio set
*/
function mongoif(server){
  console.log('mongoif2');
  io = require('socket.io')(server);
/*
  io.on('connection', function(socket){
    sever_socketon(socket);
  });
*/
  io.on('connection', function(socket){
    /*
    socket.on('memowrite', function(docs){
      console.log('getEmmit!!!', docs);
    });
    */
    //sougouEvent(socket);
    memoEvent(socket);
    /*
    parentEvent(socket);
    childEvent(socket);
    measEvent(socket);
    headerEvent(socket);
    */
    /*
     csv folder open request
    */
    socket.on('folderOpen', function(){
      require('child_process').exec('start "" "c:\\enesave\\ecoace\\ecoaceCsv"');
    });
  });


 

}

module.exports = mongoif;
