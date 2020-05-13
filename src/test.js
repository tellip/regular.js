const text_reg = require('./text_reg');

let {aliases: ra} = text_reg;

let s = 'asdf1234-_)(*';
let r = ra.plc(ra.p_om(ra.pm(
    'K', ra.pc_alnum
)), ra.p_zo(ra.pc('_'))).match(text_reg.String(s), 0, s.length);
console.log(r);
console.log(s.slice(r.begin, r.end));
console.log(r.children.map(({key, value}) => [key, s.slice(value.begin, value.end)]));