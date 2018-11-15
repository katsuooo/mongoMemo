/*
 daily viewでデータ追加ボタンを押したときの動作のテスト
 dailyデータの最新日付を取得し、追加データの日付と比較。
 同一日の場合、元データにアペンド？
 時間逆順なので、現データのはじめに挿入する。
 これを保存。
 追加データの日付が新しい場合、新日付で保存
*/


var mongoifAsync = require('../../mongoif/mongoIfAsync');

/*
 最新日付データの取得
*/
/*
var colName = 'daily'
mongoifAsync.getLatestDay(colName);
*/

/*
 日付を指定してdailyデータを検索、取得
*/
var day = '2018-11-12';
var colName = 'daily';
//mongoifAsync.getSpecificDay(colName, day);

/*
 daily json sample
*/
/*
var dayJson = {
    "_id" : ObjectId("5beae6e5bd2349393b58b115"),
    "day" : "2018-11-13",
    "text" : "\n22:08:10\nc\n\n22:08:07\nb\n\n22:07:59\na"
};
*/
var dayJson = {
    "day" : "2018-11-14",
    "text" : "\n22:08:10\nc\n\n22:08:07\nb\n\n22:07:59\na"
};
mongoifAsync.addDayJson(colName, dayJson);