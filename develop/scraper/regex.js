const fs = require('fs-extra');
const text = fs.readFileSync('./aaa.txt', {encoding: 'utf-8'});

let as = text.match(/as=\[(.*?)\];/)[1].split(',');
const ps = text.match(/ps=\[(.*?)\];/)[1].split(',');
const n = eval(text.match(/n=(.*?);/)[1]);
as = as.concat(as.splice(0, n));

let addrs = [];
for (let i = 0; i < as.length; i++) {
  const idx = Math.floor(i / 4);
  if (i % 4 === 0) {
    addrs[idx] = as[i] + ".";
  } else if (i % 4 === 3) {
    addrs[idx] += as[i];
  } else {
    addrs[idx] += as[i] + ".";
  }
}

for (let i = 0; i < addrs.length; i++) {
  console.log(`${addrs[i]}:${ps[i]}`);
}