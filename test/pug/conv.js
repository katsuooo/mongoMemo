const pug = require('pug');
const fs = require('fs');
console.log('pug to html');
const html = pug.compileFile('panel.pug', {pretty:true});
console.log(html({
}));
fs.writeFileSync('h.html', html({}));