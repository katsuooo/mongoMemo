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
 dailyへのデータ追加
 getLatestDay() dailyの最新日付を取得
*/
/*
 daily から最新の日付を取得する
*/
async function getLatestDay(colName){
    const client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = await client.db(dbName);
    const collection = await db.collection(colName);
    const d = await collection.find({}).sort({day:-1}).limit(1).toArray();
    client.close();
    const latestDay = d[0].day;
    console.log(latestDay);
}

/*
*/

/*
 dailyでのデータ追加２
 gcalデータも追加するとすると、追加するクエリーの日付データの確認、取得が必要
*/
async function getSpecificDay(colName, day){
    const client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = await client.db(dbName);
    const collection = await db.collection(colName);
    const d = await collection.find({day: day}).toArray();
    if(d[0] === ''){
        addNewDays
    }
    client.close();
    console.log(d);
}

/*
 同一日データのまとめ
*/
function mixin(dailys){
    var newd = {};
    newd._id = dailys[0]._id;
    newd.day = dailys[0].day;
    var text = '';
    dailys.forEach( (doc) => {
        text += doc.text + '\n\n';
    });

    return text;
}


/*
 daily jsonの追加
 すでにあるかチェック
 ある場合は先頭に追加する。

 param  : conName - collection name string
        : dayJson 
 var dayJson = 
{
    "_id" : ObjectId("5beae6e5bd2349393b58b115"),
    "day" : "2018-11-13",
    "text" : "\n22:08:10\nc\n\n22:08:07\nb\n\n22:07:59\na"
};
サーチで複数のデイデータが見つかった場合は先に、ミキシンする。
*/
async function addDayJson(colName, dayJson){
    const client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = await client.db(dbName);
    const collection = await db.collection(colName);
    var d = await collection.find({day: dayJson.day}).toArray();
    console.log('nagasa', d.length);
    var newd = {};
    if(d.length >= 1){
        //d = mixin(d);
        newd = { day: d[0].day, text: d[0].text};
        if(d.length > 1){
            var text = '';
            d.forEach( (doc) => {
                text += doc.text + '\n\n';
            });
            newd.text = text;
        }
        newd.text = dayJson.text + '\n' + newd.text;     // text mixin
        d.forEach( (doc) => {
            const idjson = {_id: new mongodb.ObjectID(doc._id)};
            collection.deleteOne(idjson);
        });
    }else if(d.length === 0){
        newd = dayJson;
    }
    const err = await collection.insert(newd);
    if(err){
        console.error(err.result);
    }
    client.close();
    //console.log(d);

}


/*
 daily update
*/
async function dailyUpdate(colName, json, readNum){ 
    const objectid = new mongodb.ObjectID(json.id);
    delete json.id;
    json._id = objectid;
    const client = await MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = client.db(dbName);
    const collection = db.collection(colName);
    const d = await collection.save(json);
    var docs = await collection.find({}).sort({day:-1}).limit(readNum).toArray();
    client.close();
    io.emit('dailyMemoGet', docs);
}
/*
 daily delete
*/
async function dailyDelete(colName, id, readNum){
    const idjson = {_id: new mongodb.ObjectID(id)};
    const client = await MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = client.db(dbName);
    const collection = db.collection(colName);
    const d = await collection.deleteOne(idjson);
    var docs = await collection.find({}).sort({day:-1}).limit(readNum).toArray();
    client.close();
    io.emit('dailyMemoGet', docs);
}
/*
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
*/

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
    },
    /*
     dailyから指定日データを検索する
    */
    getSpecificDay: (colName, day) => {
        getSpecificDay(colName, day);
    },
    /*
     dailyの追加
    */
    addDayJson: (colName, dayJson) => {
        addDayJson(colName, dayJson);
    },
    /*
     daily 更新
    */
    update: (colName, json, readNum) => {
        dailyUpdate(colName, json, readNum);
    },
    /*
     daily delete 
    */
    deletebyId: (colName, id, readNum) => {
        dailyDelete(colName, id, readNum);
    }
};


module.exports = mongoIfAsync;