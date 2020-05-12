const text_regexp = require('./text_regexp');

let ra = text_regexp.aliases;

console.log(ra.pc_ascii.match("我asdf1234", 0, 8));