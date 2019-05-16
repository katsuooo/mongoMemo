/**
 * 190516
 * for panel, mongoif async
 */

var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;
var fs = require('fs');
var CONFIG = require('../config/config').CONFIG;

const MONGO_URL = CONFIG.mongodb.url + ':' + CONFIG.mongodb.port;
const dbName = CONFIG.mongodb.db;
const colName = 'panel'
/**
 * read all
 * 
 */
var readAll = async(colName, socket) => {
    let client;
    try{
        client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        const d = await collection.find({}).toArray();
        socket.emit('panelReadAll', d);
    }catch(error){
        console.log(error);
    } finally{
        client.close();
    }


    /*
    .then((d) => {
        socket.emit('panelReadAll', d);
    })
    .catch((e) => {
        console.log('error', e);
    });
    */
   /*
    socket.emitAsync('panelReadAll', d)
    .then((d) => {
        return d;
    }).catch((err) => {
        console.log(err);
    });
    */

    
    /*
    var rmongo = [];
    await collection.find({}).toArray()
    .then((d) => {
        client.close();
        console.log('d', d);
        //socket.emit('panelReadAll', d);
        rmongo = d;
    })
    .catch((error) => {
        console.log('error', error);
    });
    socket.emit('panelReadAll', rmongo);
    */

}


/**
 * mongoif panel main
 */
var mongoifPanel = {
    readAll: (colName, socket) => {
        readAll(colName, socket);
    }
}
module.exports = mongoifPanel;