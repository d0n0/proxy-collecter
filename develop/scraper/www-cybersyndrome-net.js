const cheerio = require('cheerio');
const fs = require('fs-extra');

const html = fs.readFileSync('./cybersyndrome.html', {encoding: 'utf-8'});
let $ =  cheerio.load(html);

const hoge = $('script[language]').html();
console.log(hoge);