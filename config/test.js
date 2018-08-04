/*

 yaml test


*/

/*
install
yarn add js-yaml
*/

var yaml = require('js-yaml');

/*
try{
  var doc = yaml.safeLoad(fs.)
}catch(e){

}
*/

/*
yaml.safeLoadAll(Date, function(doc){

});
*/

/*
yarn add fs
fsからyamlファイルをよむ。
doc はjson形式オブジェクトとなる。
*/
var fs = require('fs');
try{
  var doc = yaml.safeLoad(fs.readFileSync('./memoConfig.yaml', 'utf8'));
}catch(e){
  console.log(e);
}
