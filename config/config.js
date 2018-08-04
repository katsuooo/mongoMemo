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
}catch (e) {
  console.log(e);
}

const MONGOINFO = CONFIG.mongodb;
const PGMEMOINFO = CONFIG.pgmemo;

module.exports = {
    CONFIG: CONFIG,
    MONGOINFO: MONGOINFO,
    PGMEMOINFO: PGMEMOINFO
}