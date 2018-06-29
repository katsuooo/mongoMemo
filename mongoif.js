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
var CONFIG = require('./serverConfig');
const MONGOHQ_URL = CONFIG.MONGO_URL;
const dbName = CONFIG.MONGO_DB_NAME;
const collectionName = CONFIG.MONGO_COLLECTION_NAME;

var mongoif = {
    readlimit : function(dnum, ev){
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
                docs.forEach(function(doc) {
                })
                //event.emit('mongoread', docs);
                client.close();
                console.log(docs)
            })
        })
    },
    write : function(json, wevent){
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
                //console.log(docs);
                /*
                json 要素数
                */
                var jnum = Object.keys(docs).length;
                console.log('just inserted ', jnum, ' new documents!');
                //wevent.emit('mongowrite');
                /*
                write後にデータ読む
                */
                var dnum = 10;
                collection.find({}).sort({date:-1}).limit(dnum).toArray(function(err, docs) {
                    if (err) {
                        return console.error(err);
                    }
                    client.close();
                    console.log('read after write', docs);
                    /*
                     clientにsocketioデータを送る
                    */
                    io.emit('readall', docs);
                })
            })
        })
    },
    update :  function(){

    },
    delete : function(){

    }
}

module.exports = mongoif;