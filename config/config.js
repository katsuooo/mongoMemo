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
  //console.log(CONFIG);
}catch (e) {
  console.log(e);
}

var MONGOINFO = CONFIG.mongodb;
var PGMEMOINFO = CONFIG.pgmemo;

module.exports = {
    CONFIG: CONFIG,
    MONGOINFO: MONGOINFO,
    PGMEMOINFO: PGMEMOINFO
}