const text_reg = require('./text_reg');

let {aliases: ra} = text_reg;

let s = 'asdf1234-_)(*';
let r = ra.plc(ra.px_om(ra.pm(
    'K', ra.pc_alnum
)), ra.px_zo(ra.pc('_'))).match(text_reg.String(s), 0, s.length);
console.log(r.success);
console.log(s.slice(r.begin, r.end));
console.log(r.children.map(({key, value}) => [key, s.slice(value.begin, value.end)]));