/*
180711
mongodb interface main

コレクションを増やす。
メモ毎にコレクションをかえる。
メモ毎にインターフェースモジュールをわける。
*/

/*
 import and config set
*/

var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;
var fs = require('fs');
var yaml = require('js-yaml');


var config = {};
try {
  config= yaml.safeLoad(fs.readFileSync('./config/memoConfig.yaml'));

}catch (e) {
  console.log(e);
}

//const CONFIG = config;
const CONFIG = require('../config/config.js').CONFIG;
const MONGO_URL = CONFIG.mongodb.url + ':' + CONFIG.mongodb.port;
const dbName = CONFIG.mongodb.db;
const collectionName = CONFIG.mongodb.collection.pgmemo;  


/*
import memo interfaces
*/
/*
メモアプリごとにmongoモジュールをつくろうかと考えたが一旦やめる
*/
//var simpleMongo = require('./simpeleMongo');
//var pgMongo = require('./pgMongo');


/*
 deepcopy
*/
var myDeep = function(motoObj){
    return JSON.parse(JSON.stringify(motoObj));
}



/*
セカンドリードリミット
write, delete後にデータをリードする。
データ数１０
コネクションができている状態からたたかれる。
*/
const mongo2ndRead = function(collection, client){
   var dnum = CONFIG.pgmemo.recentMemoNum;
   collection.find({}).sort({date:-1}).limit(dnum).toArray(function(err, docs) {
       if (err) {
           return console.error(err);
       }
       client.close();
       console.log('read after write');
       /*
        clientにsocketioデータを送る
       */
       io.emit('pgmemoReadLimit', docs);
   });    
}

/*
 セレクタjson配列をつくる
*/
var genSelHai = function(selector){
    var hai = [];
    selector.platform.forEach(function(element){
       hai.push({platform: element});
    });
    selector.type.forEach(function(element){
        hai.push({type: element});
    });
    selector.tag.forEach(function(element){
        if(element !== ''){
            hai.push({tag: element});
        }
    });
    return myDeep(hai);
}

/*
 mongodb driver interface 
*/
var mongoifMain = {
  /*
   write
  */
  write : function(mongoCollection, json){
    MongoClient.connect(MONGO_URL, {useNewUrlParser:true}, function(err, client) {
        if(err){
            return console.error(err);
        }
        const db = client.db(dbName);
        const collection = db.collection(mongoCollection);
        collection.insert(json, function(err, docs){
            if (err) {
                return console.error(err);
            }
            /*
            json 要素数
            */
            var jnum = Object.keys(docs).length;
            console.log('just inserted ', jnum, ' new documents!');
            /*
            write後にデータ読む
            */
            mongo2ndRead(collection, client);
        })
    });
  },
  /*
   read limit
  */
  readAll : function(colName){
    MongoClient.connect(MONGO_URL, {useNewUrlParser:true}, function(err, client) {
        if(err){
            return console.error(err);
        }
        const db = client.db(dbName);
        const collection = db.collection(colName);
        collection.find({}).sort({date:-1}).toArray(function(err, docs) {
            if (err) {
                return console.error(err);
            }
            io.emit('dailysGet', docs);
            client.close();
        })
    })
  },
  /*
   read limit
  */
  readLimit : function(colName, dnum){
    MongoClient.connect(MONGO_URL, {useNewUrlParser:true}, function(err, client) {
        if(err){
            return console.error(err);
        }
        const db = client.db(dbName);
        const collection = db.collection(colName);
        collection.find({}).sort({date:-1}).limit(dnum).toArray(function(err, docs) {
            if (err) {
                return console.error(err);
            }
            io.emit('pgmemoReadLimit', docs);
            client.close();
        })
    })
  },
  deletebyId : function(colName, delid){
    console.log('deleteOnebyid', delid);
    MongoClient.connect(MONGO_URL, {useNewUrlParser:true}, function(err, client) {
        if(err){
            return console.error(err);
        }
        const db = client.db(dbName);
        const collection = db.collection(colName);
        idjson = {_id: new mongodb.ObjectID(delid)};
        collection.deleteOne(idjson, function(err, docs) {
            if (err) {
                return console.error(err);
            }
            mongo2ndRead(collection, client);
        })
    })
  },
  update :  function(colName, json){
    var objectid = new mongodb.ObjectID.createFromHexString(json._id);
    //var objectid = json._id;
    MongoClient.connect(MONGO_URL, {useNewUrlParser:true}, function(err, client) {
        if(err){
            return console.error(err);
        }
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        //collection.update({_id: objectid}, {text: json.text, date: json.date},function(err, result) {
        delete json._id;
        collection.update({_id: objectid}, json, function(err, result) {
            if (err) {
                return console.error(err);
            }
            mongo2ndRead(collection, client);
        });
    });
  } ,
  selRead :  function(colName, dnum, selector){    
    var selHai = [];
    selHai = genSelHai(selector);
    console.log('selHai', selHai);
    if (selHai.length === 0){
        io.emit('pgmemoSelRead', '');
        return;  
    }
    MongoClient.connect(MONGO_URL, {useNewUrlParser:true}, function(err, client) {
        if(err){
            return console.error(err);
        }
        const db = client.db(dbName);
        const collection = db.collection(colName);
        collection.find({$or: selHai}).sort({date:-1}).limit(dnum).toArray(function(err, docs) {
            if (err) {
                return console.error(err);
            }
            io.emit('pgmemoSelRead', docs);
            client.close();
        })
    })
  } 

}

module.exports = mongoifMain;