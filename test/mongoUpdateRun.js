/*
 mongo update test
*/

/*
 test用dbの作成
*/
var mongoInsert = require('./mongoUpdate/mongoInsert.js');
var mongoDrop = require('./mongoUpdate/mongoDrop.js');
var mongoRead = require('./mongoUpdate/mongoRead.js');
//mongoDrop.dropDb();
//mongoInsert.genDb();    // db=upsertTest, const myInfo = {name: 'katsuooo', age: '52'}; insert
//mongoRead.read();




var mongoUpsert = require('./mongoUpdate/mongoUpsert.js');
/*
 upsertはなくなりsaveになってる？
*/
mongoUpsert.upsert();
/*
save()をつかってテスト
_idフィールドをみて、あれば更新、なければ新規に_idを作成するらしい。
テストOK
チュートリアルでは、save({_id:xxxx, user: 'David},{w:1})
とwriteフラグのようなものがついているが、なくても動作はしている。
*/