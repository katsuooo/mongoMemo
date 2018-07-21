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

try {
  const CONFIG = yaml.safeLoad(fs.readFileSync('./config/memoConfig.yaml'));
  //console.log(CONFIG);
  const MONGOHQ_URL = CONFIG.MONGO_URL;
  const dbName = CONFIG.MONGO_DB_NAME;
  const collectionName = CONFIG.MONGO_COLLECTION_NAME;  
}catch (e) {
  console.log(e);
}

/*
import memo interfaces
*/
var simpleMongo = require('./simpeleMongo');
var pgMongo = require('./pgMongo');


var mongoifMain = {

}

module.exports = mongoifMain;