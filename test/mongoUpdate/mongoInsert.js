/*
 mongo upsert test
 mongodb version 3.1.0

 upsertテストのため、初期dbをつくる
*/


var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;
var fs = require('fs');
var CONFIG = require('../../config/config').CONFIG;

const MONGO_URL = CONFIG.mongodb.url + ':' + CONFIG.mongodb.port;
const dbName = CONFIG.mongodb.db;
const colName = 'upsertTest'

const myInfo = {name: 'katsuooo', age: '52'};

/*
 daily update
*/
async function genDb(){
    const client = await MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
    const db = client.db(dbName);
    const collection = db.collection(colName);
    const d = await collection.insert(myInfo);
    client.close();
}


var mongoInsert = {
    genDb: () => {
        genDb();
    }
}

module.exports = mongoInsert;