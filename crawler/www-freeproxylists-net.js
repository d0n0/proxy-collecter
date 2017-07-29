const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const moment = require('moment');
const scraper = require('../scraper/www-freeproxylists-net.js');

// logger
const log4js = require('log4js');
log4js.configure({
  appenders: {
    stdout: { type: "stdout" },
    file: { type: "file", filename: `${__dirname}/../logs/system.log` }
  },
  categories: {
    default: {
      appenders: ["stdout", "file"],
      level: "all"
    }
  }
});
const networkLogger = log4js.getLogger('network');
const systemLogger = log4js.getLogger('system');

const date = moment().format('YYYY-MM-DD');
const time = moment().format('HH-mm-ss');
const baseArchiveDir = `${__dirname}/../archive/www-freeproxylists-net/${date}/${time}`;
fs.mkdirsSync(baseArchiveDir);

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const fetch = uri => {
  return new Promise(async (resolve, reject) => {
    const options = {
      uri,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Host': 'www.freeproxylists.net',
        'Referer': ' http://www.freeproxylists.net/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.8,ja;q=0.5', // avoid reCapture
        'Cookie': 'pv=4' // avoid reCapture
      },
      gzip: true
    }
    const html = await request(options);

    resolve(html);
  });
}

const crawler = async delay => {
  systemLogger.trace('start crawling in www.freeproxylists.net');

  let arr = [];
  for (let i = 1; true; i++) {

    const uri = `http://www.freeproxylists.net/?page=${i}`;
    systemLogger.trace(`processing ${uri}`);

    const html = await fetch(uri).catch(err => {
      networkLogger.error(err);
    });

    const $ = cheerio.load(html)

    if ($('noscript').length === 1) {
      const msg = 'Caught reCaptcha';
      systemLogger.warn(msg);
      throw new Error(msg);
    }

    const data = await scraper($);

    arr = [...arr, ...data];

    if (data.length === 0) {
      systemLogger.info('Complete scraping in www.freeproxylists.net');
      systemLogger.info(`get ${arr.length} items`);
      break;
    }

    // save html
    const htmlFilePath = `${baseArchiveDir}/page-${i}.html`;
    if (data.length !== 0 && htmlFilePath !== undefined) {
      fs.writeFile(htmlFilePath, html, err => {
        if (err) {
          systemLogger.error(err);
          throw err;
        }
      });
    }

    await sleep(delay);
  }

  // save json
  const jsonFilePath = `${baseArchiveDir}/list.json`;
  fs.writeFile(jsonFilePath, JSON.stringify(arr, null, "    "), err => {
    if (err) {
      systemLogger.error(err);
      throw err;
    }
  });

};

crawler(2000);
