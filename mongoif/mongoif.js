/*
 mongodb interface 書き直し

 mongodb ver 3.1.1 driver 
 v2.2.33以前とはapiが違う。

 memo用interface
 ubu18serverのmongodbに接続

  mongoif command
 readlimit, write, update, delete
*/
var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;
/*
from serverConfig.js

var CONFIG = require('./serverConfig');
const MONGOHQ_URL = CONFIG.MONGO_URL;
const dbName = CONFIG.MONGO_DB_NAME;
const collectionName = CONFIG.MONGO_COLLECTION_NAME;
*/
/*
from ./config/memoConfig.yaml
*/
/*
var fs = require('fs');
var yaml = require('js-yaml');

try {
  const CONFIG = yaml.safeLoad(fs.readFileSync('./config/memoConfig.yaml'));
  console.log(CONFIG);
  var MONGOHQ_URL = CONFIG.mongodb.url + ':' + CONFIG.mongodb.port.toString();
  var dbName = CONFIG.mongodb.db;
  var collectionName = CONFIG.mongodb.collection.simple;  
  console.log(MONGOHQ_URL);
}catch (e) {
  console.log(e);
}
*/
const CONFIG = require('../config/config.js').CONFIG;

const MONGOHQ_URL = CONFIG.mongodb.url + ':' + CONFIG.mongodb.port.toString();
const dbName = CONFIG.mongodb.db;
const collectionName = CONFIG.mongodb.collection.simple;  



/*
 セカンドリードリミット
 write, delete後にデータをリードする。
 データ数１０
 コネクションができている状態からたたかれる。
*/
const mongo2ndRead = function(collection, client){
    var dnum = 10;
    collection.find({}).sort({date:-1}).limit(dnum).toArray(function(err, docs) {
        if (err) {
            return console.error(err);
        }
        client.close();
        console.log('read after write');
        /*
         clientにsocketioデータを送る
        */
        io.emit('readall', docs);
    });    
}

/*
 mongoif

 exports func
*/
var mongoif = {
    readlimit : function(dnum){
        MongoClient.connect(MONGOHQ_URL, function(err, client) {
            if(err){
                return console.error(err);
            }
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            collection.find({}).sort({date:-1}).limit(dnum).toArray(function(err, docs) {
                if (err) {
                    return console.error(err);
                }
                io.emit('readall', docs);
                client.close();
            })
        })
    },
    write : function(json){
        MongoClient.connect(MONGOHQ_URL, function(err, client) {
            if(err){
                return console.error(err);
            }
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            console.log(json)
            collection.insert(json, function(err, docs){
                if (err) {
                    return console.error(err);
                }
                /*
                json 要素数
                */
                var jnum = Object.keys(docs).length;
                console.log('just inserted ', jnum, ' new documents!');
                //wevent.emit('mongowrite');
                /*
                write後にデータ読む
                */
                /*
                var dnum = 10;
                collection.find({}).sort({date:-1}).limit(dnum).toArray(function(err, docs) {
                    if (err) {
                        return console.error(err);
                    }
                    client.close();
                    console.log('read after write', docs);
                    //clientにsocketioデータを送る
                    io.emit('readall', docs);
                })
                */
                mongo2ndRead(collection, client);
            })
        })
    },
    update :  function(json){
        var objectid = new mongodb.ObjectID.createFromHexString(json.id);
        MongoClient.connect(MONGOHQ_URL, function(err, client) {
            if(err){
                return console.error(err);
            }
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            collection.update({_id: objectid}, {text: json.text, date: json.date},function(err, result) {
                if (err) {
                    return console.error(err);
                }
                console.log('one update ok!: ', json);
                mongo2ndRead(collection, client);
            });
        });
    },
    delete : function(){

    },
    deleteOne : function(delKey){
        console.log('deleteOne', delKey);
        MongoClient.connect(MONGOHQ_URL, function(err, client) {
            if(err){
                return console.error(err);
            }
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            collection.deleteOne(function(err, docs) {
                if (err) {
                    return console.error(err);
                }
                io.emit('readall', docs);
                client.close();
            })
        })
    },
    deletebyId : function(delid){
        console.log('deleteOnebyid', delid);
        MongoClient.connect(MONGOHQ_URL, function(err, client) {
            if(err){
                return console.error(err);
            }
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            idjson = {_id: new mongodb.ObjectID(delid)};
            collection.deleteOne(idjson, function(err, docs) {
                if (err) {
                    return console.error(err);
                }
                mongo2ndRead(collection, client);
            })
        })
    },
}

module.exports = mongoif;