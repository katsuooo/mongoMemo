/*
 mongo upsert test
 mongodb version 3.1.0

 upsertテストのため、初期dbをつくる
 再テストのためのDrop関数
*/


var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;
var fs = require('fs');
var CONFIG = require('../../config/config').CONFIG;

const MONGO_URL = CONFIG.mongodb.url + ':' + CONFIG.mongodb.port;
const dbName = CONFIG.mongodb.db;
const colName = 'upsertTest'



/*
 daily update
*/
async function dropDb(){
    const client = await MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = await client.db(dbName);
    const collection = await db.collection(colName);
    const d = await collection.drop();
    client.close();
}


var mongoDrop = {
    dropDb: () => {
        dropDb();
    }
}

module.exports = mongoDrop;