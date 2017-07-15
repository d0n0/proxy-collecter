// ローカルにあるhtmlファイルをcheerioでスクレイピングする際のサンプル

const fs = require('fs');
const cheerio = require('cheerio');
const www_freeproxylists_net = require('./scraper.js').www_freeproxylists_net;

const html = fs.readFileSync('./sample.html', { encoding: 'utf-8' });
let $ = cheerio.load(html);

www_freeproxylists_net($, data => {
  console.log(data)
});