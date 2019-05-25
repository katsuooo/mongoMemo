/*
 panel data move to mongo/daily
*/
/**
 *  gen daily text from panels
 * @param {json} a : adata
 * @param {json} b : bdata
 */
function genPanelText(a, b){
    var text = '';
    const datetimeHead = '##### ';
    for (let i=0; i<8; i++){
        text += datetimeHead + a[i].datetiem + `\n`;
        text += a[i].text + '\n\n';
        text += datetimeHead + b[i].datetime + '\n';
        text += b[i].text + '\n\n';
    }
    return text;
}