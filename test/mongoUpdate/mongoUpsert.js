/*
 mongo upsert test
 mongodb version 3.1.0
*/


var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;
var fs = require('fs');
var CONFIG = require('../../config/config').CONFIG;

const MONGO_URL = CONFIG.mongodb.url + ':' + CONFIG.mongodb.port;
const dbName = CONFIG.mongodb.db;
const colName = 'upsertTest';


/*
 daily update
*/
async function testUpsert(colName, json){
    console.log('update', json);
    const objectid = new mongodb.ObjectID(json.id);
    delete json.id;
    const client = await MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = client.db(dbName);
    const collection = db.collection(colName);
    const d = collection.update({_id: objectid}, json);
}

/*
 daily update
 updateはなくなりsaveに
 _id:を含めると、存在すると追加、ないと新規でつくる

*/
async function upsert(){
    const client = await MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = await client.db(dbName);
    const collection = await db.collection(colName);
    var d = await collection.find({}).toArray();  // 既存データ
    console.log(d);
    d[0].age = '35';
    const x = await collection.save(d[0]);
    d = await collection.find({}).toArray();  // new データ
    console.log(d);
    d[0].age = '52';
    d = await collection.save(d[0])  // データ復旧
    client.close();
}

var mongoUpsert = {
    upsert: () => {
        upsert();
    }
}

module.exports = mongoUpsert;


