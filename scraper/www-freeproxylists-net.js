// www.freeproxylists.net
module.exports = $ => {
  return new Promise((resolve, reject) => {

    let data = [];
    for (let htmlClass of ['Even', 'Odd']) {
      $(`tr.${htmlClass}`).each((index, element) => {

        const code = $(element).find('script').html();

        if (code !== '') {  // 広告が挿入されてるダミータグを回避

          const tds = $(element).children();
          const encodedHtml = code.match(/^IPDecode\(\"(.*)\"\)/)[1];
          const decodedHtml = decodeURIComponent(encodedHtml);

          const ip = $(decodedHtml).text().trim();
          const port = tds.eq(1).text().trim();
          const protocol = tds.eq(2).text().trim();
          const anonymity = tds.eq(3).text().trim();
          const country = tds.eq(4).text().trim();
          const uptime = tds.eq(7).text().trim();

          const info = { ip, port, protocol, anonymity, country, uptime };
          data.push(info);
        }
      });

      resolve(data);
    }
  });
}