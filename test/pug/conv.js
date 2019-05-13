const pug = require('pug');
console.log('pug to html');
const html = pug.compileFile('cards.pug');
console.log(html({
}));