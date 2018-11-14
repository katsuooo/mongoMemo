/*
 daily viewでデータ追加ボタンを押したときの動作のテスト
 dailyデータの最新日付を取得し、追加データの日付と比較。
 同一日の場合、元データにアペンド？
 時間逆順なので、現データのはじめに挿入する。
 これを保存。
 追加データの日付が新しい場合、新日付で保存
*/


var mongoifAsync = require('../../mongoif/mongoIfAsync');


mongoifAsync.getLatestDay();