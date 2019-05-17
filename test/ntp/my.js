/*
https://github.com/destinationstransfers/ntp
*/


/*
const NTPClient = require('@destinationstransfers/ntp');

async function my(){
const date = await NTPClient.getNetworkTime();
console.log(date) // 2017-09-20T15:29:09.443Z
}
my();





const { getNetworkTime } = require('@destinationstransfers/ntp');

async function my2(){
const date = await getNetworkTime({
  timeout : 10000, // timeout in ms, default is 10sec
  server : 'time.google.com', // ntp server address
  port : 123, // NTP server port
});
console.log(date);
}
my2();
*/



const { getNetworkTime } = require('@destinationstransfers/ntp');

async function myjp(){
const datex = await getNetworkTime({
  timeout : 10000, 			// timeout in ms, default is 10sec
  server : 'ntp.nict.jp', 	// ntp server address
  port : 123, 				// NTP server port
});
console.log(datex);
}
myjp();

