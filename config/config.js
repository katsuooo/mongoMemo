/*
180712
memo configs

 read from memoConfig.yaml
*/

/*
from ./config/memoConfig.yaml
*/
var fs = require('fs');
var yaml = require('js-yaml');
var CONFIG = ''
try {
  CONFIG = yaml.safeLoad(fs.readFileSync('./config/memoConfig.yaml'));
  //CONFIG = yaml.safeLoad(fs.readFileSync('../../config/memoConfig.yaml'));
}catch (e) {
  console.log(e);
}

const MONGOINFO = CONFIG.mongodb;
const PGMEMOINFO = CONFIG.pgmemo;
/*
let doc = yaml.safeLoad(fs.readFileSync('./Settings.yml', 'utf8'));
doc.General.Greeting = newGreet;
fs.writeFile('./Settings.yml', yaml.safeDump(doc), (err) => {
    if (err) {
        console.log(err);
    }
});
*/
/**
 * 
 * @param {url: , port: } new_url 
 */
function writeNew(new_url){
  CONFIG.mongodb.url = 'mongodb://' + new_url.url;
  CONFIG.mongodb.port = new_url.port;
  fs.writeFile('./config/memoConfig.yaml', yaml.safeDump(CONFIG), (err) => {
    if (err) {
        console.log(err);
    }
  });
}
var mongoConfig = {
  write: (new_url) => {
    console.log('mongo_write', new_url);
    writeNew(new_url);
  }
}
module.exports = {
    CONFIG: CONFIG,
    MONGOINFO: MONGOINFO,
    PGMEMOINFO: PGMEMOINFO,
    mongoConfig
}