/*
 mongo interface async
*/

var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;
var fs = require('fs');
var CONFIG = require('../config/config').CONFIG;

const MONGO_URL = CONFIG.mongodb.url + ':' + CONFIG.mongodb.port;
const dbName = CONFIG.mongodb.db;
//const collectionName = CONFIG.mongodb.collection.pgmemo

/*
 connect
*/
var connect = function(dbName){

}
/*
 dbとコレクションのリスト表示
*/
var showDbAndCollection = async() => {
    const client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = await client.db('test');
    var adminDb = db.admin();
    var x = await adminDb.listDatabases();
    //client.close();
    //console.log(x.databases);
    var dbs = [];
    x.databases.forEach((db) => {
        //console.log(db.name);
        dbs.push(db.name);
    });
    console.log(dbs);
    for(var i=0; i<dbs.length; i++){
        const db = await client.db(dbs[i]);
        const colList = await db.listCollections({}).toArray();
        //console.log(dbs[i], colList);
        var cols = [];
        colList.forEach( (col) => {
            cols.push(col.name);
        });
        console.log(dbs[i], cols);
    }
    client.close();
}
/*
 mongo info を返す

 この関数が非同期であるため、socketを持ち込んで送信まで行う。
 この関数内は同期してるのでシーケンシャルに書ける。

 param  : socket, socketioオブジェクト
*/
var getDbAndCollection = async(socket) => {
    const client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = await client.db('test');
    var adminDb = db.admin();
    var x = await adminDb.listDatabases();
    var dbs = [];
    x.databases.forEach( (db) => {
        dbs.push(db.name);
    });
    var dbInfo = [];
    for(var i=0; i<dbs.length; i++){
        const db = await client.db(dbs[i]);
        const colList = await db.listCollections({}).toArray();
        var cols = [];
        colList.forEach( (col) => {
            cols.push(col.name);
        });
        dbInfo.push({db: dbs[i], col: cols});
    }
    var mongoInfo = {
        server: MONGO_URL,
        dbs: dbInfo
    }
    client.close();
    socket.emit('onMongoInfo', mongoInfo);
}
/*
 daily から最新の日付を取得する
*/
async function getLatestDay(colName){
    console.log('xxx');
    const client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = await client.db(dbName);
    const collection = await db.collection(colName);
    const d = await collection.find({}).sort({day:-1}).limit(1).toArray();
    client.close();
    const latestDay = d[0].day;
    console.log(latestDay);
}
/*
 async mongo interface 
*/
var mongoIfAsync = {
    showDb: function(){

    },
    showCollection: function(){

    },
    showDbAndCollection: function(){
        showDbAndCollection();
    },
    /*
     dbを読み取りcollectionを取得し、socketで返信
    */
    getDbAndCollection: (socket) => {
        getDbAndCollection(socket);
    },
    /*
     dailyから最新のdayを取得する。
    */
    getLatestDay: (colName) => {
        getLatestDay(colName);
    }
};


module.exports = mongoIfAsync;