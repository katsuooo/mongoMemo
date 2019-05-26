/**
 * 190516
 * for panel, mongoif async
 */

var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;
var fs = require('fs');
var CONFIG = require('../config/config').CONFIG;
var moment = require('moment');
//var panel = require('panel');
const MONGO_URL = CONFIG.mongodb.url + ':' + CONFIG.mongodb.port;
const dbName = CONFIG.mongodb.db;
const colName = 'panel'



/**
 * mongo panel data
 *  datetime: string
 *  title     string
 *  panel: string[16][]
 * 
 */
var pnaelh = [];
for (let i=0; i<16; i++){
    var hai = [];
    var datetime = moment().format().split('+')[0];
    var p_title = '';
    pnaelh.push(JSON.parse(JSON.stringify({p_title: p_title, datetime: datetime, text: hai})));
}
var nowtime = moment().format().split('+')[0];
//nowtime = nowtime.format({formatWithDeviceTimezone: true});
console.log(nowtime);
var paneld = {
    datetime: nowtime,
    title: 'current',
    panel: pnaelh
}
console.log(paneld);
console.log()

function getCurrent(d){
    var current = {};
    d.forEach((x) => {
        if(x.title === 'current'){
            current = x;
        }
    });
    return current;
}
/**
 * read mongo's check
 * @param {json} d 
 */
function checkpd(d){
    const target = getCurrent(d);
    if (target === {}){
        console.log('no current');
        return false;
    }
    if (('title' in target)&('datetime' in target)){
        console.log('data true');
        return true;
    }
    console.log('data false');
    return false;
}

/**
 * 
 * @param {string} colName 
 * @param {json} jd 
 */
var write = async(colName, jd) => {
    let client;
    try{
        client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        let docs = await collection.insert(jd);
        const jnum = Object.keys(docs).length;
        console.log('just inserted', jnum, ' new documents!');
    }catch(error){
        console.log(error);
    } finally{
        client.close();
    }
}
/**
 * 
 * @param {string} colName 
 * @param {json} jd 
 */
var writeId = ''
var write_no_close = async(collection, jd) => {
    let mongoid;
    try{
        let docs = await collection.insert(jd);
        console.log(docs['ops'][0]['_id']);
        writeId = docs['ops'][0]['_id'];
        const jnum = Object.keys(docs).length;
        console.log('just inserted', jnum, ' new documents!');
    }catch(error){
        console.log(error);
    }finally{
    }
}

/**
 * read all
 * @param {*} colName 
 * @param {*} socket 
 */
var readAll = async(colName, socket) => {
    let client;
    try{
        client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        let d = await collection.find({title:'current'}).toArray();
        if(!checkpd(d)){
            d = paneld;
            write_no_close(collection, d);
            d._id = writeId;
        }
        socket.emit('panelReadAll', d);
    }catch(error){
        console.log(error);
    } finally{
        client.close();
    }
}


/**
 * upsdate
 * @param {string} colName 
 * @param {pointer} socket 
 * 
 * 
 * {
 *   _id:
 *   name:
 *   date:
 *   panel: [
 *     {p_title:'', date:'', text:''},
 *     {},
 *     ....
 *   ]
 * }
 *                                                          | hairetsu_number
 * db.test.update({"_id": ObjectId("....")}, {$set: {"panel.1.text": "mojio"}})
 * 
 * para :{ index: 0, textarea: 'xa', _id: '5cdf747e75ad183a94429908' }
 * 
 */
var updateTime = ''
var update = async(colName, socket, para) => {
    const objectid = new mongodb.ObjectID(para._id);
    para.datetime = moment().format().split('+')[0];
    try{
        client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        const setParamDatetime = 'panel.' + String(para.index) + '.datetime';
        const setParamText = 'panel.' + String(para.index) + '.text';
        let docs = await collection.update({_id: objectid}, {$set: {[setParamDatetime]: para.datetime, [setParamText]: para.textarea.split('\n')}}, {upsert: true});
        const jnum = Object.keys(docs).length;
        console.log('just update', jnum, para._id, ' documents!');
        updateTime = para.datetime;
        socket.emit('update', {_id: para._id, index: para.index, datetime: para.datetime});
    }catch(error){
        console.log(error);
    } finally{
        client.close();
    }
}
/**
 * current data clear 
 * @param {*} colName 
 * @param {*} socket 
 */
/*
{ datetime: '2019-05-18T14:31:17+09:00',
  title: 'current',
  panel:
   [ { p_title: '', datetime: '2019-05-22T22:24:07', text: [] },
      ... * 15
   ] }
*/
var clearCurrent = async(colName, socket) => {
    const cls_time = moment().format().split('+')[0];
    const cls_panel = [];
    for (let i=0; i<16; i++){
        cls_panel.push({ p_title: '', datetime: cls_time, text: [] });
    }
    try{
        client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        //let docs = await collection.update({title: 'current'}, {$set: {datetime: cls_time, panel: cls_panel} });
        let docs1 = await collection.update({title: 'current'}, {$set: {datetime: cls_time} });
        let docs2 = await collection.update({title: 'current'}, {$set: {panel: cls_panel} });        
    }catch(error){
        console.log(error);
    } finally{
        //client.close();
        readAll(colName, socket);
    }
}
/**
 * current >>> timestump title data
 * @param {*} colName 
 */

var saveCurrent = async(d, colName, socket) => {
    let client;
    let newd = d;

    newd.title = moment().format().split('+')[0];
    console.log('title', newd.title);
    try{
        client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        if (typeof(newd['_id']) !== undefined){
            console.log('newd._id', newd._id);
            delete newd._id;
        }
        console.log('data keys',newd);
        let doc = await collection.insert(newd);
    }catch(error){
        console.log(error);
    } finally{
        //client.close();
        //saveCurrent()
        console.log('save end');
        clearCurrent(colName, socket);
    }
}

/**
 * current data save and clear
 * save is already done to daily, so clear only do.
 * @param {*} socket 
 * 
 */
var saveAndClear = async(colName, socket) => {
    let client;
    let d;
    try{
        client = await mongodb.MongoClient.connect(MONGO_URL, {useNewUrlParser:true});
        const db = await client.db(dbName);
        const collection = await db.collection(colName);
        d = await collection.find({title:'current'}).toArray();
        /*
        if(!checkpd(d)){
            d = paneld;
            write_no_close(collection, d);
            d._id = writeId;
        }
        */
    }catch(error){
        console.log(error);
    } finally{
        saveCurrent(d[0], colName, socket);
    }
}

/**
 * mongoif panel main
 */
var mongoifPanel = {
    readAll: (colName, socket) => {
        readAll(colName, socket);
    },
    update: (colName, socket, para) => {
        update(colName, socket, para);
    },
    saveAndClear: (colName, socket) => {
        saveAndClear(colName, socket);
    }
}
module.exports = mongoifPanel;